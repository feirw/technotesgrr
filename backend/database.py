import os
import psycopg2
from psycopg2 import pool as pg_pool
from psycopg2.extras import RealDictCursor, Json
from contextlib import contextmanager
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Thread-safe pool: αποφεύγει νέο TCP+SSL handshake σε κάθε αίτηση (μεγάλο κέρδος latency υπό φόρτο).
_db_pool: Optional[pg_pool.ThreadedConnectionPool] = None


def _pool_min_max() -> Tuple[int, int]:
    try:
        mn = max(1, int(os.getenv("DB_POOL_MIN", "1")))
        mx = max(mn, int(os.getenv("DB_POOL_MAX", "20")))
        return mn, mx
    except ValueError:
        return 1, 20


def _ensure_pool() -> pg_pool.ThreadedConnectionPool:
    global _db_pool
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is not configured.")
    if _db_pool is None:
        mn, mx = _pool_min_max()
        _db_pool = pg_pool.ThreadedConnectionPool(mn, mx, DATABASE_URL)
    return _db_pool


def close_db_pool() -> None:
    """Κλείσιμο pool στο shutdown (π.χ. lifespan)."""
    global _db_pool
    if _db_pool is not None:
        _db_pool.closeall()
        _db_pool = None


@contextmanager
def get_db_connection():
    """Παίρνει σύνδεση από pool και την επιστρέφει στο τέλος."""
    p = _ensure_pool()
    conn = p.getconn()
    try:
        yield conn
    except Exception:
        # Never return an aborted transaction state back to the pool.
        try:
            conn.rollback()
        except Exception:
            pass
        raise
    finally:
        p.putconn(conn)


def db_ping() -> bool:
    """Lightweight DB readiness probe."""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    return True

def init_database():
    """
    Ensure required runtime tables exist.
    We keep this lightweight and idempotent so deployments don't fail
    when a migration was missed.
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # Core read-path indexes για ταχύτατο ORDER BY chapter,id σε quiz/flashcards.
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_quizzes_chapter_id
                ON quizzes (chapter, id);
                """
            )
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_flashcards_chapter_id
                ON flashcards (chapter, id);
                """
            )
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS password_resets (
                    token TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                    expires_at TIMESTAMPTZ NOT NULL,
                    used_at TIMESTAMPTZ
                );
                """
            )
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS user_progress (
                    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
                    key TEXT NOT NULL,
                    data JSONB NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    PRIMARY KEY (user_id, key)
                );
                """
            )
        conn.commit()
    print("Connected to Supabase PostgreSQL (runtime tables ensured)")


def create_user(email: str, password_hash: str) -> Optional[Dict]:
    """Δημιουργεί χρήστη. Επιστρέφει None αν το email υπάρχει ήδη."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            try:
                cursor.execute(
                    """
                    INSERT INTO users (email, password_hash)
                    VALUES (%s, %s)
                    RETURNING id, email, created_at
                    """,
                    (email.lower(), password_hash),
                )
                user = cursor.fetchone()
            except psycopg2.errors.UniqueViolation:
                conn.rollback()
                return None
        conn.commit()
        return dict(user)


def get_user_by_email(email: str) -> Optional[Dict]:
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT id, email, password_hash, created_at FROM users WHERE email = %s",
                (email.lower(),),
            )
            row = cursor.fetchone()
            return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[Dict]:
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT id, email, created_at FROM users WHERE id = %s", (user_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None


def update_user_password(user_id: int, password_hash: str) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE users SET password_hash = %s WHERE id = %s",
                (password_hash, user_id),
            )
        conn.commit()


def create_password_reset(user_id: int, token: str, expires_at: datetime) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO password_resets (token, user_id, expires_at)
                VALUES (%s, %s, %s)
                """,
                (token, user_id, expires_at),
            )
        conn.commit()


def get_valid_password_reset(token: str) -> Optional[Dict]:
    """Επιστρέφει το reset row μόνο αν υπάρχει, δεν έχει χρησιμοποιηθεί και δεν έχει λήξει."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT token, user_id, expires_at, used_at
                FROM password_resets
                WHERE token = %s AND used_at IS NULL AND expires_at > NOW()
                """,
                (token,),
            )
            row = cursor.fetchone()
            return dict(row) if row else None


def mark_password_reset_used(token: str) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE password_resets SET used_at = NOW() WHERE token = %s", (token,)
            )
        conn.commit()


def get_user_progress(user_id: int, key: str) -> Optional[Dict]:
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT data, updated_at FROM user_progress WHERE user_id = %s AND key = %s",
                (user_id, key),
            )
            row = cursor.fetchone()
            return dict(row) if row else None


def upsert_user_progress(user_id: int, key: str, data: Any) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO user_progress (user_id, key, data, updated_at)
                VALUES (%s, %s, %s, NOW())
                ON CONFLICT (user_id, key)
                DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
                """,
                (user_id, key, Json(data)),
            )
        conn.commit()

def update_leaderboard(nickname: str, points_earned: int):
    """Update or create leaderboard entry for a user"""
    current_month = datetime.now().strftime("%Y-%m")

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # Upsert logic (Insert or Update)
            cursor.execute(
                """
                INSERT INTO leaderboard (nickname, total_points, month)
                VALUES (%s, %s, %s)
                ON CONFLICT (nickname, month) 
                DO UPDATE SET 
                    total_points = leaderboard.total_points + EXCLUDED.total_points,
                    updated_at = NOW();
                """,
                (nickname, points_earned, current_month),
            )
        conn.commit()

def get_leaderboard_data(month: str = None):
    """Get leaderboard data for a specific month"""
    if month is None:
        month = datetime.now().strftime("%Y-%m")

    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT nickname, total_points, month
                FROM leaderboard 
                WHERE month = %s
                ORDER BY total_points DESC
                LIMIT 10
                """,
                (month,),
            )
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

def record_quiz_submission(nickname: str, question_id: str, selected_answer: str, is_correct: bool, points_earned: int):
    """Record a quiz submission"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO quiz_submissions 
                (nickname, question_id, selected_answer, is_correct, points_earned)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (nickname, question_id, selected_answer, is_correct, points_earned),
            )
        conn.commit()

def get_quizzes_from_db():
    """Get all quizzes from database"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM quizzes ORDER BY chapter, id")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

def get_quizzes_page(limit: int = 200, offset: int = 0, chapter: str = None):
    """Fetch paginated quiz questions with limit+1 (χωρίς COUNT(*))."""
    fetch_n = limit + 1
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            if chapter is not None:
                cursor.execute(
                    """
                    SELECT *
                    FROM quizzes
                    WHERE CAST(chapter AS TEXT) = %s
                    ORDER BY chapter, id
                    LIMIT %s OFFSET %s
                    """,
                    (str(chapter), fetch_n, offset),
                )
            else:
                cursor.execute(
                    """
                    SELECT *
                    FROM quizzes
                    ORDER BY chapter, id
                    LIMIT %s OFFSET %s
                    """,
                    (fetch_n, offset),
                )
            rows = cursor.fetchall()

    has_more = len(rows) > limit
    if has_more:
        rows = rows[:limit]
    return [dict(row) for row in rows], has_more

def get_flashcards_from_db():
    """Get all flashcards from database"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM flashcards ORDER BY chapter, id")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

def get_flashcards_page(limit: int = 1000, offset: int = 0, chapter: str = None):
    """Fetch paginated flashcards with limit+1 (χωρίς COUNT(*))."""
    fetch_n = limit + 1
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            if chapter is not None:
                cursor.execute(
                    """
                    SELECT *
                    FROM flashcards
                    WHERE CAST(chapter AS TEXT) = %s
                    ORDER BY chapter, id
                    LIMIT %s OFFSET %s
                    """,
                    (str(chapter), fetch_n, offset),
                )
            else:
                cursor.execute(
                    """
                    SELECT *
                    FROM flashcards
                    ORDER BY chapter, id
                    LIMIT %s OFFSET %s
                    """,
                    (fetch_n, offset),
                )
            rows = cursor.fetchall()

    has_more = len(rows) > limit
    if has_more:
        rows = rows[:limit]
    return [dict(row) for row in rows], has_more

def get_quiz_by_id(question_id: str):
    """Get a specific quiz question by ID"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM quizzes WHERE id = %s", (question_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

def save_contact_submission(first_name: str, last_name: str, email: str, message: str):
    """Save a contact form submission to the database"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO contact_submissions 
                (first_name, last_name, email, message)
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (first_name, last_name, email, message),
            )
            submission_id = cursor.fetchone()[0]
        conn.commit()
        return submission_id

def get_category_lists():
    """Quiz + flashcard categories σε μία σύνδεση (χρησιμοποιείται από /api/categories)."""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT category FROM quizzes ORDER BY category")
            quiz_cats = [row[0] for row in cursor.fetchall()]
            cursor.execute("SELECT DISTINCT category FROM flashcards ORDER BY category")
            flash_cats = [row[0] for row in cursor.fetchall()]
    return quiz_cats, flash_cats
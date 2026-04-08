import os
import json
import psycopg2
from psycopg2 import pool as pg_pool
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from datetime import datetime
from typing import Dict, List, Optional, Tuple
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
    finally:
        p.putconn(conn)

def init_database():
    """
    Ensure required runtime tables exist.
    We keep this lightweight and idempotent so deployments don't fail
    when a migration was missed.
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS community_posts (
                    id BIGSERIAL PRIMARY KEY,
                    user_id UUID NOT NULL,
                    username TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """
            )
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_community_posts_created_at
                ON community_posts (created_at DESC);
                """
            )
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_community_posts_user_id
                ON community_posts (user_id);
                """
            )
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS community_replies (
                    id BIGSERIAL PRIMARY KEY,
                    post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
                    user_id UUID NOT NULL,
                    username TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                """
            )
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_community_replies_post_id_created_at
                ON community_replies (post_id, created_at ASC);
                """
            )
            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_community_replies_user_id
                ON community_replies (user_id);
                """
            )
        conn.commit()
    print("Connected to Supabase PostgreSQL (runtime tables ensured)")

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
    """Fetch paginated quiz questions directly from DB for better performance."""
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
                    (str(chapter), limit, offset),
                )
                rows = cursor.fetchall()
                cursor.execute(
                    "SELECT COUNT(*) AS count FROM quizzes WHERE CAST(chapter AS TEXT) = %s",
                    (str(chapter),),
                )
            else:
                cursor.execute(
                    """
                    SELECT *
                    FROM quizzes
                    ORDER BY chapter, id
                    LIMIT %s OFFSET %s
                    """,
                    (limit, offset),
                )
                rows = cursor.fetchall()
                cursor.execute("SELECT COUNT(*) AS count FROM quizzes")

            total = int(cursor.fetchone()["count"])
            return [dict(row) for row in rows], total

def get_flashcards_from_db():
    """Get all flashcards from database"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM flashcards ORDER BY chapter, id")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

def get_flashcards_page(limit: int = 1000, offset: int = 0, chapter: str = None):
    """Fetch paginated flashcards directly from DB."""
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
                    (str(chapter), limit, offset),
                )
                rows = cursor.fetchall()
                cursor.execute(
                    "SELECT COUNT(*) AS count FROM flashcards WHERE CAST(chapter AS TEXT) = %s",
                    (str(chapter),),
                )
            else:
                cursor.execute(
                    """
                    SELECT *
                    FROM flashcards
                    ORDER BY chapter, id
                    LIMIT %s OFFSET %s
                    """,
                    (limit, offset),
                )
                rows = cursor.fetchall()
                cursor.execute("SELECT COUNT(*) AS count FROM flashcards")

            total = int(cursor.fetchone()["count"])
            return [dict(row) for row in rows], total

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

# --- ADMIN FUNCTIONS ---

def is_user_admin(user_id: str):
    """Checks if a user has the 'admin' role in the profiles table"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT role FROM profiles WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            # Check if result exists and role is admin
            if result and result[0] == 'admin':
                return True
            return False

def get_admin_stats():
    """Fetches high-level stats for the admin dashboard (1 round-trip για counts)."""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    (SELECT COUNT(*) FROM profiles) AS user_count,
                    (SELECT COUNT(*) FROM quiz_submissions) AS submission_count,
                    (SELECT COUNT(*) FROM quizzes) AS question_count
                """
            )
            counts = cursor.fetchone()
            user_count = int(counts[0])
            submission_count = int(counts[1])
            question_count = int(counts[2])

            cursor.execute(
                """
                SELECT nickname, points_earned, submitted_at, question_id
                FROM quiz_submissions
                ORDER BY submitted_at DESC
                LIMIT 5
                """
            )
            recent_rows = cursor.fetchall()
            recent_activity = [
                {
                    "nickname": row[0],
                    "points_earned": row[1],
                    "submitted_at": row[2],
                    "question_id": row[3],
                }
                for row in recent_rows
            ]

            return {
                "total_users": user_count,
                "total_submissions": submission_count,
                "total_questions": question_count,
                "recent_activity": recent_activity,
            }


def get_category_lists():
    """Quiz + flashcard categories σε μία σύνδεση (χρησιμοποιείται από /api/categories)."""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT category FROM quizzes ORDER BY category")
            quiz_cats = [row[0] for row in cursor.fetchall()]
            cursor.execute("SELECT DISTINCT category FROM flashcards ORDER BY category")
            flash_cats = [row[0] for row in cursor.fetchall()]
    return quiz_cats, flash_cats

def get_admin_users(limit: int = 50, offset: int = 0):
    """Fetch paginated users for admin panel."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT id, username, email, role, created_at
                FROM profiles
                ORDER BY created_at DESC NULLS LAST
                LIMIT %s OFFSET %s
                """,
                (limit, offset),
            )
            rows = cursor.fetchall()
            cursor.execute("SELECT COUNT(*) AS count FROM profiles")
            total = cursor.fetchone()["count"]
            return [dict(r) for r in rows], int(total)

def save_career_orientation_result(user_id: str, answers: dict, results: dict):
    """
    Save career orientation (prosanatolismos) results to database.
    
    Args:
        user_id: The user's ID from Supabase auth
        answers: Dictionary mapping question IDs to scores (1-5)
        results: Dictionary containing calculated results:
            - final_scores: Dict of category scores
            - top_category: The top scoring category
            - sorted_scores: List of sorted category scores
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # Use JSONB for flexible storage of answers and results
            cursor.execute(
                """
                INSERT INTO career_orientation_results 
                (user_id, answers, final_scores, top_category, sorted_scores, completed_at)
                VALUES (%s, %s::jsonb, %s::jsonb, %s, %s::jsonb, NOW())
                ON CONFLICT (user_id) 
                DO UPDATE SET 
                    answers = EXCLUDED.answers,
                    final_scores = EXCLUDED.final_scores,
                    top_category = EXCLUDED.top_category,
                    sorted_scores = EXCLUDED.sorted_scores,
                    completed_at = NOW()
                RETURNING id
                """,
                (
                    user_id,
                    json.dumps(answers),
                    json.dumps(results.get('final_scores', {})),
                    results.get('top_category'),
                    json.dumps(results.get('sorted_scores', [])),
                ),
            )
            result_id = cursor.fetchone()[0]
        conn.commit()
        return result_id

def get_career_orientation_result(user_id: str):
    """
    Get the latest career orientation result for a user.
    
    Returns:
        Dictionary with user's career orientation results or None if not found
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT id, answers, final_scores, top_category, sorted_scores, completed_at
                FROM career_orientation_results
                WHERE user_id = %s
                ORDER BY completed_at DESC
                LIMIT 1
                """,
                (user_id,),
            )
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None


def create_community_post(user_id: str, username: str, content: str):
    """Create a new community forum post."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT INTO community_posts (user_id, username, content)
                VALUES (%s, %s, %s)
                RETURNING id, user_id, username, content, created_at
                """,
                (user_id, username, content),
            )
            row = cursor.fetchone()
        conn.commit()
        return dict(row)


def get_community_posts(limit: int = 30, offset: int = 0):
    """
    Posts + replies σε ένα round-trip (χωρίς COUNT(*) για γρήγορο pagination).
    Φέρνουμε limit+1 γραμμές για να υπολογίσουμε has_more χωρίς επιπλέον query.
    """
    fetch_n = limit + 1
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                WITH page AS (
                    SELECT id, user_id, username, content, created_at
                    FROM community_posts
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s
                )
                SELECT
                    p.id,
                    p.user_id,
                    p.username,
                    p.content,
                    p.created_at,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', r.id,
                                'post_id', r.post_id,
                                'user_id', r.user_id,
                                'username', r.username,
                                'content', r.content,
                                'created_at', r.created_at
                            )
                            ORDER BY r.created_at ASC
                        ) FILTER (WHERE r.id IS NOT NULL),
                        '[]'::json
                    ) AS replies
                FROM page p
                LEFT JOIN community_replies r ON r.post_id = p.id
                GROUP BY p.id, p.user_id, p.username, p.content, p.created_at
                ORDER BY p.created_at DESC
                """,
                (fetch_n, offset),
            )
            rows = cursor.fetchall()

    has_more = len(rows) > limit
    if has_more:
        rows = rows[:limit]

    posts: List[dict] = []
    for r in rows:
        row = dict(r)
        rep = row.get("replies")
        if isinstance(rep, str):
            rep = json.loads(rep)
        if rep is None:
            rep = []
        row["replies"] = rep
        posts.append(row)

    return posts, has_more


def create_community_reply(post_id: int, user_id: str, username: str, content: str):
    """Create a reply under an existing community post."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT id FROM community_posts WHERE id = %s", (post_id,))
            post_row = cursor.fetchone()
            if not post_row:
                raise ValueError("POST_NOT_FOUND")

            cursor.execute(
                """
                INSERT INTO community_replies (post_id, user_id, username, content)
                VALUES (%s, %s, %s, %s)
                RETURNING id, post_id, user_id, username, content, created_at
                """,
                (post_id, user_id, username, content),
            )
            row = cursor.fetchone()
        conn.commit()
        return dict(row)


def delete_community_post(post_id: int, requester_user_id: str, requester_is_admin: bool = False):
    """
    Delete a community post if requester is owner or admin.
    Returns True when deleted, False if post does not exist.
    Raises PermissionError when user is not allowed.
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT id, user_id FROM community_posts WHERE id = %s",
                (post_id,),
            )
            row = cursor.fetchone()
            if not row:
                return False

            owner_id = str(row["user_id"])
            if not requester_is_admin and owner_id != str(requester_user_id):
                raise PermissionError("Not allowed to delete this post.")

            cursor.execute("DELETE FROM community_posts WHERE id = %s", (post_id,))
        conn.commit()
        return True


def get_username_by_user_id(user_id: str):
    """Fetch username from profiles table for a specific user."""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT username FROM profiles WHERE id = %s", (user_id,))
                row = cursor.fetchone()
                if row and row[0]:
                    return str(row[0])
                return None
    except Exception:
        # Profiles table missing or transient DB error — forum still works with metadata fallback.
        return None
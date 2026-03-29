import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

@contextmanager
def get_db_connection():
    """Context manager for Supabase PostgreSQL connections"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        yield conn
    finally:
        conn.close()

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

def get_flashcards_from_db():
    """Get all flashcards from database"""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM flashcards ORDER BY chapter, id")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

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
    """Fetches high-level stats for the admin dashboard"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # 1. Count Users (from profiles table)
            cursor.execute("SELECT COUNT(*) FROM profiles")
            user_count = cursor.fetchone()[0]

            # 2. Count Total Submissions
            cursor.execute("SELECT COUNT(*) FROM quiz_submissions")
            submission_count = cursor.fetchone()[0]

            # 3. Count Total Questions
            cursor.execute("SELECT COUNT(*) FROM quizzes")
            question_count = cursor.fetchone()[0]

            # 4. Recent Activity (Last 5 submissions)
            cursor.execute("""
                SELECT nickname, points_earned, submitted_at, question_id 
                FROM quiz_submissions 
                ORDER BY submitted_at DESC 
                LIMIT 5
            """)
            # Convert tuples to dicts manually since we aren't using RealDictCursor here 
            # or rely on logic in server.py. Let's use list comprehension for safety.
            recent_rows = cursor.fetchall()
            recent_activity = [
                {
                    "nickname": row[0],
                    "points_earned": row[1],
                    "submitted_at": row[2],
                    "question_id": row[3]
                } 
                for row in recent_rows
            ]

            return {
                "total_users": user_count,
                "total_submissions": submission_count,
                "total_questions": question_count,
                "recent_activity": recent_activity
            }

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
    """Fetch community posts with pagination."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT id, user_id, username, content, created_at
                FROM community_posts
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """,
                (limit, offset),
            )
            rows = cursor.fetchall()
            cursor.execute("SELECT COUNT(*) FROM community_posts")
            total = cursor.fetchone()["count"]
            return [dict(r) for r in rows], int(total)


def get_username_by_user_id(user_id: str):
    """Fetch username from profiles table for a specific user."""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT username FROM profiles WHERE id = %s", (user_id,))
            row = cursor.fetchone()
            if row and row[0]:
                return str(row[0])
            return None
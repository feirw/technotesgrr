import os
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
    """Tables are managed via Supabase SQL Editor now."""
    print("Connected to Supabase PostgreSQL")

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
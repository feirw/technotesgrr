import sqlite3
from contextlib import contextmanager
import os
from datetime import datetime

DATABASE_PATH = "leaderboard.db"


def init_database():
    """Initialize the SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Create leaderboard table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT NOT NULL,
            total_points INTEGER NOT NULL DEFAULT 0,
            month TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(nickname, month)
        )
    """
    )

    # Create quiz_submissions table for tracking
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS quiz_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT NOT NULL,
            question_id TEXT NOT NULL,
            selected_answer TEXT NOT NULL,
            is_correct BOOLEAN NOT NULL,
            points_earned INTEGER NOT NULL DEFAULT 0,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    # Create quizzes table to store quiz questions
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS quizzes (
            id TEXT PRIMARY KEY,
            question TEXT NOT NULL,
            answers TEXT NOT NULL,
            category TEXT NOT NULL,
            chapter TEXT NOT NULL,
            source_file TEXT NOT NULL,
            points INTEGER DEFAULT 10,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    # Create flashcards table to store flashcard data
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS flashcards (
            id TEXT PRIMARY KEY,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            category TEXT NOT NULL,
            chapter TEXT NOT NULL,
            source_file TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    # Create contact_submissions table for contact form data
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    conn.commit()
    conn.close()


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # This allows dict-like access to rows
    try:
        yield conn
    finally:
        conn.close()


def update_leaderboard(nickname: str, points_earned: int):
    """Update or create leaderboard entry for a user"""
    current_month = datetime.now().strftime("%Y-%m")

    with get_db_connection() as conn:
        cursor = conn.cursor()

        # Try to update existing entry
        cursor.execute(
            """
            UPDATE leaderboard 
            SET total_points = total_points + ?, 
                updated_at = CURRENT_TIMESTAMP
            WHERE nickname = ? AND month = ?
        """,
            (points_earned, nickname, current_month),
        )

        # If no rows were updated, insert new entry
        if cursor.rowcount == 0:
            cursor.execute(
                """
                INSERT INTO leaderboard (nickname, total_points, month)
                VALUES (?, ?, ?)
            """,
                (nickname, points_earned, current_month),
            )

        conn.commit()


def get_leaderboard_data(month: str = None):
    """Get leaderboard data for a specific month"""
    if month is None:
        month = datetime.now().strftime("%Y-%m")

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT nickname, total_points, month
            FROM leaderboard 
            WHERE month = ?
            ORDER BY total_points DESC
            LIMIT 10
        """,
            (month,),
        )

        rows = cursor.fetchall()
        return [dict(row) for row in rows]


def record_quiz_submission(
    nickname: str,
    question_id: str,
    selected_answer: str,
    is_correct: bool,
    points_earned: int,
):
    """Record a quiz submission"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO quiz_submissions 
            (nickname, question_id, selected_answer, is_correct, points_earned)
            VALUES (?, ?, ?, ?, ?)
        """,
            (nickname, question_id, selected_answer, is_correct, points_earned),
        )
        conn.commit()


def get_quizzes_from_db():
    """Get all quizzes from database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM quizzes ORDER BY chapter, id")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]


def get_flashcards_from_db():
    """Get all flashcards from database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM flashcards ORDER BY chapter, id")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]


def get_quiz_by_id(question_id: str):
    """Get a specific quiz question by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM quizzes WHERE id = ?", (question_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def save_contact_submission(first_name: str, last_name: str, email: str, message: str):
    """Save a contact form submission to the database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO contact_submissions 
            (first_name, last_name, email, message)
            VALUES (?, ?, ?, ?)
        """,
            (first_name, last_name, email, message),
        )
        conn.commit()
        return cursor.lastrowid

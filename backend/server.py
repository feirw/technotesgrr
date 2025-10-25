from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from datetime import datetime, timedelta
import json
from database import (
    init_database,
    update_leaderboard,
    get_leaderboard_data,
    record_quiz_submission,
    get_db_connection,
    get_quizzes_from_db,
    get_flashcards_from_db,
    get_quiz_by_id,
    save_contact_submission,  # Add this import
)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Models
class Note(BaseModel):
    id: str
    title: str
    preview: str
    subject: str
    price: float
    download_count: int = 0


class QuizQuestion(BaseModel):
    id: str
    question: str
    answers: List[dict]  # Changed from options to answers
    category: str
    chapter: str
    points: int
    source_file: str


class QuizSubmission(BaseModel):
    nickname: str
    question_id: str
    selected_answer: int


class LeaderboardEntry(BaseModel):
    nickname: str
    total_points: int
    month: str


class Flashcard(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    chapter: str
    source_file: str


class ContactForm(BaseModel):
    firstName: str
    lastName: str
    email: str
    message: str


def init_sqlite_data():
    """Initialize SQLite database structure"""
    # with get_db_connection() as conn:
    #     cursor = conn.cursor()

    #     # Create notes table
    #     cursor.execute('''
    #         CREATE TABLE IF NOT EXISTS notes (
    #             id TEXT PRIMARY KEY,
    #             title TEXT NOT NULL,
    #             preview TEXT NOT NULL,
    #             subject TEXT NOT NULL,
    #             price REAL NOT NULL,
    #             download_count INTEGER DEFAULT 0,
    #             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    #         )
    #     ''')

    #     # No need to insert sample data anymore
    #     conn.commit()


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()
    init_sqlite_data()
    print("SQLite database initialized successfully")


# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "TechNotesGR API is running with SQLite"}


# @app.get("/api/notes")
# async def get_notes():
#     try:
#         with get_db_connection() as conn:
#             cursor = conn.cursor()
#             cursor.execute('SELECT * FROM notes ORDER BY created_at DESC')
#             rows = cursor.fetchall()
#             notes = [dict(row) for row in rows]
#         return {"notes": notes}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# @app.get("/api/notes/{note_id}")
# async def get_note(note_id: str):
#     try:
#         with get_db_connection() as conn:
#             cursor = conn.cursor()
#             cursor.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
#             row = cursor.fetchone()
#             if not row:
#                 raise HTTPException(status_code=404, detail="Note not found")
#             return dict(row)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/api/quiz/questions")
async def get_quiz_questions():
    """Get all quiz questions from the new quizzes table"""
    try:
        questions = get_quizzes_from_db()
        # Parse JSON answers for each question
        for question in questions:
            question["answers"] = json.loads(question["answers"])
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error loading quiz questions: {str(e)}"
        )


@app.get("/api/quiz/questions/{chapter}")
async def get_quiz_questions_by_chapter(chapter: str):
    """Get quiz questions for a specific chapter"""
    try:
        questions = get_quizzes_from_db()
        chapter_questions = []
        for question in questions:
            if question["chapter"] == chapter:
                question["answers"] = json.loads(question["answers"])
                chapter_questions.append(question)
        return {"questions": chapter_questions, "chapter": chapter}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error loading quiz questions: {str(e)}"
        )


@app.post("/api/quiz/submit")
async def submit_quiz_answer(submission: QuizSubmission):
    try:
        # Find the question from the new quizzes table
        question = get_quiz_by_id(submission.question_id)

        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        # Parse the answers JSON
        answers = json.loads(question["answers"])

        # Check if answer is correct - look for the correct answer in the answers array
        correct_answer = None
        for idx, answer in enumerate(answers):
            if answer.get("correct", False):
                correct_answer = idx
                break

        is_correct = submission.selected_answer == correct_answer
        points_earned = question.get("points", 10) if is_correct else 0

        # Record the submission
        record_quiz_submission(
            nickname=submission.nickname,
            question_id=submission.question_id,
            selected_answer=str(submission.selected_answer),
            is_correct=is_correct,
            points_earned=points_earned,
        )

        # Update leaderboard
        if points_earned > 0:
            update_leaderboard(submission.nickname, points_earned)

        return {
            "correct": is_correct,
            "points_earned": points_earned,
            "correct_answer": correct_answer,
            "explanation": question.get("explanation", ""),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error submitting quiz answer: {str(e)}"
        )


@app.get("/api/flashcards")
async def get_flashcards():
    """Get all flashcards"""
    try:
        flashcards = get_flashcards_from_db()
        return {"flashcards": flashcards}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error loading flashcards: {str(e)}"
        )


@app.get("/api/flashcards/{chapter}")
async def get_flashcards_by_chapter(chapter: str):
    """Get flashcards for a specific chapter"""
    try:
        flashcards = get_flashcards_from_db()
        chapter_flashcards = [f for f in flashcards if f["chapter"] == chapter]
        return {"flashcards": chapter_flashcards, "chapter": chapter}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error loading flashcards: {str(e)}"
        )


@app.get("/api/categories")
async def get_categories():
    """Get all available categories from both quizzes and flashcards"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Get quiz categories
            cursor.execute("SELECT DISTINCT category FROM quizzes ORDER BY category")
            quiz_categories = [row[0] for row in cursor.fetchall()]

            # Get flashcard categories
            cursor.execute("SELECT DISTINCT category FROM flashcards ORDER BY category")
            flashcard_categories = [row[0] for row in cursor.fetchall()]

            return {
                "quiz_categories": quiz_categories,
                "flashcard_categories": flashcard_categories,
                "all_categories": sorted(
                    list(set(quiz_categories + flashcard_categories))
                ),
            }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error loading categories: {str(e)}"
        )


@app.get("/api/leaderboard")
async def get_leaderboard(month: str = None):
    try:
        leaderboard = get_leaderboard_data(month)
        current_month = month or datetime.now().strftime("%Y-%m")
        return {"leaderboard": leaderboard, "month": current_month}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/api/contact")
async def contact_form(contact_data: ContactForm):
    try:
        submission_id = save_contact_submission(
            first_name=contact_data.firstName,
            last_name=contact_data.lastName,
            email=contact_data.email,
            message=contact_data.message,
        )
        return {
            "message": "Η φόρμα επικοινωνίας στάλθηκε επιτυχώς!",
            "submission_id": submission_id,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error saving contact form: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

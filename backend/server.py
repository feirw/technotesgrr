from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from datetime import datetime, timedelta
import json
import time
from dotenv import load_dotenv

load_dotenv()

# Import AI Service
try:
    from ai_service import get_ai_response
except ImportError:
    def get_ai_response(msg): return "AI Service not configured."

# Import Database functions
from database import (
    init_database,
    update_leaderboard,
    get_leaderboard_data,
    record_quiz_submission,
    get_db_connection,
    get_quizzes_from_db,
    get_flashcards_from_db,
    get_quiz_by_id,
    save_contact_submission,
    get_admin_stats,
    is_user_admin,
    save_career_orientation_result,
    get_career_orientation_result
)

# Import Security Dependency
# YOU MUST HAVE backend/deps.py CREATED FOR THIS TO WORK
from deps import get_current_user

app = FastAPI()

# CORS middleware
# Updated to include Vite's default port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Models ---
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
    answers: List[dict]
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

class ChatMessage(BaseModel):
    message: str

class CareerOrientationSubmission(BaseModel):
    answers: dict  # Question ID -> Score (1-5)
    results: dict  # Calculated results with final_scores, top_category, sorted_scores


# --- Startup Event ---
@app.on_event("startup")
async def startup_event():
    # Initialize connection to Supabase
    init_database()
    print("Backend connected to Supabase successfully")


# --- API Routes ---

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "TechNotesGR API is running on Supabase"}


@app.post("/api/chat")
async def chat_with_bot(chat_data: ChatMessage):
    """Endpoint for AI assistant communication"""
    try:
        response_text = get_ai_response(chat_data.message)
        time.sleep(0.5) # Simulate slight delay
        return {"reply": response_text}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Προέκυψε σφάλμα κατά την επεξεργασία του μηνύματος.",
        )


@app.get("/api/quiz/questions")
async def get_quiz_questions():
    """Get all quiz questions from Supabase"""
    try:
        questions = get_quizzes_from_db()
        # No need for json.loads, Postgres JSONB returns python objects automatically
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
                chapter_questions.append(question)
        return {"questions": chapter_questions, "chapter": chapter}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error loading quiz questions: {str(e)}"
        )


# --- PROTECTED ROUTE ---
@app.post("/api/quiz/submit")
async def submit_quiz_answer(
    submission: QuizSubmission,
    # This dependency checks the Bearer token header. 
    # If the token is invalid or missing, it returns 401 Unauthorized.
    user = Depends(get_current_user) 
):
    try:
        # Note: 'user' is the Supabase user object verified by the token.
        
        # Find the question
        question = get_quiz_by_id(submission.question_id)

        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        # Parse answers (Already a list thanks to JSONB)
        answers = question["answers"]

        # Check correctness
        correct_answer_idx = None
        for idx, answer in enumerate(answers):
            if answer.get("correct", False):
                correct_answer_idx = idx
                break

        is_correct = submission.selected_answer == correct_answer_idx
        points_earned = question.get("points", 10) if is_correct else 0

        # Record submission
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
            "correct_answer": correct_answer_idx,
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
    """Get all available categories"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
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

# --- ADMIN ROUTES ---

@app.post("/api/career-orientation/submit")
async def submit_career_orientation(
    submission: CareerOrientationSubmission,
    user = Depends(get_current_user)
):
    """
    Save career orientation (prosanatolismos) results to database.
    Protected route: Requires authentication.
    """
    try:
        # Validate submission data
        if not submission.answers or not submission.results:
            raise HTTPException(
                status_code=400, 
                detail="Missing required data: answers and results are required"
            )
        
        # Save to database
        result_id = save_career_orientation_result(
            user_id=user.id,
            answers=submission.answers,
            results=submission.results
        )
        
        return {
            "message": "Career orientation results saved successfully",
            "result_id": result_id,
            "saved_at": datetime.now().isoformat()
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error saving career orientation results: {str(e)}"
        )

@app.get("/api/career-orientation/result")
async def get_career_orientation_result_endpoint(user = Depends(get_current_user)):
    """
    Get the latest career orientation result for the authenticated user.
    Protected route: Requires authentication.
    """
    try:
        result = get_career_orientation_result(user.id)
        if result:
            return {
                "found": True,
                "result": result
            }
        else:
            return {
                "found": False,
                "message": "No career orientation results found for this user"
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching career orientation result: {str(e)}"
        )

@app.get("/api/admin/dashboard")
async def get_dashboard_stats(user = Depends(get_current_user)):
    """
    Protected route: Only allows users with role='admin'.
    The 'user' dependency ensures they are logged in with a valid token.
    Then we check their role in the DB.
    """
    try:
        # 1. Check if the user is an admin
        if not is_user_admin(user.id):
            raise HTTPException(status_code=403, detail="Access Forbidden: Admins only.")
        
        # 2. Fetch admin stats
        stats = get_admin_stats()
        return stats
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
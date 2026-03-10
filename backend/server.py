from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import time
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ── AI Service ────────────────────────────────────────────────────────────────
try:
    from ai_service import get_ai_response
except ImportError:
    def get_ai_response(msg: str) -> str:
        return "AI Service not configured."

# ── Database ──────────────────────────────────────────────────────────────────
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
    get_career_orientation_result,
)

# ── Auth dependency ───────────────────────────────────────────────────────────
from deps import get_current_user


# ── FIX #1: Replace deprecated @app.on_event with lifespan ───────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once at startup
    init_database()
    print("✅ Backend connected to Supabase successfully")
    yield
    # Runs once at shutdown (add cleanup here if needed)
    print("👋 Backend shutting down")


# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(title="TechNotesGR API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Models ───────────────────────────────────────────────────────────

class QuizSubmission(BaseModel):
    nickname: str
    question_id: str
    selected_answer: int

class ContactForm(BaseModel):
    firstName: str
    lastName: str
    email: str
    message: str

class ChatMessage(BaseModel):
    message: str

class CareerOrientationSubmission(BaseModel):
    answers: dict
    results: dict


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "TechNotesGR API is running"}


# ── Chat ──────────────────────────────────────────────────────────────────────

@app.post("/api/chat")
async def chat_with_bot(chat_data: ChatMessage):
    if not chat_data.message or not chat_data.message.strip():
        raise HTTPException(status_code=422, detail="Το μήνυμα δεν μπορεί να είναι κενό.")
    try:
        response_text = get_ai_response(chat_data.message.strip())
        time.sleep(0.4)
        return {"reply": response_text}
    except Exception as e:
        print(f"[Chat] error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Προέκυψε σφάλμα κατά την επεξεργασία του μηνύματος.",
        )


# ── Quiz ──────────────────────────────────────────────────────────────────────

@app.get("/api/quiz/questions")
async def get_quiz_questions():
    try:
        return {"questions": get_quizzes_from_db()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading quiz questions: {e}")


@app.get("/api/quiz/questions/{chapter}")
async def get_quiz_questions_by_chapter(chapter: str):
    try:
        questions = [q for q in get_quizzes_from_db() if q["chapter"] == chapter]
        return {"questions": questions, "chapter": chapter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading quiz questions: {e}")


@app.post("/api/quiz/submit")
async def submit_quiz_answer(submission: QuizSubmission, user=Depends(get_current_user)):
    try:
        question = get_quiz_by_id(submission.question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        answers = question["answers"]
        correct_answer_idx = next(
            (idx for idx, a in enumerate(answers) if a.get("correct") is True), None
        )
        if correct_answer_idx is None:
            raise HTTPException(status_code=500, detail="Question has no correct answer defined.")

        is_correct = submission.selected_answer == correct_answer_idx
        points_earned = question.get("points", 10) if is_correct else 0

        record_quiz_submission(
            nickname=submission.nickname,
            question_id=submission.question_id,
            selected_answer=str(submission.selected_answer),
            is_correct=is_correct,
            points_earned=points_earned,
        )

        if points_earned > 0:
            update_leaderboard(submission.nickname, points_earned)

        return {
            "correct": is_correct,
            "points_earned": points_earned,
            "correct_answer": correct_answer_idx,
            "explanation": question.get("explanation", ""),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting quiz answer: {e}")


# ── Flashcards ────────────────────────────────────────────────────────────────

@app.get("/api/flashcards")
async def get_flashcards():
    try:
        return {"flashcards": get_flashcards_from_db()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading flashcards: {e}")


@app.get("/api/flashcards/{chapter}")
async def get_flashcards_by_chapter(chapter: str):
    try:
        flashcards = [f for f in get_flashcards_from_db() if f["chapter"] == chapter]
        return {"flashcards": flashcards, "chapter": chapter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading flashcards: {e}")


# ── Categories ────────────────────────────────────────────────────────────────

@app.get("/api/categories")
async def get_categories():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT DISTINCT category FROM quizzes ORDER BY category")
                quiz_cats = [row[0] for row in cursor.fetchall()]

                cursor.execute("SELECT DISTINCT category FROM flashcards ORDER BY category")
                flash_cats = [row[0] for row in cursor.fetchall()]

        return {
            "quiz_categories": quiz_cats,
            "flashcard_categories": flash_cats,
            "all_categories": sorted(set(quiz_cats + flash_cats)),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading categories: {e}")


# ── Leaderboard ───────────────────────────────────────────────────────────────

@app.get("/api/leaderboard")
async def get_leaderboard(month: Optional[str] = None):
    try:
        leaderboard = get_leaderboard_data(month)
        current_month = month or datetime.now().strftime("%Y-%m")
        return {"leaderboard": leaderboard, "month": current_month}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")


# ── Contact ───────────────────────────────────────────────────────────────────

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
        raise HTTPException(status_code=500, detail=f"Error saving contact form: {e}")


# ── Career Orientation ────────────────────────────────────────────────────────

@app.post("/api/career-orientation/submit")
async def submit_career_orientation(
    submission: CareerOrientationSubmission,
    user=Depends(get_current_user),
):
    if not submission.answers or not submission.results:
        raise HTTPException(
            status_code=400,
            detail="Missing required data: answers and results are required",
        )
    try:
        result_id = save_career_orientation_result(
            user_id=user.id,
            answers=submission.answers,
            results=submission.results,
        )
        return {
            "message": "Career orientation results saved successfully",
            "result_id": result_id,
            "saved_at": datetime.now().isoformat(),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving results: {e}")


@app.get("/api/career-orientation/result")
async def get_career_orientation_result_endpoint(user=Depends(get_current_user)):
    try:
        result = get_career_orientation_result(user.id)
        if result:
            return {"found": True, "result": result}
        return {"found": False, "message": "No career orientation results found for this user"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching result: {e}")


# ── Admin ─────────────────────────────────────────────────────────────────────

@app.get("/api/admin/dashboard")
async def get_dashboard_stats(user=Depends(get_current_user)):
    try:
        if not is_user_admin(user.id):
            raise HTTPException(status_code=403, detail="Access Forbidden: Admins only.")
        return get_admin_stats()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    # FIX #2: Pass the app as an import string ("server:app") so that
    # --reload works correctly. Adjust "server" to match your filename.
    uvicorn.run(
        "server:app",        # <-- module_name:app_variable  (change "server" if your file is named differently)
        host="0.0.0.0",
        port=8001,
        reload=True,         # now works because we use the import string form
    )
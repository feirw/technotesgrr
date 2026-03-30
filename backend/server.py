from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import time
import smtplib
from email.message import EmailMessage
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ── AI Service ────────────────────────────────────────────────────────────────
try:
    from ai_service import get_ai_response
except Exception:
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
    get_quizzes_page,
    get_flashcards_from_db,
    get_flashcards_page,
    get_quiz_by_id,
    save_contact_submission,
    get_admin_stats,
    get_admin_users,
    is_user_admin,
    save_career_orientation_result,
    get_career_orientation_result,
    create_community_post,
    get_community_posts,
    get_community_replies_for_posts,
    create_community_reply,
    delete_community_post,
    get_username_by_user_id,
)

# ── Auth dependency ───────────────────────────────────────────────────────────
from deps import get_current_user


# ── FIX #1: Replace deprecated @app.on_event with lifespan ───────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once at startup
    try:
        init_database()
        print("✅ Backend connected to Supabase successfully")
    except Exception as e:
        # Keep API process alive so health/debug endpoints can still respond.
        print(f"❌ Backend startup warning: {e}")
    yield
    # Runs once at shutdown (add cleanup here if needed)
    print("👋 Backend shutting down")


# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(title="TechNotesGR API", lifespan=lifespan)

_extra_cors_origins = [
    origin.strip()
    for origin in (os.getenv("CORS_ORIGINS", "") or "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://technotesgr.gr",
        "https://www.technotesgr.gr",
    ] + _extra_cors_origins,
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1024)


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
    session_id: Optional[str] = "default"

class CareerOrientationSubmission(BaseModel):
    answers: dict
    results: dict

class WebVitalEvent(BaseModel):
    name: str
    value: float
    rating: str
    path: Optional[str] = None
    ts: Optional[int] = None


class CommunityPostCreate(BaseModel):
    content: str

class CommunityReplyCreate(BaseModel):
    content: str


# ── Utilities ─────────────────────────────────────────────────────────────────

def _try_send_contact_email(first_name: str, last_name: str, email: str, message: str) -> bool:
    """
    Best-effort notification email for contact form.
    Works only when SMTP env vars are configured; otherwise safely no-op.
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    contact_receiver = os.getenv("CONTACT_RECEIVER_EMAIL")
    smtp_sender = os.getenv("SMTP_SENDER_EMAIL") or smtp_user

    if not all([smtp_host, smtp_port, smtp_user, smtp_pass, contact_receiver, smtp_sender]):
        return False

    msg = EmailMessage()
    msg["Subject"] = "Νέο μήνυμα από Contact Form - TechNotesGR"
    msg["From"] = smtp_sender
    msg["To"] = contact_receiver
    msg.set_content(
        f"""
Νέο μήνυμα από τη φόρμα επικοινωνίας:

Όνομα: {first_name} {last_name}
Email: {email}

Μήνυμα:
{message}
        """.strip()
    )

    with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
    return True


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "TechNotesGR API is running"}


# ── Chat ──────────────────────────────────────────────────────────────────────

@app.post("/api/chat")
async def chat_with_bot(chat_data: ChatMessage):
    if not chat_data.message or not chat_data.message.strip():
        raise HTTPException(status_code=422, detail="Το μήνυμα δεν μπορεί να είναι κενό.")
    if len(chat_data.message.strip()) > 2000:
        raise HTTPException(status_code=413, detail="Το μήνυμα είναι πολύ μεγάλο.")
    try:
        response_text = get_ai_response(
            chat_data.message.strip(),
            chat_data.session_id or "default",
        )
        return {"reply": response_text}
    except Exception as e:
        print(f"[Chat] error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Προέκυψε σφάλμα κατά την επεξεργασία του μηνύματος.",
        )


# ── Quiz ──────────────────────────────────────────────────────────────────────

@app.get("/api/quiz/questions")
async def get_quiz_questions(
    chapter: Optional[str] = None,
    limit: int = Query(default=200, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    try:
        paginated, total = get_quizzes_page(limit=limit, offset=offset, chapter=chapter)
        has_more = offset + limit < total
        return {
            "questions": paginated,
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": has_more,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading quiz questions: {e}")


@app.get("/api/quiz/questions/{chapter}")
async def get_quiz_questions_by_chapter(chapter: str):
    try:
        questions, _ = get_quizzes_page(limit=5000, offset=0, chapter=chapter)
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
async def get_flashcards(
    chapter: Optional[str] = None,
    limit: int = Query(default=1000, ge=1, le=5000),
    offset: int = Query(default=0, ge=0),
):
    try:
        flashcards, total = get_flashcards_page(limit=limit, offset=offset, chapter=chapter)
        return {
            "flashcards": flashcards,
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading flashcards: {e}")


@app.get("/api/flashcards/{chapter}")
async def get_flashcards_by_chapter(chapter: str):
    try:
        flashcards, _ = get_flashcards_page(limit=5000, offset=0, chapter=chapter)
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
    if not contact_data.firstName.strip() or not contact_data.email.strip() or not contact_data.message.strip():
        raise HTTPException(status_code=400, detail="Name, email και message είναι υποχρεωτικά.")
    try:
        submission_id = save_contact_submission(
            first_name=contact_data.firstName,
            last_name=contact_data.lastName,
            email=contact_data.email,
            message=contact_data.message,
        )
        email_sent = False
        try:
            email_sent = _try_send_contact_email(
                first_name=contact_data.firstName,
                last_name=contact_data.lastName,
                email=contact_data.email,
                message=contact_data.message,
            )
        except Exception as email_err:
            # Do not fail request when email notification fails.
            print(f"[Contact] Email notification failed: {email_err}")

        return {
            "message": "Η φόρμα επικοινωνίας στάλθηκε επιτυχώς!",
            "submission_id": submission_id,
            "email_sent": email_sent,
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


@app.post("/api/metrics/web-vitals")
async def ingest_web_vitals(metric: WebVitalEvent):
    """
    Lightweight endpoint for frontend performance telemetry.
    Currently logs slow-path metrics; can later be wired to a metrics store.
    """
    try:
        # Keep server-side logging lightweight and focused on problematic values.
        if metric.rating in {"needs-improvement", "poor"}:
            print(
                "[WebVitals]",
                {
                    "name": metric.name,
                    "value": metric.value,
                    "rating": metric.rating,
                    "path": metric.path,
                    "ts": metric.ts or int(time.time() * 1000),
                },
            )
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ingesting web vitals: {e}")


# ── Community Forum ────────────────────────────────────────────────────────────

@app.get("/api/community/posts")
async def list_community_posts(
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user=Depends(get_current_user),
):
    try:
        posts, total = get_community_posts(limit=limit, offset=offset)
        post_ids = [int(p["id"]) for p in posts]
        replies_by_post_id = get_community_replies_for_posts(post_ids)
        hydrated_posts = []
        for p in posts:
            post = dict(p)
            post["replies"] = replies_by_post_id.get(int(post["id"]), [])
            hydrated_posts.append(post)
        return {
            "posts": hydrated_posts,
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching community posts: {e}")


@app.post("/api/community/posts")
async def add_community_post(payload: CommunityPostCreate, user=Depends(get_current_user)):
    content = (payload.content or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Το κείμενο του post είναι υποχρεωτικό.")
    if len(content) > 2000:
        raise HTTPException(status_code=413, detail="Το post είναι πολύ μεγάλο (max 2000 χαρακτήρες).")
    try:
        # Prefer profile username so the forum always shows each user's chosen name.
        username = (
            get_username_by_user_id(str(user.id))
            or getattr(user, "user_metadata", {}).get("username")
            or getattr(user, "email", "").split("@")[0]
            or "Student"
        )
        post = create_community_post(
            user_id=str(user.id),
            username=username,
            content=content,
        )
        return {"post": post}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating community post: {e}")

@app.post("/api/community/posts/{post_id}/replies")
async def add_community_reply(post_id: int, payload: CommunityReplyCreate, user=Depends(get_current_user)):
    content = (payload.content or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Το κείμενο της απάντησης είναι υποχρεωτικό.")
    if len(content) > 1500:
        raise HTTPException(status_code=413, detail="Η απάντηση είναι πολύ μεγάλη (max 1500 χαρακτήρες).")
    try:
        username = (
            get_username_by_user_id(str(user.id))
            or getattr(user, "user_metadata", {}).get("username")
            or getattr(user, "email", "").split("@")[0]
            or "Student"
        )
        reply = create_community_reply(
            post_id=post_id,
            user_id=str(user.id),
            username=username,
            content=content,
        )
        return {"reply": reply}
    except ValueError as e:
        if str(e) == "POST_NOT_FOUND":
            raise HTTPException(status_code=404, detail="Το post δεν βρέθηκε.")
        raise HTTPException(status_code=400, detail="Μη έγκυρο αίτημα.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating reply: {e}")

@app.delete("/api/community/posts/{post_id}")
async def remove_community_post(post_id: int, user=Depends(get_current_user)):
    try:
        deleted = delete_community_post(
            post_id=post_id,
            requester_user_id=str(user.id),
            requester_is_admin=is_user_admin(user.id),
        )
        if not deleted:
            raise HTTPException(status_code=404, detail="Το post δεν βρέθηκε.")
        return {"ok": True, "deleted_id": post_id}
    except PermissionError:
        raise HTTPException(status_code=403, detail="Δεν έχεις δικαίωμα να διαγράψεις αυτό το post.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting community post: {e}")


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

@app.get("/api/admin/users")
async def get_admin_users_endpoint(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    user=Depends(get_current_user),
):
    try:
        if not is_user_admin(user.id):
            raise HTTPException(status_code=403, detail="Access Forbidden: Admins only.")
        users, total = get_admin_users(limit=limit, offset=offset)
        return {
            "users": users,
            "total": total,
            "limit": limit,
            "offset": offset,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    is_dev = os.getenv("ENV", "").lower() in {"dev", "development", "local"}
    port = int(os.getenv("PORT", "8001"))

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=port,
        reload=is_dev,
    )
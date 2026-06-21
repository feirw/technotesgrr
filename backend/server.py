from contextlib import asynccontextmanager
import asyncio
import json
import logging
import queue
import threading
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr, Field
from typing import Any, Literal, Optional
import os
import time
import smtplib
from email.message import EmailMessage
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("technotesgr")

# Generic message for unexpected server errors (details are logged, not sent to clients).
INTERNAL_ERROR_DETAIL = "Προέκυψε εσωτερικό σφάλμα. Δοκίμασε ξανά αργότερα."

# ── AI Service ────────────────────────────────────────────────────────────────
try:
    from ai_service import (
        correct_exercise,
        get_ai_response,
        iter_ai_response_stream,
        user_facing_chat_error,
    )
    from corrector_knowledge import get_knowledge_stats
except Exception:  # noqa: E722

    def get_ai_response(msg: str, session_id: str = "default") -> str:
        return "AI Service not configured."

    def iter_ai_response_stream(msg: str, session_id: str = "default"):
        yield "AI Service not configured."
        return

    def user_facing_chat_error(_error_str: str) -> str:
        return "Δεν μπόρεσα να επεξεργαστώ το αίτημά σου. Δοκίμασε ξανά σε λίγο."

    def correct_exercise(_exercise: str, _student_answer: str) -> dict[str, Any]:
        raise RuntimeError("AI Service not configured.")

    def get_knowledge_stats() -> dict[str, Any]:
        return {"loaded": False, "chunkCount": 0, "fileCount": 0}

# ── Database ──────────────────────────────────────────────────────────────────
from database import (
    init_database,
    close_db_pool,
    update_leaderboard,
    get_leaderboard_data,
    record_quiz_submission,
    get_quizzes_from_db,
    get_quizzes_page,
    get_flashcards_from_db,
    get_flashcards_page,
    get_quiz_by_id,
    save_contact_submission,
    get_category_lists,
    db_ping,
)

# ── FIX #1: Replace deprecated @app.on_event with lifespan ───────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once at startup
    allow_without_db = os.getenv("ALLOW_START_WITHOUT_DB", "").strip().lower() in {"1", "true", "yes"}
    try:
        init_database()
        app.state.db_ready = True
        print("✅ Backend connected to Supabase successfully")
    except Exception as e:
        app.state.db_ready = False
        logger.exception("Backend startup failed during DB init")
        if not allow_without_db:
            raise
        print(f"❌ Backend startup warning (continuing due to ALLOW_START_WITHOUT_DB): {e}")
    yield
    close_db_pool()
    print("👋 Backend shutting down")


# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(title="TechNotesGR API", lifespan=lifespan)

_extra_cors_origins = [
    origin.strip()
    for origin in (os.getenv("CORS_ORIGINS", "") or "").split(",")
    if origin.strip()
]

# Regex εφεξής: αν το Render/.env έχει μόνο .gr, τα αιτήματα από technotesgr.com εξακολουθούν να επιτρέπονται.
# re.match() από την αρχή του Origin — χρειάζεται ^ … $
_cors_origin_regex = (
    r"^https://([\w-]+\.)?technotesgr\.(gr|com)$"
    r"|^https://[\w.-]+\.netlify\.app$"
    r"|^https://[\w.-]+\.vercel\.app$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "https://technotesgr.gr",
        "https://www.technotesgr.gr",
        "https://technotesgr.com",
        "https://www.technotesgr.com",
    ] + _extra_cors_origins,
    allow_origin_regex=_cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1024)


# ── Pydantic Models ───────────────────────────────────────────────────────────

class QuizSubmission(BaseModel):
    nickname: str = Field(min_length=1, max_length=60)
    question_id: str = Field(min_length=1, max_length=128)
    selected_answer: int = Field(ge=0, le=20)

class ContactForm(BaseModel):
    firstName: str = Field(min_length=1, max_length=80)
    lastName: str = Field(default="", max_length=80)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)

class ChatMessage(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: Optional[str] = Field(default="default", max_length=120)


class CorrectRequest(BaseModel):
    exercise: str = Field(default="", max_length=5000)
    studentAnswer: str = Field(default="", max_length=5000)
    exerciseImages: list[str] = Field(default_factory=list, max_length=4)
    studentAnswerImages: list[str] = Field(default_factory=list, max_length=4)


CORRECT_FIELD_MAX_LEN = 5000

class CareerOrientationSubmission(BaseModel):
    answers: dict[str, Any] = Field(min_length=1, max_length=500)
    results: dict[str, Any] = Field(min_length=1, max_length=100)

class WebVitalEvent(BaseModel):
    name: Literal["LCP", "CLS", "INP", "FCP", "TTFB"]
    value: float = Field(ge=0)
    rating: Literal["good", "needs-improvement", "poor"]
    path: Optional[str] = Field(default=None, max_length=2048)
    ts: Optional[int] = Field(default=None, ge=0)


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
    return {
        "status": "healthy",
        "message": "TechNotesGR API is running",
        "db_ready": bool(getattr(app.state, "db_ready", False)),
    }


@app.get("/api/ready")
def readiness_check():
    try:
        db_ping()
        app.state.db_ready = True
        return {"status": "ready"}
    except Exception:
        app.state.db_ready = False
        logger.exception("readiness_check failed")
        raise HTTPException(status_code=503, detail="Database is not ready.")


# ── AI Corrector ──────────────────────────────────────────────────────────────

@app.get("/api/correct/knowledge")
async def corrector_knowledge_status():
    return get_knowledge_stats()


@app.post("/api/correct")
async def correct_student_exercise(body: CorrectRequest):
    exercise = (body.exercise or "").strip()
    student_answer = (body.studentAnswer or "").strip()
    exercise_images = [img.strip() for img in (body.exerciseImages or []) if img and img.strip()]
    student_answer_images = [
        img.strip() for img in (body.studentAnswerImages or []) if img and img.strip()
    ]

    has_exercise = bool(exercise) or bool(exercise_images)
    has_answer = bool(student_answer) or bool(student_answer_images)
    if not has_exercise or not has_answer:
        raise HTTPException(
            status_code=400,
            detail="Δώσε εκφώνηση και λύση (κείμενο ή φωτογραφία).",
        )
    if len(exercise) > CORRECT_FIELD_MAX_LEN or len(student_answer) > CORRECT_FIELD_MAX_LEN:
        raise HTTPException(status_code=400, detail="Το κείμενο είναι πολύ μεγάλο.")
    if len(exercise_images) > 4 or len(student_answer_images) > 4:
        raise HTTPException(status_code=400, detail="Μέγιστο 4 φωτογραφίες ανά πεδίο.")

    try:
        return await asyncio.to_thread(
            correct_exercise,
            exercise,
            student_answer,
            exercise_images=exercise_images or None,
            student_answer_images=student_answer_images or None,
        )
    except ValueError as exc:
        detail = str(exc) or "Μη έγκυρα δεδομένα."
        if "image" in detail.lower() or "base64" in detail.lower():
            detail = "Η φωτογραφία δεν ήταν έγκυρη ή είναι πολύ μεγάλη."
        raise HTTPException(status_code=400, detail=detail) from exc
    except Exception:
        logger.exception("correct_student_exercise failed")
        raise HTTPException(
            status_code=502,
            detail="Η αυτόματη διόρθωση απέτυχε προσωρινά. Δοκίμασε ξανά.",
        )


# ── Chat ──────────────────────────────────────────────────────────────────────

@app.post("/api/chat")
async def chat_with_bot(chat_data: ChatMessage):
    if not chat_data.message or not chat_data.message.strip():
        raise HTTPException(status_code=422, detail="Το μήνυμα δεν μπορεί να είναι κενό.")
    if len(chat_data.message.strip()) > 2000:
        raise HTTPException(status_code=413, detail="Το μήνυμα είναι πολύ μεγάλο.")
    try:
        # Μην μπλοκάρεις το event loop ενώ περιμένει το Gemini (καλύτερη απόκριση υπό φόρτο).
        response_text = await asyncio.to_thread(
            get_ai_response,
            chat_data.message.strip(),
            chat_data.session_id or "default",
        )
        return {"reply": response_text}
    except Exception:
        logger.exception("chat_with_bot failed")
        raise HTTPException(
            status_code=500,
            detail="Προέκυψε σφάλμα κατά την επεξεργασία του μηνύματος.",
        )


@app.post("/api/chat/stream")
async def chat_with_bot_stream(chat_data: ChatMessage):
    """SSE: data: {"delta":"..."} | {"done":true} | {"error":"..."}"""
    if not chat_data.message or not chat_data.message.strip():
        raise HTTPException(status_code=422, detail="Το μήνυμα δεν μπορεί να είναι κενό.")
    if len(chat_data.message.strip()) > 2000:
        raise HTTPException(status_code=413, detail="Το μήνυμα είναι πολύ μεγάλο.")

    msg = chat_data.message.strip()
    sid = chat_data.session_id or "default"
    q: queue.Queue = queue.Queue(maxsize=256)

    def _safe_queue_put(item: tuple[str, str | None]) -> None:
        # Avoid potential deadlock if producer is faster than consumer.
        while True:
            try:
                q.put(item, timeout=1)
                return
            except queue.Full:
                continue

    def worker():
        try:
            for piece in iter_ai_response_stream(msg, sid):
                _safe_queue_put(("p", piece))
            _safe_queue_put(("d", None))
        except Exception as e:
            logger.exception("chat stream worker failed")
            _safe_queue_put(("e", user_facing_chat_error(str(e))))

    threading.Thread(target=worker, daemon=True).start()

    async def event_gen():
        # Push an immediate event so the client knows stream channel is alive.
        yield f"data: {json.dumps({'started': True})}\n\n".encode("utf-8")
        while True:
            try:
                kind, payload = await asyncio.to_thread(q.get, True, 12)
            except queue.Empty:
                # Keep connection warm through proxies/load balancers.
                yield b": ping\n\n"
                continue
            if kind == "p":
                line = json.dumps({"delta": payload}, ensure_ascii=False)
                yield f"data: {line}\n\n".encode("utf-8")
            elif kind == "d":
                yield f"data: {json.dumps({'done': True})}\n\n".encode("utf-8")
                break
            elif kind == "e":
                line = json.dumps({"error": payload}, ensure_ascii=False)
                yield f"data: {line}\n\n".encode("utf-8")
                break

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── Quiz ──────────────────────────────────────────────────────────────────────

@app.get("/api/quiz/questions")
def get_quiz_questions(
    response: Response,
    chapter: Optional[str] = None,
    limit: int = Query(default=500, ge=1, le=8000),
    offset: int = Query(default=0, ge=0),
):
    try:
        paginated, has_more = get_quizzes_page(limit=limit, offset=offset, chapter=chapter)
        response.headers["Cache-Control"] = "public, max-age=30, stale-while-revalidate=120"
        return {
            "questions": paginated,
            "total": None,
            "limit": limit,
            "offset": offset,
            "has_more": has_more,
        }
    except Exception:
        logger.exception("get_quiz_questions failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


@app.get("/api/quiz/questions/{chapter}")
def get_quiz_questions_by_chapter(chapter: str, response: Response):
    try:
        questions, _ = get_quizzes_page(limit=5000, offset=0, chapter=chapter)
        response.headers["Cache-Control"] = "public, max-age=30, stale-while-revalidate=120"
        return {"questions": questions, "chapter": chapter}
    except Exception:
        logger.exception("get_quiz_questions_by_chapter failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


@app.post("/api/quiz/submit")
def submit_quiz_answer(submission: QuizSubmission):
    try:
        question = get_quiz_by_id(submission.question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        answers = question["answers"]
        correct_answer_idx = next(
            (idx for idx, a in enumerate(answers) if a.get("correct") is True), None
        )
        if correct_answer_idx is None:
            logger.error(
                "Quiz question has no correct answer: question_id=%s",
                submission.question_id,
            )
            raise HTTPException(
                status_code=500,
                detail="Αυτή η ερώτηση δεν είναι διαθέσιμη αυτή τη στιγμή.",
            )

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
    except Exception:
        logger.exception("submit_quiz_answer failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


# ── Flashcards ────────────────────────────────────────────────────────────────

@app.get("/api/flashcards")
def get_flashcards(
    response: Response,
    chapter: Optional[str] = None,
    limit: int = Query(default=1000, ge=1, le=5000),
    offset: int = Query(default=0, ge=0),
):
    try:
        flashcards, has_more = get_flashcards_page(limit=limit, offset=offset, chapter=chapter)
        response.headers["Cache-Control"] = "public, max-age=30, stale-while-revalidate=120"
        return {
            "flashcards": flashcards,
            "total": None,
            "limit": limit,
            "offset": offset,
            "has_more": has_more,
        }
    except Exception:
        logger.exception("get_flashcards failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


@app.get("/api/flashcards/{chapter}")
def get_flashcards_by_chapter(chapter: str, response: Response):
    try:
        flashcards, _ = get_flashcards_page(limit=5000, offset=0, chapter=chapter)
        response.headers["Cache-Control"] = "public, max-age=30, stale-while-revalidate=120"
        return {"flashcards": flashcards, "chapter": chapter}
    except Exception:
        logger.exception("get_flashcards_by_chapter failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


# ── Categories ────────────────────────────────────────────────────────────────

@app.get("/api/categories")
def get_categories(response: Response):
    try:
        quiz_cats, flash_cats = get_category_lists()
        response.headers["Cache-Control"] = "public, max-age=120, stale-while-revalidate=300"
        return {
            "quiz_categories": quiz_cats,
            "flashcard_categories": flash_cats,
            "all_categories": sorted(set(quiz_cats + flash_cats)),
        }
    except Exception:
        logger.exception("get_categories failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


# ── Leaderboard ───────────────────────────────────────────────────────────────

@app.get("/api/leaderboard")
def get_leaderboard(response: Response, month: Optional[str] = None):
    try:
        leaderboard = get_leaderboard_data(month)
        current_month = month or datetime.now().strftime("%Y-%m")
        response.headers["Cache-Control"] = "public, max-age=15, stale-while-revalidate=60"
        return {"leaderboard": leaderboard, "month": current_month}
    except Exception:
        logger.exception("get_leaderboard failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


# ── Contact ───────────────────────────────────────────────────────────────────

@app.post("/api/contact")
def contact_form(contact_data: ContactForm):
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
    except Exception:
        logger.exception("contact_form failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


# ── Career Orientation ────────────────────────────────────────────────────────

@app.post("/api/career-orientation/submit")
def submit_career_orientation(
    submission: CareerOrientationSubmission,
):
    if not submission.answers or not submission.results:
        raise HTTPException(
            status_code=400,
            detail="Missing required data: answers and results are required",
        )
    try:
        # Public mode: endpoint remains available without per-user persistence.
        result_id = None
        return {
            "message": "Career orientation results processed (public mode, no account persistence).",
            "result_id": result_id,
            "saved_at": datetime.now().isoformat(),
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("submit_career_orientation failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


@app.get("/api/career-orientation/result")
def get_career_orientation_result_endpoint():
    try:
        return {"found": False, "message": "No stored career-orientation result in public mode."}
    except Exception:
        logger.exception("get_career_orientation_result failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


@app.post("/api/metrics/web-vitals")
def ingest_web_vitals(metric: WebVitalEvent):
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
    except Exception:
        logger.exception("ingest_web_vitals failed")
        raise HTTPException(status_code=500, detail=INTERNAL_ERROR_DETAIL)


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
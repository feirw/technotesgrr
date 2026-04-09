"""
ai_service.py  –  Google Gemini για το TechNotesGR chatbot
-----------------------------------------------------------
Χρησιμοποιεί το νέο επίσημο SDK: google-genai (ΟΧΙ google-generativeai)

Εγκατάσταση:
    pip uninstall google-generativeai -y
    pip install google-genai python-dotenv

.env αρχείο:
    GEMINI_API_KEY=your_api_key_here
    GEMINI_MODEL=gemini-2.5-flash
    # Ταχύτητα: λιγότερα tokens, χαμηλότερο temperature, απενεργοποίηση thinking (μόνο 2.5.x)
    GEMINI_MAX_OUTPUT_TOKENS=512
    GEMINI_TEMPERATURE=0.55
    GEMINI_MAX_HISTORY_ITEMS=14
    GEMINI_THINKING_BUDGET=0   # 0=κλειστό (γρηγορότερα), -1=αυτόματο, κενό=χωρίς thinking_config
"""

import logging
import os
from typing import Iterator

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("technotesgr")

GEMINI_API_KEY = (os.getenv("GEMINI_API_KEY") or "").strip()
# Override αν αλλάξει διαθεσιμότητα μοντέλων στο Google AI (π.χ. gemini-2.0-flash)
GEMINI_MODEL = (os.getenv("GEMINI_MODEL") or "gemini-2.5-flash").strip()


def _env_int(name: str, default: int) -> int:
    raw = (os.getenv(name) or "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


GEMINI_MAX_OUTPUT_TOKENS = max(128, min(8192, _env_int("GEMINI_MAX_OUTPUT_TOKENS", 512)))
GEMINI_TEMPERATURE = float((os.getenv("GEMINI_TEMPERATURE") or "0.55").strip() or "0.55")
GEMINI_TEMPERATURE = max(0.0, min(2.0, GEMINI_TEMPERATURE))
_MAX_HISTORY_CFG = max(4, min(40, _env_int("GEMINI_MAX_HISTORY_ITEMS", 14)))

try:
    from google import genai
    from google.genai import types

    _GENAI_IMPORT_OK = True
except ImportError:
    genai = None  # type: ignore[assignment, misc]
    types = None  # type: ignore[assignment, misc]
    _GENAI_IMPORT_OK = False

_client = None

SYSTEM_PROMPT = """
Εισαι ο ψηφιακος βοηθος του TechNotesGR, μια εκπαιδευτικη πλατφορμα για το μαθημα ΑΕΠΠ
(Αναπτυξη Εφαρμογων σε Προγραμματιστικο Περιβαλλον) της Γ Λυκειου στην Ελλαδα.

Ρολος σου:
- Απαντας σε ερωτησεις σχετικες με ΑΕΠΠ: αλγοριθμοι, δομες δεδομενων, προγραμματισμος, ΓΛΩΣΣΑ.
- Βοηθας μαθητες να καταλαβουν υλη, να λυσουν ασκησεις και να προετοιμαστουν για εξετασεις.
- Δινεις πληροφοριες για τις λειτουργιες της πλατφορμας: σημειωσεις, quiz, flashcards, leaderboard.
- Απαντας παντα στα Ελληνικα, με φιλικο και ενθαρρυντικο τονο.
- Χρησιμοποιεις απλη γλωσσα καταλληλη για μαθητες Λυκειου.
- Αν δεν ξερεις κατι, το παραδεχεσαι ειλικρινα.
- Δεν απαντας σε ασχετα θεματα.

Μορφοποιηση:
- Χρησιμοποιησε markdown για κωδικα, λιστες και εντονο κειμενο οπου χρειαζεται.
- Κρατα τις απαντησεις συνοπτικες αλλα πληρεις.
- Αν δεν ζητηθει αναλυτικη αναλυση, προτιμα σύντομες απαντησεις (λιγες παραγραφοι).
- Ποτε μην σταματας στη μεση προτασης. Ολοκληρωνε παντα το νοημα με καθαρο κλεισιμο.
- Αν η απαντηση ειναι μεγαλη, κανε συνοπτικη δομη με bullets ωστε να παραμενει πληρης και ευαναγνωστη.
""".strip()

_histories = {}
_MAX_HISTORY_ITEMS = _MAX_HISTORY_CFG
_MAX_SESSIONS = 200


def _optional_thinking_config():
    """Στα Gemini 2.5.x το thinking αυξάνει πολύ το latency· default το κλείνουμε."""
    if types is None:
        return None
    raw = (os.getenv("GEMINI_THINKING_BUDGET") or "").strip()
    if raw == "" and "2.5" not in GEMINI_MODEL.lower():
        return None
    if raw == "":
        budget = 0
    else:
        try:
            budget = int(raw)
        except ValueError:
            budget = 0
    return types.ThinkingConfig(thinking_budget=budget)


def _get_genai_client():
    global _client
    if not _GENAI_IMPORT_OK or not GEMINI_API_KEY:
        return None
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def _get_session_history(session_id: str):
    if len(_histories) > _MAX_SESSIONS and session_id not in _histories:
        oldest_key = next(iter(_histories))
        _histories.pop(oldest_key, None)
    return _histories.setdefault(session_id, [])


def _rollback_last_user(history: list) -> None:
    if history and getattr(history[-1], "role", None) == "user":
        history.pop()


def _ensure_complete_reply(text: str) -> str:
    """Best-effort guard against cut-off/unfinished responses."""
    cleaned = (text or "").strip()
    if not cleaned:
        return "Δεν έχω απάντηση αυτή τη στιγμή. Δοκίμασε ξανά."

    terminal = {".", "!", "?", "…", ";", ":", "»"}
    if cleaned[-1] not in terminal:
        cleaned = cleaned.rstrip(".,;: ") + "."

    # Close a dangling markdown code block if needed.
    if cleaned.count("```") % 2 != 0:
        cleaned += "\n```"
    return cleaned


def user_facing_chat_error(error_str: str) -> str:
    if "429" in error_str or "quota" in error_str.lower():
        return "Έχω πολλά αιτήματα αυτή τη στιγμή. Δοκίμασε ξανά σε λίγα δευτερόλεπτα!"
    if "403" in error_str or "API_KEY" in error_str:
        return "Πρόβλημα με την αυθεντικοποίηση. Επικοινώνησε με τον διαχειριστή."
    if "404" in error_str:
        return "Το AI μοντέλο δεν είναι διαθέσιμο αυτή τη στιγμή (έλεγξε GEMINI_MODEL στο .env)."
    return "Δεν μπόρεσα να επεξεργαστώ το αίτημά σου. Δοκίμασε ξανά σε λίγο."


def _make_generate_config():
    assert types is not None
    gen_cfg_kwargs = dict(
        system_instruction=SYSTEM_PROMPT,
        max_output_tokens=max(GEMINI_MAX_OUTPUT_TOKENS, 768),
        temperature=GEMINI_TEMPERATURE,
    )
    _tc = _optional_thinking_config()
    if _tc is not None:
        gen_cfg_kwargs["thinking_config"] = _tc
    return types.GenerateContentConfig(**gen_cfg_kwargs)


def get_ai_response(message: str, session_id: str = "default") -> str:
    if not _GENAI_IMPORT_OK:
        return "Ο βοηθός AI δεν είναι διαθέσιμος (λείπει η βιβλιοθήκη google-genai στον server)."
    if not GEMINI_API_KEY:
        return "Ο βοηθός AI δεν είναι ρυθμισμένος (πρόσθεσε GEMINI_API_KEY στο .env του backend)."

    client = _get_genai_client()
    if client is None:
        return "Ο βοηθός AI δεν είναι ρυθμισμένος (πρόσθεσε GEMINI_API_KEY στο .env του backend)."

    history = _get_session_history(session_id)
    assert types is not None

    try:
        history.append(types.Content(role="user", parts=[types.Part(text=message)]))

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=history,
            config=_make_generate_config(),
        )

        reply = _ensure_complete_reply(response.text or "Δεν έχω απάντηση αυτή τη στιγμή. Δοκίμασε ξανά.")

        history.append(types.Content(role="model", parts=[types.Part(text=reply)]))

        if len(history) > _MAX_HISTORY_ITEMS:
            _histories[session_id] = history[-_MAX_HISTORY_ITEMS:]

        return reply

    except Exception as e:
        error_str = str(e)
        logger.exception("Gemini generate_content failed")
        _rollback_last_user(history)
        return user_facing_chat_error(error_str)


def iter_ai_response_stream(message: str, session_id: str = "default") -> Iterator[str]:
    """
    Αποστολή απάντησης σε τμήματα (για SSE). Σε επιτυχία ενημερώνει το ιστορικό όπως το get_ai_response.
    Σε σφάλμα API κάνει rollback το τελευταίο user turn και κάνει raise RuntimeError με ελληνικό μήνυμα.
    """
    if not _GENAI_IMPORT_OK:
        yield "Ο βοηθός AI δεν είναι διαθέσιμος (λείπει η βιβλιοθήκη google-genai στον server)."
        return
    if not GEMINI_API_KEY:
        yield "Ο βοηθός AI δεν είναι ρυθμισμένος (πρόσθεσε GEMINI_API_KEY στο .env του backend)."
        return

    client = _get_genai_client()
    if client is None:
        yield "Ο βοηθός AI δεν είναι ρυθμισμένος (πρόσθεσε GEMINI_API_KEY στο .env του backend)."
        return

    history = _get_session_history(session_id)
    assert types is not None
    history.append(types.Content(role="user", parts=[types.Part(text=message)]))
    full = ""
    try:
        stream = client.models.generate_content_stream(
            model=GEMINI_MODEL,
            contents=history,
            config=_make_generate_config(),
        )
        for chunk in stream:
            piece = chunk.text or ""
            if piece:
                full += piece
                yield piece
        if not full.strip():
            full = "Δεν έχω απάντηση αυτή τη στιγμή. Δοκίμασε ξανά."
            yield full
        full = _ensure_complete_reply(full)
        history.append(types.Content(role="model", parts=[types.Part(text=full)]))
        if len(history) > _MAX_HISTORY_ITEMS:
            _histories[session_id] = history[-_MAX_HISTORY_ITEMS:]
    except Exception as e:
        error_str = str(e)
        logger.exception("Gemini generate_content_stream failed")
        _rollback_last_user(history)
        raise RuntimeError(user_facing_chat_error(error_str)) from e

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
import re
import base64
from typing import Any, Iterator, Literal

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


# ── AI Corrector (ΑΕΠΠ exercise grading) ────────────────────────────────────

CORRECT_FIELD_MAX_LEN = 5000
CORRECTOR_MAX_OUTPUT_TOKENS = max(256, min(8192, _env_int("CORRECTOR_MAX_OUTPUT_TOKENS", 1500)))
CORRECTOR_OCR_MAX_OUTPUT_TOKENS = max(256, min(8192, _env_int("CORRECTOR_OCR_MAX_OUTPUT_TOKENS", 2048)))
CORRECTOR_MODEL = (os.getenv("AI_MODEL") or GEMINI_MODEL).strip()
CORRECTOR_MAX_IMAGES = max(1, min(6, _env_int("CORRECTOR_MAX_IMAGES", 4)))
CORRECTOR_MAX_IMAGE_BYTES = max(256_000, min(6_000_000, _env_int("CORRECTOR_MAX_IMAGE_BYTES", 4_000_000)))

try:
    from corrector_knowledge import retrieve_corrector_context
except Exception:  # noqa: E722

    def retrieve_corrector_context(_exercise: str, _student_answer: str) -> str:
        return ""


def build_corrector_prompt(exercise: str, student_answer: str, *, lesson_context: str = "") -> str:
    context_block = ""
    if lesson_context.strip():
        context_block = f"""
Χρησιμοποίησε ως επίσημη αναφορά την παρακάτω ύλη μαθημάτων ΑΕΠΠ (από τα μαθήματα της πλατφόρμας).
Η βαθμολόγηση και τα σχόλια πρέπει να ευθυγραμμίζονται με αυτή την ύλη, τη σωστή ψευδογλώσσα και τα κριτήρια του μαθήματος:

\"\"\"
{lesson_context.strip()}
\"\"\"
"""

    return f"""Είσαι αυστηρός αλλά βοηθητικός καθηγητής Πληροφορικής Γ' Λυκείου (μάθημα ΑΕΠΠ).
{context_block}
Θα σου δοθεί η εκφώνηση μιας άσκησης και η απάντηση ενός μαθητή σε ελληνική ψευδογλώσσα.
Διόρθωσε την απάντηση ελέγχοντας:
- σωστή λογική λύσης
- σωστή χρήση μεταβλητών
- σωστή δήλωση μεταβλητών
- σωστή χρήση δομών ΑΝ...ΤΕΛΟΣ_ΑΝ, ΓΙΑ...ΤΕΛΟΣ_ΓΙΑ, ΟΣΟ...ΤΕΛΟΣ_ΟΣΟ, ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ...ΜΕΧΡΙΣ_ΟΤΟΥ
- σωστή σύνταξη ψευδογλώσσας (ΑΡΧΗ/ΤΕΛΟΣ προγράμματος, ΔΙΑΒΑΣΕ, ΓΡΑΨΕ, ανάθεση τιμών κ.λπ.)
- αν η απάντηση καλύπτει πλήρως την εκφώνηση

Βαθμολόγησε με βάση το ακόλουθο rubric (σύνολο 10 μονάδων):
- Λογική λύσης: 4 μονάδες
- Σωστή χρήση δομών: 2 μονάδες
- Μεταβλητές και δηλώσεις: 1 μονάδα
- Σύνταξη ψευδογλώσσας: 2 μονάδες
- Καθαρότητα λύσης: 1 μονάδα

Η εκφώνηση είναι:
\"\"\"
{exercise}
\"\"\"

Η απάντηση του μαθητή είναι:
\"\"\"
{student_answer}
\"\"\"

Απάντησε ΑΥΣΤΗΡΑ σε αυτή τη μορφή, χωρίς κανένα επιπλέον κείμενο πριν ή μετά:

Βαθμός: Χ/10
Σωστά:
- ...
- ...
Λάθη:
- ...
- ...
Διορθωμένη λύση:
```text
...
```
Εξήγηση:
..."""


def _parse_bullet_section(text: str) -> list[str]:
    items: list[str] = []
    for line in text.strip().splitlines():
        cleaned = line.strip()
        if not cleaned:
            continue
        cleaned = re.sub(r"^[-•*]\s*", "", cleaned)
        if cleaned:
            items.append(cleaned)
    return items


def parse_corrector_response(raw: str) -> dict[str, Any]:
    text = (raw or "").strip()
    if not text:
        return {"raw": raw or ""}

    score_match = re.search(r"Βαθμός:\s*(\d+(?:[.,]\d+)?)\s*/\s*10", text, re.IGNORECASE)
    score: int | float | None = None
    if score_match:
        score_val = score_match.group(1).replace(",", ".")
        score = float(score_val)
        if score.is_integer():
            score = int(score)

    correct_match = re.search(
        r"Σωστά:\s*(.*?)(?=\nΛάθη:|\nΔιορθωμένη λύση:|\nΕξήγηση:|$)",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    mistakes_match = re.search(
        r"Λάθη:\s*(.*?)(?=\nΔιορθωμένη λύση:|\nΕξήγηση:|$)",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    solution_match = re.search(
        r"Διορθωμένη λύση:\s*(?:```(?:text)?\s*)?(.*?)(?:```\s*)?(?=\nΕξήγηση:|$)",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    explanation_match = re.search(r"Εξήγηση:\s*(.*)$", text, re.DOTALL | re.IGNORECASE)

    correct_points = _parse_bullet_section(correct_match.group(1)) if correct_match else []
    mistakes = _parse_bullet_section(mistakes_match.group(1)) if mistakes_match else []
    corrected_solution = solution_match.group(1).strip() if solution_match else ""
    explanation = explanation_match.group(1).strip() if explanation_match else ""

    parsed_ok = score is not None or correct_points or mistakes or corrected_solution or explanation
    if not parsed_ok:
        return {"raw": text}

    result: dict[str, Any] = {
        "maxScore": 10,
        "correctPoints": correct_points,
        "mistakes": mistakes,
        "correctedSolution": corrected_solution,
        "explanation": explanation,
    }
    if score is not None:
        result["score"] = score
    return result


def _make_corrector_generate_config(*, max_output_tokens: int | None = None):
    assert types is not None
    gen_cfg_kwargs = dict(
        max_output_tokens=max_output_tokens or CORRECTOR_MAX_OUTPUT_TOKENS,
        temperature=0.35,
    )
    _tc = _optional_thinking_config()
    if _tc is not None:
        gen_cfg_kwargs["thinking_config"] = _tc
    return types.GenerateContentConfig(**gen_cfg_kwargs)


def _parse_image_data_url(data_url: str) -> tuple[str, bytes]:
    raw = (data_url or "").strip()
    if not raw:
        raise ValueError("Empty image payload")

    mime_type = "image/jpeg"
    payload = raw
    if raw.startswith("data:"):
        header, _, payload = raw.partition(",")
        if not payload:
            raise ValueError("Invalid image data URL")
        mime_match = re.match(r"data:([^;]+)", header)
        if mime_match:
            mime_type = mime_match.group(1).strip().lower()

    try:
        image_bytes = base64.b64decode(payload, validate=True)
    except Exception as exc:
        raise ValueError("Invalid base64 image payload") from exc

    if len(image_bytes) > CORRECTOR_MAX_IMAGE_BYTES:
        raise ValueError("Image too large")
    if not mime_type.startswith("image/"):
        raise ValueError("Unsupported image type")
    return mime_type, image_bytes


def _ocr_prompt_for(kind: Literal["exercise", "solution"]) -> str:
    if kind == "exercise":
        return (
            "Διάβασε προσεκτικά την/τις εικόνα/ες και εξήγαγε ΟΛΗ την εκφώνηση της άσκησης ΑΕΠΠ.\n"
            "Κράτα ακριβώς τη διατύπωση, αρίθμηση και σύμβολα.\n"
            "Αν υπάρχουν πολλές σελίδες, ενώσε το κείμενο με σειρά.\n"
            "Επίστρεψε ΜΟΝΟ το εξαγόμενο κείμενο, χωρίς σχόλια ή εξήγηση."
        )
    return (
        "Διάβασε προσεκτικά την/τις εικόνα/ες και εξήγαγε ΟΛΗ τη λύση σε ελληνική ψευδογλώσσα.\n"
        "Διατήρησε εσοχές, κεφαλαία, γραμμές κώδικα και εντολές (π.χ. ΑΡΧΗ_ΠΡΟΓΡΑΜΜΑΤΟΣ, ΟΣΟ, ΓΙΑ, ΤΕΛΟΣ_ΟΣΟ).\n"
        "Μην διορθώνεις λάθη του μαθητή — αντέγραψε ό,τι βλέπεις.\n"
        "Αν υπάρχουν πολλές σελίδες, ενώσε το κείμενο με σειρά.\n"
        "Επίστρεψε ΜΟΝΟ το εξαγόμενο κείμενο, χωρίς σχόλια ή εξήγηση."
    )


def extract_text_from_images(
    images: list[str],
    kind: Literal["exercise", "solution"],
) -> str:
    """OCR handwritten/printed exercise or pseudocode via Gemini vision."""
    if not images:
        return ""
    if not _GENAI_IMPORT_OK:
        raise RuntimeError("AI SDK not available")
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not configured")

    client = _get_genai_client()
    if client is None:
        raise RuntimeError("AI client not configured")

    assert types is not None
    parts: list[Any] = [types.Part(text=_ocr_prompt_for(kind))]
    for image_data in images[:CORRECTOR_MAX_IMAGES]:
        mime_type, image_bytes = _parse_image_data_url(image_data)
        parts.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type))

    try:
        response = client.models.generate_content(
            model=CORRECTOR_MODEL,
            contents=[types.Content(role="user", parts=parts)],
            config=_make_corrector_generate_config(max_output_tokens=CORRECTOR_OCR_MAX_OUTPUT_TOKENS),
        )
        text = (response.text or "").strip()
        if not text:
            raise RuntimeError("Empty OCR response")
        return text[:CORRECT_FIELD_MAX_LEN]
    except RuntimeError:
        raise
    except ValueError:
        raise
    except Exception as e:
        logger.exception("Gemini extract_text_from_images failed")
        raise RuntimeError(str(e)) from e


def correct_exercise(
    exercise: str,
    student_answer: str,
    *,
    exercise_images: list[str] | None = None,
    student_answer_images: list[str] | None = None,
) -> dict[str, Any]:
    """OCR images if needed, then grade pseudocode via Gemini."""
    if not _GENAI_IMPORT_OK:
        raise RuntimeError("AI SDK not available")
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not configured")

    resolved_exercise = (exercise or "").strip()
    resolved_answer = (student_answer or "").strip()
    used_ocr = False

    if not resolved_exercise and exercise_images:
        resolved_exercise = extract_text_from_images(exercise_images, "exercise").strip()
        used_ocr = True
    if not resolved_answer and student_answer_images:
        resolved_answer = extract_text_from_images(student_answer_images, "solution").strip()
        used_ocr = True

    if not resolved_exercise or not resolved_answer:
        raise ValueError("Missing exercise or student answer after OCR")

    if len(resolved_exercise) > CORRECT_FIELD_MAX_LEN or len(resolved_answer) > CORRECT_FIELD_MAX_LEN:
        raise ValueError("Extracted text too long")

    client = _get_genai_client()
    if client is None:
        raise RuntimeError("AI client not configured")

    prompt = build_corrector_prompt(
        resolved_exercise,
        resolved_answer,
        lesson_context=retrieve_corrector_context(resolved_exercise, resolved_answer),
    )
    assert types is not None

    try:
        response = client.models.generate_content(
            model=CORRECTOR_MODEL,
            contents=[types.Content(role="user", parts=[types.Part(text=prompt)])],
            config=_make_corrector_generate_config(),
        )
        raw_text = (response.text or "").strip()
        if not raw_text:
            raise RuntimeError("Empty AI response")
        result = parse_corrector_response(raw_text)
        if used_ocr:
            result["extractedExercise"] = resolved_exercise
            result["extractedStudentAnswer"] = resolved_answer
        return result
    except RuntimeError:
        raise
    except ValueError:
        raise
    except Exception as e:
        logger.exception("Gemini correct_exercise failed")
        raise RuntimeError(str(e)) from e

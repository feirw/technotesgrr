"""
ai_service.py  –  Google Gemini για το TechNotesGR chatbot
-----------------------------------------------------------
Χρησιμοποιεί το νέο επίσημο SDK: google-genai (ΟΧΙ google-generativeai)

Εγκατάσταση:
    pip uninstall google-generativeai -y
    pip install google-genai python-dotenv

.env αρχείο:
    GEMINI_API_KEY=your_api_key_here
"""

import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = (os.getenv("GEMINI_API_KEY") or "").strip()

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
""".strip()

_histories = {}
_MAX_HISTORY_ITEMS = 20
_MAX_SESSIONS = 200


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
            model="gemini-2.5-flash",
            contents=history,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=1024,
                temperature=0.7,
            ),
        )

        reply = response.text or "Δεν έχω απάντηση αυτή τη στιγμή. Δοκίμασε ξανά."

        history.append(types.Content(role="model", parts=[types.Part(text=reply)]))

        if len(history) > _MAX_HISTORY_ITEMS:
            _histories[session_id] = history[-_MAX_HISTORY_ITEMS:]

        return reply

    except Exception as e:
        error_str = str(e)
        print(f"[ai_service] Gemini error: {error_str}")

        if "429" in error_str or "quota" in error_str.lower():
            return "Εχω πολλα αιτηματα αυτη τη στιγμη. Δοκιμασε ξανα σε λιγα δευτερολεπτα!"
        if "403" in error_str or "API_KEY" in error_str:
            return "Προβλημα με την αυθεντικοποιηση. Επικοινωνησε με τον διαχειριστη."
        if "404" in error_str:
            return "Το AI μοντελο δεν ειναι διαθεσιμο αυτη τη στιγμη."

        return "Δεν μπορεσα να επεξεργαστω το αιτημα σου. Δοκιμασε ξανα σε λιγο."

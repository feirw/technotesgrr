"""
ai_service.py  –  Google Gemini backend για το TechNotesGR chatbot
-----------------------------------------------------------------
Απαιτήσεις:
    pip install google-generativeai python-dotenv

.env αρχείο (στον ίδιο φάκελο με το server.py):
    GEMINI_API_KEY=your_api_key_here
"""

import os
from dotenv import load_dotenv

load_dotenv()

import google.generativeai as genai

# ── Configuration ─────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "❌ Δεν βρέθηκε το GEMINI_API_KEY στο .env αρχείο!\n"
        "   Πρόσθεσε: GEMINI_API_KEY=your_api_key_here"
    )

genai.configure(api_key=GEMINI_API_KEY)

# ── System prompt – προσαρμόζεται στο TechNotesGR ────────────────────────────

SYSTEM_PROMPT = """
Είσαι ο ψηφιακός βοηθός του TechNotesGR, μια εκπαιδευτική πλατφόρμα για το μάθημα ΑΕΠΠ 
(Ανάπτυξη Εφαρμογών σε Προγραμματιστικό Περιβάλλον) της Γ' Λυκείου στην Ελλάδα.

Ρόλος σου:
- Απαντάς σε ερωτήσεις σχετικές με ΑΕΠΠ: αλγόριθμοι, δομές δεδομένων, προγραμματισμός, ΓΛΩΣΣΑ.
- Βοηθάς μαθητές να καταλάβουν ύλη, να λύσουν ασκήσεις και να προετοιμαστούν για εξετάσεις.
- Δίνεις πληροφορίες για τις λειτουργίες της πλατφόρμας: σημειώσεις, quiz, flashcards, leaderboard.
- Απαντάς πάντα στα Ελληνικά, με φιλικό και ενθαρρυντικό τόνο.
- Χρησιμοποιείς απλή γλώσσα κατάλληλη για μαθητές Λυκείου.
- Αν δεν ξέρεις κάτι, το παραδέχεσαι ειλικρινά.
- Δεν απαντάς σε άσχετα θέματα (πολιτική, ειδήσεις κ.λπ.).

Μορφοποίηση:
- Χρησιμοποίησε markdown για κώδικα (```), λίστες και έντονο κείμενο όπου χρειάζεται.
- Κράτα τις απαντήσεις συνοπτικές αλλά πλήρεις.
""".strip()

# ── Model init ────────────────────────────────────────────────────────────────

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",   # γρήγορο και δωρεάν tier
    system_instruction=SYSTEM_PROMPT,
)

# ── Chat history (in-memory, per-process) ─────────────────────────────────────
# Για πολύ-γύρη συνομιλία: κρατάμε ένα global history.
# Αν θέλεις per-user history, πέρασέ το session_id από το frontend.

_chat_session = model.start_chat(history=[])


# ── Public API ────────────────────────────────────────────────────────────────

def get_ai_response(message: str) -> str:
    """
    Στέλνει μήνυμα στο Gemini και επιστρέφει την απάντηση ως string.
    Σε περίπτωση σφάλματος επιστρέφει φιλικό μήνυμα λάθους.
    """
    try:
        response = _chat_session.send_message(message)
        return response.text

    except genai.types.BlockedPromptException:
        return "⚠️ Το μήνυμά σου εμποδίστηκε από τα φίλτρα ασφαλείας. Δοκίμασε διαφορετική διατύπωση."

    except genai.types.StopCandidateException:
        return "⚠️ Η απάντηση διακόπηκε. Παρακαλώ δοκίμασε ξανά."

    except Exception as e:
        print(f"[ai_service] Gemini error: {e}")
        return "😔 Δεν μπόρεσα να επεξεργαστώ το αίτημά σου αυτή τη στιγμή. Δοκίμασε ξανά σε λίγο."
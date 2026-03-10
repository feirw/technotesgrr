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

# ✅ Νέο SDK - όχι το deprecated google.generativeai
from google import genai
from google.genai import types

# ── API Key check ─────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "❌ Δεν βρέθηκε το GEMINI_API_KEY στο .env αρχείο!\n"
        "   Πρόσθεσε: GEMINI_API_KEY=your_api_key_here"
    )

# ── Client ────────────────────────────────────────────────────────────────────

client = genai.Client(api_key=GEMINI_API_KEY)

# ── System prompt ─────────────────────────────────────────────────────────────

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

# ── Chat history (in-memory) ──────────────────────────────────────────────────

_history = []

# ── Public API ────────────────────────────────────────────────────────────────

def get_ai_response(message: str) -> str:
    global _history

    try:
        _history.append(
            types.Content(role="user", parts=[types.Part(text=message)])
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=_history,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=1024,
                temperature=0.7,
            ),
        )

        reply = response.text

        _history.append(
            types.Content(role="model", parts=[types.Part(text=reply)])
        )

        # Κρατα μονο τα τελευταια 20 μηνυματα
        if len(_history) > 20:
            _history = _history[-20:]

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
"""
corrector_service.py  –  AI Corrector (ΑΕΠΠ exercise grading via Gemini Vision)
-------------------------------------------------------------------------------
Στέλνει εικόνα μαθητικής λύσης στο Gemini Vision, λαμβάνει δομημένη JSON
βαθμολόγηση, και επιστρέφει αναλυτικά αποτελέσματα.
"""

import base64
import json
import logging
import os
import re
from typing import Any

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("technotesgr.corrector")

GEMINI_API_KEY = (os.getenv("GEMINI_API_KEY") or "").strip()
GEMINI_MODEL = (os.getenv("GEMINI_MODEL") or "gemini-2.5-flash").strip()

try:
    from google import genai
    from google.genai import types

    _GENAI_OK = True
except ImportError:
    genai = None  # type: ignore[assignment]
    types = None  # type: ignore[assignment]
    _GENAI_OK = False

_client = None


def _get_client():
    global _client
    if not _GENAI_OK or not GEMINI_API_KEY:
        return None
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


CORRECTOR_SYSTEM_PROMPT = """
Είσαι αυστηρός αλλά παιδαγωγικός βαθμολογητής πανελλαδικών εξετάσεων στο μάθημα
ΑΕΠΠ (Ανάπτυξη Εφαρμογών σε Προγραμματιστικό Περιβάλλον) – Πληροφορική Γ' Λυκείου, Ελλάδα.

# ΤΙ ΚΑΝΕΙΣ
1. Κοιτάς την εικόνα που σου δίνεται (χειρόγραφο ή τυπωμένο).
2. Αναγνωρίζεις την εκφώνηση (αν φαίνεται) και τις απαντήσεις του μαθητή.
3. Βαθμολογείς ΚΑΘΕ ερώτημα/υποερώτημα ξεχωριστά.
4. Ακολουθείς ΑΥΣΤΗΡΑ τη φιλοσοφία βαθμολόγησης πανελλαδικών ΑΕΠΠ:
   - Σωστή δομή αλγορίθμου/προγράμματος (ΑΡΧΗ, ΜΕΤΑΒΛΗΤΕΣ, ΤΕΛΟΣ κ.λπ.)
   - Σωστή χρήση δομών (ΑΝ, ΟΣΟ, ΓΙΑ, ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ κ.λπ.)
   - Ορθή λογική και αποτελεσματικότητα
   - Σωστοί τύποι μεταβλητών
   - Ορθή χρήση πινάκων, στοιβών, ουρών, υποπρογραμμάτων
   - Μικρά συντακτικά λάθη (π.χ. λείπει ΤΕΛΟΣ_ΑΝ) χάνουν λιγότερο
   - Λογικά λάθη χάνουν περισσότερο
   - Εντελώς λανθασμένη ή κενή απάντηση = 0
5. Αν η εικόνα δεν είναι καθαρή ή δεν μπορείς να διαβάσεις κάτι,
   σημείωσέ το και ζήτα διευκρίνιση.

# ΥΛΗ ΑΕΠΠ ΠΟΥ ΓΝΩΡΙΖΕΙΣ
- Αλγόριθμοι: σειριακή/δυαδική αναζήτηση, ταξινόμηση φυσαλίδας, μέγιστο/ελάχιστο
- Δομές δεδομένων: πίνακες (1Δ, 2Δ), στοίβα, ουρά
- Δομές ελέγχου: ΑΝ/ΑΛΛΙΩΣ, ΟΣΟ, ΓΙΑ, ΜΕΧΡΙΣ_ΟΤΟΥ
- Υποπρογράμματα: συναρτήσεις, διαδικασίες
- ΓΛΩΣΣΑ (ψευδογλώσσα ελληνικού εκπαιδευτικού συστήματος)
- Θεωρία: τύποι δεδομένων, μεταβλητές, σταθερές, τελεστές, εκφράσεις
- Διαγράμματα ροής

# ΜΟΡΦΗ ΕΞΟΔΟΥ
Απάντησε ΑΠΟΚΛΕΙΣΤΙΚΑ σε JSON (χωρίς markdown fences, χωρίς σχόλια πριν/μετά).
Χρησιμοποίησε ΑΚΡΙΒΩΣ αυτή τη δομή:

{
  "image_quality": "clear" | "partial" | "unclear",
  "image_quality_note": "αν υπάρχει πρόβλημα ανάγνωσης, εξήγησε εδώ, αλλιώς null",
  "detected_exercise_type": "Θέμα Α | Θέμα Β | Θέμα Γ | Θέμα Δ | Μεμονωμένη Άσκηση | Άγνωστο",
  "detected_exercise_title": "σύντομη περιγραφή εκφώνησης (π.χ. 'Ταξινόμηση πίνακα με φυσαλίδα')",
  "questions": [
    {
      "number": "π.χ. Γ1, Δ2, 1α κ.λπ.",
      "topic": "π.χ. Δηλώσεις μεταβλητών, Δομή Επανάληψης, Πίνακες κ.λπ.",
      "student_answer_summary": "τι έγραψε ο μαθητής (σύνοψη)",
      "is_correct": true/false,
      "score": 0,
      "max_score": 0,
      "errors": [
        {
          "description": "περιγραφή λάθους",
          "severity": "minor | major | critical",
          "points_lost": 0
        }
      ],
      "correct_answer": "η πλήρης σωστή απάντηση",
      "feedback": "αναλυτική εξήγηση — γιατί είναι σωστό/λάθος, πώς διορθώνεται",
      "improvement_tips": ["συμβουλή 1", "συμβουλή 2"]
    }
  ],
  "total_score": 0,
  "max_total_score": 0,
  "percentage": 0,
  "grade_label": "Άριστα | Πολύ Καλά | Καλά | Μέτρια | Ανεπαρκώς",
  "overall_feedback": "γενική αξιολόγηση του μαθητή",
  "strengths": ["δυνατό σημείο 1"],
  "weaknesses": ["αδύνατο σημείο 1"],
  "study_recommendations": ["πρόταση μελέτης 1"],
  "confidence_score": 0.0
}

# ΚΑΝΟΝΕΣ
- Αν δεν είσαι σίγουρος, βάλε confidence_score < 0.7 και εξήγησε στο image_quality_note.
- Μην επινοείς απαντήσεις — αν δεν φαίνεται η εκφώνηση, αξιολόγησε μόνο τον κώδικα.
- Η βαθμολογία κάθε ερωτήματος πρέπει να αθροίζει στο total_score.
- Οι μονάδες (max_score) να ακολουθούν τα πραγματικά μόρια αν φαίνονται, αλλιώς βάλε εύλογες τιμές.
- ΠΑΝΤΑ στα Ελληνικά.
""".strip()


def _extract_json(raw: str) -> dict[str, Any]:
    """Αφαιρεί markdown fences / trailing text και κάνει parse JSON."""
    text = raw.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```\s*$", "", text)
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1:
        text = text[first_brace : last_brace + 1]
    return json.loads(text)


def grade_image(
    image_bytes: bytes,
    mime_type: str = "image/jpeg",
    additional_context: str = "",
) -> dict[str, Any]:
    """
    Στέλνει εικόνα στο Gemini Vision και επιστρέφει δομημένη βαθμολόγηση.
    Raises RuntimeError σε αποτυχία.
    """
    if not _GENAI_OK:
        raise RuntimeError("Η βιβλιοθήκη google-genai δεν είναι εγκατεστημένη στον server.")
    if not GEMINI_API_KEY:
        raise RuntimeError("Δεν έχει ρυθμιστεί GEMINI_API_KEY.")

    client = _get_client()
    if client is None:
        raise RuntimeError("Αδυναμία σύνδεσης με το Gemini API.")

    assert types is not None

    user_text = "Διόρθωσε και βαθμολόγησε τις απαντήσεις του μαθητή στην εικόνα."
    if additional_context:
        user_text += f"\n\nΠρόσθετο πλαίσιο από τον μαθητή: {additional_context}"

    thinking_cfg = types.ThinkingConfig(thinking_budget=8192)

    config = types.GenerateContentConfig(
        system_instruction=CORRECTOR_SYSTEM_PROMPT,
        max_output_tokens=8192,
        temperature=0.2,
        thinking_config=thinking_cfg,
    )

    image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
    text_part = types.Part(text=user_text)

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[types.Content(role="user", parts=[image_part, text_part])],
            config=config,
        )
    except Exception as e:
        logger.exception("Gemini Vision grade_image failed")
        err = str(e)
        if "429" in err or "quota" in err.lower():
            raise RuntimeError("Πολλά αιτήματα — δοκίμασε ξανά σε λίγο.") from e
        if "403" in err or "API_KEY" in err:
            raise RuntimeError("Πρόβλημα αυθεντικοποίησης με το Gemini API.") from e
        raise RuntimeError("Αποτυχία επικοινωνίας με το AI. Δοκίμασε ξανά.") from e

    raw_text = (response.text or "").strip()
    if not raw_text:
        raise RuntimeError("Το AI δεν επέστρεψε απάντηση. Δοκίμασε πιο καθαρή εικόνα.")

    try:
        result = _extract_json(raw_text)
    except json.JSONDecodeError:
        logger.error("Failed to parse Gemini response as JSON: %s", raw_text[:500])
        raise RuntimeError(
            "Δεν ήταν δυνατή η ανάλυση της απάντησης. Δοκίμασε ξανά ή ανέβασε πιο καθαρή εικόνα."
        )

    if "questions" not in result:
        result["questions"] = []
    if "total_score" not in result:
        result["total_score"] = sum(q.get("score", 0) for q in result["questions"])
    if "max_total_score" not in result:
        result["max_total_score"] = sum(q.get("max_score", 0) for q in result["questions"])
    if result["max_total_score"] > 0:
        result["percentage"] = round(result["total_score"] / result["max_total_score"] * 100, 1)
    else:
        result["percentage"] = 0

    return result


def grade_image_base64(
    image_b64: str,
    mime_type: str = "image/jpeg",
    additional_context: str = "",
) -> dict[str, Any]:
    """Convenience wrapper: δέχεται base64 string αντί bytes."""
    image_bytes = base64.b64decode(image_b64)
    return grade_image(image_bytes, mime_type, additional_context)

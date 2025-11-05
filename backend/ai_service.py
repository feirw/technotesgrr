# backend/ai_service.py
from google import genai
from google.genai import types
import os
import json
from database import (
    get_quizzes_from_db,
)  

def load_all_quiz_questions_and_answers():
    """Φορτώνει όλες τις ερωτήσεις και τις σωστές απαντήσεις από τη βάση δεδομένων για το AI context."""
    try:
        questions = get_quizzes_from_db()
    except Exception as e:
        print(f"ERROR: Failed to load quizzes from DB for AI Knowledge Base: {e}")
        return "Δεν είναι διαθέσιμο εκπαιδευτικό υλικό."

    context = []
    for q in questions:
        answers = json.loads(q["answers"])
        correct_answer = next(
            (ans["text"] for ans in answers if ans.get("correct", False)),
            "Δεν βρέθηκε σωστή απάντηση",
        )

        context.append(
            f"Κεφάλαιο: {q.get('chapter', 'Άγνωστο')}, Κατηγορία: {q.get('category', 'Άγνωστη')}\n"
            f"Ερώτηση: {q['question']}\n"
            f"Σωστή απάντηση: {correct_answer}\n"
        )

    return "\n---\n".join(context)


KNOWLEDGE_BASE = load_all_quiz_questions_and_answers()

try:
    client = genai.Client()
except Exception as e:
    print(f"Gemini Client Initialization Error: {e}")
    client = None  

def get_ai_response(user_message: str):
    """
    Δίνει το ερώτημα του χρήστη στο μοντέλο, μαζί με το εκπαιδευτικό context.
    """
    if not client:
        return "Λυπάμαι, το σύστημα AI δεν είναι σωστά αρχικοποιημένο."

    system_instruction = (
        "Είσαι ο ψηφιακός βοηθός του technotesgr, ενός εκπαιδευτικού site για την Πληροφορική "
        "της Γ' Λυκείου (ΑΕΠΠ). Ο στόχος σου είναι να απαντάς σε ερωτήσεις μαθητών "
        "με βάση το υλικό που σου παρέχεται. Χρησιμοποίησε ελληνικά, να είσαι φιλικός, υποστηρικτικός και εκπαιδευτικός. "
        "Εάν η ερώτηση αφορά την ΑΕΠΠ ή την Πληροφορική, απάντησε με βάση το παρακάτω πλαίσιο. "
        "Αν η ερώτηση είναι άσχετη, απάντησε ευγενικά ότι δεν μπορείς να βοηθήσεις σε αυτό, αλλά μπορείς να απαντήσεις "
        "σε ερωτήσεις για την ΑΕΠΠ."
    )

    full_prompt = (
        f"--- ΠΛΑΙΣΙΟ ΓΝΩΣΕΩΝ (CONTEXT) ---\n"
        f"Χρησιμοποίησε τις παρακάτω πληροφορίες για να απαντήσεις στις ερωτήσεις.\n\n"
        f"{KNOWLEDGE_BASE}\n\n"
        f"------------------------------------\n"
        f"Ερώτηση χρήστη: {user_message}"
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt,
            config=types.GenerateContentConfig(system_instruction=system_instruction),
        )
        return response.text
    except Exception as e:
        print(f"AI API Call Error: {e}")
        if "API_KEY_INVALID" in str(e):
            return "Προέκυψε σφάλμα: Το Gemini API Key είναι μη έγκυρο. Παρακαλώ ενημερώστε το διαχειριστή."
        return "Λυπάμαι, αντιμετωπίζω ένα τεχνικό πρόβλημα αυτή τη στιγμή. Παρακαλώ δοκιμάστε ξανά αργότερα."

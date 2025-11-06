from google import genai
from google.genai import types
import os
import json
from database import (
    get_quizzes_from_db,
    get_flashcards_from_db, 
    get_unique_chapters, 
)  
from constants import CHAPTER_NAME_MAP, URL_MAPPINGS, CHAPTERS_WITH_EXAMS 

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


def get_link_knowledge_base():
    """
    Δυναμικά δημιουργεί τη βάση γνώσεων των συνδέσμων
    βασιζόμενη στα μοναδικά κεφάλαια που υπάρχουν στις βάσεις δεδομένων.
    """
    link_data = []
    
    chapter_keys = get_unique_chapters()
    
    all_quizzes = get_quizzes_from_db()
    all_flashcards = get_flashcards_from_db()
    
    for key in sorted(list(chapter_keys)):
        title = CHAPTER_NAME_MAP.get(key, f"Κεφάλαιο {key}")
        
        links = []
        
        if key in URL_MAPPINGS:
             links.append(f"[{title}]({URL_MAPPINGS[key]})")
             
        if any(q['chapter'] == key for q in all_quizzes):
            links.append(f"[Quiz για {title}]({URL_MAPPINGS['default_quiz']})") 
        
        if any(f['chapter'] == key for f in all_flashcards):
            links.append(f"[Flashcards για {title}]({URL_MAPPINGS['default_flashcard']})") 

        if key in CHAPTERS_WITH_EXAMS:
             links.append(f"[Διαγωνίσματα/Σημειώσεις για {title}]({URL_MAPPINGS['notes']})") 

        
        if links:
            unique_links = list(dict.fromkeys(links)) 
            link_data.append(f"Θέμα: {title}: {', '.join(unique_links)}")
    
    if 'algorithms' not in chapter_keys:
         link_data.append(f"Θέμα: Εκπαιδευτικά Παιχνίδια Αλγορίθμων: [Παιχνίδια Αλγορίθμων]({URL_MAPPINGS['algorithms']})")
    if 'paliathemata' not in chapter_keys:
         link_data.append(f"Θέμα: Παλιά Θέματα Πανελληνίων: [Παλιά Θέματα]({URL_MAPPINGS['paliathemata']})")

    return "\n---\n".join(link_data)

KNOWLEDGE_BASE = load_all_quiz_questions_and_answers()
LINK_KNOWLEDGE_BASE = get_link_knowledge_base()

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
        "Εάν η ερώτηση αφορά ένα θέμα, **ΟΠΩΣΔΗΠΟΤΕ** να συμπεριλάβεις στο τέλος της απάντησης "
        "έναν ή περισσότερους σχετικούς συνδέσμους από την ενότητα 'ΣΥΝΔΕΣΜΟΙ ΠΛΑΤΦΟΡΜΑΣ', χρησιμοποιώντας τη μορφή Markdown: [Περιγραφή](URL). "
        "Εάν η ερώτηση είναι άσχετη, απάντησε ευγενικά ότι δεν μπορείς να βοηθήσεις σε αυτό, αλλά μπορείς να απαντήσεις "
        "σε ερωτήσεις για την ΑΕΠΠ."
    )

    full_prompt = (
        f"--- ΠΛΑΙΣΙΟ ΓΝΩΣΕΩΝ (CONTEXT) ---\n"
        f"Χρησιμοποίησε τις παρακάτω πληροφορίες για να απαντήσεις στις ερωτήσεις.\n\n"
        f"{KNOWLEDGE_BASE}\n\n"
        f"--- ΣΥΝΔΕΣΜΟΙ ΠΛΑΤΦΟΡΜΑΣ ---\n"
        f"Χρησιμοποίησε τους παρακάτω συνδέσμους για να παραπέμψεις τον χρήστη σε σχετικό υλικό:\n\n"
        f"{LINK_KNOWLEDGE_BASE}\n\n"
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
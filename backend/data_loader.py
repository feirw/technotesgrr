import json
import os
from pathlib import Path
from database import get_db_connection

# Paths to data directories
QUIZ_DATA_DIR = Path(__file__).parent.parent / "frontend" / "src" / "data" / "quizzes"
FLASHCARD_DATA_DIR = (
    Path(__file__).parent.parent / "frontend" / "src" / "data" / "flashcards"
)


def extract_chapter_from_filename(filename):
    """Extract chapter number from filename"""
    # Remove .json extension
    name = filename.replace(".json", "")

    # Try to extract chapter number from common patterns
    if "chap" in name.lower():
        # Extract number after 'chap'
        import re

        match = re.search(r"chap(\d+)", name.lower())
        if match:
            return match.group(1)

    # If no chapter pattern found, use the filename itself
    return name


def generate_category_from_filename(filename, data_type):
    """Generate a readable category from filename and data type

    Args:
        filename: The filename without path
        data_type: Either 'quiz' or 'flashcard'
    """
    name = filename.replace(".json", "").replace("_", " ").replace("-", " ")

    # Special mappings for common abbreviations based on data type
    category_mappings = {
        "quiz": {
            "chap1": "Ανάλυση προβλήματος",
            "chap2": "Βασικές έννοιες αλγορίθμων",
            "chap3": "Δομές δεδομένων και Αλγόριθμοι",
            "chap6": "Εισαγωγή στον προγραμματισμό",
            "chap7": "Βασικές έννοιες προγραμματισμού",
            "chap8": "Επιλογή και επανάληψη",
            "chap10": "Υποπρογράμματα",
            "stack": "Στοίβα",
            "queue": "Ουρά",
            "lists": "Λίστες",
            "trees": "Δένδρα",
            "oop": "Αντικειμενοστραφής προγραμματισμός",
            "debug": "Εκσφαλμάτωση",
        },
        "flashcard": {
            "chap1": "Ανάλυση προβλήματος",
            "chap2": "Βασικές έννοιες αλγορίθμων",
            "chap3": "Δομές δεδομένων και Αλγόριθμοι",
            "chap4": "Εισαγωγή στον προγραμματισμό",
            "chap5": "Βασικές έννοιες προγραμματισμού",
            "chap6": "Επιλογή και επανάληψη",
            "chap7": "Υποπρογράμματα",
            "chap8": "Στοίβα",
            "chap9": "Ουρά",
            "chap10": "Λίστες",
            "chap11": "Δένδρα",
            "chap12": "Γράφοι",
            "chap13": "Τεχνικές σχεδίασης και ανάλυσης αλγορίθμων",
            "chap14": "Αντικειμενοστραφής προγραμματισμός",
            "chap15": "Εκσφαλμάτωση",
        },
    }

    # Check if we have a specific mapping for this data type
    lower_name = name.lower().strip()
    if data_type in category_mappings and lower_name in category_mappings[data_type]:
        return category_mappings[data_type][lower_name]

    # Otherwise, title case the name and add the data type
    return f"{name.title()} ({data_type.title()})"


def load_quizzes_to_db():
    """Load all quiz questions from JSON files to Supabase (Postgres)"""

    if not QUIZ_DATA_DIR.exists():
        print(f"Quiz directory not found: {QUIZ_DATA_DIR}")
        return

    # Get all JSON files in the quizzes directory
    json_files = list(QUIZ_DATA_DIR.glob("*.json"))

    if not json_files:
        print(f"No JSON files found in {QUIZ_DATA_DIR}")
        return

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # Clear existing quiz data using TRUNCATE (Fast for Postgres)
            cursor.execute("TRUNCATE TABLE quizzes")
            print("Cleared existing quiz data")

            total_loaded = 0

            for file_path in json_files:
                filename = file_path.name
                chapter = extract_chapter_from_filename(filename)
                category = generate_category_from_filename(filename, "quiz")

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        questions = json.load(f)

                    if not isinstance(questions, list):
                        print(f"Warning: {filename} does not contain a list of questions, skipping...")
                        continue

                    file_question_count = 0
                    for question in questions:
                        # Handle different question formats
                        question_id = question.get("id", file_question_count + 1)
                        question_text = question.get("question", question.get("text", ""))

                        # Handle different answer formats
                        answers = question.get("answers", question.get("options", []))

                        # Skip if essential fields are missing
                        if not question_text or not answers:
                            print(f"Warning: Skipping incomplete question in {filename}")
                            continue

                        # Create unique ID
                        unique_id = f"ch{chapter}_q{question_id}"

                        # Insert into database (Postgres syntax)
                        cursor.execute(
                            """
                            INSERT INTO quizzes (id, question, answers, category, chapter, source_file, points)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (id) DO UPDATE 
                            SET question = EXCLUDED.question,
                                answers = EXCLUDED.answers,
                                category = EXCLUDED.category,
                                points = EXCLUDED.points
                            """,
                            (
                                unique_id,
                                question_text,
                                json.dumps(answers),  # Serialize list to JSON string for JSONB column
                                category,
                                chapter,
                                filename,
                                question.get("points", 10),
                            ),
                        )
                        file_question_count += 1
                        total_loaded += 1

                    print(f"Loaded {file_question_count} questions from {filename} (Category: {category}, Chapter: {chapter})")

                except (json.JSONDecodeError, FileNotFoundError, UnicodeDecodeError) as e:
                    print(f"Error loading {filename}: {e}")
                    continue
                except Exception as e:
                    print(f"Unexpected error loading {filename}: {e}")
                    continue

        conn.commit()
        print(f"Total quiz questions loaded: {total_loaded}")


def load_flashcards_to_db():
    """Load all flashcards from JSON files to Supabase (Postgres)"""

    if not FLASHCARD_DATA_DIR.exists():
        print(f"Flashcard directory not found: {FLASHCARD_DATA_DIR}")
        return

    # Get all JSON files in the flashcards directory
    json_files = list(FLASHCARD_DATA_DIR.glob("*.json"))

    if not json_files:
        print(f"No JSON files found in {FLASHCARD_DATA_DIR}")
        return

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            # Clear existing flashcard data
            cursor.execute("TRUNCATE TABLE flashcards")
            print("Cleared existing flashcard data")

            total_loaded = 0

            for file_path in json_files:
                filename = file_path.name
                chapter = extract_chapter_from_filename(filename)
                category = generate_category_from_filename(filename, "flashcard")

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        flashcards = json.load(f)

                    if not isinstance(flashcards, list):
                        print(f"Warning: {filename} does not contain a list of flashcards, skipping...")
                        continue

                    file_flashcard_count = 0
                    for flashcard in flashcards:
                        # Handle different flashcard formats
                        flashcard_id = flashcard.get("id", file_flashcard_count + 1)

                        # Try different field names for question/front
                        question = (
                            flashcard.get("question")
                            or flashcard.get("front")
                            or flashcard.get("term")
                            or flashcard.get("prompt", "")
                        )

                        # Try different field names for answer/back
                        answer = (
                            flashcard.get("answer")
                            or flashcard.get("back")
                            or flashcard.get("definition")
                            or flashcard.get("response", "")
                        )

                        # Skip if essential fields are missing
                        if not question or not answer:
                            print(f"Warning: Skipping incomplete flashcard in {filename}")
                            continue

                        # Create unique ID
                        unique_id = f"fc_{chapter}_{flashcard_id}"

                        # Insert into database (Postgres syntax)
                        cursor.execute(
                            """
                            INSERT INTO flashcards (id, question, answer, category, chapter, source_file)
                            VALUES (%s, %s, %s, %s, %s, %s)
                            ON CONFLICT (id) DO UPDATE
                            SET question = EXCLUDED.question,
                                answer = EXCLUDED.answer,
                                category = EXCLUDED.category
                            """,
                            (unique_id, question, answer, category, chapter, filename),
                        )
                        file_flashcard_count += 1
                        total_loaded += 1

                    print(f"Loaded {file_flashcard_count} flashcards from {filename} (Category: {category}, Chapter: {chapter})")

                except (json.JSONDecodeError, FileNotFoundError, UnicodeDecodeError) as e:
                    print(f"Error loading {filename}: {e}")
                    continue
                except Exception as e:
                    print(f"Unexpected error loading {filename}: {e}")
                    continue

        conn.commit()
        print(f"Total flashcards loaded: {total_loaded}")


def scan_directories():
    """Scan and display information about available JSON files"""
    print("Scanning data directories...\n")

    print(f"Quiz Directory: {QUIZ_DATA_DIR}")
    if QUIZ_DATA_DIR.exists():
        quiz_files = list(QUIZ_DATA_DIR.glob("*.json"))
        print(f"Found {len(quiz_files)} quiz files:")
        for file_path in quiz_files:
            print(f"  - {file_path.name}")
    else:
        print("  Directory not found!")

    print(f"\nFlashcard Directory: {FLASHCARD_DATA_DIR}")
    if FLASHCARD_DATA_DIR.exists():
        flashcard_files = list(FLASHCARD_DATA_DIR.glob("*.json"))
        print(f"Found {len(flashcard_files)} flashcard files:")
        for file_path in flashcard_files:
            print(f"  - {file_path.name}")
    else:
        print("  Directory not found!")

    print()


def main():
    """Main function to load all data"""
    print("=== Data Loading Script (Supabase/Postgres) ===\n")

    # Scan directories first
    scan_directories()

    # Note: init_database() call removed as schema is managed by Supabase SQL Editor
    
    print("\nLoading quiz data...")
    load_quizzes_to_db()

    print("\nLoading flashcard data...")
    load_flashcards_to_db()

    print("\n=== Data loading complete! ===")

    # Display summary
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM quizzes")
                quiz_count = cursor.fetchone()[0]

                cursor.execute("SELECT COUNT(*) FROM flashcards")
                flashcard_count = cursor.fetchone()[0]

                cursor.execute("SELECT COUNT(*) FROM leaderboard")
                leaderboard_count = cursor.fetchone()[0]

                cursor.execute("SELECT COUNT(*) FROM quiz_submissions")
                submission_count = cursor.fetchone()[0]

                print(f"\n=== Database Summary ===")
                print(f"📚 Quizzes: {quiz_count}")
                print(f"🃏 Flashcards: {flashcard_count}")
                print(f"🏆 Leaderboard entries: {leaderboard_count}")
                print(f"📝 Quiz submissions: {submission_count}")

                # Show categories
                cursor.execute("SELECT DISTINCT category FROM quizzes ORDER BY category")
                quiz_categories = [row[0] for row in cursor.fetchall()]
                if quiz_categories:
                    print(f"\n📖 Quiz Categories:")
                    for category in quiz_categories:
                        print(f"  - {category}")

                cursor.execute("SELECT DISTINCT category FROM flashcards ORDER BY category")
                flashcard_categories = [row[0] for row in cursor.fetchall()]
                if flashcard_categories:
                    print(f"\n🃏 Flashcard Categories:")
                    for category in flashcard_categories:
                        print(f"  - {category}")

    except Exception as e:
        print(f"\nError fetching summary: {e}")
        print("Please check your database connection string and network status.")


if __name__ == "__main__":
    main()
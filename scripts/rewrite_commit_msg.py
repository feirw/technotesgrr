#!/usr/bin/env python3
"""Rewrite git commit messages to readable Greek/English descriptions."""

import os
import re
import subprocess
import sys

KEEP_PREFIXES = (
    "Merge pull request",
    "Merge branch",
    "Merge remote",
    "Initial commit",
    "Merge origin/",
)

EXACT_MAP = {
    "aa": "chore: μικρές ενημερώσεις UI και routes",
    "a": "chore: μικρές διορθώσεις",
    "aaa": "chore: μικρές ενημερώσεις",
    "m": "chore: μικρές αλλαγές",
    "q": "chore: μικρές αλλαγές",
    "yes": "chore: μικρές αλλαγές",
    "all": "chore: γενικές ενημερώσεις",
    "katw": "style: προσαρμογή layout",
    "button": "feat: προσθήκη κουμπιού",
    "colors": "style: ενημέρωση χρωμάτων",
    "lead": "feat: ενημέρωση landing page",
    "fix": "fix: διόρθωση σφάλματος",
    "prox": "chore: μικρές αλλαγές",
    "center": "style: στοίχιση στο κέντρο",
    "flash": "feat: flashcards",
    "json": "chore: ενημέρωση JSON δεδομένων",
    "appjs": "refactor: ενημέρωση App",
    "backend": "feat: backend API",
    "backendfic": "fix: διορθώσεις backend",
    "aboutme": "feat: σελίδα About Me",
    "readme": "docs: ενημέρωση README",
    "site": "feat: αρχική έκδοση site",
    "home": "feat: αρχική σελίδα",
    "homepage": "feat: αρχική σελίδα",
    "icons": "feat: εικονίδια",
    "cursor": "chore: ρυθμίσεις Cursor",
    "rm dist": "chore: αφαίρεση frontend/dist από tracking",
    "rm db": "chore: αφαίρεση database αρχείων",
    "chatbotfast": "feat: βελτιστοποίηση chatbot AI",
    "method": "feat: ασκήσεις, μεθοδολογίες Στοίβα/Ουρά",
    "cookies": "feat: banner cookies και scroll στην κορυφή",
    "addedserverai": "feat: AI server backend",
    "addedflashcards": "feat: flashcards",
    "flashcards": "feat: flashcards",
    "flashcards changed": "refactor: αλλαγές flashcards",
    "flashcards fixed": "fix: διορθώσεις flashcards",
    "quizes": "feat: κουίζ",
    "quizzes": "feat: κουίζ",
    "qyizes": "feat: κουίζ",
    "quiz updated": "feat: ενημέρωση κουίζ",
    "privacypol": "feat: πολιτική απορρήτου",
    "onlinemathmata": "feat: online μαθήματα",
    "diagonismata": "feat: διαγωνίσματα",
    "diagonismataonomata": "feat: ονόματα διαγωνισμάτων",
    "ui&diagonismata": "feat: UI και διαγωνίσματα",
    "problemloginsolved": "fix: διόρθωση login",
    "chnagebackground": "style: αλλαγή background",
    "changedtheversion": "chore: ενημέρωση έκδοσης",
    "textschange": "content: αλλαγή κειμένων",
    "removemergent": "chore: αφαίρεση Mergent",
    "remove unused code.": "chore: αφαίρεση αχρησιμοποίητου κώδικα",
    "navigation fix": "fix: διόρθωση navigation",
    "goalsmd": "docs: goals.md",
    "flashbacksseflashcards": "refactor: flashcards",
    "προσθηκηκουμπιων": "feat: προσθήκη κουμπιών",
    "errors": "fix: διόρθωση σφαλμάτων",
    "maybe fix": "fix: πιθανή διόρθωση",
    "minor fixes": "fix: μικρές διορθώσεις",
    "minor patch": "fix: μικρό patch",
    "changes": "chore: αλλαγές",
    "change": "chore: αλλαγές",
    "updated flashcards dialog and created data files": "feat: flashcards dialog και data files",
    "Format code and fix bug": "refactor: μορφοποίηση κώδικα και bug fix",
    "Format code": "style: μορφοποίηση κώδικα",
    "format the code": "style: μορφοποίηση κώδικα",
    "format code": "style: μορφοποίηση κώδικα",
    "Prettier formatted the code": "style: μορφοποίηση με Prettier",
    "Comment formatting": "style: μορφοποίηση σχολίων",
    "update deps": "chore: ενημέρωση dependencies",
    "Update to bun": "chore: μετάβαση σε Bun",
    "Swap to Vite": "chore: μετάβαση σε Vite",
    "Will rewrite in Typescript": "refactor: προετοιμασία TypeScript migration",
    "Completely rewritten in TS": "refactor: πλήρης μετάβαση σε TypeScript",
    "These for now. Rewritten in TS": "refactor: αρχική TypeScript μετάβαση",
    "Remove deps": "chore: αφαίρεση dependencies",
    "Add supabase auth": "feat: Supabase authentication",
    "Implement Chat widget": "feat: chat widget",
    "make chat widget global": "feat: global chat widget",
    "Add link functionality chatbot": "feat: links στο chatbot",
    "Add github links on footer": "feat: GitHub links στο footer",
    "Add some stuff": "feat: νέες λειτουργίες",
    "Add instructions": "docs: οδηγίες",
    "Unique ids": "fix: μοναδικά IDs",
    "Fix mapping": "fix: διόρθωση mapping",
    "Fix name mapping to all and db": "fix: name mapping",
    "Fix the workflow": "ci: διόρθωση GitHub workflow",
    "Implemented backend.": "feat: υλοποίηση backend",
    "comment out dead code": "chore: σχολιασμός dead code",
    "logo added": "feat: προσθήκη logo",
    "update run_server script": "chore: ενημέρωση run_server script",
    "Major changes": "refactor: σημαντικές αλλαγές",
    "Added reviews and contact sections": "feat: reviews και contact",
    "Format files, add cursor rules and shadcn": "chore: shadcn, cursor rules και formatting",
    "Updated deps and collapsible menu": "feat: collapsible menu και deps",
    "Patch some stuff": "chore: μικρά patches",
    "Update README.md": "docs: ενημέρωση README",
    "changed ui": "style: αλλαγές UI",
    " ui": "style: αλλαγές UI",
    "ui": "style: αλλαγές UI",
    "denthimamailol": None,
}

AREA_LABELS = [
    (r"ChatWidget|ai_service", "chatbot AI"),
    (r"CorrectorPage|corrector_service", "AI corrector"),
    (r"CookieConsent|cookieConsent", "cookies"),
    (r"AskiseisPage|askiseis", "ασκήσεις"),
    (r"MethodologiesPage|methodologies", "μεθοδολογίες"),
    (r"PaliathemataPage|pdfs/", "παλιά θέματα"),
    (r"QuizPage|QuizDialog|quiz", "κουίζ"),
    (r"Flashcard", "flashcards"),
    (r"HomePage", "αρχική σελίδα"),
    (r"AboutMe", "About Me"),
    (r"MainLayout|routes", "navigation και routes"),
    (r"server\.py|backend/", "backend"),
    (r"AuthContext|LoginPage|supabase", "authentication"),
    (r"nginx\.conf|netlify|Dockerfile", "deployment"),
    (r"README", "README"),
    (r"package\.json|bun\.lock|vite\.config", "build config"),
]


def get_changed_files(commit: str) -> list[str]:
    try:
        out = subprocess.check_output(
            ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", commit],
            stderr=subprocess.DEVNULL,
            text=True,
        )
        return [line.strip() for line in out.splitlines() if line.strip()]
    except subprocess.CalledProcessError:
        return []


def summarize_files(files: list[str]) -> str:
    if not files:
        return "ενημέρωση project"

    joined = "\n".join(files)
    areas: list[str] = []
    for pattern, label in AREA_LABELS:
        if re.search(pattern, joined, re.IGNORECASE) and label not in areas:
            areas.append(label)

    if areas:
        return ", ".join(areas[:3])

    names = [f.split("/")[-1] for f in files[:2]]
    return ", ".join(names)


def rewrite_message(old_msg: str, commit: str) -> str:
    stripped = old_msg.strip()
    if not stripped:
        return "chore: ενημέρωση"

    for prefix in KEEP_PREFIXES:
        if stripped.startswith(prefix):
            return stripped

    lower = stripped.lower()
    if lower in {k.lower(): v for k, v in EXACT_MAP.items() if v}:
        for key, value in EXACT_MAP.items():
            if key.lower() == lower and value:
                return value

    if stripped in EXACT_MAP:
        mapped = EXACT_MAP[stripped]
        if mapped:
            return mapped

    if lower == "prettier formatted the code":
        return "style: μορφοποίηση με Prettier"

    files = get_changed_files(commit)
    summary = summarize_files(files)

    if stripped in {"aa", "a", "aaa", "m", "q", "yes", "denthimamailol"}:
        return f"chore: ενημέρωση — {summary}"

    if re.fullmatch(r"[a-zα-ωά-ώ]+", stripped, re.IGNORECASE) and len(stripped) <= 20:
        return f"chore: ενημέρωση — {summary}"

    if stripped[0].islower() and " " not in stripped:
        return f"chore: {stripped} — {summary}"

    return stripped


def main() -> None:
    old_msg = sys.stdin.read()
    commit = os.environ.get("GIT_COMMIT", "")
    new_msg = rewrite_message(old_msg, commit)
    sys.stdout.write(new_msg)
    if not new_msg.endswith("\n"):
        sys.stdout.write("\n")


if __name__ == "__main__":
    main()

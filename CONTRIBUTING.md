# Συνεισφορά στο technotesgr

Ευχαριστούμε που θέλεις να βοηθήσεις. Το **technotesgr** είναι δωρεάν πλατφόρμα για μαθητές που δίνουν Πανελλήνια στην Πληροφορική (ΑΕΠΠ).

Πριν γράψεις κώδικα, διάβασε το [README](README.md) για stack και setup.

## Πώς να συνεισφέρεις

1. Άνοιξε ένα [issue](https://github.com/feirw/technotesgrr/issues/new/choose) (bug ή πρόταση) **ή** σχολίασε σε υπάρχον.
2. Περίμενε σύντομο OK αν η αλλαγή είναι μεγάλη, ώστε να μην γίνει διπλή δουλειά.
3. Κάνε fork (ή branch στο repo αν έχεις πρόσβαση).
4. Δούλεψε σε **ένα** θέμα ανά PR.
5. Άνοιξε pull request προς το `main` — γεμίζει αυτόματα το [PR template](.github/pull_request_template.md).

### Issues

Χρησιμοποίησε τα templates:

- **Αναφορά σφάλματος** — κάτι σπάει
- **Πρόταση λειτουργίας** — νέα ιδέα ή UX

Γράψε βήματα αναπαραγωγής, συσκευή (desktop/κινητό), browser και θέμα (light/dark). Screenshot βοηθάει πολύ σε UI.

### Pull requests

- Μικρά, ευανάγνωστα PRs είναι πιο εύκολα στο review.
- Σύνδεσε το issue με `Closes #123`.
- Μην κάνεις force-push στο `main`.
- Μην βάζεις στο commit `.env`, keys, ή προσωπικά δεδομένα.

## Τοπικό setup

### Frontend

Χρειάζεται [Bun](https://bun.sh).

```bash
cd frontend
bun install
cp .env.example .env   # προαιρετικό
bun run dev
```

Dev server: http://localhost:5173 (το Vite κάνει proxy το `/api` στο backend, port **8001**).

Format πριν το PR:

```bash
bun run format
```

Το CI στο `main` κάνει build του frontend (`bun run build`).

### Backend

```bash
cd backend
python -m venv env
# Windows: env\Scripts\activate
# macOS/Linux: source env/bin/activate
pip install -r requirements.txt
cp .env.example .env
python server.py
```

API: http://localhost:8001

Μην κάνεις commit τα `.env`. Δες τα `.env.example` για τα ονόματα των μεταβλητών.

## Πρακτικές κώδικα

- **UI στα ελληνικά.** Νέα κουμπιά, μηνύματα και hints να είναι στα ελληνικά, όπως η υπόλοιπη εφαρμογή.
- **Light και dark.** Αν αλλάζεις layout ή χρώματα, έλεγξε και τα δύο θέματα.
- **Κινητό.** Πολλά bugs είναι overflow, z-index και wrap σε στενή οθόνη — δοκίμασε και εκεί.
- **Μικρό diff.** Μην κάνεις άσχετο refactor ή format σε αρχεία που δεν άγγιξες για το ticket.
- Frontend: React, TypeScript, Tailwind. Backend: FastAPI, PostgreSQL.

## Περιεχόμενο (κουίζ / flashcards)

Τα στατικά JSON είναι στο `frontend/src/data/` (`quizzes/`, `flashcards/`). Προγράμματα σπουδών: `data/curricula/`. Καριέρες: `data/careers/`.

- Κράτα την υπάρχουσα δομή (`id`, `question`, `answers` με `text` / `correct`).
- Μία σωστή απάντηση ανά ερώτηση, εκτός αν το αρχείο ήδη έχει άλλο μοτίβο.
- Γλώσσα και ορολογία συμβατή με ΑΕΠΠ / ΓΛΩΣΣΑ.

## Ερωτήσεις

Άνοιξε issue ή σχολίασε στο σχετικό PR. Για το πώς τρέχει το project, το README είναι η πρώτη στάση.

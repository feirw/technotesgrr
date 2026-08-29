# technotesgr — Technotes

**Live site:** [www.technotes.gr](https://www.technotes.gr)

Δωρεάν πλατφόρμα προετοιμασίας για τις **Πανελλήνιες Πληροφορικής** (ΑΕΠΠ / Γ΄ Λυκείου). Όλα τα εργαλεία μελέτης και ο οδηγός σχολών είναι ανοιχτά χωρίς λογαριασμό.

**Stack:** React + Vite + TypeScript + Tailwind + Framer Motion. Το frontend είναι PWA (στατικό site). Προαιρετικό FastAPI backend (PostgreSQL) για sync προόδου, προσανατολισμό και metrics.

## Πώς δουλεύει το site

Το μεγαλύτερο μέρος του περιεχομένου είναι **στατικό στο frontend** (JSON, PDFs, generated TypeScript). Δεν χρειάζεσαι backend για quiz, flashcards, οπτικοποιήσεις, σχολές ή παλιά θέματα.

Η **σύνδεση χρηστών είναι απενεργοποιημένη** στο μενού. Πρόοδος quiz / flashcards / study timer μένει στο `localStorage`. Αν κάποιος είναι συνδεδεμένος, το ίδιο state συγχρονίζεται στο `/api/progress/{key}`.

Η φόρμα επικοινωνίας στην αρχική είναι επίσης απενεργοποιημένη. Επικοινωνία μέσω [Instagram](https://instagram.com/technotesgr) / Discord.

## Quick start

### Frontend

Χρειάζεται [Bun](https://bun.sh) (ή `npm` / `pnpm` με τα ίδια scripts).

```bash
cd frontend
bun install
cp .env.example .env   # προαιρετικό
bun run dev
```

Dev server: **http://localhost:5173** (το Vite κάνει proxy το `/api` στο `127.0.0.1:8001`).

```bash
bun run format   # πριν από PR
bun run build    # production build → frontend/build
```

### Backend (προαιρετικό)

Χρειάζεται μόνο για auth, sync προόδου, υποβολή προσανατολισμού, leaderboard, contact και AI endpoints.

```bash
cd backend
python -m venv env
# Windows: env\Scripts\activate
# macOS/Linux: source env/bin/activate
pip install -r requirements.txt
cp .env.example .env
python server.py
```

API: **http://localhost:8001** · Python 3.12 (`runtime.txt`).

## Features

Μενού: **Προετοιμασία** · **Σχολές** · Ανακοινώσεις · FAQ.

### Προετοιμασία (πριν τις Πανελλήνιες)

| Σελίδα | Path | Τι κάνει |
|--------|------|----------|
| Quiz | `/quiz` | Κεφάλαια ύλης από `src/data/quizzes/`. Συνέχεια από την πρώτη αναπάντητη. |
| Flashcards | `/flashcards` | Κεφάλαια από `src/data/flashcards/`. |
| Μεθοδολογίες | `/methodologies` | Σημειώσεις / παραδείγματα ΑΕΠΠ. |
| Δομές δεδομένων | `/domes-dedomenon` | Interactive visualizer: δέντρα, BST, λίστες, γράφοι. |
| Παλιά θέματα | `/paliathemata` | PDFs (κανονικές, επαναληπτικές, ΟΕΦΕ, τράπεζα θεμάτων). |
| Αλγόριθμοι | `/algorithms` | Προσομοίωση ταξινόμησης / αναζήτησης σε ψευδοκώδικα ΓΛΩΣΣΑΣ. |
| Progress Tracker | `/progress-tracker` | Checklist ύλης (τοπικά). |
| Study Timer | `/study-timer` | Χρόνος μελέτης και ημερήσιος στόχος. |
| Διερμηνευτής ΓΛΩΣΣΑΣ | `/gloglossa` | Link στο [didactics.gr/glossa](https://www.didactics.gr/glossa). |
| Σχολικά βιβλία | `/vivlia` | PDF βιβλίο μαθητή + συμπληρωματικό υλικό. |

Η παλιά ενότητα **Ασκήσεις** (`/askiseis`) ανακατευθύνει στην αρχική.

### Σχολές (μετά τις Πανελλήνιες)

| Σελίδα | Path | Τι κάνει |
|--------|------|----------|
| Σχολές | `/sxoles` | Κατάλογος τμημάτων 4ου πεδίου: αναζήτηση, βάσεις, πρόγραμμα σπουδών, καριέρες, σύγκριση μαθημάτων (`?view=compare`). |
| Συντελεστές | `/syntelestes-sxolon` | Συντελεστές 2026. |
| Υπολογισμός μορίων | `/ypologismos-morion` | Μόρια + ΕΒΕ από βαθμούς. |
| Μηχανογραφικό (πρόβα) | `/mixanografiko` | Πρόχειρη σειρά προτίμησης (τοπικά). |
| Αντιστοιχίες | `/antistoixies-sxolon` | Αντίστοιχα τμήματα για μετεγγραφές. |
| Μετεγγραφές | `/meteggrafes` | FAQ μετεγγραφών. |
| Προσανατολισμός | `/prosanatolismos` | Ερωτηματολόγιο καριέρας. |
| Προσανατολισμός Πληροφορικής | `/prosanatolismos-pliroforikis` | Ρόλοι CS + link στο cscareerpath. |
| ΣΑΕΚ | `/saek` | Πληροφορίες ΔΥΠΑ ΣΑΕΚ. |

Προγράμματα σπουδών: `frontend/src/data/curricula/` (generated) και mapping στο `schoolCurricula.ts`. Καριέρες: `frontend/src/data/careers/`. Νέο curriculum:

```bash
python scripts/generate_<school>_curriculum.py
```

### Άλλες σελίδες

- `/` αρχική · `/about` · `/announcements` · `/faq`
- `/privacy-policy` · `/data`
- Light / dark theme (`starr.png` / `sun.png`)
- Discord, Instagram, TikTok, LinkedIn, YouTube στο footer

## Environment

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Production API (π.χ. Render). Στο localhost χρησιμοποιείται το Vite proxy αν δεν οριστεί. |
| `VITE_SITE_URL` | Canonical URL (προαιρετικό). |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics (προαιρετικό). |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL |
| `JWT_SECRET_KEY` | Auth (ενεργό στο API, όχι στο UI) |
| `GEMINI_API_KEY` | Chat / AI corrector (χωρίς frontend σελίδα αυτή τη στιγμή) |
| `GEMINI_MODEL` | Default: `gemini-2.5-flash` |
| `PORT` | Default: `8001` |
| `CORS_ORIGINS` | Extra origins (comma-separated). Το `server.py` επιτρέπει ήδη `.gr` / `.com` + local. |
| `SMTP_*`, `CONTACT_RECEIVER_EMAIL` | Email για contact / reset password (αν ρυθμιστούν) |

Πλήρης λίστα: `backend/.env.example`.

## Backend API (όταν τρέχει)

Χρήσιμα από το τρέχον UI:

- `GET /api/health`
- `GET` / `PUT /api/progress/{key}` — sync quiz, flashcards, timer
- `POST /api/quiz/submit` · `GET /api/leaderboard`
- `POST /api/career-orientation/submit` · `GET /api/career-orientation/result`
- `POST /api/metrics/web-vitals`

Υπάρχουν ακόμα, **χωρίς UI**: `POST /api/chat`, `POST /api/correct` (διορθωτής ΑΕΠΠ με OCR + RAG). Knowledge base:

```bash
python scripts/build_corrector_knowledge.py
```

Auth endpoints (`/api/auth/*`) υπάρχουν στο API· οι σελίδες login/register δεν είναι στο router.

## Project structure

```
backend/                 FastAPI (server.py, database, Gemini)
frontend/
  src/
    pages/public/        Home, FAQ, announcements, legal
    pages/private/       Quiz, schools, visualizers, calculators
    features/dsv/        Data-structure visualizer
    features/algo-viz/   Algorithm simulator
    data/                quizzes, flashcards, schools, curricula, careers
    layouts/             Nav, theme, footer
    utils/               apiClient, backendUrl, moria, synced storage
scripts/                 Curriculum generators, sitemap, OG images
```

## Deploy

- **Frontend:** static (`frontend/build`). Vercel: root `vercel.json` (Bun install + SPA rewrite).
- **Backend:** Render / αντίστοιχο (`Procfile`: uvicorn). CORS για `technotes.gr` / `technotesgr.gr` / `technotesgr.com`.
- CI στο `main`: `bun run build` του frontend (`.github/workflows/frontend.yml`).

## Development notes

- Quiz/flashcards δένονται στο bundle στο build (`import.meta.glob`) — χωρίς round trip στο API.
- `apiFetch` δοκιμάζει same-origin proxy στο localhost και `VITE_BACKEND_URL` σε production.
- Lazy routes + code-split chunks (schools / curricula / PDF).
- DB schema στο backend γίνεται idempotent init στο startup.

## Contributing

Δες [CONTRIBUTING.md](CONTRIBUTING.md). Issues και PRs καλοδεχούμενα. Ευπάθειες: [SECURITY.md](SECURITY.md).

## Acknowledgements

- [ABSanthosh](https://github.com/ABSanthosh) — αρχική ιδέα flashcards σε React.
- [didactics.gr](https://www.didactics.gr/glossa) — διερμηνευτής ΓΛΩΣΣΑΣ και παλιά θέματα

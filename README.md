# technotesgr — Technotes

## Overview

**technotesgr** is a **free** web platform for students preparing for the **Greek national exams in Informatics** (Γ' Λυκείο — ΑΕΠΠ). It combines revision tools, exam prep content, and university guidance in one place, with a modern UI and light/dark theme.

**Stack:** **React + Vite + TypeScript + Tailwind + Framer Motion** (frontend) · **FastAPI + PostgreSQL** (API, quiz/flashcards/submissions) · **Google Gemini** (AI chat & optional corrector backend).

The frontend is usually deployed as a static site (e.g. Netlify) with the API hosted separately (e.g. Render). CORS is configured for `technotesgr.gr` / `technotesgr.com` and local dev origins.

## Quick Start

### Frontend

Requires [Bun](https://bun.sh) (or use `npm`/`pnpm` with equivalent scripts).

```bash
cd frontend
bun install
cp .env.example .env   # optional — see ENV below
bun run dev
```

Dev server: **http://localhost:5173** (Vite proxies `/api` → backend on port **8001**).

### Backend

```bash
cd backend
python -m venv env
# Windows: env\Scripts\activate
# macOS/Linux: source env/bin/activate
pip install -r requirements.txt
cp .env.example .env     # set DATABASE_URL, GEMINI_API_KEY, etc.
python server.py
```

API: **http://localhost:8001**

Optional dataset loaders: `python data_loader.py`

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | Google Gemini API key (chat; AI corrector when enabled) |
| `GEMINI_MODEL` | Default: `gemini-2.5-flash` |
| `AI_MODEL` | Optional override for AI corrector |
| `CORRECTOR_MAX_OUTPUT_TOKENS` | Default: `1500` |
| `CORRECTOR_OCR_MAX_OUTPUT_TOKENS` | OCR from photos; default: `2048` |
| `CORRECTOR_CONTEXT_MAX_CHARS` | RAG context size; default: `14000` |
| `PORT` | Default: `8001` |
| `CORS_ORIGINS` | Extra allowed origins (comma-separated) |
| `SMTP_*`, `CONTACT_RECEIVER_EMAIL` | Optional contact-form email |

See `backend/.env.example` for the full list.

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Production API URL (e.g. Render). On localhost, Vite proxy is used if unset. |
| `VITE_SITE_URL` | Public site URL (optional) |

## Features

### Learning & revision
- **Quiz** and **flashcards** (API-backed, caching & deduplication)
- **Leaderboard**, **study timer**, **progress tracker**
- **Methodologies** (ΑΕΠΠ pseudocode reference)
- **Αλγόριθμοι**, **παλιά θέματα**
- **GloGlossa** embed, **προσανατολισμός**, **ανακοινώσεις**

### Σχολές & πρόγραμμα σπουδών
On **Σχολές**, click a department that has curriculum data to open the **study-program modal** (filters: Όλα / Υποχρεωτικά / Επιλογής, list & grid views).

| School ID | Department | University |
|-----------|------------|------------|
| `330` | Πληροφορικής και Τηλεπικοινωνιών | ΕΚΠΑ |
| `338` | Πληροφορικής | ΑΠΘ |
| `333` | Πληροφορικής | ΟΠΑ |

Curriculum data lives in `frontend/src/data/curricula/`. Regenerate with:

```bash
python scripts/generate_ekpa_curriculum.py
python scripts/generate_auth_informatics_curriculum.py
python scripts/generate_opa_informatics_curriculum.py
```

### AI (backend)
- **`POST /api/chat`** — Gemini chatbot (no UI currently)
- **`POST /api/correct`** — AI exercise corrector for ΑΕΠΠ pseudocode (OCR + RAG). No frontend page currently.

**Corrector knowledge base:** lesson `.docx`/`.pdf` files under `frontend/ΜΑΘΗΜΑΤΑ/` are extracted into `backend/data/corrector_knowledge.json`:

```bash
pip install pypdf   # if not already installed
python scripts/build_corrector_knowledge.py
```

Restart the backend after rebuilding the knowledge file.

### Other
- Contact form · Web Vitals metrics endpoint
- Dark mode (custom theme icons: `starr.png` / `sun.png`)
- Lazy routes & code-split chunks

## Project Structure

```
backend/
  server.py              FastAPI app & routes
  ai_service.py          Gemini chat + AI corrector
  corrector_knowledge.py RAG loader for corrector
  data/                  corrector_knowledge.json (generated)
  database.py            PostgreSQL pool & schema

frontend/
  src/
    components/          UI, quiz, flashcards, schools modal
    pages/               Public & private pages
    data/
      curricula/         Generated school study programs
      careers/           Career lists per field
      quizzes/ flashcards/
      schools.ts, schoolCurricula.ts, …
    layouts/MainLayout.tsx Navigation, theme
    utils/               apiClient, backendUrl, theme, …

scripts/
  generate_*_curriculum.py
  build_corrector_knowledge.py
```

## Development Notes

- **API client:** `apiFetch` tries multiple backend base URLs (same-origin proxy on localhost, `VITE_BACKEND_URL` in production).
- **Performance:** lazy routes, request dedupe/retry, optional response cache for GETs.
- **Database:** idempotent init for required tables/indexes on startup.

## Legal

- Privacy: `/privacy-policy` · Data protection: `/data`

## Contributing

Issues and pull requests are welcome.

## Acknowledgements

- [ABSanthosh](https://github.com/ABSanthosh) — initial flashcards idea in React.

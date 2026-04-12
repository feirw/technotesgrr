# technotesgr — Greek high-school Informatics

## Overview

**technotesgr** is a **free** web platform for students preparing for the **Greek national exams in Informatics** (final year of upper secondary school, “Γ’ Λυκείο”). It brings **revision**, **time management**, and **support** tools into one place, with straightforward navigation and a modern UI (light/dark theme).

**What it includes:** interactive **quizzes** and **flashcards** backed by an API, a **leaderboard**, **study timer**, **progress tracker** for the syllabus, sections for **algorithms**, **past papers**, and **online** course material, **study-orientation** content, **announcements**, an embedded **Modern Greek (Glossology)** experience, an **AI chatbot** on selected public pages, a **contact form**, and pages about **university departments**, **merch**, and the creator. **Privacy** and **data protection** pages describe data use and cookies.

**Stack:** **React + Vite + TypeScript + Tailwind + Framer Motion** on the frontend; **FastAPI** with **PostgreSQL** for quiz/flashcard/submission data and related APIs; **Google Gemini** for chat. The frontend is usually deployed as a static site (e.g. Netlify) with the API hosted separately (e.g. Render), with CORS configured for the official domains.

## Quick Start

### 1) Frontend
If you don't have Bun installed, run `curl -fsSL https://bun.sh/install | bash` and restart your shell.

1. `cd frontend`
2. `bun install`
3. Create `.env` if needed (see ENV section below)
4. `bun run dev`

### 2) Backend
1. `cd backend`
2. Create venv: `python -m venv env` and activate it
3. `pip install -r requirements.txt`
4. Configure environment variables (see ENV section below)
5. Initialize database (if needed): `python database.py`
6. (Optional, dataset loaders) `python data_loader.py`
7. Run server: `python server.py`

### Access
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

## Environment Variables

Backend (FastAPI):
- `DATABASE_URL` (PostgreSQL connection)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE` (if using Supabase for auth/profile sync)
- `GEMINI_API_KEY` (Google Gemini for chatbot)
- `MAIL_FROM`, `MAIL_TO`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (contact form notifications, optional)

Frontend:
- `VITE_API_BASE` (e.g. `http://localhost:8000`)
- `VITE_GEMINI_ENABLED` (optional flag to toggle chatbot UI)

## Features (current product)
- Quizzes and flashcards (API + frontend caching / deduplication)
- Leaderboard, study timer, progress tracker
- Algorithms, past papers, online material, orientation, schools directory
- Announcements, Glossology embed, about / merch
- Chat widget (Gemini) on selected public pages
- Contact form · optional Web Vitals reporting to the backend
- Dark mode, lazy routes, code-split JS chunks

## Project Structure
```
backend/        FastAPI — quiz, flashcards, chat, contact, metrics, DB pool
frontend/       React + Vite app
  src/
    components/ ChatWidget, quiz, flashcards, shared UI
    pages/      Public + learning-focused pages
    layouts/    MainLayout — navbar, theme
    utils/      apiClient, backendUrl, quizUtils, theme, webVitals
```

## Development Notes
- Quiz / flashcards: API requests try multiple backend base URLs when same-origin has no API
- Performance: lazy `ChatWidget`, code-splitting, request dedupe/retry
- Database: idempotent backend init for required tables/indexes

## Legal
- Privacy & terms: `/privacy-policy` · Data protection: `/data`
- For cookies, processing, and rights, see the in-app pages (they may reference services such as Supabase where used on the backend).

## Contributing
Issues and PRs are welcome.

## Acknowledgements
- Special thanks to [ABSanthosh](https://github.com/ABSanthosh) for an initial flashcards idea in React.

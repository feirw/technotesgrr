# technotesgr — High School Informatics Hub

Modern learning platform for Greek high-school Informatics (Γ’ Λυκείου): quizzes, flashcards, community, progress tracking, study timer, chatbot and more. Built with React + Vite + Tailwind + Framer Motion (frontend) and FastAPI + PostgreSQL/Supabase (backend).

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

## Features
- Quizzes with local-first submissions, offline queue, retry on reconnect and caching
- Flashcards with smooth flip/vertical transitions, keyboard navigation, progress, optimized state
- Community forum with user posts and profiles (Supabase-backed)
- Admin dashboard (view users; protected endpoint `/api/admin/users`)
- Study Timer page (start/pause/reset, progress/goal, pink theme)
- Career Orientation (Προσανατολισμός) with backend persistence
- Progress Tracker page (interactive syllabus tracking)
- Dark mode (`darkMode: 'class'`, preference saved)
- Chatbot (Google Gemini) with session-based history and persistent conversations
- Web Vitals tracking (LCP/INP/CLS) and lightweight analytics hooks
- Panic Button with curated supportive quotes (navbar)
- Route-level lazy loading and reduced initial JS payload

## Project Structure
```
backend/        FastAPI app, DB access, AI service, admin/users API
frontend/       React + Vite app
  src/
    components/ Shared UI components (ChatWidget, quiz, flashcards)
    pages/      Route pages (Home, About, Community, StudyTimer, etc.)
    layouts/    MainLayout with navbar, dark mode, Panic Button
    utils/      apiClient (retry/dedupe), quizUtils (cache), theme, webVitals
```

## Development Notes
- Quizzes: No auto-advance; UI updates instantly; submissions sync in background; sessionStorage cache
- Flashcards: In-place flip animation; vertical transitions; cleaned content; hint removed
- Routing: Protected routes + gentle auth redirects; refresh keeps user on current page
- Performance: Lazy `ChatWidget`, code-splitting heavy pages, request dedupe/retry, caching
- Database: Idempotent init for `community_posts`; admin users endpoint with pagination

## Legal
- Privacy/Terms are available in-app at:
  - Privacy & Terms: `/privacy-policy`
  - Data Protection: `/data`
- Summary: We use Supabase Auth (email/username), store community posts and quiz progress, track anonymous Web Vitals, and respect dark mode/local preferences. See pages above for details.

## Contributing
Issues and PRs are welcome.

## Acknowledgements
- Special thanks to [ABSanthosh](https://github.com/ABSanthosh) for an initial flashcards idea in React.

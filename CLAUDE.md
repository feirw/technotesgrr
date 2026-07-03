# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**technotesgr** is a free web platform for Greek students preparing for the national Informatics exams (Γ' Λυκείο — ΑΕΠΠ). It combines revision tools (quiz, flashcards, leaderboard, study timer), exam-prep content, and university/department (Σχολές) guidance.

Stack: **React 19 + Vite + TypeScript + Tailwind + Framer Motion** (frontend), **FastAPI + PostgreSQL (Supabase)** (backend API), **Google Gemini** (`google-genai` SDK) for AI chat and an exercise corrector. The frontend deploys as a static site (Netlify/Vercel); the API deploys separately (e.g. Render). Most UI copy, code comments, and API error messages are in Greek — keep new user-facing strings in Greek unless told otherwise.

## Commands

### Frontend (`frontend/`, uses Bun)
```bash
bun install
bun run dev              # http://localhost:5173, proxies /api -> localhost:8001 (see vite.config.ts)
bun run build             # runs generate:seo (sitemap + OG images) then `vite build` -> frontend/build
bun run preview
bun run format             # prettier --write on src/**/*.{js,jsx,ts,tsx,json,css,scss}
```
There is no lint script and no test suite configured for the frontend — CI (`.github/workflows/frontend.yml`) only runs `bun install`, an (unwired) format-check/auto-commit step, and `bun run build`. Treat a successful `bun run build` (TypeScript is checked via Vite/`tsc` during build) as the correctness bar for frontend changes.

### Backend (`backend/`, Python)
```bash
python -m venv env && env\Scripts\activate   # Windows; source env/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # set DATABASE_URL, GEMINI_API_KEY, etc.
python server.py             # http://localhost:8001, auto-reload when ENV=dev/development/local
```
No test suite or linter is configured for the backend either. There's no single-test-run command to document — verify backend changes by hitting endpoints directly (e.g. `curl localhost:8001/api/health`) or via the frontend dev proxy.

### Curriculum data generation
Study-program (Σχολές) data lives in `frontend/src/data/*Curriculum.generated.ts`, one file per department, generated from Python scripts in `scripts/generate_*_curriculum.py` (one script per school). Regenerate a specific department after editing its script, e.g.:
```bash
python scripts/generate_ekpa_curriculum.py
python scripts/generate_auth_informatics_curriculum.py
```
Never hand-edit a `*.generated.ts` file — edit the generator script and rerun it. After adding a new generated curriculum file, wire it into `frontend/src/data/schoolCurricula.ts` (import + registry) and `frontend/src/data/schools.ts`.

### AI corrector knowledge base
The `/api/correct` endpoint RAGs over lesson material extracted from `.docx`/`.pdf` files under `frontend/ΜΑΘΗΜΑΤΑ/` into `backend/data/corrector_knowledge.json`:
```bash
pip install pypdf   # if not already installed
python scripts/build_corrector_knowledge.py
```
Restart the backend after rebuilding this file so `corrector_knowledge.py` reloads it.

## Architecture

### Backend (`backend/`)
- `server.py` — single FastAPI app with all routes (quiz, flashcards, leaderboard, contact, chat, AI corrector, career orientation, web-vitals). Uses a `lifespan` context manager to init the DB pool on startup (set `ALLOW_START_WITHOUT_DB=1` to boot without a working DB) and close it on shutdown. CORS allows `technotesgr.gr`/`.com`, Netlify/Vercel preview domains, and localhost, via an explicit allow-list plus a regex (`_cors_origin_regex`).
- `database.py` — a `psycopg2.ThreadedConnectionPool` (`DB_POOL_MIN`/`DB_POOL_MAX` env vars) wrapped by the `get_db_connection()` context manager, which rolls back on error before returning the connection to the pool. `init_database()` idempotently ensures indexes exist; it does not run full migrations.
- `ai_service.py` — wraps the Gemini `google-genai` SDK for both the chatbot (`/api/chat`, `/api/chat/stream`) and the AI exercise corrector (`/api/correct`). Chat streaming (`/api/chat/stream`) runs the Gemini call in a background thread and bridges it to an async SSE generator via a `queue.Queue`, with keep-alive pings while waiting. Config is env-driven (`GEMINI_MODEL`, `GEMINI_MAX_OUTPUT_TOKENS`, `GEMINI_TEMPERATURE`, `CORRECTOR_*`).
- `corrector_knowledge.py` — loads/serves `backend/data/corrector_knowledge.json` (built by `scripts/build_corrector_knowledge.py`) as RAG context for the corrector.
- If `ai_service`/`corrector_knowledge` fail to import (e.g. missing `GEMINI_API_KEY`), `server.py` falls back to no-op stub implementations so the rest of the API keeps working — don't assume AI routes are always live.
- `data_loader.py` — loads quiz/flashcard JSON from `frontend/src/data/{quizzes,flashcards}/` into the DB; quiz and flashcard content is authored as JSON there, not hardcoded in the backend.
- `constants.py` — shared chapter-id → display-name mapping (`CHAPTER_NAME_MAP`) and which chapters have exams; keep frontend chapter/category labels consistent with this file.

### Frontend (`frontend/src/`)
- `routes/routes.tsx` — the single route table (`RouteConfig[]`), consumed by `App.tsx`/`MainLayout.tsx`. Nearly every route is `React.lazy`-loaded except `HomePage`; `prefetchCriticalPrivateRoutes()` warms the quiz/flashcards chunks and their data after login-equivalent navigation. Some routes/imports are deliberately commented out (`/merch`, `/online`, `/ai-corrector`) — re-enable by uncommenting both the route and the corresponding nav entry in `MainLayout.tsx`. `shouldShowChatWidgetOnPath()` gates where the chat widget renders (public entry pages only).
- `layouts/MainLayout.tsx` — global nav, theme toggle (light/dark, custom `starr.png`/`sun.png` icons), and chat widget mounting.
- `utils/apiClient.ts` (`apiFetch`) — the shared fetch wrapper: per-request timeout (`AbortSignal.timeout`), retry with backoff on 5xx/429/timeout/network errors, in-flight request de-duplication (GET always deduped; others via explicit `dedupeKey`), and an optional TTL response cache for GETs (`cacheTtlMs`/`cacheKey`). Use this instead of raw `fetch` for backend calls.
- `utils/backendUrl.ts` — resolves which backend origin to call. `getBackendUrl()`/`getBackendUrlCandidates()` handle three cases: local dev (Vite proxy or `VITE_BACKEND_URL` if it's loopback), static-hosted production (same origin has no API, so prefer `VITE_BACKEND_URL` — e.g. Render — over same-origin), and LAN/phone testing (ignore a loopback `VITE_BACKEND_URL`, it points at the wrong device). `VITE_BACKEND_URL` can also be injected at runtime via `window.__ENV__` (see `public/env.js`), not just build-time `import.meta.env`.
- `data/*Curriculum.generated.ts` + `data/schoolCurricula.ts` — see "Curriculum data generation" above. `data/schools.ts` holds the department directory (only departments with curriculum data open the study-program modal); `components/schools/SchoolCurriculumModal.tsx` and `SchoolCourseCompare*` render/compare it.
- `data/*.ts` (non-generated) — most other static content (announcements, methodologies, ασκήσεις, careers-by-field, FAQ, coefficients) is also authored directly as TypeScript data modules rather than fetched from the backend; only quiz/flashcards/leaderboard/contact/AI/career-submission go through the API.
- `pages/public/` vs `pages/private/` — a content/navigation grouping (public marketing/info pages vs. the app's learning tools), not an auth boundary; there is no login system in this app.
- `seo/` — `SeoHead.tsx` + `seoConfig.ts`/`siteMeta.ts`/`schema.ts` drive per-route meta tags/structured data; `scripts/generate-sitemap.mjs` and `scripts/generate-og-images.mjs` (run via `bun run generate:seo` in `prebuild`) must stay in sync with `routes.tsx` when routes are added/removed.

### Cross-cutting
- The frontend's `@/` path alias maps to `frontend/src` (see `vite.config.ts` and `tsconfig.json`).
- Quiz/flashcard chapter identifiers must stay consistent across `backend/constants.py` (`CHAPTER_NAME_MAP`), the JSON files under `frontend/src/data/{quizzes,flashcards}/`, and any frontend category filtering (`utils/categories.ts`).
- `frontend/ΜΑΘΗΜΑΤΑ/` contains the actual lesson materials (Greek filenames, one folder per lesson) that back both the static "Μεθοδολογίες" content and the AI corrector's knowledge base — treat it as source content, not build output.

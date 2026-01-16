# Copilot instructions — personal-portfolio

Goal
- Fullstack personal portfolio: Django backend in `backend/` and React (Vite) frontend in `frontend/`.
- Preserve backwards-compatible API changes. Prefer non-breaking changes under `/api/`.

Quick dev commands
- Backend (Windows PowerShell):
  - `cd backend`
  - `python -m venv venv`
  - `.\venv\Scripts\Activate.ps1`
  - `python -m pip install --upgrade pip`
  - `pip install -r requirements.txt`
  - `python manage.py makemigrations && python manage.py migrate && python manage.py runserver`
- Frontend:
  - `cd frontend`
  - `npm install`
  - `npm run dev`

Key files & patterns (start here)
- Backend: `backend/contact/models.py`, `contact/serializers.py`, `contact/views.py`, `contact/urls.py` (contact message model + API).
- Settings & routing: `backend/config/settings.py`, `backend/config/urls.py`.
- Admin registration: `backend/contact/admin.py`.
- Frontend: `frontend/src/index.css`, `frontend/postcss.config.js`, `frontend/tailwind.config.js`, `frontend/src/App.jsx`, `frontend/index.html`.
- Ignore secrets: `.env` and `backend/venv` must not be committed; see `backend/.gitignore`.

API surface & auth rules
- POST `/api/contact` — public create (AllowAny).
- `/api/contact-messages/` — admin-only ModelViewSet (IsAdminUser) for list/retrieve/update/delete.
- Admin UI available at `/admin/`.

Build & tooling notes
- Tailwind is processed via PostCSS and uses `@tailwindcss/postcss` in `postcss.config.js`.
- If editor flags `@tailwind` as unknown, install Tailwind CSS IntelliSense or set `css.lint.unknownAtRules` to ignore.
- Vite/esbuild will error on duplicate exports (common source: multiple `App` declarations in `frontend/src/App.jsx`).

Design directives (project-specific)
- Tone: bold, art-driven UI — avoid generic templates and system-default fonts unless justified.
- Typography: prefer expressive, characterful families; avoid Inter/Roboto/system-UI by default.
- Color: choose one coherent palette; use CSS variables/design tokens; enforce WCAG AA/AAA contrast.
- Motion: purposeful, CSS-first; respect reduced-motion preference.
- Backgrounds: layered gradients, subtle texture, or contextual patterns — not flat defaults.

Agent behavior rules
- Inspect the Key files section before proposing edits.
- When making changes: include exact file paths and minimal diffs; do not commit secrets or `venv` contents.
 - Code formatting: Format code by default and follow the repository's indentation policies. Run the project's configured formatter (or match existing style) before submitting changes.
 - Comments: Add comment lines only when absolutely necessary; prefer clear, self-explanatory code over extra inline comments.
- For frontend UI changes: propose token updates and one focused component example rather than broad scaffolds.
- Merge this file intelligently if an existing `.github/copilot-instructions.md` exists; preserve useful prior content.

If anything here is incomplete or you'd like a stronger emphasis on a particular design direction, say which section to expand.

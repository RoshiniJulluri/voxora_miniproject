# VOXORA

VOXORA is a React and FastAPI application for generating personalized podcast scripts, audio, transcripts, takeaways, and quizzes.

## Development

- Frontend: see [frontend/readme_frontend.md](frontend/readme_frontend.md).
- Backend setup, PostgreSQL, migrations, API, providers, and tests: see [backend/README.md](backend/README.md).
- Copy [backend/.env.example](backend/.env.example) to `backend/.env` for local development, then apply migrations before starting FastAPI.
- Start the backend from `backend` with `uvicorn app.main:app --reload --port 8000`, and the frontend from `frontend` with `npm run dev`.

The frontend dev server proxies `/api` to `localhost:8000`. Gemini and Murf are backend-only integrations. When credentials are absent, health, authentication, and preferences remain available; generation jobs report provider configuration errors and do not fabricate results.

Run frontend checks from `frontend` with `npm test` and `npm run build`. Run backend tests from `backend` with `pytest`.

## Deployment

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for the free-tier Render Blueprint deployment using Supabase Postgres and Cloudflare R2. [DEPLOYMENT.md](DEPLOYMENT.md) also documents the Docker Compose option. Both deploy configurations use one API instance because generation jobs use in-process background tasks.

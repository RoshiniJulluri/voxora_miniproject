# VOXORA backend

FastAPI API for VOXORA. It uses PostgreSQL through SQLAlchemy and Alembic. Gemini and Murf keys are optional for startup; generation jobs fail with a clear status message when the relevant provider is not configured. BackgroundTasks are process-local and are not durable across restarts.

## Local setup

1. Copy `.env.example` to `.env`. The default uses a local SQLite database; set `DATABASE_URL` to PostgreSQL if preferred.
2. Set `SECRET_KEY` to a fresh random secret and add provider credentials as needed.
3. From `backend`, create/activate a Python 3.12 virtual environment and install dependencies:

   ```powershell
   py -3.12 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

4. Apply schema migrations and run the API:

   ```powershell
   alembic upgrade head
   uvicorn app.main:app --reload --port 8000
   ```

Interactive API docs are available at `http://localhost:8000/docs`; health check is `/api/v1/health`.

The provider adapters use Google's `generateContent` JSON response mode and Murf's `POST /v1/speech/generate` endpoint. The app fetches available Gen2 voices from Murf after you configure a key. See the [Gemini API key guide](https://ai.google.dev/gemini-api/docs/api-key), [Gemini structured output guide](https://ai.google.dev/gemini-api/docs/structured-output?lang=rest), and [Murf synthesis API reference](https://murf.ai/api/docs/api-reference/text-to-speech/generate) for setup and account access details.

## Configuration

See `.env.example`. Keep `.env` private. `GEMINI_API_KEY` enables script generation. `MURF_API_KEY` enables audio synthesis; provide a voice ID supported by the Murf account. Local generated files are stored under `AUDIO_STORAGE_PATH` and served only through the authenticated podcast audio route. Cloud storage is not configured yet.

Bearer tokens are held by the frontend in local storage, expire after `ACCESS_TOKEN_EXPIRE_MINUTES`, and are discarded on logout. The default signing key is generated per backend process for local development; set a stable secret in the environment for deployments. CORS accepts the comma-separated origins in `FRONTEND_ORIGIN`.

## Tests

Tests use isolated in-memory SQLite and do not need PostgreSQL or provider credentials:

```powershell
pytest
```

The first migration creates the SQLAlchemy metadata tables. `BackgroundTasks` are appropriate for this initial single-process development setup only; use a durable worker when job recovery across restarts becomes a requirement.

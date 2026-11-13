# VOXORA deployment

For a non-Docker cloud deploy, use [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md). The root `render.yaml` Blueprint declares the static frontend, API, Postgres database, and audio disk together.

The Docker Compose setup below remains available for a self-hosted deployment. It runs the React app, FastAPI, and PostgreSQL together, and keeps PostgreSQL data and generated audio in persistent Docker volumes.

## Run the deployment locally

1. Install and start Docker Desktop.
2. Copy `.env.production.example` to a root-level `.env` file.
3. Replace every `replace_with_...` value. Keep `POSTGRES_PASSWORD` alphanumeric so it can be safely used in the database URL. Set `SECRET_KEY` to a long random value. Use the Gemini and Murf keys that already work in `backend/.env`.
4. From the repository root, run:

   ```powershell
   docker compose up --build -d
   ```

5. Open `http://localhost:8080`. The API runs behind the web container at `/api`; PostgreSQL is not exposed publicly.

To see startup logs, run `docker compose logs -f api web`. To stop the services without deleting data, run `docker compose down`. Do not add `-v` unless you intend to delete the database and generated audio volumes.

## Deploy to a cloud host

Choose a host that supports Docker Compose or equivalent containers, PostgreSQL, and persistent volumes. Configure the variables in `.env.production.example` as protected environment variables in the host dashboard; do not upload either `.env` file or commit provider keys. Set `FRONTEND_ORIGIN` to the public site origin and `WEB_PORT` according to the host's port requirements. Preserve the `postgres_data` and `audio_data` volumes across releases.

The current worker uses FastAPI `BackgroundTasks`, so run only one API replica. A process crash during generation can lose that in-progress job; a durable task queue is a later production-hardening step. This setup uses local audio files on a persistent volume rather than cloud object storage.

## Git and release sequence

Review the changes, confirm the root `.gitignore` excludes `.env`, commit, and push the branch. Then connect the repository to the chosen host, add the protected environment variables, configure persistent storage, and deploy. After the first deploy, verify registration, sign-in, a short audio generation, and access to the generated audio after an application restart.

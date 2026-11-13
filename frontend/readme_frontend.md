# VOXORA – Personalized AI Podcast Generator

VOXORA is an AI-powered personalized podcast generation platform that creates podcast experiences based on users' interests, knowledge levels, preferred languages, and listening preferences.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React

## Prerequisites

- Node.js (LTS version)
- npm
- Git

## Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd voxora_miniproject
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal.

## Production Build

```bash
npm run build
```

## Frontend Tests

```bash
npm test
```

The current UI regression test verifies that registration inputs retain focus while typing.

## Notes

- The frontend expects the FastAPI backend at `http://localhost:8000`; Vite proxies `/api` to that server.
- Set `VITE_API_BASE_URL` only when the frontend should call a different API origin. The default is `/api/v1`.
- Accounts, preferences, podcasts, quiz attempts, and audio playback use backend endpoints. Gemini and Murf credentials belong only in `backend/.env`.
- Do not commit API keys or environment secrets.

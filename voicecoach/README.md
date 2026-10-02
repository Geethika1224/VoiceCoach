# VoiceCoach — AI Voice Interview & Presentation Coach

VoiceCoach is a full-stack MVP for interview preparation, public speaking practice, and SIH-style presentations. The app includes:

- Secure user auth with JWT
- MongoDB-backed session persistence
- AI question generation and follow-ups via a provider-independent backend service
- Voice capture using the browser Web Speech API and text fallback
- Dashboard analytics, practice history, and session reports
- Mock AI mode for local development without external API keys

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS + React Router
- Backend: Node.js + Express + TypeScript + MongoDB + Mongoose
- Auth: JWT + bcrypt
- Testing: Vitest + Supertest

## Quick start

1. Install Node.js 20+.
2. From the project root:

```bash
npm install
npm run backend
```

3. In a second terminal:

```bash
npm run frontend
```

4. Open the Vite frontend URL shown by the terminal.

## Environment files

Copy the examples before starting:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Backend run

```bash
cd backend
npm install
npm run dev
```

## Frontend run

```bash
cd frontend
npm install
npm run dev
```

## MongoDB

Local development:

```bash
docker compose up -d
```

This starts MongoDB on `mongodb://127.0.0.1:27017/voicecoach`.

For Atlas, set `MONGO_URI` in the backend `.env` file.

## AI provider setup

The backend uses a mock AI service by default. To enable an LLM provider, set:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
```

If no key is set, VoiceCoach automatically uses the mock provider so the app remains usable for demos and testing.

## Scripts

From the project root:

```bash
npm install
npm run dev
npm run build
npm run test
```

## Features included in this MVP

- Landing page and auth flows
- Practice selection for interviews and SIH presentations
- Interview room with spoken questions and transcript history
- AI feedback and end-of-session report generation
- Dashboard and session history
- User profile and settings
- Mock AI fallback mode

## Notes

This is a local-demo MVP. Because the environment used here may not include a full Node toolchain by default, the code is structured so it can be run immediately on a development machine with npm installed.

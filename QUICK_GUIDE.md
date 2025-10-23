# 🚀 Quick Guide

This is the fastest way to run and try DermaSafe AI locally.

## 1) One-command start (recommended)

```bash
./quick_start.sh
```

What it does
- Builds Docker images on first run
- Starts Postgres, AI Service, Backend API, Chatbot, and Frontend
- Performs basic health checks

Open these URLs
- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs
- AI Service docs: http://localhost:8001/docs
- Chatbot docs: http://localhost:8002/docs

## 2) Manual with Docker Compose

```bash
docker compose build
docker compose up -d
docker compose logs -f backend-api
```

Health checks
```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
```

## 3) Development (run without Docker)

Terminal A — AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn ai_app.main:app --host 0.0.0.0 --port 8001 --reload
```

Terminal B — Backend API
```bash
cd backend-api
pip install -r requirements.txt
uvicorn backend_app.main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal C — Frontend
```bash
cd frontend
npm install
npm run dev
```

Terminal D — Chatbot (optional)
```bash
cd chatbot-service
cp .env.example .env  # set GEMINI_API_KEY
pip install -r requirements.txt
uvicorn chatbot_app.main:app --host 0.0.0.0 --port 8002 --reload
```

## API examples

Analyze via Backend API (recommended)
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "image=@path/to/skin.jpg" \
  -F "symptoms_selected=ngứa,đỏ" \
  -F "duration=1-2 tuần"
```

Direct call to AI Service
```bash
curl -X POST http://localhost:8001/analyze \
  -F "image=@path/to/skin.jpg"
```

Expected health responses
```bash
curl http://localhost:8000/health  # {"status":"ok"}
curl http://localhost:8001/health  # {"status":"ok"}
```

## Notes

- First run downloads a ~340MB model; allow a few minutes.
- Frontend uses a dev proxy to the Backend at /api/v1/* (configured in vite.config.ts).
- All results are screening-only and not medical diagnoses.

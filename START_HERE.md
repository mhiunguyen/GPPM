## 👋 Start here

Welcome to DermaSafe AI. This short page points you to the right docs depending on what you want to do.

### Run it now

- Easiest path: run ./quick_start.sh
- Manual path: docker compose up -d --build
- Open: Frontend at http://localhost:5173, APIs at http://localhost:8000/docs and http://localhost:8001/docs

### New to the project?

- QUICK_GUIDE.md — 5‑minute quick start
- INSTALLATION.md — detailed setup and troubleshooting
- docs/ARCHITECTURE_FLOW.md — system flow and components
- docs/DERMATOLOGY_INTEGRATION.md — AI and analyzer details

### Developing

- Backend API: uvicorn backend_app.main:app --reload --port 8000
- AI Service: uvicorn ai_app.main:app --reload --port 8001
- Frontend: npm run dev (proxy to backend at /api/v1/*)
- Chatbot (optional): uvicorn chatbot_app.main:app --reload --port 8002

### Health checks

- curl http://localhost:8000/health → {"status":"ok"}
- curl http://localhost:8001/health → {"status":"ok"}

### Notes

- First run downloads a ~340MB model (DermLIP). Subsequent runs are fast.
- This is a screening tool; it’s not a medical diagnostic device.

# 🏥 DermaSafe AI - Hệ thống Sàng lọc Rủi ro Da liễu# 🏥 GPPM - General Practice Prediction Model# DermaSafe-AI



[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)> **DermaSafe-AI**: Hệ thống hỗ trợ sàng lọc nguy cơ bệnh da liễu bằng AI![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/TEN_CUA_BAN/derma-safe-ai/ci.yml)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)

![License](https://img.shields.io/github/license/TEN_CUA_BAN/derma-safe-ai)

> **DermaSafe AI**: Ứng dụng web sử dụng Deep Learning (DermLIP model) để phân tích hình ảnh da và đưa ra đánh giá nguy cơ ban đầu, giúp người dùng quyết định có nên đi khám bác sĩ da liễu hay không.

Ứng dụng web sử dụng Deep Learning (DermLIP model) để phân tích hình ảnh da và đưa ra đánh giá nguy cơ ban đầu, giúp người dùng quyết định có nên đi khám bác sĩ da liễu hay không.![Issues](https://img.shields.io/github/issues/TEN_CUA_BAN/derma-safe-ai)

![DermaSafe AI Demo](docs/images/demo.png)



---

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](LICENSE)**Một công cụ sàng lọc rủi ro da liễu nguồn mở, dựa trên AI, ưu tiên sự an toàn và minh bạch.**

## ⚠️ CẢNH BÁO Y TẾ QUAN TRỌNG
# 🏥 DermaSafe AI (GPPM)

Open-source dermatology risk screening system. Upload a skin image, select symptoms, and get a triage-oriented risk level (High/Medium/Low) with clear explanations. Built with FastAPI, React, and a DermLIP-based analyzer.

Badges: Python 3.12+, FastAPI, React 19, MIT License

## ⚠️ Medical Disclaimer

DermaSafe AI is NOT a medical diagnostic device. Results are for screening only and do not replace professional medical advice. Always consult a dermatologist for diagnosis and treatment.

## � Architecture

Frontend (React 19 + Vite, :5173) → Backend API (FastAPI, :8000) → AI Service (FastAPI + DermLIP, :8001)
Optional: Chatbot Service (Gemini, :8002) and PostgreSQL for backend logging.

Services and ports
- frontend: http://localhost:5173
- backend-api: http://localhost:8000 (docs: /docs)
- ai-service: http://localhost:8001 (docs: /docs)
- chatbot (optional): http://localhost:8002 (docs: /docs)
- postgres (optional): :5432 (for backend logging)

## 🚀 Quick Start

Option A — One-liner
1) Make sure Docker and Docker Compose are installed.
2) From repo root:
   ./quick_start.sh

Option B — Manual with Docker Compose
- Build: docker compose build
- Run: docker compose up -d
- Logs (all): docker compose logs -f

Then open:
- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs and http://localhost:8001/docs

Health checks
- curl http://localhost:8000/health → {"status":"ok"}
- curl http://localhost:8001/health → {"status":"ok"}

## 🧑‍💻 Development (without Docker)

Terminal 1 — AI Service
- cd ai-service
- pip install -r requirements.txt
- uvicorn ai_app.main:app --host 0.0.0.0 --port 8001 --reload

Terminal 2 — Backend API
- cd backend-api
- pip install -r requirements.txt
- uvicorn backend_app.main:app --host 0.0.0.0 --port 8000 --reload

Terminal 3 — Frontend
- cd frontend
- npm install
- npm run dev

Terminal 4 — Chatbot (optional)
- cd chatbot-service
- cp .env.example .env  # add GEMINI_API_KEY
- pip install -r requirements.txt
- uvicorn chatbot_app.main:app --host 0.0.0.0 --port 8002 --reload

## 📚 Documentation

- Installation guide: INSTALLATION.md
- Quick guide: QUICK_GUIDE.md
- Architecture flow: docs/ARCHITECTURE_FLOW.md
- Dermatology integration: docs/DERMATOLOGY_INTEGRATION.md
- Symptom validation API: docs/SYMPTOM_VALIDATION_API.md
- Service docs: ai-service/README.md, chatbot-service/README.md, frontend/README.md

## 🔒 Privacy & Safety

- Images are processed for inference only and not stored.
- Clear on-screen disclaimers remind users this is a screening tool.

## 📝 License

- Project code: MIT License (see `LICENSE`).
- dermatology_module and AI model weights (DermLIP): CC BY-NC 4.0 (non-commercial). See `dermatology_module/LICENSE` and `THIRD_PARTY_NOTICES.md`.

Using this project together with DermLIP model weights imposes CC BY-NC 4.0 restrictions. Provide attribution to the DermLIP authors when required.

## 🙌 Credits and attribution

- DermLIP model authors: Siyuan Yan, Ming Hu, et al. — “Derm1M: A Million-Scale Vision-Language Dataset for Dermatology” (arXiv:2503.14911)
- OpenCLIP and related open-source projects

Made with ❤️ for safer, transparent AI triage.

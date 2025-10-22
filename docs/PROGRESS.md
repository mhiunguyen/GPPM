# DermaSafe-AI: Tiến độ Hiện tại

**Ngày cập nhật:** 19/10/2025  
**Trạng thái:** Giai đoạn 0–2 hoàn tất; MVP chạy được với Rules Engine + DB logging

---

## ✅ Hoàn thành

### Giai đoạn 0: Thiết lập & Nền tảng (100%)
- [x] Repo structure: `/frontend`, `/backend-api`, `/ai-service`, `/docs`, `/.github/workflows`
- [x] Tài liệu: `LICENSE`, `README.md`, `DEVELOPMENT_GUIDELINES.md`, `PROJECT_GUIDELINES.md`, `ROADMAP.MD`
- [x] `.gitignore` chuẩn cho Python/Node/Docker
- [x] `docker-compose.yml`: 4 services (frontend, backend-api, ai-service, postgres)
- [x] CI workflows: `ci-backend.yml`, `ci-ai-service.yml`, `ci-frontend.yml`

### Giai đoạn 1: AI-Service (80%)
- [x] **Module 2 (Symptoms):** JSON schema (`app/schemas.py` với `Symptoms`, `AnalyzeResult`)
- [x] **Module 3 (Decision Engine):** Rules engine (`app/logic/rules.py`) với unit tests (`tests/test_rules.py`)
- [x] **API:** Endpoint `/analyze` nhận:
  - Structured JSON qua `symptoms_json` FormData field (preferred)
  - Backward-compat: CSV qua `symptoms_selected` + `duration`
  - Sử dụng `decide_risk()` trả về `risk` + `reason` + `cv_scores`
- [x] Unit tests: `test_health.py`, `test_analyze.py`, `test_analyze_json.py`, `test_rules.py`
- [ ] **Module 1 (CV):** Chưa train model thật; đang dùng stub CV scores

### Giai đoạn 2: Backend-API (90%)
- [x] FastAPI service với Dockerfile
- [x] Endpoint `/health` và `/api/v1/analyze`
- [x] `/api/v1/analyze`: proxy sang AI-Service, nhận kết quả, log vào DB
- [x] **DB Models:** `AnalysisRecord`, `User` (SQLAlchemy)
- [x] **DB Logging:** Ghi log mỗi phân tích (ẩn danh) vào `analysis_records` table
- [x] DB init: `app/init_db.py` và SQL schema đã tạo trong Postgres
- [x] Unit test: `test_health.py`, `test_analyze.py` (mock AI-Service)

### Giai đoạn 3: Frontend (20%)
- [x] NGINX Dockerfile + placeholder `index.html`
- [x] `nginx.conf` reverse proxy `/api/` → backend-api
- [x] Form tối giản cho upload ảnh + nhập triệu chứng CSV
- [ ] Chưa chuyển sang React/Vue
- [ ] Chưa có `DisclaimerModal`, `SymptomSelector` (checkboxes), `ResultCard`, `Footer`

### Giai đoạn 4: Tích hợp & Kiểm thử E2E (30%)
- [x] Chạy toàn stack với `docker-compose up`
- [x] Smoke test thủ công qua curl và browser
- [x] Xác nhận luồng: frontend → backend-api → ai-service → rules engine → DB log → response
- [ ] Chưa có kịch bản E2E tự động (Cypress/Playwright)

---

## 📊 Theo Roadmap

| Giai đoạn | Hoàn thành | Còn lại |
|-----------|------------|---------|
| 0: Setup | 100% | - |
| 1: AI-Service | 80% | Train model CV thật, cấu hình threshold |
| 2: Backend-API | 90% | Thêm test coverage, CORS config |
| 3: Frontend | 20% | React/Vue UI components, DisclaimerModal, SymptomSelector |
| 4: E2E Test | 30% | Automated E2E tests |
| 5: Deploy | 0% | Cloud setup, production config, SSL |
| 6: Post-MVP | 0% | User auth, history, improved AI |

---

## 🎯 Tính năng Chính Đã hoạt động

1. **Rules-Based Risk Triage:**
   - Nhận ảnh (stub) + triệu chứng → Trả về risk (CAO/TRUNG BÌNH/THẤP) + lý do
   - Ưu tiên: Severe symptoms → CV melanoma high → Kết hợp → Default low

2. **Structured Symptoms Input:**
   - JSON schema: `{"symptoms_selected": [...], "duration": "..."}`
   - Backward-compat với CSV input

3. **Database Logging:**
   - Mọi phân tích được ghi vào `analysis_records` table (ẩn danh)
   - Sẵn sàng cho monitoring và cải tiến model

4. **API Documentation:**
   - Backend: http://localhost:8000/docs
   - AI-Service: http://localhost:8001/docs

---

## 🚀 Test Nhanh

**Khởi động stack:**
```bash
docker compose up -d
```

**Test health:**
```bash
curl http://localhost:8000/health
curl http://localhost:8001/health
```

**Test analyze (CSV - backward compat):**
```bash
printf "img" > /tmp/test.jpg
curl -X POST http://localhost:8000/api/v1/analyze \
  -F image=@/tmp/test.jpg \
  -F symptoms_selected="ngứa, chảy máu" \
  -F duration="1-2 tuần" | jq
```

**Test analyze (JSON structured):**
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F image=@/tmp/test.jpg \
  -F symptoms_json='{"symptoms_selected":["ngứa"],"duration":"1-2 tuần"}' | jq
```

**Xem DB logs:**
```bash
docker compose exec postgres psql -U derma -d derma \
  -c "SELECT id, risk, reason, created_at FROM analysis_records ORDER BY created_at DESC LIMIT 5;"
```

---

## 📝 Bước tiếp theo Đề xuất

### Ngắn hạn (1-2 ngày)
1. **Frontend nâng cấp:**
   - Init React app trong `/frontend`
   - Components: `DisclaimerModal`, `SymptomSelector` (checkboxes/dropdowns), `ResultCard`, `Footer`
   - Gửi `symptoms_json` chuẩn JSON thay vì CSV

2. **AI-Service improvements:**
   - Config threshold (env vars cho 0.3, 0.1, 0.6...)
   - Thêm test cho nhánh TRUNG BÌNH
   - README cho Module 1: cách train model

### Trung hạn (1 tuần)
3. **Model CV training:**
   - Tải ISIC + DermNet dataset
   - Fine-tune MobileNetV3 hoặc EfficientNetV2-B0
   - Export model → load vào AI-Service startup
   - Thay stub CV scores bằng inference thật

4. **E2E testing:**
   - Setup Cypress hoặc Playwright
   - Test flows: CAO/TRUNG BÌNH/THẤP scenarios

### Dài hạn (2-4 tuần)
5. **Deploy lên cloud:**
   - Chọn provider (DigitalOcean/GCP/AWS)
   - Managed Postgres
   - Docker Compose → K8s hoặc Docker Swarm
   - SSL cert (Let's Encrypt)
   - Domain setup

6. **Post-MVP features:**
   - User auth (JWT)
   - History tracking
   - Meta model (thay Rules bằng XGBoost)

---

## 📂 Cấu trúc Code Hiện tại

```
GPPM/
├── .github/workflows/
│   ├── ci-ai-service.yml
│   ├── ci-backend.yml
│   └── ci-frontend.yml
├── ai-service/
│   ├── app/
│   │   ├── logic/
│   │   │   └── rules.py          # Rules engine
│   │   ├── main.py               # FastAPI app
│   │   └── schemas.py            # Pydantic models
│   ├── tests/
│   │   ├── test_analyze.py
│   │   ├── test_analyze_json.py
│   │   ├── test_health.py
│   │   └── test_rules.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── backend-api/
│   ├── app/
│   │   ├── database.py           # SQLAlchemy setup
│   │   ├── init_db.py            # DB init script
│   │   ├── main.py               # FastAPI app + logging
│   │   └── models.py             # DB models
│   ├── tests/
│   │   ├── test_analyze.py
│   │   └── test_health.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── index.html                # Placeholder UI
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docs/
│   └── README.md
├── docker-compose.yml
├── .gitignore
├── LICENSE
├── README.md
├── DEVELOPMENT_GUIDELINES.md
├── PROJECT_GUIDELINES.md
└── ROADMAP.MD
```

---

**Tổng kết:** Dự án đã có nền tảng vững chắc với backend + AI service chạy được và logging vào DB. Bước quan trọng tiếp theo là nâng cấp frontend thành UI chuẩn và train model CV thật để thay thế stub.

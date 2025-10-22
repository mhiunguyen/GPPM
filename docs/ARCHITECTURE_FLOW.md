# 🏗️ Architecture Flow - GPPM (DermaSafe-AI)

**Status**: ✅ **Fully Integrated & Working** (Cập nhật: October 2025)

---

## 📊 System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│               FRONTEND (React + TypeScript)                  │
│                      Port: 5173                              │
│              Package: N/A (Vite build)                       │
│                                                              │
│  Components:                                                 │
│  • ImageUploader - Drag & drop, preview                     │
│  • SymptomSelector - 9 symptoms + duration                  │
│  • ResultCard - Display analysis results                    │
│  • DisclaimerModal - Medical disclaimer                     │
│  • Footer - Credits & contact                               │
│                                                              │
│  Tech: React 19, TailwindCSS 4, react-i18next               │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ HTTP POST /api/v1/analyze
                   │ (Proxied by Vite dev server → :8000)
                   │ Content-Type: multipart/form-data
                   ▼
┌──────────────────────────────────────────────────────────────┐
│               BACKEND-API (FastAPI)                          │
│                      Port: 8000                              │
│              Package: backend_app                            │
│                                                              │
│  Endpoints:                                                  │
│  • GET  /health       → Health check                        │
│  • POST /api/v1/analyze → Main analysis endpoint            │
│                                                              │
│  Logic:                                                      │
│  1. Validate multipart request (image + symptoms)           │
│  2. (Optional) Log request to PostgreSQL                    │
│  3. Forward to AI Service via httpx.AsyncClient             │
│  4. Receive AI response                                     │
│  5. (Optional) Log response                                 │
│  6. Return to frontend                                      │
│                                                              │
│  Tech: FastAPI, SQLAlchemy, PostgreSQL, httpx               │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ HTTP POST /analyze
                   │ (Internal call to localhost:8001)
                   │ Content-Type: multipart/form-data
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                AI-SERVICE (FastAPI)                          │
│                      Port: 8001                              │
│              Package: ai_app                                 │
│                                                              │
│  Endpoints:                                                  │
│  • GET  /health       → {"status":"ok","analyzer":"active"} │
│  • POST /analyze      → Main AI inference endpoint          │
│  • POST /analyze_json → Alternative JSON endpoint           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ STEP 1: Receive Request                                │ │
│  │ • Parse multipart/form-data                            │ │
│  │ • Extract: image (bytes), symptoms, duration           │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ STEP 2: Preprocess Image                               │ │
│  │ • Convert bytes → PIL.Image                            │ │
│  │ • Validate image format (JPEG/PNG)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ STEP 3: DermatologyAnalyzer.analyze(image)             │ │
│  │ Status: ✅ ACTIVE (torch 2.9.0 installed)              │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ DERMATOLOGY MODULE (Open-source Library)        │  │ │
│  │  │ Location: /workspaces/GPPM/dermatology_module   │  │ │
│  │  │                                                  │  │ │
│  │  │ a) Load DermLIP Model                            │  │ │
│  │  │    • Architecture: ViT-B/16 CLIP                │  │ │
│  │  │    • Model size: ~340MB                         │  │ │
│  │  │    • Source: HuggingFace SkinGPT-project/DermLIP│ │ │
│  │  │    • Cache: ~/.cache/huggingface/              │  │ │
│  │  │    • First load: ~10-15s, subsequent: instant   │  │ │
│  │  │                                                  │  │ │
│  │  │ b) Preprocess Image                             │  │ │
│  │  │    • Resize to 224x224                          │  │ │
│  │  │    • Normalize with CLIP preprocessing          │  │ │
│  │  │    • Convert to torch.Tensor                    │  │ │
│  │  │    • Move to device (CPU or CUDA)               │  │ │
│  │  │                                                  │  │ │
│  │  │ c) Encode Image with CLIP                       │  │ │
│  │  │    • image_features = model.encode_image(img)   │  │ │
│  │  │    • Output: 512-dim feature vector             │  │ │
│  │  │                                                  │  │ │
│  │  │ d) Compare with Disease Embeddings              │  │ │
│  │  │    • 44 disease classes supported               │  │ │
│  │  │    • Pre-computed text embeddings               │  │ │
│  │  │    • Cosine similarity computation              │  │ │
│  │  │    • Temperature-scaled softmax                 │  │ │
│  │  │                                                  │  │ │
│  │  │ e) Get Top-K Predictions (k=5)                  │  │ │
│  │  │    Example:                                     │  │ │
│  │  │      melanoma: 0.335 (33.5%)                    │  │ │
│  │  │      squamous_cell_carcinoma: 0.220 (22%)       │  │ │
│  │  │      basal_cell_carcinoma: 0.180 (18%)          │  │ │
│  │  │      actinic_keratosis: 0.145 (14.5%)           │  │ │
│  │  │      nevus: 0.120 (12%)                         │  │ │
│  │  │                                                  │  │ │
│  │  │ f) Lookup Disease Info                          │  │ │
│  │  │    • Vietnamese name mappings                   │  │ │
│  │  │    • Severity classification                    │  │ │
│  │  │    • Clinical descriptions                      │  │ │
│  │  │    • Treatment recommendations                  │  │ │
│  │  │                                                  │  │ │
│  │  │ g) Generate Clinical Concepts                   │  │ │
│  │  │    • Keyword extraction                         │  │ │
│  │  │    • ["ung thư da", "cần sinh thiết"]           │  │ │
│  │  │                                                  │  │ │
│  │  │ h) Generate Descriptions                        │  │ │
│  │  │    • Vietnamese explanations                    │  │ │
│  │  │    • Context-aware recommendations              │  │ │
│  │  │                                                  │  │ │
│  │  │ i) Return DermAnalysisResult                    │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ STEP 4: Map DermAnalysisResult → AnalyzeResult        │ │
│  │ • Extract cv_scores from predictions                   │ │
│  │ • Map primary_disease info (DiseaseInfo)              │ │
│  │ • Map alternative_diseases (top 4 alternatives)        │ │
│  │ • Extract clinical_concepts                            │ │
│  │ • Copy description, severity, recommendations          │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ STEP 5: Apply Enhanced Rules Engine                    │ │
│  │ File: ai_app/logic/rules.py (250+ lines)               │ │
│  │                                                         │ │
│  │ ✅ 7-LEVEL PRIORITY SYSTEM:                            │ │
│  │                                                         │ │
│  │ ┌─ Priority 1: Critical Symptoms ──────────────────┐   │ │
│  │ │ IF symptoms contain:                             │   │ │
│  │ │   - "chảy máu" (bleeding)                        │   │ │
│  │ │   - "lan rộng nhanh" (rapid spread)              │   │ │
│  │ │ THEN: risk = "cao" 🔴                            │   │ │
│  │ │ Reason: "Phát hiện triệu chứng nguy hiểm"        │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │ ┌─ Priority 2: High-Risk Diseases (>30%) ──────────┐   │ │
│  │ │ IF melanoma > 30%:                               │   │ │
│  │ │   risk = "cao" 🔴                                │   │ │
│  │ │ ELIF melanoma > 20%:                             │   │ │
│  │ │   risk = "cao" 🔴                                │   │ │
│  │ │ ELIF basal/squamous cell carcinoma > 30%:        │   │ │
│  │ │   risk = "cao" 🔴                                │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │ ┌─ Priority 3: New Lesion + High Risk (>15%) ──────┐   │ │
│  │ │ IF ("nốt ruồi mới" OR "nốt/đốm mới")            │   │ │
│  │ │ AND high_risk_disease > 15%:                     │   │ │
│  │ │   risk = "cao" 🔴                                │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │ ┌─ Priority 4: Moderate Risk + Symptoms ────────────┐   │ │
│  │ │ IF moderate_risk_disease detected                │   │ │
│  │ │ AND (change_symptoms OR inflammation_symptoms):  │   │ │
│  │ │   risk = "trung bình" 🟡                         │   │ │
│  │ │                                                   │   │ │
│  │ │ Moderate diseases: eczema, psoriasis,            │   │ │
│  │ │   dermatitis, rosacea, etc. (10+ diseases)       │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │ ┌─ Priority 5: High Risk 10-20% + Symptoms ────────┐   │ │
│  │ │ IF high_risk_disease (10-20%)                    │   │ │
│  │ │ AND any_symptoms:                                │   │ │
│  │ │   risk = "trung bình" 🟡                         │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │ ┌─ Priority 6: Moderate Risk >40% ──────────────────┐   │ │
│  │ │ IF moderate_risk_disease > 40%:                  │   │ │
│  │ │   risk = "trung bình" 🟡                         │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │ ┌─ Priority 7: Default (Low Risk) ──────────────────┐   │ │
│  │ │ ELSE:                                            │   │ │
│  │ │   risk = "thấp" 🟢                               │   │ │
│  │ │   Reason: "Đặc điểm da thông thường"             │   │ │
│  │ └──────────────────────────────────────────────────┘   │ │
│  │                                                         │ │
│  │ ✅ Key Features:                                       │ │
│  │ • Vietnamese disease name mapping (30+ diseases)       │ │
│  │ • Transparent, auditable logic (no black box)          │ │
│  │ • Symptom-aware risk adjustment                        │ │
│  │ • Detailed reasoning in Vietnamese                     │ │
│  │ • Conservative approach (safety first)                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ STEP 6: Return Complete AnalyzeResult                  │ │
│  │ {                                                      │ │
│  │   "risk": "cao" | "trung bình" | "thấp",              │ │
│  │   "reason": "Vietnamese explanation...",               │ │
│  │   "cv_scores": {"melanoma": 0.335, ...},              │ │
│  │   "primary_disease": {                                │ │
│  │     "name": "squamous_cell_carcinoma",                │ │
│  │     "vietnamese_name": "Ung thư tế bào vảy",          │ │
│  │     "confidence": 0.22,                               │ │
│  │     "severity": "nghiêm trọng",                       │ │
│  │     "description": "...",                             │ │
│  │     "recommendations": [...]                          │ │
│  │   },                                                  │ │
│  │   "alternative_diseases": [...],                      │ │
│  │   "clinical_concepts": ["ung thư da", ...],           │ │
│  │   "description": "Full analysis...",                  │ │
│  │   "overall_severity": "nghiêm trọng",                 │ │
│  │   "recommendations": [...]                            │ │
│  │ }                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Tech: FastAPI, PyTorch 2.9, OpenCLIP 3.2, DermLIP          │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ HTTP 200 OK (JSON)
                   │ Content-Type: application/json
                   ▼
┌──────────────────────────────────────────────────────────────┐
│               BACKEND-API (FastAPI)                          │
│                      Port: 8000                              │
│                                                              │
│  • Receives complete AnalyzeResult                           │
│  • (Optional) Logs to PostgreSQL:                            │
│      - Request timestamp                                     │
│      - Image metadata                                        │
│      - Symptoms selected                                     │
│      - AI response                                           │
│  • Forwards JSON response to frontend                        │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ HTTP 200 OK (JSON)
                   ▼
┌──────────────────────────────────────────────────────────────┐
│               FRONTEND (React)                               │
│              ResultCard Component                            │
│                                                              │
│  Display Example:                                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🔴 Mức độ rủi ro: CAO                                  │ │
│  │ ⚠️ Bạn nên đi khám ngay lập tức                        │ │
│  │                                                        │ │
│  │ 📋 Chẩn đoán chính:                                    │ │
│  │    Ung thư tế bào vảy (Squamous Cell Carcinoma)       │ │
│  │    Độ tin cậy: 22.0%                                   │ │
│  │                                                        │ │
│  │ 📝 Mô tả:                                              │ │
│  │    "Dựa trên phân tích ảnh, tổn thương này có khả     │ │
│  │     năng cao là Ung thư tế bào vảy. Đây là một loại   │ │
│  │     ung thư da phổ biến thứ hai..."                    │ │
│  │                                                        │ │
│  │ 💡 Khuyến nghị:                                        │ │
│  │    • ⚠️ ĐI KHÁM NGAY LẬP TỨC với bác sĩ da liễu       │ │
│  │    • Không tự điều trị                                 │ │
│  │    • Có thể cần sinh thiết để chẩn đoán chính xác     │ │
│  │    • Tránh tiếp xúc với ánh nắng mặt trời             │ │
│  │                                                        │ │
│  │ 🔄 Các chẩn đoán khác có thể:                          │ │
│  │    • Ung thư tế bào đáy (18.0%)                        │ │
│  │    • Loạn sản tế bào sừng quang hóa (14.5%)            │ │
│  │    • Nốt ruồi (12.0%)                                  │ │
│  │                                                        │ │
│  │ 🏥 Khái niệm lâm sàng:                                 │ │
│  │    #ung_thư_da #cần_sinh_thiết #theo_dõi_sát          │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Data Models

### AnalyzeRequest (Input)
```python
class AnalyzeRequest:
    image: UploadFile              # Image file (JPEG/PNG)
    symptoms_selected: str         # Comma-separated symptoms
    duration: str                  # Duration category
```

### DiseaseInfo
```python
class DiseaseInfo:
    name: str                      # English name
    vietnamese_name: str           # Vietnamese name
    confidence: float              # 0.0 - 1.0
    severity: str                  # Severity level
    description: str               # Detailed description
    recommendations: List[str]     # Action items
```

### AnalyzeResult (Output)
```python
class AnalyzeResult:
    # Legacy fields (backward compatible)
    risk: str                                    # "cao" | "trung bình" | "thấp"
    reason: str                                  # Brief explanation
    cv_scores: Dict[str, float]                  # CV predictions
    
    # Enhanced fields (from dermatology_module)
    primary_disease: DiseaseInfo                 # Top prediction
    alternative_diseases: List[DiseaseInfo]      # Alternatives
    clinical_concepts: List[str]                 # Keywords
    description: str                             # Full analysis
    overall_severity: str                        # Severity assessment
    recommendations: List[str]                   # Actionable items
```

---

## 🚀 Performance Metrics

### Response Times
- **AI Service (CPU - Intel i7)**:
  - First request: ~10-15s (model loading)
  - Subsequent: ~3-5s per image
  - Memory: ~2GB RAM

- **AI Service (GPU - NVIDIA T4)**:
  - First request: ~8-10s (model loading)
  - Subsequent: ~1-2s per image
  - Memory: ~2GB RAM + 2GB VRAM

### Model Specifications
- **DermLIP Model**: ~340MB
- **Cache Location**: `~/.cache/huggingface/`
- **44 Disease Classes** supported
- **Zero-shot learning** capability

---

## 🔌 API Endpoints

### Frontend → Backend-API

**POST /api/v1/analyze**
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "image=@skin_image.jpg" \
  -F "symptoms_selected=ngứa,đỏ,sưng" \
  -F "duration=1-2 tuần"
```

### Backend-API → AI-Service

**POST /analyze**
```bash
curl -X POST http://localhost:8001/analyze \
  -F "image=@skin_image.jpg" \
  -F "symptoms_selected=ngứa,đỏ,sưng" \
  -F "duration=1-2 tuần"
```

### Health Checks

**Backend-API Health**
```bash
curl http://localhost:8000/health
# Response: {"status":"ok"}
```

**AI-Service Health**
```bash
curl http://localhost:8001/health
# Response: {"status":"ok","dermatology_analyzer":"active"}
```

---

## 📦 Deployment

### Local Development
```bash
# Terminal 1 - AI Service
cd ai-service
uvicorn ai_app.main:app --host 0.0.0.0 --port 8001

# Terminal 2 - Backend API
cd backend-api
uvicorn backend_app.main:app --host 0.0.0.0 --port 8000

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### Docker Compose
```bash
docker-compose up --build
```

---

## ✅ Current Status

- ✅ **AI Model**: DermLIP active with 44 disease classes
- ✅ **Rules Engine**: 7-level priority system implemented
- ✅ **Vietnamese Support**: 30+ disease names mapped
- ✅ **Frontend**: All components working
- ✅ **Backend Integration**: Full stack communication verified
- ✅ **Testing**: 8/8 tests passing

---

## 📚 Related Documentation

- [Dermatology Integration](./DERMATOLOGY_INTEGRATION.md)
- [Development Guidelines](../DEVELOPMENT_GUIDELINES.md)
- [Main README](../README.md)

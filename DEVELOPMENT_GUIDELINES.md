# 📖 Development Guidelines - DermaSafe-AI (GPPM)

**Last Updated**: October 21, 2025  
**Status**: ✅ Active Development

---

## 🎯 1. Core Philosophy

### 1.1 Mission Statement

**DermaSafe-AI is a TRIAGE TOOL, NOT a diagnostic tool.**

Our ONLY goal: Answer the question **"Should you see a dermatologist?"**

We classify risk into 3 levels:
- 🔴 **HIGH (Cao)**: See a doctor IMMEDIATELY
- 🟡 **MEDIUM (Trung bình)**: Schedule appointment soon
- 🟢 **LOW (Thấp)**: Monitor, likely benign

### 1.2 Three Pillars

All development decisions MUST prioritize these in order:

1. **SAFETY FIRST** 🛡️
   - Never miss dangerous conditions (melanoma, carcinomas)
   - False positive >> False negative
   - 100% transparent, explainable logic
   - Rules-based engine (no black box AI for risk decisions)

2. **SPEED** ⚡
   - Response time < 5 seconds
   - Lightweight models only (MobileNet, EfficientNet, DermLIP)
   - No heavy infrastructure (TensorFlow Serving, Triton, etc.)
   - Simple, fast architecture

3. **SIMPLICITY** 📐
   - Focus on MVP (Minimum Viable Product)
   - No unnecessary features
   - No free-text NLP (use structured inputs only)
   - Clear, maintainable code

### 1.3 What We Are NOT

❌ **We are NOT Google Derm Assist**
- They: Attempt diagnosis ("You have Condition X")
- Us: Risk triage ("You should see a doctor")

❌ **We are NOT a medical device**
- No FDA/CE approval needed (not diagnostic)
- Educational/informational tool only
- Always recommend consulting real doctors

---

## 🏗️ 2. System Architecture

### 2.1 Microservices Design

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  Frontend   │─────▶│  Backend API │─────▶│ AI Service  │
│  (React)    │      │  (FastAPI)   │      │  (FastAPI)  │
│  Port 5173  │      │  Port 8000   │      │  Port 8001  │
└─────────────┘      └──────────────┘      └─────────────┘
```

**Separation of Concerns**:
- **Frontend**: UI/UX, data collection, result display
- **Backend-API**: Gateway, logging, orchestration
- **AI-Service**: AI inference ONLY (no business logic)

### 2.2 Package Naming Convention

**CRITICAL**: Avoid package name collisions!

✅ **CORRECT**:
```
ai-service/ai_app/          # Package: ai_app
backend-api/backend_app/    # Package: backend_app
frontend/src/               # No Python package
dermatology_module/         # Package: dermatology_module
```

❌ **WRONG** (causes conflicts):
```
ai-service/app/             # Collision!
backend-api/app/            # Collision!
```

### 2.3 Tech Stack Requirements

#### Frontend (MUST)
- **Framework**: React 18+ (TypeScript preferred)
- **Build Tool**: Vite 5+
- **Styling**: TailwindCSS 4+
- **i18n**: react-i18next
- **Platform**: Web only (no mobile for MVP)

#### Backend-API (MUST)
- **Framework**: FastAPI (Python 3.12+)
- **Database**: PostgreSQL 16+ (for logging)
- **ORM**: SQLAlchemy 2.0+
- **HTTP Client**: httpx (async)

#### AI-Service (MUST)
- **Framework**: FastAPI (Python 3.12+)
- **ML Framework**: PyTorch 2.9+ (CPU or GPU)
- **Model**: DermLIP (CLIP ViT-B/16)
- **Model Serving**: In-app loading (NO external serving)

---

## 🎨 3. Frontend Guidelines

### 3.1 User Flow

```
1. Landing Page
   ↓
2. Disclaimer Modal (MUST accept to continue)
   ↓
3. Image Upload (drag & drop or click)
   ↓
4. Symptom Selection (checkboxes ONLY)
   ↓
5. Duration Selection (dropdown)
   ↓
6. Submit → Loading
   ↓
7. Results Display
   ↓
8. (Optional) History, Profile
```

### 3.2 Symptom Input (CRITICAL)

**RULE**: ❌ **NO free-text input for symptoms!**

✅ **USE**: Structured inputs only
- Checkboxes: `[ ] Ngứa (Itching)`
- Radio buttons: `( ) < 1 tuần`
- Dropdowns: `[v] 1-2 tuần`

**Allowed Symptoms** (exact list):
```python
SYMPTOMS = [
    "ngứa",              # Itching
    "đau",               # Pain
    "đỏ",                # Redness
    "sưng",              # Swelling
    "nóng rát",          # Burning
    "chảy máu",          # Bleeding
    "lan rộng nhanh",    # Rapid spread
    "thay đổi màu sắc",  # Color change
    "nốt ruồi mới"       # New mole
]

DURATIONS = [
    "< 1 tuần",
    "1-2 tuần",
    "2-4 tuần",
    "> 1 tháng",
    "> 3 tháng"
]
```

### 3.3 Disclaimer Requirements

**Active Disclaimer** (MUST show on first visit):
```tsx
<DisclaimerModal>
  <h2>⚠️ Lưu ý quan trọng</h2>
  <p>Ứng dụng này KHÔNG phải là công cụ chẩn đoán y tế.</p>
  <p>Kết quả chỉ mang tính chất tham khảo.</p>
  <p>Luôn tham khảo bác sĩ da liễu chuyên nghiệp.</p>
  
  <Checkbox required>
    [ ] Tôi đã hiểu và đồng ý
  </Checkbox>
  
  <Button disabled={!agreed}>Tiếp tục</Button>
</DisclaimerModal>
```

**Passive Disclaimer** (MUST show in footer on ALL pages):
```tsx
<Footer>
  <p>
    ⚠️ Không thay thế ý kiến bác sĩ. 
    Chỉ dùng để tham khảo.
  </p>
</Footer>
```

### 3.4 Result Display

**MUST show all fields**:
```tsx
<ResultCard>
  {/* Risk Level */}
  <RiskBadge level={result.risk}>
    {result.risk === "cao" ? "🔴 CAO" : 
     result.risk === "trung bình" ? "🟡 TRUNG BÌNH" : 
     "🟢 THẤP"}
  </RiskBadge>
  
  {/* Primary Disease */}
  <Section title="📋 Chẩn đoán chính">
    <h3>{result.primary_disease.vietnamese_name}</h3>
    <p>Độ tin cậy: {result.primary_disease.confidence * 100}%</p>
  </Section>
  
  {/* Description */}
  <Section title="📝 Mô tả">
    <p>{result.description}</p>
  </Section>
  
  {/* Recommendations */}
  <Section title="💡 Khuyến nghị">
    <ul>
      {result.recommendations.map(rec => (
        <li key={rec}>{rec}</li>
      ))}
    </ul>
  </Section>
  
  {/* Alternatives */}
  <Section title="🔄 Chẩn đoán thay thế">
    {result.alternative_diseases.map(disease => (
      <Card key={disease.name}>
        <p>{disease.vietnamese_name} ({disease.confidence * 100}%)</p>
      </Card>
    ))}
  </Section>
  
  {/* Clinical Concepts */}
  <Section title="🏥 Khái niệm lâm sàng">
    <Tags>
      {result.clinical_concepts.map(concept => (
        <Tag key={concept}>#{concept}</Tag>
      ))}
    </Tags>
  </Section>
</ResultCard>
```

---

## 🔧 4. Backend-API Guidelines

### 4.1 Role

**Backend-API is an ORCHESTRATOR**, not a business logic layer.

**Responsibilities**:
- ✅ Receive requests from frontend
- ✅ Validate input
- ✅ Forward to AI-Service (via HTTP)
- ✅ Log requests/responses to PostgreSQL
- ✅ Return results to frontend

**NOT responsibilities**:
- ❌ AI inference (belongs to AI-Service)
- ❌ Risk decision logic (belongs to AI-Service)
- ❌ Image processing (belongs to AI-Service)

### 4.2 Endpoint Structure

```python
from fastapi import FastAPI, UploadFile, File, Form
from backend_app.schemas import AnalyzeResult
import httpx

app = FastAPI()

@app.post("/api/v1/analyze", response_model=AnalyzeResult)
async def analyze(
    image: UploadFile = File(...),
    symptoms_selected: str = Form(""),
    duration: str = Form("")
):
    """Proxy to AI-Service"""
    
    # 1. Validate
    if not image.content_type.startswith("image/"):
        raise HTTPException(400, "Invalid image format")
    
    # 2. Forward to AI-Service
    async with httpx.AsyncClient() as client:
        files = {"image": (image.filename, await image.read(), image.content_type)}
        data = {
            "symptoms_selected": symptoms_selected,
            "duration": duration
        }
        response = await client.post(
            "http://localhost:8001/analyze",
            files=files,
            data=data
        )
        result = response.json()
    
    # 3. (Optional) Log to database
    # log_analysis(result)
    
    # 4. Return
    return result
```

### 4.3 Database Schema (PostgreSQL)

**Minimal MVP Schema**:
```sql
-- For logging only (MVP)
CREATE TABLE analysis_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    image_hash VARCHAR(64),
    symptoms TEXT,
    duration VARCHAR(50),
    risk VARCHAR(20),
    primary_disease VARCHAR(100),
    confidence FLOAT
);

-- For future features (not MVP)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analysis_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    analysis_log_id INTEGER REFERENCES analysis_logs(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

**SQLAlchemy Models**:
```python
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from backend_app.database import Base
from datetime import datetime

class AnalysisLog(Base):
    __tablename__ = "analysis_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_hash = Column(String(64))
    symptoms = Column(Text)
    duration = Column(String(50))
    risk = Column(String(20))
    primary_disease = Column(String(100))
    confidence = Column(Float)
```

---

## 🤖 5. AI-Service Guidelines

### 5.1 Model Requirements

**MUST USE**: Lightweight, fast models

✅ **Recommended**:
- **DermLIP** (CLIP ViT-B/16) - Current choice ✅
  - Size: ~340MB
  - Speed: 3-5s/image (CPU), 1-2s (GPU)
  - Accuracy: ~85% on Derm1M
  - 44 disease classes

❌ **AVOID**:
- ResNet50/101/152 (too slow)
- VGG models (too large)
- Large Vision Transformers (ViT-L, ViT-H)
- Ensemble models (too slow)

### 5.2 Model Loading

**MUST**: Load model directly in FastAPI app (startup event)

```python
from fastapi import FastAPI
import sys
from pathlib import Path

# Add workspace to path
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(WORKSPACE_ROOT))

# Lazy import with fallback
try:
    import importlib
    analyzer_module = importlib.import_module("dermatology_module.analyzer")
    DermatologyAnalyzer = analyzer_module.DermatologyAnalyzer
    
    # Load model at startup
    analyzer = DermatologyAnalyzer()
    ANALYZER_STATUS = "active"
    print("✅ DermLIP model loaded successfully")
except Exception as e:
    print(f"⚠️ Model loading failed: {e}")
    analyzer = None
    ANALYZER_STATUS = "stub_mode"

app = FastAPI()
```

**❌ AVOID**:
- TensorFlow Serving (too complex)
- TorchServe (unnecessary overhead)
- NVIDIA Triton (overkill for MVP)
- Separate model servers

### 5.3 Rules Engine (CRITICAL)

**RULE**: ❌ **NO black-box AI for risk decisions!**

✅ **MUST USE**: Transparent, auditable IF/ELIF/ELSE logic

**File**: `ai_app/logic/rules.py`

```python
def decide_risk(
    cv_scores: Dict[str, float],
    symptoms_selected: str,
    duration: str
) -> Tuple[str, str]:
    """
    7-level priority system for risk assessment
    
    Returns: (risk_level, reason)
    """
    symptoms_set = {s.strip().lower() for s in symptoms_selected.split(",")}
    
    # Priority 1: CRITICAL symptoms
    if "chảy máu" in symptoms_set or "lan rộng nhanh" in symptoms_set:
        return ("cao", "⚠️ Triệu chứng nghiêm trọng - cần khám ngay")
    
    # Priority 2: HIGH-RISK diseases (>30%)
    melanoma_score = cv_scores.get("melanoma", 0)
    if melanoma_score > 0.30:
        return ("cao", f"🔴 Nguy cơ ung thư hắc tố cao ({melanoma_score*100:.1f}%)")
    elif melanoma_score > 0.20:
        return ("cao", f"🔴 Phát hiện dấu hiệu ung thư hắc tố ({melanoma_score*100:.1f}%)")
    
    # Priority 3: NEW LESION + high risk (>15%)
    if any(s in symptoms_set for s in ["nốt ruồi mới", "nốt/đốm mới"]):
        for disease in HIGH_RISK_DISEASES:
            score = cv_scores.get(disease, 0)
            if score > 0.15:
                return ("cao", f"🟡→🔴 Nốt mới với nguy cơ {disease}")
    
    # Priority 4-7: ... (continue with other priorities)
    
    # Default: LOW risk
    return ("thấp", "🟢 Đặc điểm da thông thường")
```

**Why Rules-Based?**
- ✅ 100% explainable (medical safety requirement)
- ✅ Easy to audit and adjust
- ✅ No training data bias
- ✅ Transparent to users
- ✅ Easy to add medical expert knowledge

**❌ NEVER use** for risk decisions:
- Machine learning models (XGBoost, Random Forest)
- Neural networks
- Black-box ensembles
- Multi-modal AI fusion

### 5.4 Response Schema

**MUST return** (backward compatible + enhanced):

```python
from pydantic import BaseModel
from typing import List, Dict, Optional

class DiseaseInfo(BaseModel):
    name: str
    vietnamese_name: str
    confidence: float
    severity: str
    description: str
    recommendations: List[str]

class AnalyzeResult(BaseModel):
    # Legacy (backward compatible)
    risk: str                           # "cao" | "trung bình" | "thấp"
    reason: str                         # Short explanation
    cv_scores: Dict[str, float]         # {"melanoma": 0.33, ...}
    
    # Enhanced (new)
    primary_disease: Optional[DiseaseInfo]
    alternative_diseases: Optional[List[DiseaseInfo]]
    clinical_concepts: Optional[List[str]]
    description: Optional[str]
    overall_severity: Optional[str]
    recommendations: Optional[List[str]]
```

---

## 🧪 6. Testing Requirements

### 6.1 Test Coverage

**MUST have** tests for:
- ✅ All API endpoints (`/health`, `/analyze`)
- ✅ Rules engine (all 7 priority levels)
- ✅ Schema validation
- ✅ Error handling

**Target**: >80% code coverage

### 6.2 Test Structure

```
ai-service/tests/
├── test_health.py          # Health check endpoint
├── test_analyze.py         # Main analyze endpoint
├── test_analyze_json.py    # Alternative JSON endpoint
└── test_rules.py           # Rules engine logic

backend-api/tests/
├── test_health.py          # Health check
└── test_analyze.py         # Proxy endpoint

frontend/tests/
└── e2e.spec.ts             # End-to-end with Playwright
```

### 6.3 Running Tests

```bash
# Python tests
cd ai-service && pytest -v
cd backend-api && pytest -v

# Frontend E2E
cd frontend && npm run test:e2e
```

### 6.4 Mock Data

**For AI model tests**, use mock analyzer:

```python
@pytest.fixture
def mock_analyzer():
    """Mock DermatologyAnalyzer for testing"""
    class MockAnalyzer:
        def analyze(self, image):
            return MockAnalysisResult(
                predictions=[
                    MockPrediction("melanoma", 0.35),
                    MockPrediction("nevus", 0.40),
                ],
                description="Mock analysis",
                clinical_concepts=["mock", "test"]
            )
    return MockAnalyzer()
```

---

## 📦 7. Deployment Guidelines

### 7.1 Environment Variables

```bash
# ai-service/.env
MODEL_CACHE_DIR=/root/.cache/huggingface
DEVICE=cpu  # or 'cuda'
LOG_LEVEL=info

# backend-api/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/dermasafe
AI_SERVICE_URL=http://localhost:8001
LOG_LEVEL=info

# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_APP_VERSION=1.0.0
```

### 7.2 Docker Best Practices

**ai-service/Dockerfile**:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Copy dermatology_module first
COPY dermatology_module /app/dermatology_module

# Copy ai-service
COPY ai-service /app/ai-service

# Install dependencies
RUN pip install --no-cache-dir -r ai-service/requirements-cpu.txt

# Install as editable package
RUN pip install -e ai-service

# Cache model (optional, makes startup faster)
# RUN python -c "from dermatology_module.analyzer import DermatologyAnalyzer; DermatologyAnalyzer()"

CMD ["uvicorn", "ai_app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend-api
  
  backend-api:
    build: 
      context: .
      dockerfile: ./backend-api/Dockerfile
    ports:
      - "8000:8000"
    environment:
      AI_SERVICE_URL: http://ai-service:8001
      DATABASE_URL: postgresql://user:pass@postgres:5432/dermasafe
    depends_on:
      - ai-service
      - postgres
  
  ai-service:
    build:
      context: .
      dockerfile: ./ai-service/Dockerfile
    ports:
      - "8001:8001"
    volumes:
      - model_cache:/root/.cache/huggingface
    environment:
      DEVICE: cpu
  
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: dermasafe
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  model_cache:
  postgres_data:
```

---

## 🔒 8. Security & Privacy

### 8.1 Medical Data Handling

**MUST follow**:
- ❌ **NO permanent storage** of medical images (for MVP)
- ❌ **NO personal identifiable information** (PII) collection
- ✅ **DO log** anonymized metadata only (image hash, results)
- ✅ **DO delete** uploaded images after analysis

### 8.2 API Security

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

# CORS (restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "dermasafe.com"]
)

# Rate limiting (TODO: add in production)
# Use: slowapi or fastapi-limiter
```

---

## 📊 9. Monitoring & Logging

### 9.1 Log Format

```python
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("app.log")
    ]
)

logger = logging.getLogger("ai_service")

# Usage
logger.info("Model loaded successfully")
logger.warning("GPU not available, using CPU")
logger.error("Analysis failed", exc_info=True)
```

### 9.2 Metrics to Track

**AI-Service**:
- Model load time
- Inference time per image
- Analyzer status (active/stub_mode)
- Error rate

**Backend-API**:
- Request count
- Response time
- Error rate
- Database connection pool

**Frontend**:
- Page load time
- API call latency
- User flow completion rate

---

## 🚀 10. Development Workflow

### 10.1 Git Workflow

```bash
main (production)
  └─ develop (staging)
      └─ feature/xyz (work here)
```

**Branches**:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### 10.2 Commit Messages

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build tasks, configs

**Example**:
```
feat(ai-service): add DermLIP model integration

- Integrated DermatologyAnalyzer
- Added 7-level risk priority system
- Mapped 30+ Vietnamese disease names

Closes #42
```

### 10.3 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

---

## 📚 11. Documentation Requirements

**MUST maintain**:
- ✅ README.md (project overview, quick start)
- ✅ ARCHITECTURE_FLOW.md (system design)
- ✅ DERMATOLOGY_INTEGRATION.md (AI integration details)
- ✅ DEVELOPMENT_GUIDELINES.md (this file)
- ✅ API documentation (FastAPI auto-generated)

**Format**: Markdown, with clear sections and examples

---

## ✅ 12. Definition of Done (DoD)

A feature is **DONE** when:
- [ ] Code implemented and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] No critical security issues
- [ ] Performance meets requirements (<5s response)
- [ ] Merged to develop branch

---

## 🎓 13. Resources

### Learning Materials
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **PyTorch**: https://pytorch.org/tutorials/
- **DermLIP**: https://github.com/SkinGPT-project/DermLIP

### Medical Resources
- **ISIC Dataset**: https://www.isic-archive.com/
- **DermNet**: https://dermnetnz.org/
- **AAD**: https://www.aad.org/

---

**Remember**: SAFETY > SPEED > SIMPLICITY

Always prioritize user safety over features or convenience.

---

**Document Version**: 2.0  
**Last Reviewed**: October 21, 2025

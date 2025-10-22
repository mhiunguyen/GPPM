# 🔬 Dermatology Module Integration Guide

**Status**: ✅ **Fully Integrated & Active** (Updated: October 2025)

---

## 📋 Overview

Module `dermatology_module` đã được tích hợp thành công vào GPPM để phân tích ảnh da liễu bằng AI model **DermLIP** (Vision-Language Model). Module này sử dụng zero-shot learning với CLIP architecture để phân loại 44+ loại bệnh da liễu.

---

## 🎯 What Changed?

### 1. Package Structure (CRITICAL)

**Vấn đề**: Cả `ai-service` và `backend-api` đều có thư mục tên `app/`, gây xung đột import.

**Giải pháp**: Đổi tên packages
- `ai-service/app/` → `ai-service/ai_app/`
- `backend-api/app/` → `backend-api/backend_app/`

**Tạo pyproject.toml cho editable install**:

**ai-service/pyproject.toml**:
```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "ai_app"
version = "0.1.0"

[tool.setuptools.packages.find]
where = ["."]
include = ["ai_app*"]
```

**backend-api/pyproject.toml**:
```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "backend_app"
version = "0.1.0"

[tool.setuptools.packages.find]
where = ["."]
include = ["backend_app*"]
```

**Installation**:
```bash
cd ai-service && pip install -e .
cd ../backend-api && pip install -e .
```

---

### 2. Dependencies Added

**ai-service/requirements-cpu.txt** (NEW - ~500MB):
```txt
torch==2.9.0
torchvision
open_clip_torch==3.2.0
huggingface_hub
pillow
numpy
```

**ai-service/requirements.txt** (Full - includes GPU):
```txt
torch>=2.9.0
torchvision
open_clip_torch>=3.2.0
# ... (rest of dependencies)
```

**Cài đặt**:
```bash
# CPU only (recommended for development)
pip install -r requirements-cpu.txt

# GPU (requires CUDA)
pip install -r requirements.txt
```

---

### 3. Schema Extensions

**File: `ai-service/ai_app/schemas.py`**

Đã thêm các models mới:

```python
from pydantic import BaseModel
from typing import List, Dict, Optional

class DiseaseInfo(BaseModel):
    """Thông tin chi tiết về một bệnh"""
    name: str                      # Tên tiếng Anh: "melanoma"
    vietnamese_name: str           # Tên tiếng Việt: "Ung thư hắc tố"
    confidence: float              # Độ tin cậy: 0.0 - 1.0
    severity: str                  # Mức độ: "rất nghiêm trọng"
    description: str               # Mô tả chi tiết
    recommendations: List[str]     # Danh sách khuyến nghị

class AnalyzeResult(BaseModel):
    """Kết quả phân tích"""
    # Legacy fields (backward compatible)
    risk: str                                    # "cao" | "trung bình" | "thấp"
    reason: str                                  # Lý do ngắn gọn
    cv_scores: Optional[Dict[str, float]]        # Điểm số từ CV model
    
    # New enhanced fields (from dermatology_module)
    primary_disease: Optional[DiseaseInfo]       # Chẩn đoán chính
    alternative_diseases: Optional[List[DiseaseInfo]]  # Chẩn đoán thay thế
    clinical_concepts: Optional[List[str]]       # Khái niệm lâm sàng
    description: Optional[str]                   # Mô tả tổng quan
    overall_severity: Optional[str]              # Mức độ nghiêm trọng tổng thể
    recommendations: Optional[List[str]]         # Khuyến nghị hành động
```

**backend-api/backend_app/schemas.py** - Same structure (duplicated for independence)

---

### 4. AI Service Integration

**File: `ai-service/ai_app/main.py`**

#### a) Imports & Path Setup

```python
import sys
import os
from pathlib import Path

# Add workspace root to sys.path for dermatology_module import
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(WORKSPACE_ROOT))

# Lazy import with fallback
try:
    import importlib
    analyzer_module = importlib.import_module("dermatology_module.analyzer")
    DermatologyAnalyzer = analyzer_module.DermatologyAnalyzer
    analyzer = DermatologyAnalyzer()
    ANALYZER_STATUS = "active"
except Exception as e:
    print(f"⚠️ DermatologyAnalyzer not available: {e}")
    print("📝 Running in stub mode (fake predictions)")
    analyzer = None
    ANALYZER_STATUS = "stub_mode"
```

#### b) Health Check Endpoint

```python
@app.get("/health")
async def health_check():
    """Health check with analyzer status"""
    return {
        "status": "ok",
        "dermatology_analyzer": ANALYZER_STATUS
    }
```

#### c) Analyze Endpoint

```python
@app.post("/analyze", response_model=AnalyzeResult)
async def analyze(
    image: UploadFile = File(...),
    symptoms_selected: str = Form(""),
    duration: str = Form("")
):
    """Main analysis endpoint"""
    
    # 1. Read image
    image_bytes = await image.read()
    pil_image = Image.open(io.BytesIO(image_bytes))
    
    # 2. Use DermatologyAnalyzer if available
    if analyzer:
        derm_result = analyzer.analyze(pil_image)
        
        # Map to AnalyzeResult
        cv_scores = {pred.name: pred.confidence 
                     for pred in derm_result.predictions}
        
        primary = derm_result.predictions[0]
        primary_disease = DiseaseInfo(
            name=primary.name,
            vietnamese_name=primary.vietnamese_name,
            confidence=primary.confidence,
            severity=primary.severity,
            description=primary.description,
            recommendations=primary.recommendations
        )
        
        alternative_diseases = [
            DiseaseInfo(
                name=pred.name,
                vietnamese_name=pred.vietnamese_name,
                confidence=pred.confidence,
                severity=pred.severity,
                description=pred.description,
                recommendations=pred.recommendations
            )
            for pred in derm_result.predictions[1:5]
        ]
    else:
        # Fallback to stub mode
        cv_scores = {"melanoma": 0.1, "nevus": 0.9}
        primary_disease = None
        alternative_diseases = None
    
    # 3. Apply rules engine
    from ai_app.logic.rules import decide_risk
    risk, reason = decide_risk(cv_scores, symptoms_selected, duration)
    
    # 4. Return result
    return AnalyzeResult(
        risk=risk,
        reason=reason,
        cv_scores=cv_scores,
        primary_disease=primary_disease,
        alternative_diseases=alternative_diseases,
        clinical_concepts=derm_result.clinical_concepts if analyzer else [],
        description=derm_result.description if analyzer else "",
        overall_severity=derm_result.overall_severity if analyzer else "",
        recommendations=derm_result.recommendations if analyzer else []
    )
```

---

### 5. Enhanced Rules Engine

**File: `ai-service/ai_app/logic/rules.py`**

Đã được viết lại hoàn toàn từ ~60 lines → **250+ lines**:

#### Key Components:

**a) Disease Name Mapping (30+ diseases)**:
```python
def get_disease_vietnamese_name(disease_name: str) -> str:
    """Map English disease name to Vietnamese"""
    mapping = {
        "melanoma": "Ung thư hắc tố (Melanoma)",
        "basal cell carcinoma": "Ung thư tế bào đáy",
        "squamous cell carcinoma": "Ung thư tế bào vảy",
        "actinic keratosis": "Loạn sản tế bào sừng quang hóa",
        "seborrheic keratosis": "U sừng tiết bã",
        "nevus": "Nốt ruồi",
        "eczema": "Chàm (Eczema)",
        "psoriasis": "Vảy nến (Psoriasis)",
        "dermatitis": "Viêm da (Dermatitis)",
        "rosacea": "Rám má (Rosacea)",
        # ... 20+ more
    }
    return mapping.get(disease_name.lower(), disease_name.title())
```

**b) High-Risk Diseases**:
```python
HIGH_RISK_DISEASES = {
    "melanoma": "Ung thư hắc tố (Melanoma)",
    "basal cell carcinoma": "Ung thư tế bào đáy",
    "squamous cell carcinoma": "Ung thư tế bào vảy",
    "actinic keratosis": "Loạn sản tế bào sừng quang hóa"
}
```

**c) Moderate-Risk Diseases (10+)**:
```python
MODERATE_RISK_DISEASES = {
    "eczema": "Chàm",
    "psoriasis": "Vảy nến",
    "dermatitis": "Viêm da",
    "rosacea": "Rám má",
    "seborrheic dermatitis": "Viêm da tiết bã",
    "contact dermatitis": "Viêm da tiếp xúc",
    "atopic dermatitis": "Viêm da cơ địa",
    "acne": "Mụn trứng cá",
    "folliculitis": "Viêm nang lông",
    "cellulitis": "Viêm tế bào"
}
```

**d) Symptom Categories**:
```python
CHANGE_SYMPTOMS = {
    "thay đổi màu sắc", "thay đổi kích thước",
    "thay đổi hình dạng", "nốt ruồi mới", "nốt/đốm mới"
}

INFLAMMATION_SYMPTOMS = {
    "ngứa", "đau", "sưng", "đỏ", "nóng rát", "chảy máu"
}
```

**e) 7-Level Priority System**:
```python
def decide_risk(cv_scores: Dict[str, float],
                symptoms_selected: str,
                duration: str) -> Tuple[str, str]:
    """
    Enhanced risk decision with 7 priority levels
    
    Returns:
        (risk_level, reason_in_vietnamese)
    """
    symptoms_set = {s.strip().lower() for s in symptoms_selected.split(",")}
    
    # Priority 1: Critical symptoms
    if "chảy máu" in symptoms_set or "lan rộng nhanh" in symptoms_set:
        return "cao", "⚠️ Phát hiện triệu chứng nghiêm trọng (chảy máu/lan rộng nhanh)..."
    
    # Priority 2: High-risk diseases (>30%)
    for disease, vn_name in HIGH_RISK_DISEASES.items():
        score = cv_scores.get(disease.replace(" ", "_"), 0)
        if score > 0.3:
            return "cao", f"🔴 Nguy cơ {vn_name} cao ({score*100:.1f}%)..."
        elif disease == "melanoma" and score > 0.2:
            return "cao", f"🔴 Phát hiện nguy cơ {vn_name} ({score*100:.1f}%)..."
    
    # Priority 3: New lesion + high risk (>15%)
    has_new_lesion = any(s in symptoms_set 
                         for s in ["nốt ruồi mới", "nốt/đốm mới"])
    if has_new_lesion:
        for disease in HIGH_RISK_DISEASES:
            score = cv_scores.get(disease.replace(" ", "_"), 0)
            if score > 0.15:
                vn_name = get_disease_vietnamese_name(disease)
                return "cao", f"🟡→🔴 Nốt mới xuất hiện với nguy cơ {vn_name}..."
    
    # Priority 4: Moderate risk + symptoms
    for disease, vn_name in MODERATE_RISK_DISEASES.items():
        score = cv_scores.get(disease.replace(" ", "_"), 0)
        if score > 0.3:
            has_change = any(s in symptoms_set for s in CHANGE_SYMPTOMS)
            has_inflammation = any(s in symptoms_set for s in INFLAMMATION_SYMPTOMS)
            if has_change or has_inflammation:
                return "trung bình", f"🟡 {vn_name} với triệu chứng đi kèm..."
    
    # Priority 5: High risk (10-20%) + any symptoms
    if symptoms_set:
        for disease in HIGH_RISK_DISEASES:
            score = cv_scores.get(disease.replace(" ", "_"), 0)
            if 0.1 < score <= 0.2:
                vn_name = get_disease_vietnamese_name(disease)
                return "trung bình", f"🟡 Có dấu hiệu {vn_name} nhẹ..."
    
    # Priority 6: Moderate risk alone (>40%)
    for disease, vn_name in MODERATE_RISK_DISEASES.items():
        score = cv_scores.get(disease.replace(" ", "_"), 0)
        if score > 0.4:
            return "trung bình", f"🟡 Nguy cơ {vn_name} ({score*100:.1f}%)..."
    
    # Priority 7: Default (low risk)
    return "thấp", "🟢 Các đặc điểm tương tự với tình trạng da thông thường..."
```

---

## 🧪 Testing

### Unit Tests

**ai-service/tests/** - 6 tests:
```bash
cd ai-service
pytest -v

# Output:
# test_health.py::test_health_check PASSED
# test_analyze.py::test_analyze_endpoint PASSED
# test_analyze.py::test_analyze_with_symptoms PASSED
# test_analyze_json.py::test_analyze_json PASSED
# test_rules.py::test_decide_risk_high PASSED
# test_rules.py::test_decide_risk_low PASSED
```

**backend-api/tests/** - 2 tests:
```bash
cd backend-api
pytest -v

# Output:
# test_health.py::test_health_check PASSED
# test_analyze.py::test_analyze_endpoint PASSED
```

### Integration Test

**test_dermatology_integration.py** (root):
```bash
python test_dermatology_integration.py

# Expected output:
# ✅ DermatologyAnalyzer imported successfully
# ✅ Analyzer initialized
# ✅ Analysis completed
# 📊 Results: {...}
```

---

## 📦 Docker Setup

**docker-compose.yml**:
```yaml
services:
  ai-service:
    build:
      context: .              # Build from root for dermatology_module
      dockerfile: ./ai-service/Dockerfile
    ports:
      - "8001:8001"
    volumes:
      - ./dermatology_module:/app/dermatology_module
      - ~/.cache/huggingface:/root/.cache/huggingface  # Cache models
    environment:
      - PYTHONUNBUFFERED=1
```

**ai-service/Dockerfile**:
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Copy dermatology_module
COPY dermatology_module /app/dermatology_module

# Copy ai-service
COPY ai-service /app/ai-service

# Install dependencies
RUN pip install --no-cache-dir -r ai-service/requirements-cpu.txt

# Install as editable package
RUN pip install -e ai-service

CMD ["uvicorn", "ai_app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

---

## 🚀 Running the System

### Option 1: Local Development

```bash
# Terminal 1 - AI Service
cd ai-service
pip install -r requirements-cpu.txt
pip install -e .
uvicorn ai_app.main:app --reload --port 8001

# Terminal 2 - Backend API
cd backend-api
pip install -r requirements.txt
pip install -e .
uvicorn backend_app.main:app --reload --port 8000

# Terminal 3 - Frontend
cd frontend
npm install
npm run dev
```

### Option 2: Docker

```bash
docker-compose up --build
```

### Option 3: Quick Start Script

```bash
./quick_start.sh
```

---

## 📊 DermLIP Model Details

### Architecture
- **Base Model**: CLIP ViT-B/16
- **Training Data**: Derm1M dataset (1M+ dermatology images)
- **Task**: Zero-shot classification
- **Output**: 44 disease classes

### Supported Diseases (44 total)

**Cancers (7)**:
- Melanoma
- Basal Cell Carcinoma
- Squamous Cell Carcinoma
- Actinic Keratosis
- Merkel Cell Carcinoma
- Cutaneous T-cell Lymphoma
- Kaposi Sarcoma

**Inflammatory (15)**:
- Eczema / Atopic Dermatitis
- Psoriasis
- Contact Dermatitis
- Seborrheic Dermatitis
- Rosacea
- Acne
- Folliculitis
- Cellulitis
- Impetigo
- Erysipelas
- Urticaria (Hives)
- Angioedema
- Drug Eruption
- Erythema Multiforme
- Stevens-Johnson Syndrome

**Benign Growths (10)**:
- Nevus (Mole)
- Seborrheic Keratosis
- Skin Tag
- Lipoma
- Dermatofibroma
- Hemangioma
- Cherry Angioma
- Pyogenic Granuloma
- Keloid
- Wart

**Infections (8)**:
- Fungal (Tinea)
- Candidiasis
- Herpes Simplex
- Herpes Zoster (Shingles)
- Molluscum Contagiosum
- Scabies
- Lice
- Bacterial Infection

**Others (4)**:
- Vitiligo
- Alopecia Areata
- Lichen Planus
- Pityriasis Rosea

### Performance
- **Accuracy**: ~85% on Derm1M test set
- **Inference Time**: 
  - CPU: 3-5s per image
  - GPU: 1-2s per image
- **Memory**: ~2GB RAM

---

## ⚠️ Important Notes

### 1. First Run
- Model downloads from HuggingFace (~340MB)
- Takes 10-15 seconds
- Cached afterwards in `~/.cache/huggingface/`

### 2. CPU vs GPU
- **CPU**: Recommended for development, ~3-5s per image
- **GPU**: Production use, ~1-2s per image, requires CUDA

### 3. Backward Compatibility
- Old API endpoints still work
- Legacy fields (`risk`, `reason`, `cv_scores`) always present
- New fields (`primary_disease`, etc.) are optional

### 4. Fallback Mode
- If torch/open_clip not installed, runs in stub mode
- Returns fake predictions for testing
- Check `/health` endpoint for analyzer status

---

## 🐛 Troubleshooting

### Error: "No module named 'open_clip'"
```bash
pip install open_clip_torch torch
```

### Error: "DermatologyAnalyzer not available"
```bash
# Check if torch is installed
python -c "import torch; print(torch.__version__)"

# Check analyzer status
curl http://localhost:8001/health
```

### Model Not Loading
```bash
# Clear cache and re-download
rm -rf ~/.cache/huggingface/hub/models--SkinGPT-project--DermLIP

# Restart AI service
pkill -f uvicorn
uvicorn ai_app.main:app --port 8001
```

### Import Errors
```bash
# Make sure packages are installed as editable
cd ai-service && pip install -e .
cd ../backend-api && pip install -e .

# Check sys.path
python -c "import sys; print('\n'.join(sys.path))"
```

---

## 📚 References

- **DermLIP Paper**: https://arxiv.org/abs/2503.14911
- **DermLIP GitHub**: https://github.com/SkinGPT-project/DermLIP
- **Derm1M Dataset**: https://huggingface.co/datasets/SkinGPT-project/Derm1M
- **OpenCLIP**: https://github.com/mlfoundations/open_clip

---

## ✅ Checklist

Integration完成的标志：
- [x] Package structure refactored (app → ai_app, backend_app)
- [x] pyproject.toml created for both services
- [x] torch + open_clip installed (~500MB)
- [x] DermatologyAnalyzer status: **ACTIVE**
- [x] Enhanced rules engine (250+ lines, 7 priority levels)
- [x] Vietnamese disease mapping (30+ diseases)
- [x] All tests passing (8/8)
- [x] Full stack integration working
- [x] Documentation updated

---

**Last Updated**: October 21, 2025

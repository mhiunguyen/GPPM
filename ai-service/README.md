# DermaSafe-AI Service — Dermatology Analysis

Service này sử dụng **DermLIP AI model** thông qua `dermatology_module` để phân tích ảnh da liễu và trả về chẩn đoán chi tiết.

## ✨ Tính năng

- 🔍 Phân tích ảnh da liễu bằng DermLIP (state-of-the-art)
- 🇻🇳 Hỗ trợ tiếng Việt đầy đủ
- 📊 Chẩn đoán chính + chẩn đoán thay thế (top-k)
- 💡 Khuyến nghị hành động cụ thể theo từng bệnh
- 🎯 Đánh giá mức độ nghiêm trọng
- 🧩 Ảnh hưởng bởi triệu chứng người dùng (symptom-aware scoring)
- 🔎 Giải thích vì sao (explanations: điểm từ ảnh, điều chỉnh theo triệu chứng, quyết định cuối)

## 🏗️ Kiến trúc

```
Client → Backend API → AI Service → DermatologyAnalyzer → DermLIP Model
```

### Components

- **FastAPI**: Web framework
- **dermatology_module**: Module phân tích ảnh da liễu
- **DermLIP**: CLIP-based model for dermatology (ViT-B/16)

## 🚀 Cài đặt

### Development (Local)

```bash
# 1. Cài đặt dependencies
pip install -r requirements.txt

# 2. Chạy service
uvicorn app.main:app --reload --port 8001

# 3. Truy cập API docs
open http://localhost:8001/docs
```

### Production (Docker)

```bash
# Build và chạy
docker-compose up -d --build ai-service

# Xem logs
docker-compose logs -f ai-service

# Kiểm tra health
curl http://localhost:8001/health
```

## 📡 API Endpoints

### GET /health

Kiểm tra trạng thái service

**Response:**
```json
{
  "status": "ok",
  "dermatology_analyzer": "active"
}
```

### POST /analyze

Phân tích ảnh da liễu

**Request:** multipart/form-data
- `image`: File ảnh (bắt buộc)
- `symptoms_selected`: CSV triệu chứng (tùy chọn), ví dụ: `"ngứa, thay đổi"`
- `symptoms_json`: JSON có cấu trúc (tùy chọn), ví dụ: `{"symptoms_selected":["ngứa","thay đổi"],"duration":"1-2 tuần"}`
- `duration`: Thời gian triệu chứng (tùy chọn) — để tương thích cũ

**Response:** (rút gọn)
```json
{
  "risk": "TRUNG BÌNH 🟡",
  "reason": "Có triệu chứng ngứa nhưng hình ảnh chưa rõ ràng...",
  "cv_scores": {           
    "impetigo": 0.1864,
    "eczema": 0.1289,
    "melanoma": 0.0896,
    "...": 0.0
  },
  "primary_disease": {
    "name": "impetigo",
    "vietnamese_name": "Chốc lở",
    "confidence": 0.1864,
    "severity": "nhẹ",
    "description": "Nhiễm khuẩn nông dễ lây...",
    "recommendations": ["Giữ vệ sinh...", "Kháng sinh bôi/uống (theo bác sĩ)"]
  },
  "alternative_diseases": [...],
  "clinical_concepts": [],
  "description": "Dựa trên phân tích ảnh...",
  "overall_severity": "nhẹ",
  "recommendations": ["..."],
  "explanations": {
    "image_evidence": {"impetigo": 0.1864, "eczema": 0.1031, "...": 0.0},
    "symptom_evidence": {"selected": ["ngứa", "thay đổi"], "duration": "1-2 tuần"},
    "adjustments": [
      {"symptom": "ngứa", "disease": "eczema", "factor": 1.25, "before": 0.1031, "after": 0.1289},
      {"symptom": "thay đổi", "disease": "melanoma", "factor": 1.25, "before": 0.0717, "after": 0.0896}
    ],
    "final_decision": {"risk": "TRUNG BÌNH 🟡", "reason": "..."}
  }
}
```

## 🧠 Models & Danh sách bệnh hỗ trợ

### DermLIP ViT-B/16 (Default)
- Model: `hf-hub:redlessone/DermLIP_ViT-B-16`
- Size: ~340MB
- Speed: Fast (~5-10s CPU, ~1-2s GPU)
- Accuracy: Good

### DermLIP PanDerm (Alternative)
- Model: `hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256`
- Size: ~1GB
- Speed: Slower
- Accuracy: Better

Để chuyển model, cập nhật `ai_app/main.py`:
```python
DERMATOLOGY_ANALYZER = DermatologyAnalyzer(
    model_name="hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256"
)
```

### Danh sách bệnh nhận diện (mặc định)

Mặc định AI sử dụng bộ mở rộng (EXTENDED_DISEASES) gồm 23 bệnh sau:

- Ung thư/tiền ung thư: melanoma, basal cell carcinoma, squamous cell carcinoma, actinic keratosis
- Lành tính/khối u nhỏ: seborrheic keratosis, nevus, wart, dermatofibroma, lipoma, cherry angioma, skin tag, milia
- Viêm/nhiễm/miễn dịch: eczema, psoriasis, dermatitis, acne, rosacea, urticaria, tinea, vitiligo, impetigo, cellulitis, folliculitis

Bạn có thể truyền danh sách tùy chỉnh khi khởi tạo `DermatologyAnalyzer(disease_list=[...])`.

## 🔧 Configuration

### Environment Variables

Tạo file `.env`:
```env
# Model settings (optional)
MODEL_DEVICE=auto  # auto, cuda, cpu

# API settings
PORT=8001
```

### Device Selection

Analyzer tự động chọn device:
- CUDA (GPU) nếu có
- CPU nếu không có GPU

Để force CPU:
```python
analyzer = DermatologyAnalyzer(device="cpu")
```

## 📊 Performance

| Setup | Time per image | Memory |
|-------|---------------|---------|
| CPU (Intel i7) | ~5-10s | ~2GB |
| GPU (T4) | ~1-2s | ~2GB + 2GB VRAM |

## 🐛 Troubleshooting

### Lỗi: Module not found

```bash
pip install torch open_clip_torch pillow
```

### Lỗi: CUDA out of memory

Chuyển sang CPU:
```python
analyzer = DermatologyAnalyzer(device="cpu")
```

### Model download chậm

Model sẽ được cache sau lần đầu:
- Cache location: `~/.cache/huggingface/`
- Size: ~340MB

### Service không khởi động

Kiểm tra logs:
```bash
docker-compose logs ai-service
```

## 📚 Tài liệu

- [DERMATOLOGY_INTEGRATION.md](../docs/DERMATOLOGY_INTEGRATION.md) - Chi tiết tích hợp
- [dermatology_module/README.md](../dermatology_module/README.md) - Module documentation
- [DermLIP Paper](https://arxiv.org/abs/2503.14911) - Research paper

## 🧪 Testing

```bash
# Unit tests
pytest tests/

# Integration test
python ../test_dermatology_integration.py

# API test
curl -X POST http://localhost:8001/analyze \
  -F "image=@test_image.jpg"
```

## 📝 License

- Code: MIT License
- DermLIP Model: CC BY-NC 4.0 (Non-commercial use only)

## 🙏 Credits

- **DermLIP**: Siyuan Yan et al., 2025
- **OpenCLIP**: LAION, OpenAI
- **PAD Dataset**: 6-class dermatology classification
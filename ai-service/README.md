# DermaSafe-AI Service — Dermatology Analysis

Service này sử dụng **DermLIP AI model** thông qua `dermatology_module` để phân tích ảnh da liễu và trả về chẩn đoán chi tiết.

## ✨ Tính năng

- 🔍 Phân tích ảnh da liễu bằng DermLIP (state-of-the-art)
- 🇻🇳 Hỗ trợ tiếng Việt đầy đủ
- 📊 Cung cấp chẩn đoán chính + các chẩn đoán thay thế
- 💡 Khuyến nghị hành động cụ thể
- 🎯 Đánh giá mức độ nghiêm trọng

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

**Request:**
- `image`: File ảnh (multipart/form-data)
- `symptoms_selected`: CSV triệu chứng (optional)
- `symptoms_json`: JSON structured symptoms (optional)
- `duration`: Thời gian triệu chứng (optional)

**Response:**
```json
{
  "risk": "cao",
  "reason": "Phát hiện tổn thương có khả năng là ung thư da",
  "cv_scores": {
    "melanoma": 0.72,
    "nevus": 0.15
  },
  "primary_disease": {
    "name": "melanoma",
    "vietnamese_name": "Ung thư hắc tố",
    "confidence": 0.72,
    "severity": "rất nghiêm trọng",
    "description": "Ung thư da nghiêm trọng nhất...",
    "recommendations": ["⚠️ ĐI KHÁM NGAY LẬP TỨC"]
  },
  "alternative_diseases": [...],
  "clinical_concepts": ["ung thư", "cần sinh thiết"],
  "description": "Dựa trên phân tích ảnh...",
  "overall_severity": "rất nghiêm trọng",
  "recommendations": [...]
}
```

## 🧠 Models

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

Để chuyển model, cập nhật `app/main.py`:
```python
DERMATOLOGY_ANALYZER = DermatologyAnalyzer(
    model_name="hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256"
)
```

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
# Hướng dẫn tích hợp Dermatology Module

## Tổng quan

Module `dermatology_module` đã được tích hợp vào dự án GPPM để phân tích ảnh da liễu bằng AI model DermLIP. Module này nhận vào ảnh và trả về văn bản mô tả chi tiết về tình trạng da.

## Các thay đổi đã thực hiện

### 1. Cập nhật Dependencies

**File: `ai-service/requirements.txt`**
- Thêm `torch>=2.0.0` - Framework deep learning
- Thêm `open_clip_torch>=2.20.0` - CLIP model implementation

### 2. Cập nhật Schemas

**File: `ai-service/app/schemas.py` và `backend-api/app/schemas.py`**

Đã mở rộng `AnalyzeResult` để chứa thông tin chi tiết:
```python
class DiseaseInfo(BaseModel):
    name: str                    # Tên bệnh (tiếng Anh)
    vietnamese_name: str         # Tên bệnh (tiếng Việt)
    confidence: float            # Độ tin cậy (0-1)
    severity: str                # Mức độ nghiêm trọng
    description: str             # Mô tả bệnh
    recommendations: List[str]   # Khuyến nghị

class AnalyzeResult(BaseModel):
    risk: str                                    # Mức độ rủi ro (legacy)
    reason: str                                  # Lý do đánh giá (legacy)
    cv_scores: Optional[Dict[str, float]]        # Điểm số CV (legacy)
    
    # Thông tin mới từ dermatology_module
    primary_disease: Optional[DiseaseInfo]       # Chẩn đoán chính
    alternative_diseases: Optional[List[DiseaseInfo]]  # Chẩn đoán thay thế
    clinical_concepts: Optional[List[str]]       # Khái niệm lâm sàng
    description: Optional[str]                   # Mô tả tổng quan
    overall_severity: Optional[str]              # Mức độ nghiêm trọng
    recommendations: Optional[List[str]]         # Khuyến nghị hành động
```

### 3. Tích hợp vào AI Service

**File: `ai-service/app/main.py`**

- Import và khởi tạo `DermatologyAnalyzer` khi service khởi động
- Sử dụng analyzer để phân tích ảnh thay vì model cũ
- Chuyển đổi kết quả từ `DermAnalysisResult` sang `AnalyzeResult`
- Giữ backward compatibility với API cũ

Luồng xử lý:
1. Nhận ảnh từ client
2. Chuyển ảnh sang PIL Image
3. Gọi `analyzer.analyze(image)` để phân tích
4. Map kết quả sang schema API
5. Trả về response với đầy đủ thông tin

### 4. Cập nhật Docker

**File: `docker-compose.yml`**
```yaml
ai-service:
  build: 
    context: .                          # Build từ root để access dermatology_module
    dockerfile: ./ai-service/Dockerfile
```

**File: `ai-service/Dockerfile`**
- Copy `dermatology_module` vào container
- Cập nhật paths cho build context từ project root

## Cấu trúc Dermatology Module

```
dermatology_module/
├── __init__.py              # Package init
├── analyzer.py              # DermatologyAnalyzer - class chính
├── models.py                # Data models (AnalysisResult, DiseaseInfo, Severity)
├── disease_database.py      # Database thông tin bệnh (tiếng Việt)
├── config.py                # Configuration
├── cli.py                   # Command-line interface
└── README.md                # Documentation
```

## API Response Example

```json
{
  "risk": "cao",
  "reason": "Phát hiện tổn thương có khả năng là ung thư da",
  "cv_scores": {
    "melanoma": 0.72,
    "nevus": 0.15,
    "basal cell carcinoma": 0.08
  },
  "primary_disease": {
    "name": "melanoma",
    "vietnamese_name": "Ung thư hắc tố",
    "confidence": 0.72,
    "severity": "rất nghiêm trọng",
    "description": "Ung thư da nghiêm trọng nhất...",
    "recommendations": [
      "⚠️ ĐI KHÁM NGAY LẬP TỨC với bác sĩ da liễu",
      "Không tự điều trị",
      "..."
    ]
  },
  "alternative_diseases": [
    {
      "name": "nevus",
      "vietnamese_name": "Nốt ruồi",
      "confidence": 0.15,
      "severity": "lành tính"
    }
  ],
  "clinical_concepts": ["ung thư", "cần sinh thiết", "theo dõi"],
  "description": "Dựa trên phân tích ảnh, tổn thương này có khả năng rất cao (72.0%) là Ung thư hắc tố...",
  "overall_severity": "rất nghiêm trọng",
  "recommendations": [
    "Kết quả này chỉ mang tính tham khảo",
    "Luôn tham khảo ý kiến bác sĩ da liễu chuyên nghiệp"
  ]
}
```

## Cài đặt và chạy

### Development (Local)

```bash
# 1. Cài đặt dependencies
cd ai-service
pip install -r requirements.txt

# 2. Test module
cd ..
python test_dermatology_integration.py

# 3. Chạy AI service
cd ai-service
uvicorn app.main:app --reload --port 8001
```

### Production (Docker)

```bash
# 1. Build tất cả services
docker-compose build

# 2. Khởi động services
docker-compose up

# 3. Kiểm tra health
curl http://localhost:8001/health
```

### Test API

```bash
# Upload ảnh để phân tích
curl -X POST http://localhost:8001/analyze \
  -F "image=@path/to/skin_image.jpg" \
  -F "symptoms_selected=ngứa,đỏ" \
  -F "duration=1-2 tuần"
```

## Lưu ý quan trọng

### 1. GPU Support (Optional)

Module tự động phát hiện và sử dụng GPU nếu có:
- CPU: Phân tích ~5-10 giây/ảnh
- GPU: Phân tích ~1-2 giây/ảnh

Để sử dụng GPU trong Docker:
```yaml
ai-service:
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

### 2. Model Loading

Model DermLIP (~340MB) sẽ được tải tự động lần đầu chạy:
- Lưu cache tại: `~/.cache/huggingface/`
- Cần internet connection lần đầu
- Các lần sau sử dụng cache offline

### 3. Memory Requirements

- Minimum: 2GB RAM
- Recommended: 4GB RAM (để chạy ổn định)
- Với GPU: Cần ~2GB VRAM

### 4. Backward Compatibility

API vẫn giữ nguyên structure cũ (`risk`, `reason`, `cv_scores`), chỉ thêm fields mới:
- Frontend cũ vẫn hoạt động bình thường
- Frontend mới có thể hiển thị thông tin chi tiết hơn

## Troubleshooting

### Lỗi: "No module named 'open_clip'"

```bash
pip install open_clip_torch torch
```

### Lỗi: "CUDA out of memory"

Giảm batch size hoặc chạy trên CPU:
```python
analyzer = DermatologyAnalyzer(device="cpu")
```

### Service không khởi động

Kiểm tra logs:
```bash
docker-compose logs ai-service
```

## Tài liệu thêm

- **Dermatology Module README**: `dermatology_module/README.md`
- **API Documentation**: Truy cập http://localhost:8001/docs khi service chạy
- **Model Paper**: https://arxiv.org/abs/2503.14911

## License

Module sử dụng DermLIP model với license CC BY-NC 4.0 (phi thương mại).

## TODO

- [ ] Thêm unit tests cho integration
- [ ] Optimize model loading time
- [ ] Cache results cho ảnh trùng lặp
- [ ] Add metrics và monitoring
- [ ] Tích hợp với frontend để hiển thị kết quả chi tiết

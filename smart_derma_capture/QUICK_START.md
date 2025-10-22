# 📸 HƯỚNG DẪN SỬ DỤNG NHANH - Smart Derma Capture

## 📦 Copy module vào dự án mới

### Bước 1: Copy folder

```bash
# Copy folder smart_derma_capture vào project của bạn
cp -r smart_derma_capture /path/to/your-project/

# Cấu trúc sau khi copy:
your-project/
├── smart_derma_capture/      ← Module này
│   ├── __init__.py
│   ├── analyzer.py
│   ├── smart_capture.py
│   ├── models.py
│   └── README.md
└── your_code.py
```

### Bước 2: Install dependencies

```bash
cd /path/to/your-project
pip install torch torchvision open-clip-torch Pillow opencv-python numpy
```

### Bước 3: Sử dụng

```python
# your_code.py
from smart_derma_capture import DermaAnalyzer, SmartCapture

# Phân tích ảnh
analyzer = DermaAnalyzer()
result = analyzer.analyze("skin.jpg")
print(result.primary_disease.vietnamese_name)

# Kiểm tra chất lượng
capture = SmartCapture()
quality = capture.check_quality("image.jpg")
print(f"Score: {quality['score']}/100")
```

---

## ✅ 3 Use Cases Phổ Biến

### 1️⃣ Phân tích ảnh đơn giản

```python
from smart_derma_capture import DermaAnalyzer

analyzer = DermaAnalyzer()
result = analyzer.analyze("melanoma.jpg")

print(f"Bệnh: {result.primary_disease.vietnamese_name}")
print(f"Độ tin cậy: {result.primary_disease.confidence:.1%}")
print(f"Mức độ: {result.overall_severity.value}")

# Hiển thị top 3 khả năng
for i, disease in enumerate(result.diseases[:3], 1):
    print(f"{i}. {disease.vietnamese_name} ({disease.confidence:.1%})")
```

### 2️⃣ Pipeline hoàn chỉnh (check + enhance + analyze)

```python
from smart_derma_capture import DermaAnalyzer, SmartCapture

# Bước 1: Smart capture
capture = SmartCapture()
enhanced, report = capture.process("raw_image.jpg", auto_crop=True)

# Kiểm tra chất lượng
if not report['final_acceptable']:
    print("❌ Ảnh chất lượng thấp. Vui lòng chụp lại!")
    for issue in report['quality_after']['issues']:
        print(f"  - {issue['suggestion']}")
    exit()

# Bước 2: Phân tích
analyzer = DermaAnalyzer()
result = analyzer.analyze(enhanced)

# Bước 3: Hiển thị kết quả
print(f"✅ Bệnh: {result.primary_disease.vietnamese_name}")
print(f"📊 Cải thiện chất lượng: +{report['improvement']} điểm")
```

### 3️⃣ Web API (Flask)

```python
from flask import Flask, request, jsonify
from smart_derma_capture import DermaAnalyzer, SmartCapture
import cv2
import numpy as np

app = Flask(__name__)

analyzer = DermaAnalyzer()
capture = SmartCapture()

@app.route('/analyze', methods=['POST'])
def analyze():
    # Nhận ảnh
    file = request.files['image']
    image_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
    
    # Xử lý
    enhanced, report = capture.process(image)
    
    if not report['final_acceptable']:
        return jsonify({
            'error': 'Low quality',
            'issues': report['quality_after']['issues']
        }), 400
    
    # Phân tích
    result = analyzer.analyze(enhanced)
    
    return jsonify({
        'disease': result.primary_disease.vietnamese_name,
        'confidence': result.primary_disease.confidence,
        'severity': result.overall_severity.value,
        'quality_score': report['quality_after']['score']
    })

if __name__ == '__main__':
    app.run(port=5000)
```

---

## 🔧 API Tóm Tắt

### DermaAnalyzer

```python
# Khởi tạo
analyzer = DermaAnalyzer(
    model_name="ViT-B/16",    # hoặc "PanDerm-base-w-PubMed-256"
    device="cpu"              # hoặc "cuda"
)

# Phân tích
result = analyzer.analyze("image.jpg", top_k=5)

# Tìm theo triệu chứng
diseases = analyzer.search_by_symptoms("đỏ, ngứa", top_k=5)
```

### SmartCapture

```python
# Khởi tạo
capture = SmartCapture(target_size=512)

# Kiểm tra nhanh (cho camera real-time)
realtime = capture.check_realtime(image)
print(realtime['ready_to_capture'])  # True/False

# Kiểm tra đầy đủ
quality = capture.check_quality(image)
print(quality['score'])  # 0-100

# Cải thiện ảnh
enhanced = capture.enhance(image, auto_crop=False)

# Pipeline hoàn chỉnh
enhanced, report = capture.process(image, auto_crop=True)
```

---

## 📊 Quality Scores

| Score | Grade | Meaning |
|-------|-------|---------|
| 90-100 | ⭐⭐⭐⭐⭐ | Xuất sắc - Phân tích ngay |
| 75-89  | ⭐⭐⭐⭐ | Tốt - Phù hợp phân tích |
| 60-74  | ⭐⭐⭐ | Chấp nhận được |
| 40-59  | ⭐⭐ | Thấp - Nên chụp lại |
| 0-39   | ⭐ | Rất kém - Chụp lại |

---

## 💡 Tips

### Tăng tốc độ
```python
# Dùng GPU
analyzer = DermaAnalyzer(device="cuda")

# Dùng model nhẹ hơn
analyzer = DermaAnalyzer(model_name="ViT-B/16")
```

### Camera real-time
```python
# Dùng check_realtime cho preview (nhanh ~20ms)
capture = SmartCapture()
realtime = capture.check_realtime(frame)

if realtime['ready_to_capture']:
    # Chụp ảnh
    enhanced, report = capture.process(frame)
```

### Batch processing
```python
# Xử lý nhiều ảnh
import glob

for img_path in glob.glob("images/*.jpg"):
    enhanced, report = capture.process(img_path)
    if report['final_acceptable']:
        result = analyzer.analyze(enhanced)
        print(f"{img_path}: {result.primary_disease.vietnamese_name}")
```

---

## 🐛 Xử lý lỗi phổ biến

### Lỗi 1: ModuleNotFoundError
```bash
pip install torch torchvision open-clip-torch opencv-python
```

### Lỗi 2: Ảnh bị reject
```python
# Giảm ngưỡng chất lượng
capture.checker.SHARPNESS_MIN = 30
capture.checker.BRIGHTNESS_MIN = 40
```

### Lỗi 3: Xử lý chậm
```python
# Dùng GPU
analyzer = DermaAnalyzer(device="cuda")

# Giảm target_size
capture = SmartCapture(target_size=256)
```

---

## 📞 Support

- Xem `README.md` cho docs đầy đủ
- Xem `example.py` cho 5 ví dụ chi tiết
- Run test: `python TEST_SMART_DERMA_CAPTURE.py`

---

**Smart Derma Capture** - Happy Coding! 🚀📸

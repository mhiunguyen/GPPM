# 🏥 Dermatology Module

Module Python để phân tích ảnh da liễu sử dụng DermLIP AI.

## Cài đặt

```bash
pip install -e .
```

## Sử dụng nhanh

```python
from dermatology_module import DermatologyAnalyzer

# Khởi tạo
analyzer = DermatologyAnalyzer()

# Phân tích
result = analyzer.analyze("image.jpg")

# Xem kết quả
print(result)
# hoặc
print(f"Bệnh: {result.primary_disease.vietnamese_name}")
print(f"Mức độ: {result.overall_severity.value}")
```

## Tài liệu

- **QUICKSTART.md** - Bắt đầu trong 5 phút
- **MODULE_README.md** - API documentation đầy đủ  
- **INTEGRATION_GUIDE.md** - Tích hợp vào dự án lớn
- **example_usage.py** - 9 ví dụ chi tiết

## API chính

```python
# Phân tích đầy đủ
result = analyzer.analyze("image.jpg")

# Chỉ phân loại (nhanh)
classifications = analyzer.classify("image.jpg")

# Nhiều ảnh
results = analyzer.batch_analyze(["img1.jpg", "img2.jpg"])

# Tìm kiếm văn bản
results = analyzer.search_by_text("dark irregular spot")

# Export JSON
result_dict = result.to_dict()
```

## Các mô hình

```python
# ViT-B/16 (mặc định, nhanh)
analyzer = DermatologyAnalyzer()

# PanDerm (chính xác hơn)
analyzer = DermatologyAnalyzer(
    model_name="hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256"
)
```

## License

CC BY-NC 4.0 - Chỉ sử dụng phi thương mại

## Citation

```bibtex
@misc{yan2025derm1m,
  title={Derm1M: A Million‑Scale Vision‑Language Dataset...},
  author={Siyuan Yan and Ming Hu and ...},
  year={2025},
  eprint={2503.14911}
}
```

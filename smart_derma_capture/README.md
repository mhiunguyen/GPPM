# � Smart Derma Capture

> Smart dermatology image capture with AI-powered analysis

## 🚀 Quick Start

### Installation

```bash
# Copy folder to your project
cp -r smart_derma_capture /path/to/your-project/

# Install dependencies
pip install torch torchvision open-clip-torch Pillow opencv-python
```

### Basic Usage

```python
from smart_derma_capture import DermaAnalyzer, SmartCapture

# 1. Analyze skin image
analyzer = DermaAnalyzer()
result = analyzer.analyze("skin.jpg")

print(f"Disease: {result.primary_disease.vietnamese_name}")
print(f"Confidence: {result.primary_disease.confidence:.1%}")
print(f"Severity: {result.overall_severity.value}")

# 2. Smart capture with quality check
capture = SmartCapture()
enhanced, report = capture.process("image.jpg")

print(f"Quality: {report['quality_after']['score']}/100")
print(f"Acceptable: {report['final_acceptable']}")
```

## 📦 Features

### ✅ Disease Analysis
- 10+ common skin diseases
- 5-level severity assessment
- Vietnamese support
- Symptom-based search

### ✅ Smart Capture
- Real-time quality check
- Auto image enhancement
- Capture guidelines
- Before/after comparison

## 🎯 Examples

### Example 1: Simple Analysis

```python
from smart_derma_capture import DermaAnalyzer

analyzer = DermaAnalyzer()
result = analyzer.analyze("melanoma.jpg")

for disease in result.diseases[:3]:  # Top 3
    print(f"{disease.vietnamese_name}: {disease.confidence:.1%}")
```

### Example 2: Quality Check

```python
from smart_derma_capture import SmartCapture

capture = SmartCapture()
quality = capture.check_quality("image.jpg")

if not quality['is_acceptable']:
    print("❌ Poor quality!")
    for issue in quality['issues']:
        print(f"  - {issue['message']}: {issue['suggestion']}")
else:
    print("✅ Good quality!")
```

### Example 3: Complete Pipeline

```python
from dermatology_ai import DermaAnalyzer, SmartCapture
import cv2

# Smart capture
capture = SmartCapture()
enhanced, report = capture.process("raw_image.jpg", auto_crop=True)

if report['final_acceptable']:
    # Analyze
    analyzer = DermaAnalyzer()
    result = analyzer.analyze(enhanced)
    
    # Results
    print(f"Disease: {result.primary_disease.vietnamese_name}")
    print(f"Quality improvement: +{report['improvement']} points")
    
    # Save enhanced
    cv2.imwrite("enhanced.jpg", enhanced)
else:
    print("Please retake photo")
```

## 🔧 API Reference

### DermaAnalyzer

```python
analyzer = DermaAnalyzer(
    model_name="ViT-B/16",  # or "PanDerm-base-w-PubMed-256"
    device="auto"           # "cuda", "cpu", or "auto"
)

# Analyze image
result = analyzer.analyze(image_path, top_k=5)

# Search by symptoms
diseases = analyzer.search_by_symptoms("đỏ, ngứa, vảy", top_k=5)
```

### SmartCapture

```python
capture = SmartCapture(target_size=512)

# Check quality (full)
quality = capture.check_quality(image)

# Check quality (fast, for camera)
realtime = capture.check_realtime(image)

# Enhance image
enhanced = capture.enhance(image, auto_crop=False)

# Complete pipeline
enhanced, report = capture.process(image, auto_crop=True)

# Get guidelines
guidelines = capture.get_guidelines()
tips = capture.get_quick_tips()
```

## 📊 Models

| Model | Accuracy | Speed |
|-------|----------|-------|
| ViT-B/16 | 56.1% | ⚡ Fast |
| PanDerm-base-w-PubMed-256 | 58.8% | 🐢 Slow |

## 🔗 Dependencies

```txt
torch>=2.0.0
torchvision>=0.15.0
open-clip-torch>=2.20.0
Pillow>=9.0.0
opencv-python>=4.5.0
numpy>=1.21.0
```

## 📁 Structure

```
smart_derma_capture/
├── __init__.py          # Package exports
├── analyzer.py          # Disease analysis
├── smart_capture.py     # Quality + Enhancement
├── models.py            # Data models
├── example.py           # Usage examples
└── README.md            # This file
```

## 💡 Tips

**For best results:**
- Use GPU: `DermaAnalyzer(device="cuda")`
- Check quality before analysis
- Auto-crop lesion area: `auto_crop=True`
- Use real-time check for camera: `check_realtime()`

**Quality thresholds:**
- Excellent: 90+
- Good: 75-89
- Acceptable: 60-74
- Poor: 40-59
- Very Poor: <40

## 🐛 Troubleshooting

**ImportError: No module named 'cv2'**
```bash
pip install opencv-python
```

**Low quality images rejected**
```python
# Lower thresholds
capture.checker.SHARPNESS_MIN = 30
capture.checker.BRIGHTNESS_MIN = 40
```

**Slow processing**
```python
# Use lighter model
analyzer = DermaAnalyzer(model_name="ViT-B/16")
```

## 📄 License

MIT License

---

---

**Smart Derma Capture** - Made with ❤️ by Derm1M Team

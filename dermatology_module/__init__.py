"""
Derm1M Dermatology Analysis Module
==================================

Module này cung cấp các chức năng phân tích ảnh da liễu sử dụng mô hình DermLIP.

Chức năng chính:
- Phân loại bệnh da liễu
- Đánh giá mức độ nghiêm trọng
- Trích xuất khái niệm lâm sàng
- Tìm kiếm văn bản mô tả phù hợp

Example:
    >>> from dermatology_module import DermatologyAnalyzer
    >>> analyzer = DermatologyAnalyzer()
    >>> result = analyzer.analyze("path/to/skin_image.jpg")
    >>> print(result.disease, result.severity)
"""

from .analyzer import DermatologyAnalyzer
from .models import AnalysisResult, DiseaseInfo

__version__ = "1.0.0"
__all__ = ["DermatologyAnalyzer", "AnalysisResult", "DiseaseInfo"]

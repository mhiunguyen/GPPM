<<<<<<< HEAD
"""
Data models cho kết quả phân tích
"""
from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum


class Severity(Enum):
    """Mức độ nghiêm trọng của bệnh"""
    BENIGN = "lành tính"           # Nốt ruồi, u lành tính
    MILD = "nhẹ"                   # Viêm nhẹ, dị ứng
    MODERATE = "trung bình"        # Cần theo dõi
    SEVERE = "nghiêm trọng"        # Ung thư, cần điều trị ngay
    CRITICAL = "rất nghiêm trọng"  # Cần can thiệp khẩn cấp


@dataclass
class DiseaseInfo:
    """Thông tin về một bệnh cụ thể"""
    name: str                          # Tên bệnh (tiếng Anh)
    vietnamese_name: str               # Tên bệnh (tiếng Việt)
    confidence: float                  # Độ tin cậy (0-1)
    severity: Severity                 # Mức độ nghiêm trọng
    description: str                   # Mô tả ngắn
    recommendations: List[str]         # Khuyến nghị


@dataclass
class AnalysisResult:
    """Kết quả phân tích ảnh da liễu"""
    # Chẩn đoán chính
    primary_disease: DiseaseInfo
    
    # Các chẩn đoán khác có thể
    alternative_diseases: List[DiseaseInfo]
    
    # Các khái niệm lâm sàng được phát hiện
    clinical_concepts: List[str]
    
    # Mô tả tổng quan
    description: str
    
    # Mức độ nghiêm trọng tổng thể
    overall_severity: Severity
    
    # Khuyến nghị hành động
    recommendations: List[str]
    
    # Thông tin bổ sung
    metadata: Optional[Dict] = None
    
    def to_dict(self) -> Dict:
        """Chuyển đổi kết quả thành dictionary"""
        return {
            "primary_disease": {
                "name": self.primary_disease.name,
                "vietnamese_name": self.primary_disease.vietnamese_name,
                "confidence": self.primary_disease.confidence,
                "severity": self.primary_disease.severity.value,
                "description": self.primary_disease.description,
                "recommendations": self.primary_disease.recommendations
            },
            "alternative_diseases": [
                {
                    "name": d.name,
                    "vietnamese_name": d.vietnamese_name,
                    "confidence": d.confidence,
                    "severity": d.severity.value
                }
                for d in self.alternative_diseases
            ],
            "clinical_concepts": self.clinical_concepts,
            "description": self.description,
            "overall_severity": self.overall_severity.value,
            "recommendations": self.recommendations,
            "metadata": self.metadata
        }
    
    def __str__(self) -> str:
        """Hiển thị kết quả dạng văn bản"""
        lines = [
            "=" * 60,
            "KẾT QUẢ PHÂN TÍCH ẢNH DA LIỄU",
            "=" * 60,
            f"\n🔍 CHẨN ĐOÁN CHÍNH: {self.primary_disease.vietnamese_name}",
            f"   - Tên khoa học: {self.primary_disease.name}",
            f"   - Độ tin cậy: {self.primary_disease.confidence:.1%}",
            f"   - Mức độ: {self.primary_disease.severity.value}",
            f"\n📝 MÔ TẢ:\n   {self.primary_disease.description}",
        ]
        
        if self.alternative_diseases:
            lines.append("\n🔄 CÁC CHẨN ĐOÁN KHÁC CÓ THỂ:")
            for i, disease in enumerate(self.alternative_diseases[:3], 1):
                lines.append(f"   {i}. {disease.vietnamese_name} ({disease.confidence:.1%})")
        
        if self.clinical_concepts:
            lines.append(f"\n🏥 KHÁI NIỆM LÂM SÀNG: {', '.join(self.clinical_concepts)}")
        
        lines.append(f"\n⚠️  MỨC ĐỘ NGHIÊM TRỌNG: {self.overall_severity.value.upper()}")
        
        if self.recommendations:
            lines.append("\n💡 KHUYẾN NGHỊ:")
            for rec in self.recommendations:
                lines.append(f"   • {rec}")
        
        lines.append("\n" + "=" * 60)
        return "\n".join(lines)
=======
"""
Data models cho kết quả phân tích
"""
from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum


class Severity(Enum):
    """Mức độ nghiêm trọng của bệnh"""
    BENIGN = "lành tính"           # Nốt ruồi, u lành tính
    MILD = "nhẹ"                   # Viêm nhẹ, dị ứng
    MODERATE = "trung bình"        # Cần theo dõi
    SEVERE = "nghiêm trọng"        # Ung thư, cần điều trị ngay
    CRITICAL = "rất nghiêm trọng"  # Cần can thiệp khẩn cấp


@dataclass
class DiseaseInfo:
    """Thông tin về một bệnh cụ thể"""
    name: str                          # Tên bệnh (tiếng Anh)
    vietnamese_name: str               # Tên bệnh (tiếng Việt)
    confidence: float                  # Độ tin cậy (0-1)
    severity: Severity                 # Mức độ nghiêm trọng
    description: str                   # Mô tả ngắn
    recommendations: List[str]         # Khuyến nghị


@dataclass
class AnalysisResult:
    """Kết quả phân tích ảnh da liễu"""
    # Chẩn đoán chính
    primary_disease: DiseaseInfo
    
    # Các chẩn đoán khác có thể
    alternative_diseases: List[DiseaseInfo]
    
    # Các khái niệm lâm sàng được phát hiện
    clinical_concepts: List[str]
    
    # Mô tả tổng quan
    description: str
    
    # Mức độ nghiêm trọng tổng thể
    overall_severity: Severity
    
    # Khuyến nghị hành động
    recommendations: List[str]
    
    # Thông tin bổ sung
    metadata: Optional[Dict] = None
    
    def to_dict(self) -> Dict:
        """Chuyển đổi kết quả thành dictionary"""
        return {
            "primary_disease": {
                "name": self.primary_disease.name,
                "vietnamese_name": self.primary_disease.vietnamese_name,
                "confidence": self.primary_disease.confidence,
                "severity": self.primary_disease.severity.value,
                "description": self.primary_disease.description,
                "recommendations": self.primary_disease.recommendations
            },
            "alternative_diseases": [
                {
                    "name": d.name,
                    "vietnamese_name": d.vietnamese_name,
                    "confidence": d.confidence,
                    "severity": d.severity.value
                }
                for d in self.alternative_diseases
            ],
            "clinical_concepts": self.clinical_concepts,
            "description": self.description,
            "overall_severity": self.overall_severity.value,
            "recommendations": self.recommendations,
            "metadata": self.metadata
        }
    
    def __str__(self) -> str:
        """Hiển thị kết quả dạng văn bản"""
        lines = [
            "=" * 60,
            "KẾT QUẢ PHÂN TÍCH ẢNH DA LIỄU",
            "=" * 60,
            f"\n🔍 CHẨN ĐOÁN CHÍNH: {self.primary_disease.vietnamese_name}",
            f"   - Tên khoa học: {self.primary_disease.name}",
            f"   - Độ tin cậy: {self.primary_disease.confidence:.1%}",
            f"   - Mức độ: {self.primary_disease.severity.value}",
            f"\n📝 MÔ TẢ:\n   {self.primary_disease.description}",
        ]
        
        if self.alternative_diseases:
            lines.append("\n🔄 CÁC CHẨN ĐOÁN KHÁC CÓ THỂ:")
            for i, disease in enumerate(self.alternative_diseases[:3], 1):
                lines.append(f"   {i}. {disease.vietnamese_name} ({disease.confidence:.1%})")
        
        if self.clinical_concepts:
            lines.append(f"\n🏥 KHÁI NIỆM LÂM SÀNG: {', '.join(self.clinical_concepts)}")
        
        lines.append(f"\n⚠️  MỨC ĐỘ NGHIÊM TRỌNG: {self.overall_severity.value.upper()}")
        
        if self.recommendations:
            lines.append("\n💡 KHUYẾN NGHỊ:")
            for rec in self.recommendations:
                lines.append(f"   • {rec}")
        
        lines.append("\n" + "=" * 60)
        return "\n".join(lines)
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4

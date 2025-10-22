from typing import Optional, Dict, List
from pydantic import BaseModel, Field


class DiseaseInfo(BaseModel):
    """Thông tin về bệnh được chẩn đoán"""
    name: str = Field(description="Tên bệnh (tiếng Anh)")
    vietnamese_name: str = Field(description="Tên bệnh (tiếng Việt)")
    confidence: float = Field(description="Độ tin cậy (0-1)")
    severity: str = Field(description="Mức độ nghiêm trọng")
    description: str = Field(description="Mô tả bệnh")
    recommendations: List[str] = Field(description="Khuyến nghị")


class AnalyzeResult(BaseModel):
    """Kết quả phân tích ảnh da liễu"""
    risk: str = Field(description="Mức độ rủi ro tổng thể")
    reason: str = Field(description="Lý do đánh giá")
    cv_scores: Optional[Dict[str, float]] = Field(default=None, description="Điểm số từ mô hình CV (legacy)")
    
    # Thông tin chi tiết từ dermatology_module
    primary_disease: Optional[DiseaseInfo] = Field(default=None, description="Chẩn đoán chính")
    alternative_diseases: Optional[List[DiseaseInfo]] = Field(default=None, description="Các chẩn đoán khác có thể")
    clinical_concepts: Optional[List[str]] = Field(default=None, description="Khái niệm lâm sàng")
    description: Optional[str] = Field(default=None, description="Mô tả tổng quan")
    overall_severity: Optional[str] = Field(default=None, description="Mức độ nghiêm trọng tổng thể")
    recommendations: Optional[List[str]] = Field(default=None, description="Khuyến nghị hành động")


class SymptomValidationRequest(BaseModel):
    """Request để validate triệu chứng từ mô tả tự do"""
    description: str = Field(description="Mô tả triệu chứng do người dùng nhập")
    language: str = Field(default="vi", description="Ngôn ngữ (vi/en)")


class SymptomValidationResult(BaseModel):
    """Kết quả validate và extract triệu chứng"""
    valid: bool = Field(description="Mô tả có phải là triệu chứng hợp lệ không")
    symptoms: List[str] = Field(default_factory=list, description="Danh sách triệu chứng được trích xuất")
    response: str = Field(description="Câu trả lời tư vấn nhẹ nhàng")


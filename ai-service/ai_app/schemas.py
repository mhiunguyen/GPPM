from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional, Dict, Any


Duration = Literal["Dưới 1 tuần", "1-4 tuần", "1-3 tháng", "Trên 3 tháng", "Từ khi sinh ra"]


class Symptoms(BaseModel):
    symptoms_selected: List[str] = Field(default_factory=list, description="Danh sách triệu chứng đã chọn")
    duration: Optional[Duration] = Field(default=None, description="Thời gian diễn ra triệu chứng")

    @field_validator("duration", mode="before")
    @classmethod
    def _normalize_duration(cls, v: Optional[str]) -> Optional[str]:
        """Chấp nhận cả chữ thường và các giá trị legacy, chuẩn hóa về dạng chuẩn để khớp Literal.

        - Hỗ trợ: "dưới 1 tuần", "1-4 tuần", "1-3 tháng", "trên 3 tháng", "từ khi sinh ra"
        - Tương thích ngược: "< 1 tuần" -> "Dưới 1 tuần"; "1-2 tuần" -> "1-4 tuần"; "> 2 tuần" -> "1-3 tháng"
        """
        if v is None:
            return v
        s = str(v).strip()
        s_low = s.lower()

        mapping = {
            # canonical (lowercase) -> Canonical form
            "dưới 1 tuần": "Dưới 1 tuần",
            "1-4 tuần": "1-4 tuần",
            "1-3 tháng": "1-3 tháng",
            "trên 3 tháng": "Trên 3 tháng",
            "từ khi sinh ra": "Từ khi sinh ra",
            # legacy -> Canonical form
            "< 1 tuần": "Dưới 1 tuần",
            "1-2 tuần": "1-4 tuần",
            "> 2 tuần": "1-3 tháng",
        }

        # Ưu tiên khớp trực tiếp, sau đó khớp theo lowercase
        if s in mapping:
            return mapping[s]
        return mapping.get(s_low, s)


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
    # Trạng thái nhận diện tổng quát
    detection_status: Optional[Literal["detected", "normal", "undetectable"]] = Field(
        default=None,
        description="Trạng thái nhận diện: detected=phát hiện tổn thương, normal=da bình thường, undetectable=không nhận diện được"
    )
    detection_message: Optional[str] = Field(default=None, description="Thông điệp giải thích cho trạng thái nhận diện")
    
    # Thông tin chi tiết từ dermatology_module
    primary_disease: Optional[DiseaseInfo] = Field(default=None, description="Chẩn đoán chính")
    alternative_diseases: Optional[List[DiseaseInfo]] = Field(default=None, description="Các chẩn đoán khác có thể")
    clinical_concepts: Optional[List[str]] = Field(default=None, description="Khái niệm lâm sàng")
    description: Optional[str] = Field(default=None, description="Mô tả tổng quan")
    overall_severity: Optional[str] = Field(default=None, description="Mức độ nghiêm trọng tổng thể")
    recommendations: Optional[List[str]] = Field(default=None, description="Khuyến nghị hành động")

    # Giải thích (tùy chọn): cách mô hình quyết định
    explanations: Optional[Dict[str, Any]] = Field(default=None, description="Giải thích kèm bằng chứng hình ảnh/triệu chứng")

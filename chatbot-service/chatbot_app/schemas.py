from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class AnalysisContext(BaseModel):
    """Context từ AI Service - kết quả phân tích ảnh da"""
    risk: str
    reason: str
    cv_scores: Optional[Dict[str, float]] = None
    primary_disease: Optional[Dict[str, Any]] = None
    alternative_diseases: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[List[str]] = None
    clinical_concepts: Optional[List[str]] = None
    description: Optional[str] = None
    overall_severity: Optional[str] = None


class ChatMessage(BaseModel):
    """Single chat message"""
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ChatRequest(BaseModel):
    """Request để chat với AI"""
    session_id: str
    message: str
    analysis_context: Optional[AnalysisContext] = None


class ChatResponse(BaseModel):
    """Response từ chatbot"""
    session_id: str
    message: str
    suggestions: Optional[List[str]] = []  # Gợi ý câu hỏi tiếp theo
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    llm_provider: str
    version: str

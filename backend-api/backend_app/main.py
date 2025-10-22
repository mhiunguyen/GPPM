from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import httpx
import os
import json

from .database import get_db
from .models import AnalysisRecord
from .schemas import AnalyzeResult, SymptomValidationRequest, SymptomValidationResult

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*")

app = FastAPI(title="DermaSafe-Backend API", version="0.2.0")

# Enable CORS for local development and flexible deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOW_ORIGINS.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"]) 
async def health():
    return {"status": "ok"}


@app.post("/api/v1/analyze", response_model=AnalyzeResult, tags=["analyze"]) 
async def analyze(
    image: UploadFile = File(...),
    symptoms_selected: str | None = Form(None),
    duration: str | None = Form(None),
    symptoms_json: str | None = Form(None),
    db: Session = Depends(get_db),
):
    # Proxy the request to AI service
    async with httpx.AsyncClient(base_url=AI_SERVICE_URL, timeout=30.0) as client:
        files = {"image": (image.filename, await image.read(), image.content_type or "application/octet-stream")}
        data = {}
        if symptoms_json is not None:
            data["symptoms_json"] = symptoms_json
        if symptoms_selected is not None:
            data["symptoms_selected"] = symptoms_selected
        if duration is not None:
            data["duration"] = duration
        r = await client.post("/analyze", files=files, data=data)
        r.raise_for_status()
        result = r.json()
    
    # Log analysis result (anonymized)
    try:
        symptoms_parsed = None
        if symptoms_json:
            symptoms_parsed = json.loads(symptoms_json)
        elif symptoms_selected or duration:
            symptoms_parsed = {
                "symptoms_selected": symptoms_selected.split(",") if symptoms_selected else [],
                "duration": duration
            }
        record = AnalysisRecord(
            risk=result.get("risk"),
            reason=result.get("reason"),
            cv_scores=result.get("cv_scores"),
            symptoms_json=symptoms_parsed,
        )
        db.add(record)
        db.commit()
    except Exception as e:
        # Log error but don't fail the response
        print(f"Failed to log analysis: {e}")
    
    return JSONResponse(result)


@app.post("/api/v1/validate-symptoms", response_model=SymptomValidationResult, tags=["symptoms"])
async def validate_symptoms(request: SymptomValidationRequest):
    """
    Validate và extract triệu chứng từ mô tả tự do của người dùng
    
    Args:
        request: Mô tả triệu chứng và ngôn ngữ
    
    Returns:
        {
            "valid": bool - Mô tả có hợp lệ không,
            "symptoms": List[str] - Danh sách triệu chứng được trích xuất,
            "response": str - Câu tư vấn nhẹ nhàng
        }
    """
    # Proxy request đến AI service
    async with httpx.AsyncClient(base_url=AI_SERVICE_URL, timeout=10.0) as client:
        r = await client.post("/validate-symptoms", json=request.dict())
        r.raise_for_status()
        result = r.json()
    
    return JSONResponse(result)

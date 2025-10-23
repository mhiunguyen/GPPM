from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import httpx
import os
import json
import logging

from .database import get_db
from .models import AnalysisRecord
from .schemas import AnalyzeResult

# Setup logging
logger = logging.getLogger(__name__)

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
CHATBOT_SERVICE_URL = os.getenv("CHATBOT_SERVICE_URL", "http://localhost:8002")
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
    enhance: bool = Form(False),  # Enable smart capture enhancement
    db: Session = Depends(get_db),
):
    # Proxy the request to AI service
    # Proxy the request to AI service with robust error handling
    try:
        async with httpx.AsyncClient(base_url=AI_SERVICE_URL, timeout=30.0) as client:
            files = {"image": (image.filename, await image.read(), image.content_type or "application/octet-stream")}
            data = {"enhance": str(enhance).lower()}
            if symptoms_json is not None:
                data["symptoms_json"] = symptoms_json
            if symptoms_selected is not None:
                data["symptoms_selected"] = symptoms_selected
            if duration is not None:
                data["duration"] = duration
            r = await client.post("/analyze", files=files, data=data)
            r.raise_for_status()
            result = r.json()
    except httpx.HTTPStatusError as e:
        # Upstream returned 4xx/5xx - forward relevant information
        try:
            detail = e.response.json()
        except Exception:
            detail = e.response.text
        logger.error(f"AI service returned HTTP error {e.response.status_code}: {detail}")
        # If upstream 5xx, return 502 Bad Gateway; else return upstream status
        status_code = 502 if 500 <= e.response.status_code < 600 else e.response.status_code
        raise HTTPException(status_code=status_code, detail={"ai_service_error": detail})
    except httpx.RequestError as e:
        logger.error(f"Error connecting to AI service: {e}")
        raise HTTPException(status_code=502, detail="Failed to connect to AI service")
    except Exception as e:
        logger.exception("Unexpected error while calling AI service")
        raise HTTPException(status_code=500, detail=str(e))
    
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


@app.post("/api/v1/capture/check-quality", tags=["capture"])
async def check_quality(image: UploadFile = File(...)):
    """Proxy quality check to AI service"""
    async with httpx.AsyncClient(base_url=AI_SERVICE_URL, timeout=10.0) as client:
        files = {"image": (image.filename, await image.read(), image.content_type or "application/octet-stream")}
        r = await client.post("/capture/check-quality", files=files)
        r.raise_for_status()
        return r.json()


@app.get("/api/v1/capture/tips", tags=["capture"])
async def get_tips():
    """Proxy capture tips to AI service"""
    async with httpx.AsyncClient(base_url=AI_SERVICE_URL, timeout=5.0) as client:
        r = await client.get("/capture/tips")
        r.raise_for_status()
        return r.json()


@app.post("/api/v1/chat")
async def chat(request: dict):
    """
    Proxy endpoint for chatbot service
    
    Expected request body:
    {
        "session_id": str,
        "message": str,
        "analysis_context": Optional[dict]
    }
    """
    logger.info(f"💬 Forwarding chat request to chatbot service")
    
    # Validate required fields
    if "session_id" not in request:
        raise HTTPException(status_code=400, detail="session_id is required")
    if "message" not in request:
        raise HTTPException(status_code=400, detail="message is required")
    
    # Build chatbot request payload
    chatbot_request = {
        "session_id": request["session_id"],
        "message": request["message"],
    }
    
    # Add analysis_context if provided
    if "analysis_context" in request and request["analysis_context"]:
        chatbot_request["analysis_context"] = request["analysis_context"]
    
    chatbot_url = CHATBOT_SERVICE_URL + "/chat"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            logger.info(f"Sending to chatbot: {chatbot_url}")
            r = await client.post(chatbot_url, json=chatbot_request)
            r.raise_for_status()
            return r.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Chatbot service returned error {e.response.status_code}: {e.response.text}")
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Chatbot service error: {e.response.text}"
            )
        except httpx.HTTPError as e:
            logger.error(f"Error calling chatbot service: {e}")
            raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/chat/history/{session_id}", tags=["chatbot"])
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    async with httpx.AsyncClient(base_url=CHATBOT_SERVICE_URL, timeout=10.0) as client:
        r = await client.get(f"/chat/history/{session_id}")
        r.raise_for_status()
        return r.json()


@app.delete("/api/v1/chat/history/{session_id}", tags=["chatbot"])
async def clear_chat_history(session_id: str):
    """Clear chat history for a session"""
    async with httpx.AsyncClient(base_url=CHATBOT_SERVICE_URL, timeout=10.0) as client:
        r = await client.delete(f"/chat/history/{session_id}")
        r.raise_for_status()
        return r.json()


@app.post("/api/v1/validate-symptoms", tags=["chatbot"])
async def validate_symptoms(request: dict):
    """
    Validate and extract symptoms from user's natural language description
    Uses Gemini AI to intelligently parse symptom descriptions
    
    Request body:
    {
        "description": "tôi bị ngứa và đỏ da",
        "language": "vi"
    }
    """
    # This could be handled by chatbot service or a dedicated endpoint
    # For now, we'll create a simple wrapper
    session_id = f"validation_{os.urandom(8).hex()}"
    
    prompt = ""
    if request.get("language") == "vi":
        prompt = f"""Phân tích mô tả triệu chứng sau và trích xuất các triệu chứng da liễu:

"{request.get('description')}"

Nếu đây là mô tả hợp lệ về triệu chứng da, trả về JSON:
{{"valid": true, "symptoms": ["triệu chứng 1", "triệu chứng 2"], "response": "Đã nhận diện được X triệu chứng"}}

Nếu không phải triệu chứng (ví dụ: spam, câu hỏi không liên quan), trả về JSON với phản hồi hài hước:
{{"valid": false, "symptoms": [], "response": "Hmm, có vẻ đây không phải mô tả triệu chứng da 🤔"}}"""
    else:
        prompt = f"""Analyze this symptom description and extract dermatology symptoms:

"{request.get('description')}"

If valid symptom description, return JSON:
{{"valid": true, "symptoms": ["symptom 1", "symptom 2"], "response": "Identified X symptoms"}}

If not symptoms (spam, unrelated), return JSON with funny response:
{{"valid": false, "symptoms": [], "response": "Hmm, this doesn't seem like a skin symptom 🤔"}}"""
    
    chat_request = {
        "session_id": session_id,
        "message": prompt,
        "analysis_context": None
    }
    
    async with httpx.AsyncClient(base_url=CHATBOT_SERVICE_URL, timeout=30.0) as client:
        r = await client.post("/chat", json=chat_request)
        r.raise_for_status()
        response_data = r.json()
        
        # Parse Gemini response as JSON
        try:
            import re
            message = response_data.get("message", "")
            # Extract JSON from markdown code blocks if present
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', message, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(1))
            else:
                # Try direct JSON parse
                result = json.loads(message)
            return result
        except:
            # Fallback if parsing fails
            return {
                "valid": True,
                "symptoms": [request.get("description")],
                "response": "✓ Đã thêm triệu chứng"
            }

"""
Smart Capture API endpoint for quality check and guidelines
"""
from fastapi import APIRouter, UploadFile, File
from typing import Dict
from .capture import capture_service

router = APIRouter(prefix="/capture", tags=["capture"])


@router.get("/guidelines")
async def get_guidelines() -> Dict:
    """Get capture guidelines and tips"""
    return capture_service.get_guidelines()


@router.get("/tips")
async def get_quick_tips() -> Dict:
    """Get quick capture tips"""
    return {"tips": capture_service.get_quick_tips()}


@router.post("/check-quality")
async def check_quality(image: UploadFile = File(...)) -> Dict:
    """
    Check image quality without enhancement
    
    Returns:
        {
          "is_acceptable": bool,
          "score": int (0-100),
          "issues": [...],
          "recommendation": str
        }
    """
    image_bytes = await image.read()
    return capture_service.check_quality(image_bytes)

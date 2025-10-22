"""
DermaSafe-AI Chatbot Service
Powered by Google Gemini
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import logging
from dotenv import load_dotenv

from .schemas import (
    ChatRequest, 
    ChatResponse, 
    ChatMessage,
    HealthResponse
)
from .conversation import ConversationManager
from .gemini_client import GeminiClient
from .prompts.system_prompt import generate_suggestions

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="DermaSafe-AI Chatbot Service",
    version="1.0.0",
    description="AI Chatbot hỗ trợ giải đáp thắc mắc về kết quả phân tích da liễu"
)

# CORS configuration
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOW_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
conversation_manager = ConversationManager(max_history_length=30)

# Initialize Gemini client
try:
    gemini_client = GeminiClient()
    logger.info("✅ Gemini client initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize Gemini client: {e}")
    gemini_client = None


@app.on_event("startup")
async def startup_event():
    """Run on startup"""
    logger.info("🚀 DermaSafe Chatbot Service starting up...")
    
    if gemini_client:
        # Test Gemini connection
        if gemini_client.test_connection():
            logger.info("✅ Gemini API connection successful")
        else:
            logger.warning("⚠️ Gemini API connection failed - check your API key")
    else:
        logger.error("❌ Gemini client not initialized - chatbot will not work")
    
    logger.info("🎉 Chatbot service ready!")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on shutdown"""
    logger.info("👋 Chatbot service shutting down...")


@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return {
        "service": "DermaSafe-AI Chatbot",
        "version": "1.0.0",
        "status": "running",
        "llm_provider": "Google Gemini Pro"
    }


@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health():
    """Health check endpoint"""
    return HealthResponse(
        status="ok" if gemini_client else "error",
        llm_provider="gemini",
        version="1.0.0"
    )


@app.post("/chat", response_model=ChatResponse, tags=["chat"])
async def chat(request: ChatRequest):
    """
    Main chatbot endpoint
    
    User gửi message kèm analysis context (nếu có),
    chatbot sẽ trả lời dựa trên:
    - Kết quả AI analysis
    - Lịch sử chat
    - Medical knowledge của Gemini
    
    Args:
        request: ChatRequest với session_id, message, và optional analysis_context
    
    Returns:
        ChatResponse với message từ AI và suggestions
    
    Raises:
        HTTPException: Nếu có lỗi khi xử lý
    """
    if not gemini_client:
        raise HTTPException(
            status_code=503,
            detail="Chatbot service unavailable - Gemini client not initialized"
        )
    
    logger.info(f"💬 Chat request from session: {request.session_id}")
    
    # Validate input
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )
    
    # Lưu message của user
    user_message = ChatMessage(
        role="user",
        content=request.message.strip()
    )
    conversation_manager.add_message(request.session_id, user_message)
    
    # Build messages cho LLM
    llm_messages = conversation_manager.build_llm_messages(
        session_id=request.session_id,
        analysis_context=request.analysis_context,
        max_context_messages=10  # Giới hạn 10 messages gần nhất
    )
    
    # Gọi Gemini
    try:
        logger.info(f"🤖 Calling Gemini API for session {request.session_id}...")
        
        assistant_reply = await gemini_client.chat(
            messages=llm_messages,
            temperature=0.7
        )
        
        logger.info(f"✅ Received Gemini response ({len(assistant_reply)} chars)")
        
    except Exception as e:
        logger.error(f"❌ Gemini API error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"LLM Error: {str(e)}"
        )
    
    # Lưu response của assistant
    assistant_message = ChatMessage(
        role="assistant",
        content=assistant_reply
    )
    conversation_manager.add_message(request.session_id, assistant_message)
    
    # Tạo suggestions dựa trên context
    suggestions = generate_suggestions(
        context=request.analysis_context.model_dump() if request.analysis_context else None,
        user_message=request.message
    )
    
    return ChatResponse(
        session_id=request.session_id,
        message=assistant_reply,
        suggestions=suggestions
    )


@app.get("/chat/history/{session_id}", response_model=List[ChatMessage], tags=["chat"])
async def get_history(session_id: str):
    """
    Lấy lịch sử chat của một session
    
    Args:
        session_id: ID của session
    
    Returns:
        List of ChatMessage
    """
    history = conversation_manager.get_messages(session_id)
    
    if not history:
        logger.info(f"📭 No history found for session: {session_id}")
    else:
        logger.info(f"📜 Retrieved {len(history)} messages for session: {session_id}")
    
    return history


@app.delete("/chat/history/{session_id}", tags=["chat"])
async def clear_history(session_id: str):
    """
    Xóa lịch sử chat của một session
    
    Args:
        session_id: ID của session
    
    Returns:
        Success message
    """
    success = conversation_manager.clear_session(session_id)
    
    if success:
        return {"message": f"History cleared for session {session_id}"}
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Session {session_id} not found"
        )


@app.get("/stats", tags=["monitoring"])
async def get_stats():
    """
    Lấy statistics về chatbot service
    (Useful cho monitoring)
    """
    return {
        "active_sessions": conversation_manager.get_session_count(),
        "total_messages": conversation_manager.get_total_messages(),
        "llm_provider": "gemini",
        "status": "healthy" if gemini_client else "unhealthy"
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "chatbot_app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8002)),
        reload=True
    )

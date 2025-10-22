"""
Conversation Manager - Quản lý lịch sử chat
"""
from typing import List, Dict, Optional
from .schemas import ChatMessage, AnalysisContext
from .prompts.system_prompt import SYSTEM_PROMPT, build_context_prompt
import logging

logger = logging.getLogger(__name__)


class ConversationManager:
    """
    Quản lý conversation history cho mỗi session
    
    - Lưu messages trong memory (production nên dùng Redis/Database)
    - Giới hạn history để tiết kiệm tokens
    - Build messages format cho LLM
    """
    
    def __init__(self, max_history_length: int = 20):
        """
        Args:
            max_history_length: Số lượng messages tối đa lưu trữ cho mỗi session
        """
        # Đơn giản: lưu trong memory
        # Production: dùng Redis hoặc PostgreSQL
        self.sessions: Dict[str, List[ChatMessage]] = {}
        self.max_history_length = max_history_length
        
        logger.info(f"ConversationManager initialized (max_history={max_history_length})")
    
    def get_messages(self, session_id: str) -> List[ChatMessage]:
        """
        Lấy lịch sử chat của một session
        
        Args:
            session_id: ID của session
        
        Returns:
            List các ChatMessage
        """
        return self.sessions.get(session_id, [])
    
    def add_message(self, session_id: str, message: ChatMessage):
        """
        Thêm message vào lịch sử
        
        Args:
            session_id: ID của session
            message: ChatMessage object
        """
        if session_id not in self.sessions:
            self.sessions[session_id] = []
            logger.info(f"📝 Created new session: {session_id}")
        
        self.sessions[session_id].append(message)
        
        # Giới hạn history length để tránh tràn memory
        if len(self.sessions[session_id]) > self.max_history_length:
            removed = self.sessions[session_id].pop(0)
            logger.debug(f"🗑️ Removed old message from session {session_id}: {removed.role}")
        
        logger.debug(f"💬 Added {message.role} message to session {session_id}")
    
    def build_llm_messages(
        self, 
        session_id: str,
        analysis_context: Optional[AnalysisContext] = None,
        max_context_messages: int = 10
    ) -> List[Dict[str, str]]:
        """
        Chuyển conversation history thành format cho LLM
        
        Args:
            session_id: ID của session
            analysis_context: Context từ AI analysis (nếu có)
            max_context_messages: Số messages gần nhất để gửi cho LLM (tiết kiệm tokens)
        
        Returns:
            List of messages in format [{"role": "...", "content": "..."}]
        """
        messages = []
        
        # 1. System prompt (luôn có)
        messages.append({
            "role": "system", 
            "content": SYSTEM_PROMPT
        })
        
        # 2. Thêm context từ AI analysis (nếu có)
        if analysis_context:
            context_prompt = build_context_prompt(analysis_context.model_dump())
            if context_prompt:
                messages.append({
                    "role": "system", 
                    "content": context_prompt
                })
                logger.debug(f"📊 Added analysis context to session {session_id}")
        
        # 3. Thêm lịch sử chat (giới hạn để tiết kiệm tokens)
        history = self.get_messages(session_id)[-max_context_messages:]
        
        for msg in history:
            if msg.role in ["user", "assistant"]:
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        logger.debug(
            f"🔧 Built {len(messages)} messages for LLM "
            f"(system={len([m for m in messages if m['role']=='system'])}, "
            f"history={len([m for m in messages if m['role'] in ['user', 'assistant']])})"
        )
        
        return messages
    
    def clear_session(self, session_id: str) -> bool:
        """
        Xóa lịch sử chat của một session
        
        Args:
            session_id: ID của session
        
        Returns:
            bool: True nếu xóa thành công, False nếu session không tồn tại
        """
        if session_id in self.sessions:
            del self.sessions[session_id]
            logger.info(f"🗑️ Cleared session: {session_id}")
            return True
        else:
            logger.warning(f"⚠️ Attempted to clear non-existent session: {session_id}")
            return False
    
    def get_session_count(self) -> int:
        """Số lượng sessions đang active"""
        return len(self.sessions)
    
    def get_total_messages(self) -> int:
        """Tổng số messages trong tất cả sessions"""
        return sum(len(msgs) for msgs in self.sessions.values())
    
    def cleanup_old_sessions(self, max_sessions: int = 1000):
        """
        Cleanup sessions cũ nếu có quá nhiều sessions
        (Để tránh memory leak trong production)
        
        Args:
            max_sessions: Số lượng sessions tối đa cho phép
        """
        if len(self.sessions) > max_sessions:
            # Xóa các sessions cũ nhất (giả sử session_id có timestamp)
            session_ids = sorted(self.sessions.keys())
            to_remove = session_ids[:len(session_ids) - max_sessions]
            
            for sid in to_remove:
                del self.sessions[sid]
            
            logger.warning(
                f"🧹 Cleaned up {len(to_remove)} old sessions "
                f"(current: {len(self.sessions)})"
            )

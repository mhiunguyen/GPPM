"""
Google Gemini LLM Client
"""
import os
import logging
from typing import List, Dict
import google.generativeai as genai

logger = logging.getLogger(__name__)


class GeminiClient:
    """Client để giao tiếp với Google Gemini API"""
    
    def __init__(self, api_key: str | None = None):
        """
        Initialize Gemini client
        
        Args:
            api_key: Gemini API key. Nếu None, sẽ lấy từ env GEMINI_API_KEY
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        
        if not self.api_key:
            raise ValueError(
                "GEMINI_API_KEY not found. "
                "Get your free API key from: https://makersuite.google.com/app/apikey"
            )
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Use Gemini 2.0 Flash model (latest, fast and free)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Configure generation settings
        self.generation_config = {
            'temperature': 0.7,  # Vừa sáng tạo vừa consistent
            'top_p': 0.9,
            'top_k': 40,
            'max_output_tokens': 800,  # Đủ cho response chi tiết nhưng không quá dài
        }
        
        # Safety settings - cho phép medical content
        self.safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_ONLY_HIGH"  # Cho phép medical content
            },
        ]
        
        logger.info("✅ Gemini client initialized successfully")
    
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        temperature: float | None = None
    ) -> str:
        """
        Gửi messages và nhận response từ Gemini
        
        Args:
            messages: List of messages in OpenAI format
                [
                    {"role": "system", "content": "You are..."},
                    {"role": "user", "content": "Hello"},
                    {"role": "assistant", "content": "Hi!"},
                    {"role": "user", "content": "How are you?"}
                ]
            temperature: Override default temperature
        
        Returns:
            str: Response từ Gemini
        
        Raises:
            Exception: Nếu có lỗi khi call API
        """
        try:
            # Convert OpenAI-style messages to Gemini format
            gemini_messages = self._convert_messages_to_gemini_format(messages)
            
            # Override temperature if provided
            config = self.generation_config.copy()
            if temperature is not None:
                config['temperature'] = temperature
            
            # Start chat session
            chat = self.model.start_chat(history=gemini_messages['history'])
            
            # Send last user message
            response = chat.send_message(
                gemini_messages['last_message'],
                generation_config=config,
                safety_settings=self.safety_settings
            )
            
            # Check if response was blocked
            if not response.text:
                logger.warning("⚠️ Gemini response was blocked by safety filters")
                return (
                    "Xin lỗi, tôi không thể trả lời câu hỏi này do chính sách an toàn. "
                    "Nếu bạn có thắc mắc về sức khỏe, vui lòng tham khảo bác sĩ chuyên khoa. 🏥"
                )
            
            logger.info(f"✅ Gemini response received ({len(response.text)} chars)")
            return response.text
            
        except Exception as e:
            logger.error(f"❌ Gemini API error: {str(e)}")
            
            # User-friendly error message
            if "API_KEY_INVALID" in str(e):
                return (
                    "⚠️ Lỗi cấu hình API. Vui lòng liên hệ quản trị viên. "
                    "(Gemini API key không hợp lệ)"
                )
            elif "RESOURCE_EXHAUSTED" in str(e):
                return (
                    "⚠️ Hệ thống đang quá tải. Vui lòng thử lại sau vài phút. "
                    "(Đã vượt quá giới hạn requests)"
                )
            else:
                return (
                    f"⚠️ Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. "
                    f"Vui lòng thử lại sau. (Lỗi: {str(e)[:100]})"
                )
    
    def _convert_messages_to_gemini_format(self, messages: List[Dict[str, str]]) -> Dict:
        """
        Convert OpenAI-style messages to Gemini chat format
        
        Gemini format:
        - history: List of {"role": "user", "parts": ["text"]} and {"role": "model", "parts": ["text"]}
        - last_message: String (user's last message)
        
        Args:
            messages: OpenAI-style messages
        
        Returns:
            Dict with 'history' and 'last_message'
        """
        history = []
        system_prompt = ""
        
        for msg in messages:
            role = msg['role']
            content = msg['content']
            
            if role == 'system':
                # Gemini không có "system" role, nên gộp vào first user message
                system_prompt += content + "\n\n"
            
            elif role == 'user':
                history.append({
                    "role": "user",
                    "parts": [content]
                })
            
            elif role == 'assistant':
                history.append({
                    "role": "model",  # Gemini gọi là "model" thay vì "assistant"
                    "parts": [content]
                })
        
        # Lấy last user message
        if history and history[-1]['role'] == 'user':
            last_message = history[-1]['parts'][0]
            history = history[:-1]  # Remove last message from history
        else:
            last_message = "Xin chào!"
        
        # Prepend system prompt to first user message nếu có
        if system_prompt and history and history[0]['role'] == 'user':
            history[0]['parts'][0] = system_prompt + history[0]['parts'][0]
        elif system_prompt:
            # Nếu chưa có user message, tạo một message mới
            last_message = system_prompt + last_message
        
        return {
            'history': history,
            'last_message': last_message
        }
    
    def test_connection(self) -> bool:
        """
        Test xem Gemini API có hoạt động không
        
        Returns:
            bool: True nếu OK, False nếu có lỗi
        """
        try:
            response = self.model.generate_content(
                "Say 'OK' if you can read this.",
                generation_config={'max_output_tokens': 10}
            )
            return response.text is not None
        except Exception as e:
            logger.error(f"❌ Gemini connection test failed: {e}")
            return False

# 🤖 Hướng dẫn Triển khai Chatbot AI cho DermaSafe

## 📋 Mục lục
1. [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
2. [Lựa chọn công nghệ](#lựa-chọn-công-nghệ)
3. [Implementation Steps](#implementation-steps)
4. [Code Examples](#code-examples)
5. [Deployment](#deployment)

---

## 🏗️ Tổng quan kiến trúc

### Luồng hoạt động
```
1. User upload ảnh → AI phân tích → Trả về kết quả
2. User click "Chat với AI" → Mở chatbot
3. Chatbot nhận context từ kết quả phân tích
4. User hỏi đáp → Chatbot trả lời dựa trên:
   - Kết quả AI analysis
   - Medical knowledge base
   - User conversation history
```

### Kiến trúc đề xuất

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  ┌──────────────┐              ┌──────────────────┐    │
│  │ ImageUploader│──────┐       │  ChatInterface   │    │
│  └──────────────┘      │       │  (mới thêm)      │    │
│                        ▼       └─────────┬────────┘    │
│                  ┌──────────┐            │             │
│                  │ResultCard│            │             │
│                  └──────────┘            │             │
└────────────────────┬────────────────────┬──────────────┘
                     │                    │
                     ▼                    ▼
              ┌──────────────┐    ┌──────────────────┐
              │ Backend API  │    │ Chatbot Service  │
              │  Port: 8000  │◄───│   Port: 8002     │
              └──────┬───────┘    └────────┬─────────┘
                     │                     │
                     ▼                     │
              ┌──────────────┐             │
              │ AI Service   │─────────────┘
              │  Port: 8001  │  (Get analysis context)
              └──────────────┘
                     │
                     │ LLM API Call
                     ▼
              ┌──────────────┐
              │ OpenAI GPT-4 │
              │ hoặc Gemini  │
              └──────────────┘
```

---

## 🛠️ Lựa chọn công nghệ

### Option 1: OpenAI GPT-4 (Khuyến nghị cho Production)

**Ưu điểm:**
- ✅ Hiểu tiếng Việt cực tốt
- ✅ Response chất lượng cao, empathetic
- ✅ API ổn định, rate limit cao
- ✅ Có function calling (gọi API nội bộ)
- ✅ Hỗ trợ streaming (real-time response)

**Nhược điểm:**
- ❌ Chi phí: ~$0.01/1K tokens (input), $0.03/1K tokens (output)
- ❌ Cần API key (trả phí)

**Use case:** Sản phẩm production, cần chất lượng cao

---

### Option 2: Google Gemini Pro (Free tier tốt)

**Ưu điểm:**
- ✅ Free tier: 60 requests/minute
- ✅ Hiểu tiếng Việt tốt
- ✅ Response nhanh
- ✅ Hỗ trợ multimodal (text + image)

**Nhược điểm:**
- ❌ Free tier giới hạn 60 req/min
- ❌ Empathy/medical tone chưa bằng GPT-4

**Use case:** MVP, testing, dự án nhỏ

---

### Option 3: Local LLM (Llama 3, Mistral)

**Ưu điểm:**
- ✅ Hoàn toàn free
- ✅ Privacy tốt (không gửi data ra ngoài)
- ✅ Không giới hạn requests

**Nhược điểm:**
- ❌ Cần GPU mạnh (8GB+ VRAM)
- ❌ Chất lượng tiếng Việt kém hơn
- ❌ Setup phức tạp hơn

**Use case:** Privacy-focused, budget thấp, có infrastructure

---

## 🚀 Implementation Steps

### Bước 1: Tạo Chatbot Service

```bash
# Tạo thư mục mới
mkdir chatbot-service
cd chatbot-service

# Tạo cấu trúc
mkdir -p chatbot_app/{prompts,utils}
touch chatbot_app/{__init__.py,main.py,schemas.py,conversation.py,llm_client.py}
touch requirements.txt Dockerfile .env.example
```

---

### Bước 2: Cài đặt Dependencies

**requirements.txt:**
```txt
fastapi==0.115.0
uvicorn==0.32.0
pydantic==2.9.0
python-dotenv==1.0.0

# Option 1: OpenAI
openai==1.54.0

# Option 2: Google Gemini
google-generativeai==0.8.3

# Option 3: Local LLM
# langchain==0.3.7
# llama-cpp-python==0.3.2

# Utils
httpx==0.27.0
redis==5.2.0  # Optional: cache conversations
```

---

### Bước 3: Code Implementation

#### **chatbot_app/schemas.py**
```python
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class AnalysisContext(BaseModel):
    """Context từ AI Service"""
    risk: str
    reason: str
    primary_disease: Optional[Dict] = None
    alternative_diseases: Optional[List[Dict]] = []
    recommendations: Optional[List[str]] = []
    clinical_concepts: Optional[List[str]] = []

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)

class ChatRequest(BaseModel):
    session_id: str
    message: str
    analysis_context: Optional[AnalysisContext] = None

class ChatResponse(BaseModel):
    session_id: str
    message: str
    suggestions: Optional[List[str]] = []  # Gợi ý câu hỏi tiếp theo
```

---

#### **chatbot_app/prompts/system_prompt.py**
```python
SYSTEM_PROMPT = """
Bạn là trợ lý AI y tế chuyên về da liễu của DermaSafe-AI, một hệ thống sàng lọc rủi ro da liễu.

NHIỆM VỤ CỦA BẠN:
- Giải thích kết quả phân tích AI cho người dùng một cách dễ hiểu
- Trả lời các câu hỏi về tình trạng da của họ
- Hỗ trợ, an ủi và đưa ra lời khuyên hợp lý
- Luôn nhấn mạnh: "Đây KHÔNG phải chẩn đoán y khoa chính thức"

NGUYÊN TẮC QUAN TRỌNG:
1. ⚠️ KHÔNG BAO GIỜ chẩn đoán chính thức hoặc thay thế bác sĩ
2. ✅ Luôn khuyên người dùng đi khám bác sĩ nếu nghi ngờ
3. 🇻🇳 Trả lời bằng tiếng Việt, giọng điệu thân thiện, empathetic
4. 📊 Sử dụng kết quả AI analysis để trả lời (nếu có)
5. 🎯 Ngắn gọn, rõ ràng, tránh thuật ngữ phức tạp

THÔNG TIN NGUY HIỂM - PHẢI CẢNH BÁO NGAY:
- Nếu user mô tả: chảy máu không dừng, đau dữ dội, sốt cao, lan nhanh
- → Trả lời: "⚠️ Triệu chứng này cần đi bệnh viện NGAY LẬP TỨC"

GIỌNG ĐIỆU:
- Thân thiện, ấm áp như một người bạn quan tâm
- Không gây hoảng loạn, nhưng cũng không coi nhẹ
- Khuyến khích hành động tích cực (đi khám nếu cần)

CONTEXT SẼ ĐƯỢC CUNG CẤP:
- Kết quả phân tích AI (nếu user đã upload ảnh)
- Lịch sử trò chuyện (conversation history)
"""

def build_context_prompt(analysis: dict) -> str:
    """Tạo prompt từ kết quả AI analysis"""
    if not analysis:
        return ""
    
    prompt = f"""
KẾT QUẢ PHÂN TÍCH AI (User vừa nhận được):
- Mức độ rủi ro: {analysis.get('risk', 'N/A').upper()}
- Lý do: {analysis.get('reason', 'N/A')}
"""
    
    if analysis.get('primary_disease'):
        disease = analysis['primary_disease']
        prompt += f"""
- Chẩn đoán chính: {disease.get('vietnamese_name', 'N/A')} ({disease.get('confidence', 0)*100:.1f}%)
- Mức độ nghiêm trọng: {disease.get('severity', 'N/A')}
"""
    
    if analysis.get('recommendations'):
        prompt += "\nKHUYẾN NGHỊ:\n"
        for rec in analysis['recommendations'][:3]:
            prompt += f"  • {rec}\n"
    
    return prompt
```

---

#### **chatbot_app/llm_client.py**
```python
import os
from typing import List, Dict
from openai import OpenAI
# hoặc: import google.generativeai as genai

class LLMClient:
    def __init__(self, provider: str = "openai"):
        """
        provider: "openai" | "gemini" | "local"
        """
        self.provider = provider
        
        if provider == "openai":
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            self.model = "gpt-4o-mini"  # Rẻ hơn, vẫn tốt
        
        elif provider == "gemini":
            import google.generativeai as genai
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            self.model = genai.GenerativeModel('gemini-pro')
        
        # elif provider == "local":
        #     from llama_cpp import Llama
        #     self.client = Llama(model_path="models/llama3-8b.gguf")
    
    async def chat(
        self, 
        messages: List[Dict[str, str]], 
        temperature: float = 0.7
    ) -> str:
        """
        Gửi messages và nhận response từ LLM
        
        messages format:
        [
            {"role": "system", "content": "You are..."},
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi there!"},
            {"role": "user", "content": "How are you?"}
        ]
        """
        
        if self.provider == "openai":
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=500  # Giới hạn độ dài response
            )
            return response.choices[0].message.content
        
        elif self.provider == "gemini":
            # Gemini format khác một chút
            chat = self.model.start_chat(history=[])
            for msg in messages:
                if msg['role'] == 'user':
                    response = chat.send_message(msg['content'])
            return response.text
        
        else:
            raise ValueError(f"Unknown provider: {self.provider}")
```

---

#### **chatbot_app/conversation.py**
```python
from typing import List, Dict, Optional
from .schemas import ChatMessage, AnalysisContext
from .prompts.system_prompt import SYSTEM_PROMPT, build_context_prompt

class ConversationManager:
    """Quản lý conversation history cho mỗi session"""
    
    def __init__(self):
        # Đơn giản: lưu trong memory
        # Production: dùng Redis hoặc database
        self.sessions: Dict[str, List[ChatMessage]] = {}
    
    def get_messages(self, session_id: str) -> List[ChatMessage]:
        """Lấy lịch sử chat"""
        return self.sessions.get(session_id, [])
    
    def add_message(self, session_id: str, message: ChatMessage):
        """Thêm message vào lịch sử"""
        if session_id not in self.sessions:
            self.sessions[session_id] = []
        self.sessions[session_id].append(message)
    
    def build_llm_messages(
        self, 
        session_id: str,
        analysis_context: Optional[AnalysisContext] = None
    ) -> List[Dict[str, str]]:
        """
        Chuyển conversation history thành format cho LLM
        """
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Thêm context từ AI analysis (nếu có)
        if analysis_context:
            context_prompt = build_context_prompt(analysis_context.model_dump())
            messages.append({
                "role": "system", 
                "content": context_prompt
            })
        
        # Thêm lịch sử chat (giới hạn 10 messages gần nhất để tiết kiệm tokens)
        history = self.get_messages(session_id)[-10:]
        for msg in history:
            if msg.role in ["user", "assistant"]:
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        return messages
    
    def clear_session(self, session_id: str):
        """Xóa lịch sử chat"""
        if session_id in self.sessions:
            del self.sessions[session_id]
```

---

#### **chatbot_app/main.py**
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
from datetime import datetime

from .schemas import (
    ChatRequest, 
    ChatResponse, 
    ChatMessage,
    AnalysisContext
)
from .conversation import ConversationManager
from .llm_client import LLMClient
import os

app = FastAPI(title="DermaSafe Chatbot Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize
conversation_manager = ConversationManager()
llm_provider = os.getenv("LLM_PROVIDER", "openai")  # "openai" | "gemini"
llm_client = LLMClient(provider=llm_provider)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "llm_provider": llm_provider
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chatbot endpoint
    """
    # Lưu message của user
    user_message = ChatMessage(
        role="user",
        content=request.message
    )
    conversation_manager.add_message(request.session_id, user_message)
    
    # Build messages cho LLM
    llm_messages = conversation_manager.build_llm_messages(
        session_id=request.session_id,
        analysis_context=request.analysis_context
    )
    
    # Gọi LLM
    try:
        assistant_reply = await llm_client.chat(
            messages=llm_messages,
            temperature=0.7
        )
    except Exception as e:
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
    
    # Tạo suggestions (optional)
    suggestions = generate_suggestions(request.analysis_context)
    
    return ChatResponse(
        session_id=request.session_id,
        message=assistant_reply,
        suggestions=suggestions
    )

@app.get("/chat/history/{session_id}", response_model=List[ChatMessage])
async def get_history(session_id: str):
    """Lấy lịch sử chat"""
    return conversation_manager.get_messages(session_id)

@app.delete("/chat/history/{session_id}")
async def clear_history(session_id: str):
    """Xóa lịch sử chat"""
    conversation_manager.clear_session(session_id)
    return {"message": "History cleared"}

def generate_suggestions(context: AnalysisContext | None) -> List[str]:
    """Tạo gợi ý câu hỏi dựa trên context"""
    if not context:
        return [
            "Tôi nên làm gì tiếp theo?",
            "Tình trạng này có nguy hiểm không?",
            "Tôi cần đi khám bác sĩ không?"
        ]
    
    suggestions = []
    
    if context.risk == "cao":
        suggestions = [
            "Tôi nên đi khám ngay hay chờ vài ngày?",
            "Có cách nào giảm triệu chứng không?",
            "Bệnh này có chữa được không?"
        ]
    elif context.risk == "trung bình":
        suggestions = [
            "Tôi nên theo dõi những triệu chứng nào?",
            "Khi nào tôi cần đi khám?",
            "Có cách phòng ngừa không?"
        ]
    else:
        suggestions = [
            "Làm sao để chăm sóc da tốt hơn?",
            "Tôi có nên theo dõi thêm không?",
            "Khi nào cần đi khám bác sĩ?"
        ]
    
    return suggestions
```

---

### Bước 4: Frontend Integration

#### **frontend/src/components/ChatInterface.tsx** (NEW)
```tsx
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  analysisContext?: any;  // Từ AI analysis result
}

export default function ChatInterface({ analysisContext }: ChatInterfaceProps) {
  const [sessionId] = useState(() => uuidv4());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: message,
          analysis_context: analysisContext
        })
      });

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-t-xl">
        <h2 className="text-xl font-bold">💬 Chat với AI Hỗ trợ</h2>
        <p className="text-sm opacity-90">Hỏi đáp về kết quả phân tích của bạn</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">👋 Xin chào! Tôi có thể giúp gì cho bạn?</p>
            <p className="text-sm">Hãy hỏi tôi về kết quả phân tích hoặc bất kỳ thắc mắc nào về da liễu.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString('vi-VN')}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(suggestion)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
            >
              💡 {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### **Update App.tsx:**
```tsx
import ChatInterface from './components/ChatInterface';

// ... existing code ...

{result && (
  <>
    <ResultCard risk={result.risk} reason={result.reason} />
    
    {/* NEW: Chat interface */}
    <div className="mt-6">
      <ChatInterface analysisContext={result} />
    </div>
  </>
)}
```

---

### Bước 5: Backend API Proxy (Optional)

**backend-api/backend_app/main.py** - Thêm proxy cho chatbot:
```python
@app.post("/api/v1/chat")
async def chat(request: dict):
    """Proxy chatbot requests"""
    async with httpx.AsyncClient(
        base_url="http://localhost:8002",
        timeout=30.0
    ) as client:
        r = await client.post("/chat", json=request)
        r.raise_for_status()
        return r.json()
```

---

### Bước 6: Docker Setup

**chatbot-service/Dockerfile:**
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY chatbot_app/ ./chatbot_app/

# Run
CMD ["uvicorn", "chatbot_app.main:app", "--host", "0.0.0.0", "--port", "8002"]
```

**docker-compose.yml** - Thêm service:
```yaml
services:
  # ... existing services ...
  
  chatbot:
    build: ./chatbot-service
    ports:
      - "8002:8002"
    environment:
      - LLM_PROVIDER=openai  # or gemini
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - ai-service
```

---

## 💰 Chi phí ước tính

### OpenAI GPT-4o-mini
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens
- Trung bình 1 conversation (10 messages): ~2000 tokens
- **Chi phí**: ~$0.002/conversation ≈ 50đ/conversation
- **1000 users/ngày**: ~50k VNĐ/ngày ≈ 1.5M VNĐ/tháng

### Google Gemini Pro
- **Free tier**: 60 requests/minute = 86,400 requests/ngày
- **Paid**: $0.00025/1K characters (~$0.001/conversation)
- **Chi phí**: Gần như miễn phí cho dự án nhỏ

### Local LLM (Llama 3)
- **Chi phí**: $0 (chỉ tốn điện + infrastructure)
- **Infrastructure**: VPS GPU (~$50-100/tháng)

---

## 📊 So sánh các phương án

| Tiêu chí | OpenAI GPT-4o-mini | Google Gemini | Local LLM |
|----------|-------------------|---------------|-----------|
| Chất lượng tiếng Việt | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Chi phí (1000 users/ngày) | ~1.5M/tháng | Free | ~2M/tháng (GPU server) |
| Tốc độ phản hồi | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Privacy | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Độ khó setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Empathy/Medical tone | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Khuyến nghị:**
- **MVP/Testing**: Gemini (free tier)
- **Production nhỏ**: GPT-4o-mini (tốt + rẻ)
- **Scale lớn**: Local LLM (nếu có infrastructure)

---

## 🧪 Testing

```bash
# Test chatbot service
curl -X POST http://localhost:8002/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "Kết quả này có nghĩa là gì?",
    "analysis_context": {
      "risk": "cao",
      "reason": "Phát hiện tổn thương nguy hiểm",
      "primary_disease": {
        "vietnamese_name": "Ung thư hắc tố",
        "confidence": 0.72
      }
    }
  }'
```

---

## 🚀 Deployment Checklist

- [ ] Tạo OpenAI/Gemini API key
- [ ] Setup environment variables
- [ ] Test locally với `uvicorn`
- [ ] Test với Docker Compose
- [ ] Implement rate limiting (tránh spam)
- [ ] Setup monitoring (Sentry, Datadog)
- [ ] Thêm logging conversation (GDPR compliant)
- [ ] Test empathy và medical accuracy
- [ ] A/B test different LLMs
- [ ] Setup cache (Redis) cho sessions

---

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini Docs](https://ai.google.dev/docs)
- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/)
- [LangChain](https://python.langchain.com/) - Framework cho complex chatbots

---

## 🎯 Roadmap

**Phase 1: MVP (1-2 tuần)**
- ✅ Basic chatbot với Gemini free tier
- ✅ Simple conversation memory
- ✅ Integration với AI analysis results

**Phase 2: Enhanced (2-3 tuần)**
- ⬜ Switch to GPT-4o-mini
- ⬜ Redis cache cho sessions
- ⬜ Streaming responses (real-time typing)
- ⬜ Sentiment analysis (phát hiện user anxiety)

**Phase 3: Advanced (1-2 tháng)**
- ⬜ Function calling (book doctor appointments)
- ⬜ Multimodal (send images in chat)
- ⬜ Voice input/output
- ⬜ Personalized recommendations based on history

---

**🎉 Good luck với chatbot! Nếu cần support, ping tôi nhé!**

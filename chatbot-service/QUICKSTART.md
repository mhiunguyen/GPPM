# 🤖 Quick Start Guide - Chatbot Service

Hướng dẫn nhanh để chạy chatbot trong 5 phút!

---

## 📋 Prerequisites

- ✅ Python 3.12+
- ✅ Google Account (để lấy Gemini API key miễn phí)

---

## 🚀 5 Bước để chạy Chatbot

### **Bước 1: Lấy Gemini API Key (2 phút)**

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập Google Account
3. Click **"Create API key"**
4. Copy API key (dạng: `AIzaSy...`)

📚 **Chi tiết**: Xem file `GEMINI_API_KEY_GUIDE.md`

---

### **Bước 2: Setup Environment (1 phút)**

```powershell
# Di chuyển vào thư mục chatbot-service
cd chatbot-service

# Copy file env
Copy-Item .env.example .env

# Mở .env và paste API key của bạn
notepad .env
```

**.env:**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX  # Paste API key ở đây
```

---

### **Bước 3: Cài đặt Dependencies (1 phút)**

```powershell
# Tạo virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

---

### **Bước 4: Test Chatbot (30 giây)**

```powershell
# Run test script
python test_chatbot.py
```

**Expected output:**
```
✅ Gemini API connection: OK
✅ Gemini response: Xin chào!...
✅ All tests passed!
```

❌ **Nếu failed**: Kiểm tra lại API key trong `.env`

---

### **Bước 5: Chạy Service (30 giây)**

```powershell
# Cách 1: Dùng script (khuyến nghị)
.\start.ps1

# Cách 2: Manual
uvicorn chatbot_app.main:app --reload --port 8002
```

**Service sẽ chạy tại:**
- 🌐 API: http://localhost:8002
- 📚 Docs: http://localhost:8002/docs
- ❤️ Health: http://localhost:8002/health

---

## 🧪 Test API

### Test với browser:

Mở http://localhost:8002/docs và thử API `/chat`

### Test với curl:

```powershell
# Health check
curl http://localhost:8002/health

# Simple chat
curl -X POST http://localhost:8002/chat `
  -H "Content-Type: application/json" `
  -d '{
    "session_id": "test-123",
    "message": "Xin chào!"
  }'
```

### Test với Python:

```python
import requests

response = requests.post('http://localhost:8002/chat', json={
    "session_id": "test-123",
    "message": "Kết quả AI cho thấy tôi có nguy cơ cao, điều này nghĩa là gì?",
    "analysis_context": {
        "risk": "cao",
        "reason": "Phát hiện tổn thương nguy hiểm",
        "primary_disease": {
            "vietnamese_name": "Ung thư hắc tố",
            "confidence": 0.72
        }
    }
})

print(response.json()['message'])
```

---

## 🐳 Chạy với Docker (Alternative)

```bash
# Build image
docker build -t chatbot-service .

# Run container
docker run -d \
  -p 8002:8002 \
  -e GEMINI_API_KEY=your-api-key \
  chatbot-service
```

---

## 🔗 Integration với Full Stack

### Bước 1: Update Backend API

**backend-api/backend_app/main.py:**
```python
CHATBOT_SERVICE_URL = os.getenv("CHATBOT_SERVICE_URL", "http://localhost:8002")

@app.post("/api/v1/chat")
async def chat(request: dict):
    """Proxy chatbot requests"""
    async with httpx.AsyncClient(
        base_url=CHATBOT_SERVICE_URL,
        timeout=30.0
    ) as client:
        r = await client.post("/chat", json=request)
        r.raise_for_status()
        return r.json()
```

### Bước 2: Update Frontend

**frontend/src/components/ChatInterface.tsx:**
```typescript
const sendMessage = async (message: string) => {
  const response = await fetch('/api/v1/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
      analysis_context: analysisResult  // Từ AI analysis
    })
  });
  
  const data = await response.json();
  // Display data.message
};
```

### Bước 3: Run All Services

```powershell
# Terminal 1: AI Service
cd ai-service
uvicorn ai_app.main:app --port 8001

# Terminal 2: Chatbot Service
cd chatbot-service
.\start.ps1

# Terminal 3: Backend API
cd backend-api
uvicorn backend_app.main:app --port 8000

# Terminal 4: Frontend
cd frontend
npm run dev
```

**Hoặc dùng Docker Compose (dễ hơn):**

```powershell
# Tạo .env file ở root
Copy-Item .env.example .env
# Edit .env và thêm GEMINI_API_KEY

# Run all services
docker-compose up -d

# View logs
docker-compose logs -f chatbot
```

---

## 📊 Architecture Overview

```
┌─────────────┐
│  Frontend   │
│  (React)    │
└──────┬──────┘
       │
       ▼
┌──────────────┐
│ Backend API  │ ──────┐
│  (FastAPI)   │       │
└──────┬───────┘       │
       │               ▼
       │        ┌──────────────────┐
       │        │ Chatbot Service  │
       │        │  (FastAPI +      │
       │        │   Gemini)        │
       │        └────────┬─────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌─────────────┐
│ AI Service   │  │ Gemini API  │
│  (DermLIP)   │  │  (Google)   │
└──────────────┘  └─────────────┘
```

---

## 🎯 Usage Example

### User flow:
1. User upload ảnh → AI phân tích → Trả kết quả
2. User click "Chat với AI" → Mở chatbot
3. User: "Kết quả này nghĩa là gì?"
4. Bot: "Dựa trên phân tích AI, tổn thương của bạn có mức độ rủi ro CAO..."
5. User: "Tôi nên làm gì?"
6. Bot: "Bạn nên đi khám bác sĩ da liễu trong vòng 1-2 ngày..."

---

## 🐛 Troubleshooting

### Lỗi: "Import google.generativeai could not be resolved"
```powershell
pip install google-generativeai
```

### Lỗi: "GEMINI_API_KEY not found"
```powershell
# Kiểm tra .env file
cat .env

# Đảm bảo có dòng:
GEMINI_API_KEY=AIzaSy...
```

### Lỗi: "Address already in use"
```powershell
# Port 8002 đã được sử dụng
# Đổi port khác:
uvicorn chatbot_app.main:app --port 8003
```

### Chatbot trả lời chậm
- Gemini free tier có rate limit 60 req/min
- Response time: ~2-5s (bình thường)
- Nếu > 10s: Kiểm tra network

---

## 📚 Next Steps

- [ ] Test chatbot với nhiều scenarios
- [ ] Tích hợp vào frontend (ChatInterface component)
- [ ] Deploy lên production
- [ ] Monitor API usage (Gemini quota)
- [ ] Add caching (Redis) nếu cần

---

## 🆘 Support

**Documentation:**
- `README.md` - Chi tiết về service
- `GEMINI_API_KEY_GUIDE.md` - Hướng dẫn lấy API key
- `CHATBOT_IMPLEMENTATION_GUIDE.md` - Full implementation guide

**Test:**
- `test_chatbot.py` - Test suite đầy đủ

**Questions?**
- Check `/docs` endpoint: http://localhost:8002/docs
- Check logs: `docker-compose logs chatbot`

---

**🎉 Chúc bạn thành công!**

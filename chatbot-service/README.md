# 🤖 DermaSafe-AI Chatbot Service

AI Chatbot hỗ trợ giải đáp thắc mắc về kết quả phân tích da liễu, powered by **Google Gemini Pro**.

---

## 🎯 Tính năng

- ✅ Chat với AI về kết quả phân tích da liễu
- ✅ Giải thích kết quả AI một cách dễ hiểu
- ✅ Hỗ trợ tiếng Việt tự nhiên
- ✅ Conversation memory (lưu lịch sử chat)
- ✅ Suggestions (gợi ý câu hỏi tiếp theo)
- ✅ Medical-aware (hiểu ngữ cảnh y tế)
- ✅ Safe & empathetic responses

---

## 🚀 Quick Start

### 1. Cài đặt Dependencies

```bash
cd chatbot-service
pip install -r requirements.txt
```

### 2. Setup Gemini API Key

```bash
# Copy file env example
cp .env.example .env

# Edit .env và thêm API key của bạn
# Lấy API key miễn phí tại: https://makersuite.google.com/app/apikey
```

**.env:**
```env
GEMINI_API_KEY=your-api-key-here
```

### 3. Chạy Service

```bash
# Development mode
uvicorn chatbot_app.main:app --reload --port 8002

# Hoặc
python -m chatbot_app.main
```

Service sẽ chạy tại: **http://localhost:8002**

---

## 📡 API Endpoints

### **POST /chat**
Gửi message và nhận response từ chatbot

**Request:**
```json
{
  "session_id": "user-123",
  "message": "Kết quả này có nghĩa là gì?",
  "analysis_context": {
    "risk": "cao",
    "reason": "Phát hiện tổn thương nguy hiểm",
    "primary_disease": {
      "vietnamese_name": "Ung thư hắc tố",
      "confidence": 0.72,
      "severity": "rất nghiêm trọng"
    },
    "recommendations": [
      "⚠️ ĐI KHÁM NGAY LẬP TỨC"
    ]
  }
}
```

**Response:**
```json
{
  "session_id": "user-123",
  "message": "Dựa trên phân tích AI, tổn thương trên da của bạn có độ rủi ro CAO (🔴)...",
  "suggestions": [
    "Tôi nên đi khám ngay hay có thể chờ vài ngày?",
    "Bác sĩ da liễu sẽ làm những gì khi khám?",
    "Có cách nào để giảm nguy cơ trong lúc chờ khám không?"
  ],
  "timestamp": "2025-10-22T10:30:00"
}
```

### **GET /chat/history/{session_id}**
Lấy lịch sử chat

**Response:**
```json
[
  {
    "role": "user",
    "content": "Kết quả này có nghĩa là gì?",
    "timestamp": "2025-10-22T10:30:00"
  },
  {
    "role": "assistant",
    "content": "Dựa trên phân tích AI...",
    "timestamp": "2025-10-22T10:30:05"
  }
]
```

### **DELETE /chat/history/{session_id}**
Xóa lịch sử chat

### **GET /health**
Health check

**Response:**
```json
{
  "status": "ok",
  "llm_provider": "gemini",
  "version": "1.0.0"
}
```

### **GET /stats**
Service statistics (monitoring)

**Response:**
```json
{
  "active_sessions": 42,
  "total_messages": 328,
  "llm_provider": "gemini",
  "status": "healthy"
}
```

---

## 🧪 Testing

### Test với curl

```bash
# Health check
curl http://localhost:8002/health

# Chat request
curl -X POST http://localhost:8002/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "Xin chào, bạn có thể giúp tôi không?"
  }'

# Chat với analysis context
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

# Get history
curl http://localhost:8002/chat/history/test-123
```

---

## 🐳 Docker Deployment

### Build Docker image

```bash
docker build -t dermasafe-chatbot:latest .
```

### Run Docker container

```bash
docker run -d \
  -p 8002:8002 \
  -e GEMINI_API_KEY=your-api-key \
  --name chatbot \
  dermasafe-chatbot:latest
```

### Docker Compose Integration

Thêm vào `docker-compose.yml` (root project):

```yaml
services:
  chatbot:
    build: ./chatbot-service
    ports:
      - "8002:8002"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - ALLOW_ORIGINS=http://localhost:5173,http://localhost:3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8002/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Gemini API key (required) | - |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8002` |
| `ALLOW_ORIGINS` | CORS allowed origins | `*` |

### Gemini Settings

Trong `gemini_client.py`, bạn có thể điều chỉnh:

```python
self.generation_config = {
    'temperature': 0.7,      # 0.0-1.0: cao = sáng tạo hơn
    'top_p': 0.9,
    'top_k': 40,
    'max_output_tokens': 800  # Độ dài response tối đa
}
```

---

## 📊 Rate Limits

**Gemini Pro Free Tier:**
- ✅ 60 requests/minute
- ✅ 1,500 requests/day
- ✅ 1,000,000 tokens/day

**Nếu vượt quá:**
- Sẽ nhận error `RESOURCE_EXHAUSTED`
- Chatbot tự động trả lời: "Hệ thống đang quá tải, vui lòng thử lại sau"

**Upgrade lên Paid nếu cần:**
- [Gemini API Pricing](https://ai.google.dev/pricing)

---

## 🎯 Best Practices

### 1. Session ID Management
```javascript
// Frontend: Generate unique session ID per user
import { v4 as uuidv4 } from 'uuid';
const sessionId = uuidv4(); // hoặc dùng user ID
```

### 2. Error Handling
```javascript
try {
  const response = await fetch('/api/v1/chat', {...});
  if (!response.ok) {
    // Handle error
  }
} catch (error) {
  console.error('Chat error:', error);
  // Show user-friendly error message
}
```

### 3. Rate Limiting (Frontend)
```javascript
// Debounce để tránh spam
import { debounce } from 'lodash';
const sendMessage = debounce(async (msg) => {
  // Call API
}, 500);
```

---

## 🔒 Security Considerations

1. **API Key Protection**: Không commit API key vào Git
2. **CORS**: Configure `ALLOW_ORIGINS` cho production
3. **Input Validation**: Message length, content filtering
4. **Rate Limiting**: Implement rate limiter (nginx, FastAPI middleware)
5. **Session Cleanup**: Auto-cleanup old sessions để tránh memory leak

---

## 📈 Monitoring

### Logs
```bash
# Xem logs
docker logs -f chatbot

# Logs level: INFO, DEBUG, ERROR
```

### Metrics to track
- Active sessions count
- Messages per session
- API errors rate
- Response time (P50, P95, P99)
- Gemini API quota usage

---

## 🐛 Troubleshooting

### Lỗi: "API_KEY_INVALID"
```bash
# Kiểm tra API key
echo $GEMINI_API_KEY

# Verify key tại: https://makersuite.google.com/app/apikey
```

### Lỗi: "RESOURCE_EXHAUSTED"
- Đã vượt quá 60 requests/minute
- Đợi 1 phút hoặc upgrade lên paid tier

### Lỗi: Response bị block
- Gemini safety filters đã block response
- Kiểm tra `safety_settings` trong `gemini_client.py`
- Adjust threshold nếu cần

---

## 🚀 Next Steps

- [ ] Add Redis cache cho conversation storage
- [ ] Implement streaming responses (real-time typing effect)
- [ ] Add sentiment analysis (phát hiện user anxiety)
- [ ] Multi-language support (English)
- [ ] Function calling (book appointments)
- [ ] Voice input/output

---

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**🎉 Happy Chatting!**

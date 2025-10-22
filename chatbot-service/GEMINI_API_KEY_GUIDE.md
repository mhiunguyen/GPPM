# 🔑 Hướng dẫn lấy Gemini API Key (MIỄN PHÍ)

## Bước 1: Truy cập Google AI Studio

Mở trình duyệt và truy cập: **https://makersuite.google.com/app/apikey**

Hoặc: **https://aistudio.google.com/app/apikey**

## Bước 2: Đăng nhập Google Account

- Đăng nhập bằng tài khoản Google của bạn
- Chấp nhận Terms of Service

## Bước 3: Tạo API Key

1. Click nút **"Get API key"** hoặc **"Create API key"**
2. Chọn Google Cloud project (hoặc tạo mới)
3. Click **"Create API key in new project"**
4. API key sẽ được tạo ngay lập tức (dạng: `AIzaSy...`)

## Bước 4: Copy API Key

⚠️ **QUAN TRỌNG**: 
- Copy API key và lưu ở nơi an toàn
- Không share API key với ai
- Không commit API key lên Git

## Bước 5: Thêm vào .env

### Cách 1: Thêm vào file .env (Local Development)

```bash
cd chatbot-service
cp .env.example .env
# Edit .env và paste API key
```

**.env:**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
```

### Cách 2: Thêm vào Docker Environment (Docker Deployment)

Tạo file `.env` ở root project:

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
```

Docker Compose sẽ tự động load từ file này.

## Bước 6: Verify API Key

### Test với curl:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

Nếu OK, bạn sẽ thấy list các models (gemini-pro, gemini-pro-vision, etc.)

### Test với chatbot service:

```bash
cd chatbot-service
python test_chatbot.py
```

Nếu thành công, bạn sẽ thấy:
```
✅ Gemini API connection: OK
✅ Gemini response: Xin chào!...
```

## 📊 Free Tier Limits

**Gemini Pro Free Tier:**
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ 1,000,000 tokens per day
- ✅ Không cần thẻ tín dụng

**Đủ cho:**
- Development & testing
- MVP với < 100 users/ngày
- Personal projects

**Nếu cần nhiều hơn:**
- Upgrade lên paid tier tại: https://ai.google.dev/pricing
- Hoặc switch sang OpenAI GPT-4o-mini

## 🔒 Security Best Practices

### ❌ KHÔNG BAO GIỜ:
```javascript
// BAD: Hardcode API key trong code
const apiKey = "AIzaSy..."; 
```

### ✅ LUÔN LUÔN:
```javascript
// GOOD: Dùng environment variables
const apiKey = process.env.GEMINI_API_KEY;
```

### .gitignore (đã có sẵn):
```gitignore
.env
.env.local
.env.*.local
```

## 🐛 Troubleshooting

### Lỗi: "API_KEY_INVALID"
- Kiểm tra lại API key có đúng không
- Đảm bảo không có khoảng trắng thừa
- Thử tạo API key mới

### Lỗi: "API key not valid. Please pass a valid API key."
- API key chưa được activate
- Đợi 5-10 phút sau khi tạo
- Thử refresh browser và tạo lại

### Lỗi: "RESOURCE_EXHAUSTED"
- Đã vượt quá 60 requests/minute
- Đợi 1 phút rồi thử lại
- Hoặc upgrade lên paid tier

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Pricing & Quotas](https://ai.google.dev/pricing)
- [Google AI Studio](https://aistudio.google.com/)
- [API Key Management](https://console.cloud.google.com/apis/credentials)

---

**✅ Xong! Bạn đã sẵn sàng dùng Gemini chatbot.**

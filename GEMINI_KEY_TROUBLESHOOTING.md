# 🔧 Xử lý lỗi Gemini API Key

## ❌ Lỗi hiện tại
```
400 API Key not found. Please pass a valid API key.
[reason: "API_KEY_INVALID"]
```

## ✅ Cách sửa (làm theo từng bước)

### Bước 1: Tạo API Key mới (QUAN TRỌNG)
1. Vào: https://aistudio.google.com/app/apikey
2. Đăng nhập Google Account
3. Click **"Create API Key"** hoặc **"Get API Key"**
4. Chọn **"Create API key in new project"** (khuyến nghị) hoặc chọn project có sẵn
5. Copy key ngay lập tức (dạng: `AIzaSy...` có 39 ký tự)

### Bước 2: Kiểm tra key vừa tạo
- ✅ Key phải bắt đầu bằng `AIza`
- ✅ Độ dài thường là 39 ký tự
- ✅ Không có khoảng trắng, xuống dòng, dấu ngoặc kép
- ⚠️ **LƯU Ý**: Copy trực tiếp từ Google, không qua notepad/editor có thể thêm ký tự lạ

### Bước 3: Cập nhật vào file `.env`
Mở file `/.env` trong thư mục gốc project (nếu chưa có thì tạo):

```bash
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Lưu ý**:
- KHÔNG có dấu ngoặc kép `"` hoặc nháy đơn `'`
- KHÔNG có khoảng trắng trước hoặc sau dấu `=`
- KHÔNG có ký tự xuống dòng thừa ở cuối file

### Bước 4: Khởi động lại chatbot
```bash
cd /workspaces/GPPM
docker-compose up -d --force-recreate chatbot
```

### Bước 5: Kiểm tra log
```bash
docker-compose logs chatbot --tail=30
```

Tìm dòng:
- ✅ `✅ Gemini client initialized successfully` (thành công)
- ❌ `❌ Gemini connection test failed` (thất bại - làm lại từ đầu)

## 🔍 Các vấn đề thường gặp

### 1. Key bị hạn chế (API Restrictions)
- Vào: https://console.cloud.google.com/apis/credentials
- Tìm key vừa tạo
- Chọn **"Edit API key"**
- Phần **"API restrictions"**: chọn **"Don't restrict key"** (để test)
- Save

### 2. Key đã bị revoke
- Vào: https://aistudio.google.com/app/apikey
- Kiểm tra status của key: phải là **Active** (xanh)
- Nếu bị Revoked (đỏ): tạo key mới

### 3. Billing chưa bật (nếu dùng Gemini Pro)
- Gemini API miễn phí có giới hạn quota
- Nếu vượt quota: vào Google Cloud Console bật billing
- Hoặc chờ reset quota (thường 1 phút/request cho free tier)

### 4. Region bị chặn
- Gemini API có thể bị chặn ở một số quốc gia
- Thử dùng VPN đổi sang US/Singapore để test
- Hoặc dùng project Google Cloud có region US

## 🧪 Test nhanh key
Chạy lệnh này để test key trực tiếp (thay `YOUR_KEY`):

```bash
curl -s -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY"
```

Nếu thành công, sẽ trả về JSON có `"candidates"`.
Nếu lỗi, sẽ thấy `"error"` với message cụ thể.

## 📞 Cần trợ giúp thêm?
Nếu làm đúng các bước trên mà vẫn lỗi:
1. Check log chi tiết: `docker-compose logs chatbot -f`
2. Verify key format: `cat .env | grep GEMINI` (không in ra terminal public)
3. Test với key mới hoàn toàn từ account khác (nếu có)

---
**Ghi chú bảo mật**: 
- File `.env` đã được gitignore, an toàn để lưu key
- KHÔNG commit file `.env` lên GitHub
- Revoke key ngay nếu lỡ lộ công khai

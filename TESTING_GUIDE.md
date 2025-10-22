# 🧪 HƯỚNG DẪN TEST SYMPTOM VALIDATION - FULL STACK

## 📋 Tổng quan
Tài liệu này hướng dẫn test feature **Symptom Validation** từ Backend → Frontend end-to-end.

---

## 🚀 BƯỚC 1: Khởi động Services

### Terminal 1 - AI Service (Port 8001)
```bash
cd d:\GPPM-main\ai-service
uvicorn ai_app.main:app --reload --port 8001
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8001
✅ DermatologyAnalyzer đã được khởi tạo thành công
```

---

### Terminal 2 - Backend API (Port 8000)
```bash
cd d:\GPPM-main\backend-api
uvicorn backend_app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

---

### Terminal 3 - Frontend (Port 5173)
```powershell
# PowerShell có execution policy issue, dùng cmd:
cmd /c "cd d:\GPPM-main\frontend && npm run dev"
```

**Expected Output:**
```
VITE v5.4.21  ready in 1519 ms

➜  Local:   http://localhost:5173/
```

---

## ✅ BƯỚC 2: Test Backend API (Manual)

### Test 1: Valid Vietnamese Symptoms
```bash
curl -X POST http://localhost:8000/api/v1/validate-symptoms ^
  -H "Content-Type: application/json" ^
  -d "{\"description\": \"Da toi bi ngua va do\", \"language\": \"vi\"}"
```

**Expected Response:**
```json
{
  "valid": true,
  "symptoms": ["ngứa", "đỏ"],
  "response": "Triệu chứng của bạn có vẻ nhẹ (ngứa, đỏ). Hãy giữ da sạch, tránh gãi và theo dõi thêm nhé! 😊"
}
```

---

### Test 2: Invalid Input (Personality)
```bash
curl -X POST http://localhost:8000/api/v1/validate-symptoms ^
  -H "Content-Type: application/json" ^
  -d "{\"description\": \"Dep trai\", \"language\": \"vi\"}"
```

**Expected Response:**
```json
{
  "valid": false,
  "symptoms": [],
  "response": "Haha, cái này không phải triệu chứng đâu nha 😄, nói rõ hơn về tình trạng da giúp mình được không?"
}
```

---

### Test 3: Invalid Input (Animal Bite)
```bash
curl -X POST http://localhost:8000/api/v1/validate-symptoms ^
  -H "Content-Type: application/json" ^
  -d "{\"description\": \"Meo can em\", \"language\": \"vi\"}"
```

**Expected Response:**
```json
{
  "valid": false,
  "symptoms": [],
  "response": "Ối, bị cún/mèo cắn à? 🐱 Nhưng mình chỉ hỗ trợ chẩn đoán da liễu thôi nha!"
}
```

---

### Test 4: Serious Symptoms
```bash
curl -X POST http://localhost:8000/api/v1/validate-symptoms ^
  -H "Content-Type: application/json" ^
  -d "{\"description\": \"Bi dau, sung to, chay mu vang\", \"language\": \"vi\"}"
```

**Expected Response:**
```json
{
  "valid": true,
  "symptoms": ["đau", "sưng", "vàng", "mủ"],
  "response": "Bạn có vẻ có triệu chứng cần chú ý đấy (đau, sưng, vàng...). Hãy giữ vùng da sạch sẽ và theo dõi thêm nhé! 🩺"
}
```

---

## 🎨 BƯỚC 3: Test Frontend UI

### 1. Mở trình duyệt
```
http://localhost:5173/
```

### 2. Chấp nhận Disclaimer
- Click "Tôi đã hiểu" để vào ứng dụng

### 3. Scroll xuống phần "Thêm mô tả triệu chứng khác"
- Tìm input field với placeholder: "Ví dụ: Da bị ngứa và đỏ, có mụn nước..."

---

## 🧪 Test Cases cho Frontend

### ✅ Test Case 1: Valid Symptoms (Vietnamese)

**Steps:**
1. Nhập: `Da tôi bị ngứa và đỏ`
2. Click button "**+ Thêm**"
3. Quan sát loading state

**Expected Behavior:**
- Button hiển thị: "**⏳ Đang kiểm tra...**"
- Input bị disabled
- Sau ~200ms:
  - ✅ **Green message box** xuất hiện
  - Message: "Triệu chứng của bạn có vẻ nhẹ (ngứa, đỏ). Hãy giữ da sạch..."
  - Tags được thêm: `[ngứa]` `[đỏ]`
  - Input được clear
  - Message tự động biến mất sau 5 giây

**Screenshot:**
```
┌─────────────────────────────────────────────┐
│ 💬 Thêm mô tả triệu chứng khác (mô tả tự do): │
├─────────────────────────────────────────────┤
│ [                                   ] [+ Thêm] │ ← Before
│                                               │
│ [⏳ Đang kiểm tra...               ] [⏳ ...] │ ← Loading
│                                               │
│ ✅ Triệu chứng của bạn có vẻ nhẹ (ngứa, đỏ).  │ ← Success
│    Hãy giữ da sạch, tránh gãi...              │
│                                               │
│ [ngứa] [đỏ]                                   │ ← Tags
└─────────────────────────────────────────────┘
```

---

### ❌ Test Case 2: Invalid - Personality

**Steps:**
1. Nhập: `Đẹp trai`
2. Click "**+ Thêm**"

**Expected Behavior:**
- ⏳ Loading state
- ❌ **Red message box** xuất hiện
- Message: "Haha, cái này không phải triệu chứng đâu nha 😄"
- **NO tags added**
- Input **NOT cleared** (để user sửa)
- Message tự động biến mất sau 5 giây

---

### ❌ Test Case 3: Invalid - Animal

**Steps:**
1. Nhập: `Mèo cắn em`
2. Click "**+ Thêm**"

**Expected Behavior:**
- ❌ Red message
- "Ối, bị cún/mèo cắn à? 🐱 Nhưng mình chỉ hỗ trợ chẩn đoán da liễu thôi nha!"

---

### ❌ Test Case 4: Invalid - Emotion

**Steps:**
1. Nhập: `Buồn quá`
2. Click "**+ Thêm**"

**Expected Behavior:**
- ❌ Red message
- "Cảm xúc của bạn rất quan trọng nhưng mình chỉ hỗ trợ về da liễu thôi 😅"

---

### ⚠️ Test Case 5: Empty Input

**Steps:**
1. Không nhập gì (empty)
2. Click "**+ Thêm**"

**Expected Behavior:**
- ⚠️ **Yellow message box**
- "Vui lòng nhập triệu chứng!"
- Message biến mất sau 3 giây

---

### ✅ Test Case 6: Complex Valid Symptoms

**Steps:**
1. Nhập: `Da bị ngứa nhiều, đỏ ửng, có mụn nước, chảy dịch vàng`
2. Click "**+ Thêm**"

**Expected Behavior:**
- ✅ Green message
- Tags added: `[ngứa]` `[đỏ]` `[nổi mụn]` `[mụn nước]` `[vàng]`
- Response mentions mild/serious symptoms

---

### ✅ Test Case 7: English Input

**Steps:**
1. Switch language to English (flag toggle)
2. Nhập: `My skin is itchy and red`
3. Click "**+ Add**"

**Expected Behavior:**
- ✅ Green message (English)
- Tags: `[ngứa]` `[đỏ]` (vẫn là Vietnamese tags)
- Response: "Your symptoms appear mild..."

---

### 🔄 Test Case 8: Enter Key

**Steps:**
1. Nhập: `Da bị ngứa`
2. Nhấn **Enter** (không click button)

**Expected Behavior:**
- Same as clicking button
- ✅ Validation triggered
- Loading → Success message → Tags added

---

### ⚠️ Test Case 9: API Offline (Fallback)

**Steps:**
1. Stop Backend API (Ctrl+C terminal 2)
2. Nhập: `Da bị ngứa`
3. Click "**+ Thêm**"

**Expected Behavior:**
- ⚠️ Yellow message
- "Đã thêm triệu chứng (chưa validate)"
- Tag added: `[Da bị ngứa]` (raw input, not validated)
- Fallback mode works

---

## 🎯 Checklist

### Backend Tests
- [ ] AI Service running on port 8001
- [ ] Backend API running on port 8000
- [ ] `/validate-symptoms` endpoint returns JSON
- [ ] Valid inputs return `{valid: true, symptoms: [...]}`
- [ ] Invalid inputs return `{valid: false, response: "..."}`

### Frontend Tests
- [ ] Frontend running on port 5173
- [ ] Input field visible with proper placeholder
- [ ] Button shows loading state when validating
- [ ] Green message for valid symptoms
- [ ] Red message for invalid inputs
- [ ] Yellow message for empty/warnings
- [ ] Tags added correctly
- [ ] Input cleared on success
- [ ] Input NOT cleared on error
- [ ] Messages auto-clear after 3-5 seconds
- [ ] Enter key works
- [ ] Disabled state during validation
- [ ] Fallback works when API offline

---

## 🐛 Troubleshooting

### Issue 1: "Failed to fetch"
**Cause:** Backend API not running
**Solution:**
```bash
cd d:\GPPM-main\backend-api
uvicorn backend_app.main:app --reload --port 8000
```

### Issue 2: "AI Service connection error"
**Cause:** AI Service not running
**Solution:**
```bash
cd d:\GPPM-main\ai-service
uvicorn ai_app.main:app --reload --port 8001
```

### Issue 3: PowerShell execution policy error
**Cause:** Windows security policy
**Solution:** Use cmd instead:
```powershell
cmd /c "cd d:\GPPM-main\frontend && npm run dev"
```

### Issue 4: Port already in use
**Cause:** Previous process still running
**Solution:**
```bash
# Find and kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <process_id> /F
```

### Issue 5: CORS error in browser console
**Cause:** Backend CORS not configured
**Solution:** Check `backend-api/backend_app/main.py`:
```python
ALLOW_ORIGINS = "*"  # Should allow localhost:5173
```

---

## 📊 Expected Performance

| Action | Expected Time |
|--------|--------------|
| API call | ~200ms |
| First API call (cold start) | ~500ms |
| UI loading state | 100-500ms |
| Message display | 3-5 seconds |
| Tag addition | Instant |

---

## 📸 Visual Indicators

### Loading State
```
[Input field DISABLED]
[Button: ⏳ Đang kiểm tra...] ← Opacity 50%
```

### Success State
```
┌─────────────────────────────────────────┐
│ ✅ Triệu chứng của bạn có vẻ nhẹ...      │ ← Green background
└─────────────────────────────────────────┘
[ngứa] [đỏ] [sưng] ← Tags with blue border
```

### Error State
```
┌─────────────────────────────────────────┐
│ ❌ Haha, cái này không phải triệu chứng  │ ← Red background
│    đâu nha 😄                           │
└─────────────────────────────────────────┘
```

---

## ✅ Success Criteria

Feature được coi là thành công khi:

1. ✅ **Backend API** responds correctly to all test cases
2. ✅ **Frontend UI** displays all 3 message types (green/red/yellow)
3. ✅ **Valid symptoms** → Tags added + Success message
4. ✅ **Invalid inputs** → Error message + No tags
5. ✅ **Loading states** visible during API call
6. ✅ **Messages auto-clear** after timeout
7. ✅ **Fallback mode** works when API offline
8. ✅ **Enter key** works same as button click
9. ✅ **Responsive** on mobile/desktop
10. ✅ **No console errors** in browser DevTools

---

## 📞 Support

**Backend Code:** `ai-service/ai_app/logic/symptom_validator.py`
**Backend API:** `backend-api/backend_app/main.py`
**Frontend Code:** `frontend/src/components/DermaSafeAI.tsx`
**API Docs:** `docs/SYMPTOM_VALIDATION_API.md`
**Backend Summary:** `SYMPTOM_VALIDATION_SUMMARY.md`
**Frontend Summary:** `FRONTEND_SYMPTOM_VALIDATION.md`

---

**Testing Status:** 🟢 READY FOR QA
**Last Updated:** 2025-10-22
**Tester:** [Your Name]

# 🤖 Tính năng Chatbot Tự Động Giải Thích Kết Quả

## ✨ Tính năng mới

Khi người dùng thực hiện chuẩn đoán thành công, **Chatbot sẽ tự động gửi tin nhắn giải thích chi tiết** về kết quả chuẩn đoán dựa trên thông tin người dùng đã cung cấp.

---

## 🎯 Cách hoạt động

### 1. **Trigger tự động**
- Khi có kết quả chuẩn đoán mới (`analysisContext` được cập nhật)
- Chatbot tự động gửi câu hỏi: 
  - 🇻🇳 "Hãy giải thích chi tiết kết quả chuẩn đoán này cho tôi. Bệnh là gì? Mức độ nghiêm trọng? Tôi nên làm gì?"
  - 🇬🇧 "Please explain this diagnosis result in detail. What is the condition? How serious is it? What should I do?"

### 2. **Thông tin được gửi đến Chatbot AI**
```typescript
{
  risk: "CAO/TRUNG BÌNH/THẤP",
  primary_disease: {
    name: "Tên bệnh tiếng Anh",
    confidence: 0.85, // Độ tin cậy
    description: "Mô tả bệnh"
  },
  alternative_diseases: [...], // Các chẩn đoán khác
  recommendations: {...}, // Khuyến nghị
  clinical_concepts: ["ngứa", "đỏ", ...], // Triệu chứng
  duration: "dưới 1 tuần" // Thời gian xuất hiện
}
```

### 3. **Response từ Chatbot**
- ✅ **Nếu API hoạt động**: Gemini AI sẽ phân tích và giải thích chi tiết dựa trên:
  - Chẩn đoán chính và độ tin cậy
  - Mức độ nguy cơ
  - Triệu chứng người dùng đã chọn
  - Thời gian xuất hiện triệu chứng
  - Các chẩn đoán thay thế
  - Khuyến nghị cụ thể

- ⚠️ **Nếu API lỗi**: Hiển thị thông tin tóm tắt cơ bản:
  ```
  📋 Kết quả chuẩn đoán:
  
  🔍 Chẩn đoán: [Tên bệnh]
  📊 Độ tin cậy: [X]%
  ⚠️ Mức độ nguy cơ: [CAO/TRUNG BÌNH/THẤP]
  🩺 Triệu chứng: [danh sách]
  
  💡 Đây là kết quả phân tích AI để tham khảo...
  ```

---

## 🔧 Các thay đổi kỹ thuật

### **File: `frontend/src/components/ChatBot.tsx`**

#### 1. **Thêm interface mới**
```typescript
interface ChatBotProps {
  analysisContext?: {
    primary_diagnosis?: string;
    confidence?: number;
    risk_level?: string;
    symptoms?: string[];
    duration?: string;              // ✨ Mới
    description?: string;           // ✨ Mới
    recommendations?: any;          // ✨ Mới
    alternative_diagnoses?: any[];  // ✨ Mới
  } | null;
  // ...
}
```

#### 2. **Thêm state tracking**
```typescript
const [hasAutoExplained, setHasAutoExplained] = useState(false);
```
- Đảm bảo chỉ auto-explain **một lần duy nhất** cho mỗi kết quả
- Tránh gửi lại khi component re-render

#### 3. **Thêm useEffect auto-explain**
```typescript
useEffect(() => {
  if (analysisContext && 
      analysisContext.primary_diagnosis && 
      !hasAutoExplained && 
      messages.length > 0) {
    
    // Tự động gửi câu hỏi và nhận giải thích
    // ...
  }
}, [analysisContext, hasAutoExplained, messages.length, language, sessionId]);
```

#### 4. **Enhanced context formatting**
- Gửi đầy đủ `description`, `alternative_diagnoses`, `recommendations`, `duration`
- Chatbot AI có đủ thông tin để giải thích chi tiết

---

### **File: `frontend/src/components/DermaSafeModern.tsx`**

#### **Cập nhật ChatBot props**
```typescript
<ChatBot
  mode="inline"
  analysisContext={result ? {
    primary_diagnosis: result.primary_diagnosis?.disease,
    confidence: result.primary_diagnosis?.confidence,
    risk_level: result.risk_level,
    symptoms: [...symptoms.map(s => viMap[s]), ...customSymptoms],
    duration: duration ? durationMap[duration] : undefined,     // ✨ Mới
    description: result.primary_diagnosis?.description,         // ✨ Mới
    recommendations: result.recommendations,                    // ✨ Mới
    alternative_diagnoses: result.alternative_diagnoses         // ✨ Mới
  } : null}
  language={language}
  className="h-[460px]"
/>
```

---

## 📱 Trải nghiệm người dùng

### **Trước khi có tính năng**
1. User upload ảnh và chọn triệu chứng
2. Nhận kết quả chuẩn đoán
3. Phải **tự gõ câu hỏi** vào chatbot để hỏi về kết quả
4. Chờ AI trả lời

### **Sau khi có tính năng** ✨
1. User upload ảnh và chọn triệu chứng
2. Nhận kết quả chuẩn đoán
3. **Chatbot TỰ ĐỘNG giải thích ngay lập tức** 🚀
4. User đọc giải thích chi tiết mà không cần làm gì thêm
5. User có thể hỏi thêm nếu muốn

---

## 🎨 Ví dụ flow hoàn chỉnh

### **Bước 1: User thực hiện chuẩn đoán**
```
[Upload ảnh]
Triệu chứng: Ngứa, Đỏ
Thời gian: 1-4 tuần
[Nhấn "Phân tích nguy cơ"]
```

### **Bước 2: Kết quả hiển thị**
```
🔴 NGUY CƠ CAO
Chẩn đoán chính: Eczema (Độ tin cậy: 85%)
```

### **Bước 3: Chatbot tự động giải thích**
```
💬 Chatbot: "Hãy giải thích chi tiết kết quả chuẩn đoán..."

🤖 AI Assistant:
"Dựa trên kết quả phân tích:

🔍 Chẩn đoán: Eczema (Viêm da/Chàm)
📊 Độ tin cậy: 85% - khá cao

⚠️ Về mức độ nghiêm trọng:
Đây là tình trạng viêm da mãn tính, không nguy hiểm đến tính mạng 
nhưng cần quản lý để tránh tái phát.

🩺 Triệu chứng của bạn (ngứa, đỏ, kéo dài 1-4 tuần) phù hợp với:
- Giai đoạn cấp tính của eczema
- Da bị kích ứng, viêm

💡 Bạn nên làm gì:
1. Khám bác sĩ da liễu trong 1-2 tuần
2. Giữ ẩm cho da bằng kem dưỡng ẩm
3. Tránh gãi để không làm nặng thêm
4. Có thể cần kem corticosteroid theo toa

📋 Lưu ý: Đây là kết quả AI tham khảo. Hãy đến bác sĩ 
để có chẩn đoán chính xác!"
```

---

## ✅ Ưu điểm

1. **🚀 Trải nghiệm mượt mà hơn**
   - Không cần user phải hỏi
   - Thông tin ngay lập tức

2. **📚 Giải thích đầy đủ hơn**
   - Dựa trên context đầy đủ
   - Bao gồm triệu chứng, thời gian, độ tin cậy

3. **🎯 Cá nhân hóa**
   - AI phân tích dựa trên chính xác thông tin user cung cấp
   - Không phải câu trả lời chung chung

4. **🛡️ Có fallback**
   - Nếu API lỗi vẫn hiển thị thông tin cơ bản
   - Không để user rơi vào trạng thái lỗi

---

## 🔒 Các điểm an toàn

1. **Chỉ trigger một lần**
   - Dùng `hasAutoExplained` flag
   - Không spam messages

2. **Kiểm tra đầy đủ**
   - Chỉ chạy khi có `primary_diagnosis`
   - Đảm bảo messages đã init

3. **Error handling**
   - Try-catch cho API call
   - Fallback message nếu lỗi

4. **Dependency array chính xác**
   - useEffect có đầy đủ dependencies
   - Tránh infinite loop

---

## 🧪 Testing

### **Test case 1: Chuẩn đoán thành công**
1. Upload ảnh + chọn triệu chứng
2. ✅ Chatbot tự động giải thích
3. ✅ Chỉ giải thích 1 lần

### **Test case 2: API lỗi**
1. Tắt chatbot service
2. Upload ảnh + chọn triệu chứng
3. ✅ Hiển thị fallback message với thông tin cơ bản

### **Test case 3: Chuẩn đoán lại**
1. Chuẩn đoán lần 1 → auto explain
2. Chuẩn đoán lần 2 với ảnh/triệu chứng khác
3. ✅ Auto explain lại với context mới

### **Test case 4: Đổi ngôn ngữ**
1. Chuẩn đoán bằng tiếng Việt → auto explain VI
2. Đổi sang English
3. Chuẩn đoán lại → auto explain EN

---

## 🚀 Deployment

```bash
# Build và restart frontend
cd /workspaces/GPPM
docker-compose build frontend
docker-compose restart frontend
```

Frontend sẵn sàng tại: **http://localhost:5173/**

---

## 📝 Notes

- Tính năng yêu cầu **chatbot-service** phải running và có `GEMINI_API_KEY` hợp lệ
- Nếu chatbot service down, vẫn hiển thị fallback information
- Auto-explain chỉ trigger khi `analysisContext` thay đổi (có kết quả mới)

---

**Ngày tạo**: 2025-10-23  
**Trạng thái**: ✅ Hoàn thành & Deployed

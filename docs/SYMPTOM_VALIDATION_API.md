# 🩺 DermaSafeAI - Symptom Validation API

## Tổng quan

Feature mới này cho phép người dùng nhập **mô tả triệu chứng tự do** (free text) và hệ thống sẽ:
1. ✅ Kiểm tra xem đó có phải là triệu chứng da liễu hợp lệ không
2. 📝 Trích xuất các triệu chứng chuẩn hóa
3. 💬 Trả về câu tư vấn nhẹ nhàng

## Endpoints

### POST `/api/v1/validate-symptoms`

**Backend API Endpoint:**
```
http://localhost:8000/api/v1/validate-symptoms
```

**AI Service Endpoint (internal):**
```
http://localhost:8001/validate-symptoms
```

### Request Body

```json
{
  "description": "Da tôi bị ngứa và đỏ",
  "language": "vi"
}
```

**Parameters:**
- `description` (string, required): Mô tả triệu chứng của người dùng
- `language` (string, optional): Ngôn ngữ (`vi` hoặc `en`), mặc định là `vi`

### Response

#### Trường hợp hợp lệ (Valid Symptoms)

```json
{
  "valid": true,
  "symptoms": ["ngứa", "đỏ"],
  "response": "Triệu chứng của bạn có vẻ nhẹ (ngứa, đỏ). Hãy giữ da sạch, tránh gãi và theo dõi thêm nhé! 😊"
}
```

#### Trường hợp không hợp lệ (Invalid Input)

```json
{
  "valid": false,
  "symptoms": [],
  "response": "Haha, cái này không phải triệu chứng đâu nha 😄, nói rõ hơn về tình trạng da giúp mình được không?"
}
```

## Logic Validation

### Valid Symptoms (Hợp lệ)
Hệ thống nhận diện **47+ loại triệu chứng** da liễu, bao gồm:

**Triệu chứng chính:**
- Ngứa, đỏ, sưng, đau
- Nổi mụn, vảy, khô, chảy nước

**Hình dáng tổn thương:**
- Nốt, mảng, mụn nước, vết loét

**Màu sắc:**
- Trắng, nâu, đen, vàng

**Cảm giác:**
- Rát, châm chích, tê

**Tiết dịch:**
- Mủ, máu

**Triệu chứng toàn thân:**
- Sốt, mệt mỏi

### Invalid Inputs (Không hợp lệ)

Hệ thống từ chối các input không liên quan:
- Tính cách/cảm xúc: "đẹp trai", "buồn quá"
- Động vật: "mèo cắn", "chó cắn"
- Tên bệnh: "ung thư", "melanoma" (không cho phép tự chẩn đoán)
- Câu hỏi chung: "là gì?", "ở đâu?"

## Response Strategy

### 1. Triệu chứng nghiêm trọng
Khi phát hiện: đau, sưng, chảy mủ, máu, sốt...

**Response:**
```
"Bạn có vẻ có triệu chứng cần chú ý đấy (đau, sưng, mủ...). 
Hãy giữ vùng da sạch sẽ và theo dõi thêm nhé! 🩺"
```

### 2. Triệu chứng nhẹ
Khi phát hiện: ngứa, đỏ, khô, vảy...

**Response:**
```
"Triệu chứng của bạn có vẻ nhẹ (ngứa, đỏ). 
Hãy giữ da sạch, tránh gãi và theo dõi thêm nhé! 😊"
```

### 3. Input không hợp lệ

**Ví dụ responses:**
- "Đẹp trai" → "Haha, cái này không phải triệu chứng đâu nha 😄"
- "Mèo cắn" → "Ối, bị cún/mèo cắn à? 🐱 Nhưng mình chỉ hỗ trợ chẩn đoán da liễu thôi nha!"
- "Buồn quá" → "Cảm xúc của bạn rất quan trọng nhưng mình chỉ hỗ trợ về da liễu thôi 😅"

## Testing

### Chạy Unit Tests

```bash
cd ai-service
pytest tests/test_symptom_validator.py -v
```

### Test Coverage

File test bao gồm:
- ✅ Test normalize text
- ✅ Test validation logic
- ✅ Test symptom extraction
- ✅ Test valid/invalid cases
- ✅ Test Vietnamese/English responses
- ✅ Test edge cases

### Manual Testing với cURL

#### Test valid symptom (Vietnamese)
```bash
curl -X POST http://localhost:8000/api/v1/validate-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Da tôi bị ngứa và đỏ",
    "language": "vi"
  }'
```

#### Test valid symptom (English)
```bash
curl -X POST http://localhost:8000/api/v1/validate-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "description": "My skin is itchy and red",
    "language": "en"
  }'
```

#### Test invalid input
```bash
curl -X POST http://localhost:8000/api/v1/validate-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Đẹp trai",
    "language": "vi"
  }'
```

## Integration với Frontend

### Example Usage

```typescript
async function validateSymptoms(description: string, language: string = 'vi') {
  const response = await fetch('http://localhost:8000/api/v1/validate-symptoms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description,
      language,
    }),
  });
  
  const result = await response.json();
  return result;
}

// Usage
const result = await validateSymptoms("Da bị ngứa và đỏ");
if (result.valid) {
  console.log("Triệu chứng:", result.symptoms);
  console.log("Tư vấn:", result.response);
} else {
  console.log("Invalid:", result.response);
}
```

### React Component Example

```tsx
const [symptomInput, setSymptomInput] = useState('');
const [validationResult, setValidationResult] = useState(null);

const handleValidate = async () => {
  const result = await fetch('/api/v1/validate-symptoms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: symptomInput,
      language: i18n.language,
    }),
  }).then(r => r.json());
  
  setValidationResult(result);
  
  if (result.valid) {
    // Thêm triệu chứng vào danh sách selected
    addSymptoms(result.symptoms);
  } else {
    // Hiển thị thông báo vui nhộn
    alert(result.response);
  }
};
```

## File Structure

```
ai-service/
├── ai_app/
│   ├── logic/
│   │   └── symptom_validator.py      # Logic chính
│   ├── main.py                        # Endpoint /validate-symptoms
│   └── schemas.py                     # SymptomValidationRequest/Result
└── tests/
    └── test_symptom_validator.py      # Unit tests

backend-api/
├── backend_app/
│   ├── main.py                        # Proxy endpoint
│   └── schemas.py                     # Schema definitions
```

## Troubleshooting

### Issue: Import error "pydantic could not be resolved"
**Solution:** Đây là lint error, không ảnh hưởng runtime. Chạy bình thường.

### Issue: AI Service không khởi động
**Solution:**
```bash
cd ai-service
pip install -r requirements-cpu.txt
uvicorn ai_app.main:app --reload --port 8001
```

### Issue: Backend không kết nối được AI Service
**Solution:** Kiểm tra `AI_SERVICE_URL` environment variable:
```bash
export AI_SERVICE_URL=http://localhost:8001
```

## Next Steps

1. ✅ **Đã hoàn thành:** Backend logic + endpoints
2. 🔄 **Tiếp theo:** Tích hợp vào frontend component
3. 📱 **Tương lai:** Cải thiện AI với ML model để extract triệu chứng chính xác hơn

## Contributors

Developed for DermaSafeAI project 🩺✨

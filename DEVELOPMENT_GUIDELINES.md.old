# 📖 Hướng dẫn Phát triển & Triết lý Dự án (DermaSafe-AI)

## 1. Triết lý Cốt lõi (Core Philosophy)

Tài liệu này là chỉ thị bắt buộc cho toàn bộ quá trình phát triển dự án.

### 1.1. Mục tiêu: Sàng lọc Rủi ro, KHÔNG Chẩn đoán

Đây là nguyên tắc quan trọng nhất. Dự án này **KHÔNG** phải là một công cụ chẩn đoán y tế. Chúng ta **KHÔNG** cạnh tranh với **Google Derm Assist**.

* **Google Derm Assist:** Cố gắng chẩn đoán (ví dụ: "Bạn bị Viêm da X"). Đây là Thiết bị Y tế, phức tạp về pháp lý và kỹ thuật.
* **DermaSafe-AI (Chúng ta):** Cung cấp **Sàng lọc Rủi ro (Triage)**. Mục tiêu duy nhất của chúng ta là trả lời câu hỏi "Bạn có nên đi khám bác sĩ không?" bằng cách phân loại rủi ro thành 3 cấp: **Cao / Trung bình / Thấp**.

Mọi gợi ý code, thiết kế, và quyết định kỹ thuật **PHẢI** tuân thủ 3 nguyên tắc sau:

1.  **An toàn (Safety First):** Ưu tiên tuyệt đối là không bỏ sót ca nguy hiểm (thà báo nhầm còn hơn bỏ sót). Logic AI phải hoàn toàn minh bạch và giải thích được 100% (sử dụng Rules-Based Engine).
2.  **Tốc độ (Speed):** Trải nghiệm người dùng phải nhanh chóng. **PHẢI** ưu tiên các mô hình AI gọn nhẹ (lightweight) và kiến trúc phản hồi nhanh.
3.  **Đơn giản (Simplicity):** Tập trung hoàn thành MVP (Sản phẩm Khả thi Tối thiểu). Loại bỏ mọi sự phức tạp không cần thiết (ví dụ: không dùng NLP văn bản tự do, không cần tính năng theo dõi ở giai đoạn này).

## 2. Kiến trúc Hệ thống (System Architecture)

Dự án **PHẢI** được xây dựng theo kiến trúc **Microservices**. Điều này đảm bảo các thành phần được phân tách rõ ràng, dễ bảo trì và nâng cấp độc lập.



* **Service 1: Frontend (Web App)**
    * **Công nghệ:** **React.js**, **Vue.js**, hoặc Svelte (ưu tiên nền tảng web).
    * **Nhiệm vụ:** Xây dựng toàn bộ giao diện người dùng, xử lý việc thu thập dữ liệu (ảnh, checkboxes) và hiển thị kết quả.

* **Service 2: Backend-API (Service nghiệp vụ)**
    * **Công nghệ:** **Python**, **FastAPI**.
    * **Cơ sở dữ liệu:** **PostgreSQL**.
    * **Nhiệm vụ:** Đóng vai trò là cổng API (API Gateway) và bộ điều phối (Orchestrator). Nó xử lý các yêu cầu từ Frontend, (tùy chọn) quản lý CSDL (nếu mở rộng tính năng người dùng), và là thành phần duy nhất được phép giao tiếp với AI-Service.

* **Service 3: AI-Service (Service AI)**
    * **Công nghệ:** **Python**, **FastAPI**, **PyTorch** hoặc **TensorFlow**.
    * **Nhiệm vụ:** Chuyên trách host và chạy các mô hình AI. Nó chỉ chấp nhận các yêu cầu nội bộ (internal requests) từ Backend-API.

## 3. Quy tắc Triển khai Chi tiết

### 3.1. Frontend (Web App)

* **Nền tảng:** **PHẢI** là một ứng dụng web (Web App).
* **Luồng người dùng:**
    1.  Tập trung vào luồng phân tích một lần (không yêu cầu đăng nhập cho MVP).
    2.  Hỗ trợ chức năng **Tải ảnh lên (Upload)**.
* **Thu thập triệu chứng:**
    * **QUAN TRỌNG:** **KHÔNG ĐƯỢC** sử dụng hộp văn bản tự do (free-text input) cho triệu chứng.
    * **PHẢI** sử dụng các thành phần giao diện có cấu trúc như **Checkboxes (ô kiểm)** và **Dropdowns (menu thả xuống)** để người dùng chọn triệu chứng (ví dụ: `[ ] Ngứa`, `[ ] Đau`, `[ ] Lan rộng`, `Thời gian: [ < 1 tuần ]`).
* **An toàn & Miễn trừ Trách nhiệm:**
    1.  **Chủ động (Active):** Khi người dùng lần đầu truy cập, một modal (cửa sổ pop-up) **PHẢI** hiển thị. Người dùng **PHẢI** tick vào ô "Tôi hiểu đây không phải là chẩn đoán y tế" mới được phép tiếp tục sử dụng.
    2.  **Bị động (Passive):** Một tuyên bố miễn trừ trách nhiệm y tế **PHẢI** luôn luôn hiển thị ở chân trang (footer) của mọi trang.

### 3.2. Backend-API

* **Vai trò:** Bộ điều phối (Orchestrator).
* **Luồng logic:**
    1.  Nhận yêu cầu HTTP (gồm file ảnh và dữ liệu JSON của các triệu chứng đã chọn) từ Frontend.
    2.  Xác thực yêu cầu.
    3.  Gọi (call) đến endpoint nội bộ của AI-Service, chuyển tiếp ảnh và JSON.
    4.  Chờ AI-Service xử lý và trả về kết quả (JSON chứa Rủi ro và Lý do).
    5.  Trả kết quả cuối cùng này về cho Frontend.
* **Cơ sở dữ liệu:**
    * Trong MVP, CSDL (PostgreSQL) có thể chỉ dùng để ghi log.
    * Tuy nhiên, thiết kế schema **PHẢI** sẵn sàng để mở rộng cho tính năng người dùng (ví dụ: bảng `Users`, bảng `AnalysisHistory` có khóa ngoại `user_id`), ngay cả khi chưa dùng đến.

### 3.3. AI-Service

* **Hosting mô hình (Model Serving):**
    * **PHẢI** host mô hình AI trực tiếp trong ứng dụng FastAPI.
    * **Cách làm:** Tải file mô hình (ví dụ: `.pth`, `.h5`, hoặc `.onnx`) vào bộ nhớ khi máy chủ FastAPI khởi động.
    * **TRÁNH:** Không sử dụng các hệ thống hosting phức tạp như TensorFlow Serving (TFX), TorchServe, hay NVIDIA Triton. Sự đơn giản và tốc độ là ưu tiên.

## 4. Logic AI: "Bộ não" chi tiết

Đây là logic cốt lõi bên trong AI-Service.

### Module 1: Computer Vision (CV)

* **Nhiệm vụ:** Phân tích hình ảnh được tải lên.
* **Mô hình (Ưu tiên Tốc độ):**
    * **PHẢI SỬ DỤNG:** **MobileNetV3** (ưu tiên số 1) hoặc **EfficientNetV2-B0/S**.
    * **TRÁNH:** Không sử dụng các mô hình nặng và chậm (ví dụ: ResNet50, VGG, Vision Transformer).
* **Chiến lược (Phân loại Đa lớp):**
    * Mô hình **PHẢI** được huấn luyện (fine-tuned) trên dữ liệu da liễu (ISIC, DermNet) cho tác vụ **Phân loại Đa lớp (Multi-class Classification)**.
    * Lớp đầu ra (output layer) của mô hình **PHẢI** là một `Softmax`.
    * Đầu ra của module này là một vector xác suất cho các lớp đã định nghĩa (ví dụ: `{"melanoma": 0.15, "nevus": 0.70, "eczema": 0.15, ...}`).

### Module 2: Xử lý Triệu chứng (Symptoms Processor)

* **Nhiệm vụ:** Chuẩn hóa đầu vào triệu chứng.
* **QUY TẮC QUAN TRỌNG:** **KHÔNG SỬ DỤNG NLP (Xử lý ngôn ngữ tự nhiên).**
* **Cách làm:** Module này chỉ đơn giản là phân tích (parse) đối tượng JSON được gửi từ Frontend (dựa trên các checkboxes). Nó không cần xử lý văn bản tự do.
    * Đầu vào ví dụ: `{"symptoms_selected": ["ngứa", "lan rộng"], "duration": "1-2 tuần"}`

### Module 3: Decision Engine (Bộ não Quyết định)

* **Nhiệm vụ:** Kết hợp kết quả từ Module 1 (CV) và Module 2 (Symptoms) để đưa ra phán quyết cuối cùng.
* **QUY TẮC QUAN TRỌNG:** **CHỈ ĐƯỢC PHÉP SỬ DỤNG HỆ THỐNG DỰA TRÊN LUẬT (Rules-Based Engine).**
* **Cách làm:** Logic **PHẢI** là một chuỗi các câu lệnh `IF / ELIF / ELSE` rõ ràng, minh bạch, dễ đọc và dễ kiểm toán (audit).
* **TRÁNH:** Không được phép sử dụng bất kỳ mô hình AI nào khác (như XGBoost, Random Forest, hay mô hình đa phương thức) cho module này.
* **Logic ưu tiên (Ví dụ về luồng logic):**
    1.  **Kiểm tra Ưu tiên 1 (Cờ đỏ từ triệu chứng):** Luôn kiểm tra các triệu chứng nguy hiểm trước.
        * `IF` triệu chứng có chứa "chảy máu" HOẶC "lan rộng rất nhanh" HOẶC "đau nhức dữ dội"
        * `THEN` trả về `{"risk": "CAO 🔴", "reason": "Phát hiện triệu chứng nghiêm trọng."}`
    2.  **Kiểm tra Ưu tiên 2 (Cờ đỏ từ CV):**
        * `ELIF` xác suất `melanoma` (từ CV) > 0.3 (một ngưỡng an toàn cao)
        * `THEN` trả về `{"risk": "CAO 🔴", "reason": "Hình ảnh có đặc điểm của tổn thương ác tính."}`
    3.  **Kiểm tra Ưu tiên 3 (Cờ vàng - Kết hợp):**
        * `ELIF` xác suất `melanoma` > 0.1 VÀ triệu chứng là "mới xuất hiện"
        * `THEN` trả về `{"risk": "TRUNG BÌNH 🟡", "reason": "Phát hiện nốt ruồi mới xuất hiện có đặc điểm đáng ngờ."}`
        * `ELIF` xác suất `eczema` > 0.6 VÀ triệu chứng có "ngứa"
        * `THEN` trả về `{"risk": "TRUNG BÌNH 🟡", "reason": "Các triệu chứng và hình ảnh tương đồng với viêm da/chàm."}`
    4.  **Kiểm tra Mặc định (Cờ xanh):**
        * `ELSE` (cho tất cả các trường hợp còn lại)
        * `THEN` trả về `{"risk": "THẤP 🟢", "reason": "Các đặc điểm tương tự với tình trạng da thông thường."}`

* **Giải thích (Explainability):**
    * Đầu ra cuối cùng của AI-Service trả về cho Backend-API **PHẢI** là một đối tượng JSON chứa cả mức độ rủi ro VÀ lý do (dưới dạng một chuỗi văn bản đơn giản, được định nghĩa sẵn trong bộ luật như trên).
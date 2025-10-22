Dưới đây là danh sách công việc (To-do list) chi tiết cho dự án **DermaSafe-AI**, đã loại bỏ các ước tính về thời gian, tập trung vào các giai đoạn và hạng mục công việc.

---

## 🗺️ Lộ trình Phát triển DermaSafe-AI

### Giai đoạn 0: Thiết lập & Nền tảng 🏗️

Mục tiêu: Tạo môi trường làm việc, kho mã nguồn, và các tài liệu cốt lõi.

* [ ] **Kho mã nguồn (Repository):**
    * [ ] Tạo kho mã nguồn mới trên GitHub (ví dụ: `derma-safe-ai`).
    * [ ] Đặt kho mã nguồn ở chế độ công khai (Public).
* [ ] **Tài liệu Dự án:**
    * [ ] Tạo tệp `LICENSE` (Chọn MIT hoặc Apache 2.0).
    * [ ] Tạo tệp `README.md` (Sử dụng nội dung chi tiết đã tạo).
    * [ ] Tạo tệp `DEVELOPMENT_GUIDELINES.md` (Sử dụng tệp chi tiết đã tạo cho Copilot).
    * [ ] Tạo tệp `.gitignore` (bao gồm các quy tắc cho Python, Node.js, và các tệp hệ điều hành).
* [ ] **Cấu trúc Thư mục (Monorepo):**
    * [ ] Tạo các thư mục gốc: `/frontend`, `/backend-api`, `/ai-service`.
    * [ ] Tạo thư mục `/docs` (để chứa các sơ đồ kiến trúc, tài liệu).
* [ ] **Docker & Môi trường:**
    * [ ] Tạo tệp `docker-compose.yml` ở thư mục gốc, định nghĩa 3 services (frontend, backend, ai) và một service `postgres` (cho CSDL).
    * [ ] Tạo các tệp `.env.example` cho `backend-api` và `ai-service`.
* [ ] **Tích hợp Liên tục (CI):**
    * [ ] Thiết lập GitHub Actions trong `/.github/workflows/`.
    * [ ] Tạo workflow `ci-backend.yml` (chạy linter `black` và `pytest` cho `/backend-api`).
    * [ ] Tạo workflow `ci-ai-service.yml` (chạy `black` và `pytest` cho `/ai-service`).
    * [ ] Tạo workflow `ci-frontend.yml` (chạy linter `eslint` và `npm test` cho `/frontend`).

---

### Giai đoạn 1: AI-Service (MVP) 🧠

Mục tiêu: Xây dựng "bộ não" có thể nhận ảnh + triệu chứng và trả về rủi ro.

* [ ] **Module 1 (CV): Huấn luyện Mô hình:**
    * [ ] Thu thập dữ liệu: Tải bộ dữ liệu ISIC (cho nốt ruồi) và DermNet (bệnh phổ thông).
    * [ ] Định nghĩa các Lớp (Classes): Quyết định các lớp đầu ra cuối cùng (ví dụ: `melanoma`, `nevus`, `eczema`, `acne`, `normal_skin`).
    * [ ] Viết kịch bản Tiền xử lý (Preprocessing): Tải ảnh, thay đổi kích thước, chuẩn hóa (normalize) và tăng cường dữ liệu (augmentation).
    * [ ] Viết kịch bản Huấn luyện (Training): Fine-tune mô hình **MobileNetV3** (hoặc **EfficientNetV2-B0/S**) trên dữ liệu đã chuẩn bị.
    * [ ] Đánh giá mô hình: Tập trung tối ưu **Recall (độ nhạy)** cho các lớp nguy hiểm (ví dụ: `melanoma`).
    * [ ] Lưu mô hình: Xuất file mô hình đã huấn luyện (ví dụ: `model.pth` hoặc `model.h5`).
* [ ] **Module 2 (Symptoms): Định nghĩa Dữ liệu:**
    * [ ] Hoàn thiện cấu trúc JSON: Định nghĩa chính xác các `key` và `value` mà Frontend sẽ gửi (ví dụ: `symptoms_selected: ["ngứa", "lan rộng"]`, `duration: "1-2 tuần"`).
* [ ] **Module 3 (Decision Engine): Xây dựng Logic:**
    * [ ] Viết bộ luật: Mã hóa **Hệ thống Dựa trên Luật (Rules-Based Engine)** bằng logic `IF-THEN-ELSE` trong một hàm Python.
* [ ] **Phát triển API (FastAPI):**
    * [ ] Khởi tạo ứng dụng FastAPI trong `/ai-service`.
    * [ ] Viết `Dockerfile` cho `ai-service`.
    * [ ] Viết mã để tải mô hình CV đã lưu khi máy chủ khởi động.
    * [ ] Tạo endpoint nội bộ (ví dụ: `/analyze`):
        * [ ] Nhận (file ảnh, JSON triệu chứng) từ Backend-API.
        * [ ] Chạy Module 1 (CV) trên ảnh.
        * [ ] Chạy Module 3 (Decision Engine) với kết quả CV và JSON triệu chứng.
        * [ ] Trả về JSON kết quả cuối cùng: `{"risk": "...", "reason": "..."}`.
    * [ ] Viết Unit Tests (pytest) cho endpoint `/analyze`.

---

### Giai đoạn 2: Backend-API (MVP) ⚙️

Mục tiêu: Xây dựng cổng API kết nối Frontend và AI-Service.

* [ ] **Khởi tạo Dịch vụ:**
    * [ ] Khởi tạo ứng dụng FastAPI trong `/backend-api`.
    * [ ] Viết `Dockerfile` cho `backend-api`.
    * [ ] Cấu hình `docker-compose.yml` để liên kết `backend-api` với CSDL `postgres`.
* [ ] **Cơ sở dữ liệu (PostgreSQL):**
    * [ ] Định nghĩa models (SQLAlchemy/ORM) cho `AnalysisRecord` (để ghi log các lần phân tích) và `User` (chuẩn bị cho tương lai).
    * [ ] Viết script khởi tạo (migration) CSDL.
* [ ] **Phát triển API (FastAPI):**
    * [ ] Tạo endpoint công khai `/api/v1/analyze`:
        * [ ] Nhận (file ảnh, JSON triệu chứng) từ Frontend.
        * [ ] **Quan trọng:** Gọi đến endpoint `/analyze` nội bộ của `ai-service` (giao tiếp service-to-service).
        * [ ] Nhận kết quả `{"risk": "...", "reason": "..."}` từ `ai-service`.
        * [ ] (Khuyến nghị) Ghi log kết quả (ẩn danh) vào bảng `AnalysisRecord`.
        * [ ] Trả JSON kết quả cuối cùng về cho Frontend.
    * [ ] Đảm bảo tài liệu API (`/docs`) rõ ràng.
    * [ ] Viết Unit Tests (pytest) cho endpoint `/api/v1/analyze`.

---

### Giai đoạn 3: Frontend (MVP) 🖥️

Mục tiêu: Xây dựng giao diện người dùng hoàn chỉnh.

* [ ] **Khởi tạo Dịch vụ:**
    * [ ] Khởi tạo ứng dụng Web (React/Vue) trong `/frontend`.
    * [ ] Viết `Dockerfile` cho `frontend` (sử dụng NGINX multi-stage build).
* [ ] **Xây dựng Giao diện (UI Components):**
    * [ ] `DisclaimerModal`: Cửa sổ pop-up (chủ động) yêu cầu người dùng đồng ý điều khoản.
    * [ ] `ImageUploader`: Thành phần cho phép kéo-thả hoặc chọn tệp ảnh, có xem trước (preview).
    * [ ] `SymptomSelector`: Form chứa tất cả các **checkboxes** và **dropdowns** (dựa trên cấu trúc JSON đã định nghĩa ở Giai đoạn 1).
    * [ ] `ResultCard`: Thẻ hiển thị kết quả (ví dụ: "CAO 🔴") và lý do (`reason`).
    * [ ] `Footer`: Chứa tuyên bố miễn trừ trách nhiệm (bị động).
* [ ] **Xây dựng Logic (App Logic):**
    * [ ] Hiển thị `DisclaimerModal` khi truy cập lần đầu.
    * [ ] Quản lý trạng thái (state) của ảnh đã tải lên và các triệu chứng đã chọn.
    * [ ] Xử lý sự kiện "Analyze":
        * [ ] Hiển thị trạng thái tải (loading spinner).
        * [ ] Gửi yêu cầu (dạng `FormData` chứa ảnh và JSON) đến `/api/v1/analyze` của Backend-API.
        * [ ] Xử lý lỗi (nếu API thất bại).
        * [ ] Ẩn trạng thái tải và hiển thị `ResultCard` với dữ liệu trả về.

---

### Giai đoạn 4: Tích hợp & Kiểm thử E2E 🔗

Mục tiêu: Đảm bảo toàn bộ hệ thống hoạt động trơn tru.

* [ ] **Kiểm thử Nội bộ:**
    * [ ] Chạy toàn bộ hệ thống bằng `docker-compose up --build`.
    * [ ] Mở trình duyệt và truy cập `http://localhost:[PORT_FRONTEND]`.
* [ ] **Kiểm thử Luồng đầy đủ (End-to-End Test):**
    * [ ] Test Luồng 1 (Nguy cơ Cao):
        * [ ] Tải ảnh nốt ruồi ác tính (từ bộ ISIC).
        * [ ] Chọn triệu chứng "Chảy máu" hoặc "Lan rộng".
        * [ ] Nhấn "Analyze" -> Xác nhận kết quả là **"CAO 🔴"** và lý do chính xác.
    * [ ] Test Luồng 2 (Nguy cơ Thấp):
        * [ ] Tải ảnh da bình thường.
        * [ ] Không chọn triệu chứng nào.
        * [ ] Nhấn "Analyze" -> Xác nhận kết quả là **"THẤP 🟢"**.
    * [ ] Test Luồng 3 (Nguy cơ Trung bình):
        * [ ] Tải ảnh chàm (eczema).
        * [ ] Chọn triệu chứng "Ngứa".
        * [ ] Nhấn "Analyze" -> Xác nhận kết quả là **"TRUNG BÌNH 🟡"**.
    * [ ] Test các trường hợp lỗi (tải file không phải ảnh, không chọn triệu chứng...).
* [ ] **(Tùy chọn)** Viết kịch bản kiểm thử E2E tự động (dùng Cypress hoặc Playwright).

---

### Giai đoạn 5: Triển khai & Ra mắt (MVP) 🚀

Mục tiêu: Đưa dự án lên môi trường production.

* [ ] **Chuẩn bị Môi trường:**
    * [ ] Chọn nhà cung cấp đám mây (ví dụ: DigitalOcean, Google Cloud Run, Vultr...).
    * [ ] Tạo một CSDL PostgreSQL được quản lý (Managed Database).
    * [ ] Tạo máy chủ (VM/Droplet) hoặc dịch vụ container.
* [ ] **Cấu hình Production:**
    * [ ] Tạo các tệp `.env.production` cho `backend-api` và `ai-service` (chứa thông tin CSDL thật, secret keys...).
* [ ] **Triển khai:**
    * [ ] Cài đặt Docker và Docker Compose trên máy chủ.
    * [ ] Sao chép mã nguồn và chạy `docker-compose -f docker-compose.prod.yml up -d --build` (sử dụng tệp cấu hình production).
    * [ ] (Khuyến nghị) Cấu hình NGINX reverse proxy để xử lý tên miền và SSL.
* [ ] **Hoàn tất:**
    * [ ] Trỏ tên miền (DNS) về IP máy chủ.
    * [ ] Cài đặt chứng chỉ SSL (Let's Encrypt).
    * [ ] Kiểm tra lần cuối trên tên miền chính thức.
    * [ ] Công bố dự án!

---

### Giai đoạn 6: Lộ trình Tương lai (Post-MVP) 🗺️

Các công việc này sẽ được đưa vào backlog để phát triển sau khi MVP thành công.

* [ ] **Tính năng Người dùng:**
    * [ ] Triển khai đăng ký / đăng nhập đầy đủ.
    * [ ] Xây dựng tính năng "Lịch sử Phân tích" cho người dùng đã đăng nhập.
* [ ] **Cải tiến AI:**
    * [ ] Thu thập thêm dữ liệu và huấn luyện lại mô hình CV cho nhiều lớp bệnh hơn.
    * [ ] Nâng cấp Decision Engine (Module 3) từ bộ luật (Rules) sang một mô hình meta (ví dụ: XGBoost) để có phán đoán tinh vi hơn.
* [ ] **Tính năng Nâng cao:**
    * [ ] Cho phép người dùng theo dõi một tổn thương cụ thể theo thời gian (tải nhiều ảnh cho cùng một vấn đề).
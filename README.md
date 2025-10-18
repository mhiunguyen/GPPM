# DermaSafe-AI

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/TEN_CUA_BAN/derma-safe-ai/ci.yml)
![License](https://img.shields.io/github/license/TEN_CUA_BAN/derma-safe-ai)
![Issues](https://img.shields.io/github/issues/TEN_CUA_BAN/derma-safe-ai)

**Một công cụ sàng lọc rủi ro da liễu nguồn mở, dựa trên AI, ưu tiên sự an toàn và minh bạch.**

---

> ## ⚠️ CẢNH BÁO QUAN TRỌNG VÀ MIỄN TRỪ TRÁCH NHIỆM Y TẾ
>
> **DermaSafe-AI KHÔNG PHẢI LÀ BÁC SĨ.** Đây **KHÔNG** phải là một công cụ chẩn đoán y tế.
>
> Mục tiêu duy nhất của dự án này là **SÀNG LỌC RỦI RO (Triage)** - giúp bạn đưa ra quyết định có nên đi khám bác sĩ hay không dựa trên các dấu hiệu phổ biến. Kết quả của AI không bao giờ thay thế ý kiến, chẩn đoán, hoặc điều trị của một chuyên gia y tế đã qua đào tạo.
>
> **Luôn luôn tham vấn bác sĩ da liễu của bạn để có chẩn đoán chính xác.**

---

## 🚀 Giới thiệu (About This Project)

### Vấn đề
Nhiều người cảm thấy lo lắng khi phát hiện một vấn đề về da (như nốt ruồi mới, vết mẩn...) nhưng lại ngần ngại đi khám bác sĩ. Các công cụ tìm kiếm thường đưa ra những kết quả đáng sợ và không đáng tin cậy.

### Giải pháp
**DermaSafe-AI** là một ứng dụng web đơn giản, nhanh chóng và an toàn. Thay vì cố gắng chẩn đoán bạn bị bệnh gì, dự án này chỉ tập trung vào một câu hỏi: **"Mức độ rủi ro của bạn là gì?"**

Người dùng tải lên một hình ảnh và chọn các triệu chứng của họ từ một danh sách có sẵn. Hệ thống AI của chúng tôi sẽ phân tích dữ liệu và trả về 1 trong 3 cấp độ rủi ro:

* **CAO 🔴:** Bạn nên đi khám bác sĩ ngay lập tức.
* **TRUNG BÌNH 🟡:** Bạn nên theo dõi cẩn thận và sắp xếp lịch đi khám.
* **THẤP 🟢:** Có vẻ là tình trạng thông thường, nhưng vẫn nên theo dõi.

### Sự khác biệt của chúng tôi (vs. Google Derm Assist)

Các công cụ như Google Derm Assist là Thiết bị Y tế được đăng ký, cố gắng đưa ra chẩn đoán (ví dụ: "Viêm da tiếp xúc").

Chúng tôi đi theo một hướng khác:
1.  **KHÔNG Chẩn đoán:** Chúng tôi chỉ Sàng lọc Rủi ro.
2.  **Minh bạch 100%:** Logic AI cốt lõi của chúng tôi là một **Hệ thống Dựa trên Luật (Rules-Based Engine)**. Điều này có nghĩa là mọi quyết định đều có thể giải thích được (ví dụ: "Rủi ro CAO vì phát hiện triệu chứng 'chảy máu'").
3.  **Ưu tiên Tốc độ:** Chúng tôi sử dụng các mô hình AI gọn nhẹ (lightweight) để đảm bảo phản hồi gần như ngay lập tức.

## ✨ Tính năng (Features)

* **Phân tích dựa trên AI:** Sử dụng mô hình Computer Vision (MobileNetV3/EfficientNetV2) để phân tích hình ảnh.
* **Nhập liệu có cấu trúc:** Người dùng chọn triệu chứng từ **checkboxes** và **dropdowns** (Không cần NLP phức tạp).
* **Phân loại rủi ro 3 cấp:** Trả về kết quả (Cao/Trung bình/Thấp) rõ ràng.
* **Giải thích Đơn giản:** Cung cấp lý do ngắn gọn cho kết quả (ví dụ: "Phát hiện triệu chứng nghiêm trọng.").
* **Giao diện Web:** Truy cập nhanh trên mọi thiết bị mà không cần cài đặt.
* **Miễn trừ Trách nhiệm:** Tích hợp cảnh báo an toàn chủ động và bị động.
* **100% Nguồn mở:** Miễn phí, minh bạch, và chào đón sự đóng góp.

## 🛠️ Kiến trúc & Công nghệ (Architecture & Tech Stack)

Dự án được xây dựng trên kiến trúc **Microservices** để đảm bảo tính module hóa và dễ bảo trì.

| Service | Công nghệ | Nhiệm vụ |
| :--- | :--- | :--- |
| **Frontend** | **React.js** (hoặc Vue.js) | Giao diện người dùng (UI/UX), xử lý tải ảnh và nhập liệu. |
| **Backend-API** | **Python (FastAPI)**, **PostgreSQL** | API Gateway chính, điều phối yêu cầu, quản lý CSDL (nếu cần). |
| **AI-Service** | **Python (FastAPI)**, **PyTorch/TensorFlow** | Host mô hình CV (MobileNetV3) và chạy Rules-Engine. |

![Sơ đồ kiến trúc 3-service của dự án](docs/images/architecture_diagram.png)

## 📦 Cài đặt & Chạy (Getting Started)

Chúng tôi sử dụng **Docker** và **Docker Compose** để đơn giản hóa việc cài đặt.

### Yêu cầu
* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Git](https://git-scm.com/)

### Chạy Dự án (Development)

1.  **Clone dự án:**
    ```bash
    git clone [https://github.com/TEN_CUA_BAN/derma-safe-ai.git](https://github.com/TEN_CUA_BAN/derma-safe-ai.git)
    cd derma-safe-ai
    ```

2.  **Tạo tệp môi trường (Environment Files):**
    Dự án sử dụng các tệp `.env` để quản lý biến môi trường. Hãy sao chép từ các tệp ví dụ:

    ```bash
    # Sao chép tệp env cho Backend-API
    cp backend-api/.env.example backend-api/.env

    # Sao chép tệp env cho AI-Service (nếu có)
    cp ai-service/.env.example ai-service/.env
    ```
    *(Hãy chỉnh sửa các tệp `.env` nếu cần thiết.)*

3.  **Xây dựng và Chạy (Build and Run):**
    Từ thư mục gốc, chạy lệnh:
    ```bash
    docker-compose up -d --build
    ```

4.  **Truy cập:**
    * **Frontend (Web App):** `http://localhost:3000`
    * **Backend-API (Docs):** `http://localhost:8000/docs`
    * **AI-Service (Docs):** `http://localhost:8001/docs`

## 🤝 Đóng góp (Contributing)

Chúng tôi hoan nghênh mọi sự đóng góp! Cho dù là báo lỗi, yêu cầu tính năng, hay gửi Pull Request, tất cả đều được chào đón.

Trước khi bắt đầu, vui lòng đọc kỹ tệp **[DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)**.
Đây là tài liệu bắt buộc, định nghĩa toàn bộ triết lý, kiến trúc và các quy tắc code của dự án.

### Quy trình đóng góp
1.  **Fork** dự án này.
2.  Tạo một branch mới (`git checkout -b feature/ten-tinh-nang`).
3.  Thực hiện thay đổi và **commit** (hãy viết commit message rõ ràng).
4.  **Push** lên branch của bạn (`git push origin feature/ten-tinh-nang`).
5.  Mở một **Pull Request** và mô tả chi tiết các thay đổi của bạn.

## 📊 Nguồn dữ liệu & Cảm ơn (Data Sources & Acknowledgments)

Việc huấn luyện mô hình Computer Vision sẽ không thể thực hiện được nếu không có các bộ dữ liệu y tế công cộng tuyệt vời:

* **[ISIC (International Skin Imaging Collaboration)](https://www.isic-archive.com/):** Nguồn dữ liệu tiêu chuẩn vàng cho các tổn thương da ác tính và lành tính.
* **[DermNet](https://dermnetnz.org/):** Một thư viện hình ảnh da liễu khổng lồ cho các bệnh lý phổ thông.

Chúng tôi xin gửi lời cảm ơn sâu sắc đến các tổ chức và nhà nghiên cứu đã duy trì và chia sẻ các bộ dữ liệu này.

## 📄 Giấy phép (License)

Dự án này được cấp phép theo **Giấy phép MIT**. Xem tệp `LICENSE` để biết chi tiết.
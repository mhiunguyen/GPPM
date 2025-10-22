# 🏥 GPPM - General Practice Prediction Model# DermaSafe-AI



> **DermaSafe-AI**: Hệ thống hỗ trợ sàng lọc nguy cơ bệnh da liễu bằng AI![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/TEN_CUA_BAN/derma-safe-ai/ci.yml)

![License](https://img.shields.io/github/license/TEN_CUA_BAN/derma-safe-ai)

Ứng dụng web sử dụng Deep Learning (DermLIP model) để phân tích hình ảnh da và đưa ra đánh giá nguy cơ ban đầu, giúp người dùng quyết định có nên đi khám bác sĩ da liễu hay không.![Issues](https://img.shields.io/github/issues/TEN_CUA_BAN/derma-safe-ai)



[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](LICENSE)**Một công cụ sàng lọc rủi ro da liễu nguồn mở, dựa trên AI, ưu tiên sự an toàn và minh bạch.**



------



## 🎯 Tính năng chính> ## ⚠️ CẢNH BÁO QUAN TRỌNG VÀ MIỄN TRỪ TRÁCH NHIỆM Y TẾ

>

- ✅ **Upload ảnh da**: Hỗ trợ drag & drop, preview ảnh> **DermaSafe-AI KHÔNG PHẢI LÀ BÁC SĨ.** Đây **KHÔNG** phải là một công cụ chẩn đoán y tế.

- ✅ **AI Analysis**: Phân tích 44+ loại bệnh da liễu bằng DermLIP model>

- ✅ **Symptom Input**: Chọn 9 triệu chứng phổ biến + thời gian xuất hiện> Mục tiêu duy nhất của dự án này là **SÀNG LỌC RỦI RO (Triage)** - giúp bạn đưa ra quyết định có nên đi khám bác sĩ hay không dựa trên các dấu hiệu phổ biến. Kết quả của AI không bao giờ thay thế ý kiến, chẩn đoán, hoặc điều trị của một chuyên gia y tế đã qua đào tạo.

- ✅ **Risk Assessment**: Đánh giá 3 mức độ (CAO 🔴 / TRUNG BÌNH 🟡 / THẤP 🟢)>

- ✅ **Detailed Info**: Thông tin bệnh, khuyến nghị cụ thể bằng tiếng Việt> **Luôn luôn tham vấn bác sĩ da liễu của bạn để có chẩn đoán chính xác.**

- ✅ **Responsive UI**: Giao diện đẹp, dễ dùng trên mọi thiết bị

- ✅ **i18n Support**: Đa ngôn ngữ (Tiếng Việt, English)---



---## 🚀 Giới thiệu (About This Project)



## 🏗️ Kiến trúc hệ thống### Vấn đề

Nhiều người cảm thấy lo lắng khi phát hiện một vấn đề về da (như nốt ruồi mới, vết mẩn...) nhưng lại ngần ngại đi khám bác sĩ. Các công cụ tìm kiếm thường đưa ra những kết quả đáng sợ và không đáng tin cậy.

```

┌─────────────┐      ┌──────────────┐      ┌─────────────┐### Giải pháp

│  Frontend   │─────▶│  Backend API │─────▶│ AI Service  │**DermaSafe-AI** là một ứng dụng web đơn giản, nhanh chóng và an toàn. Thay vì cố gắng chẩn đoán bạn bị bệnh gì, dự án này chỉ tập trung vào một câu hỏi: **"Mức độ rủi ro của bạn là gì?"**

│  (Vite +    │      │  (FastAPI +  │      │  (FastAPI + │

│   React)    │      │   Postgres)  │      │   DermLIP)  │Người dùng tải lên một hình ảnh và chọn các triệu chứng của họ từ một danh sách có sẵn. Hệ thống AI của chúng tôi sẽ phân tích dữ liệu và trả về 1 trong 3 cấp độ rủi ro:

└─────────────┘      └──────────────┘      └─────────────┘

   Port 5173            Port 8000              Port 8001* **CAO 🔴:** Bạn nên đi khám bác sĩ ngay lập tức.

```* **TRUNG BÌNH 🟡:** Bạn nên theo dõi cẩn thận và sắp xếp lịch đi khám.

* **THẤP 🟢:** Có vẻ là tình trạng thông thường, nhưng vẫn nên theo dõi.

### Components

### Sự khác biệt của chúng tôi (vs. Google Derm Assist)

- **Frontend**: React + TypeScript + Vite + TailwindCSS

- **Backend API**: FastAPI + SQLAlchemy + PostgreSQL (logging & proxy)Các công cụ như Google Derm Assist là Thiết bị Y tế được đăng ký, cố gắng đưa ra chẩn đoán (ví dụ: "Viêm da tiếp xúc").

- **AI Service**: FastAPI + PyTorch + DermLIP model (44 disease classes)

- **Dermatology Module**: Open-source library sử dụng DermLIP AIChúng tôi đi theo một hướng khác:

1.  **KHÔNG Chẩn đoán:** Chúng tôi chỉ Sàng lọc Rủi ro.

---2.  **Minh bạch 100%:** Logic AI cốt lõi của chúng tôi là một **Hệ thống Dựa trên Luật (Rules-Based Engine)**. Điều này có nghĩa là mọi quyết định đều có thể giải thích được (ví dụ: "Rủi ro CAO vì phát hiện triệu chứng 'chảy máu'").

3.  **Ưu tiên Tốc độ:** Chúng tôi sử dụng các mô hình AI gọn nhẹ (lightweight) để đảm bảo phản hồi gần như ngay lập tức.

## 🚀 Quick Start

## ✨ Tính năng (Features)

### Prerequisites

* **🧠 Phân tích AI tiên tiến:** Sử dụng DermLIP - mô hình Computer Vision chuyên biệt cho da liễu, hỗ trợ tiếng Việt đầy đủ

- Python 3.12+* **🎯 Chẩn đoán chi tiết:** Cung cấp chẩn đoán chính và các chẩn đoán thay thế với độ tin cậy cụ thể

- Node.js 18+* **📋 Khuyến nghị rõ ràng:** Đưa ra hành động cụ thể dựa trên mức độ nghiêm trọng

- PostgreSQL 16+ (optional, chỉ cần cho logging)* **⚡ Nhập liệu có cấu trúc:** Người dùng chọn triệu chứng từ **checkboxes** và **dropdowns** (Không cần NLP phức tạp)

* **🚦 Phân loại rủi ro 3 cấp:** Trả về kết quả (Cao/Trung bình/Thấp) rõ ràng

### 1. Clone repository* **💬 Giải thích Đơn giản:** Cung cấp lý do ngắn gọn và mô tả chi tiết cho kết quả

* **🌐 Giao diện Web:** Truy cập nhanh trên mọi thiết bị mà không cần cài đặt

```bash* **⚠️ Miễn trừ Trách nhiệm:** Tích hợp cảnh báo an toàn chủ động và bị động

git clone https://github.com/thienreal/GPPM.git* **🔓 100% Nguồn mở:** Miễn phí, minh bạch, và chào đón sự đóng góp

cd GPPM

```## 🛠️ Kiến trúc & Công nghệ (Architecture & Tech Stack)



### 2. Cài đặt AI ServiceDự án được xây dựng trên kiến trúc **Microservices** để đảm bảo tính module hóa và dễ bảo trì.



```bash| Service | Công nghệ | Nhiệm vụ |

cd ai-service| :--- | :--- | :--- |

pip install -r requirements-cpu.txt  # CPU version (nhẹ hơn)| **Frontend** | **React.js** (TypeScript) | Giao diện người dùng (UI/UX), xử lý tải ảnh và nhập liệu. |

# hoặc| **Backend-API** | **Python (FastAPI)**, **PostgreSQL** | API Gateway chính, điều phối yêu cầu, quản lý CSDL. |

pip install -r requirements.txt      # GPU version (nếu có CUDA)| **AI-Service** | **Python (FastAPI)**, **PyTorch**, **DermLIP** | Phân tích ảnh da liễu bằng DermLIP AI model và Rules-Engine. |

```| **Dermatology Module** | **Python**, **OpenCLIP** | Module phân tích chuyên biệt, xử lý ảnh và trả về chẩn đoán. |



### 3. Cài đặt Backend API![Sơ đồ kiến trúc 3-service của dự án](docs/images/architecture_diagram.png)



```bash## 📦 Cài đặt & Chạy (Getting Started)

cd ../backend-api

pip install -r requirements.txtChúng tôi sử dụng **Docker** và **Docker Compose** để đơn giản hóa việc cài đặt.

```

### Yêu cầu

### 4. Cài đặt Frontend* [Docker](https://www.docker.com/get-started)

* [Docker Compose](https://docs.docker.com/compose/install/)

```bash* [Git](https://git-scm.com/)

cd ../frontend

npm install### 🚀 Quick Start

```

Cách nhanh nhất để chạy dự án:

### 5. Chạy ứng dụng

```bash

**Terminal 1 - AI Service:**# Clone và chạy

```bashgit clone https://github.com/thienreal/GPPM.git

cd ai-servicecd GPPM

uvicorn ai_app.main:app --host 0.0.0.0 --port 8001./quick_start.sh

``````



**Terminal 2 - Backend API:**Script sẽ tự động:

```bash- ✅ Kiểm tra Docker và docker-compose

cd backend-api- 📦 Build Docker images

uvicorn backend_app.main:app --host 0.0.0.0 --port 8000- 🚀 Khởi động services

```- 🔍 Test health endpoints



**Terminal 3 - Frontend:**### Chạy Dự án (Development)

```bash

cd frontend1.  **Clone dự án:**

npm run dev    ```bash

```    git clone https://github.com/thienreal/GPPM.git

    cd GPPM

**Mở browser tại:** http://localhost:5173    ```



---2.  **Tạo tệp môi trường (Environment Files):**

    Dự án sử dụng các tệp `.env` để quản lý biến môi trường. Hãy sao chép từ các tệp ví dụ:

## 🐳 Docker (Alternative)

    ```bash

```bash    # Sao chép tệp env cho Backend-API

# Chạy tất cả services với Docker Compose    cp backend-api/.env.example backend-api/.env

docker-compose up --build

    # Sao chép tệp env cho AI-Service (nếu có)

# Frontend: http://localhost:3000    cp ai-service/.env.example ai-service/.env

# Backend API: http://localhost:8000    ```

# AI Service: http://localhost:8001    *(Hãy chỉnh sửa các tệp `.env` nếu cần thiết.)*

```

3.  **Xây dựng và Chạy (Build and Run):**

---    Từ thư mục gốc, chạy lệnh:

    ```bash

## 📖 Documentation    docker-compose up -d --build

    ```

- [Architecture Flow](docs/ARCHITECTURE_FLOW.md) - Luồng dữ liệu chi tiết    

- [Dermatology Integration](docs/DERMATOLOGY_INTEGRATION.md) - Tích hợp DermLIP model    Lần đầu tiên sẽ mất ~5-10 phút để download DermLIP model (~340MB)

- [Development Guidelines](DEVELOPMENT_GUIDELINES.md) - Quy tắc code & testing

- [API Documentation](http://localhost:8001/docs) - Interactive API docs (khi service chạy)4.  **Truy cập:**

    * **Frontend (Web App):** `http://localhost:3000`

---    * **Backend-API (Docs):** `http://localhost:8000/docs`

    * **AI-Service (Docs):** `http://localhost:8001/docs`

## 🧪 Testing

5. **Xem logs:**

### Python Tests    ```bash

    docker-compose logs -f ai-service

```bash    ```

# Test AI Service

cd ai-service### 📚 Tài liệu chi tiết

pytest -v

- **[DERMATOLOGY_INTEGRATION.md](docs/DERMATOLOGY_INTEGRATION.md)** - Hướng dẫn tích hợp dermatology module

# Test Backend API- **[DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)** - Quy tắc phát triển

cd backend-api- **[ai-service/README.md](ai-service/README.md)** - Chi tiết về AI Service

pytest -v

```## 🤝 Đóng góp (Contributing)



### Frontend TestsChúng tôi hoan nghênh mọi sự đóng góp! Cho dù là báo lỗi, yêu cầu tính năng, hay gửi Pull Request, tất cả đều được chào đón.



```bashTrước khi bắt đầu, vui lòng đọc kỹ tệp **[DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)**.

cd frontendĐây là tài liệu bắt buộc, định nghĩa toàn bộ triết lý, kiến trúc và các quy tắc code của dự án.

npm run test:e2e        # Playwright E2E tests

npm run test:e2e:ui     # E2E với UI mode### Quy trình đóng góp

```1.  **Fork** dự án này.

2.  Tạo một branch mới (`git checkout -b feature/ten-tinh-nang`).

---3.  Thực hiện thay đổi và **commit** (hãy viết commit message rõ ràng).

4.  **Push** lên branch của bạn (`git push origin feature/ten-tinh-nang`).

## 🎨 Tech Stack5.  Mở một **Pull Request** và mô tả chi tiết các thay đổi của bạn.



### Frontend## 📊 Nguồn dữ liệu & Cảm ơn (Data Sources & Acknowledgments)

- **React 19** - UI framework

- **TypeScript** - Type safetyViệc phát triển mô hình Computer Vision sẽ không thể thực hiện được nếu không có các bộ dữ liệu y tế công cộng tuyệt vời và mô hình AI tiên tiến:

- **Vite 5** - Build tool

- **TailwindCSS 4** - Styling* **[DermLIP](https://arxiv.org/abs/2503.14911):** Mô hình CLIP chuyên biệt cho da liễu, được huấn luyện trên Derm1M dataset. Đây là nền tảng cốt lõi cho khả năng phân tích của chúng tôi.

- **react-i18next** - Internationalization* **[ISIC (International Skin Imaging Collaboration)](https://www.isic-archive.com/):** Nguồn dữ liệu tiêu chuẩn vàng cho các tổn thương da ác tính và lành tính.

* **[DermNet](https://dermnetnz.org/):** Một thư viện hình ảnh da liễu khổng lồ cho các bệnh lý phổ thông.

### Backend* **[OpenCLIP](https://github.com/mlfoundations/open_clip):** Framework mã nguồn mở cho CLIP models.

- **FastAPI** - Modern Python web framework

- **SQLAlchemy** - ORM### Trích dẫn (Citation)

- **PostgreSQL** - Database

- **Alembic** - Database migrationsNếu bạn sử dụng dự án này hoặc DermLIP model, vui lòng trích dẫn:

- **Pydantic** - Data validation

```bibtex

### AI/ML@misc{yan2025derm1m,

- **PyTorch 2.9** - Deep learning framework  title={Derm1M: A Million-Scale Vision-Language Dataset for Dermatology},

- **DermLIP** - Pre-trained vision-language model cho dermatology  author={Siyuan Yan and Ming Hu and others},

- **OpenCLIP** - CLIP implementation  year={2025},

- **ONNX Runtime** - Model inference optimization  eprint={2503.14911},

  archivePrefix={arXiv}

---}

```

## 📊 Disease Coverage

Chúng tôi xin gửi lời cảm ơn sâu sắc đến các tổ chức và nhà nghiên cứu đã duy trì và chia sẻ các bộ dữ liệu và mô hình này.

Model hỗ trợ phát hiện **44 loại bệnh da liễu**, bao gồm:

## 📄 Giấy phép (License)

### Ung thư da (High Risk)

- Melanoma (Ung thư hắc tố)Dự án này được cấp phép theo **Giấy phép MIT**. Xem tệp `LICENSE` để biết chi tiết.
- Basal Cell Carcinoma (Ung thư tế bào đáy)
- Squamous Cell Carcinoma (Ung thư tế bào vảy)
- Actinic Keratosis (Loạn sản tế bào sừng)

### Viêm da & Tình trạng phổ biến (Moderate Risk)
- Eczema (Chàm)
- Psoriasis (Vảy nến)
- Dermatitis (Viêm da)
- Rosacea (Rám má)
- Acne (Mụn trứng cá)
- Seborrheic Keratosis (U sừng tiết bã)

### Tổn thương lành tính (Low Risk)
- Nevus (Nốt ruồi)
- Wart (Mụn cóc)
- Hemangioma (U máu)
- Skin Tag (Mụn thịt)
- ...và nhiều hơn nữa

---

## ⚠️ Disclaimer

**QUAN TRỌNG**: Ứng dụng này **KHÔNG PHẢI** là công cụ chẩn đoán y khoa.

- ✅ Chỉ dùng để sàng lọc và tham khảo ban đầu
- ✅ Kết quả chỉ mang tính chất gợi ý
- ❌ KHÔNG thay thế ý kiến của bác sĩ chuyên khoa
- ❌ KHÔNG dùng để tự điều trị

**Luôn tham khảo bác sĩ da liễu chuyên nghiệp cho chẩn đoán chính xác.**

---

## 📝 License

- **Code**: CC BY-NC 4.0 (Non-commercial use only)
- **DermLIP Model**: Research use only (theo license của DermLIP)

---

## 🙏 Acknowledgments

- [DermLIP](https://github.com/SkinGPT-project/DermLIP) - Pre-trained dermatology AI model
- [Derm1M Dataset](https://huggingface.co/datasets/SkinGPT-project/Derm1M) - Training data
- OpenCLIP team - CLIP implementation

---

## 👥 Contributors

- **thienreal** - Project Lead & Development

---

## 📧 Contact

- GitHub: [@thienreal](https://github.com/thienreal)
- Project Issues: [GitHub Issues](https://github.com/thienreal/GPPM/issues)

---

## 🗺️ Roadmap

- [x] Core AI integration
- [x] Frontend implementation
- [x] Backend API
- [x] Risk assessment logic
- [ ] User accounts & history
- [ ] Doctor consultation booking
- [ ] Mobile app (React Native)
- [ ] Multi-language expansion

---

**⭐ Nếu dự án hữu ích, hãy cho một star trên GitHub!**

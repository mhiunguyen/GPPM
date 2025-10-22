# 🏥 DermaSafe AI - Hệ thống Sàng lọc Rủi ro Da liễu# 🏥 GPPM - General Practice Prediction Model# DermaSafe-AI



[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)> **DermaSafe-AI**: Hệ thống hỗ trợ sàng lọc nguy cơ bệnh da liễu bằng AI![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/TEN_CUA_BAN/derma-safe-ai/ci.yml)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)

![License](https://img.shields.io/github/license/TEN_CUA_BAN/derma-safe-ai)

> **DermaSafe AI**: Ứng dụng web sử dụng Deep Learning (DermLIP model) để phân tích hình ảnh da và đưa ra đánh giá nguy cơ ban đầu, giúp người dùng quyết định có nên đi khám bác sĩ da liễu hay không.

Ứng dụng web sử dụng Deep Learning (DermLIP model) để phân tích hình ảnh da và đưa ra đánh giá nguy cơ ban đầu, giúp người dùng quyết định có nên đi khám bác sĩ da liễu hay không.![Issues](https://img.shields.io/github/issues/TEN_CUA_BAN/derma-safe-ai)

![DermaSafe AI Demo](docs/images/demo.png)



---

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](LICENSE)**Một công cụ sàng lọc rủi ro da liễu nguồn mở, dựa trên AI, ưu tiên sự an toàn và minh bạch.**

## ⚠️ CẢNH BÁO Y TẾ QUAN TRỌNG



**DermaSafe AI KHÔNG PHẢI LÀ CÔNG CỤ CHẨN ĐOÁN Y KHOA.**

------

- ✅ **Mục đích duy nhất**: Sàng lọc rủi ro (Triage) - giúp bạn đưa ra quyết định có nên đi khám bác sĩ

- ❌ **KHÔNG thay thế**: Ý kiến, chẩn đoán, hoặc điều trị của bác sĩ chuyên khoa

- ⚕️ **Luôn tham khảo bác sĩ da liễu**: Để có chẩn đoán chính xác và kế hoạch điều trị

## 🎯 Tính năng chính> ## ⚠️ CẢNH BÁO QUAN TRỌNG VÀ MIỄN TRỪ TRÁCH NHIỆM Y TẾ

Kết quả của AI chỉ mang tính chất tham khảo và **không có giá trị pháp lý y tế**.

>

---

- ✅ **Upload ảnh da**: Hỗ trợ drag & drop, preview ảnh> **DermaSafe-AI KHÔNG PHẢI LÀ BÁC SĨ.** Đây **KHÔNG** phải là một công cụ chẩn đoán y tế.

## 🎯 Vấn đề & Giải pháp

- ✅ **AI Analysis**: Phân tích 44+ loại bệnh da liễu bằng DermLIP model>

### 🤔 Vấn đề

Nhiều người cảm thấy lo lắng khi phát hiện vấn đề về da (nốt ruồi mới, vết mẩn đỏ, ngứa dai dẳng...) nhưng lại:- ✅ **Symptom Input**: Chọn 9 triệu chứng phổ biến + thời gian xuất hiện> Mục tiêu duy nhất của dự án này là **SÀNG LỌC RỦI RO (Triage)** - giúp bạn đưa ra quyết định có nên đi khám bác sĩ hay không dựa trên các dấu hiệu phổ biến. Kết quả của AI không bao giờ thay thế ý kiến, chẩn đoán, hoặc điều trị của một chuyên gia y tế đã qua đào tạo.

- 😰 Ngần ngại đi khám vì không chắc có nghiêm trọng không

- 🔍 Tìm kiếm Google cho ra kết quả đáng sợ và không đáng tin- ✅ **Risk Assessment**: Đánh giá 3 mức độ (CAO 🔴 / TRUNG BÌNH 🟡 / THẤP 🟢)>

- ⏰ Không biết nên đi khám ngay hay theo dõi thêm

- 💰 Lo lắng về chi phí khám không cần thiết- ✅ **Detailed Info**: Thông tin bệnh, khuyến nghị cụ thể bằng tiếng Việt> **Luôn luôn tham vấn bác sĩ da liễu của bạn để có chẩn đoán chính xác.**



### 💡 Giải pháp của chúng tôi- ✅ **Responsive UI**: Giao diện đẹp, dễ dùng trên mọi thiết bị

**DermaSafe AI** tập trung vào một câu hỏi duy nhất: **"Mức độ rủi ro của tôi là gì?"**

- ✅ **i18n Support**: Đa ngôn ngữ (Tiếng Việt, English)---

1. 📸 **Upload ảnh** + chọn triệu chứng từ danh sách có sẵn

2. 🧠 **AI phân tích** bằng DermLIP model (44+ bệnh da liễu)

3. 🚦 **Nhận kết quả** với 3 mức độ rủi ro:

   - 🔴 **CAO**: Nên đi khám ngay lập tức---## 🚀 Giới thiệu (About This Project)

   - 🟡 **TRUNG BÌNH**: Theo dõi cẩn thận và sắp xếp lịch khám

   - 🟢 **THẤP**: Có vẻ thông thường, nhưng vẫn nên theo dõi



---## 🏗️ Kiến trúc hệ thống### Vấn đề



## ✨ Tính năng ChínhNhiều người cảm thấy lo lắng khi phát hiện một vấn đề về da (như nốt ruồi mới, vết mẩn...) nhưng lại ngần ngại đi khám bác sĩ. Các công cụ tìm kiếm thường đưa ra những kết quả đáng sợ và không đáng tin cậy.



### 🎨 Giao diện người dùng```

- ✅ **Upload ảnh dễ dàng**: Drag & drop, chụp trực tiếp, hoặc chọn file

- ✅ **Camera thông minh**: Kiểm tra chất lượng ảnh real-time (độ sáng, độ nét, màu sắc)┌─────────────┐      ┌──────────────┐      ┌─────────────┐### Giải pháp

- ✅ **Triệu chứng có cấu trúc**: Chọn từ 40+ triệu chứng được phân loại rõ ràng

- ✅ **Thời gian xuất hiện**: Chọn thời gian có triệu chứng (1 ngày → 6 tháng+)│  Frontend   │─────▶│  Backend API │─────▶│ AI Service  │**DermaSafe-AI** là một ứng dụng web đơn giản, nhanh chóng và an toàn. Thay vì cố gắng chẩn đoán bạn bị bệnh gì, dự án này chỉ tập trung vào một câu hỏi: **"Mức độ rủi ro của bạn là gì?"**

- ✅ **Chatbot AI**: Hỗ trợ tư vấn trực tiếp với Gemini AI

- ✅ **Đa ngôn ngữ**: Tiếng Việt & English│  (Vite +    │      │  (FastAPI +  │      │  (FastAPI + │



### 🧠 AI & Phân tích│   React)    │      │   Postgres)  │      │   DermLIP)  │Người dùng tải lên một hình ảnh và chọn các triệu chứng của họ từ một danh sách có sẵn. Hệ thống AI của chúng tôi sẽ phân tích dữ liệu và trả về 1 trong 3 cấp độ rủi ro:

- ✅ **DermLIP Model**: Vision-Language model chuyên biệt cho da liễu

- ✅ **44+ bệnh da liễu**: Bao phủm ung thư da, viêm da, tổn thương lành tính└─────────────┘      └──────────────┘      └─────────────┘

- ✅ **Phân tích chi tiết**: Chẩn đoán chính + 3 chẩn đoán thay thế với độ tin cậy

- ✅ **Đánh giá rủi ro thông minh**: Dựa trên triệu chứng nguy hiểm và thời gian   Port 5173            Port 8000              Port 8001* **CAO 🔴:** Bạn nên đi khám bác sĩ ngay lập tức.

- ✅ **Giải thích rõ ràng**: Lý do và mô tả chi tiết bằng tiếng Việt

```* **TRUNG BÌNH 🟡:** Bạn nên theo dõi cẩn thận và sắp xếp lịch đi khám.

### 🔒 An toàn & Minh bạch

- ✅ **Rules-based Logic**: Mọi quyết định đều có thể giải thích được* **THẤP 🟢:** Có vẻ là tình trạng thông thường, nhưng vẫn nên theo dõi.

- ✅ **Cảnh báo chủ động**: Disclaimer rõ ràng trên UI

- ✅ **Không lưu dữ liệu nhạy cảm**: Ảnh không được lưu trên server### Components

- ✅ **100% mã nguồn mở**: Miễn phí, minh bạch, có thể kiểm chứng

### Sự khác biệt của chúng tôi (vs. Google Derm Assist)

---

- **Frontend**: React + TypeScript + Vite + TailwindCSS

## 🏗️ Kiến trúc Hệ thống

- **Backend API**: FastAPI + SQLAlchemy + PostgreSQL (logging & proxy)Các công cụ như Google Derm Assist là Thiết bị Y tế được đăng ký, cố gắng đưa ra chẩn đoán (ví dụ: "Viêm da tiếp xúc").

```

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐- **AI Service**: FastAPI + PyTorch + DermLIP model (44 disease classes)

│    Frontend      │─────▶│   Backend API    │─────▶│   AI Service     │

│  (React + Vite)  │      │  (FastAPI)       │      │  (DermLIP AI)    │- **Dermatology Module**: Open-source library sử dụng DermLIP AIChúng tôi đi theo một hướng khác:

│  Port: 5173      │◀─────│  Port: 8000      │◀─────│  Port: 8001      │

└──────────────────┘      └──────────────────┘      └──────────────────┘1.  **KHÔNG Chẩn đoán:** Chúng tôi chỉ Sàng lọc Rủi ro.

                                   │

                                   ▼---2.  **Minh bạch 100%:** Logic AI cốt lõi của chúng tôi là một **Hệ thống Dựa trên Luật (Rules-Based Engine)**. Điều này có nghĩa là mọi quyết định đều có thể giải thích được (ví dụ: "Rủi ro CAO vì phát hiện triệu chứng 'chảy máu'").

                          ┌──────────────────┐      ┌──────────────────┐

                          │  PostgreSQL DB   │      │ Chatbot Service  │3.  **Ưu tiên Tốc độ:** Chúng tôi sử dụng các mô hình AI gọn nhẹ (lightweight) để đảm bảo phản hồi gần như ngay lập tức.

                          │  Port: 5432      │      │ (Gemini AI)      │

                          └──────────────────┘      │ Port: 8002       │## 🚀 Quick Start

                                                     └──────────────────┘

```## ✨ Tính năng (Features)



### 📦 Microservices### Prerequisites



| Service | Công nghệ | Chức năng |* **🧠 Phân tích AI tiên tiến:** Sử dụng DermLIP - mô hình Computer Vision chuyên biệt cho da liễu, hỗ trợ tiếng Việt đầy đủ

|---------|-----------|-----------|

| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS | Giao diện người dùng, camera capture, triệu chứng selection |- Python 3.12+* **🎯 Chẩn đoán chi tiết:** Cung cấp chẩn đoán chính và các chẩn đoán thay thế với độ tin cậy cụ thể

| **Backend API** | FastAPI + PostgreSQL + SQLAlchemy | API Gateway, logging, proxy requests, database |

| **AI Service** | FastAPI + PyTorch + DermLIP + OpenCLIP | Phân tích ảnh da liễu, risk assessment engine |- Node.js 18+* **📋 Khuyến nghị rõ ràng:** Đưa ra hành động cụ thể dựa trên mức độ nghiêm trọng

| **Chatbot Service** | FastAPI + Google Gemini AI | Tư vấn và trả lời câu hỏi bằng AI |

| **Dermatology Module** | Python + DermLIP | Module phân tích chuyên biệt, xử lý ảnh |- PostgreSQL 16+ (optional, chỉ cần cho logging)* **⚡ Nhập liệu có cấu trúc:** Người dùng chọn triệu chứng từ **checkboxes** và **dropdowns** (Không cần NLP phức tạp)



---* **🚦 Phân loại rủi ro 3 cấp:** Trả về kết quả (Cao/Trung bình/Thấp) rõ ràng



## 🚀 Cài đặt & Chạy### 1. Clone repository* **💬 Giải thích Đơn giản:** Cung cấp lý do ngắn gọn và mô tả chi tiết cho kết quả



### 📋 Yêu cầu hệ thống* **🌐 Giao diện Web:** Truy cập nhanh trên mọi thiết bị mà không cần cài đặt



- **Docker** 24.0+ & **Docker Compose** 2.0+```bash* **⚠️ Miễn trừ Trách nhiệm:** Tích hợp cảnh báo an toàn chủ động và bị động

- **Git** 2.40+

- **RAM**: Tối thiểu 8GB (khuyến nghị 16GB)git clone https://github.com/thienreal/GPPM.git* **🔓 100% Nguồn mở:** Miễn phí, minh bạch, và chào đón sự đóng góp

- **Disk**: Tối thiểu 5GB trống (cho models)

- **Optional**: NVIDIA GPU với CUDA 12.1+ (tăng tốc AI)cd GPPM



### ⚡ Quick Start (Khuyến nghị)```## 🛠️ Kiến trúc & Công nghệ (Architecture & Tech Stack)



Cách nhanh nhất để chạy dự án:



```bash### 2. Cài đặt AI ServiceDự án được xây dựng trên kiến trúc **Microservices** để đảm bảo tính module hóa và dễ bảo trì.

# 1. Clone repository

git clone https://github.com/mhiunguyen/GPPM.git

cd GPPM

```bash| Service | Công nghệ | Nhiệm vụ |

# 2. Chạy quick start script

./quick_start.shcd ai-service| :--- | :--- | :--- |

```

pip install -r requirements-cpu.txt  # CPU version (nhẹ hơn)| **Frontend** | **React.js** (TypeScript) | Giao diện người dùng (UI/UX), xử lý tải ảnh và nhập liệu. |

Script sẽ tự động:

- ✅ Kiểm tra Docker và docker-compose# hoặc| **Backend-API** | **Python (FastAPI)**, **PostgreSQL** | API Gateway chính, điều phối yêu cầu, quản lý CSDL. |

- ✅ Tạo các file .env cần thiết

- ✅ Build Docker images (lần đầu ~10 phút)pip install -r requirements.txt      # GPU version (nếu có CUDA)| **AI-Service** | **Python (FastAPI)**, **PyTorch**, **DermLIP** | Phân tích ảnh da liễu bằng DermLIP AI model và Rules-Engine. |

- ✅ Download DermLIP model (~340MB)

- ✅ Khởi động tất cả services```| **Dermatology Module** | **Python**, **OpenCLIP** | Module phân tích chuyên biệt, xử lý ảnh và trả về chẩn đoán. |

- ✅ Test health endpoints



**Truy cập ứng dụng:**

- 🌐 **Frontend**: http://localhost:5173### 3. Cài đặt Backend API![Sơ đồ kiến trúc 3-service của dự án](docs/images/architecture_diagram.png)

- 📚 **Backend API Docs**: http://localhost:8000/docs

- 🤖 **AI Service Docs**: http://localhost:8001/docs

- 💬 **Chatbot Docs**: http://localhost:8002/docs

```bash## 📦 Cài đặt & Chạy (Getting Started)

### 🛠️ Development Setup (Manual)

cd ../backend-api

Nếu bạn muốn chạy development mode:

pip install -r requirements.txtChúng tôi sử dụng **Docker** và **Docker Compose** để đơn giản hóa việc cài đặt.

```bash

# 1. Clone repository```

git clone https://github.com/mhiunguyen/GPPM.git

cd GPPM### Yêu cầu



# 2. Tạo file .env (nếu cần)### 4. Cài đặt Frontend* [Docker](https://www.docker.com/get-started)

cp backend-api/.env.example backend-api/.env

cp ai-service/.env.example ai-service/.env* [Docker Compose](https://docs.docker.com/compose/install/)

cp chatbot-service/.env.example chatbot-service/.env

```bash* [Git](https://git-scm.com/)

# 3. Build và chạy services

docker-compose up -d --buildcd ../frontend



# 4. Xem logsnpm install### 🚀 Quick Start

docker-compose logs -f

```

# 5. Stop services

docker-compose downCách nhanh nhất để chạy dự án:

```

### 5. Chạy ứng dụng

### 🐍 Run Without Docker (Advanced)

```bash

**Terminal 1 - AI Service:**

```bash**Terminal 1 - AI Service:**# Clone và chạy

cd ai-service

pip install -r requirements.txt```bashgit clone https://github.com/thienreal/GPPM.git

uvicorn ai_app.main:app --host 0.0.0.0 --port 8001 --reload

```cd ai-servicecd GPPM



**Terminal 2 - Backend API:**uvicorn ai_app.main:app --host 0.0.0.0 --port 8001./quick_start.sh

```bash

cd backend-api``````

pip install -r requirements.txt

uvicorn backend_app.main:app --host 0.0.0.0 --port 8000 --reload

```

**Terminal 2 - Backend API:**Script sẽ tự động:

**Terminal 3 - Chatbot Service:**

```bash```bash- ✅ Kiểm tra Docker và docker-compose

cd chatbot-service

pip install -r requirements.txtcd backend-api- 📦 Build Docker images

# Cần GEMINI_API_KEY trong .env

uvicorn chatbot_app.main:app --host 0.0.0.0 --port 8002 --reloaduvicorn backend_app.main:app --host 0.0.0.0 --port 8000- 🚀 Khởi động services

```

```- 🔍 Test health endpoints

**Terminal 4 - Frontend:**

```bash

cd frontend

npm install**Terminal 3 - Frontend:**### Chạy Dự án (Development)

npm run dev

``````bash



---cd frontend1.  **Clone dự án:**



## 🧪 Testingnpm run dev    ```bash



### Backend Testing```    git clone https://github.com/thienreal/GPPM.git

```bash

# Test AI Service    cd GPPM

cd ai-service

pytest -v**Mở browser tại:** http://localhost:5173    ```



# Test Backend API

cd backend-api

pytest -v---2.  **Tạo tệp môi trường (Environment Files):**

```

    Dự án sử dụng các tệp `.env` để quản lý biến môi trường. Hãy sao chép từ các tệp ví dụ:

### Frontend Testing

```bash## 🐳 Docker (Alternative)

cd frontend

    ```bash

# Unit & Component tests

npm run test```bash    # Sao chép tệp env cho Backend-API



# E2E tests with Playwright# Chạy tất cả services với Docker Compose    cp backend-api/.env.example backend-api/.env

npm run test:e2e

docker-compose up --build

# E2E with UI mode

npm run test:e2e:ui    # Sao chép tệp env cho AI-Service (nếu có)

```

# Frontend: http://localhost:3000    cp ai-service/.env.example ai-service/.env

### Manual Testing Scripts

```bash# Backend API: http://localhost:8000    ```

# Test full system

./test_full_system.sh# AI Service: http://localhost:8001    *(Hãy chỉnh sửa các tệp `.env` nếu cần thiết.)*



# Test dermatology integration```

python test_dermatology_integration.py

3.  **Xây dựng và Chạy (Build and Run):**

# Test symptom validation

python test_symptom_validation_demo.py---    Từ thư mục gốc, chạy lệnh:

```

    ```bash

---

## 📖 Documentation    docker-compose up -d --build

## 📚 Tài liệu Chi tiết

    ```

### 📖 Documentation Files

- **[ARCHITECTURE_FLOW.md](docs/ARCHITECTURE_FLOW.md)** - Luồng dữ liệu và kiến trúc chi tiết- [Architecture Flow](docs/ARCHITECTURE_FLOW.md) - Luồng dữ liệu chi tiết    

- **[DERMATOLOGY_INTEGRATION.md](docs/DERMATOLOGY_INTEGRATION.md)** - Tích hợp DermLIP model

- **[DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)** - Quy tắc phát triển và coding standards- [Dermatology Integration](docs/DERMATOLOGY_INTEGRATION.md) - Tích hợp DermLIP model    Lần đầu tiên sẽ mất ~5-10 phút để download DermLIP model (~340MB)

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Hướng dẫn testing toàn diện

- **[CHATBOT_ROADMAP.md](CHATBOT_ROADMAP.md)** - Roadmap phát triển chatbot- [Development Guidelines](DEVELOPMENT_GUIDELINES.md) - Quy tắc code & testing



### 📦 Service-specific READMEs- [API Documentation](http://localhost:8001/docs) - Interactive API docs (khi service chạy)4.  **Truy cập:**

- **[ai-service/README.md](ai-service/README.md)** - Chi tiết về AI Service

- **[chatbot-service/README.md](chatbot-service/README.md)** - Chi tiết về Chatbot Service    * **Frontend (Web App):** `http://localhost:3000`

- **[smart_derma_capture/README.md](smart_derma_capture/README.md)** - Chi tiết về Smart Capture Module

---    * **Backend-API (Docs):** `http://localhost:8000/docs`

---

    * **AI-Service (Docs):** `http://localhost:8001/docs`

## 🛡️ Tech Stack

## 🧪 Testing

### Frontend

- **React 19.1** - UI framework5. **Xem logs:**

- **TypeScript 5.9** - Type safety

- **Vite 5.4** - Build tool & dev server### Python Tests    ```bash

- **Tailwind CSS 4.1** - Utility-first CSS

- **Lucide React** - Icon library    docker-compose logs -f ai-service

- **Playwright** - E2E testing

```bash    ```

### Backend & API

- **FastAPI 0.115** - Modern Python web framework# Test AI Service

- **SQLAlchemy 2.0** - ORM

- **PostgreSQL 16** - Databasecd ai-service### 📚 Tài liệu chi tiết

- **Alembic 1.13** - Database migrations

- **Pydantic 2.9** - Data validationpytest -v



### AI & Machine Learning- **[DERMATOLOGY_INTEGRATION.md](docs/DERMATOLOGY_INTEGRATION.md)** - Hướng dẫn tích hợp dermatology module

- **PyTorch 2.0+** - Deep learning framework

- **DermLIP** - Vision-language model cho da liễu# Test Backend API- **[DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)** - Quy tắc phát triển

- **OpenCLIP 2.20+** - CLIP implementation

- **OpenCV 4.10** - Computer visioncd backend-api- **[ai-service/README.md](ai-service/README.md)** - Chi tiết về AI Service

- **scikit-image 0.24** - Image processing

- **HuggingFace Hub** - Model repositorypytest -v



### Chatbot```## 🤝 Đóng góp (Contributing)

- **Google Gemini AI 0.8** - Conversational AI

- **FastAPI 0.115** - API framework



### DevOps### Frontend TestsChúng tôi hoan nghênh mọi sự đóng góp! Cho dù là báo lỗi, yêu cầu tính năng, hay gửi Pull Request, tất cả đều được chào đón.

- **Docker** - Containerization

- **Docker Compose** - Multi-container orchestration

- **GitHub Actions** - CI/CD (optional)

```bashTrước khi bắt đầu, vui lòng đọc kỹ tệp **[DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)**.

---

cd frontendĐây là tài liệu bắt buộc, định nghĩa toàn bộ triết lý, kiến trúc và các quy tắc code của dự án.

## 📊 Disease Coverage

npm run test:e2e        # Playwright E2E tests

Model DermLIP hỗ trợ phát hiện **44+ loại bệnh da liễu**, được phân loại theo mức độ nguy hiểm:

npm run test:e2e:ui     # E2E với UI mode### Quy trình đóng góp

### 🔴 Ung thư da (High Risk)

- Melanoma (Ung thư hắc tố)```1.  **Fork** dự án này.

- Basal Cell Carcinoma (Ung thư tế bào đáy)

- Squamous Cell Carcinoma (Ung thư tế bào vảy)2.  Tạo một branch mới (`git checkout -b feature/ten-tinh-nang`).

- Actinic Keratosis (Loạn sản tế bào sừng)

---3.  Thực hiện thay đổi và **commit** (hãy viết commit message rõ ràng).

### 🟡 Viêm da & Tình trạng Phổ biến (Moderate Risk)

- Eczema / Atopic Dermatitis (Chàm)4.  **Push** lên branch của bạn (`git push origin feature/ten-tinh-nang`).

- Psoriasis (Vảy nến)

- Contact Dermatitis (Viêm da tiếp xúc)## 🎨 Tech Stack5.  Mở một **Pull Request** và mô tả chi tiết các thay đổi của bạn.

- Rosacea (Rám má)

- Seborrheic Dermatitis (Viêm da tiết bã)

- Acne Vulgaris (Mụn trứng cá)

- Folliculitis (Viêm nang lông)### Frontend## 📊 Nguồn dữ liệu & Cảm ơn (Data Sources & Acknowledgments)

- Pityriasis Rosea (Hoa hồng tỳ)

- Lichen Planus (Liken phẳng)- **React 19** - UI framework



### 🟢 Tổn thương Lành tính (Low Risk)- **TypeScript** - Type safetyViệc phát triển mô hình Computer Vision sẽ không thể thực hiện được nếu không có các bộ dữ liệu y tế công cộng tuyệt vời và mô hình AI tiên tiến:

- Melanocytic Nevus (Nốt ruồi)

- Seborrheic Keratosis (U sừng tiết bã)- **Vite 5** - Build tool

- Dermatofibroma (U sợi da)

- Hemangioma (U máu)- **TailwindCSS 4** - Styling* **[DermLIP](https://arxiv.org/abs/2503.14911):** Mô hình CLIP chuyên biệt cho da liễu, được huấn luyện trên Derm1M dataset. Đây là nền tảng cốt lõi cho khả năng phân tích của chúng tôi.

- Cherry Angioma (U máu anh đào)

- Skin Tag / Acrochordon (Mụn thịt)- **react-i18next** - Internationalization* **[ISIC (International Skin Imaging Collaboration)](https://www.isic-archive.com/):** Nguồn dữ liệu tiêu chuẩn vàng cho các tổn thương da ác tính và lành tính.

- Wart / Verruca (Mụn cóc)

- Milia (Mụn cơm)* **[DermNet](https://dermnetnz.org/):** Một thư viện hình ảnh da liễu khổng lồ cho các bệnh lý phổ thông.



### 🦠 Nhiễm trùng Da liễu### Backend* **[OpenCLIP](https://github.com/mlfoundations/open_clip):** Framework mã nguồn mở cho CLIP models.

- Impetigo (Chốc lở)

- Cellulitis (Viêm mô tế bào)- **FastAPI** - Modern Python web framework

- Fungal Infections (Nhiễm nấm)

- Herpes Simplex (Herpes đơn giản)- **SQLAlchemy** - ORM### Trích dẫn (Citation)

- Molluscum Contagiosum (Mụn nước lây)

- **PostgreSQL** - Database

...và nhiều bệnh khác!

- **Alembic** - Database migrationsNếu bạn sử dụng dự án này hoặc DermLIP model, vui lòng trích dẫn:

---

- **Pydantic** - Data validation

## 📈 Đánh giá Rủi ro

```bibtex

### Logic Phân loại Rủi ro

### AI/ML@misc{yan2025derm1m,

DermaSafe AI sử dụng **Rules-Based Engine** kết hợp với AI predictions:

- **PyTorch 2.9** - Deep learning framework  title={Derm1M: A Million-Scale Vision-Language Dataset for Dermatology},

```python

# Triệu chứng nguy hiểm (Red Flags)- **DermLIP** - Pre-trained vision-language model cho dermatology  author={Siyuan Yan and Ming Hu and others},

RED_FLAGS = [

    'bleeding',      # Chảy máu- **OpenCLIP** - CLIP implementation  year={2025},

    'ulcers',        # Loét

    'rapid_spread',  # Lan nhanh- **ONNX Runtime** - Model inference optimization  eprint={2503.14911},

    'fever',         # Sốt

    'pus',          # Mủ  archivePrefix={arXiv}

    'bad_odor'      # Mùi hôi

]---}



# Triệu chứng cảnh báo (Warning Signs)```

WARNING_SIGNS = [

    'severe_itch',   # Ngứa rát## 📊 Disease Coverage

    'swelling',      # Sưng

    'discharge',     # Tiết dịchChúng tôi xin gửi lời cảm ơn sâu sắc đến các tổ chức và nhà nghiên cứu đã duy trì và chia sẻ các bộ dữ liệu và mô hình này.

    'pustules'       # Mụn mủ

]Model hỗ trợ phát hiện **44 loại bệnh da liễu**, bao gồm:



# Logic đánh giá## 📄 Giấy phép (License)

if has_red_flags or (AI_confidence > 0.8 and disease_is_cancer):

    risk_level = "HIGH"  # 🔴### Ung thư da (High Risk)

elif has_warning_signs or duration > 4_weeks:

    risk_level = "MODERATE"  # 🟡- Melanoma (Ung thư hắc tố)Dự án này được cấp phép theo **Giấy phép MIT**. Xem tệp `LICENSE` để biết chi tiết.

else:- Basal Cell Carcinoma (Ung thư tế bào đáy)

    risk_level = "LOW"  # 🟢- Squamous Cell Carcinoma (Ung thư tế bào vảy)

```- Actinic Keratosis (Loạn sản tế bào sừng)



### Kết quả Trả về### Viêm da & Tình trạng phổ biến (Moderate Risk)

- Eczema (Chàm)

```json- Psoriasis (Vảy nến)

{- Dermatitis (Viêm da)

  "risk_level": "MODERATE",- Rosacea (Rám má)

  "risk_score": 65,- Acne (Mụn trứng cá)

  "primary_diagnosis": {- Seborrheic Keratosis (U sừng tiết bã)

    "disease": "Eczema",

    "confidence": 0.82,### Tổn thương lành tính (Low Risk)

    "description": "Viêm da mạn tính..."- Nevus (Nốt ruồi)

  },- Wart (Mụn cóc)

  "alternative_diagnoses": [...],- Hemangioma (U máu)

  "explanation": {- Skin Tag (Mụn thịt)

    "reason": "Có triệu chứng ngứa và sưng dai dẳng",- ...và nhiều hơn nữa

    "action": "Nên đi khám bác sĩ trong 1-2 tuần"

  }---

}

```## ⚠️ Disclaimer



---**QUAN TRỌNG**: Ứng dụng này **KHÔNG PHẢI** là công cụ chẩn đoán y khoa.



## 🤝 Đóng góp (Contributing)- ✅ Chỉ dùng để sàng lọc và tham khảo ban đầu

- ✅ Kết quả chỉ mang tính chất gợi ý

Chúng tôi hoan nghênh mọi đóng góp! 🎉- ❌ KHÔNG thay thế ý kiến của bác sĩ chuyên khoa

- ❌ KHÔNG dùng để tự điều trị

### Quy trình Đóng góp

**Luôn tham khảo bác sĩ da liễu chuyên nghiệp cho chẩn đoán chính xác.**

1. **Fork** repository này

2. Tạo branch mới: `git checkout -b feature/tinh-nang-moi`---

3. Commit changes: `git commit -am 'Thêm tính năng XYZ'`

4. Push to branch: `git push origin feature/tinh-nang-moi`## 📝 License

5. Tạo **Pull Request** với mô tả chi tiết

- **Code**: CC BY-NC 4.0 (Non-commercial use only)

### Coding Standards- **DermLIP Model**: Research use only (theo license của DermLIP)



- ✅ Follow [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)---

- ✅ Write tests cho code mới

- ✅ Update documentation nếu cần## 🙏 Acknowledgments

- ✅ Ensure CI/CD passes

- ✅ Use meaningful commit messages- [DermLIP](https://github.com/SkinGPT-project/DermLIP) - Pre-trained dermatology AI model

- [Derm1M Dataset](https://huggingface.co/datasets/SkinGPT-project/Derm1M) - Training data

### Areas to Contribute- OpenCLIP team - CLIP implementation



- 🐛 **Bug fixes**: Tìm và fix bugs---

- ✨ **New features**: Thêm tính năng mới

- 📚 **Documentation**: Cải thiện docs## 👥 Contributors

- 🧪 **Testing**: Thêm test coverage

- 🌐 **i18n**: Thêm ngôn ngữ mới- **thienreal** - Project Lead & Development

- 🎨 **UI/UX**: Cải thiện giao diện

---

---

## 📧 Contact

## 🙏 Cảm ơn & Trích dẫn

- GitHub: [@thienreal](https://github.com/thienreal)

### Nguồn Dữ liệu & Models- Project Issues: [GitHub Issues](https://github.com/thienreal/GPPM/issues)



Dự án này không thể thực hiện được nếu không có:---



- **[DermLIP](https://arxiv.org/abs/2503.14911)** - Vision-language model chuyên biệt cho da liễu## 🗺️ Roadmap

- **[Derm1M Dataset](https://huggingface.co/datasets/SkinGPT-project/Derm1M)** - Dataset training với 1M+ ảnh da liễu

- **[ISIC Archive](https://www.isic-archive.com/)** - International Skin Imaging Collaboration- [x] Core AI integration

- **[DermNet](https://dermnetnz.org/)** - Comprehensive dermatology image library- [x] Frontend implementation

- **[OpenCLIP](https://github.com/mlfoundations/open_clip)** - Open source CLIP models- [x] Backend API

- [x] Risk assessment logic

### Trích dẫn (Citation)- [ ] User accounts & history

- [ ] Doctor consultation booking

Nếu bạn sử dụng DermaSafe AI hoặc DermLIP model trong nghiên cứu, vui lòng trích dẫn:- [ ] Mobile app (React Native)

- [ ] Multi-language expansion

```bibtex

@misc{yan2025derm1m,---

  title={Derm1M: A Million-Scale Vision-Language Dataset for Dermatology},

  author={Siyuan Yan and Ming Hu and others},**⭐ Nếu dự án hữu ích, hãy cho một star trên GitHub!**

  year={2025},
  eprint={2503.14911},
  archivePrefix={arXiv},
  primaryClass={cs.CV}
}

@software{dermasafe2025,
  title={DermaSafe AI: Open-source Dermatology Risk Screening System},
  author={Your Team},
  year={2025},
  url={https://github.com/mhiunguyen/GPPM}
}
```

---

## 📄 License

Dự án này được phát hành dưới **MIT License**.

- ✅ **Free**: Sử dụng miễn phí cho mục đích cá nhân và thương mại
- ✅ **Open Source**: Mã nguồn mở và minh bạch
- ✅ **Modifiable**: Có thể chỉnh sửa và phân phối lại

**Lưu ý**: DermLIP model có thể có license riêng. Vui lòng kiểm tra [DermLIP repository](https://github.com/SkinGPT-project/DermLIP) để biết chi tiết.

Xem file [LICENSE](LICENSE) để biết đầy đủ điều khoản.

---

## 🗺️ Roadmap

### ✅ Hoàn thành (v1.0)
- [x] Core AI integration với DermLIP
- [x] Frontend implementation với React 19
- [x] Backend API với FastAPI
- [x] Risk assessment logic
- [x] Chatbot với Gemini AI
- [x] Smart camera capture với real-time quality check
- [x] Symptom validation
- [x] Multi-language support (VI/EN)
- [x] Docker containerization

### 🚧 Đang phát triển (v1.1)
- [ ] User accounts & authentication
- [ ] Analysis history tracking
- [ ] Export reports (PDF)
- [ ] Email notifications
- [ ] Advanced analytics dashboard

### 📅 Kế hoạch Tương lai (v2.0+)
- [ ] Mobile app (React Native)
- [ ] Doctor consultation booking
- [ ] Telemedicine integration
- [ ] Multi-region support
- [ ] Offline mode
- [ ] Voice input support
- [ ] Accessibility improvements (WCAG 2.1)

---

## 📞 Contact & Support

### 👥 Team
- **Project Lead**: [@mhiunguyen](https://github.com/mhiunguyen)
- **Contributors**: Xem [Contributors](https://github.com/mhiunguyen/GPPM/graphs/contributors)

### 📧 Support Channels
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/mhiunguyen/GPPM/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/mhiunguyen/GPPM/discussions)
- 📧 **Email**: contact@dermasafe.ai

---

## ⭐ Star History

Nếu dự án này hữu ích cho bạn, hãy cho một star! ⭐

---

## 🔐 Security & Privacy

- ✅ **No data storage**: Ảnh không được lưu trên server
- ✅ **HTTPS only**: Tất cả kết nối đều được mã hóa
- ✅ **No tracking**: Không thu thập dữ liệu cá nhân
- ✅ **Open source**: Code có thể kiểm chứng
- ✅ **Local processing**: AI chạy trên server riêng

### Data Flow
```
User Device → Upload Image → AI Analysis (Ephemeral) → Results → Deleted Immediately
              ↓
         No Storage
```

---

## 🎓 Educational Use

Dự án này cũng phục vụ mục đích giáo dục:
- 📚 Learn about AI in healthcare
- 🏗️ Study microservices architecture
- 🧠 Understand deep learning deployment
- 🎨 Explore modern React patterns
- 🐳 Practice Docker & DevOps

---

**Made with ❤️ by DermaSafe AI Team**

*Disclaimer: This is a screening tool, not a diagnostic device. Always consult healthcare professionals for medical advice.*

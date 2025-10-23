# 📦 Hướng dẫn Cài đặt Chi tiết - DermaSafe AI

Tài liệu này cung cấp hướng dẫn cài đặt chi tiết cho DermaSafe AI trên các hệ điều hành khác nhau.

---

## 📋 Mục lục

- [Yêu cầu Hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt Docker](#cài-đặt-docker)
- [Cài đặt Dự án](#cài-đặt-dự-án)
- [Cấu hình Environment](#cấu-hình-environment)
- [Chạy Ứng dụng](#chạy-ứng-dụng)
- [Xử lý Sự cố](#xử-lý-sự-cố)

---

## 🖥️ Yêu cầu Hệ thống

### Phần cứng Tối thiểu

| Thành phần | Yêu cầu tối thiểu | Khuyến nghị |
|------------|-------------------|-------------|
| **CPU** | 4 cores (x86_64 / ARM64) | 8+ cores |
| **RAM** | 8 GB | 16 GB+ |
| **Storage** | 10 GB trống | 20 GB+ SSD |
| **GPU** | Không bắt buộc | NVIDIA GPU với 4GB+ VRAM |

### Hệ điều hành Hỗ trợ

- ✅ **Ubuntu** 20.04+ / Debian 11+
- ✅ **macOS** 12+ (Intel & Apple Silicon)
- ✅ **Windows** 10/11 (với WSL2)
- ✅ **Docker Desktop** trên các platform trên

### Phần mềm Yêu cầu

| Phần mềm | Phiên bản | Mục đích |
|----------|-----------|----------|
| **Docker** | 24.0+ | Container runtime |
| **Docker Compose** | 2.0+ | Multi-container orchestration |
| **Git** | 2.30+ | Version control |
| **Python** (optional) | 3.12+ | Development without Docker |
| **Node.js** (optional) | 18+ | Frontend development |

---

## 🐳 Cài đặt Docker

### Ubuntu / Debian

```bash
# 1. Gỡ cài đặt các phiên bản cũ (nếu có)
sudo apt-get remove docker docker-engine docker.io containerd runc

# 2. Cập nhật apt và cài đặt dependencies
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 3. Thêm Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Thêm Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Cài đặt Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. Thêm user vào docker group (để chạy không cần sudo)
sudo usermod -aG docker $USER
newgrp docker

# 7. Kiểm tra cài đặt
docker --version
docker compose version
```

### macOS

**Option 1: Docker Desktop (Khuyến nghị)**
```bash
# Download và cài đặt Docker Desktop từ:
# https://www.docker.com/products/docker-desktop/

# Sau khi cài đặt, kiểm tra:
docker --version
docker compose version
```

**Option 2: Homebrew**
```bash
# Cài đặt Docker qua Homebrew
brew install docker docker-compose

# Khởi động Docker daemon
open -a Docker

# Kiểm tra
docker --version
docker compose version
```

### Windows (WSL2)

1. **Kích hoạt WSL2**
```powershell
# Chạy PowerShell as Administrator
wsl --install
wsl --set-default-version 2
```

2. **Cài đặt Ubuntu trong WSL2**
```powershell
wsl --install -d Ubuntu-22.04
```

3. **Cài đặt Docker Desktop**
   - Download từ: https://www.docker.com/products/docker-desktop/
   - Enable "Use WSL 2 based engine" trong Settings

4. **Kiểm tra trong WSL2**
```bash
docker --version
docker compose version
```

---

## 📥 Cài đặt Dự án

### 1. Clone Repository

```bash
# Clone từ GitHub
git clone https://github.com/mhiunguyen/GPPM.git
cd GPPM

# Kiểm tra branch
git branch
git status
```

### 2. Cấu trúc Thư mục

Sau khi clone, bạn sẽ có cấu trúc:

```
GPPM/
├── frontend/              # React frontend
├── backend-api/           # FastAPI backend
├── ai-service/            # AI analysis service
├── chatbot-service/       # Gemini chatbot
├── dermatology_module/    # Dermatology analysis
├── smart_derma_capture/   # Smart capture module
├── docker-compose.yml     # Docker orchestration
├── quick_start.sh        # Quick start script
└── README.md
```

---

## ⚙️ Cấu hình Environment

### 1. Backend API Environment

```bash
cd backend-api

# Tạo file .env
cat > .env << 'EOF'
# Database Configuration (matches docker-compose.yml)
DATABASE_URL=postgresql://dermasafe_user:dermasafe_pass@postgres:5432/dermasafe

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development

# External Services
AI_SERVICE_URL=http://ai-service:8001
CHATBOT_SERVICE_URL=http://chatbot:8002

# CORS Origins
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# Logging
LOG_LEVEL=INFO
EOF

cd ..
```

### 2. AI Service Environment

```bash
cd ai-service

# Tạo file .env
cat > .env << 'EOF'
# AI Service Configuration
API_HOST=0.0.0.0
API_PORT=8001
ENVIRONMENT=development

# Model Configuration
MODEL_NAME=SkinGPT-project/DermLIP-CLIP
DEVICE=cpu  # Đổi thành 'cuda' nếu có GPU
MODEL_CACHE_DIR=./models

# Processing Configuration
MAX_IMAGE_SIZE=1024
BATCH_SIZE=1

# Logging
LOG_LEVEL=INFO
EOF

cd ..
```

### 3. Chatbot Service Environment

```bash
cd chatbot-service

# Tạo file .env
cat > .env << 'EOF'
# Chatbot Service Configuration
API_HOST=0.0.0.0
API_PORT=8002
ENVIRONMENT=development

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Logging
LOG_LEVEL=INFO
EOF

cd ..
```

**⚠️ Quan trọng**: Thay `your_gemini_api_key_here` bằng API key thực từ [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Frontend Environment (Optional)

```bash
cd frontend

# Tạo file .env (nếu cần custom)
cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000
VITE_CHATBOT_URL=http://localhost:8002
EOF

cd ..
```

---

## 🚀 Chạy Ứng dụng

### Option 1: Quick Start Script (Khuyến nghị)

```bash
# Cấp quyền thực thi
chmod +x quick_start.sh

# Chạy script
./quick_start.sh
```

Script sẽ:
- ✅ Kiểm tra Docker
- ✅ Tạo .env files
- ✅ Build images (lần đầu ~10 phút)
- ✅ Start containers
- ✅ Health check

### Option 2: Docker Compose Manual

```bash
# Build tất cả services
docker compose build

# Start tất cả services
docker compose up -d

# Xem logs
docker compose logs -f

# Hoặc xem logs của service cụ thể
docker compose logs -f ai-service
docker compose logs -f backend-api
docker compose logs -f frontend
```

### Option 3: Rebuild Single Service

```bash
# Rebuild chỉ một service
docker compose build frontend
docker compose up -d frontend

# Rebuild và restart
docker compose up -d --build frontend
```

---

## 🔍 Kiểm tra Cài đặt

### 1. Kiểm tra Containers

```bash
# Liệt kê các containers đang chạy
docker compose ps

# Output mong đợi:
# NAME                 IMAGE              STATUS        PORTS
# gppm-frontend-1      gppm-frontend      Up X mins     0.0.0.0:5173->5173/tcp
# gppm-backend-api-1   gppm-backend-api   Up X mins     0.0.0.0:8000->8000/tcp
# gppm-ai-service-1    gppm-ai-service    Up X mins     0.0.0.0:8001->8001/tcp
# gppm-chatbot-1       gppm-chatbot       Up X mins     0.0.0.0:8002->8002/tcp
# gppm-postgres-1      postgres:15        Up X mins     0.0.0.0:5432->5432/tcp
```

### 2. Health Checks

```bash
# Backend API
curl http://localhost:8000/health
# Expected: {"status":"ok"}

# AI Service
curl http://localhost:8001/health
# Expected: {"status":"ok","model_loaded":true}

# Chatbot Service
curl http://localhost:8002/health
# Expected: {"status":"ok"}

# Frontend
curl http://localhost:5173
# Expected: HTML response
```

### 3. Truy cập Web

Mở browser và truy cập:
- 🌐 **Frontend**: http://localhost:5173
- 📚 **API Docs (Backend)**: http://localhost:8000/docs
- 🤖 **API Docs (AI)**: http://localhost:8001/docs
- 💬 **API Docs (Chatbot)**: http://localhost:8002/docs

---

## 🛠️ Development Mode

### Chạy Frontend Dev Server (Hot Reload)

```bash
cd frontend

# Cài đặt dependencies
npm install

# Start dev server
npm run dev

# Frontend sẽ chạy tại http://localhost:5173 với hot reload
```

### Chạy Backend với Auto-reload

```bash
cd backend-api

# Cài đặt dependencies
pip install -r requirements.txt

# Start với reload
uvicorn backend_app.main:app --reload --host 0.0.0.0 --port 8000
```

### Database Migrations

```bash
cd backend-api

# Tạo migration mới
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 🐛 Xử lý Sự cố

### 1. Docker Daemon không chạy

**Triệu chứng:**
```
Cannot connect to the Docker daemon
```

**Giải pháp:**
```bash
# Ubuntu/Debian
sudo systemctl start docker
sudo systemctl enable docker

# macOS
open -a Docker

# Kiểm tra
docker ps
```

### 2. Port đã được sử dụng

**Triệu chứng:**
```
Bind for 0.0.0.0:5173 failed: port is already allocated
```

**Giải pháp:**
```bash
# Tìm process đang dùng port
sudo lsof -i :5173
sudo lsof -i :8000
sudo lsof -i :8001

# Kill process
sudo kill -9 <PID>

# Hoặc thay đổi port trong docker-compose.yml
```

### 3. Out of Memory (OOM)

**Triệu chứng:**
```
Container killed with OOM
```

**Giải pháp:**
```bash
# Tăng memory limit trong docker-compose.yml
services:
  ai-service:
    mem_limit: 4g  # Tăng lên 4GB
    
# Restart
docker compose up -d
```

### 4. Model Download Failed

**Triệu chứng:**
```
Failed to download model from HuggingFace
```

**Giải pháp:**
```bash
# Set HuggingFace cache directory
export HF_HOME=/path/to/cache

# Hoặc download manually
cd ai-service
python -c "
from transformers import CLIPModel
model = CLIPModel.from_pretrained('SkinGPT-project/DermLIP-CLIP')
"
```

### 5. Permission Denied

**Triệu chứng:**
```
Permission denied while trying to connect to Docker daemon
```

**Giải pháp:**
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER

# Logout và login lại, hoặc
newgrp docker
```

### 6. Frontend Build Failed

**Triệu chứng:**
```
npm ERR! Failed at build script
```

**Giải pháp:**
```bash
cd frontend

# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Rebuild
docker compose build frontend
```

### 7. Database Connection Failed

**Triệu chứng:**
```
could not connect to server: Connection refused
```

**Giải pháp:**
```bash
# Kiểm tra PostgreSQL container
docker compose ps postgres

# Restart PostgreSQL
docker compose restart postgres

# Xem logs
docker compose logs postgres

# Kiểm tra connection
docker compose exec postgres psql -U postgres -c "SELECT 1"
```

---

## 🔄 Cập nhật Dự án

### Pull Latest Changes

```bash
# Pull code mới
git pull origin main

# Rebuild containers
docker compose down
docker compose build
docker compose up -d

# Hoặc dùng --no-cache để build từ đầu
docker compose build --no-cache
```

### Update Dependencies

```bash
# Backend
cd backend-api
pip install -r requirements.txt --upgrade

# Frontend
cd frontend
npm update

# Rebuild
docker compose build
```

---

## 🧹 Dọn dẹp

### Xóa Containers & Images

```bash
# Stop và xóa containers
docker compose down

# Xóa containers, networks, và volumes
docker compose down -v

# Xóa images
docker compose down --rmi all

# Xóa mọi thứ (bao gồm volumes)
docker compose down -v --rmi all
```

### Dọn dẹp Docker System

```bash
# Xóa containers không dùng
docker container prune

# Xóa images không dùng
docker image prune -a

# Xóa volumes không dùng
docker volume prune

# Dọn dẹp toàn bộ
docker system prune -a --volumes
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề không được liệt kê ở trên:

1. **Check logs**: `docker compose logs -f [service-name]`
2. **Search issues**: [GitHub Issues](https://github.com/mhiunguyen/GPPM/issues)
3. **Create issue**: Mô tả chi tiết vấn đề + logs + environment
4. **Email**: contact@dermasafe.ai

---

## ✅ Checklist Cài đặt Thành công

- [ ] Docker và Docker Compose đã cài đặt
- [ ] Repository đã clone về
- [ ] File .env đã được tạo và cấu hình
- [ ] `docker compose ps` hiển thị tất cả containers "Up"
- [ ] Health checks pass (8000, 8001, 8002)
- [ ] Frontend truy cập được tại localhost:5173
- [ ] Upload ảnh và phân tích hoạt động
- [ ] Chatbot phản hồi bình thường

Chúc bạn cài đặt thành công! 🎉

#!/bin/bash
# Quick start script để test tích hợp dermatology_module

set -e

echo "🚀 GPPM - Dermatology Module Integration Quick Start"
echo "======================================================"
echo ""

# Kiểm tra Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt!"
    echo "   Vui lòng cài đặt Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker đã được cài đặt"

# Kiểm tra docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose chưa được cài đặt!"
    exit 1
fi

echo "✅ docker-compose đã được cài đặt"
echo ""

# Build services
echo "📦 Đang build Docker images..."
echo "   (Lần đầu sẽ mất ~5-10 phút để download dependencies)"
echo ""

docker-compose build ai-service

echo ""
echo "✅ Build thành công!"
echo ""

# Start services
echo "🚀 Đang khởi động services..."
echo ""

docker-compose up -d postgres
sleep 5  # Đợi postgres khởi động

docker-compose up -d ai-service

echo ""
echo "⏳ Đợi services khởi động hoàn toàn (30s)..."
sleep 30

echo ""
echo "🔍 Kiểm tra health của services..."
echo ""

# Test health endpoint
if curl -s http://localhost:8001/health | grep -q "ok"; then
    echo "✅ AI Service đang chạy!"
    echo ""
    
    # Hiển thị thông tin
    echo "📊 Thông tin service:"
    curl -s http://localhost:8001/health | python -m json.tool
    echo ""
else
    echo "❌ AI Service chưa sẵn sàng. Kiểm tra logs:"
    echo ""
    docker-compose logs ai-service
    exit 1
fi

echo ""
echo "🎉 Tích hợp thành công!"
echo ""
echo "📚 Các bước tiếp theo:"
echo ""
echo "1️⃣  Test API với curl:"
echo "   curl -X POST http://localhost:8001/analyze \\"
echo "     -F \"image=@path/to/your/image.jpg\""
echo ""
echo "2️⃣  Xem API documentation:"
echo "   open http://localhost:8001/docs"
echo ""
echo "3️⃣  Khởi động backend-api và frontend:"
echo "   docker-compose up -d backend-api frontend"
echo ""
echo "4️⃣  Xem logs:"
echo "   docker-compose logs -f ai-service"
echo ""
echo "5️⃣  Stop services:"
echo "   docker-compose down"
echo ""
echo "📖 Tài liệu chi tiết: docs/DERMATOLOGY_INTEGRATION.md"
echo ""

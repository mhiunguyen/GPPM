#!/bin/bash

# Script test phân tích ảnh da liễu

echo "🧪 Testing DermaSafe-AI Analysis..."
echo ""

# Tạo ảnh test đơn giản (1x1 pixel red)
echo "📸 Tạo ảnh test..."
convert -size 100x100 xc:red /tmp/test_skin.jpg 2>/dev/null || {
    # Nếu không có ImageMagick, dùng Python
    python3 -c "from PIL import Image; img = Image.new('RGB', (100, 100), color='red'); img.save('/tmp/test_skin.jpg')"
}

echo "✅ Ảnh test đã được tạo: /tmp/test_skin.jpg"
echo ""

echo "🔬 Gửi request phân tích..."
curl -X POST http://localhost:8001/analyze \
  -F "image=@/tmp/test_skin.jpg" \
  -F "symptoms_selected=red,itchy" \
  -F "duration=3 days" \
  | jq '.' || cat

echo ""
echo "✅ Test hoàn tất!"

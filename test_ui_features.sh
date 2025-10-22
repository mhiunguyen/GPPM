#!/bin/bash

echo "========================================="
echo "Testing GPPM UI Features"
echo "========================================="
echo ""

# Test 1: Frontend serving
echo "✓ Test 1: Frontend serving..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$STATUS" = "200" ]; then
    echo "  ✅ Frontend is accessible (HTTP $STATUS)"
else
    echo "  ❌ Frontend error (HTTP $STATUS)"
fi
echo ""

# Test 2: CSS Loading
echo "✓ Test 2: Tailwind CSS loading..."
CSS_CHECK=$(curl -s http://localhost:5173/src/index.css | grep -c "tailwindcss")
if [ "$CSS_CHECK" -gt 0 ]; then
    echo "  ✅ Tailwind CSS is loaded and compiled"
else
    echo "  ❌ CSS not found"
fi
echo ""

# Test 3: Camera button in code
echo "✓ Test 3: Camera button in container code..."
CAMERA_BTN=$(docker exec $(docker ps -qf "name=frontend") grep -c "Chụp ảnh" /app/src/components/DermaSafeAI.tsx 2>/dev/null || echo "0")
if [ "$CAMERA_BTN" -gt 0 ]; then
    echo "  ✅ Camera button code exists ($CAMERA_BTN occurrences)"
else
    echo "  ❌ Camera button not found"
fi
echo ""

# Test 4: CameraCapture component
echo "✓ Test 4: CameraCapture component..."
CAMERA_COMP=$(docker exec $(docker ps -qf "name=frontend") ls /app/src/components/CameraCapture.tsx 2>/dev/null)
if [ -n "$CAMERA_COMP" ]; then
    echo "  ✅ CameraCapture.tsx exists in container"
else
    echo "  ❌ CameraCapture.tsx not found"
fi
echo ""

# Test 5: API Capture endpoints
echo "✓ Test 5: API Capture endpoints..."
TIPS_COUNT=$(curl -s http://localhost:8000/api/v1/capture/tips | jq '.tips | length' 2>/dev/null || echo "0")
if [ "$TIPS_COUNT" -gt 0 ]; then
    echo "  ✅ Capture tips API working ($TIPS_COUNT tips)"
else
    echo "  ❌ Capture API error"
fi
echo ""

# Test 6: Analyze endpoint
echo "✓ Test 6: Analyze endpoint..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test_derma.png
ANALYZE_RESULT=$(curl -s -X POST http://localhost:8000/api/v1/analyze -F "image=@/tmp/test_derma.png" | jq -r '.risk' 2>/dev/null)
if [ -n "$ANALYZE_RESULT" ]; then
    echo "  ✅ Analyze API working (risk: $ANALYZE_RESULT)"
else
    echo "  ❌ Analyze API error"
fi
rm -f /tmp/test_derma.png
echo ""

# Test 7: Import statements
echo "✓ Test 7: Camera import in DermaSafeAI..."
CAMERA_IMPORT=$(docker exec $(docker ps -qf "name=frontend") grep -c "import.*Camera.*from.*lucide-react" /app/src/components/DermaSafeAI.tsx 2>/dev/null || echo "0")
if [ "$CAMERA_IMPORT" -gt 0 ]; then
    echo "  ✅ Camera icon imported from lucide-react"
else
    echo "  ❌ Camera import not found"
fi
echo ""

# Summary
echo "========================================="
echo "🎯 Test Summary:"
echo "  - Frontend: http://localhost:5173"
echo "  - API: http://localhost:8000"
echo "  - Services: $(docker compose ps --services | wc -l) running"
echo "========================================="
echo ""
echo "📝 Để xem UI:"
echo "  1. Mở browser: http://localhost:5173"
echo "  2. Nhấn Ctrl+Shift+R (hoặc Cmd+Shift+R) để hard reload"
echo "  3. Kiểm tra:"
echo "     ✓ Giao diện có CSS đầy đủ (màu sắc, bo góc)"
echo "     ✓ Có 2 nút: 'Chọn ảnh' (xanh dương) và 'Chụp ảnh' (xanh lá)"
echo "     ✓ Nhấn 'Chụp ảnh' → mở modal camera"
echo "     ✓ Upload ảnh → hiện kết quả chuẩn đoán"
echo ""

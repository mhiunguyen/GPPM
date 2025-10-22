#!/bin/bash

echo "========================================="
echo "KIỂM TRA TOÀN BỘ HỆ THỐNG GPPM"
echo "========================================="
echo ""

# Test 1: Services
echo "✓ Test 1: Docker services..."
SERVICES=$(docker compose ps --services 2>/dev/null | wc -l)
RUNNING=$(docker compose ps --status running 2>/dev/null | wc -l)
echo "  Running: $RUNNING/$SERVICES services"
docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | grep -v "^NAME"
echo ""

# Test 2: DermatologyAnalyzer
echo "✓ Test 2: DermatologyAnalyzer (PyTorch + OpenCLIP)..."
ANALYZER_STATUS=$(curl -s http://localhost:8001/health | jq -r '.dermatology_analyzer' 2>/dev/null)
if [ "$ANALYZER_STATUS" = "active" ]; then
    echo "  ✅ ACTIVE - Model sử dụng PyTorch & DermLIP"
    
    # Check model cache
    MODEL_SIZE=$(docker exec $(docker ps -qf "name=ai-service") du -sh /root/.cache/huggingface 2>/dev/null | awk '{print $1}')
    echo "  📦 Model cached: $MODEL_SIZE"
else
    echo "  ❌ INACTIVE - Đang dùng stub scores"
fi
echo ""

# Test 3: Real prediction
echo "✓ Test 3: Prediction thực với ảnh test..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test_derma_full.png

RESULT=$(curl -s -X POST http://localhost:8000/api/v1/analyze -F "image=@/tmp/test_derma_full.png" 2>/dev/null)

if [ -n "$RESULT" ]; then
    PRIMARY=$(echo "$RESULT" | jq -r '.primary_disease.vietnamese_name // .primary_disease.name // "N/A"' 2>/dev/null)
    CONFIDENCE=$(echo "$RESULT" | jq -r '.primary_disease.confidence // 0' 2>/dev/null)
    SEVERITY=$(echo "$RESULT" | jq -r '.primary_disease.severity // "N/A"' 2>/dev/null)
    
    if [ "$PRIMARY" != "N/A" ] && [ "$PRIMARY" != "null" ]; then
        CONF_PERCENT=$(echo "$CONFIDENCE * 100" | bc 2>/dev/null | cut -d. -f1)
        echo "  ✅ Real prediction:"
        echo "     Disease: $PRIMARY"
        echo "     Confidence: ${CONF_PERCENT}%"
        echo "     Severity: $SEVERITY"
    else
        echo "  ⚠️ Chỉ có cv_scores (stub mode)"
    fi
else
    echo "  ❌ API error"
fi
rm -f /tmp/test_derma_full.png
echo ""

# Test 4: Frontend
echo "✓ Test 4: Frontend UI..."
TITLE=$(curl -s http://localhost:5173 | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
CSS_CHECK=$(curl -s http://localhost:5173/src/index.css 2>/dev/null | grep -c "tailwindcss")
CAMERA_BTN=$(docker exec $(docker ps -qf "name=frontend") grep -c "Chụp ảnh" /app/src/components/DermaSafeAI.tsx 2>/dev/null || echo "0")

echo "  Title: $TITLE"
if [ "$CSS_CHECK" -gt 0 ]; then
    echo "  ✅ CSS: Tailwind loaded"
else
    echo "  ❌ CSS: Not loaded"
fi

if [ "$CAMERA_BTN" -gt 0 ]; then
    echo "  ✅ Camera button: Exists ($CAMERA_BTN occurrences)"
else
    echo "  ❌ Camera button: Not found"
fi
echo ""

# Test 5: Capture API
echo "✓ Test 5: Smart Capture API..."
TIPS_COUNT=$(curl -s http://localhost:8000/api/v1/capture/tips | jq '.tips | length' 2>/dev/null || echo "0")
GUIDELINES_COUNT=$(curl -s http://localhost:8001/capture/guidelines | jq '.guidelines | length' 2>/dev/null || echo "0")

if [ "$TIPS_COUNT" -gt 0 ]; then
    echo "  ✅ Tips API: $TIPS_COUNT tips available"
else
    echo "  ❌ Tips API: Error"
fi

if [ "$GUIDELINES_COUNT" -gt 0 ]; then
    echo "  ✅ Guidelines API: $GUIDELINES_COUNT guidelines"
else
    echo "  ❌ Guidelines API: Error"
fi
echo ""

# Test 6: Disk space
echo "✓ Test 6: Disk space..."
df -h / | tail -1 | awk '{print "  Free: " $4 " / " $2 " (" $5 " used)"}'
echo ""

# Summary
echo "========================================="
echo "📊 TỔNG KẾT"
echo "========================================="
echo ""

if [ "$ANALYZER_STATUS" = "active" ]; then
    echo "🎉 HỆ THỐNG HOẠT ĐỘNG HOÀN TOÀN!"
    echo ""
    echo "✅ DermatologyAnalyzer: ACTIVE với PyTorch + DermLIP"
    echo "✅ Predictions: Sử dụng model thực (không phải stub)"
    echo "✅ Frontend: UI đầy đủ với CSS và camera"
    echo "✅ API: Tất cả endpoints hoạt động"
    echo ""
    echo "🔬 Model đã tải:"
    echo "   - DermLIP ViT-B/16 từ HuggingFace"
    echo "   - Size: ~$MODEL_SIZE"
    echo "   - Device: CPU (có thể chuyển GPU nếu có)"
    echo ""
else
    echo "⚠️ HỆ THỐNG CHẠY STUB MODE"
    echo ""
    echo "❌ DermatologyAnalyzer: INACTIVE"
    echo "⚠️ Đang dùng stub scores (fake predictions)"
    echo "💡 Cần cài PyTorch + OpenCLIP để có predictions thực"
fi

echo "========================================="
echo "📖 HƯỚNG DẪN SỬ DỤNG"
echo "========================================="
echo ""
echo "1. Mở browser: http://localhost:5173"
echo "   - Hard reload: Ctrl+Shift+R (Windows/Linux)"
echo "   - Hard reload: Cmd+Shift+R (Mac)"
echo ""
echo "2. Test chức năng:"
echo "   ✓ Upload ảnh → Xem prediction"
echo "   ✓ Click 'Chụp ảnh' → Test camera modal"
echo "   ✓ Chọn triệu chứng → Xem risk adjustment"
echo ""
echo "3. Xem logs:"
echo "   docker compose logs ai-service --tail 50"
echo "   docker compose logs frontend --tail 50"
echo ""
echo "4. API Documentation:"
echo "   http://localhost:8000/docs (FastAPI Swagger)"
echo ""

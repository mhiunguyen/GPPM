#!/usr/bin/env python3
"""
Script kiểm tra tích hợp dermatology_module
"""

import sys
from pathlib import Path

# Thêm dermatology_module vào path
sys.path.insert(0, str(Path(__file__).parent / "dermatology_module"))

try:
    from dermatology_module.analyzer import DermatologyAnalyzer
    from dermatology_module.models import Severity
    print("✅ Import dermatology_module thành công!")
    
    # Kiểm tra khởi tạo analyzer
    print("\n🔍 Đang khởi tạo DermatologyAnalyzer...")
    analyzer = DermatologyAnalyzer()
    print("✅ DermatologyAnalyzer khởi tạo thành công!")
    
    # Kiểm tra thông tin
    print(f"\n📊 Thông tin:")
    print(f"   - Device: {analyzer.device}")
    print(f"   - Số bệnh trong database: {len(analyzer.disease_list)}")
    print(f"   - Các bệnh: {', '.join(analyzer.disease_list[:5])}...")
    
    # Test search by text
    print("\n🔍 Test tìm kiếm bằng text...")
    results = analyzer.search_by_text("dark irregular spot", top_k=3)
    for i, (disease, score) in enumerate(results, 1):
        print(f"   {i}. {disease}: {score:.2f}")
    
    print("\n✅ Tất cả kiểm tra đều thành công!")
    print("\n💡 Bước tiếp theo:")
    print("   1. Cài đặt dependencies: cd ai-service && pip install -r requirements.txt")
    print("   2. Build Docker images: docker-compose build")
    print("   3. Chạy services: docker-compose up")
    
except ImportError as e:
    print(f"❌ Lỗi import: {e}")
    print("\n💡 Hướng dẫn khắc phục:")
    print("   1. Cài đặt dependencies: pip install torch open_clip_torch pillow")
    print("   2. Kiểm tra lại cấu trúc thư mục dermatology_module")
    sys.exit(1)
except Exception as e:
    print(f"❌ Lỗi: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

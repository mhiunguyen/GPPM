<<<<<<< HEAD
"""
CLI (Command Line Interface) cho dermatology module
"""

import argparse
import sys
import json
from pathlib import Path

try:
    from dermatology_module import DermatologyAnalyzer
except ImportError:
    print("Error: Module chưa được cài đặt. Chạy: pip install -e .")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Phân tích ảnh da liễu từ command line",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ví dụ:
  # Phân tích một ảnh
  dermatology-analyze image.jpg
  
  # Phân tích và lưu kết quả ra JSON
  dermatology-analyze image.jpg --output result.json
  
  # Phân tích nhiều ảnh
  dermatology-analyze img1.jpg img2.jpg img3.jpg
  
  # Sử dụng mô hình PanDerm
  dermatology-analyze image.jpg --model panderm
  
  # Chỉ phân loại (nhanh hơn)
  dermatology-analyze image.jpg --classify-only
        """
    )
    
    parser.add_argument(
        'images',
        nargs='+',
        help='Đường dẫn đến ảnh cần phân tích'
    )
    
    parser.add_argument(
        '--model',
        choices=['vit', 'panderm'],
        default='vit',
        help='Mô hình sử dụng (vit: nhanh, panderm: chính xác hơn)'
    )
    
    parser.add_argument(
        '--device',
        choices=['cuda', 'cpu', 'auto'],
        default='auto',
        help='Thiết bị chạy (cuda/cpu/auto)'
    )
    
    parser.add_argument(
        '--classify-only',
        action='store_true',
        help='Chỉ phân loại, không phân tích đầy đủ (nhanh hơn)'
    )
    
    parser.add_argument(
        '--top-k',
        type=int,
        default=5,
        help='Số lượng chẩn đoán thay thế (mặc định: 5)'
    )
    
    parser.add_argument(
        '--output',
        '-o',
        help='File để lưu kết quả (JSON format)'
    )
    
    parser.add_argument(
        '--quiet',
        '-q',
        action='store_true',
        help='Chỉ in kết quả chính, không in thông tin chi tiết'
    )
    
    parser.add_argument(
        '--json',
        action='store_true',
        help='In kết quả dạng JSON'
    )
    
    args = parser.parse_args()
    
    # Xác định model name
    model_map = {
        'vit': 'hf-hub:redlessone/DermLIP_ViT-B-16',
        'panderm': 'hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256'
    }
    model_name = model_map[args.model]
    
    # Xác định device
    device = None if args.device == 'auto' else args.device
    
    # Khởi tạo analyzer
    if not args.quiet:
        print(f"Đang tải mô hình {args.model}...")
    
    try:
        analyzer = DermatologyAnalyzer(
            model_name=model_name,
            device=device
        )
    except Exception as e:
        print(f"Lỗi khi tải mô hình: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Phân tích từng ảnh
    results = []
    for image_path in args.images:
        if not Path(image_path).exists():
            print(f"Cảnh báo: Không tìm thấy file {image_path}", file=sys.stderr)
            continue
        
        if not args.quiet:
            print(f"\nĐang phân tích: {image_path}")
        
        try:
            if args.classify_only:
                # Chỉ phân loại
                classifications = analyzer.classify(image_path, top_k=args.top_k)
                
                if args.json:
                    result_data = {
                        "image": image_path,
                        "classifications": [
                            {"disease": d, "confidence": float(c)}
                            for d, c in classifications
                        ]
                    }
                    results.append(result_data)
                else:
                    print(f"\nKết quả cho {image_path}:")
                    for i, (disease, conf) in enumerate(classifications, 1):
                        print(f"  {i}. {disease}: {conf:.1%}")
            else:
                # Phân tích đầy đủ
                result = analyzer.analyze(image_path, top_k=args.top_k)
                
                if args.json:
                    result_data = result.to_dict()
                    result_data["image"] = image_path
                    results.append(result_data)
                elif args.quiet:
                    print(f"{image_path}: {result.primary_disease.vietnamese_name} ({result.primary_disease.confidence:.1%})")
                else:
                    print(result)
        
        except Exception as e:
            print(f"Lỗi khi phân tích {image_path}: {e}", file=sys.stderr)
            continue
    
    # Xuất kết quả ra file nếu được chỉ định
    if args.output:
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            if not args.quiet:
                print(f"\nĐã lưu kết quả vào {args.output}")
        except Exception as e:
            print(f"Lỗi khi lưu file: {e}", file=sys.stderr)
    
    # In JSON ra stdout nếu được yêu cầu
    if args.json and not args.output:
        print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
=======
"""
CLI (Command Line Interface) cho dermatology module
"""

import argparse
import sys
import json
from pathlib import Path

try:
    from dermatology_module import DermatologyAnalyzer
except ImportError:
    print("Error: Module chưa được cài đặt. Chạy: pip install -e .")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Phân tích ảnh da liễu từ command line",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ví dụ:
  # Phân tích một ảnh
  dermatology-analyze image.jpg
  
  # Phân tích và lưu kết quả ra JSON
  dermatology-analyze image.jpg --output result.json
  
  # Phân tích nhiều ảnh
  dermatology-analyze img1.jpg img2.jpg img3.jpg
  
  # Sử dụng mô hình PanDerm
  dermatology-analyze image.jpg --model panderm
  
  # Chỉ phân loại (nhanh hơn)
  dermatology-analyze image.jpg --classify-only
        """
    )
    
    parser.add_argument(
        'images',
        nargs='+',
        help='Đường dẫn đến ảnh cần phân tích'
    )
    
    parser.add_argument(
        '--model',
        choices=['vit', 'panderm'],
        default='vit',
        help='Mô hình sử dụng (vit: nhanh, panderm: chính xác hơn)'
    )
    
    parser.add_argument(
        '--device',
        choices=['cuda', 'cpu', 'auto'],
        default='auto',
        help='Thiết bị chạy (cuda/cpu/auto)'
    )
    
    parser.add_argument(
        '--classify-only',
        action='store_true',
        help='Chỉ phân loại, không phân tích đầy đủ (nhanh hơn)'
    )
    
    parser.add_argument(
        '--top-k',
        type=int,
        default=5,
        help='Số lượng chẩn đoán thay thế (mặc định: 5)'
    )
    
    parser.add_argument(
        '--output',
        '-o',
        help='File để lưu kết quả (JSON format)'
    )
    
    parser.add_argument(
        '--quiet',
        '-q',
        action='store_true',
        help='Chỉ in kết quả chính, không in thông tin chi tiết'
    )
    
    parser.add_argument(
        '--json',
        action='store_true',
        help='In kết quả dạng JSON'
    )
    
    args = parser.parse_args()
    
    # Xác định model name
    model_map = {
        'vit': 'hf-hub:redlessone/DermLIP_ViT-B-16',
        'panderm': 'hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256'
    }
    model_name = model_map[args.model]
    
    # Xác định device
    device = None if args.device == 'auto' else args.device
    
    # Khởi tạo analyzer
    if not args.quiet:
        print(f"Đang tải mô hình {args.model}...")
    
    try:
        analyzer = DermatologyAnalyzer(
            model_name=model_name,
            device=device
        )
    except Exception as e:
        print(f"Lỗi khi tải mô hình: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Phân tích từng ảnh
    results = []
    for image_path in args.images:
        if not Path(image_path).exists():
            print(f"Cảnh báo: Không tìm thấy file {image_path}", file=sys.stderr)
            continue
        
        if not args.quiet:
            print(f"\nĐang phân tích: {image_path}")
        
        try:
            if args.classify_only:
                # Chỉ phân loại
                classifications = analyzer.classify(image_path, top_k=args.top_k)
                
                if args.json:
                    result_data = {
                        "image": image_path,
                        "classifications": [
                            {"disease": d, "confidence": float(c)}
                            for d, c in classifications
                        ]
                    }
                    results.append(result_data)
                else:
                    print(f"\nKết quả cho {image_path}:")
                    for i, (disease, conf) in enumerate(classifications, 1):
                        print(f"  {i}. {disease}: {conf:.1%}")
            else:
                # Phân tích đầy đủ
                result = analyzer.analyze(image_path, top_k=args.top_k)
                
                if args.json:
                    result_data = result.to_dict()
                    result_data["image"] = image_path
                    results.append(result_data)
                elif args.quiet:
                    print(f"{image_path}: {result.primary_disease.vietnamese_name} ({result.primary_disease.confidence:.1%})")
                else:
                    print(result)
        
        except Exception as e:
            print(f"Lỗi khi phân tích {image_path}: {e}", file=sys.stderr)
            continue
    
    # Xuất kết quả ra file nếu được chỉ định
    if args.output:
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            if not args.quiet:
                print(f"\nĐã lưu kết quả vào {args.output}")
        except Exception as e:
            print(f"Lỗi khi lưu file: {e}", file=sys.stderr)
    
    # In JSON ra stdout nếu được yêu cầu
    if args.json and not args.output:
        print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4

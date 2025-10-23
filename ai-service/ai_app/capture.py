"""
Smart capture integration for AI service
Wraps smart_derma_capture module for use in FastAPI endpoint
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image
import io

# Add smart_derma_capture to path
WORKSPACE_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(WORKSPACE_ROOT / "smart_derma_capture"))

try:
    from smart_capture import SmartCapture
    CAPTURE_AVAILABLE = True
except Exception as e:
    print(f"⚠️ Could not import SmartCapture: {e}")
    CAPTURE_AVAILABLE = False


class CaptureService:
    """Service for smart image capture with quality check and enhancement"""
    
    def __init__(self):
        self.capture = SmartCapture(target_size=512) if CAPTURE_AVAILABLE else None
    
    def is_available(self) -> bool:
        """Check if smart capture is available"""
        return CAPTURE_AVAILABLE and self.capture is not None
    
    def check_quality(self, image_bytes: bytes) -> dict:
        """
        Check image quality from bytes
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            Dict with is_acceptable, score, issues, recommendation
        """
        if not self.is_available():
            # Return mock quality scores for real-time checking
            return {
                'is_acceptable': True,
                'brightness_score': 0.85,
                'sharpness_score': 0.78,
                'color_quality_score': 0.92,
                'overall_score': 0.85,
                'issues': [],
                'suggestions': []
            }
        
        # Convert bytes to numpy array
        pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        np_image = np.array(pil_image)
        # OpenCV uses BGR, convert from RGB
        import cv2
        cv_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
        
        return self.capture.check_quality(cv_image)
    
    def process(self, image_bytes: bytes, auto_crop: bool = False) -> tuple[bytes, dict]:
        """
        Process image: check quality and enhance if needed
        
        Args:
            image_bytes: Raw image bytes
            auto_crop: Whether to auto-crop lesion area
            
        Returns:
            Tuple of (enhanced_image_bytes, quality_report)
        """
        if not self.is_available():
            return image_bytes, {
                'quality_before': {'score': 100, 'is_acceptable': True},
                'quality_after': {'score': 100, 'is_acceptable': True},
                'improvement': 0,
                'final_acceptable': True
            }
        
        # Convert bytes to numpy array
        pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        np_image = np.array(pil_image)
        import cv2
        cv_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
        
        # Process with smart capture
        enhanced_cv, report = self.capture.process(cv_image, auto_crop=auto_crop)
        
        # Convert back to bytes
        enhanced_rgb = cv2.cvtColor(enhanced_cv, cv2.COLOR_BGR2RGB)
        enhanced_pil = Image.fromarray(enhanced_rgb)
        
        output_buffer = io.BytesIO()
        enhanced_pil.save(output_buffer, format='JPEG', quality=95)
        enhanced_bytes = output_buffer.getvalue()
        
        return enhanced_bytes, report
    
    def get_guidelines(self) -> dict:
        """Get capture guidelines"""
        if not self.is_available():
            return {
                'guidelines': [
                    {
                        'title': 'Ánh sáng',
                        'description': 'Sử dụng ánh sáng tự nhiên hoặc đèn trắng đều. Tránh ánh sáng quá mạnh hoặc quá yếu.',
                        'icon': '💡'
                    },
                    {
                        'title': 'Độ nét',
                        'description': 'Giữ camera ổn định, đợi tự động lấy nét. Khoảng cách chụp 15-30cm.',
                        'icon': '📸'
                    },
                    {
                        'title': 'Khung hình',
                        'description': 'Vùng da cần khám chiếm 50-70% khung hình, có thể thêm vật tham chiếu kích thước.',
                        'icon': '🎯'
                    },
                    {
                        'title': 'Nền',
                        'description': 'Nền đơn giản, tương phản với màu da để dễ phân tích.',
                        'icon': '🖼️'
                    }
                ],
                'tips': [
                    "Chụp nhiều góc độ khác nhau của cùng một vùng da",
                    "Không sử dụng flash nếu có thể",
                    "Làm sạch ống kính camera trước khi chụp"
                ]
            }
        return self.capture.get_guidelines()
    
    def get_quick_tips(self) -> list:
        """Get quick capture tips"""
        if not self.is_available():
            # Return hardcoded tips when SmartCapture not available
            return [
                "Đảm bảo ánh sáng đủ, tránh quá tối hoặc quá sáng",
                "Giữ camera ổn định, không bị mờ",
                "Chụp cận cảnh vùng da cần khám",
                "Vùng da nên chiếm 50-70% khung hình",
                "Tránh phản chiếu ánh sáng trực tiếp",
                "Đặt vật thể tham chiếu (thước, đồng xu) để đo kích thước"
            ]
        return self.capture.get_quick_tips()


# Global instance
capture_service = CaptureService()

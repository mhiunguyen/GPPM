"""
Smart image capture with quality check and enhancement
"""

import sys
import cv2
import numpy as np
from pathlib import Path
from typing import Tuple, Dict, Optional, Union

# Import from parent dermatology_module
sys.path.insert(0, str(Path(__file__).parent.parent))
from dermatology_module import (
    ImageQualityChecker,
    ImageEnhancer,
    CaptureGuide
)

class SmartCapture:
    """
    Smart capture system with quality check and auto-enhancement
    
    Example:
        >>> capture = SmartCapture()
        >>> enhanced, report = capture.process("image.jpg")
        >>> print(report['quality_score'])
    """
    
    def __init__(self, target_size=512):
        """
        Initialize smart capture
        
        Args:
            target_size: Target image size for processing
        """
        self.checker = ImageQualityChecker()
        self.enhancer = ImageEnhancer(target_size=target_size)
        self.guide = CaptureGuide()
    
    def check_quality(self, image: Union[str, np.ndarray]) -> Dict:
        """
        Check image quality
        
        Args:
            image: Image path or numpy array
            
        Returns:
            Dict with is_acceptable, score, issues, recommendations
        """
        if isinstance(image, str):
            image = cv2.imread(image)
        
        is_acceptable, issues, score = self.checker.check_quality(image)
        
        return {
            'is_acceptable': is_acceptable,
            'score': score,
            'issues': [
                {
                    'message': issue.message,
                    'suggestion': issue.suggestion,
                    'severity': issue.severity
                }
                for issue in issues
            ],
            'recommendation': self._get_recommendation(score)
        }
    
    def check_realtime(self, image: Union[str, np.ndarray]) -> Dict:
        """
        Fast real-time quality check (for camera preview)
        
        Args:
            image: Image path or numpy array
            
        Returns:
            Dict with ready_to_capture, brightness, sharpness, issues
        """
        if isinstance(image, str):
            image = cv2.imread(image)
        
        return self.checker.check_realtime(image)
    
    def enhance(self, image: Union[str, np.ndarray], auto_crop=False) -> np.ndarray:
        """
        Enhance image quality
        
        Args:
            image: Image path or numpy array
            auto_crop: Auto crop lesion area
            
        Returns:
            Enhanced image as numpy array
        """
        if isinstance(image, str):
            image = cv2.imread(image)
        
        return self.enhancer.enhance(image, auto_crop=auto_crop)
    
    def process(
        self, 
        image: Union[str, np.ndarray],
        auto_crop=False
    ) -> Tuple[np.ndarray, Dict]:
        """
        Complete processing pipeline: check quality → enhance → verify
        
        Args:
            image: Image path or numpy array
            auto_crop: Auto crop lesion area
            
        Returns:
            Tuple of (enhanced_image, quality_report)
        """
        # Load image
        if isinstance(image, str):
            original = cv2.imread(image)
        else:
            original = image.copy()
        
        # Check initial quality
        quality_before = self.check_quality(original)
        
        # Enhance if needed
        if not quality_before['is_acceptable']:
            enhanced = self.enhance(original, auto_crop=auto_crop)
        else:
            enhanced = original
        
        # Check quality after enhancement
        quality_after = self.check_quality(enhanced)
        
        # Build report
        report = {
            'quality_before': quality_before,
            'quality_after': quality_after,
            'improvement': quality_after['score'] - quality_before['score'],
            'final_acceptable': quality_after['is_acceptable']
        }
        
        return enhanced, report
    
    def get_guidelines(self) -> Dict:
        """Get capture guidelines and tips"""
        return self.guide.get_guidelines()
    
    def get_quick_tips(self) -> list:
        """Get quick capture tips"""
        return self.guide.get_quick_tips()
    
    def _get_recommendation(self, score: int) -> str:
        """Get recommendation based on score"""
        if score >= 90:
            return "Chất lượng xuất sắc! Có thể phân tích ngay."
        elif score >= 75:
            return "Chất lượng tốt. Phù hợp cho phân tích."
        elif score >= 60:
            return "Chất lượng chấp nhận được. Nên cải thiện trước khi phân tích."
        elif score >= 40:
            return "Chất lượng thấp. Cần chụp lại hoặc cải thiện ảnh."
        else:
            return "Chất lượng rất kém. Vui lòng chụp lại ảnh."

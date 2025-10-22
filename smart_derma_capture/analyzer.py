"""
Core analyzer for skin disease classification
"""

import sys
import os
from pathlib import Path

# Import from parent dermatology_module
sys.path.insert(0, str(Path(__file__).parent.parent))
from dermatology_module import DermatologyAnalyzer as _BaseAnalyzer

class DermaAnalyzer:
    """
    Simplified dermatology analyzer
    
    Example:
        >>> analyzer = DermaAnalyzer()
        >>> result = analyzer.analyze("image.jpg")
        >>> print(result.disease)
    """
    
    def __init__(self, model_name="ViT-B/16", device="cpu"):
        """
        Initialize analyzer
        
        Args:
            model_name: "ViT-B/16" (fast) or "PanDerm-base-w-PubMed-256" (accurate)
            device: "cuda" or "cpu" (default)
        """
        # Auto-detect device if not specified
        import torch
        if device == "auto":
            device = "cuda" if torch.cuda.is_available() else "cpu"
        
        self._model_name = model_name
        self._device = device
        self._analyzer = _BaseAnalyzer(model_name=model_name, device=device)
    
    def analyze(self, image_path, top_k=5):
        """
        Analyze skin image
        
        Args:
            image_path: Path to image file
            top_k: Number of top predictions
            
        Returns:
            AnalysisResult with disease, confidence, severity, recommendations
        """
        return self._analyzer.analyze(image_path, top_k=top_k)
    
    def search_by_symptoms(self, text, top_k=5):
        """
        Search diseases by symptom description
        
        Args:
            text: Symptom description in Vietnamese
            top_k: Number of results
            
        Returns:
            List of matching diseases
        """
        return self._analyzer.search_by_text(text, top_k=top_k)
    
    @property
    def device(self):
        """Current device (cuda/cpu)"""
        return self._device
    
    @property
    def model_name(self):
        """Current model name"""
        return self._model_name

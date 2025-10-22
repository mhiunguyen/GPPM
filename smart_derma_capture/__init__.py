"""
Smart Derma Capture - AI-powered dermatology image capture & analysis
=====================================================================

Smart image capture with real-time quality check and disease analysis

Quick Start:
    >>> from smart_derma_capture import DermaAnalyzer, SmartCapture
    >>> 
    >>> # Smart capture
    >>> capture = SmartCapture()
    >>> enhanced, report = capture.process("skin.jpg")
    >>> 
    >>> # Analyze
    >>> analyzer = DermaAnalyzer()
    >>> result = analyzer.analyze(enhanced)
"""

from .analyzer import DermaAnalyzer
from .smart_capture import SmartCapture
from .models import AnalysisResult, DiseaseInfo, Severity, QualityReport

__version__ = "1.0.0"
__author__ = "Derm1M Team"
__description__ = "Smart dermatology image capture with AI analysis"
__all__ = [
    "DermaAnalyzer",
    "SmartCapture",
    "AnalysisResult",
    "DiseaseInfo",
    "Severity",
    "QualityReport",
]

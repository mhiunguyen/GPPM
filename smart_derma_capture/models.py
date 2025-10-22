"""
Data models
"""

import sys
from pathlib import Path

# Import from parent dermatology_module
sys.path.insert(0, str(Path(__file__).parent.parent))
from dermatology_module.models import (
    AnalysisResult,
    DiseaseInfo,
    Severity
)

# Re-export
__all__ = ['AnalysisResult', 'DiseaseInfo', 'Severity', 'QualityReport']


class QualityReport:
    """Image quality report"""
    
    def __init__(self, score: int, is_acceptable: bool, issues: list):
        self.score = score
        self.is_acceptable = is_acceptable
        self.issues = issues
    
    def __repr__(self):
        return f"QualityReport(score={self.score}, acceptable={self.is_acceptable})"

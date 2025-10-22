<<<<<<< HEAD
"""
Cấu hình cho module
"""

# Các mô hình có sẵn
AVAILABLE_MODELS = {
    "dermlip-vit": "hf-hub:redlessone/DermLIP_ViT-B-16",
    "dermlip-panderm": "hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256"
}

# Cấu hình mặc định
DEFAULT_CONFIG = {
    "model": "dermlip-vit",
    "device": None,  # Auto-detect
    "top_k": 5,
    "confidence_threshold": 0.3,
    "include_concepts": True
}

# Ngưỡng mức độ nghiêm trọng
SEVERITY_THRESHOLDS = {
    "urgent": ["melanoma", "basal cell carcinoma", "squamous cell carcinoma"],
    "moderate": ["actinic keratosis", "psoriasis"],
    "mild": ["eczema", "dermatitis", "wart"],
    "benign": ["nevus", "seborrheic keratosis"]
}
=======
"""
Cấu hình cho module
"""

# Các mô hình có sẵn
AVAILABLE_MODELS = {
    "dermlip-vit": "hf-hub:redlessone/DermLIP_ViT-B-16",
    "dermlip-panderm": "hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256"
}

# Cấu hình mặc định
DEFAULT_CONFIG = {
    "model": "dermlip-vit",
    "device": None,  # Auto-detect
    "top_k": 5,
    "confidence_threshold": 0.3,
    "include_concepts": True
}

# Ngưỡng mức độ nghiêm trọng
SEVERITY_THRESHOLDS = {
    "urgent": ["melanoma", "basal cell carcinoma", "squamous cell carcinoma"],
    "moderate": ["actinic keratosis", "psoriasis"],
    "mild": ["eczema", "dermatitis", "wart"],
    "benign": ["nevus", "seborrheic keratosis"]
}
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4

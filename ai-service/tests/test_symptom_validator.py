"""
Test cases cho symptom_validator logic
"""
import pytest
from ai_app.logic.symptom_validator import (
    validate_and_extract_symptoms,
    is_valid_symptom_description,
    extract_symptoms,
    normalize_text
)


class TestNormalizeText:
    """Test normalize_text function"""
    
    def test_lowercase(self):
        assert normalize_text("NGỨA ĐỎ") == "ngứa đỏ"
    
    def test_remove_punctuation(self):
        assert normalize_text("Ngứa, đỏ!!! Sưng???") == "ngứa đỏ sưng"
    
    def test_remove_extra_spaces(self):
        assert normalize_text("ngứa   đỏ    sưng") == "ngứa đỏ sưng"


class TestValidSymptomDescription:
    """Test is_valid_symptom_description function"""
    
    def test_valid_symptoms(self):
        assert is_valid_symptom_description("Da tôi bị ngứa và đỏ") == True
        assert is_valid_symptom_description("Có mụn đỏ, ngứa, chảy nước") == True
        assert is_valid_symptom_description("Sưng đỏ, đau, có mủ") == True
    
    def test_invalid_non_symptoms(self):
        assert is_valid_symptom_description("Đẹp trai") == False
        assert is_valid_symptom_description("Mèo cắn em") == False
        assert is_valid_symptom_description("Buồn quá") == False
    
    def test_too_short_no_keyword(self):
        assert is_valid_symptom_description("ok") == False
        assert is_valid_symptom_description("vâng") == False


class TestExtractSymptoms:
    """Test extract_symptoms function"""
    
    def test_extract_single_symptom(self):
        symptoms = extract_symptoms("Da tôi bị ngứa")
        assert "ngứa" in symptoms
    
    def test_extract_multiple_symptoms(self):
        symptoms = extract_symptoms("Bị ngứa, đỏ và sưng")
        assert "ngứa" in symptoms
        assert "đỏ" in symptoms
        assert "sưng" in symptoms
    
    def test_extract_synonyms(self):
        # Test từ đồng nghĩa
        symptoms = extract_symptoms("Da bị itchy và red")
        assert "ngứa" in symptoms
        assert "đỏ" in symptoms
    
    def test_no_symptoms_found(self):
        symptoms = extract_symptoms("Đẹp trai quá")
        assert len(symptoms) == 0


class TestValidateAndExtract:
    """Test main validate_and_extract_symptoms function"""
    
    def test_valid_vietnamese_symptoms(self):
        result = validate_and_extract_symptoms("Da tôi bị ngứa và đỏ", language="vi")
        assert result["valid"] == True
        assert "ngứa" in result["symptoms"]
        assert "đỏ" in result["symptoms"]
        assert len(result["response"]) > 0
    
    def test_valid_english_symptoms(self):
        result = validate_and_extract_symptoms("My skin is itchy and red", language="en")
        assert result["valid"] == True
        assert "ngứa" in result["symptoms"]
        assert "đỏ" in result["symptoms"]
        assert len(result["response"]) > 0
    
    def test_invalid_input_handsome(self):
        result = validate_and_extract_symptoms("Đẹp trai", language="vi")
        assert result["valid"] == False
        assert len(result["symptoms"]) == 0
        assert "không phải triệu chứng" in result["response"]
    
    def test_invalid_input_animal(self):
        result = validate_and_extract_symptoms("Mèo cắn em", language="vi")
        assert result["valid"] == False
        assert "cún/mèo" in result["response"]
    
    def test_invalid_input_emotion(self):
        result = validate_and_extract_symptoms("Buồn quá", language="vi")
        assert result["valid"] == False
        assert "cảm xúc" in result["response"].lower()
    
    def test_empty_input(self):
        result = validate_and_extract_symptoms("", language="vi")
        assert result["valid"] == False
        assert "chưa nhập" in result["response"].lower()
    
    def test_serious_symptoms_response(self):
        result = validate_and_extract_symptoms("Da bị đau, sưng và chảy mủ", language="vi")
        assert result["valid"] == True
        assert "chú ý" in result["response"].lower() or "theo dõi" in result["response"].lower()
    
    def test_mild_symptoms_response(self):
        result = validate_and_extract_symptoms("Da hơi ngứa và khô", language="vi")
        assert result["valid"] == True
        assert len(result["symptoms"]) > 0


class TestEdgeCases:
    """Test edge cases"""
    
    def test_mixed_language(self):
        result = validate_and_extract_symptoms("Da bị itchy và đỏ", language="vi")
        assert result["valid"] == True
        assert "ngứa" in result["symptoms"]
        assert "đỏ" in result["symptoms"]
    
    def test_very_long_description(self):
        long_text = "Da tôi bị ngứa rất nhiều, đỏ ửng, sưng to, đau nhức, có mụn nước, chảy dịch, khô ráp, bong vảy, màu nâu sẫm"
        result = validate_and_extract_symptoms(long_text, language="vi")
        assert result["valid"] == True
        assert len(result["symptoms"]) > 5
    
    def test_uppercase_input(self):
        result = validate_and_extract_symptoms("NGỨA ĐỎ SƯNG", language="vi")
        assert result["valid"] == True
        assert len(result["symptoms"]) >= 3
    
    def test_special_characters(self):
        result = validate_and_extract_symptoms("Da bị ngứa!!! Đỏ??? Sưng...", language="vi")
        assert result["valid"] == True
        assert "ngứa" in result["symptoms"]

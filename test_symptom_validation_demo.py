#!/usr/bin/env python3
"""
Demo script để test symptom validation logic
Chạy: python test_symptom_validation_demo.py
"""

import sys
from pathlib import Path

# Add ai-service to path
sys.path.insert(0, str(Path(__file__).parent / "ai-service"))

from ai_app.logic.symptom_validator import validate_and_extract_symptoms

def print_result(description, language="vi"):
    """Helper để in kết quả đẹp"""
    print("\n" + "="*80)
    print(f"📝 Input: {description}")
    print(f"🌐 Language: {language}")
    print("-"*80)
    
    result = validate_and_extract_symptoms(description, language)
    
    print(f"✅ Valid: {result['valid']}")
    print(f"🏥 Symptoms: {', '.join(result['symptoms']) if result['symptoms'] else 'None'}")
    print(f"💬 Response: {result['response']}")
    print("="*80)


def main():
    print("\n🩺 DERMASAFE AI - SYMPTOM VALIDATION DEMO 🩺\n")
    
    # Test case 1: Valid symptoms (Vietnamese)
    print("\n📌 TEST 1: Valid Vietnamese Symptoms")
    print_result("Da tôi bị ngứa và đỏ", "vi")
    
    # Test case 2: Valid symptoms with serious indicators
    print("\n📌 TEST 2: Serious Symptoms")
    print_result("Bị đau, sưng to, chảy mủ vàng", "vi")
    
    # Test case 3: Valid symptoms (English)
    print("\n📌 TEST 3: Valid English Symptoms")
    print_result("My skin is itchy and red", "en")
    
    # Test case 4: Invalid - personality
    print("\n📌 TEST 4: Invalid Input - Personality")
    print_result("Đẹp trai", "vi")
    
    # Test case 5: Invalid - animal
    print("\n📌 TEST 5: Invalid Input - Animal Bite")
    print_result("Mèo cắn em", "vi")
    
    # Test case 6: Invalid - emotion
    print("\n📌 TEST 6: Invalid Input - Emotion")
    print_result("Buồn quá", "vi")
    
    # Test case 7: Complex valid symptoms
    print("\n📌 TEST 7: Complex Valid Symptoms")
    print_result("Da bị ngứa nhiều, đỏ ửng, có mụn nước, chảy dịch màu vàng", "vi")
    
    # Test case 8: Empty input
    print("\n📌 TEST 8: Empty Input")
    print_result("", "vi")
    
    # Test case 9: Mixed language
    print("\n📌 TEST 9: Mixed Language")
    print_result("Da bị itchy và red, có swelling", "vi")
    
    # Test case 10: Mild symptoms
    print("\n📌 TEST 10: Mild Symptoms")
    print_result("Da hơi khô và ngứa nhẹ", "vi")
    
    print("\n✨ DEMO COMPLETED! ✨\n")


if __name__ == "__main__":
    main()

"""
Logic để validate và extract triệu chứng từ mô tả tự do của người dùng
"""
import re
from typing import List, Dict, Tuple


# Từ điển triệu chứng da liễu với các từ đồng nghĩa
SYMPTOM_KEYWORDS = {
    # Triệu chứng chính
    "ngứa": ["ngứa", "ngứa ngáy", "swollen", "itchy", "itching", "ngứa ran"],
    "đỏ": ["đỏ", "red", "redness", "sưng đỏ", "đỏ ửng", "bị đỏ"],
    "sưng": ["sưng", "swelling", "swollen", "phồng", "phù"],
    "đau": ["đau", "pain", "painful", "nhức", "buồn"],
    "nổi mụn": ["mụn", "acne", "pimple", "mụn đầu đen", "mụn trứng cá", "nổi mụn"],
    "vảy": ["vảy", "flaky", "scaling", "bong vảy", "bong tróc"],
    "khô": ["khô", "dry", "dryness", "khô ráp", "da khô"],
    "chảy nước": ["chảy nước", "oozing", "weeping", "tiết dịch"],
    
    # Hình dáng tổn thương
    "nốt": ["nốt", "nodule", "bump", "u nhỏ"],
    "mảng": ["mảng", "patch", "plaque", "vùng"],
    "mụn nước": ["mụn nước", "blister", "vesicle", "bóng nước"],
    "vết loét": ["loét", "ulcer", "vết thương", "vết hở"],
    
    # Màu sắc
    "trắng": ["trắng", "white", "nhạt màu"],
    "nâu": ["nâu", "brown", "sạm", "sẫm màu"],
    "đen": ["đen", "black", "sẫm đen"],
    "vàng": ["vàng", "yellow"],
    
    # Cảm giác
    "rát": ["rát", "burning", "bỏng rát", "nóng rát"],
    "châm chích": ["châm chích", "tingling", "tê", "tê châm"],
    "tê": ["tê", "numb", "numbness"],
    
    # Lan rộng
    "lan rộng": ["lan", "spreading", "lan rộng", "lan ra"],
    "khu trú": ["khu trú", "localized", "một chỗ", "cố định"],
    
    # Tiết dịch
    "mủ": ["mủ", "pus", "mủ vàng"],
    "máu": ["máu", "blood", "bleeding", "chảy máu"],
    
    # Triệu chứng toàn thân
    "sốt": ["sốt", "fever", "nóng người"],
    "mệt mỏi": ["mệt", "tired", "fatigue", "mệt mỏi", "uể oải"],
}

# Các từ không phải triệu chứng (invalid input)
INVALID_KEYWORDS = [
    # Tính cách/cảm xúc
    "đẹp", "xấu", "trai", "gái", "buồn", "vui", "hạnh phúc", "khó chịu",
    # Động vật
    "chó", "mèo", "chuột", "gà", "vịt",
    # Tên bệnh (không cho phép tự chẩn đoán)
    "ung thư", "cancer", "melanoma", "bệnh",
    # Câu hỏi chung
    "là gì", "thế nào", "ở đâu", "khi nào",
]


def normalize_text(text: str) -> str:
    """Chuẩn hóa văn bản về dạng lowercase, loại bỏ dấu câu thừa"""
    text = text.lower().strip()
    # Loại bỏ dấu câu thừa nhưng giữ lại space
    text = re.sub(r'[^\w\s]', ' ', text)
    # Loại bỏ space thừa
    text = re.sub(r'\s+', ' ', text)
    return text


def is_valid_symptom_description(text: str) -> bool:
    """
    Kiểm tra xem mô tả có phải là triệu chứng hợp lệ không
    Returns:
        True nếu là triệu chứng hợp lệ
        False nếu là nội dung không liên quan
    """
    normalized = normalize_text(text)
    
    # Kiểm tra invalid keywords
    for invalid_word in INVALID_KEYWORDS:
        if invalid_word in normalized:
            return False
    
    # Nếu quá ngắn (< 3 từ) và không có keyword triệu chứng -> invalid
    words = normalized.split()
    if len(words) < 3:
        has_symptom = False
        for symptom_group in SYMPTOM_KEYWORDS.values():
            for keyword in symptom_group:
                if keyword in normalized:
                    has_symptom = True
                    break
            if has_symptom:
                break
        if not has_symptom:
            return False
    
    return True


def extract_symptoms(text: str) -> List[str]:
    """
    Trích xuất danh sách triệu chứng từ mô tả
    Returns:
        Danh sách các triệu chứng được chuẩn hóa
    """
    normalized = normalize_text(text)
    symptoms_found = []
    
    for symptom_name, keywords in SYMPTOM_KEYWORDS.items():
        for keyword in keywords:
            if keyword in normalized:
                # Thêm tên triệu chứng chuẩn (không trùng)
                if symptom_name not in symptoms_found:
                    symptoms_found.append(symptom_name)
                break
    
    return symptoms_found


def generate_advice_response(symptoms: List[str], language: str = "vi") -> str:
    """
    Tạo câu tư vấn nhẹ nhàng dựa trên triệu chứng
    """
    if language == "vi":
        if not symptoms:
            return "Mình chưa rõ triệu chứng lắm, bạn mô tả cụ thể hơn được không? 🤔"
        
        # Phân loại mức độ nghiêm trọng
        serious_symptoms = {"đau", "sưng", "chảy nước", "mủ", "vết loét", "sốt", "máu"}
        mild_symptoms = {"ngứa", "đỏ", "khô", "vảy"}
        
        has_serious = any(s in serious_symptoms for s in symptoms)
        has_mild = any(s in mild_symptoms for s in symptoms)
        
        if has_serious:
            return f"Bạn có vẻ có triệu chứng cần chú ý đấy ({', '.join(symptoms[:3])}...). Hãy giữ vùng da sạch sẽ và theo dõi thêm nhé! 🩺"
        elif has_mild:
            return f"Triệu chứng của bạn có vẻ nhẹ ({', '.join(symptoms[:2])}). Hãy giữ da sạch, tránh gãi và theo dõi thêm nhé! 😊"
        else:
            return f"Mình đã ghi nhận triệu chứng của bạn ({', '.join(symptoms[:2])}). Hãy tải ảnh lên để được phân tích chính xác hơn nhé! 📸"
    
    else:  # English
        if not symptoms:
            return "I'm not quite sure about your symptoms. Could you describe them more specifically? 🤔"
        
        serious_symptoms = {"đau", "sưng", "chảy nước", "mủ", "vết loét", "sốt", "máu"}
        mild_symptoms = {"ngứa", "đỏ", "khô", "vảy"}
        
        has_serious = any(s in serious_symptoms for s in symptoms)
        has_mild = any(s in mild_symptoms for s in symptoms)
        
        if has_serious:
            return f"You seem to have symptoms that need attention ({', '.join(symptoms[:3])}...). Keep the area clean and monitor it! 🩺"
        elif has_mild:
            return f"Your symptoms appear mild ({', '.join(symptoms[:2])}). Keep your skin clean, avoid scratching, and monitor! 😊"
        else:
            return f"I've noted your symptoms ({', '.join(symptoms[:2])}). Please upload an image for more accurate analysis! 📸"


def generate_invalid_response(text: str, language: str = "vi") -> str:
    """
    Tạo câu trả lời vui vẻ khi người dùng nhập nội dung không phải triệu chứng
    """
    normalized = normalize_text(text)
    
    if language == "vi":
        # Phát hiện một số trường hợp cụ thể
        if any(word in normalized for word in ["đẹp", "trai", "gái"]):
            return "Haha, cái này không phải triệu chứng đâu nha 😄, nói rõ hơn về tình trạng da giúp mình được không?"
        elif any(word in normalized for word in ["chó", "mèo", "cắn"]):
            return "Ối, bị cún/mèo cắn à? 🐱 Nhưng mình chỉ hỗ trợ chẩn đoán da liễu thôi nha! Nếu vết cắn có vấn đề thì mô tả triệu chứng vết thương đi bạn."
        elif any(word in normalized for word in ["buồn", "vui", "mệt"]):
            return "Cảm xúc của bạn rất quan trọng nhưng mình chỉ hỗ trợ về da liễu thôi 😅. Nếu da có vấn đề gì thì mô tả cụ thể nhé!"
        else:
            return "Hmm, mình không hiểu lắm 🤔. Bạn hãy mô tả các triệu chứng trên da như: ngứa, đỏ, sưng, mụn... giúp mình nhé!"
    
    else:  # English
        if any(word in normalized for word in ["handsome", "beautiful", "pretty"]):
            return "Haha, that's not a symptom! 😄 Can you describe your skin condition more clearly?"
        elif any(word in normalized for word in ["dog", "cat", "bite"]):
            return "Oh, a bite? 🐱 But I only help with dermatology! If the bite has issues, please describe the wound symptoms."
        elif any(word in normalized for word in ["sad", "happy", "tired"]):
            return "Your feelings matter, but I only help with dermatology 😅. If you have skin issues, please describe them!"
        else:
            return "Hmm, I don't quite understand 🤔. Please describe skin symptoms like: itching, redness, swelling, pimples... for me!"


def validate_and_extract_symptoms(description: str, language: str = "vi") -> Dict:
    """
    Main function: Validate và extract triệu chứng từ mô tả
    
    Returns:
        {
            "valid": bool,
            "symptoms": List[str],
            "response": str
        }
    """
    # Kiểm tra input rỗng
    if not description or len(description.strip()) < 2:
        return {
            "valid": False,
            "symptoms": [],
            "response": "Bạn chưa nhập gì cả 😅" if language == "vi" else "You haven't entered anything 😅"
        }
    
    # Validate
    is_valid = is_valid_symptom_description(description)
    
    if not is_valid:
        return {
            "valid": False,
            "symptoms": [],
            "response": generate_invalid_response(description, language)
        }
    
    # Extract symptoms
    symptoms = extract_symptoms(description)
    
    # Generate response
    response = generate_advice_response(symptoms, language)
    
    return {
        "valid": True,
        "symptoms": symptoms,
        "response": response
    }

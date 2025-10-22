from typing import Dict, Iterable, Tuple, List, Any


SEVERE_FLAGS = {"chảy máu", "lan rộng rất nhanh", "đau nhức dữ dội"}

# Danh sách bệnh nghiêm trọng (cần cảnh báo cao)
HIGH_RISK_DISEASES = {
    "melanoma": "ung thư hắc tố",
    "basal cell carcinoma": "ung thư tế bào đáy",
    "squamous cell carcinoma": "ung thư tế bào vảy",
    "actinic keratosis": "loạn sản tế bào sừng do ánh nắng"
}

# Danh sách bệnh cần theo dõi (cảnh báo trung bình)
MODERATE_RISK_DISEASES = {
    "eczema": "chàm/viêm da",
    "psoriasis": "vảy nến",
    "dermatitis": "viêm da",
    "atopic dermatitis": "viêm da cơ địa",
    "contact dermatitis": "viêm da tiếp xúc",
    "seborrheic dermatitis": "viêm da tiết bã",
    "seborrheic keratosis": "u sừng tiết bã",
    "rosacea": "rám má",
    "urticaria": "mày đay",
    "tinea": "nấm da"
}

# Triệu chứng thay đổi đáng ngờ
CHANGE_SYMPTOMS = {"mới xuất hiện", "thay đổi màu sắc", "thay đổi kích thước", "lan rộng"}

# Triệu chứng viêm nhiễm
INFLAMMATION_SYMPTOMS = {"ngứa", "đau", "sưng", "nóng rát"}

# Ánh xạ triệu chứng -> gợi ý bệnh (trọng số điều chỉnh)
# Giá trị >1.0 sẽ tăng điểm, <1.0 sẽ giảm điểm một chút
SYMPTOM_HINTS: Dict[str, Dict[str, float]] = {
    # nghi ngờ ác tính / thay đổi
    "thay đổi": {"melanoma": 1.25, "basal cell carcinoma": 1.15, "squamous cell carcinoma": 1.15},
    "mới xuất hiện": {"melanoma": 1.15},
    "lan rộng": {"melanoma": 1.15, "squamous cell carcinoma": 1.1},
    "chảy máu": {"melanoma": 1.2, "basal cell carcinoma": 1.1},

    # viêm/ ngứa rát
    "ngứa": {"eczema": 1.25, "dermatitis": 1.2, "psoriasis": 1.1, "urticaria": 1.15, "tinea": 1.05},
    "đau": {"cellulitis": 1.2, "folliculitis": 1.15, "basal cell carcinoma": 1.05},
    "sưng": {"cellulitis": 1.25, "folliculitis": 1.15},
    "nóng rát": {"rosacea": 1.15, "dermatitis": 1.1},

    # đặc thù
    "trắng bệch": {"vitiligo": 1.3},
    "mủ": {"impetigo": 1.25, "folliculitis": 1.2, "acne": 1.1},
    "vảy": {"psoriasis": 1.25, "actinic keratosis": 1.1},
    "mụn": {"acne": 1.3},
    "đỏ bừng mặt": {"rosacea": 1.3},
    "mụn cóc": {"wart": 1.4},
}


def adjust_scores(cv_scores: Dict[str, float], selected_symptoms: Iterable[str]) -> Tuple[Dict[str, float], Dict[str, Any]]:
    """Điều chỉnh điểm mô hình dựa trên triệu chứng và trả về log giải thích.

    Trả về: (điểm_điều_chỉnh, giải_thích)
    """
    sel = [s.strip().lower() for s in selected_symptoms if s and s.strip()]
    if not sel or not cv_scores:
        return cv_scores, {"adjustments": [], "note": "no symptom-driven adjustment"}

    adjusted = dict(cv_scores)
    adjustments: List[Dict[str, Any]] = []

    for s in sel:
        hints = SYMPTOM_HINTS.get(s)
        if not hints:
            # thử khớp theo từ khóa con
            for key, mapping in SYMPTOM_HINTS.items():
                if key in s:
                    hints = mapping
                    break
        if not hints:
            continue

        for disease, factor in hints.items():
            # chỉ điều chỉnh nếu bệnh có trong cv_scores hoặc là ứng viên gần (thêm nhẹ)
            base = adjusted.get(disease, 0.0)
            new_score = base * factor if base > 0 else base + 0.01 * (factor - 1.0)
            # kẹp về [0,1]
            new_score = max(0.0, min(1.0, new_score))
            if abs(new_score - base) > 1e-6:
                adjusted[disease] = new_score
                adjustments.append({
                    "symptom": s,
                    "disease": disease,
                    "factor": factor,
                    "before": round(base, 6),
                    "after": round(new_score, 6),
                })

    # chuẩn hóa lại tổng không bắt buộc, nhưng giữ cấu trúc bằng cách scale nhẹ nếu tổng vượt >1
    total = sum(adjusted.values())
    if total > 0 and total != sum(cv_scores.values()):
        # không cần scale tuyệt đối; để preserve ranking tương đối
        pass

    explanation = {"adjustments": adjustments}
    return adjusted, explanation


def get_disease_vietnamese_name(disease_name: str) -> str:
    """Lấy tên tiếng Việt của bệnh."""
    disease_lower = disease_name.lower()
    
    # Check high-risk diseases
    for eng, viet in HIGH_RISK_DISEASES.items():
        if eng in disease_lower:
            return viet
    
    # Check moderate-risk diseases
    for eng, viet in MODERATE_RISK_DISEASES.items():
        if eng in disease_lower:
            return viet
    
    # Check other common diseases
    common_diseases = {
        "nevus": "nốt ruồi",
        "acne": "mụn trứng cá",
        "wart": "mụn cóc",
        "vitiligo": "bạch biến",
        "hemangioma": "u máu",
        "dermatofibroma": "u xơ sợi da",
        "lipoma": "u mỡ",
        "cherry angioma": "u máu anh đào",
        "skin tag": "mụn thịt",
        "milia": "hạt kê",
        "folliculitis": "viêm nang lông",
        "cellulitis": "viêm mô tế bào",
        "impetigo": "chốc lở",
        "fungal infection": "nhiễm nấm",
        "bacterial infection": "nhiễm khuẩn"
    }
    
    for eng, viet in common_diseases.items():
        if eng in disease_lower:
            return viet
    
    return disease_name


def decide_risk(cv_scores: Dict[str, float], selected_symptoms: Iterable[str]) -> Tuple[str, str]:
    """
    Quyết định mức độ rủi ro dựa trên CV scores và triệu chứng.
    
    Args:
        cv_scores: Dict mapping disease name to confidence score (0-1)
        selected_symptoms: List of symptom strings
        
    Returns:
        Tuple of (risk_level, reason_text)
    """
    sel = {s.strip().lower() for s in selected_symptoms if s and s.strip()}
    
    print(f"[DEBUG] cv_scores: {cv_scores}")
    print(f"[DEBUG] symptoms: {sel}")
    
    if not cv_scores:
        return "THẤP 🟢", "Không đủ dữ liệu để phân tích. Vui lòng thử lại với ảnh rõ hơn."
    
    # Lấy bệnh có confidence cao nhất
    top_disease, top_score = max(cv_scores.items(), key=lambda x: x[1])
    top_disease_viet = get_disease_vietnamese_name(top_disease)
    
    # Lấy top 3 bệnh để phân tích
    sorted_diseases = sorted(cv_scores.items(), key=lambda x: x[1], reverse=True)[:3]
    
    # ========== PRIORITY 1: Triệu chứng nghiêm trọng ==========
    if sel & SEVERE_FLAGS:
        severe_symptoms = sel & SEVERE_FLAGS
        return (
            "CAO 🔴",
            f"⚠️ KHẨN CẤP: Phát hiện triệu chứng nghiêm trọng ({', '.join(severe_symptoms)}). "
            f"Cần đi khám ngay lập tức, đặc biệt nếu kèm theo dấu hiệu {top_disease_viet}."
        )
    
    # ========== PRIORITY 2: Bệnh nghiêm trọng với confidence cao ==========
    for disease, score in sorted_diseases:
        disease_lower = disease.lower()
        
        # Check high-risk diseases
        for high_risk_key, high_risk_viet in HIGH_RISK_DISEASES.items():
            if high_risk_key in disease_lower:
                if score > 0.5:
                    # Confidence rất cao
                    return (
                        "CAO 🔴",
                        f"🚨 Phát hiện dấu hiệu nghi ngờ {high_risk_viet} với độ tin cậy cao ({score:.1%}). "
                        f"CẦN ĐI KHÁM BÁC SĨ DA LIỄU NGAY để kiểm tra chi tiết và sinh thiết nếu cần."
                    )
                elif score > 0.3:
                    # Confidence cao
                    symptom_info = ""
                    if sel & CHANGE_SYMPTOMS:
                        symptom_info = f" Kết hợp với triệu chứng thay đổi ({', '.join(sel & CHANGE_SYMPTOMS)}), "
                    return (
                        "CAO 🔴",
                        f"⚠️ Hình ảnh có đặc điểm tương tự {high_risk_viet} ({score:.1%}).{symptom_info} "
                        f"Đây là tổn thương cần được bác sĩ da liễu kiểm tra khẩn cấp trong vòng 1-2 tuần."
                    )
                elif score > 0.15:
                    # Confidence trung bình nhưng là bệnh nguy hiểm
                    if sel & CHANGE_SYMPTOMS:
                        return (
                            "TRUNG BÌNH 🟡",
                            f"Phát hiện một số đặc điểm của {high_risk_viet} ({score:.1%}) "
                            f"kèm triệu chứng thay đổi ({', '.join(sel & CHANGE_SYMPTOMS)}). "
                            f"Nên đặt lịch khám da liễu trong 2-4 tuần để theo dõi."
                        )
    
    # ========== PRIORITY 3: Melanoma/Ung thư với confidence thấp nhưng có triệu chứng đáng ngờ ==========
    melanoma_score = cv_scores.get("melanoma", 0.0)
    if melanoma_score > 0.08:  # Ngưỡng thấp hơn cho melanoma
        change_symp = sel & CHANGE_SYMPTOMS
        if change_symp:
            return (
                "TRUNG BÌNH 🟡",
                f"Phát hiện nốt ruồi hoặc vết da có một số đặc điểm đáng lưu ý ({melanoma_score:.1%} ung thư hắc tố) "
                f"kèm triệu chứng {', '.join(change_symp)}. "
                f"Nên kiểm tra quy tắc ABCDE (Asymmetry, Border, Color, Diameter, Evolving) và đặt lịch khám da liễu."
            )
    
    # ========== PRIORITY 4: Bệnh moderate-risk với confidence cao ==========
    for disease, score in sorted_diseases:
        disease_lower = disease.lower()
        
        for mod_risk_key, mod_risk_viet in MODERATE_RISK_DISEASES.items():
            if mod_risk_key in disease_lower:
                if score > 0.6:
                    # Confidence rất cao cho bệnh moderate
                    inflammation = sel & INFLAMMATION_SYMPTOMS
                    if inflammation:
                        return (
                            "TRUNG BÌNH 🟡",
                            f"Hình ảnh và triệu chứng ({', '.join(inflammation)}) rất tương đồng với {mod_risk_viet} ({score:.1%}). "
                            f"Nên đặt lịch khám da liễu để được kê đơn thuốc điều trị phù hợp. "
                            f"Tránh gãi, giữ vệ sinh và có thể dùng kem dưỡng ẩm nhẹ."
                        )
                    else:
                        return (
                            "TRUNG BÌNH 🟡",
                            f"Hình ảnh rất giống {mod_risk_viet} ({score:.1%}). "
                            f"Nên đi khám để được chẩn đoán chính xác và điều trị đúng cách. "
                            f"Không tự ý dùng thuốc mạnh."
                        )
                elif score > 0.4 and sel & INFLAMMATION_SYMPTOMS:
                    # Confidence trung bình nhưng có triệu chứng viêm
                    return (
                        "TRUNG BÌNH 🟡",
                        f"Có dấu hiệu {mod_risk_viet} ({score:.1%}) với triệu chứng {', '.join(sel & INFLAMMATION_SYMPTOMS)}. "
                        f"Nên theo dõi trong vài ngày. Nếu không thấy cải thiện hoặc tình trạng xấu đi, "
                        f"hãy đặt lịch khám da liễu."
                    )
    
    # ========== PRIORITY 5: Bất kỳ bệnh đáng lưu ý nào với confidence cao ==========
    if top_score > 0.7 and "nevus" not in top_disease.lower() and "normal" not in top_disease.lower():
        return (
            "TRUNG BÌNH 🟡",
            f"Hình ảnh phù hợp với {top_disease_viet} với độ tin cậy cao ({top_score:.1%}). "
            f"Nên tham khảo ý kiến bác sĩ da liễu để được tư vấn cụ thể về tình trạng này."
        )
    
    # ========== PRIORITY 6: Multiple moderate diseases ==========
    moderate_count = sum(1 for disease, score in sorted_diseases 
                        if score > 0.15 and any(mod in disease.lower() for mod in MODERATE_RISK_DISEASES.keys()))
    if moderate_count >= 2:
        diseases_list = [get_disease_vietnamese_name(d) for d, s in sorted_diseases[:2]]
        return (
            "TRUNG BÌNH 🟡",
            f"Hình ảnh có đặc điểm của nhiều bệnh da khác nhau (có thể là {', '.join(diseases_list)}). "
            f"Nên đi khám da liễu để bác sĩ xác định chính xác loại tổn thương."
        )
    
    # ========== PRIORITY 7: Có triệu chứng nhưng hình ảnh bình thường ==========
    if sel and top_score < 0.6:
        if sel & INFLAMMATION_SYMPTOMS:
            return (
                "TRUNG BÌNH 🟡",
                f"Có triệu chứng {', '.join(sel & INFLAMMATION_SYMPTOMS)} nhưng hình ảnh chưa rõ ràng. "
                f"Hình ảnh gần nhất với {top_disease_viet} ({top_score:.1%}). "
                f"Nên chụp ảnh rõ hơn hoặc đi khám nếu triệu chứng kéo dài trên 1 tuần."
            )
    
    # ========== DEFAULT: Tình trạng lành tính ==========
    if top_score > 0.5:
        if "nevus" in top_disease.lower():
            advice = "Tự kiểm tra định kỳ theo quy tắc ABCDE. Nếu có thay đổi bất thường, hãy đi khám."
        elif "acne" in top_disease.lower():
            advice = "Giữ vệ sinh da sạch sẽ, không nặn. Có thể dùng sản phẩm trị mụn OTC nhẹ."
        else:
            advice = "Theo dõi thêm. Nếu có thay đổi hoặc khó chịu, nên đi khám da liễu."
        
        return (
            "THẤP �",
            f"Hình ảnh phù hợp với {top_disease_viet} ({top_score:.1%}), thường là tình trạng lành tính. {advice}"
        )
    else:
        # Confidence thấp cho tất cả
        return (
            "THẤP 🟢",
            f"Hình ảnh có thể là {top_disease_viet} ({top_score:.1%}) hoặc các tình trạng da thông thường khác. "
            f"Nếu có triệu chứng bất thường hoặc lo lắng, nên chụp ảnh rõ hơn và tham khảo bác sĩ da liễu."
        )



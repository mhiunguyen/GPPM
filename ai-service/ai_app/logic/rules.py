from typing import Dict, Iterable, Tuple, List, Any, Optional


# Triệu chứng KHẨN CẤP - luôn báo động cao
CRITICAL_FLAGS = {"chảy máu", "bleeding", "máu", "ulcer", "loét", "bad_odor", "mùi hôi"}

# Triệu chứng nghiêm trọng - cần khám ngay
SEVERE_FLAGS = {"lan nhanh", "rapid_spread", "sốt", "fever", "mủ", "pus", "hạch sưng", "lymph_nodes"}

# Triệu chứng cảnh báo - cần theo dõi chặt
WARNING_FLAGS = {"đau", "pain", "sưng", "swelling", "nóng rát", "warmth", "tiết dịch", "discharge"}

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
CHANGE_SYMPTOMS = {"mới xuất hiện", "thay đổi màu sắc", "thay đổi kích thước", "lan rộng", "thay đổi", "discoloration", "spreading"}

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


def decide_risk(
    cv_scores: Dict[str, float],
    selected_symptoms: Iterable[str],
    duration: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Quyết định mức độ rủi ro dựa trên CV scores và triệu chứng.
    TRIỆU CHỨNG CÓ ƯU TIÊN CAO HƠN khi xung đột với CV scores.
    
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
    
    # ========== PRIORITY 0: Triệu chứng KHẨN CẤP - override mọi CV score ==========
    critical_found = sel & CRITICAL_FLAGS
    if critical_found:
        return (
            "CAO 🔴",
            f"🚨 KHẨN CẤP: Phát hiện triệu chứng nghiêm trọng ({', '.join(critical_found)}). "
            f"CẦN ĐI KHÁM NGAY LẬP TỨC, KHÔNG ĐƯỢC TRÌ HOÃN. "
            f"Hình ảnh cũng cho thấy dấu hiệu {top_disease_viet} ({top_score:.1%})."
        )
    
    # ========== PRIORITY 1: Triệu chứng nghiêm trọng ==========
    severe_found = sel & SEVERE_FLAGS
    if severe_found:
        return (
            "CAO 🔴",
            f"⚠️ NGHIÊM TRỌNG: Triệu chứng {', '.join(severe_found)} cần được bác sĩ kiểm tra khẩn cấp. "
            f"Kết hợp với hình ảnh nghi ngờ {top_disease_viet} ({top_score:.1%}), "
            f"đây là trường hợp ưu tiên cao. Hãy đặt lịch khám trong 24-48 giờ."
        )
    
    # ========== PRIORITY 2: Bệnh nghiêm trọng với confidence cao ==========
    for disease, score in sorted_diseases:
        disease_lower = disease.lower()
        
        # Check high-risk diseases
        for high_risk_key, high_risk_viet in HIGH_RISK_DISEASES.items():
            if high_risk_key in disease_lower:
                if score > 0.5:
                    # Confidence rất cao
                    symptom_boost = " Triệu chứng cũng phù hợp với chẩn đoán này." if sel else ""
                    return (
                        "CAO 🔴",
                        f"🚨 Phát hiện dấu hiệu nghi ngờ {high_risk_viet} với độ tin cậy cao ({score:.1%}).{symptom_boost} "
                        f"CẦN ĐI KHÁM BÁC SĨ DA LIỄU NGAY để kiểm tra chi tiết và sinh thiết nếu cần."
                    )
                elif score > 0.3:
                    # Confidence cao
                    symptom_info = ""
                    if sel & CHANGE_SYMPTOMS:
                        symptom_info = f" Kết hợp với triệu chứng thay đổi ({', '.join(sel & CHANGE_SYMPTOMS)}), "
                    elif sel & WARNING_FLAGS:
                        symptom_info = f" Kết hợp với triệu chứng cảnh báo ({', '.join(sel & WARNING_FLAGS)}), "
                    return (
                        "CAO 🔴",
                        f"⚠️ Hình ảnh có đặc điểm tương tự {high_risk_viet} ({score:.1%}).{symptom_info} "
                        f"Đây là tổn thương cần được bác sĩ da liễu kiểm tra khẩn cấp trong vòng 1-2 tuần."
                    )
                elif score > 0.15 and (sel & (CHANGE_SYMPTOMS | WARNING_FLAGS)):
                    # Confidence trung bình nhưng là bệnh nguy hiểm + có triệu chứng đáng lo
                    return (
                        "CAO �",
                        f"Phát hiện một số đặc điểm của {high_risk_viet} ({score:.1%}) "
                        f"kèm triệu chứng đáng lo ngại ({', '.join(sel & (CHANGE_SYMPTOMS | WARNING_FLAGS))}). "
                        f"NÊN ĐI KHÁM NGAY để loại trừ khả năng xấu nhất."
                    )
    
    # ========== PRIORITY 3: Triệu chứng cảnh báo + bệnh moderate với confidence cao ==========
    warning_found = sel & WARNING_FLAGS
    if warning_found and top_score > 0.4:
        disease_info = get_disease_vietnamese_name(top_disease)
        return (
            "TRUNG BÌNH 🟡",
            f"Phát hiện triệu chứng cần theo dõi ({', '.join(warning_found)}) "
            f"kèm theo dấu hiệu {disease_info} ({top_score:.1%}). "
            f"Nên đặt lịch khám da liễu trong 1-2 tuần. "
            f"Theo dõi thêm, nếu triệu chứng nặng hơn hoặc không thuyên giảm sau 3-5 ngày, hãy đi khám sớm hơn."
        )
    
    # ========== PRIORITY 4: Melanoma/Ung thư với confidence thấp nhưng có triệu chứng đáng ngờ ==========
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
    
    # ========== PRIORITY 5: Bệnh moderate-risk với confidence cao + có triệu chứng ==========
    for disease, score in sorted_diseases:
        disease_lower = disease.lower()
        
        for mod_risk_key, mod_risk_viet in MODERATE_RISK_DISEASES.items():
            if mod_risk_key in disease_lower:
                if score > 0.6 and sel:
                    # Confidence rất cao cho bệnh moderate + có triệu chứng
                    inflammation = sel & INFLAMMATION_SYMPTOMS
                    symptom_list = ', '.join(sel) if len(sel) <= 3 else f"{', '.join(list(sel)[:3])} và {len(sel)-3} triệu chứng khác"
                    return (
                        "TRUNG BÌNH 🟡",
                        f"Hình ảnh và triệu chứng ({symptom_list}) rất tương đồng với {mod_risk_viet} ({score:.1%}). "
                        f"Nên đặt lịch khám da liễu để được kê đơn thuốc điều trị phù hợp. "
                        f"Tránh gãi, giữ vệ sinh và có thể dùng kem dưỡng ẩm nhẹ."
                    )
                elif score > 0.4 and sel & INFLAMMATION_SYMPTOMS:
                    # Confidence trung bình nhưng có triệu chứng viêm
                    return (
                        "TRUNG BÌNH 🟡",
                        f"Có dấu hiệu {mod_risk_viet} ({score:.1%}) với triệu chứng {', '.join(sel & INFLAMMATION_SYMPTOMS)}. "
                        f"Nên theo dõi trong vài ngày. Nếu không thấy cải thiện hoặc tình trạng xấu đi, "
                        f"hãy đặt lịch khám da liễu."
                    )
    
    # ========== PRIORITY 6: Có nhiều triệu chứng nhưng CV score không rõ ràng ==========
    if len(sel) >= 3:
        if sel & (WARNING_FLAGS | INFLAMMATION_SYMPTOMS):
            return (
                "TRUNG BÌNH 🟡",
                f"Phát hiện nhiều triệu chứng ({len(sel)} triệu chứng: {', '.join(list(sel)[:3])}{'...' if len(sel) > 3 else ''}). "
                f"Hình ảnh cho thấy khả năng {top_disease_viet} ({top_score:.1%}), nhưng cần bác sĩ đánh giá chính xác. "
                f"Nên đặt lịch khám da liễu để được chẩn đoán và điều trị phù hợp."
            )
    
    # ========== PRIORITY 7: Bất kỳ bệnh đáng lưu ý nào với confidence cao ==========
    if top_score > 0.7 and "nevus" not in top_disease.lower() and "normal" not in top_disease.lower():
        symptom_note = f" Kèm theo triệu chứng: {', '.join(sel)}." if sel else ""
        return (
            "TRUNG BÌNH 🟡",
            f"Hình ảnh phù hợp với {top_disease_viet} với độ tin cậy cao ({top_score:.1%}).{symptom_note} "
            f"Nên tham khảo ý kiến bác sĩ da liễu để được tư vấn cụ thể về tình trạng này."
        )
    
    # ========== PRIORITY 8: Có triệu chứng nhưng hình ảnh bình thường ==========
    if sel and top_score < 0.6:
        if sel & (INFLAMMATION_SYMPTOMS | WARNING_FLAGS):
            return (
                "TRUNG BÌNH 🟡",
                f"Có triệu chứng {', '.join(sel & (INFLAMMATION_SYMPTOMS | WARNING_FLAGS))} nhưng hình ảnh chưa rõ ràng. "
                f"Hình ảnh gần nhất với {top_disease_viet} ({top_score:.1%}). "
                f"Nên chụp ảnh rõ hơn hoặc đi khám nếu triệu chứng kéo dài trên 1 tuần."
            )
    
    # ========== DEFAULT: Tình trạng lành tính ==========
    if top_score > 0.5:
        symptom_context = ""
        if sel:
            symptom_context = f" Các triệu chứng ({', '.join(sel)}) có thể liên quan hoặc là biểu hiện phụ."
        
        if "nevus" in top_disease.lower():
            advice = "Tự kiểm tra định kỳ theo quy tắc ABCDE. Nếu có thay đổi bất thường, hãy đi khám."
        elif "acne" in top_disease.lower():
            advice = "Giữ vệ sinh da sạch sẽ, không nặn. Có thể dùng sản phẩm trị mụn OTC nhẹ."
        else:
            advice = "Theo dõi thêm. Nếu có thay đổi hoặc khó chịu, nên đi khám da liễu."
        
        return (
            "THẤP 🟢",
            f"Hình ảnh phù hợp với {top_disease_viet} ({top_score:.1%}), thường là tình trạng lành tính.{symptom_context} {advice}"
        )
    else:
        # Confidence thấp cho tất cả
        symptom_note = f" Có triệu chứng: {', '.join(sel)}." if sel else ""
        return (
            "THẤP 🟢",
            f"Hình ảnh có thể là {top_disease_viet} ({top_score:.1%}) hoặc các tình trạng da thông thường khác.{symptom_note} "
            f"Nếu có triệu chứng bất thường hoặc lo lắng, nên chụp ảnh rõ hơn và tham khảo bác sĩ da liễu."
        )

    # Should not reach here, but keep default low risk


def apply_duration_adjustment(risk: str, reason: str, selected_symptoms: Iterable[str], duration: Optional[str]) -> Tuple[str, str]:
    """Post-adjust risk based on duration and symptoms severity.

    New Duration Categories:
    - 'dưới 1 tuần': acute, recent onset
    - '1-4 tuần': subacute, persisting
    - '1-3 tháng': chronic early stage
    - 'trên 3 tháng': chronic long-term
    - 'từ khi sinh ra': congenital/birthmark

    Rules:
    1. Congenital ('từ khi sinh ra'):
       - If nevus/birthmark: LOW risk, recommend periodic monitoring
       - If changing or with symptoms: escalate to MEDIUM, schedule dermatology check
    
    2. Chronic long-term ('trên 3 tháng'):
       - Any warning/inflammation symptoms: escalate to MEDIUM (needs evaluation)
       - Severe/critical symptoms: escalate to HIGH (delayed treatment risk)
    
    3. Chronic early ('1-3 tháng'):
       - Warning/inflammation symptoms: escalate to MEDIUM if currently LOW
       - Severe symptoms: ensure at least MEDIUM
    
    4. Subacute ('1-4 tuần'):
       - Severe/critical symptoms: escalate to HIGH
       - Warning symptoms: mention in reason for monitoring
    
    5. Acute ('dưới 1 tuần'):
       - Critical symptoms: ensure HIGH
       - Keep as-is for others (recent onset, may resolve)
    """
    if not duration:
        return risk, reason

    sel = {s.strip().lower() for s in selected_symptoms if s and s.strip()}
    dur = duration.strip().lower()

    def elevate(r: str, levels: int = 1) -> str:
        """Elevate risk by specified levels"""
        if levels == 0:
            return r
        if 'thấp' in r.lower() or 'low' in r.lower():
            return 'TRUNG BÌNH 🟡' if levels == 1 else 'CAO 🔴'
        if 'trung' in r.lower() or 'medium' in r.lower():
            return 'CAO 🔴'
        return r  # Already HIGH

    # === Congenital (từ khi sinh ra) ===
    if 'sinh' in dur or 'birth' in dur:
        # Check if it's changing or has symptoms
        has_change = bool(sel & CHANGE_SYMPTOMS)
        has_symptoms = bool(sel & (WARNING_FLAGS | INFLAMMATION_SYMPTOMS | SEVERE_FLAGS | CRITICAL_FLAGS))
        
        if has_change or has_symptoms:
            new_r = elevate(risk, 1)
            if new_r != risk:
                reason = reason + " Tổn thương bẩm sinh có biến đổi hoặc triệu chứng mới, cần khám da liễu để đánh giá."
            risk = new_r
        else:
            # Stable birthmark - keep low but add monitoring advice
            if 'thấp' in risk.lower() or 'low' in risk.lower():
                reason = reason + " Với tổn thương bẩm sinh ổn định, nên theo dõi định kỳ và chụp ảnh để so sánh thay đổi."
    
    # === Chronic long-term (trên 3 tháng) ===
    elif 'trên 3' in dur or 'over 3' in dur or '> 3' in dur:
        has_severe = bool(sel & (SEVERE_FLAGS | CRITICAL_FLAGS))
        has_warning = bool(sel & (WARNING_FLAGS | INFLAMMATION_SYMPTOMS))
        
        if has_severe:
            # Severe symptoms persisting > 3 months is concerning
            new_r = 'CAO 🔴'
            if risk != new_r:
                reason = reason + " Triệu chứng nghiêm trọng kéo dài trên 3 tháng, nguy cơ biến chứng cao, cần khám gấp."
            risk = new_r
        elif has_warning:
            # Chronic inflammation/warning signs need evaluation
            new_r = elevate(risk, 1)
            if new_r != risk:
                reason = reason + " Triệu chứng mãn tính kéo dài trên 3 tháng cần được bác sĩ da liễu đánh giá và điều trị."
            risk = new_r
        else:
            # Chronic but mild - still recommend check
            if 'thấp' in risk.lower() or 'low' in risk.lower():
                reason = reason + " Tình trạng kéo dài trên 3 tháng nên được khám để xác định nguyên nhân và điều trị phù hợp."
    
    # === Chronic early (1-3 tháng) ===
    elif '1-3' in dur or '1_3' in dur:
        has_severe = bool(sel & (SEVERE_FLAGS | CRITICAL_FLAGS))
        has_warning = bool(sel & (WARNING_FLAGS | INFLAMMATION_SYMPTOMS))
        
        if has_severe:
            # Ensure at least MEDIUM for severe symptoms lasting 1-3 months
            if 'thấp' in risk.lower() or 'low' in risk.lower():
                risk = 'TRUNG BÌNH 🟡'
                reason = reason + " Triệu chứng nghiêm trọng kéo dài 1-3 tháng cần được khám để loại trừ bệnh lý mãn tính."
        elif has_warning:
            # Escalate LOW to MEDIUM for persistent warning signs
            if 'thấp' in risk.lower() or 'low' in risk.lower():
                risk = 'TRUNG BÌNH 🟡'
                reason = reason + " Triệu chứng kéo dài 1-3 tháng, nên đặt lịch khám da liễu để điều trị kịp thời."
    
    # === Subacute (1-4 tuần) ===
    elif '1-4' in dur or '1_4' in dur:
        has_critical_severe = bool(sel & (SEVERE_FLAGS | CRITICAL_FLAGS))
        has_warning = bool(sel & (WARNING_FLAGS | INFLAMMATION_SYMPTOMS))
        
        if has_critical_severe:
            # Severe symptoms persisting 1-4 weeks need urgent attention
            new_r = 'CAO 🔴'
            if risk != new_r:
                reason = reason + " Triệu chứng nghiêm trọng kéo dài 1-4 tuần cần khám ngay để tránh biến chứng."
            risk = new_r
        elif has_warning:
            # Add monitoring advice for warning symptoms
            reason = reason + " Triệu chứng kéo dài gần 1 tháng, nên theo dõi sát và khám nếu không thuyên giảm."
    
    # === Acute (dưới 1 tuần) ===
    elif 'dưới 1' in dur or 'less' in dur or '< 1' in dur:
        has_critical = bool(sel & CRITICAL_FLAGS)
        
        if has_critical:
            # Critical symptoms even if recent need urgent care
            new_r = 'CAO 🔴'
            if risk != new_r:
                reason = reason + " Triệu chứng khẩn cấp xuất hiện gần đây, cần đi khám ngay lập tức."
            risk = new_r
        else:
            # Recent onset - may resolve, but monitor
            if 'thấp' in risk.lower() or 'low' in risk.lower():
                reason = reason + " Triệu chứng mới xuất hiện, theo dõi trong vài ngày. Nếu xấu đi hoặc không giảm, hãy đi khám."

    return risk, reason



"""
System prompts cho DermaSafe-AI Chatbot
"""

SYSTEM_PROMPT = """
Bạn là trợ lý AI y tế chuyên về da liễu của DermaSafe-AI, một hệ thống sàng lọc rủi ro da liễu.

NHIỆM VỤ CỦA BẠN:
- Giải thích kết quả phân tích AI cho người dùng một cách dễ hiểu
- Trả lời các câu hỏi về tình trạng da của họ
- Hỗ trợ, an ủi và đưa ra lời khuyên hợp lý
- Luôn nhấn mạnh: "Đây KHÔNG phải chẩn đoán y khoa chính thức"

NGUYÊN TẮC QUAN TRỌNG:
1. ⚠️ KHÔNG BAO GIỜ chẩn đoán chính thức hoặc thay thế bác sĩ
2. ✅ Luôn khuyên người dùng đi khám bác sĩ nếu nghi ngờ
3. 🇻🇳 Trả lời bằng tiếng Việt, giọng điệu thân thiện, empathetic
4. 📊 Sử dụng kết quả AI analysis để trả lời (nếu có)
5. 🎯 Ngắn gọn, rõ ràng, tránh thuật ngữ phức tạp
6. 💊 KHÔNG BAO GIỜ đưa ra đơn thuốc hoặc liều lượng cụ thể
7. 🏥 Khuyến khích đi khám bác sĩ da liễu khi cần thiết

THÔNG TIN NGUY HIỂM - PHẢI CẢNH BÁO NGAY:
Nếu user mô tả các triệu chứng sau, hãy khuyên họ đi bệnh viện NGAY:
- Chảy máu không dừng được
- Đau dữ dội, sưng nhanh chóng
- Sốt cao kèm theo tổn thương da
- Tổn thương lan rộng rất nhanh trong vài giờ
- Khó thở, choáng váng (có thể phản ứng dị ứng nghiêm trọng)

→ Trả lời: "⚠️ CẢNH BÁO: Triệu chứng này cần đi bệnh viện NGAY LẬP TỨC. Đừng chờ đợi!"

GIỌNG ĐIỆU:
- Thân thiện, ấm áp như một người bạn quan tâm
- Không gây hoảng loạn, nhưng cũng không coi nhẹ
- Khuyến khích hành động tích cực (đi khám nếu cần)
- Sử dụng emoji phù hợp để dễ hiểu: ✅ ❌ ⚠️ 💡 🏥

FORMAT TRẢ LỜI:
- Đoạn văn ngắn (2-4 câu)
- Bullet points nếu liệt kê
- Kết thúc bằng lời khuyên hoặc câu hỏi mở

VÍ DỤ TRẢ LỜI TỐT:
User: "Kết quả này có nghĩa là gì?"
Bot: "Dựa trên phân tích AI, tổn thương trên da của bạn có độ rủi ro CAO (🔴). Hệ thống phát hiện đặc điểm tương tự ung thư hắc tố với độ tin cậy 72%.

⚠️ Điều này KHÔNG có nghĩa là bạn chắc chắn bị ung thư, nhưng đây là dấu hiệu cần đi khám ngay lập tức để bác sĩ da liễu kiểm tra kỹ hơn.

💡 Bạn nên làm gì:
• Đặt lịch khám bác sĩ da liễu trong vòng 1-2 ngày
• Chụp ảnh tổn thương hàng ngày để theo dõi
• Không tự điều trị

Bạn có thắc mắc gì thêm không?"

VÍ DỤ TRẢ LỜI TỐT (RỦI RO THẤP):
User: "Tôi có cần lo lắng không?"
Bot: "Kết quả phân tích cho thấy mức độ rủi ro THẤP (🟢), đây có vẻ là tình trạng da thông thường như nốt ruồi lành tính.

✅ Tuy nhiên, bạn vẫn nên:
• Theo dõi xem nốt ruồi có thay đổi không (kích thước, màu sắc, hình dạng)
• Đi khám định kỳ hàng năm với bác sĩ da liễu
• Nếu có thay đổi bất thường, hãy đi khám ngay

💡 Bạn muốn biết cách theo dõi nốt ruồi đúng cách không?"

CONTEXT SẼ ĐƯỢC CUNG CẤP:
- Kết quả phân tích AI (nếu user đã upload ảnh)
- Lịch sử trò chuyện (conversation history)

HÃY LUÔN NHỚ: Bạn là công cụ hỗ trợ, không phải bác sĩ. An toàn của người dùng là ưu tiên số 1.
"""


def build_context_prompt(analysis: dict) -> str:
    """
    Tạo prompt từ kết quả AI analysis để cung cấp context cho chatbot
    
    Args:
        analysis: Dict chứa kết quả phân tích từ AI Service
    
    Returns:
        String prompt với context đầy đủ
    """
    if not analysis:
        return ""
    
    prompt = f"""
=== KẾT QUẢ PHÂN TÍCH AI (User vừa nhận được) ===

Mức độ rủi ro: {analysis.get('risk', 'N/A').upper()} {'🔴' if analysis.get('risk') == 'cao' else '🟡' if analysis.get('risk') == 'trung bình' else '🟢'}
Lý do đánh giá: {analysis.get('reason', 'N/A')}
"""
    
    # Thêm thông tin chẩn đoán chính
    if analysis.get('primary_disease'):
        disease = analysis['primary_disease']
        prompt += f"""
--- Chẩn đoán chính ---
Tên bệnh: {disease.get('vietnamese_name', disease.get('name', 'N/A'))}
Độ tin cậy: {disease.get('confidence', 0)*100:.1f}%
Mức độ nghiêm trọng: {disease.get('severity', 'N/A')}
"""
        
        if disease.get('description'):
            prompt += f"Mô tả: {disease['description'][:200]}...\n"
    
    # Thêm các chẩn đoán thay thế
    if analysis.get('alternative_diseases'):
        prompt += "\n--- Các chẩn đoán thay thế (có thể) ---\n"
        for i, alt_disease in enumerate(analysis['alternative_diseases'][:3], 1):
            prompt += f"{i}. {alt_disease.get('vietnamese_name', alt_disease.get('name'))}: {alt_disease.get('confidence', 0)*100:.1f}%\n"
    
    # Thêm khuyến nghị
    if analysis.get('recommendations'):
        prompt += "\n--- Khuyến nghị từ hệ thống ---\n"
        for rec in analysis['recommendations'][:3]:
            prompt += f"• {rec}\n"
    
    # Thêm khái niệm lâm sàng
    if analysis.get('clinical_concepts'):
        prompt += f"\nKhái niệm lâm sàng: {', '.join(analysis['clinical_concepts'][:5])}\n"
    
    prompt += "\n=== KẾT THÚC CONTEXT ===\n"
    prompt += "\nHãy sử dụng thông tin trên để trả lời câu hỏi của user một cách chính xác và hữu ích.\n"
    
    return prompt


def generate_suggestions(context: dict | None, user_message: str = "") -> list[str]:
    """
    Tạo gợi ý câu hỏi dựa trên context và tin nhắn user
    
    Args:
        context: Analysis context (nếu có)
        user_message: Tin nhắn mới nhất của user
    
    Returns:
        List các câu hỏi gợi ý
    """
    if not context:
        return [
            "Hệ thống này hoạt động như thế nào?",
            "Tôi nên chuẩn bị gì trước khi đi khám bác sĩ?",
            "Làm sao để phòng ngừa bệnh da liễu?"
        ]
    
    risk = context.get('risk', '').lower()
    suggestions = []
    
    if risk == "cao":
        suggestions = [
            "Tôi nên đi khám ngay hay có thể chờ vài ngày?",
            "Bác sĩ da liễu sẽ làm những gì khi khám?",
            "Có cách nào để giảm nguy cơ trong lúc chờ khám không?",
            "Tôi cần chuẩn bị gì cho buổi khám?"
        ]
    elif risk == "trung bình":
        suggestions = [
            "Tôi nên theo dõi những triệu chứng nào?",
            "Khi nào tôi cần đi khám gấp?",
            "Có cách chăm sóc tại nhà không?",
            "Bao lâu tôi nên kiểm tra lại?"
        ]
    else:  # thấp
        suggestions = [
            "Làm sao để chăm sóc da tốt hơn?",
            "Khi nào tôi nên lo lắng và đi khám?",
            "Có cách phòng ngừa không?",
            "Tôi có nên khám định kỳ không?"
        ]
    
    # Thêm suggestions phổ biến
    suggestions.extend([
        "Kết quả AI này chính xác như thế nào?",
        "Tôi có thể tin tưởng vào kết quả này không?"
    ])
    
    # Trả về 4-5 suggestions ngẫu nhiên
    import random
    random.shuffle(suggestions)
    return suggestions[:4]

"""
Cơ sở dữ liệu thông tin bệnh da liễu
"""
from .models import Severity


# Ánh xạ tên bệnh tiếng Anh -> tiếng Việt và thông tin chi tiết
DISEASE_DATABASE = {
    # Ung thư da
    "melanoma": {
        "vietnamese": "Ung thư hắc tố",
        "severity": Severity.CRITICAL,
        "description": "Ung thư da nghiêm trọng nhất, phát triển từ tế bào sắc tố (melanocyte). Cần chẩn đoán và điều trị khẩn cấp.",
        "recommendations": [
            "⚠️ ĐI KHÁM NGAY LẬP TỨC với bác sĩ da liễu hoặc bác sĩ ung thư",
            "Không tự điều trị",
            "Chuẩn bị danh sách các nốt ruồi/vết thay đổi gần đây",
            "Chụp ảnh theo dõi sự thay đổi"
        ]
    },
    "basal cell carcinoma": {
        "vietnamese": "Ung thư tế bào đáy",
        "severity": Severity.SEVERE,
        "description": "Loại ung thư da phổ biến nhất, phát triển chậm nhưng cần điều trị để tránh biến chứng.",
        "recommendations": [
            "Đặt lịch khám với bác sĩ da liễu trong 1-2 tuần",
            "Tránh ánh nắng mặt trời trực tiếp",
            "Sử dụng kem chống nắng SPF 50+",
            "Không cố gắng tự điều trị"
        ]
    },
    "squamous cell carcinoma": {
        "vietnamese": "Ung thư tế bào vảy",
        "severity": Severity.SEVERE,
        "description": "Ung thư da phổ biến thứ hai, có thể lan sang các bộ phận khác nếu không điều trị.",
        "recommendations": [
            "Đặt lịch khám với bác sĩ da liễu trong 1-2 tuần",
            "Tránh tiếp xúc với ánh nắng mặt trời",
            "Bảo vệ vùng da bị ảnh hưởng",
            "Kiểm tra các hạch lympho gần đó"
        ]
    },
    
    # Các tổn thương lành tính
    "nevus": {
        "vietnamese": "Nốt ruồi",
        "severity": Severity.BENIGN,
        "description": "Nốt ruồi bình thường, thường lành tính. Cần theo dõi nếu có thay đổi về hình dạng, màu sắc hoặc kích thước.",
        "recommendations": [
            "Tự kiểm tra định kỳ (quy tắc ABCDE)",
            "Chụp ảnh để theo dõi sự thay đổi",
            "Khám da liễu định kỳ hàng năm",
            "Tránh ánh nắng mặt trời trực tiếp, dùng kem chống nắng"
        ]
    },
    "seborrheic keratosis": {
        "vietnamese": "Dày sừng tiết bã",
        "severity": Severity.BENIGN,
        "description": "Tổn thương da lành tính phổ biến ở người lớn tuổi, không nguy hiểm nhưng có thể gây khó chịu về thẩm mỹ.",
        "recommendations": [
            "Không cần điều trị nếu không gây khó chịu",
            "Có thể loại bỏ vì lý do thẩm mỹ (cryotherapy, laser)",
            "Tránh cào gãi hoặc tự loại bỏ",
            "Khám định kỳ nếu có nhiều tổn thương"
        ]
    },
    
    # Tiền ung thư
    "actinic keratosis": {
        "vietnamese": "Dày sừng quang hóa",
        "severity": Severity.MODERATE,
        "description": "Tổn thương tiền ung thư do tiếp xúc với ánh nắng mặt trời. Có thể phát triển thành ung thư tế bào vảy.",
        "recommendations": [
            "Đặt lịch khám với bác sĩ da liễu trong 2-4 tuần",
            "Sử dụng kem chống nắng SPF 50+ hàng ngày",
            "Tránh ánh nắng mặt trời từ 10h-16h",
            "Cân nhắc điều trị dự phòng (kem, cryotherapy)"
        ]
    },
    
    # Viêm da
    "eczema": {
        "vietnamese": "Viêm da/Chàm",
        "severity": Severity.MILD,
        "description": "Tình trạng viêm da mãn tính gây ngứa, khô và đỏ. Có thể quản lý được bằng điều trị thích hợp.",
        "recommendations": [
            "Giữ ẩm cho da bằng kem dưỡng ẩm không mùi",
            "Tránh các chất gây kích ứng (xà phòng mạnh, nước nóng)",
            "Sử dụng kem corticosteroid theo toa (nếu có)",
            "Khám bác sĩ nếu triệu chứng nặng hoặc lây nhiễm"
        ]
    },
    "psoriasis": {
        "vietnamese": "Vảy nến",
        "severity": Severity.MODERATE,
        "description": "Bệnh tự miễn mãn tính gây tăng sinh tế bào da quá nhanh, tạo mảng vảy dày. Cần quản lý lâu dài.",
        "recommendations": [
            "Khám bác sĩ da liễu để xây dựng kế hoạch điều trị",
            "Giữ ẩm cho da thường xuyên",
            "Cân nhắc liệu pháp ánh sáng (phototherapy)",
            "Quản lý stress và lối sống lành mạnh"
        ]
    },
    "dermatitis": {
        "vietnamese": "Viêm da",
        "severity": Severity.MILD,
        "description": "Viêm da chung, có thể do tiếp xúc, dị ứng hoặc nguyên nhân khác.",
        "recommendations": [
            "Xác định và tránh chất gây kích ứng",
            "Giữ ẩm cho da",
            "Sử dụng kem corticosteroid nhẹ nếu cần",
            "Khám bác sĩ nếu không thấy cải thiện sau 1-2 tuần"
        ]
    },
    
    # Nhiễm trùng
    "wart": {
        "vietnamese": "Mụn cóc",
        "severity": Severity.MILD,
        "description": "Tổn thương da do virus HPV gây ra. Có thể tự khỏi hoặc cần điều trị.",
        "recommendations": [
            "Tránh cào gãi để không lây lan",
            "Có thể điều trị tại nhà với salicylic acid",
            "Khám bác sĩ nếu mụn cóc lan rộng hoặc ở vùng nhạy cảm",
            "Giữ vệ sinh tốt"
        ]
    },
    
    # Mặc định cho các bệnh khác
    "default": {
        "vietnamese": "Tổn thương da",
        "severity": Severity.MODERATE,
        "description": "Phát hiện tổn thương da. Cần đánh giá thêm để chẩn đoán chính xác.",
        "recommendations": [
            "Đặt lịch khám với bác sĩ da liễu",
            "Chụp ảnh tổn thương để theo dõi",
            "Ghi chú các triệu chứng (ngứa, đau, thay đổi)",
            "Không tự điều trị trước khi có chẩn đoán"
        ]
    }
}

# BỔ SUNG: Một số bệnh da phổ biến khác (mở rộng phạm vi nhận diện)
DISEASE_DATABASE.update({
    # Viêm/mụn
    "acne": {
        "vietnamese": "Mụn trứng cá",
        "severity": Severity.MILD,
        "description": "Tình trạng tắc nghẽn nang lông và tuyến bã gây mụn đầu trắng/đen, mụn viêm.",
        "recommendations": [
            "Giữ vệ sinh da sạch, tránh cọ xát mạnh",
            "Sử dụng sản phẩm chứa BHA/AHA hoặc benzoyl peroxide nhẹ",
            "Không tự nặn mụn để tránh sẹo và nhiễm trùng",
            "Khám da liễu nếu mụn viêm nặng hoặc kéo dài"
        ]
    },
    "rosacea": {
        "vietnamese": "Chứng đỏ mặt (Rosacea)",
        "severity": Severity.MODERATE,
        "description": "Tình trạng đỏ mặt, giãn mạch, có thể kèm mụn mủ ở vùng trung tâm mặt.",
        "recommendations": [
            "Tránh nắng, nóng, đồ cay/ẩm thực kích thích",
            "Dùng kem chống nắng phổ rộng hằng ngày",
            "Khám da liễu để cân nhắc thuốc bôi/thuốc uống",
            "Tránh sản phẩm chăm sóc da gây kích ứng"
        ]
    },
    "urticaria": {
        "vietnamese": "Mày đay",
        "severity": Severity.MILD,
        "description": "Mẩn đỏ, nổi mề đay, ngứa, thường do dị ứng hoặc kích ứng tạm thời.",
        "recommendations": [
            "Tránh tác nhân nghi ngờ (thực phẩm/thuốc/môi trường)",
            "Có thể dùng kháng histamine không kê đơn",
            "Đi khám nếu sưng môi/lưỡi/khó thở hoặc kéo dài > 48 giờ"
        ]
    },
    "tinea": {
        "vietnamese": "Nấm da",
        "severity": Severity.MILD,
        "description": "Nhiễm nấm nông gây mảng đỏ, rìa rõ, ngứa; có thể ở da thân, bẹn, chân.",
        "recommendations": [
            "Giữ da khô thoáng, tránh ẩm ướt kéo dài",
            "Dùng thuốc chống nấm bôi (theo hướng dẫn)",
            "Khám bác sĩ nếu lan rộng hoặc không cải thiện sau 2 tuần"
        ]
    },
    "vitiligo": {
        "vietnamese": "Bạch biến",
        "severity": Severity.MODERATE,
        "description": "Mất sắc tố khu trú/lan tỏa gây mảng trắng trên da do rối loạn miễn dịch.",
        "recommendations": [
            "Tránh nắng, dùng kem chống nắng SPF 50+",
            "Tham khảo bác sĩ về liệu pháp bôi/ánh sáng",
            "Theo dõi tiến triển và yếu tố khởi phát"
        ]
    },
    "impetigo": {
        "vietnamese": "Chốc lở",
        "severity": Severity.MILD,
        "description": "Nhiễm khuẩn nông dễ lây, tạo vảy mật ong; thường gặp ở trẻ em.",
        "recommendations": [
            "Giữ vệ sinh, tránh gãi để không lan rộng",
            "Tham khảo bác sĩ về kháng sinh bôi/uống",
            "Tránh dùng chung đồ dùng cá nhân"
        ]
    },
    "cellulitis": {
        "vietnamese": "Viêm mô tế bào",
        "severity": Severity.SEVERE,
        "description": "Nhiễm trùng da/mô dưới da, đỏ, nóng, đau, có thể sốt; cần điều trị sớm.",
        "recommendations": [
            "Đi khám sớm để được đánh giá và dùng kháng sinh",
            "Nâng cao vùng bị ảnh hưởng, theo dõi dấu hiệu nặng",
            "Không tự chích/xử lý mủ tại nhà"
        ]
    },
    "folliculitis": {
        "vietnamese": "Viêm nang lông",
        "severity": Severity.MILD,
        "description": "Viêm lỗ chân lông do vi khuẩn/nấm/kích ứng, gây sẩn đỏ/mụn mủ quanh lông.",
        "recommendations": [
            "Giữ vùng da sạch và khô",
            "Tránh cạo sát/kỳ cọ mạnh",
            "Cân nhắc sát khuẩn nhẹ hoặc thuốc bôi theo chỉ định"
        ]
    },
    "dermatofibroma": {
        "vietnamese": "U xơ sợi da",
        "severity": Severity.BENIGN,
        "description": "Nốt cứng nhỏ, lành tính, thường ở chân; lõm xuống khi bóp hai bên (dấu hiệu dimple).",
        "recommendations": [
            "Thường không cần điều trị",
            "Có thể loại bỏ nếu gây thẩm mỹ hoặc kích ứng",
            "Theo dõi nếu có thay đổi nhanh"
        ]
    },
    "lipoma": {
        "vietnamese": "U mỡ",
        "severity": Severity.BENIGN,
        "description": "Khối u mỡ mềm, di động, lành tính dưới da; phát triển chậm.",
        "recommendations": [
            "Không cần điều trị trừ khi đau hoặc thẩm mỹ",
            "Tham khảo bác sĩ nếu lớn nhanh hoặc đau"
        ]
    },
    "cherry angioma": {
        "vietnamese": "U máu anh đào",
        "severity": Severity.BENIGN,
        "description": "Chấm đỏ tươi nhỏ do tăng sinh mạch máu, rất phổ biến và lành tính.",
        "recommendations": [
            "Không cần điều trị",
            "Có thể đốt laser nếu thẩm mỹ"
        ]
    },
    "skin tag": {
        "vietnamese": "Mụn thịt (u mềm treo)",
        "severity": Severity.BENIGN,
        "description": "Nhú mềm nhỏ, lành tính, thường ở vùng ma sát như cổ, nách.",
        "recommendations": [
            "An toàn khi loại bỏ tại cơ sở y tế",
            "Tránh tự cắt/buộc tại nhà"
        ]
    },
    "milia": {
        "vietnamese": "Hạt kê",
        "severity": Severity.BENIGN,
        "description": "Nang sừng nhỏ màu trắng, lành tính, thường quanh mắt/ má.",
        "recommendations": [
            "Thường tự hết; tránh nặn",
            "Có thể lấy nhân tại cơ sở y tế nếu cần"
        ]
    }
})


def get_disease_info(disease_name: str) -> dict:
    """
    Lấy thông tin chi tiết về một bệnh
    
    Args:
        disease_name: Tên bệnh tiếng Anh
        
    Returns:
        Dictionary chứa thông tin bệnh
    """
    # Chuẩn hóa tên bệnh
    disease_name_lower = disease_name.lower().strip()
    
    # Tìm trong database
    if disease_name_lower in DISEASE_DATABASE:
        return DISEASE_DATABASE[disease_name_lower]
    
    # Nếu không tìm thấy, trả về thông tin mặc định
    return DISEASE_DATABASE["default"]


def get_severity_from_disease(disease_name: str) -> Severity:
    """Lấy mức độ nghiêm trọng từ tên bệnh"""
    info = get_disease_info(disease_name)
    return info["severity"]


# Danh sách các bệnh phổ biến để phân loại
COMMON_DISEASES = [
    "melanoma",
    "basal cell carcinoma",
    "squamous cell carcinoma",
    "actinic keratosis",
    "seborrheic keratosis",
    "nevus",
    "eczema",
    "psoriasis",
    "dermatitis",
    "wart"
]


# Danh sách mở rộng từ PAD dataset
PAD_DISEASES = [
    "nevus",
    "basal cell carcinoma",
    "actinic keratosis",
    "seborrheic keratosis",
    "squamous cell carcinoma",
    "melanoma"
]

# Danh sách mở rộng kết hợp phổ biến + bệnh bổ sung (ưu tiên phạm vi rộng)
EXTENDED_DISEASES = [
    # Tập phổ biến
    *COMMON_DISEASES,
    # Bổ sung
    "acne",
    "rosacea",
    "urticaria",
    "tinea",
    "vitiligo",
    "impetigo",
    "cellulitis",
    "folliculitis",
    "dermatofibroma",
    "lipoma",
    "cherry angioma",
    "skin tag",
    "milia",
]

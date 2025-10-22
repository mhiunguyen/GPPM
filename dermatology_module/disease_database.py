<<<<<<< HEAD
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
=======
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
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4

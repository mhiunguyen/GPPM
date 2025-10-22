"""
Lớp chính để phân tích ảnh da liễu
"""
import torch
import open_clip
from PIL import Image
from pathlib import Path
from typing import Union, List, Optional
import logging

from .models import AnalysisResult, DiseaseInfo, Severity
from .disease_database import (
    get_disease_info, 
    get_severity_from_disease,
    COMMON_DISEASES,
    PAD_DISEASES,
    EXTENDED_DISEASES,
)


logger = logging.getLogger(__name__)


class DermatologyAnalyzer:
    """
    Lớp phân tích ảnh da liễu sử dụng DermLIP
    
    Example:
        >>> analyzer = DermatologyAnalyzer()
        >>> result = analyzer.analyze("skin_image.jpg")
        >>> print(result)
    """
    
    def __init__(
        self,
        model_name: str = "hf-hub:redlessone/DermLIP_ViT-B-16",
        device: Optional[str] = None,
        disease_list: Optional[List[str]] = None
    ):
        """
        Khởi tạo analyzer
        
        Args:
            model_name: Tên mô hình (mặc định: DermLIP ViT-B/16)
                       Có thể dùng: "hf-hub:redlessone/DermLIP_PanDerm-base-w-PubMed-256"
            device: Thiết bị để chạy ("cuda", "cpu", hoặc None để tự động)
            disease_list: Danh sách bệnh cần phân loại (mặc định: PAD_DISEASES)
        """
        # Xác định thiết bị
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
        
        logger.info(f"Đang tải mô hình {model_name} trên {self.device}...")
        
        # Tải mô hình
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(
            model_name
        )
        self.model.eval()
        self.model.to(self.device)
        
        # Tải tokenizer
        self.tokenizer = open_clip.get_tokenizer(model_name)

        # Danh sách bệnh: mặc định dùng mở rộng để tăng độ phủ
        self.disease_list = disease_list or EXTENDED_DISEASES

        # Chuẩn bị text features cho các bệnh
        self._prepare_text_features()

        logger.info("Khởi tạo thành công!")
    
    def _prepare_text_features(self):
        """Chuẩn bị các text features cho danh sách bệnh"""
        template = lambda c: f'This is a skin image of {c}'
        texts = [template(disease) for disease in self.disease_list]
        
        text_tokens = self.tokenizer(texts).to(self.device)
        
        with torch.no_grad():
            text_features = self.model.encode_text(text_tokens)
            text_features /= text_features.norm(dim=-1, keepdim=True)
        
        self.text_features = text_features
    
    def _load_image(self, image_input: Union[str, Path, Image.Image]) -> torch.Tensor:
        """
        Tải và tiền xử lý ảnh
        
        Args:
            image_input: Đường dẫn ảnh, Path object, hoặc PIL Image
            
        Returns:
            Tensor ảnh đã được tiền xử lý
        """
        if isinstance(image_input, (str, Path)):
            image = Image.open(image_input).convert('RGB')
        elif isinstance(image_input, Image.Image):
            image = image_input.convert('RGB')
        else:
            raise ValueError("image_input phải là đường dẫn hoặc PIL Image")
        
        return self.preprocess(image).unsqueeze(0).to(self.device)
    
    def classify(
        self, 
        image_input: Union[str, Path, Image.Image],
        top_k: int = 5
    ) -> List[tuple]:
        """
        Phân loại bệnh từ ảnh
        
        Args:
            image_input: Ảnh đầu vào
            top_k: Số lượng kết quả hàng đầu trả về
            
        Returns:
            List các tuple (tên_bệnh, xác_suất)
        """
        # Tải ảnh
        image_tensor = self._load_image(image_input)
        
        # Encode ảnh
        with torch.no_grad():
            if self.device == "cuda":
                with torch.autocast("cuda"):
                    image_features = self.model.encode_image(image_tensor)
            else:
                image_features = self.model.encode_image(image_tensor)
            
            image_features /= image_features.norm(dim=-1, keepdim=True)
            
            # Tính xác suất
            logits = 100.0 * image_features @ self.text_features.T
            probs = logits.softmax(dim=-1)[0]
        
        # Lấy top-k kết quả
        top_probs, top_indices = torch.topk(probs, min(top_k, len(self.disease_list)))
        
        results = [
            (self.disease_list[idx], prob.item())
            for idx, prob in zip(top_indices, top_probs)
        ]
        
        return results
    
    def analyze(
        self, 
        image_input: Union[str, Path, Image.Image],
        top_k: int = 5,
        include_concepts: bool = True
    ) -> AnalysisResult:
        """
        Phân tích toàn diện ảnh da liễu
        
        Args:
            image_input: Ảnh đầu vào
            top_k: Số lượng chẩn đoán thay thế
            include_concepts: Có trích xuất khái niệm lâm sàng không
            
        Returns:
            AnalysisResult object với đầy đủ thông tin
        """
        # Phân loại bệnh
        classifications = self.classify(image_input, top_k=top_k)
        
        # Lấy chẩn đoán chính
        primary_name, primary_conf = classifications[0]
        primary_info = get_disease_info(primary_name)
        
        primary_disease = DiseaseInfo(
            name=primary_name,
            vietnamese_name=primary_info["vietnamese"],
            confidence=primary_conf,
            severity=primary_info["severity"],
            description=primary_info["description"],
            recommendations=primary_info["recommendations"]
        )
        
        # Các chẩn đoán thay thế
        alternative_diseases = []
        for disease_name, confidence in classifications[1:]:
            info = get_disease_info(disease_name)
            alternative_diseases.append(DiseaseInfo(
                name=disease_name,
                vietnamese_name=info["vietnamese"],
                confidence=confidence,
                severity=info["severity"],
                description=info["description"],
                recommendations=info["recommendations"]
            ))
        
        # Xác định mức độ nghiêm trọng tổng thể
        overall_severity = primary_disease.severity
        
        # Tạo mô tả tổng quan
        description = self._generate_description(primary_disease, classifications)
        
        # Trích xuất khái niệm lâm sàng (đơn giản hóa)
        clinical_concepts = []
        if include_concepts:
            clinical_concepts = self._extract_concepts(primary_disease)
        
        # Tạo khuyến nghị tổng thể
        recommendations = self._generate_recommendations(primary_disease)
        
        # Metadata
        metadata = {
            "model": "DermLIP",
            "device": self.device,
            "top_k": top_k
        }
        
        return AnalysisResult(
            primary_disease=primary_disease,
            alternative_diseases=alternative_diseases,
            clinical_concepts=clinical_concepts,
            description=description,
            overall_severity=overall_severity,
            recommendations=recommendations,
            metadata=metadata
        )
    
    def _generate_description(self, primary: DiseaseInfo, classifications: List[tuple]) -> str:
        """Tạo mô tả tổng quan"""
        if primary.confidence > 0.7:
            confidence_text = "rất cao"
        elif primary.confidence > 0.5:
            confidence_text = "khá cao"
        elif primary.confidence > 0.3:
            confidence_text = "trung bình"
        else:
            confidence_text = "thấp"
        
        description = (
            f"Dựa trên phân tích ảnh, tổn thương này có khả năng {confidence_text} "
            f"({primary.confidence:.1%}) là {primary.vietnamese_name}. "
        )
        
        if primary.severity in [Severity.SEVERE, Severity.CRITICAL]:
            description += "Đây là tình trạng cần được chú ý và khám chuyên khoa càng sớm càng tốt. "
        elif primary.severity == Severity.MODERATE:
            description += "Nên đặt lịch khám với bác sĩ da liễu để đánh giá chính xác. "
        else:
            description += "Tuy nhiên, vẫn nên theo dõi và khám định kỳ. "
        
        return description
    
    def _extract_concepts(self, disease: DiseaseInfo) -> List[str]:
        """Trích xuất khái niệm lâm sàng (đơn giản hóa)"""
        concepts = []
        
        # Dựa vào tên bệnh để gán khái niệm
        if "carcinoma" in disease.name.lower() or "melanoma" in disease.name.lower():
            concepts.extend(["ung thư", "cần sinh thiết", "theo dõi"])
        elif "keratosis" in disease.name.lower():
            concepts.extend(["dày sừng", "do ánh nắng", "tiền ung thư"])
        elif "nevus" in disease.name.lower():
            concepts.extend(["nốt ruồi", "lành tính", "theo dõi"])
        elif any(term in disease.name.lower() for term in ["eczema", "dermatitis", "psoriasis"]):
            concepts.extend(["viêm da", "ngứa", "mãn tính"])
        
        return concepts
    
    def _generate_recommendations(self, disease: DiseaseInfo) -> List[str]:
        """Tạo khuyến nghị tổng thể"""
        recommendations = disease.recommendations.copy()
        
        # Thêm khuyến nghị chung
        general_recs = [
            "Kết quả này chỉ mang tính tham khảo, không thay thế chẩn đoán y khoa",
            "Luôn tham khảo ý kiến bác sĩ da liễu chuyên nghiệp",
        ]
        
        recommendations.extend(general_recs)
        return recommendations
    
    def batch_analyze(
        self,
        image_inputs: List[Union[str, Path, Image.Image]],
        **kwargs
    ) -> List[AnalysisResult]:
        """
        Phân tích nhiều ảnh cùng lúc
        
        Args:
            image_inputs: Danh sách ảnh đầu vào
            **kwargs: Tham số cho analyze()
            
        Returns:
            List các AnalysisResult
        """
        results = []
        for image_input in image_inputs:
            try:
                result = self.analyze(image_input, **kwargs)
                results.append(result)
            except Exception as e:
                logger.error(f"Lỗi khi phân tích {image_input}: {e}")
                results.append(None)
        
        return results
    
    def get_image_embedding(self, image_input: Union[str, Path, Image.Image]) -> torch.Tensor:
        """
        Lấy embedding vector của ảnh
        
        Args:
            image_input: Ảnh đầu vào
            
        Returns:
            Tensor embedding đã chuẩn hóa
        """
        image_tensor = self._load_image(image_input)
        
        with torch.no_grad():
            image_features = self.model.encode_image(image_tensor)
            image_features /= image_features.norm(dim=-1, keepdim=True)
        
        return image_features
    
    def search_by_text(self, text_query: str, top_k: int = 5) -> List[tuple]:
        """
        Tìm kiếm bệnh phù hợp với mô tả văn bản
        
        Args:
            text_query: Mô tả triệu chứng bằng văn bản
            top_k: Số kết quả trả về
            
        Returns:
            List các tuple (tên_bệnh, độ_tương_đồng)
        """
        # Encode văn bản
        text_tokens = self.tokenizer([text_query]).to(self.device)
        
        with torch.no_grad():
            query_features = self.model.encode_text(text_tokens)
            query_features /= query_features.norm(dim=-1, keepdim=True)
            
            # Tính độ tương đồng
            similarities = (100.0 * query_features @ self.text_features.T)[0]
        
        # Lấy top-k
        top_sims, top_indices = torch.topk(similarities, min(top_k, len(self.disease_list)))
        
        results = [
            (self.disease_list[idx], sim.item())
            for idx, sim in zip(top_indices, top_sims)
        ]
        
        return results

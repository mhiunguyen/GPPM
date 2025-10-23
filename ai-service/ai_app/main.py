from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional, Dict
import json
import sys
from pathlib import Path
import io
from PIL import Image

# Thêm dermatology_module vào Python path
# Đường dẫn tuyệt đối để tránh lỗi khi chạy từ các thư mục khác nhau
WORKSPACE_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(WORKSPACE_ROOT / "dermatology_module"))
sys.path.insert(0, str(WORKSPACE_ROOT))

import importlib

# We'll try to import the real DermatologyAnalyzer lazily; if it fails (missing heavy deps)
# we'll fall back to a lightweight stub implementation below.


from .schemas import AnalyzeResult, Symptoms, DiseaseInfo
from .logic.rules import decide_risk, adjust_scores, WARNING_FLAGS, INFLAMMATION_SYMPTOMS, CRITICAL_FLAGS, SEVERE_FLAGS, apply_duration_adjustment
from .capture import capture_service
from .routes import router as capture_router

app = FastAPI(title="DermaSafe-AI Service", version="0.3.0")

# Mount capture routes
app.include_router(capture_router)

# Khởi tạo DermatologyAnalyzer (thử import bằng importlib để tránh import-time errors)
DERMATOLOGY_ANALYZER = None
DermAnalysisResult = None
try:
    analyzer_mod = importlib.import_module("dermatology_module.analyzer")
    models_mod = importlib.import_module("dermatology_module.models")
    DermatologyAnalyzer = analyzer_mod.DermatologyAnalyzer
    DermAnalysisResult = models_mod.AnalysisResult
    try:
        DERMATOLOGY_ANALYZER = DermatologyAnalyzer()
        print("✅ DermatologyAnalyzer đã được khởi tạo thành công")
    except Exception as e:
        print(f"⚠️ Không thể khởi tạo DermatologyAnalyzer: {e}")
        print("⚠️ Sẽ sử dụng stub scores")
        DERMATOLOGY_ANALYZER = None
except Exception as e:
    # Import failed (likely missing heavy deps like torch/open_clip) -> use stub
    print(f"⚠️ Không thể import dermatology_module: {e}")
    print("⚠️ Sẽ sử dụng stub implementation cho môi trường test nhẹ")
    DERMATOLOGY_ANALYZER = None
    DermAnalysisResult = None


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "dermatology_analyzer": "active" if DERMATOLOGY_ANALYZER else "inactive"
    }


@app.post("/analyze", response_model=AnalyzeResult)
async def analyze(
    image: UploadFile = File(...),
    # Backward-compat: allow either structured JSON ('symptoms_json') or simple CSV ('symptoms_selected')
    symptoms_json: Optional[str] = Form(None),
    symptoms_selected: Optional[str] = Form(None),
    duration: Optional[str] = Form(None),
    enhance: Optional[bool] = Form(False),  # New: enable smart capture enhancement
):
    # Đọc ảnh
    image_bytes = await image.read()
    
    # Smart capture enhancement (if enabled and available)
    # Luôn kiểm tra chất lượng cơ bản (dùng cho nhận diện 'undetectable' hoặc 'normal')
    quality_basic = None
    try:
        quality_basic = capture_service.check_quality(image_bytes)
    except Exception as e:
        print(f"⚠️ Basic quality check failed: {e}")

    quality_report = None
    if enhance and capture_service.is_available():
        try:
            image_bytes, quality_report = capture_service.process(image_bytes, auto_crop=False)
            print(f"✅ Image enhanced. Quality improved by {quality_report.get('improvement', 0):.1f} points")
        except Exception as e:
            print(f"⚠️ Enhancement failed: {e}. Using original image.")
    
    # Phân tích bằng DermatologyAnalyzer
    derm_result = None  # type: ignore
    cv_scores: Dict[str, float] = {}
    
    if DERMATOLOGY_ANALYZER is not None:
        try:
            # Chuyển bytes thành PIL Image
            pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            
            # Phân tích
            derm_result = DERMATOLOGY_ANALYZER.analyze(pil_image, top_k=7)
            
            # Tạo cv_scores từ kết quả phân tích
            cv_scores[derm_result.primary_disease.name] = derm_result.primary_disease.confidence
            for alt_disease in derm_result.alternative_diseases:
                cv_scores[alt_disease.name] = alt_disease.confidence
                
        except Exception as e:
            print(f"Lỗi khi phân tích với DermatologyAnalyzer: {e}")
            # Fallback to stub scores
            cv_scores = {
                "melanoma": 0.05,
                "nevus": 0.7,
                "eczema": 0.2,
                "acne": 0.05,
            }
    else:
        # Stub scores nếu không có analyzer
        cv_scores = {
            "melanoma": 0.05,
            "nevus": 0.7,
            "eczema": 0.2,
            "acne": 0.05,
        }

    # Phân tích triệu chứng
    symptoms_model: Symptoms
    if symptoms_json:
        try:
            parsed = json.loads(symptoms_json)
        except json.JSONDecodeError:
            return JSONResponse(status_code=400, content={"detail": "symptoms_json không phải JSON hợp lệ"})
        symptoms_model = Symptoms(**parsed)
    else:
        # Backward-compat: accept CSV in symptoms_selected and optional duration string
        selected = []
        if symptoms_selected:
            selected = [s.strip() for s in symptoms_selected.split(",") if s.strip()]
        symptoms_model = Symptoms(symptoms_selected=selected, duration=duration)  # type: ignore[arg-type]

    # Điều chỉnh điểm theo triệu chứng và quyết định mức độ rủi ro
    adjusted_scores, adj_expl = adjust_scores(cv_scores, symptoms_model.symptoms_selected)
    risk, reason = decide_risk(adjusted_scores, symptoms_model.symptoms_selected, symptoms_model.duration)
    # Apply additional duration-based adjustment as a safety layer
    risk, reason = apply_duration_adjustment(risk, reason, symptoms_model.symptoms_selected, symptoms_model.duration)
    
    # Tạo response
    # Xác định detection_status (normal / undetectable / detected)
    # Sử dụng heuristic dựa trên chất lượng ảnh, điểm mô hình và triệu chứng đã chọn
    det_status = "detected"
    det_message = None
    try:
        top_score = 0.0
        if adjusted_scores:
            top_score = max(adjusted_scores.values()) if adjusted_scores else 0.0
        # Lấy điểm chất lượng (chuẩn hóa 0..1)
        q = None
        if isinstance(quality_basic, dict):
            if 'overall_score' in quality_basic and isinstance(quality_basic['overall_score'], (int, float)):
                q = float(quality_basic['overall_score'])
            elif 'score' in quality_basic and isinstance(quality_basic['score'], (int, float)):
                q = float(quality_basic['score']) / 100.0
        q = 0.0 if q is None else max(0.0, min(1.0, q))

        sel = {s.strip().lower() for s in (symptoms_model.symptoms_selected or []) if s and s.strip()}
        has_alert_symptom = bool(sel & (CRITICAL_FLAGS | SEVERE_FLAGS | WARNING_FLAGS | INFLAMMATION_SYMPTOMS))

        # Undetectable: chất lượng kém rõ rệt hoặc không có đặc trưng (điểm rất thấp)
        if (q <= 0.35) or (top_score < 0.05):
            det_status = "undetectable"
            det_message = (
                "Không nhận diện được vùng da rõ ràng. Vui lòng chụp lại với ánh sáng tốt, lấy nét và vùng da chiếm 50-70% khung hình."
            )
            risk = "THẤP 🟢"
            reason = "Ảnh chất lượng thấp hoặc không có đủ đặc trưng để phân tích. " + (det_message or "")
        # Normal: chất lượng đủ tốt, điểm mô hình thấp, không có triệu chứng đáng lo
        elif (q >= 0.6) and (top_score < 0.15) and (not has_alert_symptom):
            det_status = "normal"
            det_message = "Ảnh cho thấy da có vẻ bình thường, không phát hiện tổn thương rõ ràng."
            risk = "THẤP 🟢"
            reason = det_message
        else:
            det_status = "detected"
    except Exception as e:
        print(f"⚠️ detection_status evaluation failed: {e}")

    result = AnalyzeResult(
        risk=risk,
        reason=reason,
        cv_scores=adjusted_scores,
        detection_status=det_status,
        detection_message=det_message,
        explanations={
            "image_evidence": cv_scores,
            "symptom_evidence": {
                "selected": symptoms_model.symptoms_selected,
                "duration": symptoms_model.duration,
            },
            "adjustments": adj_expl.get("adjustments", []),
            "final_decision": {
                "risk": risk,
                "reason": reason,
            },
        }
    )
    
    # Thêm thông tin chi tiết từ DermatologyAnalyzer nếu có
    if derm_result:
        result.primary_disease = DiseaseInfo(
            name=derm_result.primary_disease.name,
            vietnamese_name=derm_result.primary_disease.vietnamese_name,
            confidence=derm_result.primary_disease.confidence,
            severity=derm_result.primary_disease.severity.value,
            description=derm_result.primary_disease.description,
            recommendations=derm_result.primary_disease.recommendations
        )
        
        result.alternative_diseases = [
            DiseaseInfo(
                name=d.name,
                vietnamese_name=d.vietnamese_name,
                confidence=d.confidence,
                severity=d.severity.value,
                description=d.description,
                recommendations=d.recommendations
            )
            for d in derm_result.alternative_diseases
        ]
        
        result.clinical_concepts = derm_result.clinical_concepts
        result.description = derm_result.description
        result.overall_severity = derm_result.overall_severity.value
        result.recommendations = derm_result.recommendations
    
    return result

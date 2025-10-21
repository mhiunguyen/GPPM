# Luồng xử lý tích hợp Dermatology Module

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                           │
│                                                                     │
│  User uploads: [Image] + [Symptoms] + [Duration]                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ POST /api/v1/analyze
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND-API (Port 8000)                        │
│                                                                     │
│  • Validates request                                                │
│  • Logs to PostgreSQL                                               │
│  • Forwards to AI Service                                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ POST /analyze
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       AI-SERVICE (Port 8001)                        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 1. Receive image bytes + symptoms                           │  │
│  └───────────────────┬──────────────────────────────────────────┘  │
│                      ▼                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 2. Convert bytes → PIL Image                                │  │
│  └───────────────────┬──────────────────────────────────────────┘  │
│                      ▼                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 3. DermatologyAnalyzer.analyze(image)                       │  │
│  │                                                              │  │
│  │    ┌─────────────────────────────────────────────────────┐  │  │
│  │    │ DERMATOLOGY MODULE                                  │  │  │
│  │    │                                                     │  │  │
│  │    │  a) Load DermLIP model (cached after first time)   │  │  │
│  │    │     • ViT-B/16 CLIP model (~340MB)                 │  │  │
│  │    │     • From HuggingFace Hub                         │  │  │
│  │    │                                                     │  │  │
│  │    │  b) Preprocess image                               │  │  │
│  │    │     • Resize, normalize                            │  │  │
│  │    │     • Convert to tensor                            │  │  │
│  │    │                                                     │  │  │
│  │    │  c) Encode image with CLIP                         │  │  │
│  │    │     image_features = model.encode_image(image)     │  │  │
│  │    │                                                     │  │  │
│  │    │  d) Compare with disease embeddings                │  │  │
│  │    │     • Pre-computed text features for 6 diseases    │  │  │
│  │    │     • Cosine similarity                            │  │  │
│  │    │     • Softmax to get probabilities                 │  │  │
│  │    │                                                     │  │  │
│  │    │  e) Get top-k predictions                          │  │  │
│  │    │     melanoma: 0.72                                 │  │  │
│  │    │     nevus: 0.15                                    │  │  │
│  │    │     basal cell carcinoma: 0.08                     │  │  │
│  │    │     ...                                            │  │  │
│  │    │                                                     │  │  │
│  │    │  f) Lookup disease info from database             │  │  │
│  │    │     • Vietnamese name                              │  │  │
│  │    │     • Severity level                               │  │  │
│  │    │     • Description                                  │  │  │
│  │    │     • Recommendations                              │  │  │
│  │    │                                                     │  │  │
│  │    │  g) Generate clinical concepts                     │  │  │
│  │    │     • Extract keywords from disease                │  │  │
│  │    │     • ["ung thư", "cần sinh thiết", "theo dõi"]   │  │  │
│  │    │                                                     │  │  │
│  │    │  h) Generate description & recommendations         │  │  │
│  │    │                                                     │  │  │
│  │    │  i) Return AnalysisResult                          │  │  │
│  │    └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────┬──────────────────────────────────────────┘  │
│                      ▼                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 4. Map DermAnalysisResult → AnalyzeResult                   │  │
│  │    • primary_disease                                        │  │
│  │    • alternative_diseases                                   │  │
│  │    • clinical_concepts                                      │  │
│  │    • description, severity, recommendations                 │  │
│  └───────────────────┬──────────────────────────────────────────┘  │
│                      ▼                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 5. Apply Rules Engine                                       │  │
│  │    • Combine CV scores with symptoms                        │  │
│  │    • Decide risk level (HIGH/MEDIUM/LOW)                    │  │
│  │    • Generate reason                                        │  │
│  └───────────────────┬──────────────────────────────────────────┘  │
│                      ▼                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 6. Return complete AnalyzeResult                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ JSON Response
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND-API (Port 8000)                        │
│                                                                     │
│  • Receives AI response                                             │
│  • Logs to database                                                 │
│  • Forwards to client                                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ JSON Response
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                           │
│                                                                     │
│  Displays:                                                          │
│  • 🔴 Risk: CAO                                                     │
│  • 📋 Disease: Ung thư hắc tố (72%)                                 │
│  • 📝 Description: "Dựa trên phân tích ảnh..."                      │
│  • 💡 Recommendations:                                              │
│    - ⚠️ ĐI KHÁM NGAY LẬP TỨC                                       │
│    - Không tự điều trị                                              │
│  • 🔄 Alternative diagnoses                                         │
│  • 🏥 Clinical concepts                                             │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                          DATA MODELS
═══════════════════════════════════════════════════════════════════════

DiseaseInfo {
  name: string                 // "melanoma"
  vietnamese_name: string      // "Ung thư hắc tố"
  confidence: float            // 0.72
  severity: string             // "rất nghiêm trọng"
  description: string          // Full description in Vietnamese
  recommendations: string[]    // List of actionable recommendations
}

AnalyzeResult {
  // Legacy fields (backward compatible)
  risk: string                 // "cao" | "trung bình" | "thấp"
  reason: string               // Brief explanation
  cv_scores: Dict[str, float]  // {"melanoma": 0.72, ...}
  
  // New detailed fields
  primary_disease: DiseaseInfo
  alternative_diseases: DiseaseInfo[]
  clinical_concepts: string[]
  description: string
  overall_severity: string
  recommendations: string[]
}


═══════════════════════════════════════════════════════════════════════
                         KEY FEATURES
═══════════════════════════════════════════════════════════════════════

✅ State-of-the-art AI (DermLIP CLIP model)
✅ Vietnamese language support
✅ Detailed disease information
✅ Confidence scores
✅ Severity classification
✅ Actionable recommendations
✅ Multiple alternative diagnoses
✅ Clinical concepts extraction
✅ Backward compatible API
✅ Graceful fallback (if model fails)
✅ Docker containerized
✅ GPU support (optional)
✅ Model caching (after first download)


═══════════════════════════════════════════════════════════════════════
                      SUPPORTED DISEASES
═══════════════════════════════════════════════════════════════════════

1. melanoma                → Ung thư hắc tố          [CRITICAL]
2. basal cell carcinoma    → Ung thư tế bào đáy      [SEVERE]
3. squamous cell carcinoma → Ung thư tế bào vảy      [SEVERE]
4. actinic keratosis       → Dày sừng quang hóa      [MODERATE]
5. seborrheic keratosis    → Dày sừng tiết bã        [BENIGN]
6. nevus                   → Nốt ruồi                [BENIGN]


═══════════════════════════════════════════════════════════════════════
                         PERFORMANCE
═══════════════════════════════════════════════════════════════════════

CPU (Intel i7):
  • First time: ~30s (model loading)
  • Subsequent: ~5-10s per image
  • Memory: ~2GB

GPU (NVIDIA T4):
  • First time: ~20s (model loading)
  • Subsequent: ~1-2s per image
  • Memory: ~2GB RAM + 2GB VRAM

Model Size:
  • DermLIP ViT-B/16: ~340MB
  • Cache location: ~/.cache/huggingface/


═══════════════════════════════════════════════════════════════════════
                      DEPLOYMENT OPTIONS
═══════════════════════════════════════════════════════════════════════

1. Quick Start (Recommended):
   ./quick_start.sh

2. Docker Compose:
   docker-compose up -d --build

3. Local Development:
   cd ai-service
   pip install -r requirements.txt
   uvicorn app.main:app --reload


═══════════════════════════════════════════════════════════════════════
```

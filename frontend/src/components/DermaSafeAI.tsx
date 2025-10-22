import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function DermaSafeAI() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState('vi');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['main']);
  const [customSymptom, setCustomSymptom] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [validating, setValidating] = useState(false);

  // Triệu chứng được nhóm theo danh mục
  const symptomCategories = {
    main: {
      title: { vi: '🧠 Triệu chứng chính (phổ biến)', en: '🧠 Main Symptoms (Common)' },
      symptoms: [
        { id: 'itching', vi: 'Ngứa', en: 'Itching' },
        { id: 'pain', vi: 'Đau', en: 'Pain' },
        { id: 'bleeding', vi: 'Chảy máu', en: 'Bleeding' },
        { id: 'swelling', vi: 'Sưng tấy', en: 'Swelling' },
        { id: 'redness', vi: 'Đỏ', en: 'Redness' },
        { id: 'scaling', vi: 'Bong vảy', en: 'Scaling' },
        { id: 'crusting', vi: 'Đóng vảy', en: 'Crusting' },
        { id: 'warmth', vi: 'Nóng rát', en: 'Warmth' },
        { id: 'discharge', vi: 'Tiết dịch', en: 'Discharge' }
      ]
    },
    appearance: {
      title: { vi: '🔍 Biểu hiện ngoài da', en: '🔍 Skin Appearance' },
      symptoms: [
        { id: 'red_rash', vi: 'Nổi mẩn đỏ', en: 'Red rash' },
        { id: 'blisters', vi: 'Nổi mụn nước', en: 'Blisters' },
        { id: 'pustules', vi: 'Nổi mụn mủ', en: 'Pustules' },
        { id: 'nodules', vi: 'Nổi sần cứng', en: 'Hard nodules' },
        { id: 'ulcers', vi: 'Xuất hiện vết loét', en: 'Ulcers' },
        { id: 'cracks', vi: 'Xuất hiện vết nứt nẻ', en: 'Cracks' },
        { id: 'dry_flaky', vi: 'Da khô, bong tróc', en: 'Dry, flaky skin' },
        { id: 'discoloration', vi: 'Da đổi màu (thâm, sạm, trắng bệch)', en: 'Discoloration' },
        { id: 'thickened', vi: 'Da dày sừng, chai cứng', en: 'Thickened skin' },
        { id: 'large_scales', vi: 'Xuất hiện mảng tróc lớn', en: 'Large scales' },
        { id: 'tight_skin', vi: 'Da bóng, căng hoặc có cảm giác kéo căng', en: 'Tight, shiny skin' },
        { id: 'patchy_dark', vi: 'Xuất hiện vùng da sậm màu hoặc loang lổ', en: 'Patchy dark areas' }
      ]
    },
    sensation: {
      title: { vi: '💫 Cảm giác kèm theo', en: '💫 Associated Sensations' },
      symptoms: [
        { id: 'severe_itch', vi: 'Ngứa rát dữ dội', en: 'Severe itching' },
        { id: 'episodic_itch', vi: 'Ngứa từng cơn', en: 'Episodic itching' },
        { id: 'tingling', vi: 'Cảm giác châm chích hoặc tê', en: 'Tingling or numbness' },
        { id: 'burning', vi: 'Nóng rát hoặc bỏng rát', en: 'Burning sensation' },
        { id: 'tender_touch', vi: 'Cảm giác đau khi chạm vào', en: 'Pain when touched' },
        { id: 'deep_ache', vi: 'Cảm giác nhức sâu dưới da', en: 'Deep ache under skin' }
      ]
    },
    spread: {
      title: { vi: '📍 Tình trạng lan rộng', en: '📍 Spread Pattern' },
      symptoms: [
        { id: 'localized', vi: 'Chỉ ở 1 vùng nhỏ', en: 'Localized to one area' },
        { id: 'spreading', vi: 'Lan sang vùng khác', en: 'Spreading to other areas' },
        { id: 'multiple_spots', vi: 'Xuất hiện nhiều ổ rải rác', en: 'Multiple scattered spots' },
        { id: 'rapid_spread', vi: 'Lan nhanh trong vài ngày', en: 'Rapid spread in days' },
        { id: 'chronic', vi: 'Đã kéo dài hơn 2 tuần', en: 'Lasting over 2 weeks' }
      ]
    },
    secretion: {
      title: { vi: '💧 Dịch tiết và mùi', en: '💧 Discharge & Odor' },
      symptoms: [
        { id: 'clear_fluid', vi: 'Có dịch trong', en: 'Clear discharge' },
        { id: 'yellow_fluid', vi: 'Có dịch vàng đục', en: 'Yellow cloudy discharge' },
        { id: 'pus', vi: 'Có mủ trắng hoặc xanh', en: 'White or green pus' },
        { id: 'bad_odor', vi: 'Có mùi hôi khó chịu', en: 'Bad odor' },
        { id: 'crusted_yellow', vi: 'Có vảy vàng hoặc đóng mủ khô', en: 'Yellow crusts or dried pus' }
      ]
    },
    systemic: {
      title: { vi: '🌡️ Triệu chứng toàn thân (nặng hơn)', en: '🌡️ Systemic Symptoms (Severe)' },
      symptoms: [
        { id: 'fever', vi: 'Sốt nhẹ hoặc sốt cao', en: 'Mild or high fever' },
        { id: 'fatigue', vi: 'Mệt mỏi, chóng mặt', en: 'Fatigue, dizziness' },
        { id: 'lymph_nodes', vi: 'Hạch sưng gần vùng tổn thương', en: 'Swollen lymph nodes' },
        { id: 'purple_swelling', vi: 'Da quanh vùng bệnh bị phù hoặc tím', en: 'Swelling or purple around area' },
        { id: 'joint_pain', vi: 'Đau nhức khớp hoặc cơ', en: 'Joint or muscle pain' }
      ]
    }
  };

  const durationOptions = [
    { value: 'less_week', vi: 'Dưới 1 tuần', en: 'Less than 1 week' },
    { value: 'week_month', vi: '1 tuần - 1 tháng', en: '1 week - 1 month' },
    { value: 'month_6month', vi: '1-6 tháng', en: '1-6 months' },
    { value: 'more_6month', vi: 'Hơn 6 tháng', en: 'More than 6 months' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCustomSymptom = async () => {
    const trimmedInput = customSymptom.trim();
    
    if (!trimmedInput) {
      setValidationMessage(language === 'vi' ? 'Vui lòng nhập triệu chứng!' : 'Please enter a symptom!');
      setTimeout(() => setValidationMessage(''), 3000);
      return;
    }

    setValidating(true);
    setValidationMessage('');

    try {
      // Call validation API
      const response = await fetch('http://localhost:8000/api/v1/validate-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: trimmedInput,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error('Validation API error');
      }

      const result = await response.json();

      if (result.valid) {
        // Valid symptoms - add to custom symptoms list
        const newSymptoms = result.symptoms.filter(
          (s: string) => !customSymptoms.includes(s)
        );
        
        if (newSymptoms.length > 0) {
          setCustomSymptoms(prev => [...prev, ...newSymptoms]);
          setValidationMessage(`✅ ${result.response}`);
        } else {
          setValidationMessage(language === 'vi' ? '⚠️ Triệu chứng đã có rồi!' : '⚠️ Symptom already exists!');
        }
        setCustomSymptom(''); // Clear input on success
      } else {
        // Invalid input - show funny response
        setValidationMessage(`❌ ${result.response}`);
      }

      // Auto-clear message after 5 seconds
      setTimeout(() => setValidationMessage(''), 5000);
    } catch (error) {
      console.error('Validation error:', error);
      
      // Fallback: Add directly without validation if API fails
      if (!customSymptoms.includes(trimmedInput)) {
        setCustomSymptoms(prev => [...prev, trimmedInput]);
        setValidationMessage(language === 'vi' 
          ? '⚠️ Đã thêm triệu chứng (chưa validate)'
          : '⚠️ Symptom added (not validated)'
        );
        setCustomSymptom('');
      }
      
      setTimeout(() => setValidationMessage(''), 3000);
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveCustomSymptom = (symptom: string) => {
    setCustomSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert(language === 'vi' ? 'Vui lòng chọn ảnh!' : 'Please select an image!');
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedImage);
    
    // Combine selected symptoms and custom symptoms
    const allSymptoms = [...symptoms, ...customSymptoms];
    formData.append('symptoms', JSON.stringify(allSymptoms));
    formData.append('duration', duration);
    formData.append('language', language);

    try {
      // Call Backend API
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Format response to match frontend structure
        const formattedResult = {
          success: true,
          risk_level: data.risk_level,
          primary_diagnosis: data.primary_diagnosis,
          alternative_diagnoses: data.alternative_diagnoses,
          recommendations: data.recommendations,
          detected_symptoms: data.detected_symptoms
        };
        setResult(formattedResult);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(
        language === 'vi' 
          ? 'Lỗi khi phân tích: ' + error.message + '\n\nĐảm bảo Backend API đang chạy tại http://localhost:8000'
          : 'Analysis error: ' + error.message + '\n\nMake sure Backend API is running at http://localhost:8000'
      );
      
      // Fallback to mock data if API fails
      const hasHighRiskSymptom = symptoms.includes('bleeding') || symptoms.includes('pain');
      const riskLevel = hasHighRiskSymptom ? 'HIGH' : symptoms.length > 3 ? 'MEDIUM' : 'LOW';
      
      const mockResult = {
        success: true,
        risk_level: riskLevel,
        primary_diagnosis: {
          disease: language === 'vi' ? 'Viêm da tiếp xúc' : 'Contact Dermatitis',
          confidence: 0.87,
          description: language === 'vi' 
            ? 'Phản ứng viêm của da do tiếp xúc với chất gây kích ứng hoặc dị ứng'
            : 'Inflammatory skin reaction caused by contact with irritants or allergens'
        },
        alternative_diagnoses: [
          { 
            disease: language === 'vi' ? 'Eczema' : 'Eczema', 
            confidence: 0.76,
            description: language === 'vi' ? 'Viêm da mãn tính gây ngứa' : 'Chronic inflammatory skin condition'
          },
          { 
            disease: language === 'vi' ? 'Nấm da' : 'Fungal Infection', 
            confidence: 0.65,
            description: language === 'vi' ? 'Nhiễm trùng do nấm' : 'Fungal skin infection'
          }
        ],
        recommendations: getRiskRecommendations(riskLevel, language),
        detected_symptoms: symptoms
      };

      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const getRiskRecommendations = (level: string, lang: string) => {
    const recommendations: any = {
      HIGH: {
        vi: {
          action: '🚨 Bạn NÊN ĐI KHÁM BÁC SĨ NGAY',
          reason: 'Phát hiện triệu chứng nghiêm trọng cần chú ý',
          steps: [
            'Đặt lịch khám da liễu trong 24-48 giờ',
            'Không tự điều trị',
            'Chụp ảnh theo dõi diễn biến',
            'Chuẩn bị danh sách thuốc đang dùng'
          ]
        },
        en: {
          action: '🚨 You SHOULD SEE A DOCTOR IMMEDIATELY',
          reason: 'Serious symptoms detected that require attention',
          steps: [
            'Schedule dermatology appointment within 24-48 hours',
            'Do not self-treat',
            'Take photos to track progress',
            'Prepare list of current medications'
          ]
        }
      },
      MEDIUM: {
        vi: {
          action: '🟡 Nên sắp xếp lịch khám trong tuần tới',
          reason: 'Có một số triệu chứng cần theo dõi',
          steps: [
            'Đặt lịch khám trong 1-2 tuần',
            'Theo dõi sự thay đổi hàng ngày',
            'Tránh gãi hoặc chà xát vùng da',
            'Giữ vùng da sạch và khô'
          ]
        },
        en: {
          action: '🟡 Schedule an appointment next week',
          reason: 'Some symptoms need monitoring',
          steps: [
            'Book appointment within 1-2 weeks',
            'Monitor changes daily',
            'Avoid scratching or rubbing',
            'Keep area clean and dry'
          ]
        }
      },
      LOW: {
        vi: {
          action: '🟢 Tình trạng có vẻ nhẹ, tiếp tục theo dõi',
          reason: 'Không phát hiện dấu hiệu nghiêm trọng',
          steps: [
            'Theo dõi trong 1-2 tuần',
            'Dùng kem dưỡng ẩm thường xuyên',
            'Tránh tiếp xúc chất kích ứng',
            'Nếu xấu đi, hãy đi khám'
          ]
        },
        en: {
          action: '🟢 Condition appears mild, continue monitoring',
          reason: 'No serious signs detected',
          steps: [
            'Monitor for 1-2 weeks',
            'Use moisturizer regularly',
            'Avoid irritants',
            'If worsens, see a doctor'
          ]
        }
      }
    };
    return recommendations[level][lang];
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      HIGH: 'bg-red-50 border-red-300 text-red-800',
      MEDIUM: 'bg-yellow-50 border-yellow-300 text-yellow-800',
      LOW: 'bg-green-50 border-green-300 text-green-800'
    };
    return colors[level] || colors.LOW;
  };

  const getRiskIcon = (level: string) => {
    if (level === 'HIGH') return <AlertCircle className="w-8 h-8 text-red-600" />;
    if (level === 'MEDIUM') return <Info className="w-8 h-8 text-yellow-600" />;
    return <CheckCircle className="w-8 h-8 text-green-600" />;
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { vi: 'DermaSafe-AI', en: 'DermaSafe-AI' },
      subtitle: { vi: 'Hệ thống Sàng lọc Nguy cơ Da liễu bằng AI', en: 'AI-Powered Dermatology Risk Screening' },
      uploadTitle: { vi: '1. Tải ảnh vùng da cần kiểm tra', en: '1. Upload Image of Affected Area' },
      selectImage: { vi: 'Chọn ảnh', en: 'Select Image' },
      symptomsTitle: { vi: '2. Chọn triệu chứng bạn đang gặp', en: '2. Select Your Symptoms' },
      durationTitle: { vi: '3. Thời gian xuất hiện triệu chứng', en: '3. Duration of Symptoms' },
      selectDuration: { vi: 'Chọn thời gian', en: 'Select duration' },
      analyzeBtn: { vi: 'Phân tích nguy cơ', en: 'Analyze Risk' },
      analyzing: { vi: 'Đang phân tích...', en: 'Analyzing...' },
      results: { vi: 'Kết quả Sàng lọc', en: 'Screening Results' },
      riskLevel: { vi: 'Mức độ Nguy cơ', en: 'Risk Level' },
      primaryDiag: { vi: 'Chẩn đoán Chính', en: 'Primary Diagnosis' },
      altDiag: { vi: 'Chẩn đoán Thay thế', en: 'Alternative Diagnoses' },
      confidence: { vi: 'Độ tin cậy', en: 'Confidence' },
      recommendations: { vi: 'Khuyến nghị', en: 'Recommendations' }
    };
    return translations[key][language];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl">🛡️</span>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{t('subtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setLanguage(prev => prev === 'vi' ? 'en' : 'vi')}
              className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow"
            >
              {language === 'vi' ? '🇬🇧 EN' : '🇻🇳 VI'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-4 sm:space-y-6">
            {/* Upload Image */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📸</span>
                <span className="text-sm sm:text-base">{t('uploadTitle')}</span>
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-blue-400 transition-colors">
                {previewUrl ? (
                  <div className="space-y-3 sm:space-y-4 animate-fade-in">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        setResult(null);
                      }}
                      className="w-full py-2 sm:py-3 text-sm sm:text-base text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                      {language === 'vi' ? '🗑️ Xóa ảnh' : '🗑️ Remove Image'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 sm:py-6">
                    <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3" />
                    <span className="text-sm sm:text-base text-gray-600 mb-4 text-center px-4">
                      {language === 'vi' ? 'Chọn ảnh từ thư viện hoặc chụp ảnh trực tiếp' : 'Select from gallery or take a photo'}
                    </span>
                    
                    {/* Two buttons: Gallery and Camera */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full px-4">
                      {/* Gallery Button */}
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="w-full px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all hover:shadow-lg text-center">
                          🖼️ {language === 'vi' ? 'Chọn ảnh' : 'Choose Image'}
                        </div>
                      </label>
                      
                      {/* Camera Button - capture attribute forces camera on mobile */}
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          capture
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="w-full px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all hover:shadow-lg text-center">
                          📸 {language === 'vi' ? 'Chụp ảnh' : 'Take Photo'}
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🩺</span>
                <span className="text-sm sm:text-base">{t('symptomsTitle')}</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Render each symptom category */}
                {Object.entries(symptomCategories).map(([categoryId, category]) => (
                  <div key={categoryId} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(categoryId)}
                      className="category-button w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 flex items-center justify-between transition-all"
                    >
                      <span className="font-semibold text-gray-800 text-left text-xs sm:text-sm lg:text-base">
                        {category.title[language as 'vi' | 'en']}
                      </span>
                      <span className="text-gray-600 text-base sm:text-xl font-bold flex-shrink-0">
                        {expandedCategories.includes(categoryId) ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {/* Category Symptoms */}
                    {expandedCategories.includes(categoryId) && (
                      <div className="p-3 sm:p-4 bg-white animate-slide-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {category.symptoms.map((symptom: any) => (
                            <label
                              key={symptom.id}
                              className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                symptoms.includes(symptom.id)
                                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={symptoms.includes(symptom.id)}
                                onChange={() => handleSymptomToggle(symptom.id)}
                                className="flex-shrink-0"
                              />
                              <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1 leading-tight">
                                {symptom[language as 'vi' | 'en']}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Custom Symptom Input */}
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                    💬 {language === 'vi' ? 'Thêm mô tả triệu chứng khác (mô tả tự do):' : 'Add other symptom description (free text):'}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !validating && handleAddCustomSymptom()}
                      placeholder={language === 'vi' ? 'Ví dụ: Da bị ngứa và đỏ, có mụn nước...' : 'E.g: My skin is itchy and red...'}
                      disabled={validating}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleAddCustomSymptom}
                      disabled={validating}
                      className={`px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold text-xs sm:text-sm transition-all shadow-lg whitespace-nowrap ${validating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {validating 
                        ? (language === 'vi' ? '⏳ Đang kiểm tra...' : '⏳ Validating...') 
                        : (language === 'vi' ? '+ Thêm' : '+ Add')
                      }
                    </button>
                  </div>
                  
                  {/* Validation Message */}
                  {validationMessage && (
                    <div className={`mt-2 p-3 rounded-lg text-xs sm:text-sm font-medium animate-fadeIn ${
                      validationMessage.startsWith('✅') 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : validationMessage.startsWith('❌')
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}>
                      {validationMessage}
                    </div>
                  )}
                  
                  {/* Display custom symptoms */}
                  {customSymptoms.length > 0 && (
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                      {customSymptoms.map((symptom, idx) => (
                        <div
                          key={idx}
                          className="symptom-tag flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-white border-2 border-blue-500 rounded-full text-xs sm:text-sm font-semibold shadow-md"
                        >
                          <span className="text-gray-800">{symptom}</span>
                          <button
                            onClick={() => handleRemoveCustomSymptom(symptom)}
                            className="text-red-500 hover:text-red-700 font-bold text-base sm:text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Symptom Counter */}
                <div className="text-center py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    ✓ {language === 'vi' 
                      ? `Đã chọn: ${symptoms.length} triệu chứng${customSymptoms.length > 0 ? ` + ${customSymptoms.length} tùy chỉnh` : ''}`
                      : `Selected: ${symptoms.length} symptoms${customSymptoms.length > 0 ? ` + ${customSymptoms.length} custom` : ''}`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">⏱️</span>
                <span className="text-sm sm:text-base">{t('durationTitle')}</span>
              </h2>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">{t('selectDuration')}</option>
                {durationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt[language as 'vi' | 'en']}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedImage}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 sm:gap-3">
                  <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm sm:text-base">{t('analyzing')}</span>
                </span>
              ) : (
                <span className="text-sm sm:text-base">🔍 {t('analyzeBtn')}</span>
              )}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            {result && result.success ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Risk Level */}
                <div className={`rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border-2 ${getRiskColor(result.risk_level)}`}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {getRiskIcon(result.risk_level)}
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold">{t('riskLevel')}</h3>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-1">
                        {result.risk_level === 'HIGH' && (language === 'vi' ? 'CAO 🔴' : 'HIGH 🔴')}
                        {result.risk_level === 'MEDIUM' && (language === 'vi' ? 'TRUNG BÌNH 🟡' : 'MEDIUM 🟡')}
                        {result.risk_level === 'LOW' && (language === 'vi' ? 'THẤP 🟢' : 'LOW 🟢')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Diagnosis */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">{t('primaryDiag')}</h3>
                  <div className="space-y-2">
                    <p className="text-lg sm:text-xl font-semibold text-blue-600">
                      {result.primary_diagnosis.disease}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{result.primary_diagnosis.description}</p>
                    <p className="text-xs sm:text-sm">
                      <span className="font-medium">{t('confidence')}:</span>{' '}
                      <span className="font-bold text-blue-600">
                        {(result.primary_diagnosis.confidence * 100).toFixed(0)}%
                      </span>
                    </p>
                  </div>
                </div>

                {/* Alternative Diagnoses */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">{t('altDiag')}</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {result.alternative_diagnoses.map((diag: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-sm sm:text-base text-gray-800">{diag.disease}</p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{diag.description}</p>
                        <p className="text-xs mt-1">
                          {t('confidence')}: {(diag.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📋</span>
                    <span className="text-sm sm:text-base">{t('recommendations')}</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className={`p-3 sm:p-4 rounded-lg border-2 ${getRiskColor(result.risk_level)}`}>
                      <p className="font-bold text-sm sm:text-base lg:text-lg mb-2">{result.recommendations.action}</p>
                      <p className="text-xs sm:text-sm leading-relaxed">{result.recommendations.reason}</p>
                    </div>
                    <div className="space-y-2">
                      {result.recommendations.steps.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 border border-gray-200 text-center">
                <span className="text-6xl sm:text-7xl lg:text-8xl mb-4 block">🔍</span>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg px-4">
                  {language === 'vi' 
                    ? 'Tải ảnh và chọn triệu chứng để bắt đầu phân tích'
                    : 'Upload an image and select symptoms to start analysis'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 sm:mt-8 bg-red-50 border-2 border-red-300 rounded-lg sm:rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5 sm:mt-1" />
            <div>
              <p className="font-bold text-sm sm:text-base text-red-900 mb-2">
                {language === 'vi' ? '⚠️ CẢNH BÁO QUAN TRỌNG' : '⚠️ IMPORTANT WARNING'}
              </p>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                {language === 'vi' 
                  ? 'DermaSafe-AI KHÔNG PHẢI LÀ BÁC SĨ và không phải là công cụ chẩn đoán y khoa. Đây chỉ là công cụ SÀNG LỌC RỦI RO giúp bạn quyết định có nên đi khám bác sĩ hay không. Kết quả của AI không bao giờ thay thế ý kiến, chẩn đoán, hoặc điều trị của bác sĩ chuyên khoa da liễu.'
                  : 'DermaSafe-AI IS NOT A DOCTOR and is not a medical diagnostic tool. This is only a RISK SCREENING tool to help you decide whether to see a doctor. AI results never replace the opinion, diagnosis, or treatment of a dermatology specialist.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Camera,
  Search,
  X,
  ChevronDown,
  AlertCircle,
  Info,
  CheckCircle,
  FileText,
  Shield,
  Clock,
  Activity,
  MessageCircle
} from 'lucide-react';
import CameraCapture from './CameraCapture';
import ChatBot from './ChatBot';

// Types
type LangKey = 'vi' | 'en';

type Symptom = { id: string; vi: string; en: string };

type SymptomCategory = {
  id: string;
  title: { vi: string; en: string };
  symptoms: Symptom[];
};

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export default function DermaSafeModern() {
  const [language, setLanguage] = useState<LangKey>('vi');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ main: true });

  // Categories (more than 9 symptoms)
  const categories: SymptomCategory[] = [
    {
      id: 'main',
      title: { vi: 'Triệu chứng chính', en: 'Main Symptoms' },
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
    {
      id: 'appearance',
      title: { vi: 'Biểu hiện ngoài da', en: 'Skin Appearance' },
      symptoms: [
        { id: 'red_rash', vi: 'Nổi mẩn đỏ', en: 'Red rash' },
        { id: 'blisters', vi: 'Nổi mụn nước', en: 'Blisters' },
        { id: 'pustules', vi: 'Nổi mụn mủ', en: 'Pustules' },
        { id: 'nodules', vi: 'Nổi sần cứng', en: 'Hard nodules' },
        { id: 'ulcers', vi: 'Vết loét', en: 'Ulcers' },
        { id: 'cracks', vi: 'Vết nứt nẻ', en: 'Cracks' },
        { id: 'dry_flaky', vi: 'Da khô, bong tróc', en: 'Dry, flaky skin' },
        { id: 'discoloration', vi: 'Da đổi màu', en: 'Discoloration' },
        { id: 'thickened', vi: 'Da dày sừng', en: 'Thickened skin' },
        { id: 'large_scales', vi: 'Mảng tróc lớn', en: 'Large scales' }
      ]
    },
    {
      id: 'sensation',
      title: { vi: 'Cảm giác kèm theo', en: 'Associated Sensations' },
      symptoms: [
        { id: 'severe_itch', vi: 'Ngứa rát dữ dội', en: 'Severe itching' },
        { id: 'tingling', vi: 'Châm chích hoặc tê', en: 'Tingling or numbness' },
        { id: 'burning', vi: 'Bỏng rát', en: 'Burning sensation' },
        { id: 'tender_touch', vi: 'Đau khi chạm', en: 'Pain when touched' }
      ]
    },
    {
      id: 'spread',
      title: { vi: 'Tình trạng lan rộng', en: 'Spread Pattern' },
      symptoms: [
        { id: 'localized', vi: 'Chỉ ở 1 vùng nhỏ', en: 'Localized to one area' },
        { id: 'spreading', vi: 'Lan sang vùng khác', en: 'Spreading to other areas' },
        { id: 'multiple_spots', vi: 'Nhiều ổ rải rác', en: 'Multiple scattered spots' },
        { id: 'rapid_spread', vi: 'Lan nhanh', en: 'Rapid spread' }
      ]
    },
    {
      id: 'secretion',
      title: { vi: 'Dịch tiết và mùi', en: 'Discharge & Odor' },
      symptoms: [
        { id: 'clear_fluid', vi: 'Có dịch trong', en: 'Clear discharge' },
        { id: 'yellow_fluid', vi: 'Dịch vàng đục', en: 'Yellow cloudy discharge' },
        { id: 'pus', vi: 'Có mủ', en: 'Pus' },
        { id: 'bad_odor', vi: 'Có mùi hôi', en: 'Bad odor' }
      ]
    },
    {
      id: 'systemic',
      title: { vi: 'Triệu chứng toàn thân', en: 'Systemic Symptoms' },
      symptoms: [
        { id: 'fever', vi: 'Sốt', en: 'Fever' },
        { id: 'fatigue', vi: 'Mệt mỏi', en: 'Fatigue' },
        { id: 'lymph_nodes', vi: 'Hạch sưng', en: 'Swollen lymph nodes' },
        { id: 'joint_pain', vi: 'Đau khớp', en: 'Joint pain' }
      ]
    }
  ];

  const durationOptions = [
    { value: 'less_week', vi: 'Dưới 1 tuần', en: 'Less than 1 week' },
    { value: 'week_month', vi: '1 tuần - 1 tháng', en: '1 week - 1 month' },
    { value: 'month_6month', vi: '1-6 tháng', en: '1-6 months' },
    { value: 'more_6month', vi: 'Hơn 6 tháng', en: 'More than 6 months' }
  ];

  // Derived list for search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const key = language as 'vi' | 'en';
    return categories
      .map(cat => ({
        ...cat,
        symptoms: cat.symptoms.filter(s => s[key].toLowerCase().includes(search.toLowerCase()))
      }))
      .filter(cat => cat.symptoms.length > 0);
  }, [search, categories, language]);

  // i18n
  const t = (key: string) => {
    const dict: Record<string, Record<LangKey, string>> = {
      title: { vi: 'DermaSafe-AI', en: 'DermaSafe-AI' },
      subtitle: { vi: 'Sàng lọc nguy cơ da liễu bằng AI', en: 'AI-Powered Dermatology Screening' },
      selectImage: { vi: 'Chọn ảnh', en: 'Select Image' },
      captureImage: { vi: 'Chụp ảnh', en: 'Take Photo' },
      dragDrop: { vi: 'Kéo thả ảnh hoặc nhấn để chọn', en: 'Drag & drop or click to select' },
      uploaded: { vi: 'Đã tải', en: 'Uploaded' },
      stepUpload: { vi: 'Tải ảnh', en: 'Upload Image' },
      stepSymptoms: { vi: 'Triệu chứng', en: 'Symptoms' },
      stepDuration: { vi: 'Thời gian', en: 'Duration' },
      stepAnalyze: { vi: 'Phân tích', en: 'Analyze' },
      searchPlaceholder: { vi: 'Tìm triệu chứng…', en: 'Search symptoms…' },
      selected: { vi: 'đã chọn', en: 'selected' },
      clearAll: { vi: 'Xóa tất cả', en: 'Clear all' },
      selectDuration: { vi: 'Chọn thời gian', en: 'Select duration' },
      analyzeBtn: { vi: 'Phân tích nguy cơ', en: 'Analyze risk' },
      analyzing: { vi: 'Đang phân tích…', en: 'Analyzing…' },
      results: { vi: 'Kết quả sàng lọc', en: 'Screening Results' },
      riskLevel: { vi: 'Mức độ nguy cơ', en: 'Risk Level' },
      primaryDiag: { vi: 'Chẩn đoán chính', en: 'Primary Diagnosis' },
      altDiag: { vi: 'Chẩn đoán thay thế', en: 'Alternative Diagnoses' },
      confidence: { vi: 'Độ tin cậy', en: 'Confidence' },
      recommendations: { vi: 'Khuyến nghị', en: 'Recommendations' }
    };
    return dict[key][language];
  };

  // Handlers
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleCameraCapture = (file: File, preview: string) => {
    setSelectedImage(file);
    setPreviewUrl(preview);
    setResult(null);
    setCameraOpen(false);
  };

  const toggleSymptom = (id: string) => {
    setSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const removeSymptom = (id: string) => setSymptoms(prev => prev.filter(s => s !== id));
  const addCustomSymptom = () => {
    const v = customSymptomInput.trim();
    if (!v) return;
    
    // Validate: length between 2-100 chars, no special characters except spaces, hyphens, commas
    if (v.length < 2 || v.length > 100) {
      alert(language === 'vi' ? '⚠️ Triệu chứng phải có độ dài từ 2-100 ký tự' : '⚠️ Symptom must be 2-100 characters');
      return;
    }
    if (!/^[a-zA-ZÀ-ỹ0-9\s,\-]+$/.test(v)) {
      alert(language === 'vi' ? '⚠️ Triệu chứng chỉ được chứa chữ, số, dấu cách và dấu gạch ngang' : '⚠️ Symptom can only contain letters, numbers, spaces and hyphens');
      return;
    }
    
    if (!customSymptoms.includes(v)) setCustomSymptoms(prev => [...prev, v]);
    setCustomSymptomInput('');
  };
  const removeCustomSymptom = (name: string) => setCustomSymptoms(prev => prev.filter(s => s !== name));

  const viMap: Record<string, string> = {
    itching: 'ngứa', pain: 'đau', bleeding: 'chảy máu', swelling: 'sưng', redness: 'đỏ', scaling: 'bong vảy', crusting: 'đóng vảy', warmth: 'nóng rát', discharge: 'tiết dịch',
    red_rash: 'mẩn đỏ', blisters: 'mụn nước', pustules: 'mụn mủ', nodules: 'sần', ulcers: 'loét', cracks: 'nứt', dry_flaky: 'da khô', discoloration: 'đổi màu', thickened: 'da dày', large_scales: 'tróc vảy',
    severe_itch: 'ngứa rát', tingling: 'tê', burning: 'bỏng rát', tender_touch: 'đau chạm',
    localized: 'tại chỗ', spreading: 'lan rộng', multiple_spots: 'nhiều ổ', rapid_spread: 'lan nhanh',
    clear_fluid: 'dịch trong', yellow_fluid: 'dịch vàng', pus: 'mủ', bad_odor: 'mùi hôi',
    fever: 'sốt', fatigue: 'mệt', lymph_nodes: 'hạch sưng', joint_pain: 'đau khớp'
  };

  const durationMap: Record<string, string> = {
    less_week: '< 1 tuần',
    week_month: '1-2 tuần',
    month_6month: '> 2 tuần',
    more_6month: '> 2 tuần'
  };

  const getRiskRecommendations = (level: RiskLevel, lang: LangKey) => {
    const rec: any = {
      HIGH: {
        vi: { action: '🚨 Bạn NÊN ĐI KHÁM BÁC SĨ NGAY', reason: 'Phát hiện triệu chứng nghiêm trọng cần chú ý', steps: ['Đặt lịch khám da liễu trong 24-48 giờ','Không tự điều trị','Chụp ảnh theo dõi diễn biến','Chuẩn bị danh sách thuốc đang dùng'] },
        en: { action: '🚨 You SHOULD SEE A DOCTOR IMMEDIATELY', reason: 'Serious symptoms detected that require attention', steps: ['Schedule dermatology appointment within 24-48 hours','Do not self-treat','Take photos to track progress','Prepare list of current medications'] }
      },
      MEDIUM: {
        vi: { action: '🟡 Nên sắp xếp lịch khám trong tuần tới', reason: 'Có một số triệu chứng cần theo dõi', steps: ['Đặt lịch khám trong 1-2 tuần','Theo dõi sự thay đổi hàng ngày','Tránh gãi hoặc chà xát vùng da','Giữ vùng da sạch và khô'] },
        en: { action: '🟡 Schedule an appointment next week', reason: 'Some symptoms need monitoring', steps: ['Book appointment within 1-2 weeks','Monitor changes daily','Avoid scratching or rubbing','Keep area clean and dry'] }
      },
      LOW: {
        vi: { action: '🟢 Tình trạng có vẻ nhẹ, tiếp tục theo dõi', reason: 'Không phát hiện dấu hiệu nghiêm trọng', steps: ['Theo dõi trong 1-2 tuần','Dùng kem dưỡng ẩm thường xuyên','Tránh tiếp xúc chất kích ứng','Nếu xấu đi, hãy đi khám'] },
        en: { action: '🟢 Condition appears mild, continue monitoring', reason: 'No serious signs detected', steps: ['Monitor for 1-2 weeks','Use moisturizer regularly','Avoid irritants','If worsens, see a doctor'] }
      }
    };
    return rec[level][lang];
  };

  const getRiskColor = (level: RiskLevel) => ({
    HIGH: 'bg-red-50 border-red-200 text-red-800',
    MEDIUM: 'bg-amber-50 border-amber-200 text-amber-800',
    LOW: 'bg-emerald-50 border-emerald-200 text-emerald-800'
  }[level]);

  const getRiskIcon = (level: RiskLevel) => {
    if (level === 'HIGH') return <AlertCircle className="w-6 h-6 text-red-600"/>;
    if (level === 'MEDIUM') return <Info className="w-6 h-6 text-amber-600"/>;
    return <CheckCircle className="w-6 h-6 text-emerald-600"/>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return alert(language === 'vi' ? 'Vui lòng chọn ảnh!' : 'Please select an image!');

    setLoading(true);
    setResult(null);

  const viSymptoms = symptoms.map(s => viMap[s] || s);
  const allSymptoms = [...viSymptoms, ...customSymptoms];
    const durationLabel = durationMap[duration] || undefined;

    const formData = new FormData();
    formData.append('image', selectedImage);
  formData.append('symptoms_json', JSON.stringify({ symptoms_selected: allSymptoms, duration: durationLabel }));
    formData.append('enhance', 'true');

    try {
      const response = await fetch('/api/v1/analyze', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const riskText: string = (data.risk || '').toUpperCase();
      const riskLevel: RiskLevel = riskText.includes('CAO') || riskText.includes('HIGH') ? 'HIGH' : riskText.includes('TRUNG') || riskText.includes('MEDIUM') ? 'MEDIUM' : 'LOW';

      let primaryDiagnosis: { disease: string; confidence: number; description?: string } = { disease: 'N/A', confidence: 0 };
      if (data.primary_disease) {
        primaryDiagnosis = {
          disease: data.primary_disease.vietnamese_name || data.primary_disease.name,
          confidence: typeof data.primary_disease.confidence === 'number' ? data.primary_disease.confidence : 0,
          description: data.primary_disease.description
        };
      } else if (data.cv_scores && typeof data.cv_scores === 'object') {
        const entries = Object.entries<number>(data.cv_scores as Record<string, number>);
        if (entries.length > 0) {
          const [topDisease, topScore] = entries.sort((a,b) => b[1]-a[1])[0];
          primaryDiagnosis = { disease: topDisease, confidence: topScore };
        }
      }

      const alternativeDiagnoses = Array.isArray(data.alternative_diseases)
        ? data.alternative_diseases.map((d: any) => ({
            disease: d.vietnamese_name || d.name,
            confidence: d.confidence,
            description: d.description
          }))
        : [];

      setResult({
        success: true,
        risk_level: riskLevel,
        primary_diagnosis: primaryDiagnosis,
        alternative_diagnoses: alternativeDiagnoses,
        recommendations: getRiskRecommendations(riskLevel, language),
        detected_symptoms: viSymptoms
      });
    } catch (err: any) {
      alert((language === 'vi' ? 'Lỗi khi phân tích: ' : 'Analysis error: ') + err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedChips = (
    <div className="flex flex-wrap gap-2 justify-center">
      {symptoms.map(id => {
        const s = categories.flatMap(c => c.symptoms).find(x => x.id === id);
        if (!s) return null;
        return (
          <span key={id} className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
            {s[language]}
            <button type="button" onClick={() => removeSymptom(id)} className="hover:text-blue-900">
              <X className="w-3.5 h-3.5"/>
            </button>
          </span>
        );
      })}
      {customSymptoms.map(name => (
        <span key={`c-${name}`} className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">
          {name}
          <button type="button" onClick={() => removeCustomSymptom(name)} className="hover:text-purple-900">
            <X className="w-3.5 h-3.5"/>
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - centered */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-center relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7"/>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('title')}</h1>
              <p className="text-sm text-gray-600">{t('subtitle')}</p>
            </div>
          </div>
          <button onClick={() => setLanguage(prev => prev === 'vi' ? 'en' : 'vi')} className="absolute right-6 px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 shadow-sm">
            {language === 'vi' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">{/* Left Column: Upload + Symptoms */}
          <div className="space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded border border-gray-200 shadow-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon className="w-6 h-6 text-blue-600"/>
                <h2 className="text-lg font-semibold text-gray-800">{t('stepUpload')}</h2>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded p-6 hover:border-blue-400 transition-colors bg-gradient-to-br from-indigo-50 to-blue-50 mb-4">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded shadow-md mb-3"/>
                    <button
                      type="button"
                      onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                      className="w-full py-3 text-red-600 border-2 border-red-300 hover:bg-red-50 rounded text-sm font-semibold transition-all">
                      {language === 'vi' ? '❌ Xóa ảnh' : '❌ Remove Image'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={onDrop}
                      className="flex flex-col items-center justify-center cursor-pointer py-8"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mb-3"/>
                      <p className="text-sm text-gray-600 text-center mb-4">{t('dragDrop')}</p>
                      <input type="file" accept="image/*" onChange={onFileChange} className="hidden"/>
                      <button type="button" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold shadow-lg">
                        📁 {t('selectImage')}
                      </button>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                      <div className="relative flex justify-center text-sm"><span className="px-3 bg-gradient-to-br from-indigo-50 to-blue-50 text-gray-600 font-medium">{language === 'vi' ? 'hoặc' : 'or'}</span></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCameraOpen(true)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded hover:from-purple-700 hover:to-indigo-700 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Camera className="w-5 h-5"/> 📸 {t('captureImage')}
                    </button>
                  </div>
                )}
              </div>

              {/* Duration inline below upload */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-blue-600"/>
                  <h3 className="text-base font-semibold text-gray-800">{t('stepDuration')}</h3>
                </div>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white text-gray-800 text-sm font-medium"
                >
                  <option value="" disabled>{t('selectDuration')}</option>
                  {durationOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt[language]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Symptoms Card */}
            <div className="bg-white rounded border border-gray-200 shadow-lg p-6 mt-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600"/>
                  <h2 className="text-lg font-semibold text-gray-800">{t('stepSymptoms')}</h2>
                </div>
                {(symptoms.length > 0 || customSymptoms.length > 0) && (
                  <button onClick={() => { setSymptoms([]); setCustomSymptoms([]); }} className="px-4 py-2 text-xs text-red-600 border-2 border-red-300 rounded hover:bg-red-50 font-semibold">
                    🗑️ {t('clearAll')}
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"/>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Custom symptom input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={customSymptomInput}
                  onChange={(e) => setCustomSymptomInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                  placeholder={language === 'vi' ? '✏️ Nhập triệu chứng khác...' : '✏️ Enter other symptom...'}
                  className="flex-1 px-4 py-3 border-2 border-purple-300 rounded text-sm focus:outline-none focus:border-purple-500 font-medium"
                />
                <button
                  type="button"
                  onClick={addCustomSymptom}
                  className="px-5 py-3 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 font-semibold shadow transition-colors"
                >
                  ➕ {language === 'vi' ? 'Thêm' : 'Add'}
                </button>
              </div>

              {/* Selected chips */}
              {(symptoms.length > 0 || customSymptoms.length > 0) && (
                <div className="mb-5 p-4 bg-blue-50 rounded border border-blue-200">
                  <div className="text-xs font-semibold text-blue-900 mb-2 text-center">
                    {language === 'vi' ? '✅ Đã chọn' : '✅ Selected'} ({symptoms.length + customSymptoms.length})
                  </div>
                  {selectedChips}
                </div>
              )}

              {/* Categories */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredCategories.map(cat => {
                  const isOpen = expanded[cat.id] ?? false;
                  const selectedCount = cat.symptoms.filter(s => symptoms.includes(s.id)).length;
                  return (
                    <div key={cat.id} className="border-2 border-gray-200 rounded bg-white overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => setExpanded(prev => ({ ...prev, [cat.id]: !isOpen }))}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all"
                      >
                        <div className="text-sm font-bold text-gray-900">
                          {cat.title[language]}
                          <span className="ml-2 text-xs text-blue-600 font-semibold bg-white px-2 py-1 rounded-full">
                            {selectedCount}/{cat.symptoms.length}
                          </span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
                      </button>
                      {isOpen && (
                        <div className="p-4 grid grid-cols-1 gap-2 bg-gray-50">
                          {cat.symptoms.map(s => (
                            <label key={s.id} className={`flex items-center gap-3 p-3 border-2 rounded text-sm cursor-pointer transition-all ${symptoms.includes(s.id) ? 'bg-blue-100 border-blue-400 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                              <input
                                type="checkbox"
                                checked={symptoms.includes(s.id)}
                                onChange={() => toggleSymptom(s.id)}
                                className="w-5 h-5 text-blue-600 rounded"
                              />
                              <span className={symptoms.includes(s.id) ? 'text-blue-900 font-semibold' : 'text-gray-700 font-medium'}>{s[language]}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Analyze button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedImage}
                className="mt-6 w-full py-4 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transition-all"
              >
                {loading ? '⏳ ' + t('analyzing') : '🔍 ' + t('analyzeBtn')}
              </button>
            </div>
          </div>

          {/* Right Column: ChatBot + Results */}
          <div className="space-y-6">
            {/* Chat inline panel - always visible */}
            <div className="bg-white rounded border border-gray-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600"/>
                <h3 className="text-lg font-bold text-gray-900">{language === 'vi' ? '💬 Trợ lý AI' : '💬 AI Assistant'}</h3>
              </div>
              <div className="p-0">
                <ChatBot
                  mode="inline"
                  analysisContext={{
                    primary_diagnosis: result?.primary_diagnosis?.disease,
                    confidence: result?.primary_diagnosis?.confidence,
                    risk_level: result?.risk_level,
                    symptoms: [
                      ...symptoms.map(s => (viMap[s] || s)),
                      ...customSymptoms
                    ]
                  }}
                  language={language}
                  className="h-[460px]"
                />
              </div>
            </div>

            {!result ? (
              <div className="bg-white rounded border border-gray-200 shadow-lg p-10 text-center">
                <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4"/>
                <p className="text-gray-600 text-base font-medium">
                  {language === 'vi' ? '📋 Tải ảnh, chọn triệu chứng để bắt đầu phân tích' : '📋 Upload image and select symptoms to start'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Risk */}
                <div className={`rounded border-2 ${getRiskColor(result.risk_level)} p-6 shadow-lg`}>
                  <div className="flex items-start gap-4 justify-center text-center">
                    {getRiskIcon(result.risk_level)}
                    <div className="flex-1">
                      <div className="text-sm font-semibold mb-1">{t('riskLevel')}</div>
                      <div className="text-2xl font-bold">
                        {result.risk_level === 'HIGH' && (language === 'vi' ? '🔴 CAO' : '🔴 HIGH')}
                        {result.risk_level === 'MEDIUM' && (language === 'vi' ? '🟡 TRUNG BÌNH' : '🟡 MEDIUM')}
                        {result.risk_level === 'LOW' && (language === 'vi' ? '🟢 THẤP' : '🟢 LOW')}
                      </div>
                      {result.detected_symptoms?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          {result.detected_symptoms.slice(0,5).map((s: string, i: number) => (
                            <span key={i} className="text-xs px-3 py-1 bg-white/80 rounded-full border-2 font-semibold">{s}</span>
                          ))}
                          {result.detected_symptoms.length > 5 && (
                            <span className="text-xs px-3 py-1 bg-white/80 rounded-full border-2 font-semibold">+{result.detected_symptoms.length-5}</span>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Diagnosis */}
              <div className="bg-white rounded border border-gray-200 shadow-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600"/>
                  <h3 className="text-base font-semibold text-gray-800">{t('primaryDiag')}</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-blue-700">{result.primary_diagnosis?.disease}</div>
                  {result.primary_diagnosis?.description && (
                    <p className="text-sm text-gray-600">{result.primary_diagnosis.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">{t('confidence')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${(result.primary_diagnosis?.confidence || 0)*100}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-blue-700">{Math.round((result.primary_diagnosis?.confidence||0)*100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternatives */}
              {result.alternative_diagnoses?.length > 0 && (
                <div className="bg-white rounded border border-gray-200 shadow-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-gray-700"/>
                    <h3 className="text-base font-semibold text-gray-800">{t('altDiag')}</h3>
                  </div>
                  <div className="space-y-3">
                    {result.alternative_diagnoses.map((diag: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-gray-800">{diag.disease}</div>
                            {diag.description && (
                              <div className="text-xs text-gray-600 mt-1">{diag.description}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gray-700" style={{ width: `${Math.round((diag.confidence||0)*100)}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{Math.round((diag.confidence||0)*100)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      <CameraCapture isOpen={cameraOpen} onCapture={handleCameraCapture} onClose={() => setCameraOpen(false)} />

      {/* Disclaimer */}
      <footer className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-300 rounded p-6 shadow-lg">
          <div className="flex items-start gap-4 justify-center text-center">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0"/>
            <div className="flex-1">
              <div className="text-lg font-bold text-red-900 mb-2">{language === 'vi' ? '⚠️ CẢNH BÁO QUAN TRỌNG' : '⚠️ IMPORTANT WARNING'}</div>
              <p className="text-sm text-red-800 font-medium">
                {language === 'vi'
                  ? 'DermaSafe-AI KHÔNG phải là công cụ chẩn đoán y khoa. Đây chỉ là công cụ sàng lọc rủi ro để hỗ trợ quyết định đi khám. Kết quả của AI không thay thế bác sĩ da liễu.'
                  : 'DermaSafe-AI is not a medical diagnostic tool. It is a risk screening tool to help decide whether to see a doctor. AI results do not replace a dermatologist.'}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

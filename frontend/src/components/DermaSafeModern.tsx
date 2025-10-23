import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Upload,
  AlertCircle,
  Info,
  CheckCircle,
  Shield,
  BarChart3,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import CameraCapture from './CameraCapture';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FloatCallButton from './FloatCallButton';
import BugReportButton from './BugReportButton';
import ProjectInfoButton from './ProjectInfoButton';
import ProjectInfoTab from './tabs/ProjectInfoTab';
import UploadSymptomsTab from './tabs/UploadSymptomsTab';
import ResultsTab from './tabs/ResultsTab';
import ChatBotTab from './tabs/ChatBotTab';

// Types
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
  const [customValidating, setCustomValidating] = useState(false);
  const [customValidationMsg, setCustomValidationMsg] = useState<string | null>(null);
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ main: true });
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('project');

  // Load consent from localStorage
  useEffect(() => {
    try {
      const v = localStorage.getItem('dermasafe_consent_v1');
      if (v === '1') setConsentAccepted(true);
    } catch {}
  }, []);

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
    { value: '1_4_weeks', vi: '1-4 tuần', en: '1-4 weeks' },
    { value: '1_3_months', vi: '1-3 tháng', en: '1-3 months' },
    { value: 'over_3_months', vi: 'Trên 3 tháng', en: 'Over 3 months' },
    { value: 'since_birth', vi: 'Từ khi sinh ra', en: 'Since birth' }
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
      consentLabel: {
        vi: 'Tôi hiểu và đồng ý: Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán hay điều trị y khoa chính thức.',
        en: 'I understand and agree: Results are informational only and do not replace professional medical diagnosis or treatment.'
      },
      consentRequired: {
        vi: 'Bạn cần xác nhận đồng ý tuyên bố miễn trừ trách nhiệm trước khi phân tích.',
        en: 'You must accept the disclaimer before analyzing.'
      },
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
  const addCustomSymptom = async () => {
    const v = customSymptomInput.trim();
    if (!v) return;
    setCustomValidationMsg(null);
    
    // Validate: length between 2-100 chars, no special characters except spaces, hyphens, commas
    if (v.length < 2 || v.length > 100) {
      alert(language === 'vi' ? '⚠️ Triệu chứng phải có độ dài từ 2-100 ký tự' : '⚠️ Symptom must be 2-100 characters');
      return;
    }
    if (!/^[a-zA-ZÀ-ỹ0-9\s,\-]+$/.test(v)) {
      alert(language === 'vi' ? '⚠️ Triệu chứng chỉ được chứa chữ, số, dấu cách và dấu gạch ngang' : '⚠️ Symptom can only contain letters, numbers, spaces and hyphens');
      return;
    }
    // Remote validation via backend (Gemini) to ensure it's a real dermatology symptom
    setCustomValidating(true);
    try {
      const res = await fetch('/api/v1/validate-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: v, language })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data && data.valid === false) {
        // Block adding and show message
        const msg = data.response || (language === 'vi' ? '❌ Mô tả này không phải là triệu chứng da liễu hợp lệ.' : '❌ This does not look like a valid dermatology symptom.');
        setCustomValidationMsg(msg);
        setCustomValidating(false);
        return;
      }
      // If API suggests normalized symptoms, prefer them
      let toAdd: string[] = [];
      if (Array.isArray(data?.symptoms) && data.symptoms.length > 0) {
        // Deduplicate and trim
        toAdd = Array.from(new Set<string>(data.symptoms.map((s: string) => (s || '').toString().trim()).filter(Boolean)));
      } else {
        toAdd = [v];
      }
      // Apply additions if not already present
      setCustomSymptoms(prev => {
        const merged = new Set(prev);
        toAdd.forEach(s => merged.add(s));
        return Array.from(merged);
      });
      setCustomSymptomInput('');
      setCustomValidationMsg(language === 'vi' ? '✅ Đã thêm triệu chứng hợp lệ' : '✅ Valid symptom added');
    } catch (err: any) {
      // In case of API failure, be conservative: do not add, but inform user
      setCustomValidationMsg((language === 'vi' ? '⚠️ Không thể kiểm tra: ' : '⚠️ Could not validate: ') + (err?.message || 'Unknown error'));
    } finally {
      setCustomValidating(false);
    }
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
    less_week: 'dưới 1 tuần',
    '1_4_weeks': '1-4 tuần',
    '1_3_months': '1-3 tháng',
    over_3_months: 'trên 3 tháng',
    since_birth: 'từ khi sinh ra'
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
    if (!consentAccepted) {
      alert(t('consentRequired'));
      return;
    }

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

      // Handle detection_status overrides (normal/undetectable)
      if (data?.detection_status === 'undetectable') {
        const primaryDiagnosis = {
          disease: language === 'vi' ? 'Không nhận diện được' : 'Undetectable',
          confidence: 0,
          description: data?.detection_message || (language === 'vi' ? 'Không nhận diện được vùng da rõ ràng. Vui lòng chụp lại ảnh.' : 'Could not detect a clear skin region. Please retake the photo.')
        };
        const riskLevel: RiskLevel = 'LOW';
        setResult({
          success: true,
          risk_level: riskLevel,
          primary_diagnosis: primaryDiagnosis,
          alternative_diagnoses: [],
          recommendations: getRiskRecommendations(riskLevel, language),
          detected_symptoms: viSymptoms,
          detection_status: data.detection_status,
          detection_message: data.detection_message
        });
        return;
      }

      if (data?.detection_status === 'normal') {
        const primaryDiagnosis = {
          disease: language === 'vi' ? 'Da bình thường' : 'Normal skin',
          confidence: 1,
          description: data?.detection_message || (language === 'vi' ? 'Không phát hiện tổn thương rõ ràng trên ảnh.' : 'No obvious skin lesion detected in the image.')
        };
        const riskLevel: RiskLevel = 'LOW';
        setResult({
          success: true,
          risk_level: riskLevel,
          primary_diagnosis: primaryDiagnosis,
          alternative_diagnoses: [],
          recommendations: getRiskRecommendations(riskLevel, language),
          detected_symptoms: viSymptoms,
          detection_status: data.detection_status,
          detection_message: data.detection_message
        });
        return;
      }

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
        detected_symptoms: viSymptoms,
        detection_status: data?.detection_status,
        detection_message: data?.detection_message
      });
    } catch (err: any) {
      alert((language === 'vi' ? 'Lỗi khi phân tích: ' : 'Analysis error: ') + err.message);
    } finally {
      setLoading(false);
    }
  };

  const analysisContext = result ? {
    risk: result.risk_level || 'UNKNOWN',
    reason: result.primary_diagnosis?.description || 'Đang phân tích...',
    primary_disease: result.primary_diagnosis ? {
      disease: result.primary_diagnosis.disease,
      confidence: result.primary_diagnosis.confidence
    } : undefined,
    alternative_diseases: result.alternative_diagnoses,
    recommendations: result.recommendations?.steps || [],
    description: result.primary_diagnosis?.description,
    risk_level: result.risk_level
  } : null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg flex-shrink-0">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7"/>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 truncate">{t('title')}</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{t('subtitle')}</p>
              </div>
            </div>
            
            <button onClick={() => setLanguage(prev => prev === 'vi' ? 'en' : 'vi')} className="px-3 py-2 sm:px-4 text-xs sm:text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md whitespace-nowrap flex-shrink-0">
              <span className="hidden sm:inline">{language === 'vi' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}</span>
              <span className="sm:hidden">{language === 'vi' ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 gap-1 sm:gap-0 mb-6">
            <TabsTrigger value="project" className="flex items-center gap-2 text-xs sm:text-sm py-3 sm:py-2">
              <BookOpen className="w-4 h-4"/>
              <span className="hidden sm:inline">{language === 'vi' ? 'Thông tin' : 'Info'}</span>
              <span className="sm:hidden">{language === 'vi' ? 'TT' : 'Info'}</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2 text-xs sm:text-sm py-3 sm:py-2">
              <Upload className="w-4 h-4"/>
              <span className="hidden sm:inline">{language === 'vi' ? 'Tải ảnh' : 'Upload'}</span>
              <span className="sm:hidden">{language === 'vi' ? 'Tải' : 'Up'}</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 text-xs sm:text-sm py-3 sm:py-2" disabled={!result}>
              <BarChart3 className="w-4 h-4"/>
              <span>{language === 'vi' ? 'Kết quả' : 'Results'}</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center gap-2 text-xs sm:text-sm py-3 sm:py-2">
              <MessageCircle className="w-4 h-4"/>
              <span>{language === 'vi' ? 'Chat' : 'Chat'}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project"><ProjectInfoTab language={language} /></TabsContent>
          
          <TabsContent value="upload">
            <UploadSymptomsTab
              language={language}
              previewUrl={previewUrl}
              onFileChange={onFileChange}
              onDrop={onDrop}
              onCameraClick={() => setCameraOpen(true)}
              onRemoveImage={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
              duration={duration}
              onDurationChange={setDuration}
              symptoms={symptoms}
              customSymptoms={customSymptoms}
              onToggleSymptom={toggleSymptom}
              onRemoveSymptom={(id) => setSymptoms(prev => prev.filter(s => s !== id))}
              customSymptomInput={customSymptomInput}
              onCustomSymptomInputChange={setCustomSymptomInput}
              customValidating={customValidating}
              customValidationMsg={customValidationMsg}
              onAddCustomSymptom={addCustomSymptom}
              onRemoveCustomSymptom={(name) => setCustomSymptoms(prev => prev.filter(s => s !== name))}
              search={search}
              onSearchChange={setSearch}
              expanded={expanded}
              onToggleExpand={(id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))}
              categories={categories}
              filteredCategories={filteredCategories}
              consentAccepted={consentAccepted}
              onConsentChange={(v) => { setConsentAccepted(v); try { localStorage.setItem('dermasafe_consent_v1', v ? '1' : '0'); } catch {} }}
              onSubmit={handleSubmit}
              loading={loading}
              selectedImage={selectedImage}
              t={t}
              durationOptions={durationOptions}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ResultsTab language={language} result={result} t={t} getRiskColor={getRiskColor} getRiskIcon={getRiskIcon} />
          </TabsContent>
          
          <TabsContent value="chatbot">
            <ChatBotTab language={language} analysisContext={analysisContext} />
          </TabsContent>
        </Tabs>
      </main>

      <CameraCapture isOpen={cameraOpen} onCapture={handleCameraCapture} onClose={() => setCameraOpen(false)} />

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-300 rounded p-4 sm:p-6 shadow-lg">
          <div className="flex items-start gap-3 sm:gap-4 justify-center text-center">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0"/>
            <div className="flex-1">
              <div className="text-base sm:text-lg font-bold text-red-900 mb-2">{language === 'vi' ? '⚠️ CẢNH BÁO QUAN TRỌNG' : '⚠️ IMPORTANT WARNING'}</div>
              <p className="text-xs sm:text-sm text-red-800 font-medium">
                {language === 'vi' ? 'DermaSafe-AI KHÔNG phải là công cụ chẩn đoán y khoa. Đây chỉ là công cụ sàng lọc rủi ro để hỗ trợ quyết định đi khám. Kết quả của AI không thay thế bác sĩ da liễu.' : 'DermaSafe-AI is not a medical diagnostic tool. It is a risk screening tool to help decide whether to see a doctor. AI results do not replace a dermatologist.'}
              </p>
            </div>
          </div>
        </div>
      </footer>

      <FloatCallButton language={language} />
      <BugReportButton language={language} />
      <ProjectInfoButton language={language} />
    </div>
  );
}

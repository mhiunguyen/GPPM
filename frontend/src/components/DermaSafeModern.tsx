import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import FloatCallButton from './FloatCallButton';
import BugReportButton from './BugReportButton';
import ProjectInfoButton from './ProjectInfoButton';

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

  const selectedChips = (
    <div className="flex flex-wrap gap-2 justify-center">
      {symptoms.map(id => {
        const s = categories.flatMap(c => c.symptoms).find(x => x.id === id);
        if (!s) return null;
        return (
          <Badge key={id} className="gap-2">
            {s[language]}
            <button type="button" onClick={() => removeSymptom(id)} className="hover:opacity-80">
              <X className="w-3.5 h-3.5"/>
            </button>
          </Badge>
        );
      })}
      {customSymptoms.map(name => (
        <Badge key={`c-${name}`} className="gap-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
          {name}
          <button type="button" onClick={() => removeCustomSymptom(name)} className="hover:opacity-80">
            <X className="w-3.5 h-3.5"/>
          </button>
        </Badge>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - centered */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm animate-fade-in-down">
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
          <button onClick={() => setLanguage(prev => prev === 'vi' ? 'en' : 'vi')} className="absolute right-6 px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md">
            {language === 'vi' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">{/* Left Column: Upload + Symptoms */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Upload Card */}
            <Card className="smooth-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-primary"/>
                  {t('stepUpload')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-input rounded p-6 hover:border-primary transition-colors bg-gradient-to-br from-indigo-50 to-blue-50 mb-4">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded shadow-md mb-3"/>
                      <Button
                        variant="destructive"
                        onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                        className="w-full"
                      >
                        {language === 'vi' ? '❌ Xóa ảnh' : '❌ Remove Image'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        className="flex flex-col items-center justify-center cursor-pointer py-8"
                      >
                        <Upload className="w-16 h-16 text-muted-foreground mb-3"/>
                        <p className="text-sm text-muted-foreground text-center mb-4">{t('dragDrop')}</p>
                        <input type="file" accept="image/*" onChange={onFileChange} className="hidden"/>
                        <Button size="lg">
                          📁 {t('selectImage')}
                        </Button>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-input"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-3 bg-gradient-to-br from-indigo-50 to-blue-50 text-muted-foreground font-medium">{language === 'vi' ? 'hoặc' : 'or'}</span></div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setCameraOpen(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      >
                        <Camera className="w-5 h-5 mr-2"/> {t('captureImage')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Duration inline below upload */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-primary"/>
                    <h3 className="text-base font-semibold text-foreground">{t('stepDuration')}</h3>
                  </div>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-3 border-2 border-input rounded focus:border-primary focus:outline-none bg-background text-foreground text-sm font-medium"
                  >
                    <option value="" disabled>{t('selectDuration')}</option>
                    {durationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt[language]}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms Card */}
            <Card className="mt-4 smooth-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary"/>
                    {t('stepSymptoms')}
                  </CardTitle>
                  {(symptoms.length > 0 || customSymptoms.length > 0) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => { setSymptoms([]); setCustomSymptoms([]); }}
                    >
                      🗑️ {t('clearAll')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="pl-10"
                  />
                </div>

                {/* Custom symptom input */}
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={customSymptomInput}
                    onChange={(e) => setCustomSymptomInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !customValidating && addCustomSymptom()}
                    placeholder={language === 'vi' ? '✏️ Nhập triệu chứng khác...' : '✏️ Enter other symptom...'}
                    className="flex-1 border-purple-300 focus-visible:ring-purple-500"
                  />
                  <Button
                    type="button"
                    onClick={addCustomSymptom}
                    disabled={customValidating || !customSymptomInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
                  >
                    {customValidating ? (language === 'vi' ? 'Đang kiểm tra…' : 'Validating…') : (<>➕ {language === 'vi' ? 'Thêm' : 'Add'}</>)}
                  </Button>
                </div>
                {customValidationMsg && (
                  <div className="mb-4 text-xs font-medium px-3 py-2 rounded border" 
                       style={{ backgroundColor: customValidationMsg.startsWith('✅') ? '#ecfdf5' : '#fff7ed', color: '#111827', borderColor: customValidationMsg.startsWith('✅') ? '#34d399' : '#f59e0b' }}>
                    {customValidationMsg}
                  </div>
                )}

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
              {/* Consent checkbox */}
              <div className="mt-4 p-4 border-2 rounded bg-amber-50 border-amber-300 text-amber-900 text-sm">
                <div className="text-xs font-bold uppercase tracking-wide mb-2 text-amber-800">
                  {language === 'vi' ? 'Xác nhận' : 'Consent'}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5"
                    checked={consentAccepted}
                    onChange={(e) => {
                      const v = e.target.checked; setConsentAccepted(v);
                      try { localStorage.setItem('dermasafe_consent_v1', v ? '1' : '0'); } catch {}
                    }}
                  />
                  <span className="font-medium">{t('consentLabel')}</span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !selectedImage || !consentAccepted}
                className="mt-6 w-full py-4 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
              >
                {loading ? '⏳ ' + t('analyzing') : '🔍 ' + t('analyzeBtn')}
              </button>
              {!consentAccepted && (
                <div className="mt-2 text-xs text-amber-700">
                  {t('consentRequired')}
                </div>
              )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: ChatBot + Results */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Chat inline panel - always visible */}
            <div className="bg-white rounded border border-gray-200 shadow-lg overflow-hidden smooth-hover">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600"/>
                <h3 className="text-lg font-bold text-gray-900">{language === 'vi' ? '💬 Trợ lý AI' : '💬 AI Assistant'}</h3>
              </div>
              <div className="p-0">
                <ChatBot
                  mode="inline"
                  analysisContext={result ? {
                    primary_diagnosis: result.primary_diagnosis?.disease,
                    confidence: result.primary_diagnosis?.confidence,
                    risk_level: result.risk_level,
                    symptoms: [
                      ...symptoms.map(s => (viMap[s] || s)),
                      ...customSymptoms
                    ],
                    duration: duration ? durationMap[duration] : undefined,
                    description: result.primary_diagnosis?.description,
                    recommendations: result.recommendations,
                    alternative_diagnoses: result.alternative_diagnoses
                  } : null}
                  language={language}
                  className="h-[460px]"
                />
              </div>
            </div>

            {!result ? (
              <div className="bg-white rounded border border-gray-200 shadow-lg p-10 text-center animate-fade-in">
                <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4 animate-pulse-once"/>
                <p className="text-gray-600 text-base font-medium">
                  {language === 'vi' ? '📋 Tải ảnh, chọn triệu chứng để bắt đầu phân tích' : '📋 Upload image and select symptoms to start'}
                </p>
              </div>
            ) : (
              <div className="space-y-6 stagger-fade-in">
                {/* Risk */}
                <div className={`rounded border-2 ${getRiskColor(result.risk_level)} p-6 shadow-lg animate-scale-in`}>
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
              <div className="bg-white rounded border border-gray-200 shadow-lg p-5 smooth-hover">
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
                <div className="bg-white rounded border border-gray-200 shadow-lg p-5 smooth-hover">
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

      {/* Floating Buttons */}
      <FloatCallButton language={language} />
      <BugReportButton language={language} />
      <ProjectInfoButton language={language} />
    </div>
  );
}

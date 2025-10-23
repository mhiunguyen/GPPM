import { useState } from 'react';
import { Info, X, Github, Users, Heart, Code, Shield } from 'lucide-react';

export type LangKey = 'vi' | 'en';

interface Props {
  language?: LangKey;
}

export default function ProjectInfoButton({ language = 'vi' }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const t = (key: string) => {
    const dict: Record<string, Record<LangKey, string>> = {
      title: { vi: 'Về dự án', en: 'About Project' },
      appName: { vi: 'DermaSafe-AI', en: 'DermaSafe-AI' },
      version: { vi: 'Phiên bản', en: 'Version' },
      description: { 
        vi: 'Hệ thống sàng lọc nguy cơ da liễu thông minh sử dụng AI để phân tích hình ảnh da và cung cấp khuyến nghị sơ bộ.',
        en: 'Intelligent dermatology risk screening system using AI to analyze skin images and provide preliminary recommendations.'
      },
      team: { vi: 'Đội ngũ phát triển', en: 'Development Team' },
      technologies: { vi: 'Công nghệ sử dụng', en: 'Technologies' },
      disclaimer: {
        vi: '⚠️ Lưu ý: Kết quả từ hệ thống chỉ mang tính chất tham khảo, không thay thế chẩn đoán y khoa chuyên nghiệp.',
        en: '⚠️ Note: System results are for reference only and do not replace professional medical diagnosis.'
      },
      github: { vi: 'Mã nguồn', en: 'Source Code' },
      close: { vi: 'Đóng', en: 'Close' }
    };
    return dict[key]?.[language] || key;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label={t('title')}
        title={t('title')}
        className="fixed bottom-52 right-4 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white font-bold
                   bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
                   focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 transition-all duration-300
                   hover:shadow-xl hover:scale-105 animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        <Info className="w-5 h-5 text-white" />
        <span className="hidden sm:inline text-sm">{t('title')}</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-lg sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">{t('appName')}</h3>
                <p className="text-sm text-blue-100">{t('version')}: 1.0.0</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              {language === 'vi' ? 'Giới thiệu' : 'Introduction'}
            </h4>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                {t('description')}
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-2">
                  {language === 'vi' ? '🎯 Mục tiêu:' : '🎯 Objectives:'}
                </h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• {language === 'vi' ? 'Sàng lọc nguy cơ bệnh da liễu nhanh chóng, chính xác' : 'Quick and accurate dermatology risk screening'}</li>
                  <li>• {language === 'vi' ? 'Hỗ trợ người dân tiếp cận chăm sóc sức khỏe da' : 'Support people in accessing skin health care'}</li>
                  <li>• {language === 'vi' ? 'Giảm tải cho hệ thống y tế qua AI sàng lọc ban đầu' : 'Reduce healthcare burden through AI initial screening'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              {t('technologies')}
            </h4>
            
            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="font-semibold text-blue-900">Frontend</div>
                <div className="text-sm text-gray-700 mt-1">React 19 + TypeScript</div>
                <div className="text-xs text-gray-500">Vite 5, Tailwind CSS 4</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="font-semibold text-green-900">Backend API</div>
                <div className="text-sm text-gray-700 mt-1">FastAPI + Python 3.11</div>
                <div className="text-xs text-gray-500">PostgreSQL, Alembic</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="font-semibold text-purple-900">AI Service</div>
                <div className="text-sm text-gray-700 mt-1">PyTorch + ONNX</div>
                <div className="text-xs text-gray-500">OpenCV, NumPy</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="font-semibold text-amber-900">Chatbot</div>
                <div className="text-sm text-gray-700 mt-1">Google Gemini AI</div>
                <div className="text-xs text-gray-500">FastAPI, NLP</div>
              </div>
            </div>

            {/* AI Model Details */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-lg">🧠</span>
                {language === 'vi' ? 'Mô hình AI:' : 'AI Model:'}
              </h5>
              <div className="text-sm text-gray-700 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Tên model:' : 'Model name:'}</span>
                  <span className="text-right">DermLIP ViT-B-16</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Kiến trúc:' : 'Architecture:'}</span>
                  <span className="text-right">Vision Transformer (ViT-B/16)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Phương pháp:' : 'Method:'}</span>
                  <span className="text-right">CLIP-based Contrastive Learning</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Tham số:' : 'Parameters:'}</span>
                  <span className="text-right">~86M params</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Tập dữ liệu:' : 'Dataset:'}</span>
                  <span className="text-right">HAM10000, Fitzpatrick17k</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Số lớp bệnh:' : 'Disease classes:'}</span>
                  <span className="text-right">23+ {language === 'vi' ? 'bệnh da liễu' : 'skin conditions'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Input size:' : 'Input size:'}</span>
                  <span className="text-right">224×224 RGB</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Nguồn:' : 'Source:'}</span>
                  <span className="text-right text-xs">🤗 HuggingFace (redlessone)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{language === 'vi' ? 'Triển khai:' : 'Deployment:'}</span>
                  <span className="text-right">ONNX Runtime (CPU)</span>
                </div>
              </div>
            </div>

            {/* Architecture */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🏗️</span>
                {language === 'vi' ? 'Cấu trúc hệ thống:' : 'System Architecture:'}
              </h5>
              <div className="text-xs font-mono bg-white border border-gray-300 rounded p-3 overflow-x-auto">
                <div className="text-gray-700 space-y-1">
                  <div>📱 <span className="text-blue-600">Frontend (React)</span> → HTTP/REST</div>
                  <div className="ml-4">↓</div>
                  <div>🔄 <span className="text-green-600">Backend API (FastAPI)</span> → Proxy + Database</div>
                  <div className="ml-4">↓</div>
                  <div className="ml-2">├─ <span className="text-purple-600">AI Service</span> → Image Analysis (ViT)</div>
                  <div className="ml-2">├─ <span className="text-amber-600">Chatbot Service</span> → Gemini AI (NLP)</div>
                  <div className="ml-2">└─ <span className="text-gray-600">PostgreSQL</span> → Data Storage</div>
                  <div className="mt-2 text-gray-500">🐳 Docker Compose orchestration</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {t('team')}
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                  NT
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Nguyễn Nhật Thiên</div>
                  <div className="text-sm text-gray-600">{language === 'vi' ? 'Phát triển viên' : 'Developer'}</div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                  MH
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Nguyễn Minh Hiếu</div>
                  <div className="text-sm text-gray-600">{language === 'vi' ? 'Phát triển viên' : 'Developer'}</div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  NH
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Nguyễn Thị Nguyên Hằng</div>
                  <div className="text-sm text-gray-600">{language === 'vi' ? 'Phát triển viên' : 'Developer'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              {language === 'vi' ? '✨ Tính năng nổi bật' : '✨ Key Features'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2 bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                <span className="text-green-600 font-bold text-lg flex-shrink-0">🔍</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Phân tích AI thông minh' : 'Smart AI Analysis'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Vision Transformer nhận diện 23+ bệnh' : 'Vision Transformer identifies 23+ diseases'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-bold text-lg flex-shrink-0">📊</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Đánh giá nguy cơ' : 'Risk Assessment'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Phân tích mức độ HIGH/MEDIUM/LOW' : 'Analyze severity: HIGH/MEDIUM/LOW'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
                <span className="text-purple-600 font-bold text-lg flex-shrink-0">💬</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Chatbot tư vấn 24/7' : '24/7 Consultation Bot'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Gemini AI giải đáp y tế' : 'Gemini AI medical Q&A'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200">
                <span className="text-amber-600 font-bold text-lg flex-shrink-0">📝</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Khuyến nghị cá nhân hóa' : 'Personalized Advice'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Tự động giải thích kết quả' : 'Auto-explain results'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-200">
                <span className="text-pink-600 font-bold text-lg flex-shrink-0">📸</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Chụp ảnh thông minh' : 'Smart Camera Capture'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Tự động crop & xử lý ảnh' : 'Auto crop & image processing'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-gradient-to-br from-indigo-50 to-violet-50 p-3 rounded-lg border border-indigo-200">
                <span className="text-indigo-600 font-bold text-lg flex-shrink-0">🎯</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Xác thực triệu chứng AI' : 'AI Symptom Validation'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Kiểm tra triệu chứng tùy chỉnh' : 'Validate custom symptoms'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-gradient-to-br from-teal-50 to-cyan-50 p-3 rounded-lg border border-teal-200">
                <span className="text-teal-600 font-bold text-lg flex-shrink-0">🌍</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Đa ngôn ngữ' : 'Multi-language'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Tiếng Việt & English' : 'Vietnamese & English'}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-gradient-to-br from-lime-50 to-green-50 p-3 rounded-lg border border-lime-200">
                <span className="text-lime-600 font-bold text-lg flex-shrink-0">📱</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{language === 'vi' ? 'Responsive Design' : 'Responsive Design'}</div>
                  <div className="text-xs text-gray-600">{language === 'vi' ? 'Mobile-first, mượt mọi thiết bị' : 'Mobile-first, smooth on all devices'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
            <p className="text-sm text-amber-900 font-medium">
              {t('disclaimer')}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-3">
            <a
              href="https://github.com/mhiunguyen/GPPM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github className="w-5 h-5" />
              {t('github')}
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('close')}
            </button>
          </div>

          {/* Made with love */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
            {language === 'vi' ? 'Được xây dựng với' : 'Made with'}{' '}
            <Heart className="w-4 h-4 inline text-red-500 fill-red-500 animate-pulse" />{' '}
            {language === 'vi' ? 'tại Việt Nam' : 'in Vietnam'} 🇻🇳
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <p className="text-gray-700 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              {t('technologies')}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="font-semibold text-blue-900">Frontend</div>
                <div className="text-sm text-gray-700 mt-1">React + TypeScript</div>
                <div className="text-xs text-gray-500">Vite, Tailwind CSS</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="font-semibold text-green-900">Backend</div>
                <div className="text-sm text-gray-700 mt-1">FastAPI + Python</div>
                <div className="text-xs text-gray-500">PostgreSQL</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="font-semibold text-purple-900">AI Service</div>
                <div className="text-sm text-gray-700 mt-1">Deep Learning</div>
                <div className="text-xs text-gray-500">PyTorch, OpenCV</div>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="font-semibold text-amber-900">Chatbot</div>
                <div className="text-sm text-gray-700 mt-1">Gemini AI</div>
                <div className="text-xs text-gray-500">Natural Language</div>
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                  MN
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Minh Nguyen</div>
                  <div className="text-sm text-gray-600">{language === 'vi' ? 'Trưởng dự án' : 'Project Lead'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              {language === 'vi' ? '✨ Tính năng chính' : '✨ Key Features'}
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>{language === 'vi' ? 'Phân tích hình ảnh da bằng AI' : 'AI-powered skin image analysis'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>{language === 'vi' ? 'Nhận diện 23+ bệnh da liễu phổ biến' : 'Recognize 23+ common skin conditions'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>{language === 'vi' ? 'Đánh giá mức độ nguy cơ dựa trên triệu chứng' : 'Risk assessment based on symptoms'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>{language === 'vi' ? 'Chatbot AI tư vấn và giải đáp' : 'AI chatbot for consultation'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-1">✓</span>
                <span>{language === 'vi' ? 'Khuyến nghị chăm sóc và điều trị' : 'Care and treatment recommendations'}</span>
              </li>
            </ul>
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
            {language === 'vi' ? 'tại Việt Nam' : 'in Vietnam'}
          </div>
        </div>
      </div>
    </div>
  );
}

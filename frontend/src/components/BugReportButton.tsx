import { useState } from 'react';
import { Bug, X, Send } from 'lucide-react';

export type LangKey = 'vi' | 'en';

interface Props {
  language?: LangKey;
}

export default function BugReportButton({ language = 'vi' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugType, setBugType] = useState('bug');
  const [submitted, setSubmitted] = useState(false);

  const t = (key: string) => {
    const dict: Record<string, Record<LangKey, string>> = {
      title: { vi: 'Báo cáo lỗi', en: 'Report Bug' },
      bugType: { vi: 'Loại vấn đề', en: 'Issue Type' },
      bug: { vi: 'Lỗi kỹ thuật', en: 'Bug' },
      feature: { vi: 'Đề xuất tính năng', en: 'Feature Request' },
      improvement: { vi: 'Cải thiện', en: 'Improvement' },
      bugTitleLabel: { vi: 'Tiêu đề', en: 'Title' },
      bugTitlePlaceholder: { vi: 'Mô tả ngắn gọn vấn đề...', en: 'Brief description of the issue...' },
      bugDescLabel: { vi: 'Chi tiết', en: 'Details' },
      bugDescPlaceholder: { vi: 'Mô tả chi tiết vấn đề, các bước tái hiện...', en: 'Detailed description, steps to reproduce...' },
      submit: { vi: 'Gửi báo cáo', en: 'Submit Report' },
      cancel: { vi: 'Hủy', en: 'Cancel' },
      thanks: { vi: '✅ Cảm ơn! Chúng tôi đã nhận được báo cáo của bạn.', en: '✅ Thank you! We received your report.' },
      close: { vi: 'Đóng', en: 'Close' }
    };
    return dict[key]?.[language] || key;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tạo GitHub issue URL với template
    const issueTitle = encodeURIComponent(`[${bugType.toUpperCase()}] ${bugTitle}`);
    const issueBody = encodeURIComponent(
      `**Issue Type:** ${bugType}\n\n` +
      `**Description:**\n${bugDescription}\n\n` +
      `**Browser:** ${navigator.userAgent}\n` +
      `**Language:** ${language}\n` +
      `**Timestamp:** ${new Date().toISOString()}`
    );
    
    // Open GitHub issues page (replace with your repo)
    const githubIssueUrl = `https://github.com/mhiunguyen/GPPM/issues/new?title=${issueTitle}&body=${issueBody}`;
    window.open(githubIssueUrl, '_blank');
    
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setBugTitle('');
      setBugDescription('');
      setBugType('bug');
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label={t('title')}
        title={t('title')}
        className="fixed bottom-28 right-4 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white font-bold
                   bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700
                   focus:outline-none focus:ring-4 focus:ring-orange-300 active:scale-95 transition-all duration-300
                   hover:shadow-xl hover:scale-105 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        <Bug className="w-5 h-5 text-white" />
        <span className="hidden sm:inline text-sm">{t('title')}</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bug className="w-6 h-6" />
            <h3 className="text-lg font-bold">{t('title')}</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-lg font-medium text-gray-800">{t('thanks')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bug Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('bugType')}
                </label>
                <select
                  value={bugType}
                  onChange={(e) => setBugType(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                >
                  <option value="bug">🐛 {t('bug')}</option>
                  <option value="feature">💡 {t('feature')}</option>
                  <option value="improvement">✨ {t('improvement')}</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('bugTitleLabel')} *
                </label>
                <input
                  type="text"
                  value={bugTitle}
                  onChange={(e) => setBugTitle(e.target.value)}
                  placeholder={t('bugTitlePlaceholder')}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('bugDescLabel')} *
                </label>
                <textarea
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  placeholder={t('bugDescPlaceholder')}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!bugTitle.trim() || !bugDescription.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t('submit')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

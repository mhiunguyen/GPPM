import { useTranslation } from 'react-i18next';
// import './Footer.css';

function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="w-full bg-white/80 backdrop-blur border-t border-gray-200 mt-8 py-4 px-2 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700 font-sans shadow-sm" role="contentinfo" aria-label="Footer">
      <div className="mb-2 md:mb-0 flex items-center gap-2" aria-label="Disclaimer">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-primary mr-1" aria-hidden="true">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V17a1 1 0 01-2 0v-.07A8.001 8.001 0 014.07 13H7a1 1 0 010 2H4.07A8.001 8.001 0 0111 19.93zM17 13a1 1 0 010-2h2.93A8.001 8.001 0 0113 4.07V7a1 1 0 01-2 0V4.07A8.001 8.001 0 014.07 11H7a1 1 0 010 2H4.07A8.001 8.001 0 0111 19.93z" fill="#764ba2" />
        </svg>
        <span><strong>Lưu ý:</strong> Đây KHÔNG phải là công cụ chẩn đoán y tế. Kết quả chỉ mang tính chất tham khảo.</span>
      </div>
      <div className="flex items-center gap-2" aria-label="Copyright">
        <span>DermaSafe-AI &copy; 2025</span>
        <a href="https://github.com/thienreal/GPPM" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold" aria-label="GitHub">GitHub</a>
      </div>
    </footer>
  );
}

export default Footer;

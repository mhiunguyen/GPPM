import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import './DisclaimerModal.css';

interface DisclaimerModalProps {
  onAccept: () => void;
}

function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const [accepted, setAccepted] = useState(false);
  const { t } = useTranslation();

  const handleAccept = () => {
    if (accepted) {
      console.log('DisclaimerModal: User clicked accept');
      localStorage.setItem('dermasafe_disclaimer_accepted', 'true');
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-gray-200 flex flex-col gap-6 animate-fade-in" tabIndex={0}>
        <h2 id="modal-title" className="text-2xl font-bold text-red-600 flex items-center gap-2 mb-2">
          <span role="img" aria-label="Cảnh báo">⚠️</span> {t('modal.title')}
        </h2>
        <div className="flex flex-col gap-2 text-gray-800">
          <p className="font-semibold text-lg" tabIndex={0}>{t('modal.text1')}</p>
          <p tabIndex={0}>{t('modal.text2')}</p>
          <p tabIndex={0}>{t('modal.text3')}</p>
          <p className="bg-yellow-100 border-l-4 border-yellow-400 px-3 py-2 rounded text-yellow-900 font-semibold" tabIndex={0}>
            {t('modal.text4')}
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm text-gray-700" htmlFor="modal-checkbox">
            <input
              id="modal-checkbox"
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
              aria-checked={accepted}
              aria-label={t('modal.checkbox')}
              tabIndex={0}
            />
            <span>{t('modal.checkbox')}</span>
          </label>
          <button
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-md hover:scale-[1.03] transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAccept}
            disabled={!accepted}
            aria-label={t('modal.button')}
            tabIndex={0}
            autoFocus
          >
            {t('modal.button')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisclaimerModal;

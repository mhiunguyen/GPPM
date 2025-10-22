<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import DisclaimerModal from './components/DisclaimerModal';
import DermaSafeAI from './components/DermaSafeAI';

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const hasAccepted = localStorage.getItem('dermasafe_disclaimer_accepted');
    console.log('App: Checking localStorage, hasAccepted =', hasAccepted);
    if (hasAccepted === 'true') {
      setDisclaimerAccepted(true);
    }
    setLoading(false);
  }, []);

  console.log('App: disclaimerAccepted =', disclaimerAccepted, 'loading =', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
=======
import { useState } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import DisclaimerModal from './components/DisclaimerModal';
import ImageUploader from './components/ImageUploader';
import SymptomSelector, { type SymptomsData } from './components/SymptomSelector';
import ResultCard from './components/ResultCard';
import Footer from './components/Footer';
// import './App.css';

interface AnalyzeResult {
  risk: string;
  reason: string;
  cv_scores?: Record<string, number>;
}

function App() {
  const { t } = useTranslation();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomsData>({
    symptoms_selected: [],
    duration: null,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedImage) {
      alert('Vui lòng chọn ảnh trước khi phân tích');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('symptoms_json', JSON.stringify(symptoms));

      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalyzeResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gọi API');
      console.error('Analyze error:', err);
    } finally {
      setLoading(false);
    }
  };
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4

  if (!disclaimerAccepted) {
    return (
      <I18nextProvider i18n={i18n}>
<<<<<<< HEAD
        <DisclaimerModal onAccept={() => {
          console.log('App: DisclaimerModal accepted!');
          setDisclaimerAccepted(true);
        }} />
=======
        <DisclaimerModal onAccept={() => setDisclaimerAccepted(true)} />
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4
      </I18nextProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
<<<<<<< HEAD
      <DermaSafeAI />
=======
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-purple-100 font-sans">
        <header className="w-full py-8 px-4 text-center bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 drop-shadow-lg">{t('app.title')}</h1>
          <p className="text-lg md:text-xl font-medium opacity-90">{t('app.subtitle')}</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center py-8 px-2" role="main" tabIndex={-1}>
          <div className="w-full max-w-xl bg-white/90 rounded-xl shadow-xl p-6 flex flex-col gap-6 border border-gray-100" aria-label="AI Dermatology Risk Screening Form">
            <ImageUploader onImageSelect={setSelectedImage} />

            <div className="h-px bg-gradient-to-r from-indigo-300 via-purple-300 to-transparent my-2" />

            <SymptomSelector value={symptoms} onChange={setSymptoms} />

            <button
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-md hover:scale-[1.03] transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={handleAnalyze}
              disabled={loading || !selectedImage}
              aria-busy={loading}
              aria-label={t('analyze.button')}
              tabIndex={0}
              autoFocus
            >
              {loading ? (
                <span className="flex items-center gap-2 animate-pulse" aria-label={t('analyze.loading')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" className="animate-spin" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="#764ba2" strokeWidth="4" fill="none" opacity="0.2" />
                    <path d="M12 2 a10 10 0 0 1 0 20" stroke="#667eea" strokeWidth="4" fill="none" />
                  </svg>
                  {t('analyze.loading')}
                </span>
              ) : t('analyze.button')}
            </button>

            {error && (
              <div className="w-full bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 mt-2 shadow-sm" role="alert" tabIndex={0} aria-live="assertive">
                <strong>{t('error.banner')}</strong> {error}
              </div>
            )}

            {result && (
              <div className="w-full animate-fade-in" tabIndex={0} aria-live="polite">
                <ResultCard risk={result.risk} reason={result.reason} />
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
>>>>>>> 9491d7e6213a5e25ee6fdc2936818618a3dc64a4
    </I18nextProvider>
  );
}

export default App;

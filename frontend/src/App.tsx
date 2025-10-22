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

  if (!disclaimerAccepted) {
    return (
      <I18nextProvider i18n={i18n}>
        <DisclaimerModal onAccept={() => {
          console.log('App: DisclaimerModal accepted!');
          setDisclaimerAccepted(true);
        }} />
      </I18nextProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <DermaSafeAI />
    </I18nextProvider>
  );
}

export default App;

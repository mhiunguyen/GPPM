// import './ResultCard.css';

interface ResultCardProps {
  risk: string;
  reason: string;
}

import { useTranslation } from 'react-i18next';

export default function ResultCard({ risk, reason }: ResultCardProps) {
  const { t } = useTranslation();
  const getRiskStyle = () => {
    if (risk.includes('CAO') || risk.includes('🔴')) return 'bg-red-100 border-red-400 text-red-700';
    if (risk.includes('TRUNG BÌNH') || risk.includes('🟡')) return 'bg-yellow-100 border-yellow-400 text-yellow-800';
    if (risk.includes('THẤP') || risk.includes('🟢')) return 'bg-green-100 border-green-400 text-green-800';
    return 'bg-gray-100 border-gray-300 text-gray-700';
  };

  return (
    <div className={`w-full rounded-xl border-2 p-4 shadow-lg flex flex-col gap-3 ${getRiskStyle()} animate-fade-in`} role="region" aria-label={t('result.title')} tabIndex={0}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-2">
        <h3 className="text-xl font-bold tracking-tight">{t('result.title')}</h3>
        <div className="text-lg font-semibold px-3 py-1 rounded-full bg-white/60 border border-white shadow-sm" aria-label={risk}>{risk}</div>
      </div>
      <div className="text-base text-gray-800 mb-2" aria-label={reason} tabIndex={0}>
        {reason}
      </div>
      <div className="text-xs text-gray-600 bg-white/70 rounded-lg px-3 py-2 border border-gray-200" aria-label={t('result.reminder')} tabIndex={0}>
        <strong>{t('result.reminder')}</strong>
      </div>
    </div>
  );
}

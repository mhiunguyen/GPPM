// import './SymptomSelector.css';

const AVAILABLE_SYMPTOMS = [
  'ngứa',
  'đau',
  'chảy máu',
  'lan rộng',
  'lan rộng rất nhanh',
  'đau nhức dữ dội',
  'mới xuất hiện',
  'thay đổi màu sắc',
  'thay đổi kích thước',
];

const DURATION_OPTIONS = ['< 1 tuần', '1-2 tuần', '> 2 tuần'] as const;

export type Duration = typeof DURATION_OPTIONS[number];

export interface SymptomsData {
  symptoms_selected: string[];
  duration: Duration | null;
}

interface SymptomSelectorProps {
  value: SymptomsData;
  onChange: (data: SymptomsData) => void;
}

import { useTranslation } from 'react-i18next';

export default function SymptomSelector({ value, onChange }: SymptomSelectorProps) {
  const { t } = useTranslation();
  const handleSymptomToggle = (symptom: string) => {
    const newSymptoms = value.symptoms_selected.includes(symptom)
      ? value.symptoms_selected.filter(s => s !== symptom)
      : [...value.symptoms_selected, symptom];
    onChange({ ...value, symptoms_selected: newSymptoms });
  };

  const handleDurationChange = (duration: Duration) => {
    onChange({ ...value, duration });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
  <label className="font-semibold text-gray-700 mb-1" id="symptom-label">{t('symptomSelector.label')}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2" role="group" aria-labelledby="symptom-label">
          {AVAILABLE_SYMPTOMS.map(symptom => (
            <label key={symptom} className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2 shadow-sm cursor-pointer hover:bg-indigo-100 transition">
              <input
                type="checkbox"
                checked={value.symptoms_selected.includes(symptom)}
                onChange={() => handleSymptomToggle(symptom)}
                className="accent-indigo-500 w-4 h-4"
                aria-checked={value.symptoms_selected.includes(symptom)}
                aria-label={symptom}
                tabIndex={0}
              />
              <span className="text-gray-800 text-sm">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700 mb-1" htmlFor="duration-select" id="duration-label">
          {t('symptomSelector.duration')}
        </label>
        <select
          id="duration-select"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={value.duration || ''}
          onChange={(e) => handleDurationChange(e.target.value as Duration)}
          aria-labelledby="duration-label"
          tabIndex={0}
        >
          <option value="">-- Chọn --</option>
          {DURATION_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

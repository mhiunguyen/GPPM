import type React from 'react';
import { Upload, Camera, Clock, Activity, Search, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type LangKey = 'vi' | 'en';
type Symptom = { id: string; vi: string; en: string };
type SymptomCategory = { id: string; title: { vi: string; en: string }; symptoms: Symptom[] };

interface UploadSymptomsTabProps {
  language: LangKey;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  onCameraClick: () => void;
  onRemoveImage: () => void;
  duration: string;
  onDurationChange: (value: string) => void;
  symptoms: string[];
  customSymptoms: string[];
  onToggleSymptom: (id: string) => void;
  onRemoveSymptom: (id: string) => void;
  customSymptomInput: string;
  onCustomSymptomInputChange: (value: string) => void;
  customValidating: boolean;
  customValidationMsg: string | null;
  onAddCustomSymptom: () => void;
  onRemoveCustomSymptom: (name: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  expanded: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  categories: SymptomCategory[];
  filteredCategories: SymptomCategory[];
  consentAccepted: boolean;
  onConsentChange: (accepted: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  selectedImage: File | null;
  t: (key: string) => string;
  durationOptions: Array<{ value: string; vi: string; en: string }>;
}

export default function UploadSymptomsTab(props: UploadSymptomsTabProps) {
  const {
    language,
    previewUrl,
    onFileChange,
    onDrop,
    onCameraClick,
    onRemoveImage,
    duration,
    onDurationChange,
    symptoms,
    customSymptoms,
    onToggleSymptom,
    onRemoveSymptom,
    customSymptomInput,
    onCustomSymptomInputChange,
    customValidating,
    customValidationMsg,
    onAddCustomSymptom,
    onRemoveCustomSymptom,
    search,
    onSearchChange,
    expanded,
    onToggleExpand,
    filteredCategories,
    categories,
    consentAccepted,
    onConsentChange,
    onSubmit,
    loading,
    selectedImage,
    t,
    durationOptions
  } = props;

  const selectedChips = (
    <div className="flex flex-wrap gap-2 justify-center">
      {symptoms.map(id => {
        const s = categories.flatMap(c => c.symptoms).find(x => x.id === id);
        if (!s) return null;
        return (
          <Badge key={id} className="gap-2">
            {s[language]}
            <button type="button" onClick={() => onRemoveSymptom(id)} className="hover:opacity-80">
              <X className="w-3.5 h-3.5"/>
            </button>
          </Badge>
        );
      })}
      {customSymptoms.map(name => (
        <Badge key={`c-${name}`} className="gap-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
          {name}
          <button type="button" onClick={() => onRemoveCustomSymptom(name)} className="hover:opacity-80">
            <X className="w-3.5 h-3.5"/>
          </button>
        </Badge>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Section */}
      <div className="space-y-6">
        <Card className="smooth-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary"/>
              {t('stepUpload')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-input rounded p-6 hover:border-primary transition-colors bg-gradient-to-br from-indigo-50 to-blue-50 mb-4">
              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded shadow-md mb-3"/>
                  <Button variant="destructive" onClick={onRemoveImage} className="w-full">
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
                    <Button size="lg">📁 {t('selectImage')}</Button>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-input"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-3 bg-gradient-to-br from-indigo-50 to-blue-50 text-muted-foreground font-medium">{language === 'vi' ? 'hoặc' : 'or'}</span></div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={onCameraClick}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Camera className="w-5 h-5 mr-2"/> {t('captureImage')}
                  </Button>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary"/>
                <h3 className="text-base font-semibold text-foreground">{t('stepDuration')}</h3>
              </div>
              <select
                value={duration}
                onChange={(e) => onDurationChange(e.target.value)}
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
      </div>

      {/* Symptoms Section */}
      <div className="space-y-6">
        <Card className="smooth-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary"/>
                {t('stepSymptoms')}
              </CardTitle>
              {(symptoms.length > 0 || customSymptoms.length > 0) && (
                <Button variant="destructive" size="sm" onClick={() => { onToggleSymptom('CLEAR_ALL'); }}>
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
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="pl-10"
              />
            </div>

            {/* Custom symptom input */}
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={customSymptomInput}
                onChange={(e) => onCustomSymptomInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !customValidating && onAddCustomSymptom()}
                placeholder={language === 'vi' ? '✏️ Nhập triệu chứng khác...' : '✏️ Enter other symptom...'}
                className="flex-1 border-purple-300 focus-visible:ring-purple-500"
              />
              <Button
                type="button"
                onClick={onAddCustomSymptom}
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
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredCategories.map(cat => {
                const isOpen = expanded[cat.id] ?? false;
                const selectedCount = cat.symptoms.filter(s => symptoms.includes(s.id)).length;
                return (
                  <div key={cat.id} className="border-2 border-gray-200 rounded bg-white overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => onToggleExpand(cat.id)}
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
                              onChange={() => onToggleSymptom(s.id)}
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
                  onChange={(e) => onConsentChange(e.target.checked)}
                />
                <span className="font-medium">{t('consentLabel')}</span>
              </label>
            </div>

            <button
              onClick={onSubmit}
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
    </div>
  );
}

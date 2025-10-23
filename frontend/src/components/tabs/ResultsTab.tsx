import { Shield, FileText, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type React from 'react';

type LangKey = 'vi' | 'en';
type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

interface ResultsTabProps {
  language: LangKey;
  result: any;
  t: (key: string) => string;
  getRiskColor: (level: RiskLevel) => string;
  getRiskIcon: (level: RiskLevel) => React.ReactElement;
}

export default function ResultsTab({ language, result, t, getRiskColor, getRiskIcon }: ResultsTabProps) {
  if (!result) {
    return (
      <div className="bg-white rounded border border-gray-200 shadow-lg p-10 text-center">
        <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4"/>
        <p className="text-gray-600 text-base font-medium">
          {language === 'vi' ? '📋 Chưa có kết quả. Vui lòng tải ảnh và phân tích ở tab "Tải ảnh".' : '📋 No results yet. Please upload an image and analyze in "Upload" tab.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Level */}
      <div className={`rounded border-2 ${getRiskColor(result.risk_level)} p-6 shadow-lg animate-scale-in`}>
        <div className="flex items-start gap-4 justify-center text-center">
          {getRiskIcon(result.risk_level)}
          <div className="flex-1">
            <div className="text-sm font-semibold mb-1">{t('riskLevel')}</div>
            <div className="text-2xl font-bold">
              {result.risk_level === 'HIGH' && (language === 'vi' ? '🔴 CAO' : '🔴 HIGH')}
              {result.risk_level === 'MEDIUM' && (language === 'vi' ? '🟡 TRUNG BÌNH' : '🟡 MEDIUM')}
              {result.risk_level === 'LOW' && (language === 'vi' ? '🟢 THẤP' : '🟢 LOW')}
            </div>
            {result.detected_symptoms?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {result.detected_symptoms.slice(0, 5).map((s: string, i: number) => (
                  <span key={i} className="text-xs px-3 py-1 bg-white/80 rounded-full border-2 font-semibold">{s}</span>
                ))}
                {result.detected_symptoms.length > 5 && (
                  <span className="text-xs px-3 py-1 bg-white/80 rounded-full border-2 font-semibold">+{result.detected_symptoms.length - 5}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Diagnosis */}
      <Card className="smooth-hover">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600"/>
            <h3 className="text-base font-semibold text-gray-800">{t('primaryDiag')}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-lg font-bold text-blue-700">{result.primary_diagnosis?.disease}</div>
            {result.primary_diagnosis?.description && (
              <p className="text-sm text-gray-600">{result.primary_diagnosis.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">{t('confidence')}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${(result.primary_diagnosis?.confidence || 0) * 100}%` }} />
                </div>
                <span className="text-sm font-semibold text-blue-700">
                  {Math.round((result.primary_diagnosis?.confidence || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Diagnoses */}
      {result.alternative_diagnoses?.length > 0 && (
        <Card className="smooth-hover">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-700"/>
              <h3 className="text-base font-semibold text-gray-800">{t('altDiag')}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.alternative_diagnoses.map((diag: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-800">{diag.disease}</div>
                      {diag.description && (
                        <div className="text-xs text-gray-600 mt-1">{diag.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-700" style={{ width: `${Math.round((diag.confidence || 0) * 100)}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {Math.round((diag.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendations && (
        <Card className="smooth-hover">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600"/>
              <h3 className="text-base font-semibold text-gray-800">{t('recommendations')}</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Case A: Server provided an array of detailed recommendations */}
            {Array.isArray(result.recommendations) ? (
              <div>
                <ul className="space-y-2 list-disc pl-6">
                  {result.recommendations.map((line: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-800 whitespace-pre-line">{line}</li>
                  ))}
                </ul>
              </div>
            ) : (
              // Case B: Fallback to risk-based summary (action/reason/steps)
              <>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-bold text-blue-900 mb-2">{result.recommendations.action}</div>
                  <div className="text-sm text-blue-800">{result.recommendations.reason}</div>
                </div>
                {result.recommendations.steps && (
                  <div>
                    <div className="font-semibold text-gray-800 mb-2">
                      {language === 'vi' ? 'Các bước tiếp theo:' : 'Next steps:'}
                    </div>
                    <ul className="space-y-2">
                      {result.recommendations.steps.map((step: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600 font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

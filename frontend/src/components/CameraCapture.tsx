import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Camera, Lightbulb, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File, previewUrl: string) => void;
}

interface QualityCheck {
  is_acceptable: boolean;
  brightness_score: number;
  sharpness_score: number;
  color_quality_score: number;
  overall_score: number;
  issues: string[];
  suggestions: string[];
}

export default function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [qualityCheck, setQualityCheck] = useState<QualityCheck | null>(null);
  const [checkingQuality, setCheckingQuality] = useState(false);
  const [realtimeQuality, setRealtimeQuality] = useState<QualityCheck | null>(null);
  const [realtimeQualityLocal, setRealtimeQualityLocal] = useState<QualityCheck | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>(() => {
    try {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isCoarse = typeof window !== 'undefined' && 'matchMedia' in window
        ? window.matchMedia('(pointer: coarse)').matches
        : false;
      return (isMobileUA || isCoarse) ? 'user' : 'environment';
    } catch {
      return 'environment';
    }
  });
  
  // Collapse/expand states - default to collapsed (minimized)
  const [qualityExpanded, setQualityExpanded] = useState(false);
  const [tipsExpanded, setTipsExpanded] = useState(false);

  // Simple, fast, in-browser quality metrics from ImageData
  const computeLocalQuality = useCallback((img: ImageData): QualityCheck => {
    const { data, width, height } = img;
    const n = width * height;
    if (n === 0) {
      return {
        is_acceptable: false,
        brightness_score: 0,
        sharpness_score: 0,
        color_quality_score: 0,
        overall_score: 0,
        issues: ['no_image'],
        suggestions: ['Không có dữ liệu ảnh']
      };
    }

    // Precompute grayscale (luminance) buffer for convolution
    const gray = new Float32Array(n);
    let sumY = 0;
    let sumSat = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxc = Math.max(r, g, b);
        const minc = Math.min(r, g, b);
        const sat = maxc === 0 ? 0 : (maxc - minc) / maxc; // HSV saturation
        sumSat += sat;
        const yLum = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0..255
        gray[y * width + x] = yLum;
        sumY += yLum;
      }
    }
    const meanY = sumY / n; // 0..255
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const brightness = clamp(meanY / 255, 0, 1);
    const colorQuality = clamp(sumSat / n, 0, 1); // 0..1

    // Sharpness via Variance of Laplacian on grayscale
    // Kernel: [[0,1,0],[1,-4,1],[0,1,0]]
    let lapVarAccum = 0;
    let count = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const c = gray[y * width + x];
        const up = gray[(y - 1) * width + x];
        const down = gray[(y + 1) * width + x];
        const left = gray[y * width + (x - 1)];
        const right = gray[y * width + (x + 1)];
        const lap = -4 * c + up + down + left + right; // can be negative
        lapVarAccum += lap * lap; // accumulate squared response
        count++;
      }
    }
    const lapVar = count > 0 ? lapVarAccum / count : 0; // average energy

    // Normalize sharpness using a smooth log scale; calibrated for 160px wide frames
    // Typical focused frames ~ [50..400] for lapVar; defocused much smaller
    const sharpness = clamp(Math.log1p(lapVar) / Math.log1p(300), 0, 1);

    const overall = clamp(0.4 * sharpness + 0.35 * brightness + 0.25 * colorQuality, 0, 1);

    const suggestions: string[] = [];
    if (brightness < 0.45) suggestions.push('Tăng ánh sáng hoặc di chuyển tới nơi sáng hơn');
    if (sharpness < 0.45) suggestions.push('Giữ máy ổn định, chờ lấy nét hoặc đưa máy lại gần hơn');
    if (colorQuality < 0.45) suggestions.push('Tránh ánh sáng màu; ưu tiên đèn trắng, nền đơn giản');

    return {
      is_acceptable: overall >= 0.7,
      brightness_score: brightness,
      sharpness_score: sharpness,
      color_quality_score: colorQuality,
      overall_score: overall,
      issues: [],
      suggestions,
    };
  }, []);

  // Real-time quality check
  useEffect(() => {
    if (!isOpen || !videoRef.current || loading) return;

    let lastLocalUpdate = 0;
    let lastServerUpdate = 0;
    const SERVER_INTERVAL = 1500; // ms: server check (lower frequency)
    const LOCAL_INTERVAL = 150; // ms: local check (high frequency)

    const runLoop = async (time: number) => {
      if (!videoRef.current || !canvasRef.current) {
        rafIdRef.current = requestAnimationFrame(runLoop);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (vw > 0 && vh > 0) {
        // Downscale for fast local analysis
        const DW = 160;
        const DH = Math.max(120, Math.round((vh / vw) * 160));
        canvas.width = DW;
        canvas.height = DH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, DW, DH);

          // Local realtime metrics every LOCAL_INTERVAL ms
          if (time - lastLocalUpdate >= LOCAL_INTERVAL) {
            const img = ctx.getImageData(0, 0, DW, DH);
            const localMetrics = computeLocalQuality(img);
            setRealtimeQualityLocal(localMetrics);
            lastLocalUpdate = time;
          }

          // Server check (lighter cadence) every SERVER_INTERVAL ms
          if (time - lastServerUpdate >= SERVER_INTERVAL) {
            try {
              const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, 'image/jpeg', 0.7)
              );
              if (blob) {
                const formData = new FormData();
                formData.append('image', blob, 'preview.jpg');
                const response = await fetch('/api/v1/capture/check-quality', {
                  method: 'POST',
                  body: formData,
                });
                if (response.ok) {
                  const data = await response.json();
                  setRealtimeQuality({ ...data });
                }
              }
            } catch (e) {
              console.debug('Realtime quality check failed', e);
            } finally {
              lastServerUpdate = time;
            }
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(runLoop);
    };

    rafIdRef.current = requestAnimationFrame(runLoop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [isOpen, loading, computeLocalQuality]);
 

  // Start/Restart camera with desired facing
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setLoading(true);
    setError('');

    const stopCurrentStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const pickDeviceByFacing = async (facing: 'environment' | 'user') => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        // Try heuristic by label (works after permissions granted)
        const preferred = videoDevices.find((d) => {
          const label = (d.label || '').toLowerCase();
          return facing === 'user'
            ? label.includes('front') || label.includes('user') || label.includes('trước')
            : label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('sau');
        });
        return preferred?.deviceId || videoDevices[0]?.deviceId;
      } catch {
        return undefined;
      }
    };

    const startCamera = async () => {
      try {
        // First try using facingMode (most browsers)
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: cameraFacing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        };

        let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

        // Some browsers ignore facingMode; if no change, try picking deviceId
        const settings = mediaStream.getVideoTracks()[0]?.getSettings?.() as MediaTrackSettings | undefined;
        const reportedFacing = (settings?.facingMode as string | undefined) || '';
        if (reportedFacing && cameraFacing && !reportedFacing.includes(cameraFacing)) {
          // Not the facing we want; retry with deviceId
          mediaStream.getTracks().forEach((t) => t.stop());
          const deviceId = await pickDeviceByFacing(cameraFacing);
          if (deviceId) {
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } },
              audio: false,
            });
          }
        }

        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = async () => {
            if (!active || !videoRef.current) return;
            try {
              await videoRef.current.play();
              setLoading(false);
            } catch (playError) {
              console.error('Play error:', playError);
              setError('Không thể khởi động camera');
              setLoading(false);
            }
          };
        }
      } catch (err: unknown) {
        // Fallback: try enumerateDevices path directly if facingMode failed
        try {
          const deviceId = await pickDeviceByFacing(cameraFacing);
          if (deviceId) {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } },
              audio: false,
            });
            if (!active) {
              mediaStream.getTracks().forEach((t) => t.stop());
              return;
            }
            streamRef.current = mediaStream;
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              await videoRef.current.play().catch(() => {});
            }
            setLoading(false);
            setError('');
            return;
          }
        } catch (e) {
          console.debug('Fallback device selection failed', e);
        }

        if (!active) return;
        console.error('Camera error:', err);
        setError(err instanceof Error ? err.message : 'Không thể truy cập camera');
        setLoading(false);
      }
    };

    // Stop any previous stream before starting
    stopCurrentStream();
    startCamera();

    return () => {
      active = false;
      stopCurrentStream();
    };
  }, [isOpen, cameraFacing]);

  const checkImageQuality = async (blob: Blob) => {
    setCheckingQuality(true);
    try {
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
      
      const response = await fetch('/api/v1/capture/check-quality', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setQualityCheck(data);
        return data.is_acceptable;
      }
    } catch (err) {
      console.error('Quality check error:', err);
    } finally {
      setCheckingQuality(false);
    }
    return true; // Default to acceptable if check fails
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    try {
      const blob = await new Promise<Blob | null>((resolve) => 
        canvas.toBlob(resolve, 'image/jpeg', 0.95)
      );
      
      if (!blob) return;
      
      // Check quality
      const isAcceptable = await checkImageQuality(blob);
      
      if (isAcceptable) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file, URL.createObjectURL(blob));
        
        // Cleanup stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    } catch (err) {
      console.error('Capture error:', err);
    } finally {
      setCapturing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Video background - centered */}
      <video 
        ref={videoRef} 
        className="absolute inset-0 w-full h-full object-cover"
        playsInline 
        muted 
        autoPlay 
        style={cameraFacing === 'user' ? { transform: 'scaleX(-1)' } : undefined}
      />
      
      {/* Overlay guide frame */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
        
        {/* Center focus frame - CIRCLE */}
        <div className="relative w-80 h-80 border-4 border-white rounded-full shadow-2xl">
          {/* Corner markers in circle - positioned at 45 degree angles */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-full"></div>
          <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-full"></div>
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-full"></div>
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-full"></div>
          
          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-white rounded-full opacity-50"></div>
          </div>
        </div>
      </div>

  {/* Top bar */}
  <div className="absolute top-0 left-0 right-0 p-6 safe-top flex items-center justify-between z-10">
        <div className="flex items-center gap-3 text-white">
          <Camera className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Chụp ảnh da liễu</h2>
            <p className="text-sm text-gray-200">Đặt vùng da cần kiểm tra vào khung hình</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch camera button */}
          <button
            onClick={() => setCameraFacing((p) => (p === 'environment' ? 'user' : 'environment'))}
            disabled={loading || !!error}
            className="px-4 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all text-white disabled:opacity-50"
            title={cameraFacing === 'user' ? 'Chuyển cam sau' : 'Chuyển cam trước'}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {cameraFacing === 'user' ? 'Cam trước' : 'Cam sau'}
          </button>

          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center text-white">
            <div className="spinner mb-4 mx-auto w-16 h-16"></div>
            <p className="text-xl font-semibold">Đang khởi động camera...</p>
            <p className="text-sm text-gray-300 mt-2">Vui lòng cho phép truy cập camera</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
          <div className="max-w-md mx-4 p-8 bg-red-900/80 backdrop-blur-sm rounded border border-red-500">
            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white text-center mb-3">Không thể truy cập camera</h3>
            <p className="text-red-200 text-center mb-2">{error}</p>
            <p className="text-sm text-red-300 text-center mb-6">Vui lòng cấp quyền camera trong trình duyệt</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-white text-red-900 rounded font-semibold hover:bg-gray-100 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Quality check feedback */}
      {checkingQuality && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-blue-900/90 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium shadow-xl z-10">
          <div className="flex items-center gap-3">
            <div className="spinner w-5 h-5"></div>
            <span>Đang kiểm tra chất lượng ảnh...</span>
          </div>
        </div>
      )}

      {qualityCheck && !qualityCheck.is_acceptable && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 max-w-md bg-yellow-900/90 backdrop-blur-sm px-6 py-4 rounded text-white shadow-xl z-10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-2">⚠️ Chất lượng ảnh chưa tốt</p>
              <ul className="text-sm space-y-1">
                {qualityCheck.suggestions.map((suggestion, idx) => (
                  <li key={idx}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {qualityCheck && qualityCheck.is_acceptable && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-green-900/90 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium shadow-xl z-10 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>✓ Chất lượng ảnh tốt!</span>
        </div>
      )}

      {/* Quality metrics panel - using realtime data - Collapsible */}
      {(realtimeQualityLocal || realtimeQuality || qualityCheck) && (
        <div className="absolute top-24 right-6 safe-right z-10">
          <Card className="bg-white/95 backdrop-blur-md border-2 border-white/80 shadow-2xl transition-all duration-300">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => setQualityExpanded(!qualityExpanded)}
            >
              <CardTitle className="text-sm font-bold text-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Chất lượng real-time
                </div>
                <span className="text-xl">{qualityExpanded ? '🔽' : '▶️'}</span>
              </CardTitle>
            </CardHeader>
            
            {qualityExpanded && (
              <CardContent className="pt-0 animate-fade-in">
                <div className="space-y-4 text-xs text-gray-800">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center gap-2">
                        <span className="text-yellow-500">💡</span>
                        Độ sáng
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(((realtimeQualityLocal||realtimeQuality||qualityCheck)?.brightness_score||0)*100)}%
                      </Badge>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 ease-out rounded-full" 
                        style={{ width: `${Math.round(((realtimeQualityLocal||realtimeQuality||qualityCheck)?.brightness_score||0)*100)}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center gap-2">
                        <span className="text-blue-500">🎯</span>
                        Độ nét
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(((realtimeQualityLocal||realtimeQuality||qualityCheck)?.sharpness_score||0)*100)}%
                      </Badge>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out rounded-full" 
                        style={{ width: `${Math.round(((realtimeQualityLocal||realtimeQuality||qualityCheck)?.sharpness_score||0)*100)}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center gap-2">
                        <span className="text-purple-500">🎨</span>
                        Chất lượng màu
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(((realtimeQualityLocal||realtimeQuality||qualityCheck)?.color_quality_score||0)*100)}%
                      </Badge>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-300 ease-out rounded-full" 
                        style={{ width: `${Math.round(((realtimeQualityLocal||realtimeQuality||qualityCheck)?.color_quality_score||0)*100)}%` }} 
                      />
                    </div>
                  </div>
                  
                  {/* Overall accuracy removed per UX request */}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Tips sidebar - Collapsible */}
      {showGuide && !error && !loading && (
        <div className="absolute left-6 safe-left top-1/2 -translate-y-1/2 z-10 animate-fade-in">
          <Card className="bg-white/95 backdrop-blur-md border-2 border-white/80 shadow-2xl transition-all duration-300">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => setTipsExpanded(!tipsExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">Mẹo chụp ảnh</CardTitle>
                </div>
                <span className="text-xl ml-4">{tipsExpanded ? '🔽' : '▶️'}</span>
              </div>
            </CardHeader>
            
            {tipsExpanded && (
              <CardContent className="pt-0 animate-fade-in">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="p-1 bg-blue-100 rounded-full flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">💡</span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">Ánh sáng</p>
                      <p className="text-blue-700 text-xs">Sử dụng ánh sáng tự nhiên hoặc đèn trắng đều</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="p-1 bg-green-100 rounded-full flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">📸</span>
                    </div>
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Độ nét</p>
                      <p className="text-green-700 text-xs">Giữ camera ổn định, chụp cận cảnh</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="p-1 bg-purple-100 rounded-full flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">🎯</span>
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900 text-sm">Khung hình</p>
                      <p className="text-purple-700 text-xs">Vùng da chiếm 50-70% khung hình</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="p-1 bg-orange-100 rounded-full flex-shrink-0">
                      <span className="text-orange-600 font-bold text-sm">🖼️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-900 text-sm">Nền đơn giản</p>
                      <p className="text-orange-700 text-xs">Tránh bóng mờ và phản chiếu</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGuide(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full text-gray-500 hover:text-gray-700"
                >
                  Ẩn hướng dẫn
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      )}

            {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 safe-bottom z-10">
        <div className="flex items-center justify-center gap-6">
          {/* Cancel button */}
          <button
            onClick={onClose}
            disabled={capturing}
            className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ❌ Hủy
          </button>
          
          {/* Capture button - centered */}
          <button
            onClick={handleCapture}
            disabled={capturing || loading || !!error}
            className="relative w-24 h-24 bg-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group flex items-center justify-center"
          >
            {capturing ? (
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <div className="absolute inset-3 bg-red-500 rounded-full group-hover:bg-red-600 transition-colors"></div>
                <Camera className="absolute inset-0 m-auto w-10 h-10 text-white z-10" />
              </>
            )}
          </button>
          
          {/* Quality info */}
          {!showGuide && !error && !loading && (
            <button
              onClick={() => setShowGuide(true)}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded font-bold transition-all flex items-center gap-2"
            >
              <Lightbulb className="w-6 h-6"/> Mẹo
            </button>
          )}
        </div>
        
        {capturing && (
          <p className="text-center text-white text-base mt-6 animate-pulse font-bold">
            ⏳ Đang chụp và kiểm tra chất lượng...
          </p>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

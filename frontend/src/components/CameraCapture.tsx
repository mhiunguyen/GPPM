import { useEffect, useRef, useState } from 'react';
import { X, Camera, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

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

  // Real-time quality check
  useEffect(() => {
    if (!isOpen || !videoRef.current || loading) return;
    
    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0);
      
      try {
        const blob = await new Promise<Blob | null>((resolve) => 
          canvas.toBlob(resolve, 'image/jpeg', 0.8)
        );
        
        if (!blob) return;
        
        const formData = new FormData();
        formData.append('image', blob, 'preview.jpg');
        
        const response = await fetch('/api/v1/capture/check-quality', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          setRealtimeQuality(data);
        }
      } catch (err) {
        console.error('Real-time quality check error:', err);
      }
    }, 1000); // Check every second
    
    return () => clearInterval(interval);
  }, [isOpen, loading]);

  useEffect(() => {
    if (!isOpen) return;
    
    let active = true;
    setLoading(true);
    setError('');
    
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: 'environment' }, 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 } 
          },
          audio: false,
        });
        
        if (!active) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }
        
        streamRef.current = mediaStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Wait for video to be ready before playing
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
        if (!active) return;
        console.error('Camera error:', err);
        setError(err instanceof Error ? err.message : 'Không thể truy cập camera');
        setLoading(false);
      }
    };
    
    startCamera();
    
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isOpen]);

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
        
        <button
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>
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

      {/* Quality metrics panel - using realtime data */}
      {(realtimeQuality || qualityCheck) && (
        <div className="absolute top-24 right-6 safe-right bg-white/70 backdrop-blur-sm rounded shadow-lg border-2 border-white/80 p-5 w-72 z-10">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            📊 Chất lượng real-time
          </h4>
          <div className="space-y-3 text-xs text-gray-800">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">💡 Độ sáng</span>
                <span className="font-bold">{Math.round(((realtimeQuality||qualityCheck)?.brightness_score||0)*100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 transition-all duration-300" style={{ width: `${Math.round(((realtimeQuality||qualityCheck)?.brightness_score||0)*100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">🎯 Độ nét</span>
                <span className="font-bold">{Math.round(((realtimeQuality||qualityCheck)?.sharpness_score||0)*100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${Math.round(((realtimeQuality||qualityCheck)?.sharpness_score||0)*100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">🎨 Chất lượng màu</span>
                <span className="font-bold">{Math.round(((realtimeQuality||qualityCheck)?.color_quality_score||0)*100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${Math.round(((realtimeQuality||qualityCheck)?.color_quality_score||0)*100)}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t-2 border-gray-300">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-base">✅ Độ chính xác</span>
                <span className="font-bold text-base">{Math.round(((realtimeQuality||qualityCheck)?.overall_score||0)*100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${Math.round(((realtimeQuality||qualityCheck)?.overall_score||0)*100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips sidebar */}
      {showGuide && !error && !loading && (
        <div className="absolute left-6 safe-left top-1/2 -translate-y-1/2 max-w-xs bg-black/60 backdrop-blur-md rounded p-6 text-white z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h3 className="font-bold text-lg">Mẹo chụp ảnh chất lượng</h3>
          </div>
          
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Ánh sáng tự nhiên hoặc đèn trắng đủ sáng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Giữ camera ổn định, không rung lắc</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Chụp cận cảnh vùng da rõ nét</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Tránh bóng mờ che khuất</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
              <span>Đặt camera vuông góc với da</span>
            </li>
          </ul>
          
          <button
            onClick={() => setShowGuide(false)}
            className="mt-4 text-xs text-gray-300 hover:text-white underline"
          >
            Ẩn hướng dẫn
          </button>
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
              <Lightbulb className="w-6 h-6"/> 💡 Mẹo
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

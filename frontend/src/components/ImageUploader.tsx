import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// import './ImageUploader.css';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="font-semibold text-gray-700 mb-1" htmlFor="image-upload-input">{t('imageUploader.label')}</label>
      <div
        className={`w-full min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-150 cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm relative ${dragActive ? 'border-indigo-500 bg-indigo-100' : 'border-gray-300'} ${preview ? 'p-0' : 'p-6'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={t('imageUploader.placeholder')}
      >
        <input
          ref={inputRef}
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
          aria-label={t('imageUploader.label')}
        />
        {preview ? (
          <div className="w-full flex flex-col items-center gap-2">
            <img src={preview} alt={t('imageUploader.label')} className="max-h-40 rounded-lg shadow-md border border-gray-200 object-contain" />
            <p className="text-xs text-gray-500">{t('imageUploader.placeholder')}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <svg className="w-10 h-10 text-indigo-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-700">{t('imageUploader.placeholder')}</p>
            <p className="text-xs text-gray-500">{t('imageUploader.support')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

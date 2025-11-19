'use client';

import { useRef, type ChangeEvent } from 'react';
import DoctorLetterIcon from '@/app/assets/icons/doctor-letter.svg';

interface DocumentAttachmentProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

export default function DocumentAttachment({
  onFileSelect,
  className = '',
}: DocumentAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
      // Reset the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-xl bg-white px-4 py-8 cursor-pointer transition-all hover:bg-neutral-50 ${className}`}
    >
      {/* SVG Border with custom dash pattern */}
      <svg
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ width: '100%', height: '100%' }}
      >
        <rect
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          rx="12"
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="1"
          strokeDasharray="12 6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <input
        ref={fileInputRef}
        id="file-upload-input"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Icon - The SVG already includes the plus overlay */}
      <div className="flex items-center justify-center">
        <DoctorLetterIcon className="h-10 w-10" />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center">
        <p className="text-sm font-medium text-neutral-600">
          Click to upload files
        </p>
        <p className="text-xs font-medium text-neutral-400">
          PDF format, up to 5 MB
        </p>
      </div>
    </div>
  );
}

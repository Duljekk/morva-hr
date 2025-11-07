'use client';

import React from 'react';
import FilePdfIcon from '@/app/assets/icons/file-pdf.svg';

interface UploadedFileProps {
  fileName: string;
  fileSize: string;
  onRemove?: () => void;
  className?: string;
}

export default function UploadedFile({
  fileName,
  fileSize,
  onRemove,
  className = '',
}: UploadedFileProps) {
  return (
    <div className={`flex items-start overflow-visible shrink-0 ${className}`}>
      {/* File Container */}
      <div
        className="flex items-center gap-1.5 border border-neutral-100 bg-white overflow-visible"
        style={{
          paddingLeft: '4px',
          paddingRight: '10px',
          paddingTop: '8px',
          paddingBottom: '8px',
          borderRadius: '8px',
        }}
      >
        {/* PDF Icon */}
        <div className="flex-shrink-0">
          <FilePdfIcon className="h-8 w-8" />
        </div>

        {/* File Info */}
        <div className="flex flex-col pr-[2px]">
          <p className="text-xs font-medium text-neutral-500 leading-4 whitespace-nowrap">
            {fileName}
          </p>
          <p className="text-xs font-medium text-neutral-300 leading-4">
            {fileSize}
          </p>
        </div>
      </div>

      {/* Close Button */}
      {onRemove && (
        <div className="flex items-center justify-center -ml-[10px] -mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-white border border-neutral-100 hover:bg-neutral-50 transition-colors p-[3px]"
            aria-label="Remove file"
          >
            <svg
              className="h-3 w-3 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}


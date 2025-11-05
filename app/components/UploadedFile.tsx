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
    <div
      className={`relative flex items-start gap-1.5 border border-neutral-100 bg-white ${className}`}
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
      <div className="flex flex-1 flex-col min-w-0 pr-8">
        <p className="text-xs font-medium text-neutral-500 truncate leading-tight">
          {fileName}
        </p>
        <p className="text-xs font-medium text-neutral-300 leading-tight">
          {fileSize}
        </p>
      </div>

      {/* Close Button - Positioned in top-right */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors"
          aria-label="Remove file"
        >
          <svg
            className="h-3.5 w-3.5 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}


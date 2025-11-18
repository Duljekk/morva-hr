'use client';

import React from 'react';
import Lottie from 'lottie-react';
import FilePdfIcon from '@/app/assets/icons/file-pdf.svg';
import loaderAnimation from '@/app/assets/animations/loader.json';

interface UploadedFileProps {
  fileName: string;
  fileSize: string;
  onRemove?: () => void;
  className?: string;
  isUploading?: boolean;
}

export default function UploadedFile({
  fileName,
  fileSize,
  onRemove,
  className = '',
  isUploading = false,
}: UploadedFileProps) {
  return (
    <div className={`flex items-start overflow-visible shrink-0 ${className}`}>
      {/* File Container */}
    <div
        className="flex items-center gap-1.5 border border-neutral-100 bg-white overflow-visible"
      style={{
          paddingLeft: '6px',
        paddingRight: '10px',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '8px',
          maxWidth: '156px',
      }}
    >
      {/* PDF Icon */}
      <div className="flex-shrink-0">
        <FilePdfIcon className="h-8 w-8" />
      </div>

      {/* File Info */}
        <div className="flex flex-col flex-1 min-w-0 pr-[2px]">
          <p className="text-xs font-medium text-neutral-600 leading-4 whitespace-nowrap overflow-hidden text-ellipsis w-full">
          {fileName}
        </p>
          
          {isUploading ? (
            <div className="flex items-center gap-0.5">
              {/* Lottie Loader */}
              <div className="h-3 w-3">
                <Lottie 
                  animationData={loaderAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: 12, height: 12 }}
                />
              </div>
              <p className="text-xs font-medium text-neutral-400 leading-4 whitespace-nowrap">
                Uploading...
              </p>
            </div>
          ) : (
            <p className="text-xs font-medium text-neutral-400 leading-4 whitespace-nowrap">
          {fileSize}
        </p>
          )}
        </div>
      </div>

      {/* Close Button - Hidden during upload */}
      {onRemove && !isUploading && (
        <div className="flex items-center justify-center -ml-[10px] -mt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
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


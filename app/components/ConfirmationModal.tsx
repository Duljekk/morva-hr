'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ButtonLarge from './ButtonLarge';
import useLockBodyScroll from '../hooks/useLockBodyScroll';

// Lazy load SVG icon - only load when modal is open
const WarningModalIcon = dynamic(() => import('@/app/assets/icons/warning-modal.svg'), {
  ssr: false,
});

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  shiftEndTime?: string;
  earlyDuration?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  shiftEndTime,
  earlyDuration,
  confirmText = 'Check Out',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  useLockBodyScroll(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-[354px] bg-white flex flex-col gap-3"
        style={{
          borderRadius: '14px',
          paddingTop: '24px',
          paddingBottom: '20px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxShadow: '0px 2px 8px 0px rgba(28,28,28,0.12), 0px 0px 4px 0px rgba(28,28,28,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon - Lazy loaded */}
        <div className="shrink-0">
          <WarningModalIcon className="h-10 w-10" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[18px] md:gap-[18px]">
          {/* Title and Message */}
          <div className="flex flex-col gap-1 md:gap-1">
            <h2 className="text-lg font-semibold text-neutral-700 leading-7 tracking-[-0.18px]">
              {title}
            </h2>
            
            {shiftEndTime && earlyDuration && (
              <div className="text-base text-neutral-500 tracking-[-0.16px] leading-6">
                {/* Mobile: Natural text wrapping */}
                <p className="md:hidden">
                  <span className="font-normal">Your shift ends at </span>
                  <span className="font-semibold">{shiftEndTime}.</span>
                  <span className="font-normal"> If you check out now, you'll be </span>
                  <span className="font-semibold">{earlyDuration}</span>
                  <span className="font-normal"> early.</span>
                </p>
                {/* Desktop: Original layout with flex */}
                <div className="hidden md:flex items-center gap-1 flex-wrap">
                  <span className="font-normal leading-6">Your shift ends at</span>
                  <span className="font-semibold leading-5">{shiftEndTime}</span>
                  <span className="font-normal leading-6">If you check out</span>
                </div>
                <div className="hidden md:flex items-center gap-1 flex-wrap">
                  <span className="font-normal leading-6">now, you'll be</span>
                  <span className="font-semibold leading-5">{earlyDuration}</span>
                  <span className="font-normal leading-6">early.</span>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <ButtonLarge onClick={handleConfirm} variant="primary">
              {confirmText}
            </ButtonLarge>
            <button
              onClick={onClose}
              className="h-12 px-5 py-1.5 rounded-[14px] flex items-center justify-center transition-colors hover:bg-neutral-50"
            >
              <span className="text-base font-semibold text-neutral-600 tracking-[-0.16px]">
                {cancelText}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


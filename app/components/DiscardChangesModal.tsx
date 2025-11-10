'use client';

import { useEffect } from 'react';
import ButtonLarge from './ButtonLarge';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import NeutralModalIcon from '@/app/assets/icons/neutral-modal.svg';

interface DiscardChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
}

export default function DiscardChangesModal({
  isOpen,
  onClose,
  onDiscard,
}: DiscardChangesModalProps) {
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

  const handleDiscard = () => {
    onDiscard();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="mx-6 w-full max-w-[354px] bg-white flex flex-col gap-3"
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
        {/* Neutral Icon */}
        <div className="shrink-0">
          <NeutralModalIcon className="h-10 w-10" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[18px]">
          {/* Title and Message */}
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-neutral-700 leading-7 tracking-[-0.18px]">
              Discard Changes?
            </h2>
            <p className="text-base font-normal text-neutral-500 leading-6 tracking-[-0.16px]">
              This request isn't finished. All your information will be lost if you leave.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <ButtonLarge onClick={handleDiscard} variant="primary">
              Discard
            </ButtonLarge>
            <button
              onClick={onClose}
              className="h-12 px-5 py-1.5 rounded-[14px] flex items-center justify-center transition-colors hover:bg-neutral-50"
            >
              <span className="text-base font-semibold text-neutral-600 tracking-[-0.16px]">
                Keep Editing
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


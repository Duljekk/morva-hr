'use client';

import { useEffect, SVGProps } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonLarge from '@/components/shared/ButtonLarge';
import useLockBodyScroll from '@/app/hooks/useLockBodyScroll';
import { backdropVariants, modalVariants } from '@/app/lib/animations/modalVariants';

// Lazy load SVG icon - only load when modal is open
const WarningModalIcon = dynamic<SVGProps<SVGSVGElement>>(() => import('@/app/assets/icons/warning-modal.svg'), {
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
          onClick={handleBackdropClick}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className="w-full max-w-[354px] bg-white flex flex-col gap-3 mx-auto"
            style={{
              borderRadius: '14px',
              paddingTop: '24px',
              paddingBottom: '20px',
              paddingLeft: '20px',
              paddingRight: '20px',
              boxShadow: '0px 2px 8px 0px rgba(28,28,28,0.12), 0px 0px 4px 0px rgba(28,28,28,0.06)',
              transformOrigin: 'center center',
            }}
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
        {/* Warning Icon - Lazy loaded */}
        <div className="shrink-0">
          <WarningModalIcon className="h-10 w-10" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[18px] md:gap-[18px]">
          {/* Title and Message */}
          <div className="flex flex-col gap-1 md:gap-1">
            <h2 className="text-lg font-semibold text-neutral-700 leading-bold-lg">
              {title}
            </h2>
            
            {shiftEndTime && earlyDuration && (
              <div className="text-base font-normal text-neutral-500 leading-regular-base">
                {/* Mobile: Natural text wrapping */}
                <p className="md:hidden">
                  <span>Your shift ends at </span>
                  <span className="font-semibold leading-bold-base">{shiftEndTime}.</span>
                  <span> If you check out now, you'll be </span>
                  <span className="font-semibold leading-bold-base">{earlyDuration}</span>
                  <span> early.</span>
                </p>
                {/* Desktop: Original layout with flex */}
                <div className="hidden md:flex items-center gap-1 flex-wrap">
                  <span>Your shift ends at</span>
                  <span className="font-semibold leading-bold-base">{shiftEndTime}</span>
                  <span>If you check out</span>
                </div>
                <div className="hidden md:flex items-center gap-1 flex-wrap">
                  <span>now, you'll be</span>
                  <span className="font-semibold leading-bold-base">{earlyDuration}</span>
                  <span>early.</span>
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
              <span className="text-base font-semibold text-neutral-600 leading-bold-base">
                {cancelText}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}


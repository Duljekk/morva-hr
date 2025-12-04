'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLockBodyScroll from '@/app/hooks/useLockBodyScroll';
import { backdropVariants, modalVariants } from '@/app/lib/animations/modalVariants';
import { BellIcon } from '@/components/icons';
import FormInput from '@/components/shared/FormInput';

interface RejectLeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called with the rejection reason when the user confirms.
   * The dialog itself does not reset server state.
   */
  onConfirm: (reason: string) => void;
  /**
   * Employee name to personalize the title.
   * When not provided, a generic title will be used.
   */
  employeeName?: string;
}

/**
 * RejectLeaveRequestDialog (HR Dashboard)
 *
 * Modal dialog for rejecting a leave request, based on Figma frame 476:900 "Reject Request Dialog".
 * - Illustration: bell icon inside a sky-100 rounded square
 * - Title: "Reject {name} leave request?"
 * - Body: explanatory text about notifying the employee
 * - Input: single-line text field for brief reason
 * - Buttons: Cancel (secondary), Reject Request (primary / destructive)
 */
export default function RejectLeaveRequestDialog({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}: RejectLeaveRequestDialogProps) {
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setTouched(false);
    }
  }, [isOpen]);

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

  const trimmedReason = reason.trim();
  const isReasonValid = trimmedReason.length > 0;

  const handleConfirm = () => {
    setTouched(true);
    if (!isReasonValid) return;
    onConfirm(trimmedReason);
  };

  const title = employeeName
    ? `Reject ${employeeName} leave request?`
    : 'Reject leave request?';

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
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="w-full max-w-[382px] bg-white flex flex-col gap-3 mx-auto"
            style={{
              borderRadius: 16,
              paddingTop: 24,
              paddingBottom: 20,
              paddingLeft: 20,
              paddingRight: 20,
              boxShadow:
                '0px 2px 8px 0px rgba(28,28,28,0.12), 0px 0px 4px 0px rgba(28,28,28,0.06)',
              transformOrigin: 'center center',
            }}
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Illustration */}
            <div className="bg-[#dff2fe] rounded-[8px] shrink-0 w-10 h-10 flex items-center justify-center">
              <BellIcon className="w-5 h-5 text-[#0069a8]" />
            </div>

            {/* Content + Form + Buttons */}
            <div className="flex flex-col gap-[14px] w-full">
              {/* Content + Form */}
              <div className="flex flex-col gap-[14px] w-full">
                {/* Title + Body */}
                <div className="flex flex-col gap-[6px] w-full">
                  <p className="font-semibold text-lg leading-[22px] text-neutral-700">
                    {title}
                  </p>
                  <p className="text-sm md:text-base text-neutral-500 leading-[24px]">
                    This will <span className="font-semibold">notify</span> the employee.
                    {' '}Your reason will be{' '}
                    <span className="font-semibold">recorded and visible</span> to them.
                  </p>
                </div>

                {/* Reason Input - matches FormInput behavior from Login/Employee app */}
                <FormInput
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Please provide a brief reason"
                  bgColor="white"
                  aria-label="Rejection reason"
                />
                {touched && !isReasonValid && (
                  <p className="text-xs text-red-600 mt-1">
                    Please provide a brief reason for rejecting this request.
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 px-5 py-1.5 rounded-[8px] flex items-center justify-center hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-neutral-600 leading-[18px]">
                    Cancel
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!isReasonValid}
                  className="flex-1 h-10 px-5 py-1.5 rounded-[8px] flex items-center justify-center bg-neutral-800 text-white text-sm font-semibold leading-[18px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-900 transition-colors"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



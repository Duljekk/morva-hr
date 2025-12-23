'use client';

import { useEffect, SVGProps } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import useLockBodyScroll from '@/app/hooks/useLockBodyScroll';
import {
  backdropVariants,
  modalVariants,
} from '@/app/lib/animations/modalVariants';

// Lazy load SVG icon - only load when modal is open
const NeutralModalIcon = dynamic<SVGProps<SVGSVGElement>>(
  () => import('@/app/assets/icons/neutral-modal.svg'),
  { ssr: false }
);

interface SetWFCConfirmationModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback when the modal is closed (Cancel button or backdrop click)
   */
  onClose: () => void;

  /**
   * Callback when the user confirms the WFC selection
   */
  onConfirm: () => void;

  /**
   * Name of the location being selected (e.g., "Prompt Space")
   */
  locationName: string;

  /**
   * Whether the confirm action is loading
   */
  isLoading?: boolean;
}

/**
 * SetWFCConfirmationModal
 *
 * Confirmation dialog shown when user selects a non-primary location (not Office/HQ).
 * Informs the user that selecting this location will set today's work mode to WFC.
 *
 * Based on Figma design node 741:2091 "[Overlay] Set WFC"
 *
 * Layout specifications:
 * - Container: 382px width, rounded 14px, white background
 * - Padding: 24px top, 20px sides and bottom
 * - Gap between icon and content: 12px
 * - Gap between title/body and buttons: 18px
 * - Buttons: 40px height, 8px border radius, equal width with 8px gap
 */
export default function SetWFCConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  locationName,
  isLoading = false,
}: SetWFCConfirmationModalProps) {
  useLockBodyScroll(isOpen);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  // Handle confirm action
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
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
            className="w-full max-w-[382px] bg-white flex flex-col gap-3 mx-auto"
            style={{
              borderRadius: '14px',
              paddingTop: '24px',
              paddingBottom: '20px',
              paddingLeft: '20px',
              paddingRight: '20px',
              boxShadow:
                '0px 2px 8px 0px rgba(28,28,28,0.12), 0px 0px 4px 0px rgba(28,28,28,0.06)',
              transformOrigin: 'center center',
            }}
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wfc-modal-title"
            aria-describedby="wfc-modal-description"
          >
            {/* Illustration/Icon - 40x40 */}
            <div className="shrink-0">
              <NeutralModalIcon className="h-10 w-10" />
            </div>

            {/* Content + Buttons */}
            <div className="flex flex-col gap-[18px]">
              {/* Contents - Title + Body */}
              <div className="flex flex-col gap-1">
                {/* Title */}
                <h2
                  id="wfc-modal-title"
                  className="font-['Mona_Sans'] text-lg font-semibold leading-[22px] text-neutral-700"
                >
                  Set today as WFC?
                </h2>

                {/* Body */}
                <p
                  id="wfc-modal-description"
                  className="font-['Mona_Sans'] text-base font-normal leading-6 text-neutral-500"
                >
                  Selecting{' '}
                  <span className="font-semibold leading-5">{locationName}</span>{' '}
                  will set today&apos;s work mode to Work from Cafe (WFC).
                </p>
              </div>

              {/* Buttons - Cancel and Set as WFC */}
              <div className="flex gap-2 items-center w-full">
                {/* Cancel Button - Ghost/Secondary */}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="
                    flex-1 h-10 px-5 py-1.5
                    rounded-lg
                    flex items-center justify-center
                    transition-colors
                    hover:bg-neutral-50
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <span className="font-['Mona_Sans'] text-sm font-semibold leading-[18px] text-neutral-600 text-center">
                    Cancel
                  </span>
                </button>

                {/* Set as WFC Button - Primary */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="
                    flex-1 h-10 px-5 py-1.5
                    bg-neutral-800 hover:bg-neutral-700
                    rounded-lg
                    flex items-center justify-center
                    transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <span className="font-['Mona_Sans'] text-sm font-semibold leading-[18px] text-white text-center">
                    {isLoading ? 'Setting...' : 'Set as WFC'}
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

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLockBodyScroll from '@/app/hooks/useLockBodyScroll';
import {
  backdropVariants,
  modalVariants,
} from '@/app/lib/animations/modalVariants';
import { TriangleWarningIcon } from '@/components/icons';

export interface DeleteEmployeeModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Callback when the modal is closed (Cancel button or backdrop click)
   */
  onClose: () => void;

  /**
   * Callback when the user confirms the deletion
   */
  onConfirm: () => void;

  /**
   * Name of the employee being deleted
   */
  employeeName: string;

  /**
   * Whether the confirm action is loading
   */
  isLoading?: boolean;
}

/**
 * DeleteEmployeeModal
 *
 * Confirmation dialog shown when user attempts to delete an employee.
 * Requires typing the employee's full name to confirm deletion.
 *
 * Based on Figma design node 752:1771 "Reject Request Dialog"
 *
 * Layout specifications:
 * - Container: 382px width, rounded 16px, white background
 * - Padding: 24px top, 20px sides and bottom
 * - Gap between icon and content: 12px
 * - Gap between content sections: 20px
 * - Buttons: 40px height, 8px border radius, equal width with 8px gap
 * - Icon: 40x40 red circle with warning triangle
 */
export default function DeleteEmployeeModal({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
  isLoading = false,
}: DeleteEmployeeModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  
  useLockBodyScroll(isOpen);

  // Reset confirmation text when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmationText('');
    }
  }, [isOpen]);

  // Check if confirmation text matches employee name (case-sensitive, exact match)
  const isConfirmationValid = confirmationText.trim() === employeeName.trim();

  // Handle confirm action
  const handleConfirm = () => {
    if (!isLoading && isConfirmationValid) {
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="w-full max-w-[382px] bg-white flex flex-col gap-3 mx-auto"
            style={{
              borderRadius: '16px',
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
            aria-labelledby="delete-employee-modal-title"
            aria-describedby="delete-employee-modal-description"
          >
            {/* Danger Icon - 40x40 red circle with warning triangle (same as RejectLeaveRequestDialog) */}
            <div
              className="bg-[#e7000b] rounded-[99px] shrink-0 w-10 h-10 flex items-center justify-center"
              data-name="Icon"
            >
              <TriangleWarningIcon size={28} className="text-white" />
            </div>

            {/* Content + Form + Buttons */}
            <div className="flex flex-col gap-5 w-full">
              {/* Content + Form */}
              <div className="flex flex-col gap-3 w-full">
                {/* Contents - Title + Body */}
                <div className="flex flex-col gap-1 w-full">
                  {/* Title */}
                  <h2
                    id="delete-employee-modal-title"
                    className="font-semibold text-lg leading-[22px] text-neutral-700"
                  >
                    Delete employee record?
                  </h2>

                  {/* Body */}
                  <p
                    id="delete-employee-modal-description"
                    className="text-base font-normal leading-6 text-neutral-500"
                  >
                    This will permanently delete{' '}
                    <span className="font-semibold leading-5">{employeeName}</span>{' '}
                    and all associated records. This action can&apos;t be undone.
                  </p>
                </div>

                {/* Form Input */}
                <div className="w-full">
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type the employee's full name to confirm"
                    disabled={isLoading}
                    className="
                      w-full h-10 px-3 py-2.5
                      border border-neutral-100 rounded-[10px]
                      text-sm font-normal leading-5 text-neutral-700
                      placeholder:text-neutral-500
                      focus:outline-none focus:border-neutral-300 focus:ring-1 focus:ring-neutral-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors
                    "
                    aria-label="Type employee name to confirm deletion"
                  />
                </div>
              </div>

              {/* Buttons - Cancel and Delete Employee */}
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
                  <span className="text-sm font-semibold leading-[18px] text-neutral-600 text-center">
                    Cancel
                  </span>
                </button>

                {/* Delete Employee Button - Primary Dark */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isLoading || !isConfirmationValid}
                  className="
                    flex-1 h-10 px-5 py-1.5
                    bg-neutral-800 hover:bg-neutral-700
                    rounded-lg
                    flex items-center justify-center
                    transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <span className="text-sm font-semibold leading-[18px] text-white text-center">
                    {isLoading ? 'Deleting...' : 'Delete Employee'}
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

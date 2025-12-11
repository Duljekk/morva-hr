'use client';

import { useEffect, SVGProps } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import useLockBodyScroll from '@/app/hooks/useLockBodyScroll';
import { backdropVariants, modalVariants } from '@/app/lib/animations/modalVariants';

interface HRLeaveRequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;

  // Leave request details (same shape as employee modal)
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  status: 'pending' | 'approved' | 'rejected';
  requestedOn: string; // ISO date string (YYYY-MM-DD)
  requestedAt?: string; // ISO timestamp string (for time)
  approvedAt?: string; // ISO timestamp string (for approved/rejected time)
  rejectionReason?: string; // Rejection reason if rejected
  leaveType: string;
  reason: string;

  // HR actions
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
}

// Lazy load the same arrow icon used in the employee LeaveRequestDetailsModal
const ArrowCalendarIcon = dynamic<SVGProps<SVGSVGElement>>(
  () => import('@/app/assets/icons/arrow-calendar.svg'),
  { ssr: false }
);

const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * HRLeaveRequestDetailsDialog
 *
 * HR-focused variant of the Leave Request Details dialog.
 * Reuses the same layout and content as the employee dialog, but replaces
 * the bottom Status Timeline section with primary actions:
 * - Reject (secondary)
 * - Approve (primary)
 *
 * Based on Figma:
 * - Dialog: rounded 14px, white, shadow, centered
 * - Bottom action section: border-top divider, 16px top padding, 20px side padding
 * - Buttons: 40px height, 8px border radius, equal width
 */
export default function HRLeaveRequestDetailsDialog({
  isOpen,
  onClose,
  startDate,
  endDate,
  status,
  requestedOn,
  requestedAt,
  approvedAt,
  rejectionReason,
  leaveType,
  reason,
  onApprove,
  onReject,
  disabled = false,
}: HRLeaveRequestDetailsDialogProps) {
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

  // Format date for display (day number and month)
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    const day = date.getDate();
    const month = shortMonthNames[date.getMonth()];
    return { day, month };
  };

  // Format full date like "Nov 12, 2025"
  const formatFullDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const startDateDisplay = formatDateDisplay(startDate);
  const endDateDisplay = formatDateDisplay(endDate);

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
            className="w-full max-w-[354px] bg-white flex flex-col rounded-[14px] overflow-hidden mx-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                '0px 2px 8px 0px rgba(28,28,28,0.12), 0px 0px 4px 0px rgba(28,28,28,0.06)',
              transformOrigin: 'center center',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pl-5 pr-[14px] py-4">
              <h2 className="text-base font-semibold text-neutral-800 leading-bold-base">
                Leave Request Details
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-6 h-6 shrink-0"
                aria-label="Close"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-neutral-500"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col px-0 py-4">
              {/* Date Range */}
              <div className="flex items-end gap-4 px-5 mb-3">
                {/* From Date */}
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-sm font-semibold text-neutral-800 leading-bold-sm">
                    From
                  </p>
                  <div className="bg-white border border-neutral-100 rounded-2xl overflow-clip">
                    <div className="flex flex-col items-center px-4 py-3 rounded-[inherit] w-full">
                      <div className="flex flex-col gap-2 items-start justify-center pl-0 pr-6 py-0 shrink-0 w-full">
                        <div className="flex flex-col items-start text-nowrap whitespace-pre">
                          <p className="text-[30px] font-bold leading-bold-30 text-neutral-800">
                            {startDateDisplay.day}
                          </p>
                          <p className="text-base font-semibold leading-bold-base text-[#fb2c36]">
                            {startDateDisplay.month}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col gap-[10px] items-center justify-center h-[78px] w-6 shrink-0">
                  <ArrowCalendarIcon className="h-[13px] w-[21px]" />
                </div>

                {/* Until Date */}
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-sm font-semibold text-neutral-800 leading-bold-sm">
                    Until
                  </p>
                  <div className="bg-white border border-neutral-100 rounded-2xl overflow-clip">
                    <div className="flex flex-col items-center px-4 py-3 rounded-[inherit] w-full">
                      <div className="flex flex-col gap-2 items-start justify-center pl-0 pr-6 py-0 shrink-0 w-full">
                        <div className="flex flex-col items-start text-nowrap whitespace-pre">
                          <p className="text-[30px] font-bold leading-bold-30 text-neutral-800">
                            {endDateDisplay.day}
                          </p>
                          <p className="text-base font-semibold leading-bold-base text-[#fb2c36]">
                            {endDateDisplay.month}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Information and Reason Group */}
              <div className="flex flex-col gap-1.5">
                {/* Leave Information */}
                <div className="flex flex-col gap-1 px-5">
                  {/* Requested On */}
                  <div className="flex items-center gap-0.5 h-6">
                    <p className="text-sm font-semibold text-neutral-800 leading-bold-sm w-[124px] shrink-0">
                      Requested On
                    </p>
                    <div className="flex-1 px-2">
                      <p className="text-sm font-normal text-neutral-600 leading-regular-sm">
                        {formatFullDate(requestedOn)}
                      </p>
                    </div>
                  </div>

                  {/* Leave Type */}
                  <div className="flex items-center gap-0.5 h-6">
                    <p className="text-sm font-semibold text-neutral-800 leading-bold-sm w-[124px] shrink-0">
                      Leave Type
                    </p>
                    <div className="flex-1 px-2">
                      <p className="text-sm font-normal text-neutral-600 leading-regular-sm">
                        {leaveType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="border-l-2 border-neutral-400 px-5">
                  <p className="text-sm font-normal text-neutral-600 leading-regular-sm">
                    "{reason}"
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons Section (HR-only) */}
            <div className="flex flex-col pb-5 px-5">
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={onReject}
                  disabled={disabled}
                  className="flex-1 h-10 px-5 py-1.5 rounded-[8px] flex items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-semibold text-neutral-600 leading-[18px]">
                    Reject
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onApprove}
                  disabled={disabled}
                  className="flex-1 h-10 px-5 py-1.5 rounded-[8px] flex items-center justify-center bg-neutral-800 text-white text-sm font-semibold leading-[18px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-900 transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


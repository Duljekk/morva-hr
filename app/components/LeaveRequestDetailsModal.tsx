'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import LeaveRequestStatusTimeline, { StatusItem } from './LeaveRequestStatusTimeline';

// Lazy load SVG icon - only load when modal is open
const ArrowCalendarIcon = dynamic(() => import('@/app/assets/icons/arrow-calendar.svg'), {
  ssr: false,
});

interface LeaveRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  status: 'pending' | 'approved' | 'rejected';
  requestedOn: string; // ISO date string (YYYY-MM-DD)
  requestedAt?: string; // ISO timestamp string (for time)
  approvedAt?: string; // ISO timestamp string (for approved/rejected time)
  rejectionReason?: string; // Rejection reason if rejected
  leaveType: string;
  reason: string;
}

const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function LeaveRequestDetailsModal({
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
}: LeaveRequestDetailsModalProps) {
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

  // Format date for display (day number and month)
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDate();
    const month = shortMonthNames[date.getMonth()];
    return { day, month };
  };

  // Format full date like "Nov 12, 2025"
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const startDateDisplay = formatDateDisplay(startDate);
  const endDateDisplay = formatDateDisplay(endDate);

  // Format time like "09.00 AM" or "10.00 PM"
  const formatTime = (timestamp?: string): string => {
    if (!timestamp) return '09.00 AM'; // Default fallback
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = String(hours % 12 || 12).padStart(2, '0');
    const displayMinutes = String(minutes).padStart(2, '0');
    return `${displayHours}.${displayMinutes} ${ampm}`;
  };

  // Build status history based on current status
  const buildStatusHistory = (): StatusItem[] => {
    const history: StatusItem[] = [];
    const requestedDate = requestedOn;
    const requestedTime = formatTime(requestedAt);

    if (status === 'rejected') {
      // Rejected: Rejected → Awaiting Approval → Requested
      const approvedDate = approvedAt ? approvedAt.split('T')[0] : requestedDate;
      const approvedTime = formatTime(approvedAt);
      
      history.push({
        label: 'Rejected',
        date: approvedDate,
        time: approvedTime,
        reason: rejectionReason || 'Dates conflict with office agenda.',
      });
      history.push({
        label: 'Awaiting Approval',
        date: requestedDate,
        time: requestedTime,
      });
      history.push({
        label: 'Requested',
        date: requestedDate,
        time: requestedTime,
      });
    } else if (status === 'approved') {
      // Approved: Accepted → Awaiting Approval → Requested
      const approvedDate = approvedAt ? approvedAt.split('T')[0] : requestedDate;
      const approvedTime = formatTime(approvedAt);
      
      history.push({
        label: 'Accepted',
        date: approvedDate,
        time: approvedTime,
      });
      history.push({
        label: 'Awaiting Approval',
        date: requestedDate,
        time: requestedTime,
      });
      history.push({
        label: 'Requested',
        date: requestedDate,
        time: requestedTime,
      });
    } else {
      // Pending: Awaiting Approval → Requested
      history.push({
        label: 'Awaiting Approval',
        date: requestedDate,
        time: requestedTime,
      });
      history.push({
        label: 'Requested',
        date: requestedDate,
        time: requestedTime,
      });
    }

    return history;
  };

  const statusHistory = buildStatusHistory();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-[354px] bg-white flex flex-col rounded-[14px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0px 2px 8px 0px rgba(28,28,28,0.12), 0px 0px 4px 0px rgba(28,28,28,0.06)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pl-5 pr-[14px] py-4">
          <h2 className="text-base font-semibold text-neutral-800 leading-5 tracking-[-0.16px]">
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
              <p className="text-sm font-semibold text-neutral-800 leading-[18px] tracking-[-0.07px]">
                From
              </p>
              <div className="bg-white border border-neutral-100 rounded-2xl overflow-clip">
                <div className="flex flex-col items-center px-4 py-3 rounded-[inherit] w-full">
                  <div className="flex flex-col gap-2 items-start justify-center pl-0 pr-6 py-0 shrink-0 w-full">
                    <div className="flex flex-col items-start text-nowrap whitespace-pre">
                      <p className="text-[30px] font-bold leading-[34px] text-neutral-800 tracking-[-0.3px]">
                        {startDateDisplay.day}
                      </p>
                      <p className="text-base font-semibold leading-5 tracking-[-0.16px] text-[#fb2c36]">
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
              <p className="text-sm font-semibold text-neutral-800 leading-[18px] tracking-[-0.07px]">
                Until
              </p>
              <div className="bg-white border border-neutral-100 rounded-2xl overflow-clip">
                <div className="flex flex-col items-center px-4 py-3 rounded-[inherit] w-full">
                  <div className="flex flex-col gap-2 items-start justify-center pl-0 pr-6 py-0 shrink-0 w-full">
                    <div className="flex flex-col items-start text-nowrap whitespace-pre">
                      <p className="text-[30px] font-bold leading-[34px] text-neutral-800 tracking-[-0.3px]">
                        {endDateDisplay.day}
                      </p>
                      <p className="text-base font-semibold leading-5 tracking-[-0.16px] text-[#fb2c36]">
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
                <p className="text-sm font-semibold text-neutral-800 leading-[18px] tracking-[-0.07px] w-[124px] shrink-0">
                  Requested On
                </p>
                <div className="flex-1 px-2">
                  <p className="text-sm font-normal text-neutral-600 leading-5 tracking-[-0.07px]">
                    {formatFullDate(requestedOn)}
                  </p>
                </div>
              </div>

              {/* Leave Type */}
              <div className="flex items-center gap-0.5 h-6">
                <p className="text-sm font-semibold text-neutral-800 leading-[18px] tracking-[-0.07px] w-[124px] shrink-0">
                  Leave Type
                </p>
                <div className="flex-1 px-2">
                  <p className="text-sm font-normal text-neutral-600 leading-5 tracking-[-0.07px]">
                    {leaveType}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="border-l-2 border-neutral-400 px-5">
              <p className="text-sm font-normal text-neutral-600 leading-5 tracking-[-0.07px]">
                "{reason}"
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline Section */}
        <div className="border-t border-neutral-100 flex flex-col gap-2.5 pb-5 pt-4 px-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-800 leading-[18px] tracking-[-0.07px]">
              Status
            </p>
            <LeaveRequestStatusTimeline
              status={status}
              statusHistory={statusHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import React from 'react';
import PulseDangerIcon from '@/app/assets/icons/pulse-danger.svg';
import PulseProgressIcon from '@/app/assets/icons/pulse-progress.svg';
import PulseSuccessIcon from '@/app/assets/icons/pulse-success.svg';
import PulseNeutralIcon from '@/app/assets/icons/pulse-neutral.svg';

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export interface StatusItem {
  label: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string (e.g., "09.00 AM" or "10.00 PM")
  reason?: string; // Optional rejection reason (only for rejected status)
}

export interface LeaveRequestStatusTimelineProps {
  status: LeaveRequestStatus;
  statusHistory: StatusItem[];
  className?: string;
}

// Helper to format date like "Nov 12, 2025"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Get the appropriate pulse icon based on label and status context
const getPulseIcon = (label: string, status: LeaveRequestStatus): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
  if (label === 'Rejected') return PulseDangerIcon;
  if (label === 'Accepted' || label === 'Approved') return PulseSuccessIcon;
  if (label === 'Awaiting Approval') {
    // Use pulse-progress only in pending status variant, otherwise use pulse-neutral
    return status === 'pending' ? PulseProgressIcon : PulseNeutralIcon;
  }
  return PulseNeutralIcon; // Requested
};

// Timeline connector (dashed vertical line)
const TimelineConnector = ({ height = 'h-1' }: { height?: 'h-1' | 'h-8' }) => (
  <div className={`flex flex-col items-start pl-1.5 pr-0 py-0 shrink-0 w-full ${height}`}>
    <div className={`border-l border-dashed border-neutral-300 ${height} shrink-0 w-full`} />
  </div>
);

function LeaveRequestStatusTimeline({
  status,
  statusHistory,
  className = '',
}: LeaveRequestStatusTimelineProps) {
  // Render status item
  const renderStatusItem = (item: StatusItem, index: number, isLast: boolean, isFirst: boolean) => {
    const hasReason = item.reason && item.reason.trim() !== '';
    const PulseIcon = getPulseIcon(item.label, status);
    const isAwaitingApproval = item.label === 'Awaiting Approval';

    return (
      <React.Fragment key={index}>
        <div className="flex flex-col gap-0.5 items-start shrink-0 w-full">
          {/* Status Label with Icon */}
          <div className="flex gap-2 items-center shrink-0 h-[18px]">
            {isAwaitingApproval ? (
              // Awaiting Approval: simple relative positioning, no absolute
              <div className="relative shrink-0 size-3">
                <PulseIcon className="size-3" />
              </div>
            ) : isFirst ? (
              // First item (Rejected/Accepted): icon with absolute positioning
              <div className="h-[18px] relative shrink-0 w-3">
                <div className="absolute left-0 size-3 top-1/2 -translate-y-1/2">
                  <PulseIcon className="size-3" />
                </div>
              </div>
            ) : (
              // Requested: icon with absolute positioning
              <div className="h-[18px] relative shrink-0 w-3">
                <div className="absolute left-0 size-3 top-1/2 -translate-y-1/2">
                  <PulseIcon className="size-3" />
                </div>
              </div>
            )}
            <p className="text-sm font-medium text-neutral-800 leading-[18px] tracking-[-0.07px] whitespace-pre">
              {item.label}
            </p>
          </div>

          {/* Content Section */}
          {hasReason ? (
            // Rejected variant with reason
            <div className="flex flex-col items-start pl-1.5 pr-0 py-0 shrink-0 w-full">
              <div className="border-l border-dashed border-neutral-300 flex flex-col gap-3 items-start pb-3.5 pl-3.5 pr-0 pt-0 shrink-0 w-full">
                {/* Reason Text */}
                <p className="text-sm font-normal text-neutral-500 leading-5 tracking-[-0.07px]">
                  {item.reason}
                </p>
                {/* Timestamp */}
                <div className="flex gap-1 items-center shrink-0">
                  <p className="text-xs font-medium text-neutral-600 leading-4 whitespace-pre">
                    {formatDate(item.date)}
                  </p>
                  <p className="text-xs font-medium text-neutral-400 leading-4 whitespace-pre">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          ) : isAwaitingApproval ? (
            // Awaiting Approval: no content section, just label
            null
          ) : isFirst ? (
            // First item without reason (Accepted/Approved variant)
            <div className="flex flex-col items-start pb-0 pt-0.5 px-1.5 shrink-0 w-full">
              <div className="border-l border-dashed border-neutral-300 flex gap-1 items-center pb-3.5 pt-0 px-3.5 shrink-0 w-full h-[30px]">
                <p className="text-xs font-medium text-neutral-600 leading-4 whitespace-pre">
                  {formatDate(item.date)}
                </p>
                <p className="text-xs font-medium text-neutral-400 leading-4 whitespace-pre">
                  {item.time}
                </p>
              </div>
            </div>
          ) : (
            // Regular variant without reason (Requested)
            <div className="flex flex-col items-start px-1.5 py-0 shrink-0 w-full">
              <div className="flex gap-1 items-center px-3.5 py-0 shrink-0 w-full">
                <p className="text-xs font-medium text-neutral-600 leading-4 whitespace-pre">
                  {formatDate(item.date)}
                </p>
                <p className="text-xs font-medium text-neutral-400 leading-4 whitespace-pre">
                  {item.time}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Connector between items */}
        {!isLast && (
          <TimelineConnector height={isAwaitingApproval ? 'h-8' : 'h-1'} />
        )}
      </React.Fragment>
    );
  };

  return (
    <div className={`flex flex-col gap-0.5 items-start w-full ${className}`}>
      {statusHistory.map((item, index) =>
        renderStatusItem(item, index, index === statusHistory.length - 1, index === 0)
      )}
    </div>
  );
}

export default LeaveRequestStatusTimeline;


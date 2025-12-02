'use client';

import { memo } from 'react';
import { LeaveRequestsIcon } from '@/components/icons';
import ButtonIconOnly from './ButtonIconOnly';

export interface LeaveRequestItemProps {
  /**
   * Employee name (e.g., "Achmad Rafi")
   */
  name: string;

  /**
   * Leave date range (e.g., "25-26 Nov 2025")
   */
  dateRange: string;

  /**
   * Leave type (e.g., "Annual Leave")
   * Used for illustration background color
   * @default "Annual Leave"
   */
  leaveType?: string;

  /**
   * Callback when approve button is clicked
   */
  onApprove?: () => void;

  /**
   * Callback when reject button is clicked
   */
  onReject?: () => void;

  /**
   * Whether the buttons are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom icon component (overrides default LeaveRequestsIcon)
   */
  icon?: React.ReactNode;

  /**
   * Custom background color class (overrides default sky-100)
   */
  backgroundColor?: string;
}

/**
 * Leave Request Item Component
 *
 * Displays a single leave request item with employee name, date range,
 * and approve/reject action buttons.
 *
 * Figma specs (node 428:2770 "Leave Request Item"):
 * - Container: flex, items-center, full width (389px), height 40px
 * - Content + Illustration: flex, gap-14px, grow
 *   - Illustration: 40x40px, rounded-8px, sky-100 bg (#dff2fe)
 *   - Contents: flex-col, gap-2px
 *     - Title: text-sm/medium, neutral-700, leading-18px
 *     - Date: text-sm/medium, neutral-400, leading-18px
 * - Button Group: flex, gap-4px, shrink-0
 *   - Two ButtonIconOnly buttons (Approve and Reject)
 *
 * Uses the same illustration pattern as ActivityItem from Recent Activities section.
 *
 * @example
 * ```tsx
 * <LeaveRequestItem
 *   name="Achmad Rafi"
 *   dateRange="25-26 Nov 2025"
 *   onApprove={() => handleApprove(id)}
 *   onReject={() => handleReject(id)}
 * />
 * ```
 */
const LeaveRequestItem = memo(function LeaveRequestItem({
  name,
  dateRange,
  leaveType = 'Annual Leave',
  onApprove,
  onReject,
  disabled = false,
  className = '',
  icon,
  backgroundColor,
}: LeaveRequestItemProps) {
  // Use sky-100 background for leave requests (same as ActivityItem for 'leave' type)
  const displayBg = backgroundColor || 'bg-[#dff2fe]'; // sky-100 from Figma
  const displayIcon = icon || <LeaveRequestsIcon size={24} className="text-blue-600" />;

  return (
    <div
      className={`content-stretch flex items-center relative size-full ${className}`}
      data-name="Leave Request Item"
      data-node-id="428:2770"
    >
      {/* Content + Illustration */}
      <div
        className="basis-0 content-stretch flex gap-[14px] grow items-center min-h-px min-w-px relative shrink-0"
        data-name="Content + Illustration"
        data-node-id="428:2771"
      >
        {/* Illustration Container - 40x40px with rounded background */}
        <div
          className={`${displayBg} overflow-clip relative rounded-[8px] shrink-0 size-[40px] flex items-center justify-center`}
          data-name={`Illustration/${leaveType}`}
          data-node-id="428:2772"
        >
          {/* Icon centered - 24x24px */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            data-name="leave, calendar, time-off"
            data-node-id="I428:2772;71:1104"
          >
            {displayIcon}
          </div>
        </div>

        {/* Contents Section */}
        <div
          className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0"
          data-name="Contents"
          data-node-id="428:2773"
        >
          {/* Title */}
          <p
            className="font-medium leading-[18px] relative shrink-0 text-neutral-700 text-sm text-nowrap whitespace-pre w-full"
            data-name="Title"
            data-node-id="428:2774"
          >
            {name}
          </p>

          {/* Date */}
          <div
            className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full"
            data-name="Date"
            data-node-id="428:2775"
          >
            <p
              className="font-medium leading-[18px] relative shrink-0 text-neutral-400 text-sm text-nowrap whitespace-pre"
              data-node-id="428:2776"
            >
              {dateRange}
            </p>
          </div>
        </div>
      </div>

      {/* Button Group */}
      <div
        className="content-stretch flex gap-[4px] items-center relative shrink-0"
        data-name="Button Group"
        data-node-id="428:2777"
      >
        {/* Approve Button */}
        <ButtonIconOnly
          variant="Approve"
          onClick={onApprove}
          disabled={disabled}
          aria-label={`Approve leave request for ${name}`}
        />

        {/* Reject Button */}
        <ButtonIconOnly
          variant="Reject"
          onClick={onReject}
          disabled={disabled}
          aria-label={`Reject leave request for ${name}`}
        />
      </div>
    </div>
  );
});

LeaveRequestItem.displayName = 'LeaveRequestItem';

export default LeaveRequestItem;


'use client';

import { memo, useMemo } from 'react';
import LeaveIllustration, { type LeaveVariant } from './LeaveIllustration';
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
 * Map leave type string to LeaveIllustration variant
 */
function getLeaveVariant(leaveType: string): LeaveVariant {
  const normalizedType = leaveType.toLowerCase();
  
  if (normalizedType.includes('unpaid')) {
    return 'unpaid';
  }
  
  if (normalizedType.includes('sick')) {
    return 'sick';
  }
  
  // Default: Annual Leave or other types
  return 'annual';
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
 *   - Illustration: 40x40px, rounded-8px, background color based on leave type
 *     - Annual Leave: sky-100 (#dff2fe)
 *     - Unpaid Leave: amber-100 (#fef3c6)
 *     - Sick Leave: emerald-100 (#d0fae5)
 *   - Contents: flex-col, gap-2px
 *     - Title: text-sm/medium, neutral-700, leading-18px
 *     - Date: text-sm/medium, neutral-400, leading-18px
 * - Button Group: flex, gap-4px, shrink-0
 *   - Two ButtonIconOnly buttons (Approve and Reject)
 *
 * Uses LeaveIllustration component with SVG illustrations for each leave type.
 *
 * @example
 * ```tsx
 * <LeaveRequestItem
 *   name="Achmad Rafi"
 *   dateRange="25-26 Nov 2025"
 *   leaveType="Annual Leave"
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
  // Map leave type to illustration variant
  const leaveVariant = useMemo(() => getLeaveVariant(leaveType), [leaveType]);
  
  // Use custom icon if provided (for backward compatibility), otherwise use LeaveIllustration
  const displayIllustration = icon ? (
    <div className="size-[40px] flex items-center justify-center">
      {icon}
    </div>
  ) : (
    <LeaveIllustration variant={leaveVariant} size={40} />
  );

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
          className="shrink-0"
          data-name={`Illustration/${leaveType}`}
          data-node-id="428:2772"
        >
          {displayIllustration}
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


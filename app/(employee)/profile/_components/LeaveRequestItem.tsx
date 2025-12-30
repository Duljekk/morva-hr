'use client';

/**
 * Leave Request Item Component
 * 
 * Displays a single leave request with type icon, name, date range, and status badge.
 * 
 * Figma design: 788:1948
 */

import { memo } from 'react';
import Image from 'next/image';
import UnifiedBadge from '@/components/shared/UnifiedBadge';

// Import leave type icons from assets
import LeaveAnnualIcon from '@/app/assets/icons/leave-annual.svg';
import LeaveSickIcon from '@/app/assets/icons/leave-sick.svg';
import LeaveUnpaidIcon from '@/app/assets/icons/leave-unpaid.svg';
import LeaveWfhIcon from '@/app/assets/icons/leave-wfh.svg';

export interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'wfh' | 'unpaid';
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
  status: 'pending' | 'approved' | 'rejected';
  isHalfDay?: boolean;
}

export interface LeaveRequestItemProps {
  /**
   * The leave request data to display
   */
  request: LeaveRequest;
  
  /**
   * Whether this is the first item in the list
   */
  isFirst?: boolean;
  
  /**
   * Whether this is the last item in the list (no border bottom)
   */
  isLast?: boolean;
}

/**
 * Get the display label for a leave type
 */
const getLeaveTypeLabel = (type: LeaveRequest['type']): string => {
  const labels: Record<LeaveRequest['type'], string> = {
    annual: 'Annual Leave',
    sick: 'Sick Leave',
    wfh: 'Work from Home',
    unpaid: 'Unpaid Leave',
  };
  return labels[type];
};

/**
 * Get the icon component for a leave type
 */
const getLeaveTypeIcon = (type: LeaveRequest['type']) => {
  const icons: Record<LeaveRequest['type'], typeof LeaveAnnualIcon> = {
    annual: LeaveAnnualIcon,
    sick: LeaveSickIcon,
    wfh: LeaveWfhIcon,
    unpaid: LeaveUnpaidIcon,
  };
  return icons[type];
};

/**
 * Get the status badge color
 */
const getStatusBadgeColor = (status: LeaveRequest['status']): 'warning' | 'success' | 'danger' => {
  const colors: Record<LeaveRequest['status'], 'warning' | 'success' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  };
  return colors[status];
};

/**
 * Format the status text for display
 */
const formatStatusText = (status: LeaveRequest['status']): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Short month names for date formatting
 */
const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format date range for display
 * Examples: "22-23 Dec", "8 Dec (Full Day)", "1-2 Dec"
 */
const formatDateRange = (startDate: string, endDate: string, isHalfDay?: boolean): string => {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = shortMonthNames[start.getMonth()];
  const endMonth = shortMonthNames[end.getMonth()];
  
  // Same day
  if (startDate === endDate) {
    if (isHalfDay) {
      return `${startDay} ${startMonth} (Half Day)`;
    }
    return `${startDay} ${startMonth} (Full Day)`;
  }
  
  // Same month
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${startDay}-${endDay} ${startMonth}`;
  }
  
  // Different months
  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
};

/**
 * LeaveRequestItem Component
 * 
 * Specifications from Figma:
 * - Leave type icon: 36px, rounded-[9px], neutral-100 bg
 * - 10px gap between icon and content
 * - Leave type name: 14px medium, neutral-800
 * - Date range: 12px medium, neutral-400
 * - Status badge: UnifiedBadge with semibold font
 * - Border bottom (neutral-100) except for last item
 * - Padding: 14px vertical (first item has no top padding, last has no bottom)
 */
const LeaveRequestItem = memo(function LeaveRequestItem({
  request,
  isFirst = false,
  isLast = false,
}: LeaveRequestItemProps) {
  const IconComponent = getLeaveTypeIcon(request.type);
  const statusColor = getStatusBadgeColor(request.status);
  const statusText = formatStatusText(request.status);
  const leaveTypeLabel = getLeaveTypeLabel(request.type);
  const dateRangeText = formatDateRange(request.startDate, request.endDate, request.isHalfDay);

  // Padding classes based on position
  // Single item (isFirst && isLast): no padding
  // First item: no top padding, 14px bottom
  // Last item: 14px top, no bottom padding
  // Middle items: 14px vertical
  const paddingClasses = (isFirst && isLast)
    ? ''
    : isFirst
    ? 'pt-0 pb-[14px]'
    : isLast
    ? 'pt-[14px] pb-0'
    : 'py-[14px]';

  return (
    <div
      className={`flex items-center gap-[10px] ${paddingClasses} ${
        !isLast ? 'border-b border-neutral-100' : ''
      }`}
      data-name="LeaveRequestItem"
    >
      {/* Leave Type Icon - 36px with rounded background */}
      <div className="shrink-0 w-[36px] h-[36px] bg-neutral-100 rounded-[9px] overflow-clip flex items-center justify-center">
        <Image
          src={IconComponent}
          alt={`${leaveTypeLabel} icon`}
          width={20}
          height={20}
        />
      </div>

      {/* Content: Name + Date + Badge */}
      <div className="flex flex-1 items-start min-w-0">
        {/* Name + Date */}
        <div className="flex flex-1 flex-col gap-[2px] min-w-0">
          {/* Leave type name - 14px medium, neutral-800 */}
          <p className="text-[14px] font-medium leading-[18px] text-neutral-800 truncate">
            {leaveTypeLabel}
          </p>
          
          {/* Date range - 12px medium, neutral-400 */}
          <p className="text-[12px] font-medium leading-[16px] text-neutral-400">
            {dateRangeText}
          </p>
        </div>

        {/* Status Badge */}
        <UnifiedBadge
          text={statusText}
          color={statusColor}
          size="sm"
          font="semibold"
        />
      </div>
    </div>
  );
});

LeaveRequestItem.displayName = 'LeaveRequestItem';

export default LeaveRequestItem;

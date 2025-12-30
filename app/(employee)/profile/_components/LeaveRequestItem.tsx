'use client';

/**
 * Leave Request Item Component
 * 
 * Displays a single leave request with type icon, name, date range, and status badge.
 * 
 * Requirements: 5.3, 5.4, 5.5, 5.6
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
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  isHalfDay?: boolean;
}

export interface LeaveRequestItemProps {
  /**
   * The leave request data to display
   */
  request: LeaveRequest;
  
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
 * Icons are 36px with rounded background (already included in SVG)
 * Each leave type has its own dedicated icon
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
 * Pending: warning (amber), Approved: success (green), Rejected: danger (red)
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
 * LeaveRequestItem Component
 * 
 * Specifications:
 * - Leave type icon: 36px, rounded, neutral-100 bg (icons already have bg)
 * - Leave type name: 14px medium, neutral-800
 * - Date range: 12px medium, neutral-400
 * - Status badge: UnifiedBadge (Pending: warning, Approved: success, Rejected: danger)
 * - Border bottom except for last item
 * 
 * @example
 * ```tsx
 * <LeaveRequestItem
 *   request={{
 *     id: '1',
 *     type: 'annual',
 *     startDate: '2024-01-15',
 *     endDate: '2024-01-17',
 *     status: 'approved',
 *   }}
 *   isLast={false}
 * />
 * ```
 */
const LeaveRequestItem = memo(function LeaveRequestItem({
  request,
  isLast = false,
}: LeaveRequestItemProps) {
  const IconComponent = getLeaveTypeIcon(request.type);
  const statusColor = getStatusBadgeColor(request.status);
  const statusText = formatStatusText(request.status);
  const leaveTypeLabel = getLeaveTypeLabel(request.type);

  return (
    <div
      className={`flex items-center gap-3 py-3 ${
        !isLast ? 'border-b border-neutral-100' : ''
      }`}
      data-name="LeaveRequestItem"
    >
      {/* Leave Type Icon - 36px with rounded background */}
      <div className="flex-shrink-0">
        <Image
          src={IconComponent}
          alt={`${leaveTypeLabel} icon`}
          width={36}
          height={36}
          className="rounded-lg"
        />
      </div>

      {/* Leave Details */}
      <div className="flex-1 min-w-0">
        {/* Leave type name - 14px medium, neutral-800 */}
        <p className="text-[14px] font-medium text-neutral-800 truncate">
          {leaveTypeLabel}
        </p>
        
        {/* Date range - 12px medium, neutral-400 */}
        <p className="text-[12px] font-medium text-neutral-400">
          {request.startDate} - {request.endDate}
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <UnifiedBadge
          text={statusText}
          color={statusColor}
          size="sm"
          font="medium"
        />
      </div>
    </div>
  );
});

LeaveRequestItem.displayName = 'LeaveRequestItem';

export default LeaveRequestItem;

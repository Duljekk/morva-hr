'use client';

import Badge, { type BadgeVariant } from '@/components/shared/Badge';

export type AttendanceStatus = 'late' | 'ontime' | 'overtime' | 'leftearly';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface AttendanceBadgeProps {
  status: AttendanceStatus | LeaveStatus;
  size?: 'sm' | 'md';
  className?: string;
}

// Map statuses to Badge variants
const statusToVariant: Record<AttendanceStatus | LeaveStatus, BadgeVariant> = {
  // Attendance statuses
  late: 'warning',
  ontime: 'success',
  overtime: 'neutral',
  leftearly: 'warning',
  // Leave statuses
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

// Status labels
const statusLabels: Record<AttendanceStatus | LeaveStatus, string> = {
  // Attendance statuses
  late: 'Late',
  ontime: 'On Time',
  overtime: 'Overtime',
  leftearly: 'Left Early',
  // Leave statuses
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export default function AttendanceBadge({ 
  status, 
  size = 'sm',
  className = '' 
}: AttendanceBadgeProps) {
  const variant = statusToVariant[status];
  const label = statusLabels[status];

  return (
    <Badge variant={variant} size={size} showIcon={false} className={className}>
      {label}
    </Badge>
  );
}


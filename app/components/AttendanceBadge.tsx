'use client';

export type AttendanceStatus = 'late' | 'ontime' | 'overtime' | 'leftearly';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface AttendanceBadgeProps {
  status: AttendanceStatus | LeaveStatus;
  className?: string;
}

const statusStyles = {
  // Attendance statuses
  late: {
    bg: 'bg-[#fffbeb]',
    text: 'text-[#e17100]',
    label: 'Late',
  },
  ontime: {
    bg: 'bg-[#dcfce7]',
    text: 'text-[#008236]',
    label: 'On Time',
  },
  overtime: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-600',
    label: 'Overtime',
  },
  leftearly: {
    bg: 'bg-[#fffbeb]',
    text: 'text-[#e17100]',
    label: 'Left Early',
  },
  // Leave statuses
  pending: {
    bg: 'bg-[#fffbeb]',
    text: 'text-[#e17100]',
    label: 'Pending',
  },
  approved: {
    bg: 'bg-[#f0fdf4]',
    text: 'text-[#00a63e]',
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-[#fef2f2]',
    text: 'text-[#e7000b]',
    label: 'Rejected',
  },
};

export default function AttendanceBadge({ status, className = '' }: AttendanceBadgeProps) {
  const styles = statusStyles[status];

  return (
    <div className={`rounded-xl px-2 py-0.5 ${styles.bg} ${className}`}>
      <p className={`text-xs font-semibold tracking-[-0.1px] ${styles.text}`}>
        {styles.label}
      </p>
    </div>
  );
}


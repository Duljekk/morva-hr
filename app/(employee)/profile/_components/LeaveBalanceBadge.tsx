'use client';

import { memo, useMemo } from 'react';

export interface LeaveBalanceBadgeProps {
  current: number;
  total: number;
  className?: string;
}

export type BadgeVariant = 'high' | 'medium' | 'low';

const badgeStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  high: {
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#009966]',
  },
  medium: {
    bg: 'bg-[#fffbeb]',
    text: 'text-[#d97706]',
  },
  low: {
    bg: 'bg-[#fef2f2]',
    text: 'text-[#dc2626]',
  },
};

function getBadgeVariant(current: number, total: number): BadgeVariant {
  if (current <= 0 || total <= 0) return 'low';
  
  const percentage = (current / total) * 100;
  
  if (percentage >= 50) return 'high';
  if (percentage >= 21) return 'medium';
  return 'low';
}

const LeaveBalanceBadge = memo(function LeaveBalanceBadge({
  current,
  total,
  className = '',
}: LeaveBalanceBadgeProps) {
  const { variant, styles } = useMemo(() => {
    const variant = getBadgeVariant(current, total);
    return { variant, styles: badgeStyles[variant] };
  }, [current, total]);

  return (
    <div
      className={`${styles.bg} flex h-[20px] items-center justify-center px-[6px] rounded-[32px] shrink-0 ${className}`.trim()}
      data-name="Badge"
    >
      <p
        className={`font-sans font-medium leading-[16px] ${styles.text} text-[12px] text-center whitespace-nowrap`}
      >
        {current}/{total}
      </p>
    </div>
  );
});

LeaveBalanceBadge.displayName = 'LeaveBalanceBadge';

export default LeaveBalanceBadge;

'use client';

import { memo } from 'react';
import { getBarVariant } from './LeaveBalanceIndicator';

export interface LeaveBalanceBadgeProps {
  /**
   * Current/remaining leave days
   */
  current: number;

  /**
   * Total leave days allocated
   */
  total: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Badge style variants based on balance ratio
 */
export type BadgeVariant = 'high' | 'medium' | 'low';

/**
 * Badge style configuration
 */
const badgeStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  high: {
    bg: 'bg-[#ecfdf5]', // emerald-50
    text: 'text-[#009966]', // emerald-600
  },
  medium: {
    bg: 'bg-[#fffbeb]', // amber-50
    text: 'text-[#d97706]', // amber-600
  },
  low: {
    bg: 'bg-[#fef2f2]', // red-50
    text: 'text-[#dc2626]', // red-600
  },
};

/**
 * Map bar variant to badge variant
 */
function getBadgeVariant(current: number, total: number): BadgeVariant {
  const barVariant = getBarVariant(current, total);
  if (barVariant === 'High') return 'high';
  if (barVariant === 'Medium') return 'medium';
  return 'low';
}

/**
 * Leave Balance Badge Component
 * 
 * Shows the fraction as text in a colored badge.
 * Color variants match the LeaveBalanceIndicator (based on ratio):
 * - > 50%: High (Green) - bg-emerald-50, text-emerald-600
 * - 25-50%: Medium (Amber) - bg-amber-50, text-amber-600
 * - < 25%: Low (Red) - bg-red-50, text-red-600
 * 
 * @example
 * ```tsx
 * // High balance (green badge)
 * <LeaveBalanceBadge current={10} total={12} />
 * 
 * // Medium balance (amber badge)
 * <LeaveBalanceBadge current={3} total={12} />
 * 
 * // Low balance (red badge)
 * <LeaveBalanceBadge current={1} total={12} />
 * ```
 */
const LeaveBalanceBadge = memo(function LeaveBalanceBadge({
  current,
  total,
  className = '',
}: LeaveBalanceBadgeProps) {
  const variant = getBadgeVariant(current, total);
  const styles = badgeStyles[variant];

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

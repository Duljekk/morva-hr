'use client';

import { memo } from 'react';
import { getBarVariant } from './LeaveBalanceIndicator';
import { BarVariant } from './Bar';

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
 * Badge style variants based on bar count
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
 * Uses the same logic as LeaveBalanceIndicator for consistency
 */
function getBadgeVariant(current: number): BadgeVariant {
  const barVariant: BarVariant = getBarVariant(current);
  if (barVariant === 'High') return 'high';
  if (barVariant === 'Medium') return 'medium';
  return 'low';
}

/**
 * Leave Balance Badge Component
 * 
 * Shows the fraction as text in a colored badge.
 * Color variants match the LeaveBalanceIndicator (based on filled bar count):
 * - 6-10 bars: High (Green) - bg-emerald-50, text-emerald-600
 * - 3-5 bars: Medium (Amber) - bg-amber-50, text-amber-600
 * - 1-2 bars: Low (Red) - bg-red-50, text-red-600
 * 
 * @example
 * ```tsx
 * // High balance (green badge) - 22 remaining = 10 bars
 * <LeaveBalanceBadge current={22} total={22} />
 * 
 * // Medium balance (amber badge) - 7 remaining = 4 bars
 * <LeaveBalanceBadge current={7} total={22} />
 * 
 * // Low balance (red badge) - 2 remaining = 1 bar
 * <LeaveBalanceBadge current={2} total={22} />
 * ```
 */
const LeaveBalanceBadge = memo(function LeaveBalanceBadge({
  current,
  total,
  className = '',
}: LeaveBalanceBadgeProps) {
  const variant = getBadgeVariant(current);
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

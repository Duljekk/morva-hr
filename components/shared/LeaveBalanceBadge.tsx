'use client';

import { memo } from 'react';
import { calculateFilledBars } from './LeaveBalanceIndicator';

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
 * Badge style variants based on filled bars
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
 * Determine badge variant based on number of filled bars
 * 
 * Color variants match the bar indicator:
 * - 6-10 bars: high (Green)
 * - 3-5 bars: medium (Amber)
 * - 0-2 bars: low (Red)
 */
export function getBadgeVariant(filledBars: number): BadgeVariant {
  if (filledBars <= 2) return 'low';
  if (filledBars <= 5) return 'medium';
  return 'high';
}

/**
 * Leave Balance Badge Component
 * 
 * Shows the fraction as text in a colored badge.
 * Color variants match the LeaveBalanceIndicator (based on filled bars):
 * - 6-10 bars: High (Green) - bg-emerald-50, text-emerald-600
 * - 3-5 bars: Medium (Amber) - bg-amber-50, text-amber-600
 * - 0-2 bars: Low (Red) - bg-red-50, text-red-600
 * 
 * @example
 * ```tsx
 * // High balance (green badge)
 * <LeaveBalanceBadge current={10} total={12} />
 * 
 * // Medium balance (amber badge)
 * <LeaveBalanceBadge current={5} total={12} />
 * 
 * // Low balance (red badge)
 * <LeaveBalanceBadge current={2} total={12} />
 * ```
 */
const LeaveBalanceBadge = memo(function LeaveBalanceBadge({
  current,
  total,
  className = '',
}: LeaveBalanceBadgeProps) {
  const filledBars = calculateFilledBars(current, total);
  const variant = getBadgeVariant(filledBars);
  const styles = badgeStyles[variant];

  return (
    <div
      className={`${styles.bg} content-stretch flex h-[20px] items-center justify-center px-[6px] relative rounded-[32px] shrink-0 ${className}`.trim()}
      data-name="Badge"
      data-node-id="557:2378"
    >
      <div
        className="content-stretch flex h-[14px] items-center justify-center relative shrink-0"
        data-name="Container"
        data-node-id="557:2379"
      >
        <p
          className={`font-sans font-medium leading-[16px] relative shrink-0 ${styles.text} text-[12px] text-center text-nowrap whitespace-pre`}
          data-node-id="557:2380"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {current}/{total}
        </p>
      </div>
    </div>
  );
});

LeaveBalanceBadge.displayName = 'LeaveBalanceBadge';

export default LeaveBalanceBadge;

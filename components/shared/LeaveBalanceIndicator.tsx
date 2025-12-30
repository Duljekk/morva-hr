'use client';

import { memo } from 'react';
import Bar, { BarVariant } from './Bar';

export interface LeaveBalanceIndicatorProps {
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
 * Maximum number of bars to display
 */
const MAX_BARS = 10;

/**
 * Calculate the number of filled bars based on current/total ratio
 * 
 * Special cases:
 * - 0 bars only for 0 balance
 * - Full bars only for full balance
 * - Any non-zero balance shows at least 1 bar
 */
export function calculateFilledBars(current: number, total: number): number {
  if (current === 0) {
    return 0;
  }
  if (current === total) {
    return MAX_BARS;
  }
  
  const proportion = total > 0 ? current / total : 0;
  // Ensure at least 1 bar for any non-zero balance, max 9 for non-full
  return Math.max(1, Math.floor(proportion * MAX_BARS));
}

/**
 * Determine bar variant based on number of filled bars
 * 
 * Color variants:
 * - 6-10 bars: High (Green)
 * - 3-5 bars: Medium (Amber)
 * - 0-2 bars: Low (Red)
 */
export function getBarVariant(filledBars: number): BarVariant {
  if (filledBars <= 2) return 'Low';
  if (filledBars <= 5) return 'Medium';
  return 'High';
}

/**
 * Leave Balance Indicator Component
 * 
 * Shows bars representing leave balance (max 10 bars).
 * Each bar represents a proportional amount of the total leave allocation.
 * 
 * Color variants based on filled bars:
 * - 6-10 bars: High (Green)
 * - 3-5 bars: Medium (Amber)
 * - 0-2 bars: Low (Red)
 * 
 * @example
 * ```tsx
 * // Full balance (10 green bars)
 * <LeaveBalanceIndicator current={12} total={12} />
 * 
 * // Half balance (5 amber bars)
 * <LeaveBalanceIndicator current={6} total={12} />
 * 
 * // Low balance (2 red bars)
 * <LeaveBalanceIndicator current={2} total={12} />
 * ```
 */
const LeaveBalanceIndicator = memo(function LeaveBalanceIndicator({
  current,
  total,
  className = '',
}: LeaveBalanceIndicatorProps) {
  const filledBars = calculateFilledBars(current, total);
  const emptyBars = MAX_BARS - filledBars;
  const barVariant = getBarVariant(filledBars);

  return (
    <div 
      className={`content-stretch flex gap-[4px] h-[16px] items-center relative shrink-0 ${className}`.trim()} 
      data-name="Bars"
    >
      {/* Filled bars with appropriate variant */}
      {Array.from({ length: filledBars }).map((_, i) => (
        <Bar key={`filled-${i}`} color={barVariant} />
      ))}
      {/* Empty bars */}
      {Array.from({ length: emptyBars }).map((_, i) => (
        <Bar key={`empty-${i}`} color="Empty" />
      ))}
    </div>
  );
});

LeaveBalanceIndicator.displayName = 'LeaveBalanceIndicator';

export default LeaveBalanceIndicator;

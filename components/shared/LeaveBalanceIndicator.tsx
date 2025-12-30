'use client';

import { memo } from 'react';
import Bar, { BarVariant } from './Bar';

/** Maximum number of bars to display */
const MAX_BARS = 10;

/** Leave quota divisor (22 total / 10 bars = 2.2 per bar) */
const QUOTA_PER_BAR = 2.2;

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
 * Calculate the number of filled bars based on current leave balance
 * 
 * Logic: Each bar represents 2.2 leave days (22/10)
 * Uses Math.floor for proper calculation:
 * - 22/22 → 22/2.2 = 10 → 10 bars
 * - 21/22 → 21/2.2 = 9.54 → floor = 9 bars
 * - 11/22 → 11/2.2 = 5 → 5 bars
 * - 1/22 → 1/2.2 = 0.45 → floor = 0, but min 1 bar when current > 0
 * - 0/22 → 0/2.2 = 0 → 0 bars
 * 
 * @param current - Current/remaining leave days
 * @returns Number of filled bars (0-10)
 */
export function calculateFilledBars(current: number): number {
  if (current <= 0) return 0;
  // Use Math.floor for proper calculation
  const bars = Math.floor(current / QUOTA_PER_BAR);
  // Ensure at least 1 bar when current > 0, and max 10 bars
  return Math.max(1, Math.min(bars, MAX_BARS));
}

/**
 * Determine bar variant based on filled bar count
 * 
 * Color variants based on bar count:
 * - 6-10 bars: High (Green/Success)
 * - 3-5 bars: Medium (Orange/Warning)
 * - 1-2 bars: Low (Red/Danger)
 * - 0 bars: Low (Red/Danger)
 */
export function getBarVariant(current: number): BarVariant {
  const filledBars = calculateFilledBars(current);
  if (filledBars >= 6) return 'High';
  if (filledBars >= 3) return 'Medium';
  return 'Low';
}

/**
 * Leave Balance Indicator Component
 * 
 * Shows a maximum of 10 bars representing leave balance.
 * Each bar represents 2.2 leave days (22 total / 10 bars).
 * Filled bars represent remaining days, empty bars represent used days.
 * 
 * Color variants based on filled bar count:
 * - 6-10 bars: High (Green/Success)
 * - 3-5 bars: Medium (Orange/Warning)
 * - 1-2 bars: Low (Red/Danger)
 * 
 * @example
 * ```tsx
 * // 22 of 22 remaining → 10 green filled bars
 * <LeaveBalanceIndicator current={22} total={22} />
 * 
 * // 11 of 22 remaining → 5 green filled, 5 empty bars
 * <LeaveBalanceIndicator current={11} total={22} />
 * 
 * // 1 of 22 remaining → 1 red filled, 9 empty bars
 * <LeaveBalanceIndicator current={1} total={22} />
 * ```
 */
const LeaveBalanceIndicator = memo(function LeaveBalanceIndicator({
  current,
  className = '',
}: LeaveBalanceIndicatorProps) {
  const filledBars = calculateFilledBars(current);
  const emptyBars = MAX_BARS - filledBars;
  const barVariant = getBarVariant(current);

  return (
    <div 
      className={`flex gap-[4px] h-[16px] items-center shrink-0 ${className}`.trim()} 
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

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
 * Determine bar variant based on remaining/total ratio
 * 
 * Color variants:
 * - > 50%: High (Green)
 * - 25-50%: Medium (Amber)
 * - < 25%: Low (Red)
 */
export function getBarVariant(current: number, total: number): BarVariant {
  if (total === 0) return 'Low';
  const ratio = current / total;
  if (ratio <= 0.25) return 'Low';
  if (ratio <= 0.5) return 'Medium';
  return 'High';
}

/**
 * Leave Balance Indicator Component
 * 
 * Shows bars representing leave balance where bar count matches the total allocation.
 * Filled bars represent remaining days, empty bars represent used days.
 * 
 * Color variants based on remaining ratio:
 * - > 50%: High (Green)
 * - 25-50%: Medium (Amber)
 * - < 25%: Low (Red)
 * 
 * @example
 * ```tsx
 * // 10 of 12 remaining (10 green filled, 2 empty)
 * <LeaveBalanceIndicator current={10} total={12} />
 * 
 * // 3 of 5 remaining (3 green filled, 2 empty)
 * <LeaveBalanceIndicator current={3} total={5} />
 * ```
 */
const LeaveBalanceIndicator = memo(function LeaveBalanceIndicator({
  current,
  total,
  className = '',
}: LeaveBalanceIndicatorProps) {
  const filledBars = Math.max(0, Math.min(current, total));
  const emptyBars = Math.max(0, total - filledBars);
  const barVariant = getBarVariant(current, total);

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

'use client';

import { memo, useMemo } from 'react';
import Bar, { BarVariant } from '@/components/shared/Bar';

const MAX_BARS = 12;

export interface LeaveBalanceIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

function calculateFilledBars(current: number, total: number): number {
  if (current <= 0 || total <= 0) return 0;
  return Math.min(Math.round(current), total);
}

function getBarVariant(current: number, total: number): BarVariant {
  if (current <= 0 || total <= 0) return 'Low';
  
  const percentage = (current / total) * 100;
  
  if (percentage >= 50) return 'High';
  if (percentage >= 21) return 'Medium';
  return 'Low';
}

const LeaveBalanceIndicator = memo(function LeaveBalanceIndicator({
  current,
  total,
  className = '',
}: LeaveBalanceIndicatorProps) {
  const { filledBars, emptyBars, barVariant, displayTotal } = useMemo(() => {
    const safeTotal = Math.max(total, 1);
    const displayTotal = Math.min(safeTotal, MAX_BARS);
    const filledBars = Math.min(calculateFilledBars(current, safeTotal), displayTotal);
    const emptyBars = displayTotal - filledBars;
    const barVariant = getBarVariant(current, safeTotal);
    
    return { filledBars, emptyBars, barVariant, displayTotal };
  }, [current, total]);

  if (total <= 0) {
    return null;
  }

  return (
    <div 
      className={`flex gap-[4px] h-[16px] items-center shrink-0 ${className}`.trim()} 
      data-name="Bars"
    >
      {Array.from({ length: filledBars }).map((_, i) => (
        <Bar key={`filled-${i}`} color={barVariant} />
      ))}
      {Array.from({ length: emptyBars }).map((_, i) => (
        <Bar key={`empty-${i}`} color="Empty" />
      ))}
    </div>
  );
});

LeaveBalanceIndicator.displayName = 'LeaveBalanceIndicator';

export default LeaveBalanceIndicator;

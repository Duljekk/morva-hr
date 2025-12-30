'use client';

/**
 * Leave Balances Card Component
 * 
 * Displays leave balances for Paid Time Off, Work from Home, and Sick Leave
 * with visual bar indicators and badges matching Figma design.
 * 
 * Layout:
 * - PTO: Full width row with bars + badge inline
 * - WFH & Sick Leave: Side by side in a row
 */

import { memo } from 'react';
import LeaveBalanceIndicator from '@/components/shared/LeaveBalanceIndicator';
import LeaveBalanceBadge from '@/components/shared/LeaveBalanceBadge';

export interface LeaveBalance {
  type: 'annual' | 'wfh' | 'sick';
  label: string;
  remaining: number;
  total: number;
}

export interface LeaveBalancesCardProps {
  /**
   * Array of leave balances to display
   */
  balances: LeaveBalance[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LeaveBalancesCard Component
 * 
 * Card specifications from Figma:
 * - White background (60% opacity) with subtle shadow
 * - 10px border radius
 * - Padding: 18px top, 20px bottom/left/right
 * - "Leave Balances" title (16px medium, neutral-600)
 * - PTO row: full width, bars + badge inline
 * - WFH & Sick Leave: side by side row
 */
const LeaveBalancesCard = memo(function LeaveBalancesCard({
  balances,
  className = '',
}: LeaveBalancesCardProps) {
  // Find specific leave types
  const ptoBalance = balances.find(b => b.type === 'annual');
  const wfhBalance = balances.find(b => b.type === 'wfh');
  const sickBalance = balances.find(b => b.type === 'sick');

  return (
    <div
      className={`bg-white/60 rounded-[10px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)] pt-[18px] pb-[20px] px-[20px] overflow-clip ${className}`.trim()}
      data-name="LeaveBalancesCard"
    >
      {/* Card Title - 16px medium, neutral-600 */}
      <p className="text-[16px] font-medium leading-[20px] text-neutral-600 mb-[16px]">
        Leave Balances
      </p>

      {/* Leave Balance Items */}
      <div className="flex flex-col gap-[16px]">
        {/* PTO Row - Full width */}
        {ptoBalance && (
          <LeaveBalanceRow balance={ptoBalance} />
        )}

        {/* WFH & Sick Leave Row - Side by side */}
        {(wfhBalance || sickBalance) && (
          <div className="flex gap-[16px] items-center">
            {wfhBalance && (
              <LeaveBalanceRow balance={wfhBalance} />
            )}
            {sickBalance && (
              <LeaveBalanceRow balance={sickBalance} />
            )}
          </div>
        )}

        {/* Fallback for empty state */}
        {balances.length === 0 && (
          <p className="text-sm text-neutral-400">No leave balances available</p>
        )}
      </div>
    </div>
  );
});

/**
 * Individual Leave Balance Row
 * 
 * Displays a single leave type with:
 * - Leave type name (14px medium, neutral-800)
 * - Bars + Badge inline below the title
 */
interface LeaveBalanceRowProps {
  balance: LeaveBalance;
}

const LeaveBalanceRow = memo(function LeaveBalanceRow({
  balance,
}: LeaveBalanceRowProps) {
  return (
    <div className="flex flex-col gap-[6px]" data-name={balance.type}>
      {/* Leave type name - 14px medium, neutral-800 */}
      <p className="text-[14px] font-medium leading-[18px] text-neutral-800">
        {balance.label}
      </p>
      
      {/* Indicators: Bars + Badge inline */}
      <div className="flex gap-[8px] items-center">
        <LeaveBalanceIndicator
          current={balance.remaining}
          total={balance.total}
        />
        <LeaveBalanceBadge
          current={balance.remaining}
          total={balance.total}
        />
      </div>
    </div>
  );
});

LeaveBalanceRow.displayName = 'LeaveBalanceRow';
LeaveBalancesCard.displayName = 'LeaveBalancesCard';

export default LeaveBalancesCard;

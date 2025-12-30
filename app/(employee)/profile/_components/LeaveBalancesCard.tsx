'use client';

/**
 * Leave Balances Card Component
 * 
 * Displays leave balances for Paid Time Off, Work from Home, and Sick Leave
 * with visual bar indicators and badges.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7
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
 * Card specifications:
 * - White background with subtle shadow
 * - 10px border radius
 * - "Leave Balances" title (16px medium, neutral-600)
 * - Displays: Paid Time Off, Work from Home, Sick Leave
 * - Uses shared LeaveBalanceIndicator and LeaveBalanceBadge
 * 
 * @example
 * ```tsx
 * <LeaveBalancesCard
 *   balances={[
 *     { type: 'annual', label: 'Paid Time Off', remaining: 10, total: 12 },
 *     { type: 'wfh', label: 'Work from Home', remaining: 3, total: 5 },
 *     { type: 'sick', label: 'Sick Leave', remaining: 2, total: 5 },
 *   ]}
 * />
 * ```
 */
const LeaveBalancesCard = memo(function LeaveBalancesCard({
  balances,
  className = '',
}: LeaveBalancesCardProps) {
  return (
    <div
      className={`bg-white rounded-[10px] shadow-sm border border-neutral-100 p-4 ${className}`.trim()}
      data-name="LeaveBalancesCard"
    >
      {/* Card Title - 16px medium, neutral-600 */}
      <p className="text-[16px] font-medium text-neutral-600 mb-4">
        Leave Balances
      </p>

      {/* Leave Balance Items */}
      <div className="flex flex-col gap-4">
        {balances.length > 0 ? (
          balances.map((balance) => (
            <LeaveBalanceItem key={balance.type} balance={balance} />
          ))
        ) : (
          <p className="text-sm text-neutral-400">No leave balances available</p>
        )}
      </div>
    </div>
  );
});

/**
 * Individual Leave Balance Item
 * 
 * Displays a single leave type with:
 * - Leave type name (14px medium, neutral-800)
 * - Leave balance bar indicator
 * - Badge showing remaining/total
 */
interface LeaveBalanceItemProps {
  balance: LeaveBalance;
}

const LeaveBalanceItem = memo(function LeaveBalanceItem({
  balance,
}: LeaveBalanceItemProps) {
  return (
    <div className="flex flex-col gap-2" data-name="LeaveBalanceItem">
      {/* Row with label and badge */}
      <div className="flex items-center justify-between">
        {/* Leave type name - 14px medium, neutral-800 */}
        <span className="text-[14px] font-medium text-neutral-800">
          {balance.label}
        </span>
        
        {/* Badge showing remaining/total */}
        <LeaveBalanceBadge
          current={balance.remaining}
          total={balance.total}
        />
      </div>
      
      {/* Leave balance bar indicator */}
      <LeaveBalanceIndicator
        current={balance.remaining}
        total={balance.total}
      />
    </div>
  );
});

LeaveBalanceItem.displayName = 'LeaveBalanceItem';
LeaveBalancesCard.displayName = 'LeaveBalancesCard';

export default LeaveBalancesCard;

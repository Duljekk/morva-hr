'use client';

/**
 * Leave Requests Card Component
 * 
 * Displays a list of leave requests with type, date range, and status.
 * Shows empty state when no requests exist.
 * 
 * Requirements: 5.1, 5.2, 5.7, 5.8
 */

import { memo } from 'react';
import LeaveRequestItem, { LeaveRequest } from './LeaveRequestItem';

export interface LeaveRequestsCardProps {
  /**
   * Array of leave requests to display
   */
  requests: LeaveRequest[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LeaveRequestsCard Component
 * 
 * Card specifications:
 * - White background with subtle shadow
 * - 12px border radius
 * - "Leave Requests" title (16px medium, neutral-600)
 * - List of LeaveRequestItem components
 * - Empty state when no requests
 * 
 * @example
 * ```tsx
 * <LeaveRequestsCard
 *   requests={[
 *     {
 *       id: '1',
 *       type: 'annual',
 *       startDate: '2024-01-15',
 *       endDate: '2024-01-17',
 *       status: 'approved',
 *     },
 *     {
 *       id: '2',
 *       type: 'sick',
 *       startDate: '2024-02-01',
 *       endDate: '2024-02-01',
 *       status: 'pending',
 *     },
 *   ]}
 * />
 * ```
 */
const LeaveRequestsCard = memo(function LeaveRequestsCard({
  requests,
  className = '',
}: LeaveRequestsCardProps) {
  return (
    <div
      className={`bg-white rounded-[12px] shadow-sm border border-neutral-100 p-4 ${className}`.trim()}
      data-name="LeaveRequestsCard"
    >
      {/* Card Title - 16px medium, neutral-600 */}
      <p className="text-[16px] font-medium text-neutral-600 mb-3">
        Leave Requests
      </p>

      {/* Leave Request Items */}
      <div className="flex flex-col">
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <LeaveRequestItem
              key={request.id}
              request={request}
              isLast={index === requests.length - 1}
            />
          ))
        ) : (
          /* Empty state - Requirements 5.8 */
          <div className="py-6 text-center">
            <p className="text-sm text-neutral-400">
              No leave requests yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

LeaveRequestsCard.displayName = 'LeaveRequestsCard';

export default LeaveRequestsCard;

'use client';

/**
 * Leave Requests Card Component
 * 
 * Displays a list of leave requests with type, date range, and status.
 * Shows empty state when no requests exist.
 * 
 * Figma design: 788:1945
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
 * Card specifications from Figma:
 * - White background (60% opacity) with subtle shadow
 * - 12px border radius
 * - Padding: 18px top, 20px bottom/left/right
 * - "Leave Requests" title (16px medium, neutral-600)
 * - List of LeaveRequestItem components with borders
 */
const LeaveRequestsCard = memo(function LeaveRequestsCard({
  requests,
  className = '',
}: LeaveRequestsCardProps) {
  return (
    <div
      className={`bg-white/60 rounded-[12px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)] pt-[18px] pb-[20px] px-[20px] overflow-clip ${className}`.trim()}
      data-name="LeaveRequestsCard"
    >
      {/* Card Title - 16px medium, neutral-600 */}
      <p className="text-[16px] font-medium leading-[20px] text-neutral-600 mb-[16px]">
        Leave Requests
      </p>

      {/* Leave Request Items */}
      <div className="flex flex-col">
        {requests.length > 0 ? (
          requests.map((request, index) => (
            <LeaveRequestItem
              key={request.id}
              request={request}
              isFirst={index === 0}
              isLast={index === requests.length - 1}
            />
          ))
        ) : (
          /* Empty state */
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

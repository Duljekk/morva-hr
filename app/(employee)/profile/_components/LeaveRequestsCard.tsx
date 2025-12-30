'use client';

/**
 * Leave Requests Card Component
 * 
 * Displays a list of leave requests with type, date range, and status.
 * Shows empty state when no requests exist.
 * 
 * Figma design: 813:1910
 */

import { memo } from 'react';
import LeaveRequestItem, { LeaveRequest } from './LeaveRequestItem';
import EmptyStateSmIllustration from '@/app/assets/icons/empty-state-sm.svg';

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
 * Card specifications from Figma (813:1910):
 * - White background (60% opacity) with subtle shadow
 * - 12px border radius
 * - Padding: 18px top, 20px bottom/left/right
 * - 16px gap between title and content
 * - "Leave Requests" title (16px medium, neutral-600)
 * - List of LeaveRequestItem components with borders
 * 
 * Empty state specifications (813:1912):
 * - Container: 314x206px, centered content
 * - Illustration: 232x78px (empty-state-sm.svg)
 * - Title: "No leave requests yet" (14px medium, neutral-700)
 * - Subtitle: "Your leave requests will appear here once you submit one." (14px regular, neutral-500)
 * - 16px gap between illustration and text
 * - 6px gap between title and subtitle
 */
const LeaveRequestsCard = memo(function LeaveRequestsCard({
  requests,
  className = '',
}: LeaveRequestsCardProps) {
  return (
    <div
      className={`bg-white/60 rounded-[12px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)] pt-[18px] pb-[20px] px-[20px] overflow-clip flex flex-col gap-4 ${className}`.trim()}
      data-name="LeaveRequestsCard"
    >
      {/* Card Title - 16px medium, neutral-600 */}
      <p className="text-[16px] font-medium leading-[20px] text-neutral-600">
        Leave Requests
      </p>

      {/* Leave Request Items or Empty State */}
      {requests.length > 0 ? (
        <div className="flex flex-col">
          {requests.map((request, index) => (
            <LeaveRequestItem
              key={request.id}
              request={request}
              isFirst={index === 0}
              isLast={index === requests.length - 1}
            />
          ))}
        </div>
      ) : (
        /* Empty state - Figma node 813:1912 */
        <div
          className="flex flex-col items-center justify-center h-[206px] w-full"
          data-name="Container"
        >
          <div className="flex flex-col gap-4 items-center w-[266px]" data-name="Contents">
            {/* Illustration - 232x78px */}
            <div className="w-[232px] h-[78px]" data-name="empty-state-sm">
              <EmptyStateSmIllustration className="w-full h-full" />
            </div>

            {/* Text - 6px gap between title and subtitle */}
            <div className="flex flex-col gap-[6px] items-center text-center w-full text-sm" data-name="Text">
              <p className="font-medium leading-[18px] text-neutral-700">
                No leave requests yet
              </p>
              <p className="leading-5 text-neutral-500">
                Your leave requests will appear here once you submit one.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

LeaveRequestsCard.displayName = 'LeaveRequestsCard';

export default LeaveRequestsCard;

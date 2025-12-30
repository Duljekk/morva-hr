'use client';

import { memo } from 'react';
import EmptyStateIllustration from '@/app/assets/icons/empty-state.svg';

export interface LeaveRequestEmptyStateProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * LeaveRequestEmptyState Component
 * 
 * Empty state displayed when no leave request history exists for an employee.
 * Based on Figma design node 807:2436 (same layout as AttendanceEmptyState).
 * 
 * Features:
 * - Centered illustration using empty-state.svg
 * - Title: "No leave history available"
 * - Subtitle explaining when records will appear
 */
const LeaveRequestEmptyState = memo(function LeaveRequestEmptyState({
  className = '',
}: LeaveRequestEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full ${className}`.trim()}
      data-name="LeaveRequestEmptyState"
    >
      <div className="flex flex-col gap-4 items-center w-[307px]">
        {/* Illustration */}
        <div className="w-[258px] h-[78px]">
          <EmptyStateIllustration className="w-full h-full" />
        </div>

        {/* Text Contents */}
        <div className="flex flex-col gap-[6px] items-center text-center w-full text-sm">
          <p className="font-medium leading-[18px] text-neutral-700">
            No leave history available
          </p>
          <p className="leading-5 text-neutral-500">
            This employee hasn't submitted any leave requests yet.
          </p>
        </div>
      </div>
    </div>
  );
});

LeaveRequestEmptyState.displayName = 'LeaveRequestEmptyState';

export default LeaveRequestEmptyState;

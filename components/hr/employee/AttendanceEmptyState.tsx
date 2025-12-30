'use client';

import { memo } from 'react';
import EmptyStateIllustration from '@/app/assets/icons/empty-state.svg';

export interface AttendanceEmptyStateProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * AttendanceEmptyState Component
 * 
 * Empty state displayed when no attendance records exist for an employee.
 * Based on Figma design node 807:2436.
 * 
 * Features:
 * - Centered illustration using empty-state.svg
 * - Title: "No attendance records yet"
 * - Subtitle explaining when records will appear
 */
const AttendanceEmptyState = memo(function AttendanceEmptyState({
  className = '',
}: AttendanceEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full ${className}`.trim()}
      data-name="AttendanceEmptyState"
      data-node-id="807:2436"
    >
      <div className="flex flex-col gap-4 items-center w-[307px]">
        {/* Illustration */}
        <div className="w-[258px] h-[78px]" data-node-id="807:2438">
          <EmptyStateIllustration className="w-full h-full" />
        </div>

        {/* Text Contents */}
        <div
          className="flex flex-col gap-[6px] items-center text-center w-full text-sm"
          data-node-id="807:2450"
        >
          <p
            className="font-medium leading-[18px] text-neutral-700"
            data-node-id="807:2451"
          >
            No attendance records yet
          </p>
          <p
            className="leading-5 text-neutral-500"
            data-node-id="807:2452"
          >
            Attendance will appear here once the employee starts checking in and out.
          </p>
        </div>
      </div>
    </div>
  );
});

AttendanceEmptyState.displayName = 'AttendanceEmptyState';

export default AttendanceEmptyState;

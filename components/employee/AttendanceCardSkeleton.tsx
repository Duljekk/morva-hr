'use client';

import { memo } from 'react';

export interface AttendanceCardSkeletonProps {
  /**
   * Whether to show the status section at the bottom
   * @default true
   */
  showStatus?: boolean;
}

/**
 * AttendanceCardSkeleton Component
 *
 * Skeleton loading state for AttendanceCard component.
 * Matches the structure and layout of AttendanceCard with animated placeholders.
 *
 * Layout structure (matching AttendanceCard):
 * - Container: w-[173px], rounded-[10px], shadow
 * - Top section: icon + text (title + time)
 * - Bottom section: status badge + duration
 */
const AttendanceCardSkeleton = memo(function AttendanceCardSkeleton({
  showStatus = true,
}: AttendanceCardSkeletonProps) {
  return (
    <div
      className="w-[173px] flex flex-col rounded-[10px] bg-[rgba(255,255,255,0.25)] shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(229,229,229,1)] overflow-hidden animate-pulse"
      data-name="Attendance Card Skeleton"
    >
      {/* Top Section */}
      <div className="flex items-start gap-2 bg-white px-2.5 py-2.5 pb-3 rounded-[10px] shadow-[0px_0px_0.5px_0.5px_rgba(229,229,229,1)]">
        {/* Icon Skeleton */}
        <div className="h-9 w-9 shrink-0 bg-neutral-200 rounded-[8px]" />

        {/* Text */}
        <div className="flex flex-col gap-1">
          {/* Title Skeleton */}
          <div className="h-[18px] w-[80px] bg-neutral-200 rounded-[4px]" />
          {/* Time Skeleton */}
          <div className="h-[16px] w-[50px] bg-neutral-100 rounded-[4px]" />
        </div>
      </div>

      {/* Bottom Status Section */}
      {showStatus && (
        <div className="flex items-center justify-between px-2 py-1.5">
          {/* Status Badge Skeleton */}
          <div className="h-[16px] w-[50px] bg-neutral-200 rounded-[4px]" />
          {/* Duration Skeleton */}
          <div className="h-[14px] w-[40px] bg-neutral-100 rounded-[4px]" />
        </div>
      )}
    </div>
  );
});

AttendanceCardSkeleton.displayName = 'AttendanceCardSkeleton';

export default AttendanceCardSkeleton;

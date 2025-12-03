'use client';

import { memo } from 'react';

export interface AttendanceFeedSkeletonProps {
  /**
   * Number of skeleton items to display.
   * Uses a reasonable default (10) to balance visual feedback and performance.
   * The actual fetch limit is 50, but showing 10 skeleton items provides
   * good UX without overwhelming the UI.
   * @default 10
   */
  count?: number;
}

/**
 * AttendanceFeedSkeleton Component
 *
 * Skeleton loading state for AttendanceFeed component.
 * Matches the structure and layout of AttendanceFeed with animated placeholders.
 *
 * Best practices:
 * - Uses reasonable count (10) instead of matching full fetch limit (50)
 * - Provides visual feedback without overwhelming the UI
 * - Performance impact is negligible for 10 items
 *
 * Figma specs (matching node 428:2662 "Attendance Feed"):
 * - Container: white bg, rounded-[12px], shadow, padding pt-[20px] pb-[24px] px-[24px]
 * - Header: flex, justify-between, with title and tabs skeleton
 * - Items: flex-col, gap between items, matching AttendanceFeedItem structure
 */
const AttendanceFeedSkeleton = memo(function AttendanceFeedSkeleton({
  count = 10,
}: AttendanceFeedSkeletonProps) {
  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[20px] px-[24px] relative rounded-[12px] shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] size-full animate-pulse"
      data-name="Attendance Feed Skeleton"
      data-node-id="428:2662"
    >
      {/* Header */}
      <div
        className="content-stretch flex items-center justify-between relative shrink-0 w-full"
        data-name="Header"
        data-node-id="428:2663"
      >
        {/* Title Skeleton */}
        <div
          className="h-[22px] w-[140px] bg-neutral-200 rounded-[4px]"
          data-node-id="428:2664"
        />

        {/* Tabs Skeleton */}
        <div
          className="content-stretch flex h-[28px] items-center relative rounded-[10px] shrink-0 gap-[4px]"
          data-name="Tabs"
          data-node-id="428:2665"
        >
          <div className="h-[28px] w-[73px] bg-neutral-200 rounded-[10px]" />
          <div className="h-[28px] w-[73px] bg-neutral-100 rounded-[10px]" />
        </div>
      </div>

      {/* Attendance Items Group Skeleton */}
      <div
        className="content-stretch flex flex-col items-start relative size-full gap-0"
        data-name="Attendance Items Group"
        data-node-id="428:2670"
      >
        {/* Skeleton Items - Dynamic count with reasonable default */}
        {Array.from({ length: count }).map((_, index) => {
          const isFirst = index === 0;
          const isLast = index === count - 1;

          const borderClasses = isLast ? '' : 'border-b border-neutral-100';
          const paddingClasses = isFirst
            ? 'pb-[18px] pt-0'
            : isLast
            ? 'pt-[18px] pb-0'
            : 'py-[18px]';

          return (
            <div
              key={index}
              className={`${borderClasses} box-border content-stretch flex gap-[14px] items-center ${paddingClasses} px-0 relative shrink-0 w-full`}
              data-name="Attendance Items Container Skeleton"
            >
              {/* Avatar Skeleton */}
              <div className="shrink-0 size-[40px] bg-neutral-200 rounded-[10px]" />

              {/* Contents Skeleton */}
              <div className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0 gap-[8px]">
                {/* Name + Attendance Info */}
                <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
                  {/* Name Skeleton */}
                  <div className="h-[18px] w-[120px] bg-neutral-200 rounded-[4px]" />
                  {/* Attendance Info Skeleton */}
                  <div className="h-[18px] w-[140px] bg-neutral-100 rounded-[4px]" />
                </div>

                {/* Badge Skeleton */}
                <div className="h-[24px] w-[70px] bg-neutral-200 rounded-[6px] shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

AttendanceFeedSkeleton.displayName = 'AttendanceFeedSkeleton';

export default AttendanceFeedSkeleton;




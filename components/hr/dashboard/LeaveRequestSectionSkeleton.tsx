'use client';

import { memo } from 'react';

export interface LeaveRequestSectionSkeletonProps {
  /**
   * Number of skeleton items to display.
   * Matches the fetch limit (5) to provide accurate visual feedback.
   * @default 5
   */
  count?: number;
}

/**
 * LeaveRequestSectionSkeleton Component
 *
 * Skeleton loading state for LeaveRequestSection component.
 * Matches the structure and layout of LeaveRequestSection with animated placeholders.
 *
 * Best practices:
 * - Matches fetch limit (5) for accurate user expectation
 * - Small count ensures no performance concerns
 *
 * Figma specs (matching node 428:2762 "Leave Request"):
 * - Container: white bg, rounded-12px, shadow, padding 24px
 * - Header: flex, gap-8px, h-28px with title and count skeleton
 * - Leave Request Item Group: flex-col, gap between items
 * - Each item container has border-bottom divider (except last)
 * - Item padding: 18px top/bottom for middle items, 0 top for first, 0 bottom for last
 */
const LeaveRequestSectionSkeleton = memo(function LeaveRequestSectionSkeleton({
  count = 5,
}: LeaveRequestSectionSkeletonProps) {
  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[20px] px-[24px] relative rounded-[12px] shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] size-full animate-pulse"
      data-name="Leave Request Skeleton"
      data-node-id="428:2762"
    >
      {/* Header */}
      <div
        className="content-stretch flex font-semibold gap-[8px] h-[28px] items-center relative shrink-0 text-nowrap w-full whitespace-pre"
        data-name="Header"
        data-node-id="428:2763"
      >
        {/* Title Skeleton */}
        <div
          className="h-[22px] w-[120px] bg-neutral-200 rounded-[4px]"
          data-node-id="428:2765"
        />

        {/* Number Skeleton */}
        <div
          className="h-[20px] w-[16px] bg-neutral-200 rounded-[4px]"
          data-node-id="428:2766"
        />
      </div>

      {/* Leave Request Item Group */}
      <div
        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
        data-name="Leave Request Item Group"
        data-node-id="428:2768"
      >
        {/* Skeleton Items - Dynamic count matching fetch limit */}
        {Array.from({ length: count }).map((_, index) => {
          const isFirst = index === 0;
          const isLast = index === count - 1;

          const getContainerStyles = () => {
            if (isFirst) {
              return 'border-b border-neutral-100 pb-[18px] pt-0 px-0';
            }
            if (isLast) {
              return 'pb-0 pt-[18px] px-0';
            }
            return 'border-b border-neutral-100 px-0 py-[18px] h-[76px]';
          };

          return (
            <div
              key={index}
              className={`${getContainerStyles()} box-border content-stretch flex gap-[8px] items-center relative shrink-0 w-full`}
              data-name="Leave Request Item Container Skeleton"
            >
              <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0 gap-[14px]">
                {/* Illustration Skeleton */}
                <div className="shrink-0 size-[40px] bg-neutral-200 rounded-[8px]" />

                {/* Contents Skeleton */}
                <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
                  {/* Name Skeleton */}
                  <div className="h-[18px] w-[140px] bg-neutral-200 rounded-[4px]" />
                  {/* Date Range Skeleton */}
                  <div className="h-[18px] w-[160px] bg-neutral-100 rounded-[4px]" />
                </div>

                {/* Button Group Skeleton */}
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                  <div className="size-[28px] bg-neutral-200 rounded-[8px]" />
                  <div className="size-[28px] bg-neutral-200 rounded-[8px]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

LeaveRequestSectionSkeleton.displayName = 'LeaveRequestSectionSkeleton';

export default LeaveRequestSectionSkeleton;




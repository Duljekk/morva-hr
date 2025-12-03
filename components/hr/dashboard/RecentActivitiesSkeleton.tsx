'use client';

import { memo } from 'react';

export interface RecentActivitiesSkeletonProps {
  /**
   * Number of skeleton items to display.
   * Matches the maxItems default (5) to provide accurate visual feedback.
   * @default 5
   */
  count?: number;
}

/**
 * RecentActivitiesSkeleton Component
 *
 * Skeleton loading state for RecentActivitiesCard component.
 * Matches the structure and layout of RecentActivitiesCard with animated placeholders.
 *
 * Best practices:
 * - Matches maxItems default (5) for accurate user expectation
 * - Small count ensures no performance concerns
 *
 * Figma specs (matching node 428:2808 "Recent Activities"):
 * - Container: white bg, rounded-12px, shadow, padding 24px
 * - Title: text-lg/semibold, neutral-700, leading-22px
 * - Activities: flex-col, gap between items
 * - Activity items: border-bottom divider (except last)
 */
const RecentActivitiesSkeleton = memo(function RecentActivitiesSkeleton({
  count = 5,
}: RecentActivitiesSkeletonProps) {
  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[20px] px-[24px] relative rounded-[12px] shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] size-full animate-pulse"
      data-name="Recent Activities Skeleton"
      data-node-id="428:2808"
    >
      {/* Title */}
      <div
        className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full"
        data-name="Title"
        data-node-id="428:2809"
      >
        <div
          className="h-[22px] w-[140px] bg-neutral-200 rounded-[4px]"
          data-node-id="428:2811"
        />
      </div>

      {/* Activities Group */}
      <div
        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
        data-name="Activities Group"
        data-node-id="428:2812"
      >
        {/* Skeleton Items - Dynamic count matching maxItems */}
        {Array.from({ length: count }).map((_, index) => {
          const isLast = index === count - 1;

          return (
            <div
              key={index}
              className={`${
                !isLast
                  ? 'border-b border-neutral-100 pb-[18px]'
                  : 'pt-[18px]'
              } box-border content-stretch flex gap-[8px] items-center relative shrink-0 w-full`}
              data-name="Activity Item Container Skeleton"
            >
              {/* Illustration Skeleton */}
              <div className="shrink-0 size-[40px] bg-neutral-200 rounded-[8px]" />

              {/* Contents Skeleton */}
              <div className="basis-0 content-stretch flex gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
                {/* Title + Subtitle */}
                <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
                  {/* Title Skeleton */}
                  <div className="h-[18px] w-[150px] bg-neutral-200 rounded-[4px]" />
                  {/* Subtitle Skeleton */}
                  <div className="h-[18px] w-[180px] bg-neutral-100 rounded-[4px]" />
                </div>

                {/* Timestamp Skeleton */}
                <div className="h-[20px] w-[32px] bg-neutral-200 rounded-[4px] shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

RecentActivitiesSkeleton.displayName = 'RecentActivitiesSkeleton';

export default RecentActivitiesSkeleton;




'use client';

import { memo } from 'react';

export interface RecentActivitiesSkeletonProps {
  /**
   * Number of day groups to display.
   * @default 3
   */
  dayCount?: number;
  /**
   * Number of activity items per day.
   * @default 2
   */
  activitiesPerDay?: number;
}

/**
 * RecentActivitiesSkeleton Component (Employee Side)
 *
 * Skeleton loading state for RecentActivities component.
 * Matches the structure and layout of RecentActivities with animated placeholders.
 *
 * Best practices (matching HR-side patterns):
 * - Uses animate-pulse for animation
 * - bg-neutral-200 for primary elements, bg-neutral-100 for secondary
 * - Proper padding/border logic for first/last/middle items
 *
 * Layout structure:
 * - Title section
 * - Day groups with date headers
 * - Activity items with icon, text, and badge
 */
const RecentActivitiesSkeleton = memo(function RecentActivitiesSkeleton({
  dayCount = 3,
  activitiesPerDay = 2,
}: RecentActivitiesSkeletonProps) {
  // Cap counts to reasonable limits
  const displayDayCount = Math.min(dayCount, 5);
  const displayActivitiesPerDay = Math.min(activitiesPerDay, 4);

  return (
    <div
      className="flex flex-col gap-3 w-full animate-pulse"
      data-name="Recent Activities Skeleton"
    >
      {/* Title */}
      <div className="h-[20px] w-[130px] bg-neutral-200 rounded-[4px]" />

      {/* Day Groups */}
      {Array.from({ length: displayDayCount }).map((_, dayIndex) => (
        <div
          key={dayIndex}
          className="flex flex-col"
          data-name="Day Group Skeleton"
        >
          {/* Date Header */}
          <div className="h-[16px] w-[100px] bg-neutral-100 rounded-[4px] mb-2" />

          {/* Activities Container */}
          <div className="bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(229,229,229,1)] overflow-hidden">
            {Array.from({ length: displayActivitiesPerDay }).map((_, activityIndex) => {
              const isFirst = activityIndex === 0;
              const isLast = activityIndex === displayActivitiesPerDay - 1;
              const isSingle = displayActivitiesPerDay === 1;

              // Determine container padding and border based on position
              const getContainerStyles = () => {
                if (isSingle) {
                  return 'py-3 px-3';
                }
                if (isFirst) {
                  return 'border-b border-neutral-100 pt-3 pb-3 px-3';
                }
                if (isLast) {
                  return 'pt-3 pb-3 px-3';
                }
                // Middle item
                return 'border-b border-neutral-100 py-3 px-3';
              };

              return (
                <div
                  key={activityIndex}
                  className={`${getContainerStyles()} flex items-center gap-3`}
                  data-name="Activity Item Skeleton"
                >
                  {/* Icon Skeleton */}
                  <div className="h-8 w-8 shrink-0 bg-neutral-200 rounded-[8px]" />

                  {/* Content */}
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    {/* Text Group */}
                    <div className="flex flex-col gap-1">
                      {/* Title Skeleton */}
                      <div className="h-[16px] w-[100px] bg-neutral-200 rounded-[4px]" />
                      {/* Time Skeleton */}
                      <div className="h-[14px] w-[50px] bg-neutral-100 rounded-[4px]" />
                    </div>

                    {/* Badge Skeleton */}
                    <div className="h-[22px] w-[60px] bg-neutral-200 rounded-[6px] shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});

RecentActivitiesSkeleton.displayName = 'RecentActivitiesSkeleton';

export default RecentActivitiesSkeleton;

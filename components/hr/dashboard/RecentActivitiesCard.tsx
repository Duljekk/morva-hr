'use client';

import { memo, useMemo } from 'react';
import ActivityItem from './ActivityItem';
import type { RecentActivity } from '@/lib/actions/hr/dashboard';

export interface RecentActivitiesCardProps {
  /**
   * Array of recent activities to display
   * If not provided, uses placeholder data
   */
  activities?: RecentActivity[];
  
  /**
   * Maximum number of activities to show
   * @default 5
   */
  maxItems?: number;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Error state
   */
  error?: string;
}

// Placeholder data matching Figma design
const PLACEHOLDER_ACTIVITIES: RecentActivity[] = [
  {
    id: 'placeholder-1',
    title: 'Moving Out Days',
    subtitle: 'Announcement was created',
    timestamp: 'Now',
    type: 'announcement',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'placeholder-2',
    title: 'November 2025 Payslip',
    subtitle: 'Has been uploaded',
    timestamp: '1h',
    type: 'payslip',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
];

/**
 * Recent Activities Card Component
 * 
 * Displays a card with recent activities (announcements, payslips, etc.)
 * for the HR dashboard.
 * 
 * Figma specs (node 428:2808 "Recent Activities"):
 * - Container: white bg, rounded-12px, shadow, padding 24px
 * - Title: text-lg/semibold, neutral-700, leading-22px
 * - Activities: flex-col, gap between items
 * - Activity items: border-bottom divider (except last)
 * 
 * @example
 * ```tsx
 * <RecentActivitiesCard
 *   activities={[
 *     {
 *       id: '1',
 *       title: 'Moving Out Days',
 *       subtitle: 'Announcement was created',
 *       timestamp: 'Now',
 *       type: 'announcement'
 *     }
 *   ]}
 * />
 * ```
 */
const RecentActivitiesCard = memo(function RecentActivitiesCard({
  activities,
  maxItems = 5,
  loading = false,
  error,
}: RecentActivitiesCardProps) {
  // Use placeholder data if no activities provided
  const activitiesToDisplay = activities ?? PLACEHOLDER_ACTIVITIES;
  
  // Limit activities to maxItems
  const displayedActivities = useMemo(() => {
    return activitiesToDisplay.slice(0, maxItems);
  }, [activitiesToDisplay, maxItems]);

  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[20px] px-[24px] relative rounded-[12px] shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] size-full"
      data-name="Recent Activities"
      data-node-id="428:2808"
    >
      {/* Title */}
      <div
        className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full"
        data-name="Title"
        data-node-id="428:2809"
      >
        <p
          className="font-semibold leading-[22px] relative shrink-0 text-neutral-700 text-lg text-nowrap whitespace-pre"
          data-node-id="428:2811"
        >
          Recent Activities
        </p>
      </div>

      {/* Activities Group */}
      <div
        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
        data-name="Activities Group"
        data-node-id="428:2812"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8 text-neutral-500">
            Loading activities...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500">
            {error}
          </div>
        ) : displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`${
                index < displayedActivities.length - 1
                  ? 'border-b border-neutral-100 pb-[18px]'
                  : 'pt-[18px]'
              } box-border content-stretch flex gap-[8px] items-center relative shrink-0 w-full`}
              data-name="Activity Item Container"
              data-node-id={index === 0 ? '428:2813' : '428:2825'}
            >
              <ActivityItem
                title={activity.title}
                subtitle={activity.subtitle}
                timestamp={activity.timestamp}
                type={activity.type}
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8 text-neutral-500">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );
});

RecentActivitiesCard.displayName = 'RecentActivitiesCard';

export default RecentActivitiesCard;

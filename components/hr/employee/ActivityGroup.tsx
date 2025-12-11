'use client';

import { memo } from 'react';
import { CalendarOutlineIcon } from '@/components/icons';
import ActivityCard, { type ActivityType, type ActivityCardProps } from './ActivityCard';
import type { ActivityStatus } from './ActivityStatusBadge';

export interface ActivityEntry {
  /**
   * Unique identifier
   */
  id: string;
  
  /**
   * Type of activity
   */
  type: ActivityType;
  
  /**
   * Time of the activity
   */
  time: string;
  
  /**
   * Status of the activity
   */
  status: ActivityStatus;
}

export interface ActivityGroupProps {
  /**
   * Date label (e.g., "Today", "Yesterday", "December 6")
   */
  dateLabel: string;
  
  /**
   * List of activities for this date
   */
  activities: ActivityEntry[];
  
  /**
   * Whether to show the vertical timeline line
   * @default true
   */
  showTimeline?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Activity Group Component
 * 
 * Groups activities by date with a date header, vertical timeline line,
 * and activity cards.
 * Based on Figma design node 587:1544-587:1630.
 * 
 * Features:
 * - Date header with calendar icon
 * - Vertical dashed timeline line
 * - Activity cards for each entry
 * - Proper spacing and dividers
 * 
 * @example
 * ```tsx
 * <ActivityGroup
 *   dateLabel="Today"
 *   activities={[
 *     { id: '1', type: 'checkIn', time: '11:00', status: 'onTime' },
 *     { id: '2', type: 'checkOut', time: '19:20', status: 'overtime' },
 *   ]}
 * />
 * ```
 */
const ActivityGroup = memo(function ActivityGroup({
  dateLabel,
  activities,
  showTimeline = true,
  className = '',
}: ActivityGroupProps) {
  return (
    <div
      className={`flex flex-col gap-[12px] items-start w-full ${className}`}
      data-name="Activity"
    >
      {/* Date Header */}
      <div className="flex gap-[4px] items-center" data-name="Date Container">
        <CalendarOutlineIcon size={16} className="text-[#737373] shrink-0" />
        <p
          className="font-sans font-medium leading-[20px] text-[#525252] text-[16px] text-nowrap whitespace-pre"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {dateLabel}
        </p>
      </div>

      {/* Activities + Timeline */}
      <div className="flex gap-[10px] items-start w-full" data-name="Activities + Line">
        {/* Vertical Timeline Line */}
        <div
          className={`flex flex-col items-start pl-[8px] pr-0 py-0 self-stretch shrink-0 w-[16px] ${showTimeline ? '' : 'opacity-0'}`}
          data-name="Line Container"
        >
          <div
            className="grow min-h-px w-full border-l border-dashed border-[#a1a1a1]"
            data-name="Line"
          />
        </div>

        {/* Activities Card */}
        <div
          className="flex-1 bg-[rgba(255,255,255,0.6)] flex flex-col items-start min-w-0 overflow-hidden p-[12px] rounded-[12px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)]"
          data-name="Activities"
        >
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              type={activity.type}
              time={activity.time}
              status={activity.status}
              showDivider={index > 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

ActivityGroup.displayName = 'ActivityGroup';

export default ActivityGroup;






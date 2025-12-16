'use client';

import { memo } from 'react';
import CheckInIcon from '@/components/icons/shared/CheckInIcon';
import CheckoutIcon from '@/components/icons/shared/CheckoutIcon';
import ActivityStatusBadge, { type ActivityStatus } from './ActivityStatusBadge';

export type ActivityType = 'checkIn' | 'checkOut';

export interface ActivityCardProps {
  /**
   * Type of activity
   */
  type: ActivityType;
  
  /**
   * Time of the activity (e.g., "11:00", "19:20")
   */
  time: string;
  
  /**
   * Status of the activity
   */
  status: ActivityStatus;
  
  /**
   * Whether this is the first item in a group with multiple activities
   * First item gets border-bottom, subsequent items get padding-top
   * @default false
   */
  isFirst?: boolean;

  /**
   * Whether this is the only activity in the group
   * Single items have no border or extra padding
   * @default false
   */
  isSingle?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Activity Card Component
 * 
 * A single check-in or check-out activity entry.
 * Based on Figma design node 587:1552-587:1572.
 * 
 * Features:
 * - Icon container (32x32px, neutral-100 bg)
 * - Activity label ("Checked In" / "Checked Out")
 * - Time display
 * - Status badge (On Time, Late, Overtime)
 * - Optional divider for multiple activities
 * 
 * @example
 * ```tsx
 * <ActivityCard
 *   type="checkIn"
 *   time="11:00"
 *   status="onTime"
 * />
 * ```
 */
const ActivityCard = memo(function ActivityCard({
  type,
  time,
  status,
  isFirst = false,
  isSingle = false,
  className = '',
}: ActivityCardProps) {
  const isCheckIn = type === 'checkIn';
  const label = isCheckIn ? 'Checked In' : 'Checked Out';
  const Icon = isCheckIn ? CheckInIcon : CheckoutIcon;

  // Single item: no border, no extra padding
  // First item (in multi): has border-bottom and pb-[12px]
  // Subsequent items: has pt-[10px], no border
  const containerClasses = isSingle
    ? ''
    : isFirst
      ? 'pb-[12px] border-b border-solid border-[#f5f5f5]'
      : 'pt-[10px]';

  return (
    <div
      className={`flex gap-[8px] items-center w-full ${containerClasses} ${className}`}
      data-name={isCheckIn ? 'Check In' : 'Check Out'}
      >
        {/* Icon Container */}
        <div
          className={`overflow-clip relative ${isCheckIn ? 'rounded-[8px]' : 'rounded-[9px]'} shrink-0 size-[32px]`}
          data-name={isCheckIn ? 'Illustration/Check In' : 'Illustration/Check Out'}
        >
          <div className="absolute bg-[#f5f5f5] left-0 rounded-[6px] size-[32px] top-0" />
          <div className="absolute left-[7px] top-[7px] flex items-center justify-center">
            <Icon size={18} className="text-[#737373]" />
          </div>
        </div>

        {/* Contents + Badge */}
        <div className="flex-1 flex items-start min-w-0" data-name="Contents + Badge">
          {/* Contents */}
          <div className="flex-1 flex flex-col items-start min-w-0" data-name="Contents">
            <p
              className="font-sans font-medium leading-[16px] text-[#737373] text-[12px] w-full"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {label}
            </p>
            <p
              className="font-sans font-semibold leading-[18px] text-[#404040] text-[14px] w-full"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {time}
            </p>
          </div>

          {/* Status Badge */}
          <ActivityStatusBadge status={status} />
        </div>
      </div>
  );
});

ActivityCard.displayName = 'ActivityCard';

export default ActivityCard;













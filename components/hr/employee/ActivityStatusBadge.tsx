'use client';

import { memo } from 'react';

export type ActivityStatus = 'onTime' | 'late' | 'overtime';

export interface ActivityStatusBadgeProps {
  /**
   * The status to display
   */
  status: ActivityStatus;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Activity Status Badge Component
 * 
 * A status badge for check-in/check-out activities.
 * Based on Figma design node 587:1558-587:1572.
 * 
 * Status colors:
 * - On Time: Green (bg-[#f0fdf4], text-[#00a63e])
 * - Late: Amber (bg-[#fffbeb], text-[#e17100])
 * - Overtime: Neutral (bg-[#f5f5f5], text-[#525252])
 * 
 * @example
 * ```tsx
 * <ActivityStatusBadge status="onTime" />
 * <ActivityStatusBadge status="late" />
 * <ActivityStatusBadge status="overtime" />
 * ```
 */
const ActivityStatusBadge = memo(function ActivityStatusBadge({
  status,
  className = '',
}: ActivityStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'onTime':
        return {
          bg: 'bg-[#f0fdf4]', // green-50
          text: 'text-[#00a63e]', // green-600
          label: 'On Time',
          tracking: 'tracking-[-0.24px]',
        };
      case 'late':
        return {
          bg: 'bg-[#fffbeb]', // amber-50
          text: 'text-[#e17100]', // amber-600
          label: 'Late',
          tracking: 'tracking-[-0.06px]',
        };
      case 'overtime':
        return {
          bg: 'bg-[#f5f5f5]', // neutral-100
          text: 'text-[#525252]', // neutral-600
          label: 'Overtime',
          tracking: 'tracking-[-0.06px]',
        };
      default:
        return {
          bg: 'bg-[#f0fdf4]',
          text: 'text-[#00a63e]',
          label: 'On Time',
          tracking: 'tracking-[-0.24px]',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`${config.bg} flex flex-col items-start px-[4px] py-[2px] rounded-[12px] shrink-0 ${className}`}
      data-name="Badge"
    >
      <div className="flex items-center" data-name="Attendance Badge">
        <div className="flex items-center justify-center px-[4px] py-0">
          <p
            className={`font-sans font-semibold leading-normal text-[12px] ${config.text} ${config.tracking} text-nowrap whitespace-pre`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {config.label}
          </p>
        </div>
      </div>
    </div>
  );
});

ActivityStatusBadge.displayName = 'ActivityStatusBadge';

export default ActivityStatusBadge;






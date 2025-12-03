'use client';

import { memo } from 'react';
import {
  CircleCheckIcon,
  TriangleWarningIcon,
  ClockIcon,
} from '@/components/icons';

export type AttendanceFeedStatus = 'On Time' | 'Late' | 'Left Early' | 'Overtime';

export interface AttendanceFeedBadgeProps {
  /**
   * Attendance status to display
   * @default "On Time"
   */
  status?: AttendanceFeedStatus;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Attendance Feed Badge Component
 *
 * A badge component for displaying attendance status in the HR dashboard's Attendance Feed section.
 * Each status has a specific color scheme and icon:
 * - "On Time": Green background with circle-check icon
 * - "Late": Amber background with triangle-warning icon
 * - "Left Early": Amber background with triangle-warning icon
 * - "Overtime": Neutral background with clock icon
 *
 * Figma specs (node 451:970-451:985):
 * - Container: rounded-[32px], padding pl-[6px] pr-[4px] py-[2px]
 * - Icon: size-[12px]
 * - Text: text-xs, semibold, leading-[16px], px-[2px]
 *
 * Note: This component is currently in the HR directory but will eventually
 * be moved to shared components for reuse across the application.
 *
 * @example
 * ```tsx
 * <AttendanceFeedBadge status="On Time" />
 * <AttendanceFeedBadge status="Late" />
 * <AttendanceFeedBadge status="Overtime" />
 * ```
 */
const AttendanceFeedBadge = memo(function AttendanceFeedBadge({
  status = 'On Time',
  className = '',
}: AttendanceFeedBadgeProps) {
  // Determine styles and icon based on status
  const getStatusConfig = () => {
    switch (status) {
      case 'On Time':
        return {
          bg: 'bg-[#f0fdf4]', // green-50
          text: 'text-[#00a63e]', // green-600
          icon: <CircleCheckIcon size={12} className="text-[#00a63e]" />,
        };
      case 'Late':
        return {
          bg: 'bg-[#fffbeb]', // amber-50
          text: 'text-[#e17100]', // amber-600
          icon: <TriangleWarningIcon size={12} className="text-[#e17100]" />,
        };
      case 'Left Early':
        return {
          bg: 'bg-[#fffbeb]', // amber-50
          text: 'text-[#e17100]', // amber-600
          icon: <TriangleWarningIcon size={12} className="text-[#e17100]" />,
        };
      case 'Overtime':
        return {
          bg: 'bg-[#f5f5f5]', // neutral-100
          text: 'text-[#737373]', // neutral-500
          icon: <ClockIcon size={12} className="text-[#737373]" />,
        };
      default:
        return {
          bg: 'bg-[#f0fdf4]',
          text: 'text-[#00a63e]',
          icon: <CircleCheckIcon size={12} className="text-[#00a63e]" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`${config.bg} box-border content-stretch flex items-center pl-[6px] pr-[4px] py-[2px] relative rounded-[32px] ${className}`}
      data-name={`Status=${status}`}
      data-node-id={status === 'On Time' ? '451:970' : status === 'Late' ? '451:978' : status === 'Left Early' ? '451:982' : '451:974'}
    >
      {/* Icon Container */}
      <div
        className="overflow-clip relative shrink-0 size-[12px] flex items-center justify-center"
        data-name={
          status === 'On Time'
            ? 'circle-check, check radio, circle, checkbox, check, checkmark, confirm'
            : status === 'Overtime'
            ? 'clock-alert, timer'
            : 'triangle-exclamation, error, warning, alert'
        }
        data-node-id={
          status === 'On Time'
            ? '451:971'
            : status === 'Late'
            ? '451:979'
            : status === 'Left Early'
            ? '451:983'
            : '451:975'
        }
      >
        {config.icon}
      </div>

      {/* Text Container */}
      <div
        className="box-border content-stretch flex gap-[10px] items-center justify-center px-[2px] py-0 relative shrink-0"
        data-node-id={
          status === 'On Time'
            ? '451:972'
            : status === 'Late'
            ? '451:980'
            : status === 'Left Early'
            ? '451:984'
            : '451:976'
        }
      >
        <p
          className={`font-semibold leading-[16px] relative shrink-0 ${config.text} text-xs text-nowrap whitespace-pre`}
          data-node-id={
            status === 'On Time'
              ? '451:973'
              : status === 'Late'
              ? '451:981'
              : status === 'Left Early'
              ? '451:985'
              : '451:977'
          }
        >
          {status}
        </p>
      </div>
    </div>
  );
});

AttendanceFeedBadge.displayName = 'AttendanceFeedBadge';

export default AttendanceFeedBadge;




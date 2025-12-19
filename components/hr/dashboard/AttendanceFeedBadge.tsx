'use client';

import { memo } from 'react';
import UnifiedBadge, { type UnifiedBadgeColor } from '@/components/shared/UnifiedBadge';
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

// Map statuses to UnifiedBadge configuration
const statusConfig: Record<AttendanceFeedStatus, {
  color: UnifiedBadgeColor;
  icon: React.ReactNode;
}> = {
  'On Time': {
    color: 'success',
    icon: <CircleCheckIcon size={12} className="text-[#00a63e]" />,
  },
  'Late': {
    color: 'warning',
    icon: <TriangleWarningIcon size={12} className="text-[#e17100]" />,
  },
  'Left Early': {
    color: 'warning',
    icon: <TriangleWarningIcon size={12} className="text-[#e17100]" />,
  },
  'Overtime': {
    color: 'neutral',
    icon: <ClockIcon size={12} className="text-[#737373]" />,
  },
};

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
 * Now uses UnifiedBadge internally for consistent styling.
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
  const config = statusConfig[status];

  return (
    <UnifiedBadge
      text={status}
      color={config.color}
      hasIcon={true}
      icon={config.icon}
      size="md"
      font="semibold"
      className={className}
    />
  );
});

AttendanceFeedBadge.displayName = 'AttendanceFeedBadge';

export default AttendanceFeedBadge;







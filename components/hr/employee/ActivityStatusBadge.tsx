'use client';

import { memo } from 'react';
import UnifiedBadge, { type UnifiedBadgeColor } from '@/components/shared/UnifiedBadge';

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

// Map activity statuses to UnifiedBadge colors and labels
const statusConfig: Record<ActivityStatus, { color: UnifiedBadgeColor; label: string }> = {
  onTime: { color: 'success', label: 'On Time' },
  late: { color: 'warning', label: 'Late' },
  overtime: { color: 'neutral', label: 'Overtime' },
};

/**
 * Activity Status Badge Component
 * 
 * A status badge for check-in/check-out activities.
 * Based on Figma design node 587:1558-587:1572.
 * 
 * Now uses UnifiedBadge internally for consistent styling.
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
  const config = statusConfig[status];

  return (
    <UnifiedBadge
      text={config.label}
      color={config.color}
      size="sm"
      font="semibold"
      padding="compact"
      className={className}
    />
  );
});

ActivityStatusBadge.displayName = 'ActivityStatusBadge';

export default ActivityStatusBadge;













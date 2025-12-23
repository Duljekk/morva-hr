'use client';

import { memo } from 'react';
import CheckInIcon from '@/components/icons/shared/CheckInIcon';

export interface CheckInIllustrationProps {
  /**
   * Size of the illustration container in pixels
   * @default 32
   */
  size?: number;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * Check In Illustration Component
 * 
 * A check-in illustration with a neutral background container and CheckInIcon.
 * Based on Figma design node 735:1602 - "Illustration/Check In".
 * Used in employee RecentActivities component.
 * 
 * @example
 * ```tsx
 * <CheckInIllustration size={32} />
 * ```
 */
const CheckInIllustration = memo(function CheckInIllustration({
  size = 32,
  className = '',
}: CheckInIllustrationProps) {
  // Icon size is 18px for 32px container (56.25% of container)
  const iconSize = Math.round(size * 0.5625);
  
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg bg-neutral-100 ${className}`}
      style={{ width: size, height: size }}
      data-name="Illustration/Check In"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <CheckInIcon size={iconSize} className="text-neutral-500" />
      </div>
    </div>
  );
});

CheckInIllustration.displayName = 'CheckInIllustration';

export default CheckInIllustration;

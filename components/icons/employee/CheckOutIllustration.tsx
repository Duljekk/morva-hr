'use client';

import { memo } from 'react';
import CheckoutIcon from '@/components/icons/shared/CheckoutIcon';

export interface CheckOutIllustrationProps {
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
 * Check Out Illustration Component
 * 
 * A check-out illustration with a neutral background container and CheckoutIcon.
 * Based on Figma design - "Illustration/Check Out".
 * Used in employee RecentActivities component.
 * 
 * @example
 * ```tsx
 * <CheckOutIllustration size={32} />
 * ```
 */
const CheckOutIllustration = memo(function CheckOutIllustration({
  size = 32,
  className = '',
}: CheckOutIllustrationProps) {
  // Icon size is 18px for 32px container (56.25% of container)
  const iconSize = Math.round(size * 0.5625);
  
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg bg-neutral-100 ${className}`}
      style={{ width: size, height: size }}
      data-name="Illustration/Check Out"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <CheckoutIcon size={iconSize} className="text-neutral-500" />
      </div>
    </div>
  );
});

CheckOutIllustration.displayName = 'CheckOutIllustration';

export default CheckOutIllustration;

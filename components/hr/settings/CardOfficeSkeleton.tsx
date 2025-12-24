'use client';

import { memo } from 'react';

export interface CardOfficeSkeletonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CardOfficeSkeleton Component
 *
 * Skeleton loading state for CardOffice component.
 * Matches the structure and layout of CardOffice with animated placeholders.
 *
 * Layout structure:
 * - Icon container placeholder (40x40, rounded-lg)
 * - Location name placeholder (neutral-200)
 * - Address placeholder (neutral-100)
 * - Radio button placeholder (top-right position)
 *
 * Styling:
 * - rounded-2xl border-radius (16px)
 * - p-5 padding (20px)
 * - animate-pulse for shimmer effect
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3
 */
const CardOfficeSkeleton = memo(function CardOfficeSkeleton({
  className = '',
}: CardOfficeSkeletonProps) {
  return (
    <div
      className={`
        flex flex-col gap-3 items-start
        p-5 rounded-2xl
        w-full
        relative overflow-clip
        bg-white shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
        animate-pulse
        ${className}
      `.trim()}
      aria-busy="true"
      aria-live="polite"
      data-name="CardOffice Skeleton"
    >
      {/* Icon Container Placeholder - 40x40, rounded-lg */}
      <div className="size-10 rounded-lg shrink-0 bg-neutral-200" />

      {/* Contents Placeholder */}
      <div className="flex flex-col gap-1.5 items-start w-full">
        {/* Location Name Placeholder - neutral-200 */}
        <div className="h-5 w-[140px] bg-neutral-200 rounded" />

        {/* Address Placeholder - neutral-100 */}
        <div className="h-5 w-full max-w-[280px] bg-neutral-100 rounded" />
      </div>

      {/* Radio Button Placeholder - top-right position */}
      <div className="absolute top-4 right-4">
        <div className="size-5 rounded-full bg-neutral-200" />
      </div>
    </div>
  );
});

CardOfficeSkeleton.displayName = 'CardOfficeSkeleton';

export default CardOfficeSkeleton;

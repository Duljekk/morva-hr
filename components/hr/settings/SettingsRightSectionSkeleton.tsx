'use client';

import { memo } from 'react';
import CardOfficeSkeleton from './CardOfficeSkeleton';

export interface SettingsRightSectionSkeletonProps {
  /**
   * Number of CardOffice skeletons to display
   * @default 3
   */
  count?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SettingsRightSectionSkeleton Component
 *
 * Skeleton loading state for SettingsRightSection component.
 * Matches the structure and layout of SettingsRightSection with animated placeholders.
 *
 * Layout structure:
 * - "Office" title as static text (not skeleton)
 * - Input field placeholder (222px width)
 * - "Add Location" button placeholder
 * - Configurable count of CardOfficeSkeleton components (default: 3)
 *
 * Styling:
 * - animate-pulse for shimmer effect on placeholders
 * - Matches gap and spacing of actual component
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3
 */
const SettingsRightSectionSkeleton = memo(function SettingsRightSectionSkeleton({
  count = 3,
  className = '',
}: SettingsRightSectionSkeletonProps) {
  return (
    <div
      className={`
        flex flex-[1_0_0] flex-col gap-[18px] h-full items-start min-h-0 min-w-0 w-full
        ${className}
      `.trim()}
      aria-busy="true"
      aria-live="polite"
      data-name="SettingsRightSection Skeleton"
    >
      {/* Header + Input */}
      <div className="flex items-center justify-between w-full">
        {/* Title - Static text (Requirement 3.1) */}
        <h2 className="font-['Mona_Sans'] text-xl font-semibold leading-[30px] tracking-[-0.2px] text-[#404040]">
          Office
        </h2>

        {/* Google Maps Input Placeholder */}
        <div className="flex items-center gap-2 animate-pulse">
          {/* Input Field Placeholder - 222px width (Requirement 3.2) */}
          <div className="w-[222px] h-10 bg-neutral-200 rounded-lg" />

          {/* Add Location Button Placeholder (Requirement 3.3) */}
          <div className="h-10 px-5 py-1.5 bg-neutral-200 rounded-lg">
            <span className="font-['Mona_Sans'] text-sm font-semibold leading-[18px] text-transparent whitespace-nowrap">
              Add Location
            </span>
          </div>
        </div>
      </div>

      {/* Card Groups - CardOfficeSkeleton components (Requirement 3.4) */}
      <div className="flex flex-col gap-[18px] items-start w-full">
        {Array.from({ length: count }, (_, index) => (
          <CardOfficeSkeleton key={index} />
        ))}
      </div>
    </div>
  );
});

SettingsRightSectionSkeleton.displayName = 'SettingsRightSectionSkeleton';

export default SettingsRightSectionSkeleton;

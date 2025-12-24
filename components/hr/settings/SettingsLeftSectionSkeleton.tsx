'use client';

import { memo } from 'react';

export interface SettingsLeftSectionSkeletonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SettingsLeftSectionSkeleton Component
 *
 * Skeleton loading state for SettingsLeftSection component.
 * Matches the structure and layout of SettingsLeftSection with animated placeholders.
 *
 * Layout structure:
 * - Banner placeholder (84px height, sky-50 background)
 * - Circular logo placeholder (96x96)
 * - Company name placeholder (neutral-200)
 * - Industry placeholder (neutral-100)
 * - Website link placeholder with icon spacing
 * - Email placeholder with icon spacing
 *
 * Styling:
 * - rounded-[20px] border-radius
 * - Shadow: 0px 4px 4px -2px rgba(0,0,0,0.05), 0px 0px 1px 1px rgba(0,0,0,0.1)
 * - animate-pulse for shimmer effect
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3
 */
const SettingsLeftSectionSkeleton = memo(function SettingsLeftSectionSkeleton({
  className = '',
}: SettingsLeftSectionSkeletonProps) {
  return (
    <div
      className={`
        bg-white
        flex flex-col
        gap-7
        items-center justify-center
        overflow-clip
        pb-7 pt-9 px-7
        relative
        rounded-[20px]
        shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
        w-full
        animate-pulse
        ${className}
      `.trim()}
      aria-busy="true"
      aria-live="polite"
      data-name="SettingsLeftSection Skeleton"
    >
      {/* Banner Placeholder - 84px height, sky-50 background */}
      <div className="absolute bg-[#f0f9ff] h-[84px] left-0 top-0 w-full">
        {/* Ghost Button Placeholder */}
        <div className="absolute right-[6px] top-[6px] rounded-lg size-7 bg-neutral-200" />
      </div>

      {/* Section Contents */}
      <div className="flex flex-col gap-3.5 items-start w-full z-10">
        {/* Header */}
        <div className="flex flex-col gap-2 items-start w-full">
          {/* Company Logo Placeholder - 96x96 circular */}
          <div className="rounded-full size-24 shrink-0 bg-neutral-200" />

          {/* Contents - Name + Industry Placeholders */}
          <div className="flex flex-col gap-1 items-start w-full">
            {/* Company Name Placeholder - neutral-200 */}
            <div className="h-[30px] w-[160px] bg-neutral-200 rounded" />

            {/* Industry Placeholder - neutral-100 */}
            <div className="h-5 w-[120px] bg-neutral-100 rounded" />
          </div>
        </div>

        {/* Link & Email Placeholders */}
        <div className="flex gap-2 items-center w-full flex-wrap">
          {/* Website Link Placeholder with icon spacing */}
          <div className="flex gap-1 items-center">
            {/* Icon placeholder */}
            <div className="size-3.5 bg-neutral-100 rounded" />
            {/* Text placeholder */}
            <div className="h-5 w-[100px] bg-neutral-100 rounded" />
          </div>

          {/* Email Placeholder with icon spacing */}
          <div className="flex gap-1 items-center">
            {/* Icon placeholder */}
            <div className="size-3.5 bg-neutral-100 rounded" />
            {/* Text placeholder */}
            <div className="h-5 w-[130px] bg-neutral-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
});

SettingsLeftSectionSkeleton.displayName = 'SettingsLeftSectionSkeleton';

export default SettingsLeftSectionSkeleton;

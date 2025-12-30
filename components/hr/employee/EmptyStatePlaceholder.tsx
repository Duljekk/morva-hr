'use client';

import { memo } from 'react';
import EmptyState2Illustration from '@/app/assets/icons/empty-state-2.svg';

export interface EmptyStatePlaceholderProps {
  /** Month name (e.g., "December") */
  month: string;
  /** Year (e.g., 2025) */
  year: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * EmptyStatePlaceholder Component
 * 
 * A placeholder component displayed when no attendance statistics data exists
 * for the selected month and year period.
 * 
 * Based on Figma design node 809:2415.
 * 
 * Features:
 * - Centered illustration using empty-state-2.svg (143x96px)
 * - Title: "No statistics for this period"
 * - Subtitle explaining no attendance during selected month
 */
const EmptyStatePlaceholder = memo(function EmptyStatePlaceholder({
  month,
  year,
  className = '',
}: EmptyStatePlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${className}`.trim()}
      data-name="EmptyStatePlaceholder"
      data-node-id="809:2415"
      role="status"
      aria-label={`No statistics for ${month} ${year}`}
    >
      <div className="flex flex-col gap-5 items-center justify-center w-[286px]" data-node-id="809:2416">
        {/* Illustration - SVG actual size is 148x96 */}
        <div className="flex items-center justify-center" data-node-id="809:2442">
          <EmptyState2Illustration width={148} height={96} />
        </div>

        {/* Text */}
        <div
          className="flex flex-col gap-[6px] items-center text-center text-sm w-[286px]"
          data-node-id="809:2427"
        >
          <p
            className="font-medium leading-[18px] text-neutral-700"
            data-node-id="809:2428"
          >
            No statistics for this period
          </p>
          <p
            className="leading-5 text-neutral-500"
            data-node-id="809:2429"
          >
            This employee didn't record any attendance during the selected month.
          </p>
        </div>
      </div>
    </div>
  );
});

EmptyStatePlaceholder.displayName = 'EmptyStatePlaceholder';

export default EmptyStatePlaceholder;

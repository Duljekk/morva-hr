'use client';

import { memo } from 'react';

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
 * Based on Requirements 3.1, 3.2:
 * - Displays when no Attendance_Records exist for the selected month and year
 * - Shows a message indicating no data is available for the selected period
 * 
 * Styling follows existing empty state patterns in the codebase:
 * - Centered text with neutral-500 color
 * - Consistent padding and typography
 */
const EmptyStatePlaceholder = memo(function EmptyStatePlaceholder({
  month,
  year,
  className = '',
}: EmptyStatePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center w-full py-8 px-4 bg-white rounded-xl border border-dashed border-neutral-200 ${className}`.trim()}
      data-name="EmptyStatePlaceholder"
      role="status"
      aria-label={`No attendance data for ${month} ${year}`}
    >
      <p className="text-neutral-500 text-sm text-center">
        No attendance data for {month} {year}
      </p>
    </div>
  );
});

EmptyStatePlaceholder.displayName = 'EmptyStatePlaceholder';

export default EmptyStatePlaceholder;

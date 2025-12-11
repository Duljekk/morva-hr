import { memo } from 'react';

export interface CalendarOutlineIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16px
   */
  size?: number | string;
}

/**
 * Calendar Outline Icon Component
 *
 * An outline/stroke-based calendar icon typically used for date selection,
 * scheduling, and calendar-related functionality. This is the outline variant
 * of the calendar icon, suitable for lighter UI contexts.
 *
 * @example
 * ```tsx
 * <CalendarOutlineIcon className="text-neutral-500" />
 * ```
 */
const CalendarOutlineIcon = memo(function CalendarOutlineIcon({
  size = 16,
  className = '',
  ...props
}: CalendarOutlineIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.5 6.50016H13.5M5.16667 3.16683V1.8335M10.8333 3.16683V1.8335M3.83333 13.5002H12.1667C12.903 13.5002 13.5 12.9032 13.5 12.1668V4.50016C13.5 3.76378 12.903 3.16683 12.1667 3.16683H3.83333C3.09695 3.16683 2.5 3.76378 2.5 4.50016V12.1668C2.5 12.9032 3.09695 13.5002 3.83333 13.5002Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

CalendarOutlineIcon.displayName = 'CalendarOutlineIcon';

export default CalendarOutlineIcon;




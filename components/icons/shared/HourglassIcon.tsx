import { memo } from 'react';

export interface HourglassIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 18px
   */
  size?: number | string;
}

/**
 * Hourglass Icon Component
 *
 * An hourglass icon typically used for time periods, date ranges, and duration indicators.
 *
 * @example
 * ```tsx
 * <HourglassIcon className="text-neutral-500" />
 * ```
 */
const HourglassIcon = memo(function HourglassIcon({
  size = 18,
  className = '',
  ...props
}: HourglassIconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 9L5.00392 6.44251C4.57312 6.1668 4.3125 5.69058 4.3125 5.1791V2.0625H13.6875V5.1791C13.6875 5.69058 13.4269 6.1668 12.9961 6.44251L9 9ZM9 9L12.9961 11.5575C13.4269 11.8332 13.6875 12.3094 13.6875 12.8209V15.9375H4.3125V12.8209C4.3125 12.3094 4.57312 11.8332 5.00392 11.5575L9 9ZM15.1875 15.9375H2.8125M15.1875 2.0625H2.8125"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

HourglassIcon.displayName = 'HourglassIcon';

export default HourglassIcon;













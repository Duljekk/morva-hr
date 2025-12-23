import { memo } from 'react';

export interface ClockOutlineIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 14
   */
  size?: number | string;
}

/**
 * Clock Outline Icon Component
 *
 * An outline/stroke-based clock icon typically used for timestamps, schedules, and time-related information.
 * This is the outline variant of the clock icon, suitable for lighter UI contexts.
 *
 * @example
 * ```tsx
 * <ClockOutlineIcon className="text-neutral-500" />
 * ```
 */
const ClockOutlineIcon = memo(function ClockOutlineIcon({
  size = 14,
  className = '',
  ...props
}: ClockOutlineIconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.99984 4.52116V7.00033L8.604 8.60449M12.3957 7.00033C12.3957 9.98036 9.97987 12.3962 6.99984 12.3962C4.0198 12.3962 1.604 9.98036 1.604 7.00033C1.604 4.02029 4.0198 1.60449 6.99984 1.60449C9.97987 1.60449 12.3957 4.02029 12.3957 7.00033Z"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

ClockOutlineIcon.displayName = 'ClockOutlineIcon';

export default ClockOutlineIcon;

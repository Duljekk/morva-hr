import { memo } from 'react';

export interface Clock18IconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 18px
   */
  size?: number | string;
}

/**
 * Clock 18 Icon Component
 *
 * A clock/time icon (18px version) typically used for timestamps, schedules, and time-related information.
 *
 * @example
 * ```tsx
 * <Clock18Icon className="text-neutral-500" />
 * ```
 */
const Clock18Icon = memo(function Clock18Icon({
  size = 18,
  className = '',
  ...props
}: Clock18IconProps) {
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
        d="M9 5.8125V9L11.0625 11.0625M15.9375 9C15.9375 12.8315 12.8315 15.9375 9 15.9375C5.16852 15.9375 2.0625 12.8315 2.0625 9C2.0625 5.16852 5.16852 2.0625 9 2.0625C12.8315 2.0625 15.9375 5.16852 15.9375 9Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

Clock18Icon.displayName = 'Clock18Icon';

export default Clock18Icon;






import { memo } from 'react';

export interface ClockIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 12
   */
  size?: number | string;
}

/**
 * Clock Icon Component
 *
 * A clock/time icon typically used for timestamps, schedules, and time-related information.
 *
 * @example
 * ```tsx
 * <ClockIcon className="w-4 h-4 text-neutral-500" />
 * ```
 */
const ClockIcon = memo(function ClockIcon({
  size = 12,
  className = '',
  ...props
}: ClockIconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.646569 2.27145C0.451307 2.46671 0.451307 2.78329 0.646569 2.97855C0.841831 3.17382 1.15841 3.17382 1.35368 2.97855L2.85368 1.47855C3.04894 1.28329 3.04894 0.966709 2.85368 0.771447C2.65841 0.576184 2.34183 0.576184 2.14657 0.771447L0.646569 2.27145Z"
        fill="currentColor"
      />
      <path
        d="M9.85368 0.771447C9.65841 0.576184 9.34183 0.576184 9.14657 0.771447C8.95131 0.966709 8.95131 1.28329 9.14657 1.47855L10.6466 2.97855C10.8418 3.17382 11.1584 3.17382 11.3537 2.97855C11.5489 2.78329 11.5489 2.46671 11.3537 2.27145L9.85368 0.771447Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 6C11 8.76142 8.76147 11 6.00005 11C3.23862 11 1.00005 8.76142 1.00005 6C1.00005 3.23858 3.23862 1 6.00005 1C8.76147 1 11 3.23858 11 6ZM6.00005 3.5C6.27619 3.5 6.50005 3.72386 6.50005 4V5.79289L7.6036 6.89645C7.79886 7.09171 7.79886 7.40829 7.6036 7.60355C7.40834 7.79882 7.09176 7.79882 6.89649 7.60355L5.64649 6.35355C5.55273 6.25979 5.50005 6.13261 5.50005 6V4C5.50005 3.72386 5.7239 3.5 6.00005 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
});

ClockIcon.displayName = 'ClockIcon';

export default ClockIcon;



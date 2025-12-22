import { memo } from 'react';

export interface TimerIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Timer Icon Component
 *
 * A timer/stopwatch icon typically used for countdowns, time tracking, and duration displays.
 *
 * @example
 * ```tsx
 * <TimerIcon className="w-4 h-4 text-neutral-500" />
 * ```
 */
const TimerIcon = memo(function TimerIcon({
  size = 16,
  className = '',
  ...props
}: TimerIconProps) {
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
        d="M0.979454 3.14645C0.784192 3.34171 0.784192 3.65829 0.979454 3.85355C1.17472 4.04882 1.4913 4.04882 1.68656 3.85355L3.68656 1.85355C3.88182 1.65829 3.88182 1.34171 3.68656 1.14645C3.4913 0.951184 3.17472 0.951184 2.97945 1.14645L0.979454 3.14645Z"
        fill="currentColor"
      />
      <path
        d="M13.0199 1.14645C12.8246 0.951185 12.508 0.951185 12.3128 1.14645C12.1175 1.34171 12.1175 1.65829 12.3128 1.85355L14.3128 3.85355C14.508 4.04882 14.8246 4.04882 15.0199 3.85355C15.2152 3.65829 15.2152 3.34171 15.0199 3.14645L13.0199 1.14645Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6663 8C14.6663 11.6819 11.6815 14.6667 7.9996 14.6667C4.3177 14.6667 1.33293 11.6819 1.33293 8C1.33293 4.3181 4.3177 1.33333 7.9996 1.33333C11.6815 1.33333 14.6663 4.3181 14.6663 8ZM7.9996 4.66667C8.27574 4.66667 8.4996 4.89052 8.4996 5.16667V7.79289L10.1865 9.47978C10.3817 9.67504 10.3817 9.99162 10.1865 10.1869C9.99122 10.3821 9.67464 10.3821 9.47938 10.1869L7.64605 8.35355C7.55228 8.25979 7.4996 8.13261 7.4996 8V5.16667C7.4996 4.89052 7.72346 4.66667 7.9996 4.66667Z"
        fill="currentColor"
      />
    </svg>
  );
});

TimerIcon.displayName = 'TimerIcon';

export default TimerIcon;

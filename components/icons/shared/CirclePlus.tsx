import { memo, useId } from 'react';

export interface CirclePlusIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 18
   */
  size?: number | string;
}

/**
 * Circle Plus Icon Component
 *
 * A plus icon inside a circle, typically used for add/create actions.
 *
 * @example
 * ```tsx
 * <CirclePlusIcon className="w-5 h-5 text-white" />
 * ```
 */
const CirclePlusIcon = memo(function CirclePlusIcon({
  size = 18,
  className = '',
  ...props
}: CirclePlusIconProps) {
  // Generate unique ID for clipPath to avoid conflicts when multiple instances are used
  const clipPathId = useId();

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
      <defs>
        <clipPath id={clipPathId}>
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <circle
          cx="9"
          cy="9"
          r="8.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 5.25V12.75M5.25 9H12.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
});

CirclePlusIcon.displayName = 'CirclePlusIcon';

export default CirclePlusIcon;







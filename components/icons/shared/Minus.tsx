import { memo, useId } from 'react';

export interface MinusIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 10
   */
  size?: number | string;
}

/**
 * Minus Icon Component
 *
 * A simple horizontal line/minus icon typically used for indeterminate states,
 * remove actions, and subtract operations.
 *
 * @example
 * ```tsx
 * <MinusIcon className="w-4 h-4 text-white" />
 * ```
 */
const MinusIcon = memo(function MinusIcon({
  size = 10,
  className = '',
  ...props
}: MinusIconProps) {
  // Generate unique ID for clipPath to avoid conflicts when multiple instances are used
  const clipPathId = useId();

  return (
    <svg
      viewBox="0 0 10 10"
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
          <rect width="10" height="10" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M1.5625 5H8.4375"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
});

MinusIcon.displayName = 'MinusIcon';

export default MinusIcon;
















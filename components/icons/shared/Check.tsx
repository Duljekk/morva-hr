import { memo, useId } from 'react';

export interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 10
   */
  size?: number | string;
}

/**
 * Check Icon Component
 *
 * A simple checkmark icon typically used for success states, confirmations, and completed actions.
 *
 * @example
 * ```tsx
 * <CheckIcon className="w-4 h-4 text-green-600" />
 * ```
 */
const CheckIcon = memo(function CheckIcon({
  size = 10,
  className = '',
  ...props
}: CheckIconProps) {
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
          d="M1.14587 6.28906L3.75004 8.4375L8.85421 1.5625"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
});

CheckIcon.displayName = 'CheckIcon';

export default CheckIcon;



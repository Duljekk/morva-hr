import { memo, useId } from 'react';

export interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Chevron Down Icon Component
 *
 * A chevron pointing downward, typically used for dropdowns, expandable sections,
 * and navigation indicators.
 *
 * @example
 * ```tsx
 * <ChevronDownIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const ChevronDownIcon = memo(function ChevronDownIcon({
  size = 16,
  className = '',
  ...props
}: ChevronDownIconProps) {
  // Generate unique ID for clipPath to avoid conflicts when multiple instances are used
  const clipPathId = useId();

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
      <defs>
        <clipPath id={clipPathId}>
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M5.3335 6.66663L7.76446 9.09759C7.89464 9.22777 8.10569 9.22777 8.23587 9.09759L10.6668 6.66663"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
});

ChevronDownIcon.displayName = 'ChevronDownIcon';

export default ChevronDownIcon;





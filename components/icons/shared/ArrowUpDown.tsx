import { memo, useId } from 'react';

export interface ArrowUpDownIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Arrow Up Down Icon Component
 *
 * A double arrow icon with one arrow pointing up and one pointing down,
 * typically used for sorting, bidirectional movement, and expand/collapse indicators.
 *
 * @example
 * ```tsx
 * <ArrowUpDownIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const ArrowUpDownIcon = memo(function ArrowUpDownIcon({
  size = 16,
  className = '',
  ...props
}: ArrowUpDownIconProps) {
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
          d="M2.1665 5L4.47962 2.68689C4.67488 2.49162 4.99146 2.49162 5.18672 2.68689L7.49984 5M8.49984 11L10.813 13.3131C11.0082 13.5084 11.3248 13.5084 11.5201 13.3131L13.8332 11M4.83317 3.33333V13.5M11.1665 2.5V12.8333"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
});

ArrowUpDownIcon.displayName = 'ArrowUpDownIcon';

export default ArrowUpDownIcon;
















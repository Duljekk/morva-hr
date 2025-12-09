import { memo, useId } from 'react';

export interface FilterIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Filter Icon Component
 *
 * A filter/funnel icon typically used for filtering, sorting, and search functionality.
 *
 * @example
 * ```tsx
 * <FilterIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const FilterIcon = memo(function FilterIcon({
  size = 16,
  className = '',
  ...props
}: FilterIconProps) {
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
          d="M12.5 2.5H3.5C2.94772 2.5 2.5 2.94771 2.5 3.5V4.91912C2.5 5.18434 2.60536 5.43869 2.79289 5.62623L6.20711 9.04044C6.39464 9.22798 6.5 9.48233 6.5 9.74755V14.1667L9.5 13.3333V9.74755C9.5 9.48233 9.60536 9.22798 9.79289 9.04044L13.2071 5.62623C13.3946 5.43869 13.5 5.18434 13.5 4.91912V3.5C13.5 2.94772 13.0523 2.5 12.5 2.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
});

FilterIcon.displayName = 'FilterIcon';

export default FilterIcon;




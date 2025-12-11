import { memo } from 'react';

export interface ChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Chevron Right Icon Component
 *
 * A chevron pointing to the right, typically used for breadcrumbs, navigation indicators,
 * and expandable sections.
 *
 * @example
 * ```tsx
 * <ChevronRightIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const ChevronRightIcon = memo(function ChevronRightIcon({
  size = 16,
  className = '',
  ...props
}: ChevronRightIconProps) {
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
        d="M6.6665 10.6668L8.86177 8.47157C9.12212 8.21122 9.12212 7.78911 8.86177 7.52876L6.6665 5.3335"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

ChevronRightIcon.displayName = 'ChevronRightIcon';

export default ChevronRightIcon;




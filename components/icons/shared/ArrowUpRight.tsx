import { memo } from 'react';

export interface ArrowUpRightIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 8px
   */
  size?: number | string;
}

/**
 * Arrow Up Right Icon Component
 *
 * A diagonal arrow icon pointing up and to the right,
 * typically used for trend indicators, external links, and positive changes.
 *
 * @example
 * ```tsx
 * <ArrowUpRightIcon size={8} className="text-white" />
 * ```
 */
const ArrowUpRightIcon = memo(function ArrowUpRightIcon({
  size = 8,
  className = '',
  ...props
}: ArrowUpRightIconProps) {
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.99984 2.00016L2.1665 5.8335M6.1665 5.16683V2.16683C6.1665 1.98273 6.01727 1.8335 5.83317 1.8335H2.83317"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

ArrowUpRightIcon.displayName = 'ArrowUpRightIcon';

export default ArrowUpRightIcon;


import { memo } from 'react';

export interface CopyIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 14px
   */
  size?: number | string;
}

/**
 * Copy Icon Component
 *
 * A copy/duplicate icon with overlapping squares, typically used for copy-to-clipboard actions.
 *
 * @example
 * ```tsx
 * <CopyIcon className="text-neutral-400" />
 * ```
 */
const CopyIcon = memo(function CopyIcon({
  size = 14,
  className = '',
  ...props
}: CopyIconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="5.25"
        y="5.25"
        width="6.5"
        height="6.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 5.25V3.5C8.75 2.94772 8.30228 2.5 7.75 2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V7.75C2.5 8.30228 2.94772 8.75 3.5 8.75H5.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

CopyIcon.displayName = 'CopyIcon';

export default CopyIcon;


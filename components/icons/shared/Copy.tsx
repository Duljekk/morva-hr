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
      viewBox="0 -0.75 14 14"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.52083 4.52083V3.35417C4.52083 2.70983 5.04317 2.1875 5.6875 2.1875H10.6458C11.2902 2.1875 11.8125 2.70983 11.8125 3.35417V8.31833C11.8125 8.96267 11.2902 9.485 10.6458 9.485H9.47917M2.1875 5.6875V10.6458C2.1875 11.2902 2.70983 11.8125 3.35417 11.8125H8.3125C8.95683 11.8125 9.47917 11.2902 9.47917 10.6458V5.6875C9.47917 5.04317 8.95683 4.52083 8.3125 4.52083H3.35417C2.70983 4.52083 2.1875 5.04317 2.1875 5.6875Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

CopyIcon.displayName = 'CopyIcon';

export default CopyIcon;




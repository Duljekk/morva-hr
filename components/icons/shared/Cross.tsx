import { memo } from 'react';

export interface CrossIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Cross Icon Component
 *
 * A simple X/cross icon typically used for close buttons, cancel actions, and dismiss states.
 *
 * @example
 * ```tsx
 * <CrossIcon className="w-4 h-4 text-neutral-500" />
 * ```
 */
const CrossIcon = memo(function CrossIcon({
  size = 16,
  className = '',
  ...props
}: CrossIconProps) {
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
        d="M5.16663 5.16675L10.8333 10.8334M10.8333 5.16675L5.16663 10.8334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
});

CrossIcon.displayName = 'CrossIcon';

export default CrossIcon;


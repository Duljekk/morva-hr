import { memo } from 'react';

export interface BubbleInfoIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16px
   */
  size?: number | string;
}

/**
 * Bubble Info Icon Component
 *
 * A chat bubble icon with an info dot, typically used for informational sections and help text.
 * Based on Figma design with chat bubble shape.
 *
 * @example
 * ```tsx
 * <BubbleInfoIcon className="text-neutral-500" />
 * ```
 */
const BubbleInfoIcon = memo(function BubbleInfoIcon({
  size = 16,
  className = '',
  ...props
}: BubbleInfoIconProps) {
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
        d="M8 9.33333V7M6.19615 12.3224L7.57285 13.4764C7.81949 13.6832 8.17861 13.6842 8.42643 13.4789L9.8253 12.32C9.94489 12.2209 10.0953 12.1667 10.2506 12.1667H12.1667C12.903 12.1667 13.5 11.5697 13.5 10.8333V3.83333C13.5 3.09695 12.903 2.5 12.1667 2.5H3.83333C3.09695 2.5 2.5 3.09695 2.5 3.83333V10.8333C2.5 11.5697 3.09695 12.1667 3.83333 12.1667H5.76788C5.9245 12.1667 6.07612 12.2218 6.19615 12.3224Z"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <circle
        cx="0.666667"
        cy="0.666667"
        r="0.666667"
        transform="matrix(1 0 0 -1 7.3335 6)"
        fill="currentColor"
      />
    </svg>
  );
});

BubbleInfoIcon.displayName = 'BubbleInfoIcon';

export default BubbleInfoIcon;


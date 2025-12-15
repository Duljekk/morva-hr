import { memo } from 'react';

export interface InfoCircleIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16px
   */
  size?: number | string;
}

/**
 * Info Circle Icon Component
 *
 * An information icon with circle, typically used for help text, tooltips, and informational sections.
 *
 * @example
 * ```tsx
 * <InfoCircleIcon className="text-neutral-500" />
 * ```
 */
const InfoCircleIcon = memo(function InfoCircleIcon({
  size = 16,
  className = '',
  ...props
}: InfoCircleIconProps) {
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
      <circle
        cx="8"
        cy="8"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="8"
        cy="5.33333"
        r="0.666667"
        fill="currentColor"
      />
      <path
        d="M8 7.33333V11.3333"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

InfoCircleIcon.displayName = 'InfoCircleIcon';

export default InfoCircleIcon;













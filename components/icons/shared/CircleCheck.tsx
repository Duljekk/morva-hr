import { memo } from 'react';

export interface CircleCheckIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 13
   */
  size?: number | string;
}

/**
 * Circle Check Icon Component
 *
 * A checkmark icon inside a circle, typically used for success states,
 * confirmations, and completed actions.
 *
 * @example
 * ```tsx
 * <CircleCheckIcon className="w-4 h-4 text-green-600" />
 * ```
 */
const CircleCheckIcon = memo(function CircleCheckIcon({
  size = 13,
  className = '',
  ...props
}: CircleCheckIconProps) {
  return (
    <svg
      viewBox="0 0 13 13"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.01086 1.00589C3.24944 1.00318 1.00867 3.23955 1.00595 6.00097C1.00324 8.7624 3.23962 11.0032 6.00104 11.0059C8.76246 11.0086 11.0032 8.77222 11.0059 6.0108C11.0087 3.24937 8.77228 1.0086 6.01086 1.00589ZM7.89385 5.07437C8.06892 4.86082 8.03773 4.54578 7.82418 4.37071C7.61063 4.19563 7.29558 4.22682 7.12051 4.44037L5.21809 6.7609L4.60936 6.15097C4.41429 5.95552 4.09771 5.95521 3.90225 6.15028C3.7068 6.34535 3.70649 6.66193 3.90156 6.85739L4.90058 7.85837C5.00037 7.95836 5.1378 8.01146 5.27889 8.00457C5.41999 7.99767 5.55158 7.93141 5.64115 7.82216L7.89385 5.07437Z"
        fill="currentColor"
      />
    </svg>
  );
});

CircleCheckIcon.displayName = 'CircleCheckIcon';

export default CircleCheckIcon;


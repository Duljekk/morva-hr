import { memo } from 'react';

export interface CheckInIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 20px
   */
  size?: number | string;
}

/**
 * Check In Icon Component
 *
 * A check-in icon with a clock and checkmark, typically used for check-in actions and time tracking.
 *
 * @example
 * ```tsx
 * <CheckInIcon className="text-neutral-500" />
 * ```
 */
const CheckInIcon = memo(function CheckInIcon({
  size = 20,
  className = '',
  ...props
}: CheckInIconProps) {
  return (
    <svg
      viewBox="0 0 20 19"
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
        d="M9 0.111328C10.4074 0.111403 11.7394 0.434664 12.9258 1.01074L11.8994 2.7959C11.2243 3.96994 11.9588 5.41265 13.2324 5.62012L13.0508 6.50879C12.6733 8.35641 14.9261 9.56801 16.2598 8.23438L17.6992 6.7959C17.8954 7.53456 18 8.31083 18 9.11133C18 14.0817 13.9704 18.1111 9 18.1113C4.02941 18.1113 0 14.0818 0 9.11133C3.62416e-08 4.14084 4.02941 0.111328 9 0.111328ZM9 4.61133C8.50293 4.61133 8.09961 5.01476 8.09961 5.51172V9.11133C8.09961 9.35004 8.19444 9.57921 8.36328 9.74805L10.6133 11.998C10.9647 12.3491 11.5343 12.3491 11.8857 11.998C12.2372 11.6465 12.2372 11.0762 11.8857 10.7246L9.89941 8.73828V5.51172C9.89941 5.01492 9.49685 4.61159 9 4.61133Z"
        fill="currentColor"
      />
      <path
        d="M18.0234 0C18.5079 0.000205944 18.8229 0.509912 18.6064 0.943359L18.1211 1.91504C18.0903 1.9769 18.135 2.04968 18.2041 2.0498H19.124C19.7049 2.04991 19.9958 2.75229 19.585 3.16309L15.5088 7.23926C15.0515 7.69654 14.2786 7.28104 14.4082 6.64746L14.8682 4.39746C14.88 4.33971 14.8363 4.28518 14.7773 4.28516H13.6807C13.1792 4.28516 12.8654 3.74333 13.1152 3.30859L14.8291 0.327148C14.9454 0.12485 15.1612 4.56023e-05 15.3945 0H18.0234Z"
        fill="currentColor"
      />
    </svg>
  );
});

CheckInIcon.displayName = 'CheckInIcon';

export default CheckInIcon;













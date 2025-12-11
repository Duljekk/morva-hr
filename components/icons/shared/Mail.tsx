import { memo } from 'react';

export interface MailIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Mail Icon Component
 *
 * An envelope/mail icon, typically used for email addresses, messaging, and communication features.
 *
 * @example
 * ```tsx
 * <MailIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const MailIcon = memo(function MailIcon({
  size = 16,
  className = '',
  ...props
}: MailIconProps) {
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
        d="M1.4136 4.13887C1.3823 4.27032 1.36477 4.40322 1.35388 4.53649C1.33348 4.78619 1.33349 5.08935 1.3335 5.44076V10.5589C1.33349 10.9103 1.33348 11.2135 1.35388 11.4632C1.37541 11.7268 1.42296 11.9889 1.55149 12.2412C1.74323 12.6175 2.04919 12.9234 2.42552 13.1152C2.67777 13.2437 2.93992 13.2913 3.20348 13.3128C3.45317 13.3332 3.75631 13.3332 4.10769 13.3332H11.8925C12.2439 13.3332 12.5472 13.3332 12.7968 13.3128C13.0604 13.2913 13.3226 13.2437 13.5748 13.1152C13.9511 12.9234 14.2571 12.6175 14.4488 12.2412C14.5774 11.9889 14.6249 11.7268 14.6465 11.4632C14.6669 11.2135 14.6668 10.9103 14.6668 10.5589V5.4408C14.6668 5.08937 14.6669 4.7862 14.6465 4.53649C14.6356 4.40322 14.618 4.27032 14.5867 4.13887L9.26664 8.49167C8.52991 9.09445 7.47042 9.09445 6.73369 8.49167L1.4136 4.13887Z"
        fill="currentColor"
      />
      <path
        d="M13.8272 3.03754C13.7473 2.98063 13.663 2.92943 13.5748 2.88449C13.3226 2.75596 13.0604 2.70842 12.7968 2.68689C12.5471 2.66648 12.244 2.66649 11.8925 2.6665H4.1078C3.75639 2.66649 3.45318 2.66648 3.20348 2.68689C2.93992 2.70842 2.67777 2.75596 2.42552 2.88449C2.33733 2.92943 2.25301 2.98063 2.17311 3.03754L7.57801 7.45973C7.82358 7.66066 8.17674 7.66066 8.42232 7.45973L13.8272 3.03754Z"
        fill="currentColor"
      />
    </svg>
  );
});

MailIcon.displayName = 'MailIcon';

export default MailIcon;


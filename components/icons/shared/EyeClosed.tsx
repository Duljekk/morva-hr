import { memo } from 'react';

export interface EyeClosedIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Eye Closed Icon Component
 *
 * A closed eye icon with a slash, typically used for password visibility toggle to hide password text.
 *
 * @example
 * ```tsx
 * <EyeClosedIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const EyeClosedIcon = memo(function EyeClosedIcon({
  size = 16,
  className = '',
  ...props
}: EyeClosedIconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5286 1.52876C1.78895 1.26841 2.21106 1.26841 2.4714 1.52876L4.89855 3.9559L4.90046 3.95781L12.0427 11.1L12.0444 11.1018L14.4714 13.5288C14.7318 13.7891 14.7318 14.2112 14.4714 14.4716C14.2111 14.7319 13.7889 14.7319 13.5286 14.4716L11.4687 12.4117C9.78931 13.348 7.91362 13.5757 6.12891 13.0741C4.18055 12.5266 2.39459 11.1266 1.09607 8.94554C0.750093 8.36443 0.748614 7.63891 1.09532 7.05641C1.75388 5.94995 2.53753 5.04438 3.40563 4.3486L1.5286 2.47157C1.26825 2.21122 1.26825 1.78911 1.5286 1.52876ZM5.3335 8.00031C5.3335 7.50606 5.46836 7.04273 5.7028 6.64577L6.71188 7.65485C6.68247 7.76498 6.66683 7.88075 6.66683 8.00031C6.66683 8.73669 7.26378 9.33365 8.00016 9.33365C8.11972 9.33365 8.2355 9.318 8.34562 9.28859L9.3547 10.2977C8.95774 10.5321 8.49442 10.667 8.00016 10.667C6.5274 10.667 5.3335 9.47307 5.3335 8.00031Z"
        fill="currentColor"
      />
      <path
        d="M14.9041 8.94467C14.5026 9.61914 14.0544 10.2188 13.5694 10.7415L5.84115 3.01322C6.54385 2.78341 7.26885 2.66683 7.99964 2.66683C10.6341 2.66681 13.1934 4.18171 14.9041 7.05558C15.2505 7.63739 15.2505 8.36287 14.9041 8.94467Z"
        fill="currentColor"
      />
    </svg>
  );
});

EyeClosedIcon.displayName = 'EyeClosedIcon';

export default EyeClosedIcon;


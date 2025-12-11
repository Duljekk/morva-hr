import { memo } from 'react';

export interface CheckoutIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 19px
   */
  size?: number | string;
}

/**
 * Checkout Icon Component
 *
 * A checkout icon with a clock and shopping bag, typically used for checkout actions and time tracking.
 *
 * @example
 * ```tsx
 * <CheckoutIcon className="text-neutral-500" />
 * ```
 */
const CheckoutIcon = memo(function CheckoutIcon({
  size = 19,
  className = '',
  ...props
}: CheckoutIconProps) {
  return (
    <svg
      viewBox="0 0 19 19"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.4112 0C13.859 0 13.4112 0.447715 13.4112 1C13.4112 1.55228 13.859 2 14.4112 2H15.4112L13.6112 4.4C13.384 4.70302 13.3474 5.10843 13.5168 5.44721C13.6862 5.786 14.0325 6 14.4112 6H17.4112C17.9635 6 18.4112 5.55228 18.4112 5C18.4112 4.44772 17.9635 4 17.4112 4H16.4112L18.2112 1.6C18.4385 1.29698 18.4751 0.89157 18.3057 0.552786C18.1363 0.214002 17.79 0 17.4112 0H14.4112Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 9.11111C18 14.0816 13.9705 18.1111 9 18.1111C4.02951 18.1111 0 14.0816 0 9.11111C0 4.14063 4.02951 0.111111 9 0.111111C10.166 0.111111 11.2804 0.332899 12.303 0.736545C12.2982 0.764974 12.2941 0.793403 12.2904 0.822266L12.2836 0.881076L12.2724 1.11111L12.2836 1.34115C12.3542 2.03494 12.7413 2.63368 13.2967 2.99566L12.722 3.76128C12.2109 4.44314 12.1291 5.35503 12.5102 6.11719C12.8913 6.87956 13.6701 7.36111 14.5224 7.36111H17.5224C17.6252 7.36111 17.7266 7.35417 17.826 7.34071C17.9401 7.91319 18 8.50521 18 9.11111ZM9.89996 5.51107C9.89996 5.01411 9.49696 4.61111 9 4.61111C8.50304 4.61111 8.10004 5.01411 8.10004 5.51107V9.11111C8.10004 9.34983 8.19488 9.57878 8.3635 9.74761L10.6135 11.9976C10.9651 12.349 11.5349 12.349 11.8865 11.9976C12.2378 11.6461 12.2378 11.0762 11.8865 10.7246L9.89996 8.73828V5.51107Z"
        fill="currentColor"
      />
    </svg>
  );
});

CheckoutIcon.displayName = 'CheckoutIcon';

export default CheckoutIcon;




import { memo } from 'react';

export interface BellIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Bell Icon Component
 * 
 * A bell/notification icon used for alerts, notifications, and activity indicators.
 * 
 * @example
 * ```tsx
 * <BellIcon className="w-5 h-5 text-blue-600" />
 * ```
 */
const BellIcon = memo(function BellIcon({
  size = 16,
  className = '',
  ...props
}: BellIconProps) {
  return (
    <svg
      viewBox="0 0 25 25"
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
        d="M12.0216 2.01173C8.08557 2.00787 4.75469 4.91833 4.23066 8.81929L3.31888 15.6067C3.07732 17.4049 4.47487 19.0043 6.28923 19.0061L7.3585 19.0072C8.26093 20.756 9.96329 22.0097 12.0019 22.0117C14.0405 22.0137 15.7454 20.7633 16.6512 19.0163L17.7205 19.0173C19.5349 19.0191 20.9355 17.4225 20.6975 15.6238L19.7991 8.83458C19.2827 4.9326 15.9576 2.0156 12.0216 2.01173ZM14.2266 19.0139L9.7831 19.0095C10.3914 19.6474 11.1806 20.0109 12.0039 20.0117C12.8271 20.0125 13.6171 19.6506 14.2266 19.0139Z"
        fill="currentColor"
      />
    </svg>
  );
});

BellIcon.displayName = 'BellIcon';

export default BellIcon;




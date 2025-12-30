import { memo } from 'react';

export interface HomeIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Home Icon Component
 *
 * A home/house icon typically used for home navigation, home pages, and home-related functionality.
 *
 * @example
 * ```tsx
 * <HomeIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const HomeIcon = memo(function HomeIcon({
  size = 16,
  className = '',
  ...props
}: HomeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.1082 1.99881C11.2104 1.10326 12.7896 1.10326 13.8918 1.99881L19.8918 6.87381C20.5929 7.44348 21 8.29876 21 9.20215V18.0002C21 19.6571 19.6569 21.0002 18 21.0002H16V15C16 13.3431 14.6569 12 13 12H11C9.34315 12 8 13.3431 8 15V21L6 21.0002C4.34315 21.0002 3 19.6571 3 18.0002V9.20215C3 8.29876 3.40709 7.44348 4.10822 6.87381L10.1082 1.99881Z"
        fill="currentColor"
      />
      <path
        d="M10 21.0002H14V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V21.0002Z"
        fill="currentColor"
      />
    </svg>
  );
});

HomeIcon.displayName = 'HomeIcon';

export default HomeIcon;





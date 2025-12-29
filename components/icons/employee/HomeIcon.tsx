import { memo } from 'react';

export interface HomeIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 24
   */
  size?: number | string;
  /**
   * Whether the icon is in active state
   * When active, icon is white (#FFFFFF)
   * When inactive, icon is neutral-500 (#525252)
   * @default false
   */
  active?: boolean;
}

/**
 * Home Icon Component for Employee Floating Navbar
 *
 * A home/house-door icon used in the employee floating navigation bar.
 * Supports active/inactive states for navigation highlighting.
 *
 * @example
 * ```tsx
 * <HomeIcon active={true} size={24} />
 * <HomeIcon active={false} size={24} />
 * ```
 */
const HomeIcon = memo(function HomeIcon({
  size = 24,
  active = false,
  className = '',
  ...props
}: HomeIconProps) {
  const colorClass = active ? 'text-white' : 'text-neutral-500';

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`${colorClass} ${className}`}
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

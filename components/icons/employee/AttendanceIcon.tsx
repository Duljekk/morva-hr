import { memo } from 'react';

export interface AttendanceIconProps extends React.SVGProps<SVGSVGElement> {
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
 * Attendance Icon Component for Employee Floating Navbar
 *
 * A calendar-days icon used in the employee floating navigation bar.
 * Supports active/inactive states for navigation highlighting.
 *
 * @example
 * ```tsx
 * <AttendanceIcon active={true} size={24} />
 * <AttendanceIcon active={false} size={24} />
 * ```
 */
const AttendanceIcon = memo(function AttendanceIcon({
  size = 24,
  active = false,
  className = '',
  ...props
}: AttendanceIconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2C8.55228 2 9 2.44772 9 3V4H15V3C15 2.44772 15.4477 2 16 2C16.5523 2 17 2.44772 17 3V4H18C19.6569 4 21 5.34315 21 7V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V7C3 5.34315 4.34315 4 6 4H7V3C7 2.44772 7.44772 2 8 2ZM7 6H6C5.44772 6 5 6.44772 5 7V9H19V7C19 6.44772 18.5523 6 18 6H17V7C17 7.55228 16.5523 8 16 8C15.4477 8 15 7.55228 15 7V6H9V7C9 7.55228 8.55228 8 8 8C7.44772 8 7 7.55228 7 7V6ZM19 11H5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V11ZM8 14C8 13.4477 8.44772 13 9 13H9.01C9.56228 13 10.01 13.4477 10.01 14C10.01 14.5523 9.56228 15 9.01 15H9C8.44772 15 8 14.5523 8 14ZM12 13C11.4477 13 11 13.4477 11 14C11 14.5523 11.4477 15 12 15H12.01C12.5623 15 13.01 14.5523 13.01 14C13.01 13.4477 12.5623 13 12.01 13H12ZM14 14C14 13.4477 14.4477 13 15 13H15.01C15.5623 13 16.01 13.4477 16.01 14C16.01 14.5523 15.5623 15 15.01 15H15C14.4477 15 14 14.5523 14 14ZM9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18H9.01C9.56228 18 10.01 17.5523 10.01 17C10.01 16.4477 9.56228 16 9.01 16H9ZM11 17C11 16.4477 11.4477 16 12 16H12.01C12.5623 16 13.01 16.4477 13.01 17C13.01 17.5523 12.5623 18 12.01 18H12C11.4477 18 11 17.5523 11 17ZM15 16C14.4477 16 14 16.4477 14 17C14 17.5523 14.4477 18 15 18H15.01C15.5623 18 16.01 17.5523 16.01 17C16.01 16.4477 15.5623 16 15.01 16H15Z"
        fill="currentColor"
      />
    </svg>
  );
});

AttendanceIcon.displayName = 'AttendanceIcon';

export default AttendanceIcon;

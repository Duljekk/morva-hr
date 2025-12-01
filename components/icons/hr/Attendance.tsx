import { memo } from 'react';

export interface AttendanceIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Attendance Icon Component
 * 
 * A clock icon representing attendance tracking and time management.
 * 
 * @example
 * ```tsx
 * <AttendanceIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const AttendanceIcon = memo(function AttendanceIcon({
  size = 16,
  className = '',
  ...props
}: AttendanceIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00016 14.6668C11.6821 14.6668 14.6668 11.6821 14.6668 8.00016C14.6668 4.31826 11.6821 1.3335 8.00016 1.3335C4.31826 1.3335 1.3335 4.31826 1.3335 8.00016C1.3335 11.6821 4.31826 14.6668 8.00016 14.6668ZM8.66683 5.3335C8.66683 4.96531 8.36835 4.66683 8.00016 4.66683C7.63197 4.66683 7.3335 4.96531 7.3335 5.3335V8.00016C7.3335 8.17697 7.40373 8.34654 7.52876 8.47157L9.19542 10.1382C9.45577 10.3986 9.87788 10.3986 10.1382 10.1382C10.3986 9.87788 10.3986 9.45577 10.1382 9.19542L8.66683 7.72402V5.3335Z"
        fill="currentColor"
      />
    </svg>
  );
});

AttendanceIcon.displayName = 'AttendanceIcon';

export default AttendanceIcon;



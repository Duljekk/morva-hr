import { memo } from 'react';

export interface LeaveRequestsIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Leave Requests Icon Component
 * 
 * A calendar/document icon representing leave requests and time-off management.
 * 
 * @example
 * ```tsx
 * <LeaveRequestsIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const LeaveRequestsIcon = memo(function LeaveRequestsIcon({
  size = 16,
  className = '',
  ...props
}: LeaveRequestsIconProps) {
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
        d="M4 2C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14H12C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2H4ZM3.33333 4C3.33333 3.63181 3.63181 3.33333 4 3.33333H12C12.3682 3.33333 12.6667 3.63181 12.6667 4V4.66667H3.33333V4ZM6.16667 8C6.16667 8.46024 5.79357 8.83333 5.33333 8.83333C4.8731 8.83333 4.5 8.46024 4.5 8C4.5 7.53976 4.8731 7.16667 5.33333 7.16667C5.79357 7.16667 6.16667 7.53976 6.16667 8ZM6.16667 10.6667C6.16667 11.1269 5.79357 11.5 5.33333 11.5C4.8731 11.5 4.5 11.1269 4.5 10.6667C4.5 10.2064 4.8731 9.83333 5.33333 9.83333C5.79357 9.83333 6.16667 10.2064 6.16667 10.6667ZM8 8.83333C8.46024 8.83333 8.83333 8.46024 8.83333 8C8.83333 7.53976 8.46024 7.16667 8 7.16667C7.53976 7.16667 7.16667 7.53976 7.16667 8C7.16667 8.46024 7.53976 8.83333 8 8.83333ZM8.83333 10.6667C8.83333 11.1269 8.46024 11.5 8 11.5C7.53976 11.5 7.16667 11.1269 7.16667 10.6667C7.16667 10.2064 7.53976 9.83333 8 9.83333C8.46024 9.83333 8.83333 10.2064 8.83333 10.6667ZM10.6667 8.83333C11.1269 8.83333 11.5 8.46024 11.5 8C11.5 7.53976 11.1269 7.16667 10.6667 7.16667C10.2064 7.16667 9.83333 7.53976 9.83333 8C9.83333 8.46024 10.2064 8.83333 10.6667 8.83333Z"
        fill="currentColor"
      />
    </svg>
  );
});

LeaveRequestsIcon.displayName = 'LeaveRequestsIcon';

export default LeaveRequestsIcon;



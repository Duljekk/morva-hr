import { memo } from 'react';

export interface CalendarClockIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * CalendarClock Icon Component
 *
 * A calendar with clock icon typically used for scheduled events, appointments, and time-based reminders.
 *
 * @example
 * ```tsx
 * <CalendarClockIcon className="w-4 h-4 text-neutral-500" />
 * ```
 */
const CalendarClockIcon = memo(function CalendarClockIcon({
  size = 16,
  className = '',
  ...props
}: CalendarClockIconProps) {
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
        d="M5.16667 1.33301C5.44281 1.33301 5.66667 1.55687 5.66667 1.83301V2.66634H10.3333V1.83301C10.3333 1.55687 10.5572 1.33301 10.8333 1.33301C11.1095 1.33301 11.3333 1.55687 11.3333 1.83301V2.66634H11.5C12.8807 2.66634 14 3.78563 14 5.16634V7.10421C12.6744 6.26976 10.9781 6.06926 9.42043 6.71448C6.86951 7.77114 5.6586 10.6955 6.71456 13.2457C6.82486 13.512 6.95551 13.7636 7.10396 13.9997H4.5C3.11929 13.9997 2 12.8804 2 11.4997V5.16634C2 3.78563 3.11929 2.66634 4.5 2.66634H4.66667V1.83301C4.66667 1.55687 4.89052 1.33301 5.16667 1.33301Z"
        fill="currentColor"
      />
      <path
        d="M11.3333 9.33301C11.6095 9.33301 11.8333 9.55687 11.8333 9.83301V11.1257L12.8536 12.1462C13.0488 12.3414 13.0488 12.658 12.8535 12.8533C12.6582 13.0485 12.3416 13.0485 12.1464 12.8532L10.9797 11.6863C10.886 11.5925 10.8333 11.4653 10.8333 11.3327V9.83301C10.8333 9.55687 11.0572 9.33301 11.3333 9.33301Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3333 7.49967C9.21624 7.49967 7.5 9.21592 7.5 11.333C7.5 13.4501 9.21624 15.1663 11.3333 15.1663C13.4504 15.1663 15.1667 13.4501 15.1667 11.333C15.1667 9.21592 13.4504 7.49967 11.3333 7.49967ZM8.5 11.333C8.5 9.7682 9.76853 8.49967 11.3333 8.49967C12.8981 8.49967 14.1667 9.7682 14.1667 11.333C14.1667 12.8978 12.8981 14.1663 11.3333 14.1663C9.76853 14.1663 8.5 12.8978 8.5 11.333Z"
        fill="currentColor"
      />
    </svg>
  );
});

CalendarClockIcon.displayName = 'CalendarClockIcon';

export default CalendarClockIcon;

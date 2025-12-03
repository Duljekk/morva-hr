import { memo } from 'react';

export interface CalendarIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Calendar Icon Component
 * 
 * A calendar icon with dots pattern, typically used for date selection,
 * scheduling, and calendar-related functionality.
 * 
 * @example
 * ```tsx
 * <CalendarIcon className="w-5 h-5 text-green-600" />
 * ```
 */
const CalendarIcon = memo(function CalendarIcon({
  size = 16,
  className = '',
  ...props
}: CalendarIconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.02075 3.00588C4.3639 3.00425 3.01943 4.34608 3.01781 6.00293L3.00602 18.0029C3.00439 19.6598 4.34622 21.0042 6.00307 21.0059L18.0031 21.0177C19.6599 21.0193 21.0044 19.6775 21.006 18.0206L21.0178 6.02061C21.0194 4.36375 19.6776 3.01929 18.0207 3.01766L6.02075 3.00588ZM5.0178 6.00489C5.01835 5.45261 5.4665 5.00533 6.01879 5.00588L18.0188 5.01766C18.5711 5.0182 19.0183 5.46636 19.0178 6.01864L19.0168 7.01864L5.01682 7.00489L5.0178 6.00489ZM9.26191 12.0091C9.26123 12.6994 8.70104 13.2585 8.01068 13.2578C7.32033 13.2572 6.76123 12.697 6.76191 12.0066C6.76259 11.3163 7.32278 10.7572 8.01314 10.7578C8.70349 10.7585 9.26259 11.3187 9.26191 12.0091ZM9.25798 16.0091C9.2573 16.6994 8.69711 17.2585 8.00675 17.2578C7.3164 17.2572 6.7573 16.697 6.75798 16.0066C6.75866 15.3163 7.31885 14.7572 8.00921 14.7578C8.69956 14.7585 9.25866 15.3187 9.25798 16.0091ZM12.0107 13.2618C12.701 13.2624 13.2612 12.7033 13.2619 12.013C13.2626 11.3226 12.7035 10.7624 12.0131 10.7618C11.3228 10.7611 10.7626 11.3202 10.7619 12.0105C10.7612 12.7009 11.3203 13.2611 12.0107 13.2618ZM13.258 16.013C13.2573 16.7033 12.6971 17.2624 12.0068 17.2618C11.3164 17.2611 10.7573 16.7009 10.758 16.0105C10.7587 15.3202 11.3189 14.7611 12.0092 14.7618C12.6996 14.7624 13.2587 15.3226 13.258 16.013ZM16.0107 13.2657C16.701 13.2664 17.2612 12.7073 17.2619 12.0169C17.2626 11.3266 16.7035 10.7664 16.0131 10.7657C15.3228 10.765 14.7626 11.3241 14.7619 12.0145C14.7612 12.7048 15.3203 13.265 16.0107 13.2657Z"
        fill="currentColor"
      />
    </svg>
  );
});

CalendarIcon.displayName = 'CalendarIcon';

export default CalendarIcon;


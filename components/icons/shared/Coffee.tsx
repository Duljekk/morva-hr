import { memo } from 'react';

export interface CoffeeIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 25
   */
  size?: number | string;
}

/**
 * Coffee Icon Component
 *
 * A coffee cup icon typically used for breaks, rest periods, or cafe-related features.
 *
 * @example
 * ```tsx
 * <CoffeeIcon className="w-6 h-6 text-neutral-500" />
 * ```
 */
const CoffeeIcon = memo(function CoffeeIcon({
  size = 25,
  className = '',
  ...props
}: CoffeeIconProps) {
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
        d="M7.02162 2.00685C7.43583 2.00726 7.77129 2.34338 7.77088 2.75759L7.76842 5.25759C7.76802 5.6718 7.4319 6.00726 7.01769 6.00685C6.60347 6.00644 6.26802 5.67033 6.26843 5.25611L6.27088 2.75612C6.27129 2.3419 6.6074 2.00645 7.02162 2.00685Z"
        fill="currentColor"
      />
      <path
        d="M11.0216 2.01078C11.4358 2.01119 11.7713 2.3473 11.7709 2.76152L11.7684 5.26152C11.768 5.67573 11.4319 6.01119 11.0177 6.01078C10.6035 6.01037 10.268 5.67426 10.2684 5.26004L10.2709 2.76004C10.2713 2.34583 10.6074 2.01037 11.0216 2.01078Z"
        fill="currentColor"
      />
      <path
        d="M15.0216 2.01471C15.4358 2.01512 15.7713 2.35123 15.7709 2.76545L15.7684 5.26544C15.768 5.67966 15.4319 6.01511 15.0177 6.01471C14.6035 6.0143 14.268 5.67819 14.2684 5.26397L14.2709 2.76397C14.2713 2.34976 14.6074 2.0143 15.0216 2.01471Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.76671 7.00562C4.80021 7.00467 4.01594 7.78741 4.01499 8.7539L4.00566 18.2539C4.00362 20.325 5.68091 22.0055 7.75197 22.0076L14.252 22.014C16.323 22.016 18.0036 20.3387 18.0057 18.2676L18.0079 16.0176L18.5079 16.0181C20.4409 16.02 22.0094 14.4546 22.0113 12.5216C22.0132 10.5886 20.4477 9.02004 18.5147 9.01814L18.0147 9.01765L18.015 8.76765C18.0159 7.80116 17.2332 7.01688 16.2667 7.01594L5.76671 7.00562ZM18.0133 10.5177L18.0093 14.5177L18.5093 14.5181C19.6139 14.5192 20.5102 13.6247 20.5113 12.5201C20.5124 11.4155 19.6178 10.5192 18.5133 10.5181L18.0133 10.5177Z"
        fill="currentColor"
      />
    </svg>
  );
});

CoffeeIcon.displayName = 'CoffeeIcon';

export default CoffeeIcon;

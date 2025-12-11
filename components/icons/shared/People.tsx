import { memo } from 'react';

export interface PeopleIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * People Icon Component
 *
 * A user/person icon, typically used for user-related fields like username and full name.
 *
 * @example
 * ```tsx
 * <PeopleIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const PeopleIcon = memo(function PeopleIcon({
  size = 16,
  className = '',
  ...props
}: PeopleIconProps) {
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
        d="M4.33333 5.00016C4.33333 2.97512 5.97496 1.3335 8 1.3335C10.025 1.3335 11.6667 2.97512 11.6667 5.00016C11.6667 7.02521 10.025 8.66683 8 8.66683C5.97496 8.66683 4.33333 7.02521 4.33333 5.00016Z"
        fill="currentColor"
      />
      <path
        d="M2.66667 14.0002C2.29848 14.0002 2 13.7017 2 13.3335V12.6668C2 10.8259 3.49238 9.3335 5.33333 9.3335H10.6667C12.5076 9.3335 14 10.8259 14 12.6668V13.3335C14 13.7017 13.7015 14.0002 13.3333 14.0002H2.66667Z"
        fill="currentColor"
      />
    </svg>
  );
});

PeopleIcon.displayName = 'PeopleIcon';

export default PeopleIcon;

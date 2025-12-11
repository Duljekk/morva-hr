import { memo } from 'react';

export interface LockIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Lock Icon Component
 *
 * A padlock icon, typically used for password fields, security features, and authentication forms.
 *
 * @example
 * ```tsx
 * <LockIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const LockIcon = memo(function LockIcon({
  size = 16,
  className = '',
  ...props
}: LockIconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99984 1.3335C6.15889 1.3335 4.6665 2.82588 4.6665 4.66683V6.00016C3.56193 6.00016 2.6665 6.89559 2.6665 8.00016V12.6668C2.6665 13.7714 3.56193 14.6668 4.6665 14.6668H11.3332C12.4377 14.6668 13.3332 13.7714 13.3332 12.6668V8.00016C13.3332 6.89559 12.4377 6.00016 11.3332 6.00016V4.66683C11.3332 2.82588 9.84079 1.3335 7.99984 1.3335ZM9.99984 6.00016V4.66683C9.99984 3.56226 9.10441 2.66683 7.99984 2.66683C6.89527 2.66683 5.99984 3.56226 5.99984 4.66683V6.00016H9.99984ZM7.99984 8.66683C8.36803 8.66683 8.6665 8.96531 8.6665 9.3335V11.3335C8.6665 11.7017 8.36803 12.0002 7.99984 12.0002C7.63165 12.0002 7.33317 11.7017 7.33317 11.3335V9.3335C7.33317 8.96531 7.63165 8.66683 7.99984 8.66683Z"
        fill="currentColor"
      />
    </svg>
  );
});

LockIcon.displayName = 'LockIcon';

export default LockIcon;


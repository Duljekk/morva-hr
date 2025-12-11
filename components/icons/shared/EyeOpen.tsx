import { memo } from 'react';

export interface EyeOpenIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Eye Open Icon Component
 *
 * An open eye icon, typically used for password visibility toggle to show password text.
 *
 * @example
 * ```tsx
 * <EyeOpenIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const EyeOpenIcon = memo(function EyeOpenIcon({
  size = 16,
  className = '',
  ...props
}: EyeOpenIconProps) {
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
        d="M8.00016 2.6665C10.6346 2.66649 13.1939 4.18139 14.9046 7.05526C15.251 7.63706 15.251 8.36255 14.9046 8.94435C13.1939 11.8182 10.6346 13.3332 8.00017 13.3332C5.36569 13.3332 2.80645 11.8183 1.09569 8.94442C0.749353 8.36262 0.749353 7.63713 1.09569 7.05533C2.80645 4.18146 5.36568 2.66652 8.00016 2.6665ZM5.66683 7.99984C5.66683 6.71117 6.7115 5.6665 8.00016 5.6665C9.28883 5.6665 10.3335 6.71117 10.3335 7.99984C10.3335 9.2885 9.28883 10.3332 8.00016 10.3332C6.7115 10.3332 5.66683 9.2885 5.66683 7.99984Z"
        fill="currentColor"
      />
    </svg>
  );
});

EyeOpenIcon.displayName = 'EyeOpenIcon';

export default EyeOpenIcon;


import { memo, useId } from 'react';

export interface AtIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * At Icon Component
 *
 * An @ symbol icon, typically used for email addresses, mentions, and social media features.
 *
 * @example
 * ```tsx
 * <AtIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const AtIcon = memo(function AtIcon({
  size = 16,
  className = '',
  ...props
}: AtIconProps) {
  // Generate unique ID for clipPath to avoid conflicts when multiple instances are used
  const clipPathId = useId();

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
      <defs>
        <clipPath id={clipPathId}>
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M11.2458 13.2446C10.3031 13.8293 9.19103 14.1668 8.00016 14.1668C4.59441 14.1668 1.8335 11.4059 1.8335 8.00016C1.8335 4.59441 4.59441 1.8335 8.00016 1.8335C11.4059 1.8335 14.1668 4.59441 14.1668 8.00016C14.1668 9.31995 13.5109 10.683 11.9812 10.5439C10.7226 10.4295 9.81676 9.28401 9.99547 8.03299L10.3486 5.60201M9.9585 8.32048C9.75353 9.7789 8.55287 10.8158 7.27674 10.6365C6.00062 10.4571 5.13228 9.12943 5.33725 7.671C5.54221 6.21257 6.74288 5.17568 8.019 5.35502C9.29512 5.53437 10.1635 6.86205 9.9585 8.32048Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
});

AtIcon.displayName = 'AtIcon';

export default AtIcon;









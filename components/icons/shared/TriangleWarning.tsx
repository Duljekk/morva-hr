import { memo, useId } from 'react';

export interface TriangleWarningIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 13
   */
  size?: number | string;
}

/**
 * Triangle Warning Icon Component
 *
 * A warning triangle icon, typically used for alerts, warnings, and caution states.
 *
 * @example
 * ```tsx
 * <TriangleWarningIcon className="w-4 h-4 text-amber-600" />
 * ```
 */
const TriangleWarningIcon = memo(function TriangleWarningIcon({
  size = 13,
  className = '',
  ...props
}: TriangleWarningIconProps) {
  // Generate unique ID for clipPath to avoid conflicts when multiple instances are used
  const clipPathId = useId();

  return (
    <svg
      viewBox="-0.35 -0.6 13 13"
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
          <rect width="12" height="12" fill="white" transform="translate(0.0118408) rotate(0.0562731)" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.71397 1.73344C5.29376 0.74175 6.72746 0.743156 7.3053 1.73598L10.8084 7.75479C11.3907 8.75535 10.6682 10.0105 9.51047 10.0093L2.49255 10.0024C1.33487 10.0013 0.61479 8.74477 1.1991 7.74536L4.71397 1.73344ZM6.0079 4.0059C6.28404 4.00617 6.50768 4.23025 6.50741 4.50639L6.50594 6.00639C6.50566 6.28253 6.28159 6.50617 6.00544 6.5059C5.7293 6.50562 5.50567 6.28155 5.50594 6.00541L5.50741 4.50541C5.50768 4.22926 5.73176 4.00563 6.0079 4.0059ZM5.37946 7.50528C5.3798 7.1601 5.6599 6.88056 6.00508 6.8809C6.35025 6.88124 6.6298 7.16133 6.62946 7.50651C6.62912 7.85169 6.34903 8.13123 6.00385 8.1309C5.65867 8.13056 5.37912 7.85046 5.37946 7.50528Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
});

TriangleWarningIcon.displayName = 'TriangleWarningIcon';

export default TriangleWarningIcon;







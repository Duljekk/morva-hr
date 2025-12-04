import { memo } from 'react';

/**
 * Icon Component Template
 * 
 * This is a template for creating new icon components.
 * Copy this file and replace:
 * - IconName with your icon name (e.g., CheckInIcon, NotificationIcon)
 * - IconNameProps with your props interface name
 * - viewBox with your icon's viewBox dimensions
 * - The SVG path/content with your icon's paths
 * 
 * Best Practices:
 * - Always use React.memo for performance
 * - Use currentColor for fills/strokes to allow CSS color customization
 * - Remove width/height from SVG, use size prop instead
 * - Keep viewBox for proper scaling
 * - Include aria-hidden="true" for decorative icons
 * - Use proper TypeScript types extending React.SVGProps<SVGSVGElement>
 */

export interface IconNameProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * IconName Icon Component
 * 
 * Description of what this icon represents.
 * 
 * @example
 * ```tsx
 * <IconName className="w-4 h-4 text-neutral-600" />
 * ```
 */
const IconName = memo(function IconName({
  size = 16,
  className = '',
  ...props
}: IconNameProps) {
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
      {/* Replace with your icon's path elements */}
      <path
        d="M..."
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

IconName.displayName = 'IconName';

export default IconName;











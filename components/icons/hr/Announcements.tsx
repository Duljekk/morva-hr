import { memo } from 'react';

export interface AnnouncementsIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Announcements Icon Component
 * 
 * A megaphone/bell icon representing announcements and notifications.
 * 
 * @example
 * ```tsx
 * <AnnouncementsIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const AnnouncementsIcon = memo(function AnnouncementsIcon({
  size = 16,
  className = '',
  ...props
}: AnnouncementsIconProps) {
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
        d="M8.00021 1.3335C5.37621 1.3335 3.15753 3.27599 2.81073 5.87696L2.20733 10.4025C2.04747 11.6015 2.98021 12.6668 4.18979 12.6668H4.90263C5.5054 13.8321 6.64112 14.6668 8.00021 14.6668C9.35929 14.6668 10.495 13.8321 11.0978 12.6668H11.8106C13.0202 12.6668 13.9529 11.6015 13.7931 10.4025L13.1897 5.87696C12.8429 3.27599 10.6242 1.3335 8.00021 1.3335ZM9.48138 12.6668H6.51903C6.92499 13.0917 7.45138 13.3335 8.00021 13.3335C8.54903 13.3335 9.07543 13.0917 9.48138 12.6668Z"
        fill="currentColor"
      />
    </svg>
  );
});

AnnouncementsIcon.displayName = 'AnnouncementsIcon';

export default AnnouncementsIcon;


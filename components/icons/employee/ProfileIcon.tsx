import { memo } from 'react';

export interface ProfileIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 24
   */
  size?: number | string;
  /**
   * Whether the icon is in active state
   * When active, icon is white (#FFFFFF)
   * When inactive, icon is neutral-500 (#525252)
   * @default false
   */
  active?: boolean;
}

/**
 * Profile Icon Component for Employee Floating Navbar
 *
 * A person/avatar icon used in the employee floating navigation bar.
 * Supports active/inactive states for navigation highlighting.
 *
 * @example
 * ```tsx
 * <ProfileIcon active={true} size={24} />
 * <ProfileIcon active={false} size={24} />
 * ```
 */
const ProfileIcon = memo(function ProfileIcon({
  size = 24,
  active = false,
  className = '',
  ...props
}: ProfileIconProps) {
  const colorClass = active ? 'text-white' : 'text-neutral-500';

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`${colorClass} ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 19C4 16.2386 6.23858 14 9 14H15C17.7614 14 20 16.2386 20 19V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V19Z"
        fill="currentColor"
      />
    </svg>
  );
});

ProfileIcon.displayName = 'ProfileIcon';

export default ProfileIcon;

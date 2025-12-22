import { memo } from 'react';

export interface LinkIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 14
   */
  size?: number | string;
}

/**
 * Link Icon Component
 *
 * A chain link icon typically used for URLs, website links, and external references.
 *
 * @example
 * ```tsx
 * <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
 * ```
 */
const LinkIcon = memo(function LinkIcon({
  size = 14,
  className = '',
  ...props
}: LinkIconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.83333 7.58333C6.09167 7.92083 6.41667 8.2 6.79167 8.4C7.16667 8.6 7.58333 8.71667 8.01667 8.74167C8.45 8.76667 8.88333 8.7 9.28333 8.54167C9.68333 8.38333 10.0417 8.14167 10.3333 7.83333L12.0833 6.08333C12.6083 5.53333 12.9 4.8 12.8917 4.04167C12.8833 3.28333 12.575 2.55833 12.0417 2.01667C11.5083 1.475 10.7833 1.16667 10.025 1.15833C9.26667 1.15 8.53333 1.44167 7.98333 1.96667L6.91667 3.025"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.16667 6.41667C7.90833 6.07917 7.58333 5.8 7.20833 5.6C6.83333 5.4 6.41667 5.28333 5.98333 5.25833C5.55 5.23333 5.11667 5.3 4.71667 5.45833C4.31667 5.61667 3.95833 5.85833 3.66667 6.16667L1.91667 7.91667C1.39167 8.46667 1.1 9.2 1.10833 9.95833C1.11667 10.7167 1.425 11.4417 1.95833 11.9833C2.49167 12.525 3.21667 12.8333 3.975 12.8417C4.73333 12.85 5.46667 12.5583 6.01667 12.0333L7.075 10.975"
        stroke="currentColor"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

LinkIcon.displayName = 'LinkIcon';

export default LinkIcon;

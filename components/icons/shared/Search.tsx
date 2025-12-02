import { memo } from 'react';

export interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Search Icon Component
 * 
 * A magnifying glass icon used for search functionality.
 * 
 * @example
 * ```tsx
 * <SearchIcon className="w-4 h-4 text-neutral-500" />
 * ```
 */
const SearchIcon = memo(function SearchIcon({
  size = 16,
  className = '',
  ...props
}: SearchIconProps) {
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
        d="M13.3332 13.3332L10.6998 10.6998M11.9998 7.33317C11.9998 9.9105 9.9105 11.9998 7.33317 11.9998C4.75584 11.9998 2.6665 9.9105 2.6665 7.33317C2.6665 4.75584 4.75584 2.6665 7.33317 2.6665C9.9105 2.6665 11.9998 4.75584 11.9998 7.33317Z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </svg>
  );
});

SearchIcon.displayName = 'SearchIcon';

export default SearchIcon;



'use client';

import { memo, type ReactNode } from 'react';
import Link from 'next/link';

/**
 * Breadcrumb Item Props
 */
export interface BreadcrumbItemProps {
  /**
   * Text label for the breadcrumb item
   */
  label: string;

  /**
   * Optional icon element (React node)
   */
  icon?: ReactNode;

  /**
   * Whether to show the icon
   * @default true
   */
  hasIcon?: boolean;

  /**
   * Link href for navigation
   * If not provided, item will not be clickable
   */
  href?: string;

  /**
   * Whether this is the current page
   * @default false
   */
  isCurrent?: boolean;

  /**
   * Click handler for the breadcrumb item
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

/**
 * Breadcrumb Item Component
 * 
 * A single breadcrumb navigation item with optional icon and link.
 * Based on Figma design node 616:1294.
 * 
 * States:
 * - Default: neutral-500 text (#737373), neutral-400 icon (#a1a1a1)
 * - Hover: neutral-600 text (#525252), neutral-500 icon (#737373)
 * - Current: neutral-700 text (#404040), neutral-600 icon (#525252)
 * 
 * Features:
 * - Optional icon (16x16)
 * - Text label (14px medium, 18px line-height)
 * - Link support (Next.js Link)
 * - Click handlers
 * - Accessible with proper ARIA attributes
 * 
 * @example
 * ```tsx
 * // Default breadcrumb (clickable)
 * <BreadcrumbItem label="Home" href="/" icon={<HomeIcon />} />
 * 
 * // Current page (not clickable)
 * <BreadcrumbItem label="Employees" isCurrent />
 * 
 * // Without icon
 * <BreadcrumbItem label="Settings" href="/settings" hasIcon={false} />
 * ```
 */
const BreadcrumbItem = memo(function BreadcrumbItem({
  label,
  icon,
  hasIcon = true,
  href,
  isCurrent = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}: BreadcrumbItemProps) {
  const baseClasses = 'flex gap-[4px] items-center';
  const textClasses = `font-sans font-medium leading-[18px] text-[14px] text-nowrap whitespace-pre ${
    isCurrent
      ? 'text-[#404040]' // Current: neutral-700
      : 'text-[#737373] hover:text-[#525252] transition-colors' // Default -> Hover
  }`;
  const iconClasses = `overflow-clip shrink-0 size-[16px] ${
    isCurrent
      ? 'text-[#525252]' // Current: neutral-600
      : 'text-[#a1a1a1] group-hover:text-[#737373] transition-colors' // Default -> Hover
  }`;

  const content = (
    <>
      {hasIcon && icon && (
        <div className={iconClasses} data-name="Icon Container">
          {icon}
        </div>
      )}
      <span
        className={textClasses}
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {label}
      </span>
    </>
  );

  // Current page (not clickable)
  if (isCurrent) {
    return (
      <li
        className={`${baseClasses} ${className}`}
        aria-current="page"
        aria-label={ariaLabel || label}
        data-name="State=Current"
        data-node-id="616:1301"
      >
        {content}
      </li>
    );
  }

  // Clickable breadcrumb (with or without href)
  const isLink = !!href;

  if (isLink) {
    return (
      <li className={className}>
        <Link
          href={href}
          className={`${baseClasses} group`}
          onClick={onClick}
          aria-label={ariaLabel || `Navigate to ${label}`}
          data-name="State=Default"
          data-node-id="616:1295"
        >
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li className={className}>
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} group`}
        aria-label={ariaLabel || `Navigate to ${label}`}
        data-name="State=Default"
        data-node-id="616:1295"
      >
        {content}
      </button>
    </li>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

export default BreadcrumbItem;











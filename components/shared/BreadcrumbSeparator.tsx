'use client';

import { memo } from 'react';

/**
 * Breadcrumb Separator Props
 */
export interface BreadcrumbSeparatorProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom separator character or element
   * @default "/"
   */
  separator?: string;
}

/**
 * Breadcrumb Separator Component
 * 
 * A visual separator between breadcrumb items.
 * 
 * Features:
 * - Default "/" separator
 * - Custom separator support
 * - Proper ARIA attributes (hidden from screen readers)
 * - Consistent styling
 * 
 * @example
 * ```tsx
 * // Default separator (/)
 * <BreadcrumbSeparator />
 * 
 * // Custom separator
 * <BreadcrumbSeparator separator=">" />
 * ```
 */
const BreadcrumbSeparator = memo(function BreadcrumbSeparator({
  className = '',
  separator = '/',
}: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={`text-[#737373] text-[14px] select-none ${className}`}
      data-name="Separator"
    >
      {separator}
    </li>
  );
});

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export default BreadcrumbSeparator;




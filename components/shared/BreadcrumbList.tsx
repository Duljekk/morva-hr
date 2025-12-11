'use client';

import { memo, type ReactNode } from 'react';

/**
 * Breadcrumb List Props
 */
export interface BreadcrumbListProps {
  /**
   * Breadcrumb items and separators
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for the navigation
   * @default "Breadcrumb"
   */
  'aria-label'?: string;
}

/**
 * Breadcrumb List Component
 * 
 * Container component for breadcrumb navigation items.
 * Provides proper semantic HTML and ARIA attributes for accessibility.
 * 
 * Features:
 * - Semantic <nav> with <ol> list
 * - Proper ARIA attributes
 * - Flexible layout
 * - Accessible keyboard navigation
 * 
 * @example
 * ```tsx
 * <BreadcrumbList>
 *   <BreadcrumbItem label="Home" href="/" icon={<HomeIcon />} />
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem label="Employees" href="/employees" />
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem label="John Smith" isCurrent />
 * </BreadcrumbList>
 * ```
 */
const BreadcrumbList = memo(function BreadcrumbList({
  children,
  className = '',
  'aria-label': ariaLabel = 'Breadcrumb',
}: BreadcrumbListProps) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex items-center gap-[8px]">
        {children}
      </ol>
    </nav>
  );
});

BreadcrumbList.displayName = 'BreadcrumbList';

export default BreadcrumbList;




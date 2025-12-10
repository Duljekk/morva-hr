'use client';

import { ReactNode, HTMLAttributes } from 'react';

export type TabListOrientation = 'horizontal' | 'vertical';

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Tab components to render
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ARIA label for the tab list
   */
  'aria-label'?: string;
  
  /**
   * Orientation of the tab list
   * @default 'horizontal'
   */
  orientation?: TabListOrientation;
}

/**
 * TabList Component
 * 
 * A container component for Tab components that provides proper ARIA structure
 * for accessible tab navigation.
 * 
 * Features:
 * - Supports horizontal and vertical orientations
 * - Proper ARIA orientation attribute
 * - Flexible layout
 * 
 * @example
 * ```tsx
 * <TabList aria-label="Employee sections" orientation="horizontal">
 *   <Tab label="Attendance" state="active" />
 *   <Tab label="Performance" />
 *   <Tab label="Documents" />
 * </TabList>
 * ```
 */
export default function TabList({
  children,
  className = '',
  orientation = 'horizontal',
  'aria-label': ariaLabel,
  ...props
}: TabListProps) {
  const orientationClass = orientation === 'vertical' ? 'flex-col' : 'flex-row';
  
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={`flex items-center gap-0.5 ${orientationClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

'use client';

import { ReactNode, HTMLAttributes } from 'react';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Tab components to render
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ARIA label for the tabs container
   */
  'aria-label'?: string;
}

/**
 * Tabs Container Component
 * 
 * A container component that wraps Tab components with a styled background
 * based on Figma design specifications (Node 596:1255).
 * 
 * Design Specifications:
 * - Background: #F5F5F5 (neutral-100)
 * - Border Radius: 10px
 * - Layout: Horizontal with 2px gap
 * - Padding: 2px all sides
 * - Height: 36px
 * - Contains TabList with Tab components
 * 
 * Features:
 * - Styled container for grouped tabs
 * - Proper ARIA structure for accessibility
 * - Responsive layout
 * 
 * @example
 * ```tsx
 * <Tabs aria-label="Employee sections">
 *   <TabList>
 *     <Tab label="Attendance" state="active" />
 *     <Tab label="Leave Request" state="default" hasNumber={true} number={5} />
 *   </TabList>
 * </Tabs>
 * ```
 */
export default function Tabs({
  children,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: TabsProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={`
        inline-flex
        h-9
        items-center
        bg-[#F5F5F5]
        rounded-[10px]
        p-0.5
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

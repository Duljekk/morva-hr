'use client';

import { useState, isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardIcon } from '@/components/icons';

interface SidebarMenuItemProps {
  /**
   * Text label for the menu item
   * @default "Dashboard"
   */
  text?: string;
  
  /**
   * Icon component to display (defaults to DashboardIcon)
   */
  icon?: ReactNode;
  
  /**
   * Current state of the menu item
   * @default "Default"
   */
  state?: 'Active' | 'Hover' | 'Default';
  
  /**
   * Link href (if provided, wraps in Next.js Link)
   */
  href?: string;
  
  /**
   * Click handler (if href is not provided)
   */
  onClick?: () => void;
  
  /**
   * Whether the item is active (for automatic state management)
   */
  isActive?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Disable the menu item
   */
  disabled?: boolean;
  
  /**
   * Whether the sidebar is collapsed (icon-only mode)
   * @default false
   */
  collapsed?: boolean;
}

/**
 * SidebarMenuItem Component
 * 
 * A sidebar menu item component with three states: Active, Hover, and Default
 * Supports both expanded and collapsed (icon-only) variants
 * Following Next.js and React best practices:
 * - Accessible with proper ARIA labels
 * - Keyboard navigation support
 * - Next.js Link integration for client-side navigation
 * - Automatic active state detection
 * 
 * Design specifications from Figma:
 * 
 * Expanded variant:
 * - Width: 247px
 * - Height: 36px
 * - Border radius: 8px
 * - Padding: 10px horizontal, 4px vertical
 * - Active: bg-[rgba(64,64,64,0.08)], text neutral-700, icon neutral-700
 * - Hover: bg-[rgba(64,64,64,0.04)], text neutral-600, icon neutral-400 (only background changes)
 * - Default: no background, text neutral-600, icon neutral-400
 * - Text: 14px, medium weight, line height 20px, tracking -0.07px
 * - Icon: 16px
 * 
 * Collapsed variant (icon-only):
 * - Size: 36x36px (square)
 * - Border radius: 8px
 * - Padding: 10px horizontal, 4px vertical
 * - Active: bg-[rgba(64,64,64,0.08)], icon neutral-700
 * - Hover: bg-[rgba(64,64,64,0.04)], icon neutral-400
 * - Default: no background, icon neutral-400
 * - Icon: 16px, centered
 */
export default function SidebarMenuItem({
  text = 'Dashboard',
  icon,
  state,
  href,
  onClick,
  isActive = false,
  className = '',
  disabled = false,
  collapsed = false,
}: SidebarMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine the actual state
  const actualState = state || (isActive ? 'Active' : isHovered ? 'Hover' : 'Default');
  
  // Icon color:
  // - Active = neutral-700
  // - Hover/Default = neutral-400 (same color, only background changes on hover)
  const iconColorClass = actualState === 'Active' ? 'text-neutral-700' : 'text-neutral-400';

  // Default icon to DashboardIcon if not provided
  // For custom icons, we merge the state-based color class into the icon's className
  let displayIcon: ReactNode;

  if (icon && isValidElement(icon)) {
    const typedIcon = icon as ReactElement<{ className?: string }>;
    const existingClassName = typedIcon.props.className ?? '';
    displayIcon = cloneElement(typedIcon, {
      className: `${existingClassName} ${iconColorClass}`.trim(),
    });
  } else {
    displayIcon = (
      <DashboardIcon
        className={`w-4 h-4 ${iconColorClass}`}
      />
    );
  }

  // Get styles based on state
  const getStateStyles = () => {
    switch (actualState) {
      case 'Active':
        return {
          container: 'bg-[rgba(64,64,64,0.08)]',
          text: 'text-neutral-700',
        };
      case 'Hover':
        return {
          container: 'bg-[rgba(64,64,64,0.04)]',
          text: 'text-neutral-600', // Same as default, only background changes
        };
      default:
        return {
          container: '',
          text: 'text-neutral-600',
        };
    }
  };

  const styles = getStateStyles();

  // Width values for animation
  const width = collapsed ? 36 : 247;

  // Base classes - shared for both variants
  const baseClasses = `
    box-border flex h-[36px] items-center overflow-hidden
    px-[10px] py-[4px] relative rounded-[8px]
    transition-colors duration-200
    ${styles.container}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  // Content structure - different for collapsed vs expanded
  const content = collapsed ? (
    // Collapsed: Icon only, centered
    <div className="relative shrink-0 size-[16px] flex items-center justify-center">
      {displayIcon}
    </div>
  ) : (
    // Expanded: Icon + Text
    <>
      {/* Icon */}
      <div className="relative shrink-0 size-[16px] flex items-center justify-center -mt-[1px]">
        {displayIcon}
      </div>
      
      {/* Text */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            className="box-border flex gap-[10px] items-center justify-start px-[6px] py-0 relative shrink-0 flex-1 min-w-0"
          >
            <p className={`
              ${actualState === 'Active' ? 'font-semibold' : 'font-medium'} leading-bold-sm relative shrink-0 text-sm
              text-nowrap whitespace-pre
              ${styles.text}
            `}>
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // Handle click
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick && !href) {
      e.preventDefault();
      onClick();
    }
  };

  // Render with Link if href is provided
  if (href && !disabled) {
    return (
      <motion.div
        layout
        initial={false}
        animate={{
          width,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className={baseClasses}
      >
        <Link
          href={href}
          className="flex items-center w-full h-full"
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          aria-current={isActive ? 'page' : undefined}
          aria-label={collapsed ? text : undefined}
          title={collapsed ? text : undefined}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  // Render as button/div if no href
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        width,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className={baseClasses}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-disabled={disabled}
      aria-label={collapsed ? text : undefined}
      title={collapsed ? text : undefined}
    >
      {content}
    </motion.div>
  );
}
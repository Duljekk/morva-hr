'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import DashboardIcon from '@/app/assets/icons/dashboard.svg';

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
}

/**
 * SidebarMenuItem Component
 * 
 * A sidebar menu item component with three states: Active, Hover, and Default
 * Following Next.js and React best practices:
 * - Accessible with proper ARIA labels
 * - Keyboard navigation support
 * - Next.js Link integration for client-side navigation
 * - Automatic active state detection
 * 
 * Design specifications from Figma:
 * - Width: 247px
 * - Height: 36px
 * - Border radius: 8px
 * - Padding: 10px horizontal, 4px vertical
 * - Active: bg-[rgba(64,64,64,0.08)], text neutral-800, icon rgba(64,64,64,1)
 * - Hover: bg-[rgba(64,64,64,0.04)], text neutral-600, icon rgba(161,161,161,1)
 * - Default: no background, text neutral-600, icon rgba(161,161,161,1)
 * - Text: 14px, medium weight, line height 20px, tracking -0.07px
 * - Icon: 16px
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
}: SidebarMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine the actual state
  const actualState = state || (isActive ? 'Active' : isHovered ? 'Hover' : 'Default');
  
  // Default icon to DashboardIcon if not provided
  // Icon color: Active = neutral-800 (#404040), Default/Hover = neutral-500 (#A1A1A1)
  const displayIcon = icon || (
    <DashboardIcon 
      className={`w-4 h-4 ${
        actualState === 'Active' 
          ? 'text-neutral-800' 
          : 'text-neutral-500'
      }`}
      style={{
        fill: actualState === 'Active' ? '#404040' : '#A1A1A1'
      }}
    />
  );

  // Get styles based on state
  const getStateStyles = () => {
    switch (actualState) {
      case 'Active':
        return {
          container: 'bg-[rgba(64,64,64,0.08)]',
          text: 'text-neutral-800',
        };
      case 'Hover':
        return {
          container: 'bg-[rgba(64,64,64,0.04)]',
          text: 'text-neutral-600',
        };
      default:
        return {
          container: '',
          text: 'text-neutral-600',
        };
    }
  };

  const styles = getStateStyles();

  // Base classes
  const baseClasses = `
    box-border flex h-[36px] items-center overflow-hidden
    px-[10px] py-[4px] relative rounded-[8px] w-[247px]
    transition-colors duration-200
    ${styles.container}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  // Content structure
  const content = (
    <>
      {/* Icon */}
      <div className="relative shrink-0 size-[16px] flex items-center justify-center">
        {displayIcon}
      </div>
      
      {/* Text */}
      <div className="box-border flex gap-[10px] items-center justify-start px-[4px] py-0 relative shrink-0 flex-1 min-w-0">
        <p className={`
          ${actualState === 'Active' ? 'font-semibold' : 'font-medium'} leading-bold-sm relative shrink-0 text-sm
          text-nowrap whitespace-pre
          ${styles.text}
        `}>
          {text}
        </p>
      </div>
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
      <Link
        href={href}
        className={baseClasses}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  }

  // Render as button/div if no href
  return (
    <div
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
    >
      {content}
    </div>
  );
}


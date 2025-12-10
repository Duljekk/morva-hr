'use client';

import { ButtonHTMLAttributes, ReactNode, KeyboardEvent } from 'react';

export type TabState = 'active' | 'default';

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * The text label displayed on the tab
   */
  label: string;
  
  /**
   * Current state of the tab
   * @default 'default'
   */
  state?: TabState;
  
  /**
   * Whether to show the number badge
   * @default false
   */
  hasNumber?: boolean;
  
  /**
   * The number to display in the badge (only shown if hasNumber is true)
   * @default 1
   */
  number?: number | string;
  
  /**
   * Click handler for the tab
   */
  onClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
  
  /**
   * ARIA selected state for accessibility
   */
  'aria-selected'?: boolean;
  
  /**
   * ARIA controls - ID of the tab panel this tab controls
   */
  'aria-controls'?: string;
  
  /**
   * ID for the tab element
   */
  id?: string;
}

/**
 * Tab Component
 * 
 * A tab button component based on Figma design specifications with two states:
 * - Active: White background with shadow, dark text
 * - Default: Transparent background, gray text
 * 
 * Features:
 * - Optional number badge that can be toggled
 * - Fully accessible with ARIA attributes
 * - Keyboard navigation support
 * 
 * @example
 * ```tsx
 * <Tab 
 *   label="Attendance" 
 *   state="active" 
 *   hasNumber={true} 
 *   number={5}
 *   onClick={() => console.log('Tab clicked')}
 * />
 * ```
 */
export default function Tab({
  label,
  state = 'default',
  hasNumber = false,
  number = 1,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-selected': ariaSelected,
  'aria-controls': ariaControls,
  id,
  ...props
}: TabProps) {
  const isActive = state === 'active';
  
  /**
   * Keyboard event handler for Enter and Space keys
   * Following WAI-ARIA best practices
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Call the user's onKeyDown if provided
    props.onKeyDown?.(event);
    
    // Handle Enter and Space for manual activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onClick?.();
      }
    }
  };
  
  // Base container styles with disabled state
  const containerStyles = `
    flex items-center justify-center
    h-8 
    px-2.5 py-2.5
    rounded-lg
    transition-all duration-200
    ${isActive 
      ? 'bg-white shadow-[0px_0px_0px_0.75px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.05)]' 
      : 'bg-transparent hover:bg-[#D4D4D4]/20'
    }
    ${disabled 
      ? 'opacity-50 cursor-not-allowed hover:bg-transparent' 
      : 'cursor-pointer'
    }
  `;
  
  // Text styles based on state and disabled
  const textStyles = `
    font-['Mona_Sans'] text-sm font-medium leading-[18px]
    whitespace-nowrap
    ${isActive ? 'text-neutral-800' : 'text-neutral-600'}
  `;
  
  // Number badge styles with disabled state
  const badgeStyles = `
    flex items-center justify-center
    min-w-4 h-4
    px-1
    rounded
    bg-[#2B7FFF]
    text-white text-xs font-medium leading-4
    text-center
    ${disabled ? 'opacity-50' : ''}
  `;

  return (
    <button
      id={id}
      role="tab"
      aria-label={ariaLabel || label}
      aria-selected={ariaSelected !== undefined ? ariaSelected : isActive}
      aria-controls={ariaControls}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`${containerStyles} ${className}`.trim()}
      type="button"
      {...props}
    >
      {/* Tab Label */}
      <span className={textStyles}>
        {label}
      </span>
      
      {/* Number Badge (conditional) */}
      {hasNumber && (
        <span 
          className={`${badgeStyles} ml-1.5`}
          aria-label={`${number} items`}
        >
          {number}
        </span>
      )}
    </button>
  );
}

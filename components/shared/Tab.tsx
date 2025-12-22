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
   * Whether to show an icon before the label
   * @default false
   */
  hasIcon?: boolean;
  
  /**
   * Custom icon element to display (only shown if hasIcon is true)
   * If not provided, no icon will be rendered
   */
  icon?: ReactNode;
  
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
 * A tab button component based on Figma design specifications with states:
 * - Active: White background with shadow, dark text (#404040)
 * - Default: Transparent background, gray text (#737373)
 * - Hover (on default): Light gray background (rgba(212,212,212,0.2))
 * 
 * Features:
 * - Optional icon support (16x16)
 * - Optional number badge (16x16, blue background)
 * - Fully accessible with ARIA attributes
 * - Keyboard navigation support
 * 
 * @example
 * ```tsx
 * <Tab 
 *   label="Attendance" 
 *   state="active" 
 *   hasIcon={true}
 *   icon={<ClockIcon size={16} />}
 *   hasNumber={true} 
 *   number={5}
 *   onClick={() => console.log('Tab clicked')}
 * />
 * ```
 */
export default function Tab({
  label,
  state = 'default',
  hasIcon = false,
  icon,
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
    props.onKeyDown?.(event);
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onClick?.();
      }
    }
  };
  
  // Container styles based on state
  const containerStyles = `
    flex items-center justify-center
    h-8
    p-[10px]
    rounded-lg
    overflow-clip
    transition-all duration-200
    ${isActive 
      ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.75px_rgba(0,0,0,0.06)]' 
      : 'bg-transparent hover:bg-[rgba(212,212,212,0.2)]'
    }
    ${disabled 
      ? 'opacity-50 cursor-not-allowed hover:bg-transparent' 
      : 'cursor-pointer'
    }
  `;
  
  // Icon styles (16x16)
  const iconStyles = `
    shrink-0 size-4
    ${isActive ? 'text-neutral-500' : 'text-neutral-400'}
  `;
  
  // Text container styles - pr-1 (4px) when has icon, pr-1.5 (6px) when no icon
  const textContainerStyles = `
    flex items-center justify-center
    pl-1 ${hasIcon && icon ? 'pr-1' : 'pr-1.5'}
    shrink-0
  `;
  
  // Text styles based on state
  const textStyles = `
    font-['Mona_Sans'] text-sm font-medium leading-[18px]
    whitespace-nowrap
    ${isActive ? 'text-[#404040]' : 'text-[#737373]'}
  `;
  
  // Number badge styles (16x16)
  const badgeStyles = `
    flex flex-col items-center justify-center
    size-4
    rounded
    bg-[#2b7fff]
    shrink-0
    ${disabled ? 'opacity-50' : ''}
  `;
  
  // Badge text styles
  const badgeTextStyles = `
    font-['Mona_Sans'] text-xs font-medium leading-4
    text-white text-center
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
      {/* Icon (conditional) */}
      {hasIcon && icon && (
        <span className={iconStyles}>
          {icon}
        </span>
      )}
      
      {/* Text Container */}
      <span className={textContainerStyles}>
        <span className={textStyles}>
          {label}
        </span>
      </span>
      
      {/* Number Badge (conditional) */}
      {hasNumber && (
        <span 
          className={badgeStyles}
          aria-label={`${number} items`}
        >
          <span className={badgeTextStyles}>
            {number}
          </span>
        </span>
      )}
    </button>
  );
}

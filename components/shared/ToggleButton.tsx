'use client';

import { memo, useState } from 'react';
import { GridIcon } from './Icons';
import type { ButtonHTMLAttributes } from 'react';

export type ToggleButtonState = 'Default' | 'Hover' | 'Active';

export interface ToggleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Whether the button is in active/pressed state
   * @default false
   */
  isActive?: boolean;

  /**
   * Button state: Default, Hover, or Active
   * If not provided, will be managed internally based on hover and isActive props
   */
  state?: ToggleButtonState;

  /**
   * Callback when button is clicked
   */
  onClick?: () => void;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * Custom content/icon to render inside the button
   * If not provided, defaults to GridIcon
   */
  children?: React.ReactNode;
}

/**
 * Toggle Button Component
 *
 * A toggle button component that displays a grid icon with three states:
 * - Default: White background, no shadow
 * - Hover: Neutral background on hover
 * - Active: White background with shadow and border
 *
 * Figma specs (node 529:2396-529:2401):
 * - Container: 30x30px, rounded-[6px], padding p-[10px]
 * - Default: white bg, no shadow
 * - Hover: neutral-50 bg on hover
 * - Active: white bg, shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.75px_rgba(0,0,0,0.06)]
 * - Icon: GridIcon 16x16px
 *
 * Features:
 * - Automatic hover state management
 * - Active state support
 * - Accessible with proper ARIA attributes
 * - Keyboard support (Enter/Space)
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <ToggleButton
 *   isActive={isGridActive}
 *   onClick={() => setIsGridActive(!isGridActive)}
 *   aria-label="Toggle grid view"
 * />
 * ```
 */
const ToggleButton = memo(function ToggleButton({
  isActive = false,
  state: controlledState,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  children,
  ...props
}: ToggleButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine current state
  const currentState: ToggleButtonState =
    controlledState ??
    (isActive ? 'Active' : isHovered ? 'Hover' : 'Default');

  // Get styles based on state
  // Active buttons have white background with shadow
  // Default/Inactive buttons are transparent (no background/shadow)
  const getStateStyles = () => {
    if (isActive) {
      // Active state: white background with shadow
      return {
        bg: 'bg-white',
        shadow: 'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.75px_rgba(0,0,0,0.06)]',
        iconColor: 'text-neutral-700', // rgba(82, 82, 82, 1) - darker icon when active
      };
    }
    
    // Inactive states
    switch (currentState) {
      case 'Hover':
        return {
          bg: 'bg-neutral-100', // neutral-100 fill for hover state
          shadow: '',
          iconColor: 'text-neutral-400', // rgba(161, 161, 161, 1)
        };
      default:
        return {
          bg: '', // No background (transparent) for default inactive state
          shadow: '',
          iconColor: 'text-neutral-400', // rgba(161, 161, 161, 1)
        };
    }
  };

  const styles = getStateStyles();

  // Get default aria-label if not provided
  const defaultAriaLabel = ariaLabel ?? 'Toggle grid view';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={defaultAriaLabel}
      aria-pressed={isActive}
      className={`
        ${styles.bg} ${styles.shadow}
        box-border content-stretch flex items-center justify-center
        overflow-clip p-[10px] relative rounded-[6px]
        size-[30px] transition-colors duration-200
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        }
        ${className}
      `.trim()}
      data-name="Toggle Button"
      {...props}
    >
      <div
        className={`overflow-clip relative shrink-0 size-[16px] flex items-center justify-center ${styles.iconColor}`}
      >
        {children || <GridIcon className="w-4 h-4" />}
      </div>
    </button>
  );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;


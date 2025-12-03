'use client';

import { memo, useState } from 'react';
import { CheckIcon, CrossIcon } from '@/components/icons';

export type ButtonIconVariant = 'Approve' | 'Reject';
export type ButtonIconState = 'Default' | 'Hover';

export interface ButtonIconOnlyProps {
  /**
   * Button variant: Approve (check icon) or Reject (cross icon)
   * @default "Approve"
   */
  variant?: ButtonIconVariant;

  /**
   * Button state: Default or Hover
   * If not provided, will be managed internally based on hover
   */
  state?: ButtonIconState;

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
}

/**
 * Button Icon Only Component
 *
 * A button component that displays only an icon (check for Approve, cross for Reject).
 * Used in HR-side app for quick approve/reject actions.
 *
 * Figma specs (node 451:1343-451:1350):
 * - Container: 28x28px, rounded-[8px], padding p-[10px]
 * - Default: white bg, border-neutral-200
 * - Hover: neutral-50 bg, border-neutral-200
 * - Approve: Check icon (10px)
 * - Reject: Cross icon (16px)
 *
 * Features:
 * - Automatic hover state management
 * - Accessible with proper ARIA attributes
 * - Keyboard support (Enter/Space)
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <ButtonIconOnly
 *   variant="Approve"
 *   onClick={() => handleApprove()}
 *   aria-label="Approve request"
 * />
 * ```
 */
const ButtonIconOnly = memo(function ButtonIconOnly({
  variant = 'Approve',
  state: controlledState,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: ButtonIconOnlyProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine current state
  const currentState: ButtonIconState =
    controlledState ?? (isHovered ? 'Hover' : 'Default');

  // Get styles based on state
  const getStateStyles = () => {
    switch (currentState) {
      case 'Hover':
        return {
          bg: 'bg-neutral-50',
          border: 'border border-neutral-200',
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border border-neutral-200',
        };
    }
  };

  const styles = getStateStyles();

  // Get icon based on variant
  const getIcon = () => {
    if (variant === 'Approve') {
      return <CheckIcon size={10} className="text-neutral-500" />;
    }
    return <CrossIcon size={16} className="text-neutral-500" />;
  };

  // Get default aria-label if not provided
  const defaultAriaLabel =
    ariaLabel ?? (variant === 'Approve' ? 'Approve' : 'Reject');

  // Get node ID based on variant and state
  const getNodeId = () => {
    if (variant === 'Approve' && currentState === 'Default') return '451:1344';
    if (variant === 'Approve' && currentState === 'Hover') return '451:1346';
    if (variant === 'Reject' && currentState === 'Default') return '451:1348';
    if (variant === 'Reject' && currentState === 'Hover') return '451:1350';
    return '451:1344';
  };

  // Get icon node ID
  const getIconNodeId = () => {
    if (variant === 'Approve') return '451:1345';
    return '451:1349';
  };

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
      className={`${styles.bg} ${styles.border} border-solid box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] relative rounded-[8px] size-[28px] transition-colors ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:bg-neutral-50'
      } ${className}`}
      data-name={`Variant=${variant}, State=${currentState}`}
      data-node-id={getNodeId()}
    >
      <div
        className="overflow-clip relative shrink-0 flex items-center justify-center"
        data-name={variant === 'Approve' ? 'check, checkmark' : 'cross-small, crossed small, delete, remove'}
        data-node-id={getIconNodeId()}
        style={{
          width: variant === 'Approve' ? '10px' : '16px',
          height: variant === 'Approve' ? '10px' : '16px',
        }}
      >
        {getIcon()}
      </div>
    </button>
  );
});

ButtonIconOnly.displayName = 'ButtonIconOnly';

export default ButtonIconOnly;




'use client';

import { memo, useState } from 'react';
import { CheckIcon, MinusIcon } from '@/components/icons';
import type { InputHTMLAttributes } from 'react';

export type CheckboxStatus = 'checked' | 'unchecked' | 'indeterminate';
export type CheckboxState = 'Default' | 'Hover';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  /**
   * Checkbox status: checked, unchecked, or indeterminate
   * @default "unchecked"
   */
  status?: CheckboxStatus;

  /**
   * Whether the checkbox is checked (for controlled mode)
   * If provided, status will be derived from this and indeterminate props
   */
  checked?: boolean;

  /**
   * Whether the checkbox is in indeterminate state
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Checkbox state: Default or Hover
   * If not provided, will be managed internally based on hover
   */
  state?: CheckboxState;

  /**
   * Callback when checkbox status changes
   */
  onChange?: (checked: boolean) => void;

  /**
   * Whether the checkbox is disabled
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
 * Checkbox Component
 *
 * A checkbox component with three statuses (checked, unchecked, indeterminate)
 * and two states (default, hover).
 *
 * Figma specs (node 536:2633-536:2654):
 * - Size: 16x16px, padding p-[4px], rounded-[5px]
 * - Checked: bg-[#00a63e] (green-600), white CheckIcon
 * - Indeterminate: bg-[#00a63e] (green-600), white MinusIcon
 * - Unchecked: border border-[#e5e5e5] (neutral-200), no icon
 * - Hover Checked: bg-[#00c950] (green-500), white CheckIcon
 * - Hover Indeterminate: bg-[#00c950] (green-500), white MinusIcon
 * - Hover Unchecked: border border-[#d4d4d4] (neutral-300), gray CheckIcon
 *
 * Features:
 * - Automatic hover state management
 * - Indeterminate state support
 * - Controlled and uncontrolled modes
 * - Accessible with proper ARIA attributes
 * - Keyboard support (Space key)
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isChecked}
 *   onChange={(checked) => setIsChecked(checked)}
 *   aria-label="Accept terms"
 * />
 * ```
 */
const Checkbox = memo(function Checkbox({
  status: controlledStatus,
  checked: controlledChecked,
  indeterminate = false,
  state: controlledState,
  onChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: CheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine status from props
  const getStatus = (): CheckboxStatus => {
    if (controlledStatus) return controlledStatus;
    if (indeterminate) return 'indeterminate';
    if (controlledChecked !== undefined) {
      return controlledChecked ? 'checked' : 'unchecked';
    }
    return 'unchecked';
  };

  const currentStatus = getStatus();
  const currentState: CheckboxState =
    controlledState ?? (isHovered ? 'Hover' : 'Default');

  // Get styles based on status and state
  const getStyles = () => {
    const isChecked = currentStatus === 'checked';
    const isIndeterminate = currentStatus === 'indeterminate';
    const isUnchecked = currentStatus === 'unchecked';
    const isHover = currentState === 'Hover';

    if (isChecked) {
      return {
        bg: isHover ? 'bg-[#00c950]' : 'bg-[#00a63e]', // green-500 hover, green-600 default
        border: '',
        icon: <CheckIcon size={8} className="text-white" />,
        iconColor: 'text-white',
      };
    }

    if (isIndeterminate) {
      return {
        bg: isHover ? 'bg-[#00c950]' : 'bg-[#00a63e]', // green-500 hover, green-600 default
        border: '',
        icon: <MinusIcon size={10} className="text-white" />,
        iconColor: 'text-white',
      };
    }

    // Unchecked
    return {
      bg: '',
      border: isHover
        ? 'border border-[#d4d4d4]' // neutral-300 on hover
        : 'border border-[#e5e5e5]', // neutral-200 default
      icon: isHover ? (
        <CheckIcon size={8} className="text-[#d4d4d4]" />
      ) : null,
      iconColor: 'text-[#d4d4d4]',
    };
  };

  const styles = getStyles();

  // Get node ID based on state and status
  const getNodeId = () => {
    if (currentStatus === 'checked') {
      return currentState === 'Hover' ? '536:2646' : '536:2634';
    }
    if (currentStatus === 'indeterminate') {
      return currentState === 'Hover' ? '536:2650' : '536:2638';
    }
    // Unchecked
    return currentState === 'Hover' ? '536:2654' : '536:2642';
  };

  // Get container node ID
  const getContainerNodeId = () => {
    if (currentStatus === 'checked') {
      return currentState === 'Hover' ? '536:2647' : '536:2635';
    }
    if (currentStatus === 'indeterminate') {
      return currentState === 'Hover' ? '536:2651' : '536:2639';
    }
    return currentState === 'Hover' ? '536:2655' : '536:2643';
  };

  const handleClick = () => {
    if (disabled) return;
    // Toggle between checked and unchecked (indeterminate becomes checked)
    const newChecked = currentStatus === 'checked' ? false : true;
    onChange?.(newChecked);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Determine aria-checked value
  const getAriaChecked = () => {
    if (currentStatus === 'indeterminate') return 'mixed';
    return currentStatus === 'checked';
  };

  return (
    <label
      className={`relative inline-flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="checkbox"
        checked={currentStatus === 'checked'}
        ref={(el) => {
          if (el) {
            el.indeterminate = currentStatus === 'indeterminate';
          }
        }}
        onChange={(e) => {
          if (disabled) return;
          const newChecked = e.target.checked;
          onChange?.(newChecked);
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-checked={getAriaChecked()}
        className="sr-only"
        {...props}
      />
      <div
        className={`
          ${styles.bg} ${styles.border}
          box-border content-stretch flex items-center justify-center
          overflow-clip p-[4px] relative rounded-[5px]
          size-[16px] transition-colors duration-200
          ${disabled ? 'opacity-50' : ''}
        `.trim()}
        data-name={`State=${currentState}, Status=${currentStatus === 'checked' ? 'Checked' : currentStatus === 'indeterminate' ? 'Indeterminate' : 'Unchecked'}`}
        data-node-id={getNodeId()}
      >
        <div
          className="relative shrink-0 size-[10px] flex items-center justify-center"
          data-name="Container"
          data-node-id={getContainerNodeId()}
        >
          {styles.icon && (
            <div
              className={`absolute ${currentStatus === 'indeterminate' ? 'left-0 top-0' : 'left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]'} overflow-clip ${currentStatus === 'indeterminate' ? 'size-[10px]' : 'size-[8px]'}`}
              data-name={
                currentStatus === 'indeterminate'
                  ? 'minus-large, remove, delete'
                  : 'check, checkmark'
              }
              data-node-id={
                currentStatus === 'checked'
                  ? currentState === 'Hover'
                    ? '536:2649'
                    : '536:2637'
                  : currentStatus === 'indeterminate'
                    ? currentState === 'Hover'
                      ? '536:2652'
                      : '536:2640'
                    : '536:2656'
              }
            >
              {styles.icon}
            </div>
          )}
        </div>
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;


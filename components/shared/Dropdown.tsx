'use client';

import { memo, useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDownIcon } from '@/components/icons';
import type { ButtonHTMLAttributes } from 'react';

export type DropdownState = 'Default' | 'Hover';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  /**
   * The text/label displayed in the dropdown button
   * @default "Select"
   */
  text?: string;

  /**
   * Optional icon to display before the text
   */
  icon?: ReactNode;

  /**
   * Whether to show the icon
   * @default true
   */
  hasIcon?: boolean;

  /**
   * Dropdown state: Default or Hover
   * If not provided, will be managed internally based on hover
   */
  state?: DropdownState;

  /**
   * Array of dropdown options
   */
  options?: DropdownOption[];

  /**
   * Currently selected value
   */
  value?: string;

  /**
   * Callback when an option is selected
   */
  onChange?: (value: string) => void;

  /**
   * Callback when dropdown is opened/closed
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Whether the dropdown is disabled
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
   * Width of the dropdown button
   * @default "auto"
   */
  width?: string | number;
}

/**
 * Dropdown Component
 *
 * A dropdown/select component with Default and Hover states.
 *
 * Figma specs (node 538:2779-538:2786):
 * - Size: 89px width (or custom), 36px height
 * - Default: bg-white, border neutral-200, shadow
 * - Hover: bg-neutral-50, border neutral-200, shadow
 * - Padding: pl-[10px] pr-[8px] py-[10px]
 * - Border radius: rounded-[8px]
 * - Shadow: shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]
 * - Layout: justify-between with Icon+Text container and Chevron
 * - Contains: optional icon, text (pl-[6px] pr-[4px]), chevron down icon
 *
 * Features:
 * - Automatic hover state management
 * - Keyboard navigation support
 * - Click outside to close
 * - Accessible with proper ARIA attributes
 * - Disabled state support
 * - Customizable width
 *
 * @example
 * ```tsx
 * <Dropdown
 *   text="Sort"
 *   options={[
 *     { value: 'asc', label: 'Ascending' },
 *     { value: 'desc', label: 'Descending' },
 *   ]}
 *   value={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 * />
 * ```
 */
const Dropdown = memo(function Dropdown({
  text = 'Select',
  icon,
  hasIcon = true,
  state: controlledState,
  options = [],
  value,
  onChange,
  onOpenChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  width = 'auto',
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentState: DropdownState =
    controlledState ?? (isHovered ? 'Hover' : 'Default');

  // Get styles based on state
  const getStyles = () => {
    switch (currentState) {
      case 'Hover':
        return {
          bg: 'bg-neutral-50', // #fafafa
          border: 'border border-neutral-200', // #e5e5e5
          shadow: 'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]',
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border border-neutral-200', // #e5e5e5
          shadow: 'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]',
        };
    }
  };

  const styles = getStyles();

  // Always display the text prop (e.g., "Sort" or "Filter"), not the selected option label
  const displayText = text;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setHighlightedIndex(-1);
        buttonRef.current?.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev < options.length - 1 ? prev + 1 : 0;
          return nextIndex;
        });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : options.length - 1;
          return nextIndex;
        });
      } else if (event.key === 'Enter' && highlightedIndex >= 0) {
        event.preventDefault();
        const option = options[highlightedIndex];
        if (option && !option.disabled) {
          onChange?.(option.value);
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options, onChange, disabled]);

  // Reset highlighted index when opening
  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, options, value]);

  // Notify parent of open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleOptionMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  const widthStyle =
    typeof width === 'number' ? `${width}px` : width;

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        aria-label={ariaLabel || `Select option: ${displayText}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`
          ${styles.bg} ${styles.border} ${styles.shadow}
          bg-white border border-neutral-200 border-solid
          content-stretch flex h-[36px] items-center justify-between
          pl-[10px] pr-[8px] py-[10px] relative rounded-[8px]
          shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]
          transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `.trim()}
        style={widthStyle !== 'auto' ? { width: widthStyle } : undefined}
        data-name="Dropdown"
        data-node-id="545:3511"
        {...props}
      >
        {/* Icon Container */}
        {hasIcon && (
          <div
            className="relative shrink-0 size-[16px]"
            data-name="Icon Container"
            data-node-id="I545:3511;741:4242"
          >
            {icon ? (
              <div className="absolute left-0 overflow-clip size-[16px] top-0 flex items-center justify-center">
                {icon}
              </div>
            ) : (
              <div
                className="absolute left-0 overflow-clip size-[16px] top-0"
                data-name="Icon"
                data-node-id="I545:3511;736:4188"
              >
                {/* Placeholder for icon - can be customized */}
                <div className="size-[16px]" />
              </div>
            )}
          </div>
        )}

        {/* Text */}
        <div
          className="content-stretch flex items-center justify-center px-[4px] py-0 relative shrink-0"
          data-name="Text"
          data-node-id="I545:3511;736:4189"
        >
          <p
            className="font-medium leading-[18px] relative shrink-0 text-neutral-500 text-sm text-nowrap whitespace-pre"
            data-node-id="I545:3511;736:4190"
          >
            {displayText}
          </p>
        </div>

        {/* Chevron Down Icon */}
        <div className="overflow-clip relative shrink-0 size-[16px] flex items-center justify-center">
          <ChevronDownIcon
            size={16}
            className={`text-neutral-700 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && options.length > 0 && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-[8px] shadow-[0px_2px_8px_0px_rgba(28,28,28,0.12),0px_0px_4px_0px_rgba(28,28,28,0.06)] overflow-hidden"
          style={{ minWidth: widthStyle }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => handleOptionMouseEnter(index)}
              className={`
                px-[12px] py-[8px] text-sm font-medium text-neutral-700 cursor-pointer
                transition-colors duration-150
                ${
                  option.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : highlightedIndex === index
                      ? 'bg-neutral-50'
                      : 'hover:bg-neutral-50'
                }
                ${option.value === value ? 'bg-neutral-100' : ''}
              `.trim()}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;


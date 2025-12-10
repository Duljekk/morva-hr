'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, CommandIcon } from '@/components/icons';

interface SearchBarProps {
  /**
   * Placeholder text for the search input
   * @default "Search"
   */
  placeholder?: string;
  
  /**
   * Callback function called when search value changes
   */
  onSearch?: (value: string) => void;
  
  /**
   * Initial search value
   */
  defaultValue?: string;
  
  /**
   * Controlled search value
   */
  value?: string;
  
  /**
   * Callback when search is submitted (Enter key or click)
   */
  onSubmit?: (value: string) => void;
  
  /**
   * Enable keyboard shortcut (Cmd/Ctrl + K) to focus
   * @default true
   */
  enableKeyboardShortcut?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Disable the search bar
   */
  disabled?: boolean;
  
  /**
   * Whether the search bar is collapsed (icon-only mode)
   * @default false
   */
  collapsed?: boolean;
  
  /**
   * Whether to show the Command + K icon indicator
   * @default true
   */
  showCommandIcon?: boolean;
  
  /**
   * Custom width for the search bar (when not collapsed)
   * @default 247
   */
  width?: number;
  
  /**
   * Custom border radius
   * @default 8
   */
  borderRadius?: number;
}

/**
 * SearchBar Component
 * 
 * A search input component with keyboard shortcut support (Cmd/Ctrl + K)
 * Following Next.js and React best practices:
 * - Accessible with proper ARIA labels
 * - Keyboard navigation support
 * - Controlled and uncontrolled modes
 * - Debounced search (optional via onSearch prop)
 * 
 * Design specifications from Figma:
 * - Width: 247px
 * - Height: 36px
 * - Border radius: 8px
 * - Padding: 10px horizontal, 4px vertical
 * - Background: rgba(161,161,161,0.05) default, rgba(161,161,161,0.1) hover
 * - Text: 14px, medium weight, neutral-500
 * - Icons: 16px
 */
export default function SearchBar({
  placeholder = 'Search',
  onSearch,
  defaultValue = '',
  value: controlledValue,
  onSubmit,
  enableKeyboardShortcut = true,
  className = '',
  disabled = false,
  collapsed = false,
  showCommandIcon = true,
  width: customWidth = 247,
  borderRadius = 8,
}: SearchBarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    if (!enableKeyboardShortcut || disabled) return;

    const handleKeyDown = (e: KeyboardEvent<Document> | globalThis.KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    // Use document for global keyboard shortcut
    document.addEventListener('keydown', handleKeyDown as EventListener);
    return () => {
      document.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [enableKeyboardShortcut, disabled]);

  // Handle value changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(newValue);
    }
  };

  // Handle form submission (Enter key)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  // Determine background color based on state
  const getBackgroundColor = () => {
    if (isFocused || isHovered) {
      return 'bg-[rgba(161,161,161,0.1)]';
    }
    return 'bg-[rgba(161,161,161,0.05)]';
  };

  // Width values for animation
  const width = collapsed ? 36 : customWidth;

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        width,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className={`
        box-border flex h-[36px] items-center
        ${collapsed ? 'justify-center' : (showCommandIcon ? 'justify-between' : 'justify-start')}
        overflow-hidden px-[10px] py-[4px] relative
        transition-colors duration-200
        ${collapsed 
          ? (isHovered && !disabled ? 'bg-[rgba(161,161,161,0.1)]' : '') 
          : getBackgroundColor()
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : collapsed ? 'cursor-pointer' : 'cursor-text'}
        ${className}
      `}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !disabled && inputRef.current?.focus()}
      role="search"
      aria-label={placeholder}
      title={collapsed ? placeholder : undefined}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      {/* Search Icon - Always visible, centered when collapsed */}
      <motion.div
        layout
        className="relative shrink-0 size-[16px] flex items-center justify-center"
        animate={{
          marginTop: collapsed ? 0 : '-1px',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <SearchIcon 
          className="w-4 h-4 text-neutral-500"
          aria-hidden="true"
        />
      </motion.div>

      {/* Search Input and Command Icon - Only visible when expanded */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            key="search-content"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="flex items-center relative shrink-0 flex-1 min-w-0 overflow-hidden"
          >
            {/* Search Input */}
            <div className="box-border flex gap-[10px] items-center justify-center px-[6px] py-0 relative shrink-0 flex-1 min-w-0">
              <input
                ref={inputRef}
                type="search"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={disabled}
                className={`
                  flex-1 min-w-0 bg-transparent border-0 outline-none
                  font-medium leading-bold-sm text-sm text-neutral-500
                  placeholder:text-neutral-500 whitespace-pre
                  focus:text-neutral-900
                  disabled:cursor-not-allowed
                  [&::-webkit-search-cancel-button]:hidden
                  [&::-webkit-search-decoration]:hidden
                  [&::-moz-search-clear-button]:hidden
                `}
                aria-label={placeholder}
                aria-describedby={showCommandIcon && enableKeyboardShortcut ? "search-shortcut" : undefined}
              />
            </div>

            {/* Command + K Shortcut Indicator */}
            {showCommandIcon && enableKeyboardShortcut && !disabled && (
              <div 
                className="flex items-center relative shrink-0"
                id="search-shortcut"
                aria-label="Press Command K or Control K to focus search"
              >
                {/* Command Icon */}
                <div className="overflow-clip relative shrink-0 w-[25px] h-[12.33px] flex items-center justify-center">
                  <CommandIcon 
                    className="w-[25px] h-[12.33px] text-neutral-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


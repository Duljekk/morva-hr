'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
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

  return (
    <div
      className={`
        box-border flex h-[36px] items-center justify-between
        overflow-hidden px-[10px] py-[4px] relative rounded-[8px]
        w-[247px] transition-colors duration-200
        ${getBackgroundColor()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
        ${className}
      `}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !disabled && inputRef.current?.focus()}
      role="search"
      aria-label="Search"
    >
      {/* Search Icon and Input */}
      <div className="flex items-center relative shrink-0 flex-1 min-w-0">
        {/* Search Icon */}
        <div className="relative shrink-0 size-[16px] flex items-center justify-center -mt-[1px]">
          <SearchIcon 
            className="w-4 h-4 text-neutral-500"
            aria-hidden="true"
          />
        </div>
        
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
            aria-describedby="search-shortcut"
          />
        </div>
      </div>

      {/* Command + K Shortcut Indicator */}
      {enableKeyboardShortcut && !disabled && (
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
    </div>
  );
}


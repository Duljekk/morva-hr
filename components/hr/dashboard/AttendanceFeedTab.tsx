'use client';

import { memo, useState, useRef, useEffect } from 'react';

export type TabState = 'Active' | 'Default' | 'Hover';

export interface AttendanceFeedTabProps {
  /**
   * Tab label text
   */
  label: string;

  /**
   * Whether this tab is currently active
   */
  isActive?: boolean;

  /**
   * Tab index for keyboard navigation
   */
  index?: number;

  /**
   * Callback when tab is clicked
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Tab ID for accessibility
   */
  id?: string;

  /**
   * ARIA controls attribute
   */
  'aria-controls'?: string;
}

/**
 * Attendance Feed Tab Component
 *
 * A single tab button component for the Attendance Feed section.
 * Supports three states: Active, Default, and Hover.
 *
 * Figma specs (node 451:1030-451:1035):
 * - Active: bg-neutral-100 (#f5f5f5), text-neutral-600 (#525252), font-semibold
 * - Default: no background, text-neutral-500 (#737373), font-medium
 * - Hover: bg-neutral-50 (#fafafa), text-neutral-500 (#737373), font-medium
 * - Container: rounded-[8px], padding p-[10px], height h-[28px]
 * - Text: text-xs, leading-[16px]
 *
 * Features:
 * - Accessible with proper ARIA attributes
 * - Keyboard navigation support (Arrow keys, Home, End)
 * - Hover state management
 *
 * @example
 * ```tsx
 * <AttendanceFeedTab
 *   label="Check-In"
 *   isActive={true}
 *   onClick={() => setActiveTab('check-in')}
 * />
 * ```
 */
const AttendanceFeedTab = memo(function AttendanceFeedTab({
  label,
  isActive = false,
  index = 0,
  onClick,
  className = '',
  id,
  'aria-controls': ariaControls,
}: AttendanceFeedTabProps) {
  const [isHovered, setIsHovered] = useState(false);
  const tabRef = useRef<HTMLButtonElement>(null);

  // Determine current state
  const state: TabState = isActive ? 'Active' : isHovered ? 'Hover' : 'Default';

  // Get styles based on state
  const getStateStyles = () => {
    switch (state) {
      case 'Active':
        return {
          container: 'bg-[#f5f5f5]', // neutral-100
          text: 'text-[#525252] font-semibold', // neutral-600
        };
      case 'Hover':
        return {
          container: 'bg-[#fafafa]', // neutral-50
          text: 'text-[#737373] font-medium', // neutral-500
        };
      default:
        return {
          container: '',
          text: 'text-[#737373] font-medium', // neutral-500
        };
    }
  };

  const styles = getStateStyles();

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const tabList = event.currentTarget.parentElement;
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('button[role="tab"]')) as HTMLButtonElement[];
    const currentIndex = tabs.indexOf(event.currentTarget);

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        tabs[nextIndex]?.focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        tabs[nextIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        tabs[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        tabs[tabs.length - 1]?.focus();
        break;
    }
  };

  const tabId = id || `attendance-feed-tab-${index}`;

  // Determine width based on label (Check-In is 73px, Check-Out is flexible)
  const getWidthClass = () => {
    if (isActive && label === 'Check-In') {
      return 'w-[73px]';
    }
    return ''; // Flexible width for other tabs
  };

  return (
    <button
      ref={tabRef}
      id={tabId}
      role="tab"
      aria-selected={isActive}
      aria-controls={ariaControls}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`box-border content-stretch flex gap-[10px] h-[28px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 transition-colors ${styles.container} ${getWidthClass()} ${className}`}
      data-name={`State=${state}`}
      data-node-id={
        state === 'Active' ? '451:1030' : state === 'Hover' ? '451:1032' : '451:1034'
      }
    >
      <p
        className={`leading-[16px] relative shrink-0 ${styles.text} text-xs text-nowrap whitespace-pre`}
        data-node-id={
          state === 'Active' ? '451:1031' : state === 'Hover' ? '451:1033' : '451:1035'
        }
      >
        {label}
      </p>
    </button>
  );
});

AttendanceFeedTab.displayName = 'AttendanceFeedTab';

export default AttendanceFeedTab;


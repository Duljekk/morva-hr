'use client';

import { memo, useState, useId } from 'react';
import AttendanceFeedTab from './AttendanceFeedTab';

export interface TabItem {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Display label for the tab
   */
  label: string;

  /**
   * Optional content to render when tab is active
   */
  content?: React.ReactNode;
}

export interface AttendanceFeedTabsProps {
  /**
   * Array of tab items
   */
  tabs: TabItem[];

  /**
   * Default active tab ID
   */
  defaultActiveTabId?: string;

  /**
   * Controlled active tab ID
   */
  activeTabId?: string;

  /**
   * Callback when active tab changes
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Whether to show tab panels
   * @default false
   */
  showPanels?: boolean;

  /**
   * ARIA label for the tab list
   */
  'aria-label'?: string;
}

/**
 * Attendance Feed Tabs Component
 *
 * A container component for managing multiple tabs in the Attendance Feed section.
 * Provides keyboard navigation, accessibility, and state management.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Keyboard navigation (Arrow keys, Home, End)
 * - ARIA attributes for accessibility
 * - Optional tab panels for content
 *
 * @example
 * ```tsx
 * <AttendanceFeedTabs
 *   tabs={[
 *     { id: 'check-in', label: 'Check-In' },
 *     { id: 'check-out', label: 'Check-Out' },
 *   ]}
 *   defaultActiveTabId="check-in"
 *   onTabChange={(tabId) => console.log('Tab changed:', tabId)}
 * />
 * ```
 */
const AttendanceFeedTabs = memo(function AttendanceFeedTabs({
  tabs,
  defaultActiveTabId,
  activeTabId: controlledActiveTabId,
  onTabChange,
  className = '',
  showPanels = false,
  'aria-label': ariaLabel = 'Attendance feed tabs',
}: AttendanceFeedTabsProps) {
  const [internalActiveTabId, setInternalActiveTabId] = useState(
    defaultActiveTabId || tabs[0]?.id || ''
  );

  // Use controlled value if provided, otherwise use internal state
  const activeTabId = controlledActiveTabId ?? internalActiveTabId;

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTabId) {
      if (!controlledActiveTabId) {
        setInternalActiveTabId(tabId);
      }
      onTabChange?.(tabId);
    }
  };

  const uniqueId = useId();
  const tabListId = `attendance-feed-tabs-${uniqueId}`;

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={className} data-name="Tabs Container">
      {/* Tab List */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="content-stretch flex items-center relative rounded-[10px] size-full"
        data-name="Tabs"
        data-node-id="428:2665"
      >
        {tabs.map((tab, index) => (
          <AttendanceFeedTab
            key={tab.id}
            id={`${tabListId}-tab-${index}`}
            label={tab.label}
            isActive={activeTabId === tab.id}
            index={index}
            onClick={() => handleTabClick(tab.id)}
            aria-controls={showPanels ? `${tabListId}-panel-${index}` : undefined}
          />
        ))}
      </div>

      {/* Tab Panels (optional) */}
      {showPanels && (
        <div className="mt-4" data-name="Tab Panels">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              id={`${tabListId}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${tabListId}-tab-${index}`}
              hidden={activeTabId !== tab.id}
              data-name="Tab Panel"
            >
              {tab.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

AttendanceFeedTabs.displayName = 'AttendanceFeedTabs';

export default AttendanceFeedTabs;


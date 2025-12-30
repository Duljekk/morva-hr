'use client';

import { memo, useState, useMemo } from 'react';
import AttendanceFeedTabs from './AttendanceFeedTabs';
import AttendanceFeedItem from './AttendanceFeedItem';
import EmptyStateIllustration from '@/app/assets/icons/empty-state.svg';
import type { AttendanceFeedStatus } from './AttendanceFeedBadge';

export interface AttendanceFeedEntry {
  /**
   * Unique identifier for the entry
   */
  id: string;

  /**
   * Employee full name
   */
  name: string;

  /**
   * Optional employee avatar image URL
   */
  avatarUrl?: string | null;

  /**
   * Attendance type
   */
  type: 'check-in' | 'check-out';

  /**
   * Time of check-in/check-out (e.g., "09:27 AM")
   */
  time: string;

  /**
   * Attendance status badge
   */
  status?: AttendanceFeedStatus;
}

export interface AttendanceFeedProps {
  /**
   * Array of attendance feed entries
   */
  entries?: AttendanceFeedEntry[];

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Error message
   */
  error?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Attendance Feed Component
 *
 * Main component for displaying attendance feed in the HR dashboard.
 * Includes tabs for filtering between Check-In and Check-Out entries.
 *
 * Figma specs (node 428:2662-428:2670):
 * - Container: white bg, rounded-[12px], shadow, padding pt-[20px] pb-[24px] px-[24px]
 * - Header: flex, justify-between, with title and tabs
 * - Title: text-lg/semibold, neutral-600, leading-[22px]
 * - Items: flex-col, gap between items
 *
 * @example
 * ```tsx
 * <AttendanceFeed
 *   entries={[
 *     {
 *       id: '1',
 *       name: 'Achmad Rafi',
 *       type: 'check-in',
 *       time: '09:27 AM',
 *       status: 'Late'
 *     }
 *   ]}
 * />
 * ```
 */
const AttendanceFeed = memo(function AttendanceFeed({
  entries = [],
  loading = false,
  error,
  className = '',
}: AttendanceFeedProps) {
  const [activeTab, setActiveTab] = useState<'check-in' | 'check-out'>('check-in');

  // Filter entries based on active tab
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => entry.type === activeTab);
  }, [entries, activeTab]);

  return (
    <div
      className={`bg-white box-border content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[20px] px-[24px] relative rounded-[12px] shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] size-full ${className}`}
      data-name="Attendance Feed"
      data-node-id="428:2662"
    >
      {/* Header */}
      <div
        className="content-stretch flex items-center justify-between relative shrink-0 w-full"
        data-name="Header"
        data-node-id="802:2091"
      >
        {/* Title */}
        <p
          className="font-semibold leading-[22px] relative shrink-0 text-neutral-600 text-lg text-nowrap whitespace-pre"
          data-node-id="802:2092"
        >
          Attendance Feed
        </p>

        {/* Tabs */}
        <AttendanceFeedTabs
          tabs={[
            { id: 'check-in', label: 'Check-In' },
            { id: 'check-out', label: 'Check-Out' },
          ]}
          activeTabId={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'check-in' | 'check-out')}
        />
      </div>

      {/* Attendance Items Group */}
      <div
        className="content-stretch flex flex-col items-start relative size-full"
        data-name="Attendance Items Group"
        data-node-id="428:2670"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8 text-neutral-500 w-full">
            Loading attendance feed...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500 w-full">
            {error}
          </div>
        ) : filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => {
            const isFirst = index === 0;
            const isLast = index === filteredEntries.length - 1;
            const isSingle = filteredEntries.length === 1;

            // Border classes based on position
            const borderClasses = isSingle
              ? '' // Single item: no border
              : isLast
              ? '' // Last item has no border
              : 'border-b border-neutral-100';

            // Padding classes based on position
            const paddingClasses = isSingle
              ? 'pt-0 pb-0' // Single item: no extra gap at bottom
              : isFirst
              ? 'pb-[18px] pt-0' // First: bottom padding only
              : isLast
              ? 'pt-[18px] pb-0' // Last: top padding only
              : 'py-[18px]'; // Middle: both top and bottom padding

            return (
              <div
                key={entry.id}
                className={`${borderClasses} box-border content-stretch flex gap-[8px] items-center ${paddingClasses} px-0 relative shrink-0 w-full`}
                data-name="Attendance Items Container"
                data-node-id={
                  index === 0 ? '428:2671' :
                  index === 1 ? '428:2686' :
                  index === 2 ? '428:2701' :
                  index === 3 ? '428:2716' :
                  index === 4 ? '428:2731' :
                  '428:2746'
                }
              >
                <AttendanceFeedItem
                  name={entry.name}
                  avatarUrl={entry.avatarUrl}
                  type={entry.type}
                  time={entry.time}
                  status={entry.status}
                />
              </div>
            );
          })
        ) : (
          /* Empty State - Figma node 800:2069 */
          <div
            className="content-stretch flex flex-col gap-[18px] items-center pb-[32px] pt-[28px] relative shrink-0 w-full"
            data-name="Container"
            data-node-id="800:2069"
          >
            {/* Empty State Illustration */}
            <div
              className="h-[78px] relative shrink-0 w-[258px]"
              data-name="empty-state"
              data-node-id="800:2070"
            >
              <EmptyStateIllustration className="w-full h-full" />
            </div>

            {/* Contents */}
            <div
              className="content-stretch flex flex-col gap-[6px] items-center text-sm text-center w-[266px]"
              data-name="Contents"
              data-node-id="800:2082"
            >
              <p
                className="font-medium leading-[18px] text-neutral-700"
                data-node-id="800:2083"
              >
                No attendance activity yet
              </p>
              <p
                className="font-normal leading-[20px] text-neutral-500 w-[266px]"
                data-node-id="800:2084"
              >
                Employee check-ins and check-outs will appear here once the day starts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

AttendanceFeed.displayName = 'AttendanceFeed';

export default AttendanceFeed;


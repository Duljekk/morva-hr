'use client';

import { useState, memo } from 'react';
import Tab from '@/components/shared/Tab';
import TabList from '@/components/shared/TabList';
import Tabs from '@/components/shared/Tabs';
import ActivityGroup, { type ActivityEntry } from './ActivityGroup';
import { CalendarOutlineIcon } from '@/components/icons';

export interface ActivityGroupData {
  /**
   * Unique identifier for the group
   */
  id: string;
  
  /**
   * Date label (e.g., "Today", "Yesterday", "December 6")
   */
  label: string;
  
  /**
   * Whether this is the last group (hides timeline)
   */
  isLast?: boolean;
  
  /**
   * Activities in this group
   */
  activities: ActivityEntry[];
}

export interface EmployeeActivitiesPanelProps {
  /**
   * Attendance activity groups
   */
  attendanceGroups?: ActivityGroupData[];
  
  /**
   * Leave request activity groups
   */
  leaveRequestGroups?: ActivityGroupData[];
  
  /**
   * Leave request notification count
   */
  leaveRequestCount?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Employee Activities Panel Component
 * 
 * Activities panel for the employee details page with tabs for Attendance and Leave Requests.
 * Based on Figma design node 587:1533.
 * 
 * Features:
 * - Header with "Activities" title and tabbed navigation
 * - Date-grouped activity feed with vertical dashed timeline
 * - Activity cards showing check-in/check-out entries with status badges
 * - Tab badges for notification counts
 * 
 * @example
 * ```tsx
 * <EmployeeActivitiesPanel 
 *   attendanceGroups={[
 *     { 
 *       id: '1', 
 *       label: 'Today',
 *       activities: [
 *         { id: 'a1', type: 'checkIn', time: '11:00', status: 'onTime' },
 *         { id: 'a2', type: 'checkOut', time: '19:20', status: 'overtime' },
 *       ]
 *     }
 *   ]}
 *   leaveRequestCount={1}
 * />
 * ```
 */
const EmployeeActivitiesPanel = memo(function EmployeeActivitiesPanel({
  attendanceGroups = [],
  leaveRequestGroups = [],
  leaveRequestCount = 0,
  className = '',
}: EmployeeActivitiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');

  const activeGroups = activeTab === 'attendance' ? attendanceGroups : leaveRequestGroups;

  return (
    <div
      className={`flex flex-col gap-[10px] items-start w-full ${className}`}
      data-name="Activities"
      data-node-id="587:1533"
    >
      {/* Header */}
      <div
        className="flex items-start justify-between w-full"
        data-name="Header"
        data-node-id="587:1534"
      >
        {/* Title */}
        <p
          className="font-sans font-semibold leading-[30px] text-[#404040] text-[20px] text-nowrap tracking-[-0.2px] whitespace-pre"
          data-node-id="587:1535"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Activities
        </p>

        {/* Tabs */}
        <Tabs aria-label="Activity types" data-node-id="596:1255">
          <TabList>
            <Tab
              label="Attendance"
              state={activeTab === 'attendance' ? 'active' : 'default'}
              onClick={() => setActiveTab('attendance')}
              hasNumber={false}
            />
            <Tab
              label="Leave Request"
              state={activeTab === 'leave' ? 'active' : 'default'}
              onClick={() => setActiveTab('leave')}
              hasNumber={leaveRequestCount > 0}
              number={leaveRequestCount}
            />
          </TabList>
        </Tabs>
      </div>

      {/* Activities Feed */}
      <div
        className="flex flex-col gap-[12px] items-start w-full"
        data-name="Activities Feed"
        data-node-id="587:1543"
      >
        {activeGroups.length > 0 ? (
          activeGroups.map((group, index) => (
            <ActivityGroup
              key={group.id}
              dateLabel={group.label}
              activities={group.activities}
              showTimeline={!group.isLast && index < activeGroups.length - 1}
            />
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center w-full py-12">
            <CalendarOutlineIcon size={48} className="text-[#d4d4d4] mb-3" />
            <p className="text-[#737373] text-sm font-medium">
              No {activeTab === 'attendance' ? 'attendance records' : 'leave requests'}
            </p>
            <p className="text-[#a3a3a3] text-xs mt-1">
              {activeTab === 'attendance'
                ? 'Attendance records will appear here'
                : 'Leave requests will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

EmployeeActivitiesPanel.displayName = 'EmployeeActivitiesPanel';

export default EmployeeActivitiesPanel;

// Re-export types for convenience
export type { ActivityEntry } from './ActivityGroup';
export type { ActivityStatus } from './ActivityStatusBadge';
export type { ActivityType } from './ActivityCard';

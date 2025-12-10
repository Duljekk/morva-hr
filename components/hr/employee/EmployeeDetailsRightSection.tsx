'use client';

import { useState } from 'react';
import StatisticWidget from '@/components/hr/StatisticWidget';
import EmployeeActivitiesPanel, { type ActivityGroupData } from './EmployeeActivitiesPanel';
import Clock18Icon from '@/components/icons/shared/Clock18';
import HourglassIcon from '@/components/icons/shared/HourglassIcon';

export interface EmployeeDetailsRightSectionProps {
  /** Employee ID to fetch activities for */
  employeeId?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Employee Details Right Section Component
 * 
 * Right section of the employee details page containing statistics and activities.
 * Based on Figma design node 587:1499.
 * 
 * Features:
 * - Two statistic widgets (Avg. Check-In Time, Total Hours Worked)
 * - Activities section with tabbed navigation (Attendance, Leave Request)
 * - Date-grouped activity feed with timeline
 * - Responsive layout matching Figma specifications
 * 
 * @example
 * ```tsx
 * <EmployeeDetailsRightSection employeeId="123" />
 * ```
 */
export default function EmployeeDetailsRightSection({
  employeeId,
  className = '',
}: EmployeeDetailsRightSectionProps) {
  // Mock data - in real app, fetch based on employeeId
  const avgCheckInTime = '11:05';
  const avgCheckInTrend = '1 minute';
  const totalHoursWorked = '168';
  const totalHoursTrend = '8 hours';

  // Mock attendance groups matching Figma design
  const attendanceGroups: ActivityGroupData[] = [
    {
      id: 'today',
      label: 'Today',
      activities: [
        { id: 'a1', type: 'checkIn', time: '11:00', status: 'onTime' },
        { id: 'a2', type: 'checkOut', time: '19:20', status: 'overtime' },
      ],
    },
    {
      id: 'yesterday',
      label: 'Yesterday',
      activities: [
        { id: 'a3', type: 'checkIn', time: '11:12', status: 'late' },
        { id: 'a4', type: 'checkOut', time: '19:00', status: 'onTime' },
      ],
    },
    {
      id: 'dec6',
      label: 'December 6',
      isLast: true,
      activities: [
        { id: 'a5', type: 'checkIn', time: '11:00', status: 'onTime' },
        { id: 'a6', type: 'checkOut', time: '19:00', status: 'onTime' },
      ],
    },
  ];

  // Mock leave request groups
  const leaveRequestGroups: ActivityGroupData[] = [
    {
      id: 'leave1',
      label: 'November 15',
      isLast: true,
      activities: [
        { id: 'l1', type: 'checkIn', time: '10:30', status: 'onTime' },
      ],
    },
  ];

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      {/* Statistics Section */}
      <div className="flex gap-4">
        {/* Average Check-In Time Widget */}
        <StatisticWidget
          title="Avg. Check-In Time"
          value={avgCheckInTime}
          unit="AM"
          trend={avgCheckInTrend}
          comparison="vs last month"
          trendDirection="down"
          icon={<Clock18Icon className="w-[18px] h-[18px]" />}
          className="flex-1"
        />

        {/* Total Hours Worked Widget */}
        <StatisticWidget
          title="Total Hours Worked"
          value={totalHoursWorked}
          unit="hours"
          trend={totalHoursTrend}
          comparison="vs last month"
          trendDirection="up"
          icon={<HourglassIcon className="w-[18px] h-[18px]" />}
          className="flex-1"
        />
      </div>

      {/* Activities Section */}
      <EmployeeActivitiesPanel
        attendanceGroups={attendanceGroups}
        leaveRequestGroups={leaveRequestGroups}
        leaveRequestCount={1}
      />
    </div>
  );
}

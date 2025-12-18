'use client';

import { useState, useEffect } from 'react';
import StatisticWidget from '@/components/hr/StatisticWidget';
import EmployeeActivitiesPanel, { type ActivityGroupData } from './EmployeeActivitiesPanel';
import EmployeeDetailsRightSkeleton from './EmployeeDetailsRightSkeleton';
import Clock18Icon from '@/components/icons/shared/Clock18';
import HourglassIcon from '@/components/icons/shared/HourglassIcon';
import {
  getEmployeeActivities,
  getEmployeeAttendanceStats,
  type EmployeeActivitiesResult,
  type EmployeeAttendanceStats,
} from '@/lib/actions/hr/employeeDetails';
import { formatCheckInTimeDisplay } from '@/lib/utils/attendanceStats';

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
 */
export default function EmployeeDetailsRightSection({
  employeeId,
  className = '',
}: EmployeeDetailsRightSectionProps) {
  const [activities, setActivities] = useState<EmployeeActivitiesResult | null>(null);
  const [stats, setStats] = useState<EmployeeAttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Placeholder comparison values (to be implemented later per user request)
  const avgCheckInTrend = '1 minute';
  const totalHoursTrend = '8 hours';

  // Format stats for display
  const checkInDisplay = formatCheckInTimeDisplay(stats?.avgCheckInTimeMinutes ?? null);
  const avgHoursDisplay = stats?.avgHoursWorked !== null && stats?.avgHoursWorked !== undefined
    ? stats.avgHoursWorked.toFixed(1)
    : '--';

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch activities and stats in parallel
        const [activitiesResult, statsResult] = await Promise.all([
          getEmployeeActivities(employeeId!),
          getEmployeeAttendanceStats(employeeId!),
        ]);

        // Handle activities result
        if (activitiesResult.error) {
          setError(activitiesResult.error);
          return;
        }
        if (activitiesResult.data) {
          setActivities(activitiesResult.data);
        }

        // Handle stats result (log error but don't block UI)
        if (statsResult.error) {
          console.warn('[EmployeeDetailsRightSection] Stats error:', statsResult.error);
        } else if (statsResult.data) {
          setStats(statsResult.data);
        }
      } catch (err) {
        console.error('[EmployeeDetailsRightSection] Error:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [employeeId]);

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      {/* Show skeleton for the entire right section when loading */}
      {loading ? (
        <EmployeeDetailsRightSkeleton />
      ) : (
        <>
          {/* Statistics Section */}
          <div className="flex gap-4">
            <StatisticWidget
              title="Avg. Hours Worked"
              value={avgHoursDisplay}
              unit="hours"
              trend={totalHoursTrend}
              comparison="vs last month"
              trendDirection="up"
              icon={<HourglassIcon className="w-[18px] h-[18px]" />}
              className="flex-1"
            />
            <StatisticWidget
              title="Avg. Check-In Time"
              value={checkInDisplay.time}
              unit={checkInDisplay.meridiem || 'AM'}
              trend={avgCheckInTrend}
              comparison="vs last month"
              trendDirection="down"
              icon={<Clock18Icon className="w-[18px] h-[18px]" />}
              className="flex-1"
            />
          </div>

          {/* Activities Section */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : (
            <EmployeeActivitiesPanel
              attendanceGroups={activities?.attendanceGroups || []}
              leaveRequestGroups={activities?.leaveRequestGroups || []}
              leaveRequestCount={activities?.leaveRequestCount || 0}
            />
          )}
        </>
      )}
    </div>
  );
}

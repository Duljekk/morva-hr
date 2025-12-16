'use client';

import { useState, useEffect } from 'react';
import StatisticWidget from '@/components/hr/StatisticWidget';
import EmployeeActivitiesPanel, { type ActivityGroupData } from './EmployeeActivitiesPanel';
import Clock18Icon from '@/components/icons/shared/Clock18';
import HourglassIcon from '@/components/icons/shared/HourglassIcon';
import { getEmployeeActivities, type EmployeeActivitiesResult } from '@/lib/actions/hr/employeeDetails';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock statistics (to be implemented separately)
  const avgCheckInTime = '11:05';
  const avgCheckInTrend = '1 minute';
  const totalHoursWorked = '168';
  const totalHoursTrend = '8 hours';

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    async function fetchActivities() {
      try {
        setLoading(true);
        setError(null);
        const result = await getEmployeeActivities(employeeId!);

        if (result.error) {
          setError(result.error);
          return;
        }

        if (result.data) {
          setActivities(result.data);
        }
      } catch (err) {
        console.error('[EmployeeDetailsRightSection] Error:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [employeeId]);

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      {/* Statistics Section */}
      <div className="flex gap-4">
        <StatisticWidget
          title="Avg. Hours Worked"
          value={totalHoursWorked}
          unit="hours"
          trend={totalHoursTrend}
          comparison="vs last month"
          trendDirection="up"
          icon={<HourglassIcon className="w-[18px] h-[18px]" />}
          className="flex-1"
        />
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
      </div>

      {/* Activities Section */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2b7fff]" />
        </div>
      ) : error ? (
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
    </div>
  );
}

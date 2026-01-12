'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import StatisticSection from '@/components/hr/StatisticSection';
import EmployeeActivitiesPanel from './EmployeeActivitiesPanel';
import EmployeeDetailsRightSkeleton from './EmployeeDetailsRightSkeleton';
import EmptyStatePlaceholder from './EmptyStatePlaceholder';
import Dropdown from '@/components/shared/Dropdown';
import Clock18Icon from '@/components/icons/shared/Clock18';
import HourglassIcon from '@/components/icons/shared/HourglassIcon';
import {
  getEmployeeActivities,
  getEmployeeAttendanceStats,
  type EmployeeActivitiesResult,
  type EmployeeAttendanceStats,
} from '@/lib/actions/hr/employeeDetails';
import { formatCheckInTimeDisplay } from '@/lib/utils/attendanceStats';
import { getCurrentMonth, getCurrentYear } from '@/lib/utils/timezone';

/** Month names for display */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/** Month options for dropdown */
const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({
  value: String(index + 1),
  label: name,
}));

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
 * - Month/year filter for statistics (Requirements 1.1, 1.2, 1.3)
 * - Dynamic statistics re-fetch on filter change (Requirements 1.4, 2.1, 2.2)
 * - Empty state placeholder when no data exists (Requirements 3.1, 3.2, 3.3)
 */
export default function EmployeeDetailsRightSection({
  employeeId,
  className = '',
}: EmployeeDetailsRightSectionProps) {
  const [activities, setActivities] = useState<EmployeeActivitiesResult | null>(null);
  const [stats, setStats] = useState<EmployeeAttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state for month/year selection (Requirements 1.1, 1.2, 1.3)
  const [selectedMonth, setSelectedMonth] = useState<number>(() => getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState<number>(() => getCurrentYear());

  // Placeholder comparison values (to be implemented later per user request)
  const avgCheckInTrend = '1 minute';
  const totalHoursTrend = '8 hours';

  // Format stats for display
  const checkInDisplay = formatCheckInTimeDisplay(stats?.avgCheckInTimeMinutes ?? null);
  const avgHoursDisplay = stats?.avgHoursWorked !== null && stats?.avgHoursWorked !== undefined
    ? stats.avgHoursWorked.toFixed(1)
    : '--';

  // Check if stats has no data (for empty state display)
  const hasNoStatsData = stats !== null && 
    stats.avgHoursWorked === null && 
    stats.avgCheckInTimeMinutes === null;

  // Generate year options (current year and 4 years back)
  const yearOptions = useMemo(() => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 4; y--) {
      years.push({ value: String(y), label: String(y) });
    }
    return years;
  }, []);

  // Handler for month change (Requirements 1.1)
  const handleMonthChange = useCallback((month: number) => {
    setSelectedMonth(month);
  }, []);

  // Handler for year change (Requirements 1.2)
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  // Dropdown change handlers (convert string to number)
  const handleMonthDropdownChange = useCallback((value: string) => {
    handleMonthChange(parseInt(value, 10));
  }, [handleMonthChange]);

  const handleYearDropdownChange = useCallback((value: string) => {
    handleYearChange(parseInt(value, 10));
  }, [handleYearChange]);

  // Initial data fetch (activities and stats)
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
          getEmployeeActivities(employeeId!, selectedMonth, selectedYear),
          getEmployeeAttendanceStats(employeeId!, selectedMonth, selectedYear),
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
  }, [employeeId]); // Only re-run on employeeId change for initial load

  // Re-fetch statistics when month/year filter changes (Requirements 1.4, 2.1, 2.2)
  useEffect(() => {
    if (!employeeId || loading) {
      return;
    }

    async function fetchStats() {
      try {
        setStatsLoading(true);

        const statsResult = await getEmployeeAttendanceStats(employeeId!, selectedMonth, selectedYear);

        if (statsResult.error) {
          console.warn('[EmployeeDetailsRightSection] Stats error:', statsResult.error);
          setStats(null);
        } else if (statsResult.data) {
          setStats(statsResult.data);
        }
      } catch (err) {
        console.error('[EmployeeDetailsRightSection] Stats fetch error:', err);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, [employeeId, selectedMonth, selectedYear, loading]);

  // Re-fetch activities when month/year filter changes
  useEffect(() => {
    if (!employeeId || loading) {
      return;
    }

    async function fetchActivities() {
      try {
        setActivitiesLoading(true);

        const activitiesResult = await getEmployeeActivities(employeeId!, selectedMonth, selectedYear);

        if (activitiesResult.error) {
          console.warn('[EmployeeDetailsRightSection] Activities error:', activitiesResult.error);
          setActivities(null);
        } else if (activitiesResult.data) {
          setActivities(activitiesResult.data);
        }
      } catch (err) {
        console.error('[EmployeeDetailsRightSection] Activities fetch error:', err);
        setActivities(null);
      } finally {
        setActivitiesLoading(false);
      }
    }

    fetchActivities();
  }, [employeeId, selectedMonth, selectedYear, loading]);

  // Get month name for empty state display
  const selectedMonthName = MONTH_NAMES[selectedMonth - 1] || 'Unknown';

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      {/* Show skeleton for the entire right section when loading */}
      {loading ? (
        <EmployeeDetailsRightSkeleton />
      ) : (
        <>
          {/* Statistics Section with filter controls */}
          {/* Requirements 3.1, 3.2, 3.3: Show empty state when no data, but keep dropdowns functional */}
          {hasNoStatsData ? (
            <div className="flex flex-col gap-[10px] items-start w-full" data-name="Statistic">
              {/* Header + Dropdown - same layout as StatisticSection for consistency */}
              <div className="flex items-center justify-between w-full">
                <h2 className="font-semibold text-xl leading-[30px] text-neutral-700 tracking-[-0.2px]">
                  Statistic
                </h2>
                <div className="flex gap-2 items-center">
                  <Dropdown
                    text={selectedMonthName}
                    options={MONTH_OPTIONS}
                    value={String(selectedMonth)}
                    onChange={handleMonthDropdownChange}
                    hasIcon={false}
                  />
                  <Dropdown
                    text={String(selectedYear)}
                    options={yearOptions}
                    value={String(selectedYear)}
                    onChange={handleYearDropdownChange}
                    hasIcon={false}
                  />
                </div>
              </div>
              <EmptyStatePlaceholder
                month={selectedMonthName}
                year={selectedYear}
                className="py-8"
              />
            </div>
          ) : (
            <StatisticSection
              statistics={[
                {
                  title: 'Avg. Hours Worked',
                  value: statsLoading ? '--' : avgHoursDisplay,
                  unit: 'hrs/day',
                  trend: totalHoursTrend,
                  comparison: 'vs last month',
                  trendDirection: 'up',
                  icon: <HourglassIcon className="w-[18px] h-[18px]" />,
                },
                {
                  title: 'Avg. Check-In Time',
                  value: statsLoading ? '--' : checkInDisplay.time,
                  unit: statsLoading ? '' : (checkInDisplay.meridiem || 'AM'),
                  trend: avgCheckInTrend,
                  comparison: 'vs last month',
                  trendDirection: 'up',
                  icon: <Clock18Icon className="w-[18px] h-[18px]" />,
                },
              ]}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
            />
          )}

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
              employeeId={employeeId}
            />
          )}
        </>
      )}
    </div>
  );
}

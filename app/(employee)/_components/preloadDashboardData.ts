/**
 * Dashboard Data Preloader
 * 
 * PERFORMANCE OPTIMIZATION: Preload critical data before component mounts
 * 
 * This utility warms the SWR cache by prefetching dashboard data.
 * When called early (e.g., in layout or on route transition), 
 * the data will already be in cache when the component renders.
 * 
 * Benefits:
 * - Eliminates loading states on initial render
 * - Data appears instantly when navigating to dashboard
 * - Works with SWR's deduplication (no duplicate requests)
 */

import { mutate } from 'swr';
import { getTodaysAttendance, getRecentActivities } from '@/lib/actions/shared/attendance';
import { hasActiveLeaveRequest } from '@/lib/actions/employee/leaves';
import { getActiveAnnouncements } from '@/lib/actions/hr/announcements';

// Cache keys must match those in useDashboardData.ts
const CACHE_KEYS = {
  attendance: 'dashboard-attendance',
  announcements: 'dashboard-announcements',
  leaveStatus: 'dashboard-leave-status',
  activities: 'dashboard-activities',
} as const;

// Helper to format time with period
const formatTimeWithPeriod = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

/**
 * Preload all dashboard data into SWR cache
 * Call this early to warm the cache before rendering the dashboard
 */
export async function preloadDashboardData(): Promise<void> {
  // Fetch all data in parallel
  const [attendanceResult, announcementsResult, leaveStatusResult, activitiesResult] = await Promise.all([
    getTodaysAttendance(),
    getActiveAnnouncements(),
    hasActiveLeaveRequest(),
    getRecentActivities(3),
  ]);

  // Populate SWR cache with fetched data
  
  // Attendance
  if ('data' in attendanceResult && attendanceResult.data) {
    mutate(CACHE_KEYS.attendance, {
      checkInTime: attendanceResult.data.check_in_time 
        ? new Date(attendanceResult.data.check_in_time) 
        : null,
      checkOutTime: attendanceResult.data.check_out_time 
        ? new Date(attendanceResult.data.check_out_time) 
        : null,
    }, { revalidate: false });
  } else {
    mutate(CACHE_KEYS.attendance, { checkInTime: null, checkOutTime: null }, { revalidate: false });
  }

  // Announcements
  if (announcementsResult.data && announcementsResult.data.length > 0) {
    const announcement = announcementsResult.data[0];
    const announcementDate = new Date(announcement.created_at);
    mutate(CACHE_KEYS.announcements, {
      id: announcement.id,
      title: announcement.title,
      date: announcementDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: formatTimeWithPeriod(announcementDate),
      body: announcement.content || '',
    }, { revalidate: false });
  } else {
    mutate(CACHE_KEYS.announcements, null, { revalidate: false });
  }

  // Leave Status
  if (leaveStatusResult.data) {
    const leaveTypeName = leaveStatusResult.data.request
      ? ((leaveStatusResult.data.request as any).leaveTypeName || 
          (() => {
            const leaveTypeMap: Record<string, string> = {
              'annual': 'Annual Leave',
              'sick': 'Sick Leave',
              'unpaid': 'Unpaid Leave',
            };
            return leaveTypeMap[leaveStatusResult.data.request.leave_type_id] || 'Leave';
          })())
      : undefined;
    
    mutate(CACHE_KEYS.leaveStatus, {
      hasActiveLeave: leaveStatusResult.data.hasActive,
      activeLeaveInfo: leaveStatusResult.data.request ? {
        id: leaveStatusResult.data.request.id,
        status: leaveStatusResult.data.request.status,
        startDate: leaveStatusResult.data.request.start_date,
        endDate: leaveStatusResult.data.request.end_date,
        leaveTypeName,
      } : undefined,
    }, { revalidate: false });
  } else {
    mutate(CACHE_KEYS.leaveStatus, { hasActiveLeave: false }, { revalidate: false });
  }

  // Activities
  if (activitiesResult.data) {
    mutate(CACHE_KEYS.activities, activitiesResult.data.slice(0, 3), { revalidate: false });
  } else {
    mutate(CACHE_KEYS.activities, [], { revalidate: false });
  }
}

/**
 * Preload only attendance data (lightweight preload)
 * Useful for quick route transitions
 */
export async function preloadAttendance(): Promise<void> {
  const result = await getTodaysAttendance();
  
  if ('data' in result && result.data) {
    mutate(CACHE_KEYS.attendance, {
      checkInTime: result.data.check_in_time 
        ? new Date(result.data.check_in_time) 
        : null,
      checkOutTime: result.data.check_out_time 
        ? new Date(result.data.check_out_time) 
        : null,
    }, { revalidate: false });
  }
}

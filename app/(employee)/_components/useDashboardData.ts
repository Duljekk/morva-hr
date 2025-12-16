/**
 * Dashboard Data Hook with SWR
 * 
 * PERFORMANCE OPTIMIZATION: Client-side caching with SWR
 * 
 * Benefits:
 * - Automatic caching of fetched data
 * - Revalidation on window focus (keeps data fresh)
 * - Deduplication of simultaneous requests
 * - Stale-while-revalidate pattern for instant UI
 * - Built-in error handling and loading states
 */

import useSWR from 'swr';
import { getTodaysAttendance, getRecentActivities, type DayActivity } from '@/lib/actions/shared/attendance';
import { hasActiveLeaveRequest } from '@/lib/actions/employee/leaves';
import { getActiveAnnouncements } from '@/lib/actions/hr/announcements';

// Status types matching database values
export type CheckInStatus = 'ontime' | 'late';
export type CheckOutStatus = 'ontime' | 'overtime' | 'leftearly';

// Types for dashboard data
export interface AttendanceData {
  checkInTime: Date | null;
  checkOutTime: Date | null;
  /** Check-in status from database - single source of truth for both Employee and HR apps */
  checkInStatus: CheckInStatus | null;
  /** Check-out status from database - single source of truth for both Employee and HR apps */
  checkOutStatus: CheckOutStatus | null;
}

export interface AnnouncementData {
  id: string;
  title: string;
  date: string;
  time: string;
  body: string;
}

export interface LeaveStatusData {
  hasActiveLeave: boolean;
  activeLeaveInfo?: {
    id?: string;
    status: string;
    startDate: string;
    endDate: string;
    leaveTypeName?: string;
  };
}

// Helper to format time with period
const formatTimeWithPeriod = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// Fetcher functions for SWR
async function fetchAttendance(): Promise<AttendanceData> {
  const result = await getTodaysAttendance();

  if ('data' in result && result.data) {
    return {
      checkInTime: result.data.check_in_time ? new Date(result.data.check_in_time) : null,
      checkOutTime: result.data.check_out_time ? new Date(result.data.check_out_time) : null,
      // Fetch status directly from database - ensures consistency with HR app
      checkInStatus: (result.data.check_in_status as CheckInStatus) || null,
      checkOutStatus: (result.data.check_out_status as CheckOutStatus) || null,
    };
  }

  return { checkInTime: null, checkOutTime: null, checkInStatus: null, checkOutStatus: null };
}

async function fetchAnnouncements(): Promise<AnnouncementData | null> {
  const result = await getActiveAnnouncements();

  if (result.data && result.data.length > 0) {
    const announcement = result.data[0];
    const announcementDate = new Date(announcement.created_at);

    return {
      id: announcement.id,
      title: announcement.title,
      date: announcementDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: formatTimeWithPeriod(announcementDate),
      body: announcement.content || '',
    };
  }

  return null;
}

async function fetchLeaveStatus(): Promise<LeaveStatusData> {
  const result = await hasActiveLeaveRequest();

  if (result.data) {
    const leaveTypeName = result.data.request
      ? ((result.data.request as any).leaveTypeName ||
        (() => {
          const leaveTypeMap: Record<string, string> = {
            'annual': 'Annual Leave',
            'sick': 'Sick Leave',
            'unpaid': 'Unpaid Leave',
          };
          return leaveTypeMap[result.data.request.leave_type_id] || 'Leave';
        })())
      : undefined;

    return {
      hasActiveLeave: result.data.hasActive,
      activeLeaveInfo: result.data.request ? {
        id: result.data.request.id,
        status: result.data.request.status,
        startDate: result.data.request.start_date,
        endDate: result.data.request.end_date,
        leaveTypeName,
      } : undefined,
    };
  }

  return { hasActiveLeave: false };
}

async function fetchActivities(): Promise<DayActivity[]> {
  const result = await getRecentActivities(3);

  if (result.data) {
    return result.data.slice(0, 3);
  }

  return [];
}

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false, // Don't refetch on window focus (data is already cached server-side)
  revalidateOnReconnect: true, // Refetch when reconnecting
  dedupingInterval: 5000, // Dedupe requests within 5 seconds
  errorRetryCount: 2, // Retry failed requests twice
};

/**
 * Hook for fetching attendance data with SWR caching
 */
export function useAttendance() {
  const { data, error, isLoading, mutate } = useSWR(
    'dashboard-attendance',
    fetchAttendance,
    swrConfig
  );

  return {
    attendance: data ?? { checkInTime: null, checkOutTime: null, checkInStatus: null, checkOutStatus: null },
    isLoading,
    error,
    mutate, // Allows manual revalidation after check-in/check-out
  };
}

/**
 * Hook for fetching announcements with SWR caching
 */
export function useAnnouncements() {
  const { data, error, isLoading } = useSWR(
    'dashboard-announcements',
    fetchAnnouncements,
    {
      ...swrConfig,
      revalidateOnFocus: false,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  return {
    announcement: data,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching leave status with SWR caching
 */
export function useLeaveStatus() {
  const { data, error, isLoading, mutate } = useSWR(
    'dashboard-leave-status',
    fetchLeaveStatus,
    swrConfig
  );

  return {
    leaveStatus: data ?? { hasActiveLeave: false },
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook for fetching recent activities with SWR caching
 */
export function useActivities() {
  const { data, error, isLoading, mutate } = useSWR(
    'dashboard-activities',
    fetchActivities,
    swrConfig
  );

  return {
    activities: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Combined hook for all dashboard data
 * Fetches all data in parallel with individual caching
 */
export function useDashboardData() {
  const attendance = useAttendance();
  const announcements = useAnnouncements();
  const leaveStatus = useLeaveStatus();
  const activities = useActivities();

  const isLoading = attendance.isLoading || announcements.isLoading ||
    leaveStatus.isLoading || activities.isLoading;

  return {
    attendance: attendance.attendance,
    announcement: announcements.announcement,
    leaveStatus: leaveStatus.leaveStatus,
    activities: activities.activities,
    isLoading,
    mutateAttendance: attendance.mutate,
    mutateActivities: activities.mutate,
    mutateLeaveStatus: leaveStatus.mutate,
  };
}

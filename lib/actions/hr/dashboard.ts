'use server';

/**
 * Server actions for HR dashboard
 * Handles HR dashboard statistics, attendance feed, and activities
 * 
 * Location: lib/actions/hr/ - HR-only actions
 * All functions require HR admin role
 * Uses GMT+7 (Asia/Bangkok) timezone for all date operations
 * 
 * Best Practices:
 * - Parallel queries using Promise.all for performance
 * - Proper error handling with descriptive messages
 * - Type-safe return values
 * - Cache invalidation on mutations
 */

import { revalidateTag } from 'next/cache';
import { requireHRAdmin } from '@/lib/auth/server';
import { DayActivity, Activity } from '../shared/attendance';
import {
  getTodayDateString,
  getNowInGMT7,
  formatDateISO,
  formatTimeShort,
  APP_TIMEZONE
} from '@/lib/utils/timezone';

export interface HRStats {
  totalEmployees: number;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
}

export interface EmployeeActivity extends Activity {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface DayEmployeeActivity {
  date: string;
  activities: EmployeeActivity[];
}

/**
 * Attendance Feed Entry
 * Represents a single check-in or check-out entry in the attendance feed
 */
export interface AttendanceFeedEntry {
  id: string;
  user: {
    id: string;
    full_name: string;
    initials: string; // e.g., "AR" for "Achmad Rafi"
  };
  type: 'checkin' | 'checkout';
  time: string; // Formatted time (e.g., "09:27 AM")
  status: 'late' | 'ontime' | 'overtime' | 'leftearly';
  timestamp: string; // ISO timestamp for sorting
}

/**
 * GET HR DASHBOARD STATS
 * 
 * Returns counts for total employees, present, late, absent, and on leave.
 * Uses parallel queries for optimal performance.
 */
export async function getHRDashboardStats(): Promise<{ data?: HRStats; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();
    const today = getTodayDateString();

    // Parallel queries for efficiency
    const [
      { count: totalEmployees, error: totalError },
      { data: attendanceData, error: attendanceError },
      { count: onLeaveCount, error: leaveError }
    ] = await Promise.all([
      // 1. Total Employees
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_active', true),

      // 2. Today's Attendance (for Present, Late)
      supabase.from('attendance_records')
        .select('check_in_status')
        .eq('date', today)
        .not('check_in_time', 'is', null),

      // 3. On Leave (Approved and active today)
      supabase.from('leave_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .lte('start_date', today)
        .gte('end_date', today)
    ]);

    if (totalError) throw new Error(totalError.message);
    if (attendanceError) throw new Error(attendanceError.message);
    if (leaveError) throw new Error(leaveError.message);

    const present = attendanceData?.length || 0;
    const late = attendanceData?.filter(r => r.check_in_status === 'late').length || 0;
    // Absent = Total - Present - On Leave (approximation)
    const absent = Math.max(0, (totalEmployees || 0) - present - (onLeaveCount || 0));

    return {
      data: {
        totalEmployees: totalEmployees || 0,
        present,
        late,
        absent,
        onLeave: onLeaveCount || 0
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getHRDashboardStats] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * GET ATTENDANCE FEED
 * 
 * Returns today's check-in and check-out entries for all employees.
 * Formatted for the Attendance Feed widget on HR dashboard.
 * 
 * Features:
 * - Shows check-in/check-out status (Late/On Time)
 * - Includes user initials for avatar display
 * - Sorted by time (most recent first)
 * - Supports filtering by type (checkin/checkout)
 * 
 * @param type - Filter by 'checkin' or 'checkout'. If not provided, returns both.
 * @param limit - Maximum number of entries to return (default: 50)
 */
export async function getAttendanceFeed(
  type?: 'checkin' | 'checkout',
  limit: number = 50
): Promise<{ data?: AttendanceFeedEntry[]; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    const today = getTodayDateString();

    console.log('[getAttendanceFeed] Fetching attendance feed for date:', today, 'type:', type || 'all');

    // Build query based on type filter
    let query = supabase
      .from('attendance_records')
      .select(`
        id,
        user_id,
        check_in_time,
        check_in_status,
        check_out_time,
        check_out_status,
        user:users!user_id (
          id,
          full_name
        )
      `)
      .eq('date', today)
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Fetch more to account for filtering

    const { data: records, error } = await query;

    if (error) {
      console.error('[getAttendanceFeed] Query error:', error);
      return { error: 'Failed to fetch attendance feed' };
    }

    if (!records || records.length === 0) {
      return { data: [] };
    }

    // Helper: Get user initials from full name
    const getInitials = (fullName: string): string => {
      const names = fullName.trim().split(' ');
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // Helper: Format time as "HH:MM AM/PM"
    const formatTime = (timestamp: string): string => {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    // Process records into feed entries
    const feedEntries: AttendanceFeedEntry[] = [];

    for (const record of records) {
      const user = record.user as any;
      const fullName = user?.full_name || 'Unknown User';

      // Add check-in entry
      if (record.check_in_time && (!type || type === 'checkin')) {
        feedEntries.push({
          id: `${record.id}-checkin`,
          user: {
            id: user?.id || '',
            full_name: fullName,
            initials: getInitials(fullName),
          },
          type: 'checkin',
          time: formatTime(record.check_in_time),
          status: (record.check_in_status as 'late' | 'ontime') || 'ontime',
          timestamp: record.check_in_time,
        });
      }

      // Add check-out entry
      if (record.check_out_time && (!type || type === 'checkout')) {
        feedEntries.push({
          id: `${record.id}-checkout`,
          user: {
            id: user?.id || '',
            full_name: fullName,
            initials: getInitials(fullName),
          },
          type: 'checkout',
          time: formatTime(record.check_out_time),
          status: (record.check_out_status as 'ontime' | 'overtime' | 'leftearly') || 'ontime',
          timestamp: record.check_out_time,
        });
      }
    }

    // Sort by timestamp (most recent first) and limit
    const sortedEntries = feedEntries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    console.log('[getAttendanceFeed] Returning', sortedEntries.length, 'entries');

    return { data: sortedEntries };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getAttendanceFeed] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * GET ATTENDANCE FEED COUNT
 * 
 * Returns the total count of attendance feed entries for today.
 * This is a lightweight query to get the count before fetching full data.
 * 
 * @param type - Filter by 'checkin' or 'checkout'. If not provided, counts both.
 */
export async function getAttendanceFeedCount(
  type?: 'checkin' | 'checkout'
): Promise<{ data?: number; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    const today = getTodayDateString();

    console.log('[getAttendanceFeedCount] Counting attendance feed for date:', today, 'type:', type || 'all');

    // Build query to count records
    let query = supabase
      .from('attendance_records')
      .select('id, check_in_time, check_out_time', { count: 'exact', head: false })
      .eq('date', today);

    const { data: records, error, count } = await query;

    if (error) {
      console.error('[getAttendanceFeedCount] Query error:', error);
      return { error: 'Failed to count attendance feed' };
    }

    if (!records || records.length === 0) {
      return { data: 0 };
    }

    // Count entries based on type filter
    let entryCount = 0;
    for (const record of records) {
      if (type === 'checkin' && record.check_in_time) {
        entryCount++;
      } else if (type === 'checkout' && record.check_out_time) {
        entryCount++;
      } else if (!type) {
        // Count both check-in and check-out
        if (record.check_in_time) entryCount++;
        if (record.check_out_time) entryCount++;
      }
    }

    console.log('[getAttendanceFeedCount] Total entries:', entryCount);
    return { data: entryCount };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getAttendanceFeedCount] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * GET PENDING LEAVE REQUESTS (Dashboard Format)
 * 
 * Returns pending leave requests formatted for the HR dashboard widget.
 * This is a convenience wrapper around getPendingLeaveRequests from hr/leaves.ts
 * with additional formatting for dashboard display.
 * 
 * @param limit - Maximum number of requests to return (default: 10)
 */
export async function getPendingLeaveRequestsForDashboard(
  limit: number = 10
): Promise<{
  data?: Array<{
    id: string;
    user: {
      id: string;
      full_name: string;
      initials: string;
    };
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    dayType: 'full' | 'half';
    formattedDateRange: string; // e.g., "25-26 Nov 2025" or "27 Nov 2025 (Full Day)"
    reason: string;
    createdAt: string;
  }>; error?: string
}> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    // Import the function from hr/leaves.ts
    const { getPendingLeaveRequests } = await import('./leaves');
    const result = await getPendingLeaveRequests();

    if (result.error) {
      return { error: result.error };
    }

    if (!result.data || result.data.length === 0) {
      return { data: [] };
    }

    // Helper: Get user initials
    const getInitials = (fullName: string): string => {
      const names = fullName.trim().split(' ');
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // Helper: Format date range for display
    const formatDateRange = (startDate: string, endDate: string, dayType: 'full' | 'half'): string => {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');

      const startDay = start.getDate();
      const endDay = end.getDate();
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
      const year = start.getFullYear();

      // If same date, show single date
      if (startDate === endDate) {
        const dayTypeText = dayType === 'half' ? ' (Half Day)' : ' (Full Day)';
        return `${startDay} ${startMonth} ${year}${dayTypeText}`;
      }

      // If same month, show "25-26 Nov 2025"
      if (startMonth === endMonth) {
        return `${startDay}-${endDay} ${startMonth} ${year}`;
      }

      // Different months: "25 Nov - 2 Dec 2025"
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    };

    // Fetch day_type for each request (needed for formatting)
    const requestIds = result.data.map(r => r.id);
    const { data: leaveRequestsWithDayType, error: dayTypeError } = await supabase
      .from('leave_requests')
      .select('id, day_type')
      .in('id', requestIds);

    if (dayTypeError) {
      console.error('[getPendingLeaveRequestsForDashboard] Error fetching day_type:', dayTypeError);
      // Continue without day_type, default to 'full'
    }

    // Create a map of id -> day_type
    const dayTypeMap = new Map<string, 'full' | 'half'>();
    leaveRequestsWithDayType?.forEach(req => {
      dayTypeMap.set(req.id, req.day_type as 'full' | 'half');
    });

    // Format the requests
    const formattedRequests = result.data
      .slice(0, limit)
      .map(req => {
        const dayType = dayTypeMap.get(req.id) || 'full';
        return {
          id: req.id,
          user: {
            id: req.user.id,
            full_name: req.user.full_name,
            initials: getInitials(req.user.full_name),
          },
          leaveType: req.leaveType,
          startDate: req.startDate,
          endDate: req.endDate,
          days: req.days,
          dayType,
          formattedDateRange: formatDateRange(req.startDate, req.endDate, dayType),
          reason: req.reason,
          createdAt: req.createdAt,
        };
      });

    return { data: formattedRequests };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getPendingLeaveRequestsForDashboard] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * GET ALL RECENT ACTIVITIES (HR VIEW)
 * 
 * Returns today's activities for ALL employees.
 * This is the existing function, kept for backward compatibility.
 */
export async function getAllRecentActivities(limit: number = 20): Promise<{ data?: DayEmployeeActivity[]; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    // Helper functions
    const formatTime = (timestamp: string): string => {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const formatDateRange = (startDate: string, endDate: string): string => {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');

      const startDay = start.getDate();
      const endDay = end.getDate();
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

      if (startMonth === endMonth) {
        return `${startDay}-${endDay} ${startMonth}`;
      } else {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
      }
    };

    // Format date as YYYY-MM-DD in local timezone
    const formatLocalDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Calculate today's date in local timezone
    const todayDate = new Date();
    const localYear = todayDate.getFullYear();
    const localMonth = todayDate.getMonth();
    const localDay = todayDate.getDate();
    const todayLocal = new Date(localYear, localMonth, localDay);
    const today = formatLocalDate(todayLocal);

    // Calculate today's date range for leave requests
    const todayStart = new Date(localYear, localMonth, localDay, 0, 0, 0);
    const todayEnd = new Date(localYear, localMonth, localDay, 23, 59, 59);

    // Fetch today's attendance records and leave requests in parallel
    const [recordsResult, leaveRequestsResult] = await Promise.all([
      supabase
        .from('attendance_records')
        .select(`
        *,
          user:users!user_id (
          id,
          full_name
        )
      `)
        .eq('date', today)
        .order('created_at', { ascending: false })
        .limit(limit),

      supabase
        .from('leave_requests')
        .select(`
          *,
          user:users!user_id (
            id,
            full_name
          )
        `)
        .gte('created_at', todayStart.toISOString())
        .lte('created_at', todayEnd.toISOString())
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
    ]);

    if (recordsResult.error) {
      throw new Error(recordsResult.error.message);
    }
    if (leaveRequestsResult.error) {
      throw new Error(leaveRequestsResult.error.message);
    }

    const records = recordsResult.data;
    const leaveRequests = leaveRequestsResult.data;

    // Group by date
    const activitiesByDate = new Map<string, EmployeeActivity[]>();

    // Process attendance records
    records?.forEach(record => {
      const dateKey = record.date;
      if (!activitiesByDate.has(dateKey)) {
        activitiesByDate.set(dateKey, []);
      }

      const activities = activitiesByDate.get(dateKey)!;
      const user = record.user as any;

      if (record.check_in_time) {
        activities.push({
          type: 'checkin',
          time: formatTime(record.check_in_time),
          status: record.check_in_status,
          user: {
            id: user.id,
            full_name: user.full_name,
          }
        });
      }

      if (record.check_out_time) {
        activities.push({
          type: 'checkout',
          time: formatTime(record.check_out_time),
          status: record.check_out_status,
          user: {
            id: user.id,
            full_name: user.full_name,
          }
        });
      }
    });

    // Process leave requests
    if (leaveRequests && leaveRequests.length > 0) {
      const dateKey = today;
      if (!activitiesByDate.has(dateKey)) {
        activitiesByDate.set(dateKey, []);
      }

      const activities = activitiesByDate.get(dateKey)!;

      for (const leave of leaveRequests) {
        const user = leave.user as any;
        const dateRange = formatDateRange(leave.start_date, leave.end_date);
        const leaveTime = formatTime(leave.created_at);
        const leaveType = leave.leave_type_id as 'annual' | 'sick' | 'unpaid';
        const status = leave.status as 'pending' | 'approved' | 'rejected';

        activities.push({
          type: 'leave',
          time: leaveTime,
          status: status,
          leaveType: leaveType,
          dateRange: dateRange,
          user: {
            id: user.id,
            full_name: user.full_name,
          }
        });
      }
    }

    // Sort and Format
    const dayActivities: DayEmployeeActivity[] = Array.from(activitiesByDate.entries())
      .map(([date, activities]) => {
        const isToday = date === today;
        const formattedDate = isToday
          ? 'Today'
          : new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        return {
          date: formattedDate,
          activities: activities.sort((a, b) => {
            if (a.type === 'leave' && b.type !== 'leave') return -1;
            if (a.type !== 'leave' && b.type === 'leave') return 1;
            if (a.type === 'checkin' && b.type === 'checkout') return -1;
            if (a.type === 'checkout' && b.type === 'checkin') return 1;
            return b.time.localeCompare(a.time);
          })
        };
      })
      .sort((a, b) => 0); // Since we're only showing today, no need to sort by date

    return { data: dayActivities };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getAllRecentActivities] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * GET ALL EMPLOYEES
 */
export async function getAllEmployees(): Promise<{ data?: { id: string; full_name: string }[]; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();

    const { data, error } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('is_active', true)
      .order('full_name');

    if (error) {
      console.error('[getAllEmployees] Error:', error);
      return { error: 'Failed to fetch employees' };
    }

    return { data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getAllEmployees] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * Recent Activity for HR Dashboard
 */
export interface RecentActivity {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'announcement' | 'payslip' | 'leave' | 'attendance' | 'approval' | 'rejection';
  createdAt: string; // ISO timestamp for sorting
}

/**
 * GET RECENT ACTIVITIES COUNT
 * 
 * Returns the total count of recent activities (announcements + payslips + leave requests + approved leave requests + rejected leave requests).
 * This is a lightweight query to get the count before fetching full data.
 */
export async function getRecentActivitiesCount(): Promise<{ data?: number; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    console.log('[getRecentActivitiesCount] Counting recent activities');

    // Fetch counts in parallel
    const [announcementsResult, payslipsResult, leaveRequestsResult, approvedLeaveRequestsResult, rejectedLeaveRequestsResult] = await Promise.all([
      // Count active announcements
      supabase
        .from('announcements')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),

      // Count payslips
      supabase
        .from('payslips')
        .select('id', { count: 'exact', head: true }),

      // Count leave requests (excluding cancelled)
      supabase
        .from('leave_requests')
        .select('id', { count: 'exact', head: true })
        .neq('status', 'cancelled'),

      // Count approved leave requests (recent approvals)
      supabase
        .from('leave_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved')
        .not('approved_at', 'is', null),

      // Count rejected leave requests (recent rejections)
      supabase
        .from('leave_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'rejected')
        .not('approved_at', 'is', null),
    ]);

    if (announcementsResult.error) {
      console.error('[getRecentActivitiesCount] Announcements error:', announcementsResult.error);
      return { error: 'Failed to count announcements' };
    }

    if (payslipsResult.error) {
      console.error('[getRecentActivitiesCount] Payslips error:', payslipsResult.error);
      return { error: 'Failed to count payslips' };
    }

    if (leaveRequestsResult.error) {
      console.error('[getRecentActivitiesCount] Leave requests error:', leaveRequestsResult.error);
      return { error: 'Failed to count leave requests' };
    }

    if (approvedLeaveRequestsResult.error) {
      console.error('[getRecentActivitiesCount] Approved leave requests error:', approvedLeaveRequestsResult.error);
      return { error: 'Failed to count approved leave requests' };
    }

    if (rejectedLeaveRequestsResult.error) {
      console.error('[getRecentActivitiesCount] Rejected leave requests error:', rejectedLeaveRequestsResult.error);
      return { error: 'Failed to count rejected leave requests' };
    }

    const announcementsCount = announcementsResult.count || 0;
    const payslipsCount = payslipsResult.count || 0;
    const leaveRequestsCount = leaveRequestsResult.count || 0;
    const approvedLeaveRequestsCount = approvedLeaveRequestsResult.count || 0;
    const rejectedLeaveRequestsCount = rejectedLeaveRequestsResult.count || 0;
    const totalCount = announcementsCount + payslipsCount + leaveRequestsCount + approvedLeaveRequestsCount + rejectedLeaveRequestsCount;

    console.log('[getRecentActivitiesCount] Total activities:', totalCount, `(announcements: ${announcementsCount}, payslips: ${payslipsCount}, leave requests: ${leaveRequestsCount}, approved leave requests: ${approvedLeaveRequestsCount}, rejected leave requests: ${rejectedLeaveRequestsCount})`);
    return { data: totalCount };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getRecentActivitiesCount] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * GET RECENT ACTIVITIES FOR HR DASHBOARD
 * 
 * Fetches recent announcements, payslips, leave requests, approved leave requests, and rejected leave requests for the Recent Activities card.
 * Returns formatted activities sorted by creation/approval date (newest first).
 * 
 * @param limit - Maximum number of activities to return (default: 5)
 */
export async function getRecentActivitiesForDashboard(
  limit: number = 3
): Promise<{ data?: RecentActivity[]; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    // Format timestamp helper
    const formatTimestamp = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Now';
      if (diffMins < 60) return `${diffMins}m`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Fetch announcements, payslips, leave requests, approved leave requests, and rejected leave requests in parallel
    const [announcementsResult, payslipsResult, leaveRequestsResult, approvedLeaveRequestsResult, rejectedLeaveRequestsResult] = await Promise.all([
      // Fetch recent active announcements
      supabase
        .from('announcements')
        .select('id, title, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit),

      // Fetch recent payslips
      supabase
        .from('payslips')
        .select('id, month, year, created_at')
        .order('created_at', { ascending: false })
        .limit(limit),

      // Fetch recent leave requests (excluding cancelled)
      supabase
        .from('leave_requests')
        .select(`
          id,
          created_at,
          start_date,
          end_date,
        user:users!user_id (
          id,
          full_name
        ),
        leave_type:leave_types!leave_type_id (
          name
        )
      `)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .limit(limit),

      // Fetch recently approved leave requests (ordered by approved_at)
      supabase
        .from('leave_requests')
        .select(`
          id,
          approved_at,
          user:users!user_id (
            id,
            full_name
          )
        `)
        .eq('status', 'approved')
        .not('approved_at', 'is', null)
        .order('approved_at', { ascending: false })
        .limit(limit),

      // Fetch recently rejected leave requests (ordered by approved_at)
      supabase
        .from('leave_requests')
        .select(`
          id,
          approved_at,
          user:users!user_id (
            id,
            full_name
          )
        `)
        .eq('status', 'rejected')
        .not('approved_at', 'is', null)
        .order('approved_at', { ascending: false })
        .limit(limit),
    ]);

    if (announcementsResult.error) {
      console.error('[getRecentActivitiesForDashboard] Announcements error:', announcementsResult.error);
      return { error: 'Failed to fetch announcements' };
    }

    if (payslipsResult.error) {
      console.error('[getRecentActivitiesForDashboard] Payslips error:', payslipsResult.error);
      return { error: 'Failed to fetch payslips' };
    }

    if (leaveRequestsResult.error) {
      console.error('[getRecentActivitiesForDashboard] Leave requests error:', leaveRequestsResult.error);
      return { error: 'Failed to fetch leave requests' };
    }

    if (approvedLeaveRequestsResult.error) {
      console.error('[getRecentActivitiesForDashboard] Approved leave requests error:', approvedLeaveRequestsResult.error);
      return { error: 'Failed to fetch approved leave requests' };
    }

    if (rejectedLeaveRequestsResult.error) {
      console.error('[getRecentActivitiesForDashboard] Rejected leave requests error:', rejectedLeaveRequestsResult.error);
      return { error: 'Failed to fetch rejected leave requests' };
    }

    const announcements = announcementsResult.data || [];
    const payslips = payslipsResult.data || [];
    const leaveRequests = leaveRequestsResult.data || [];
    const approvedLeaveRequests = approvedLeaveRequestsResult.data || [];
    const rejectedLeaveRequests = rejectedLeaveRequestsResult.data || [];

    // Format activities
    const activities: RecentActivity[] = [];

    // Add announcements
    announcements.forEach((announcement) => {
      activities.push({
        id: `announcement-${announcement.id}`,
        title: announcement.title,
        subtitle: 'Announcement was created',
        timestamp: formatTimestamp(new Date(announcement.created_at)),
        type: 'announcement',
        createdAt: announcement.created_at,
      });
    });

    // Add payslips
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    payslips.forEach((payslip) => {
      const monthName = monthNames[payslip.month - 1];
      activities.push({
        id: `payslip-${payslip.id}`,
        title: `${monthName} ${payslip.year} Payslip`,
        subtitle: 'Has been uploaded',
        timestamp: formatTimestamp(new Date(payslip.created_at)),
        type: 'payslip',
        createdAt: payslip.created_at,
      });
    });

    // Helper: Format date range for leave requests
    const formatLeaveDateRange = (startDate: string, endDate: string): string => {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');

      const startDay = start.getDate();
      const endDay = end.getDate();
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
      const year = start.getFullYear();

      // If same date, show single date
      if (startDate === endDate) {
        return `${startDay} ${startMonth} ${year}`;
      }

      // If same month, show "24–25 Nov 2025" (using en dash)
      if (startMonth === endMonth) {
        return `${startDay}–${endDay} ${startMonth} ${year}`;
      }

      // Different months: "25 Nov – 2 Dec 2025"
      return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
    };

    // Add leave requests
    leaveRequests.forEach((leaveRequest) => {
      const user = leaveRequest.user as any;
      const leaveType = leaveRequest.leave_type as any;
      const userName = user?.full_name || 'Unknown User';
      const leaveTypeName = leaveType?.name || 'Leave';
      const dateRange = formatLeaveDateRange(leaveRequest.start_date, leaveRequest.end_date);

      activities.push({
        id: `leave-${leaveRequest.id}`,
        title: `${leaveTypeName} (${dateRange})`,
        subtitle: `Requested by ${userName}`,
        timestamp: formatTimestamp(new Date(leaveRequest.created_at)),
        type: 'leave',
        createdAt: leaveRequest.created_at,
      });
    });

    // Add approved leave requests
    approvedLeaveRequests.forEach((approvedRequest) => {
      const user = approvedRequest.user as any;
      const userName = user?.full_name || 'Unknown User';

      activities.push({
        id: `approval-${approvedRequest.id}`,
        title: 'Leave Request Approved',
        subtitle: `You approved ${userName}'s request`,
        timestamp: formatTimestamp(new Date(approvedRequest.approved_at)),
        type: 'approval',
        createdAt: approvedRequest.approved_at,
      });
    });

    // Add rejected leave requests
    rejectedLeaveRequests.forEach((rejectedRequest) => {
      const user = rejectedRequest.user as any;
      const userName = user?.full_name || 'Unknown User';

      activities.push({
        id: `rejection-${rejectedRequest.id}`,
        title: 'Leave Request Rejected',
        subtitle: `You rejected ${userName}'s request`,
        timestamp: formatTimestamp(new Date(rejectedRequest.approved_at)),
        type: 'rejection',
        createdAt: rejectedRequest.approved_at,
      });
    });

    // Sort by creation date (newest first) and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return { data: sortedActivities };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getRecentActivitiesForDashboard] Error:', errorMessage);
    return { error: errorMessage };
  }
}

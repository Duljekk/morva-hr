'use server';

/**
 * Server actions for HR dashboard
 * Handles HR dashboard statistics and activities
 * 
 * Location: lib/actions/hr/ - HR-only actions
 * All functions require HR admin role
 */

import { revalidateTag } from 'next/cache';
import { requireHRAdmin } from '@/lib/auth/requireHRAdmin';
import { DayActivity, Activity } from '../shared/attendance';

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
 * GET HR DASHBOARD STATS
 * 
 * Returns counts for total employees, present, late, absent, and on leave.
 */
export async function getHRDashboardStats(): Promise<{ data?: HRStats; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();
    const today = new Date().toISOString().split('T')[0];

  try {
    // Parallel queries for efficiency
    const [
      { count: totalEmployees, error: totalError },
      { data: attendanceData, error: attendanceError },
      { count: onLeaveCount, error: leaveError }
    ] = await Promise.all([
      // 1. Total Employees
      supabase.from('users').select('*', { count: 'exact', head: true }),
      
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
    // Note: This simple calculation assumes everyone not present or on leave is absent.
    // In a real system, we might check for weekends/holidays/shifts, but this is a good start.
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
 * GET ALL RECENT ACTIVITIES (HR VIEW)
 * 
 * Returns today's activities for ALL employees.
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

  // Format date as YYYY-MM-DD in local timezone (same as attendance.ts)
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  try {
    // Calculate today's date in local timezone (not UTC)
    const todayDate = new Date();
    const localYear = todayDate.getFullYear();
    const localMonth = todayDate.getMonth();
    const localDay = todayDate.getDate();
    const todayLocal = new Date(localYear, localMonth, localDay);
    const today = formatLocalDate(todayLocal);

    // Calculate today's date range for leave requests (created_at date)
    const todayStart = new Date(localYear, localMonth, localDay, 0, 0, 0);
    const todayEnd = new Date(localYear, localMonth, localDay, 23, 59, 59);

    console.log('[getAllRecentActivities] Today date (local):', today);
    console.log('[getAllRecentActivities] Today range:', {
      start: todayStart.toISOString(),
      end: todayEnd.toISOString()
    });

    // Fetch today's attendance records and leave requests in parallel
    const [recordsResult, leaveRequestsResult] = await Promise.all([
      // Fetch today's attendance records joined with user info
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
      
      // Fetch leave requests created today
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
      console.error('[getAllRecentActivities] Attendance records error:', recordsResult.error);
      throw new Error(recordsResult.error.message);
    }
    if (leaveRequestsResult.error) {
      console.error('[getAllRecentActivities] Leave requests error:', leaveRequestsResult.error);
      throw new Error(leaveRequestsResult.error.message);
    }

    const records = recordsResult.data;
    const leaveRequests = leaveRequestsResult.data;

    console.log('[getAllRecentActivities] Found', records?.length || 0, 'attendance records');
    console.log('[getAllRecentActivities] Found', leaveRequests?.length || 0, 'leave requests');

    // Group by date
    const activitiesByDate = new Map<string, EmployeeActivity[]>();

    // Process attendance records
    records?.forEach(record => {
      const dateKey = record.date;
      if (!activitiesByDate.has(dateKey)) {
        activitiesByDate.set(dateKey, []);
      }
      
      const activities = activitiesByDate.get(dateKey)!;
      const user = record.user as any; // Type assertion helper

      // Check-in
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

      // Check-out
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
      const dateKey = today; // All leave requests are for today
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
         // Format date - show "Today" for today's date
         const dateObj = new Date(date);
         const isToday = date === today;
         const formattedDate = isToday 
           ? 'Today' 
           : dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
         
         return {
           date: formattedDate,
           activities: activities.sort((a, b) => {
             // Sort activities: leave requests first, then check-in, then check-out
             // Within same type, sort by time
             if (a.type === 'leave' && b.type !== 'leave') return -1;
             if (a.type !== 'leave' && b.type === 'leave') return 1;
             if (a.type === 'checkin' && b.type === 'checkout') return -1;
             if (a.type === 'checkout' && b.type === 'checkin') return 1;
             return b.time.localeCompare(a.time); // Sort by time desc
           })
         };
      })
      .sort((a, b) => {
        // Since we're only showing today's activities, no need to sort by date
        return 0;
      });

    return { data: dayActivities };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getAllRecentActivities] Error:', errorMessage);
    return { error: errorMessage };
  }
}

export interface PendingLeaveRequest {
  id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string; // Optional - not in database schema but kept for compatibility
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  createdAt: string;
}

/**
 * GET PENDING LEAVE REQUESTS
 */
// Note: getPendingLeaveRequests has been moved to lib/actions/hr/leaves.ts
// This function is kept here for backward compatibility but will be removed
// Import from '../hr/leaves' instead
export async function getPendingLeaveRequests(): Promise<{ data?: PendingLeaveRequest[]; error?: string }> {
  // Re-export from hr/leaves to maintain backward compatibility
  const { getPendingLeaveRequests: getPending } = await import('./leaves');
  return getPending();

}

/**
 * GET ALL EMPLOYEES
 */
export async function getAllEmployees(): Promise<{ data?: { id: string; full_name: string }[]; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();
    
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name')
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

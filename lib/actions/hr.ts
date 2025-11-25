'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import { DayActivity, Activity } from './attendance';

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
  const supabase = await createClient();
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
    console.error('Error fetching HR stats:', error);
    return { error: 'Failed to fetch HR stats' };
  }
}

/**
 * GET ALL RECENT ACTIVITIES (HR VIEW)
 * 
 * Returns today's activities for ALL employees.
 */
export async function getAllRecentActivities(limit: number = 20): Promise<{ data?: DayEmployeeActivity[]; error?: string }> {
  const supabase = await createClient();

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
     console.error('Error fetching HR activities:', error);
     return { error: 'Failed to fetch HR activities' };
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
export async function getPendingLeaveRequests(): Promise<{ data?: PendingLeaveRequest[]; error?: string }> {
  const supabase = await createClient();

  try {
    // Verify authentication and HR role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[getPendingLeaveRequests] Auth error:', authError);
      return { error: 'Not authenticated' };
    }

    // Check if user is HR admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[getPendingLeaveRequests] Profile error:', profileError);
      return { error: 'Failed to verify user role' };
    }

    if (userProfile?.role !== 'hr_admin') {
      console.error('[getPendingLeaveRequests] User is not HR admin:', userProfile?.role);
      return { error: 'Access denied. HR admin only.' };
    }

    console.log('[getPendingLeaveRequests] Fetching pending leave requests for HR admin:', user.id);

    // First, try a simple query to check if we can access leave_requests
    const { data: testRequests, error: testError } = await supabase
      .from('leave_requests')
      .select('id, status, user_id, leave_type_id')
      .eq('status', 'pending')
      .limit(5);

    if (testError) {
      console.error('[getPendingLeaveRequests] Test query error:', testError);
      throw new Error(`Cannot access leave_requests: ${testError.message}`);
    }

    console.log('[getPendingLeaveRequests] Test query found', testRequests?.length || 0, 'pending requests');

    // Fetch pending leave requests with joins
    // Use explicit column reference to avoid ambiguity (user_id vs approved_by both reference users)
    // Syntax: table_name!foreign_key_column_name
    // Note: users table doesn't have avatar_url column, so we only select available columns
    const { data: requests, error } = await supabase
      .from('leave_requests')
      .select(`
        *,
        user:users!user_id (
          id,
          full_name
        ),
        leave_type:leave_types!leave_type_id (
          name
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true }); // Oldest first

    if (error) {
      console.error('[getPendingLeaveRequests] Query error:', error);
      console.error('[getPendingLeaveRequests] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error(error.message);
    }

    console.log('[getPendingLeaveRequests] Found', requests?.length || 0, 'pending leave requests');

    if (!requests || requests.length === 0) {
      console.log('[getPendingLeaveRequests] No pending leave requests found');
      return { data: [] };
    }

    // Format the requests
    const formattedRequests: PendingLeaveRequest[] = requests.map(req => {
      const userData = req.user as any;
      const leaveTypeData = req.leave_type as any;

      return {
      id: req.id,
      user: {
          id: userData?.id || '',
          full_name: userData?.full_name || 'Unknown User',
          avatar_url: undefined // users table doesn't have avatar_url column
      },
        leaveType: leaveTypeData?.name || 'Unknown',
      startDate: req.start_date,
      endDate: req.end_date,
      days: req.total_days,
      reason: req.reason || '',
      createdAt: req.created_at
      };
    });

    console.log('[getPendingLeaveRequests] Formatted', formattedRequests.length, 'requests');
    return { data: formattedRequests };

  } catch (error) {
    console.error('[getPendingLeaveRequests] Unexpected error:', error);
    console.error('[getPendingLeaveRequests] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return { error: `Failed to fetch pending leave requests: ${error instanceof Error ? error.message : String(error)}` };
  }
}

/**
 * GET ALL EMPLOYEES
 */
export async function getAllEmployees(): Promise<{ data?: { id: string; full_name: string }[]; error?: string }> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name')
      .order('full_name');
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { error: 'Failed to fetch employees' };
  }
}

'use server';

/**
 * HR Employee Detail Server Actions
 * 
 * Server actions for fetching individual employee details.
 * All functions require HR admin role verification.
 */

import { requireHRAdmin } from '@/lib/auth/server';
import { getCurrentYear } from '@/lib/utils/timezone';
import {
  toEmployeeLeftSectionData,
  type DbUserDetail,
} from '@/lib/utils/employeeDetailTransform';
import type { EmployeeLeftSectionData } from '@/components/hr/employee/EmployeeDetailsLeftSection';

/**
 * Result type for employee details fetch
 */
export interface EmployeeDetailsResult {
  leftSection: EmployeeLeftSectionData;
}

/**
 * Fetch employee details by ID
 * 
 * @param id - Employee UUID
 * @returns Object containing employee data or error message
 */
export async function getEmployeeDetailsById(
  id: string
): Promise<{ data?: EmployeeDetailsResult; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();
    
    const currentYear = getCurrentYear();
    
    // Fetch user and leave balances in parallel
    const [userResult, leaveBalancesResult] = await Promise.all([
      // Query user by ID
      supabase
        .from('users')
        .select('id, email, full_name, profile_picture_url, role, employment_type, birthdate, salary, contract_start_date, contract_end_date')
        .eq('id', id)
        .eq('is_active', true)
        .single(),
      
      // Query leave balances for current year
      supabase
        .from('leave_balances')
        .select('balance, allocated')
        .eq('user_id', id)
        .eq('year', currentYear),
    ]);


    // Handle user not found
    if (userResult.error || !userResult.data) {
      if (userResult.error?.code === 'PGRST116') {
        // No rows returned
        return { error: 'Employee not found' };
      }
      console.error('[getEmployeeDetailsById] Error fetching user:', userResult.error?.message);
      return { error: 'Failed to fetch employee details' };
    }
    
    const user = userResult.data as DbUserDetail;
    
    // Calculate leave balance
    let leaveBalance = { current: 0, total: 10 };
    if (!leaveBalancesResult.error && leaveBalancesResult.data) {
      const balances = leaveBalancesResult.data;
      const totalBalance = balances.reduce((sum, lb) => sum + (lb.balance || 0), 0);
      const totalAllocated = balances.reduce((sum, lb) => sum + (lb.allocated || 0), 0);
      leaveBalance = {
        current: totalBalance,
        total: totalAllocated || 10,
      };
    }
    
    // Transform to UI data
    const leftSection = toEmployeeLeftSectionData(user, leaveBalance);
    
    return { data: { leftSection } };
  } catch (error) {
    console.error('[getEmployeeDetailsById] Unexpected error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }
    
    return { error: 'An unexpected error occurred while fetching employee details' };
  }
}


import {
  getNowPartsInGMT7,
  getTodayDateString,
  formatDateISO,
  formatTimeShort,
  APP_TIMEZONE,
} from '@/lib/utils/timezone';
import type { ActivityGroupData, ActivityEntry } from '@/components/hr/employee/EmployeeActivitiesPanel';
import type { ActivityStatus } from '@/components/hr/employee/ActivityStatusBadge';
import type { ActivityType } from '@/components/hr/employee/ActivityCard';

/**
 * Result type for employee activities fetch
 */
export interface EmployeeActivitiesResult {
  attendanceGroups: ActivityGroupData[];
  leaveRequestGroups: ActivityGroupData[];
  leaveRequestCount: number;
}

/**
 * Format date label (Today, Yesterday, or formatted date)
 */
function formatDateLabel(date: string, today: string, yesterday: string): string {
  if (date === today) return 'Today';
  if (date === yesterday) return 'Yesterday';
  
  // Format as "Month Day" (e.g., "December 6")
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    timeZone: APP_TIMEZONE,
  });
}

/**
 * Map check_in_status/check_out_status to ActivityStatus
 */
function mapAttendanceStatus(status: string | null): ActivityStatus {
  switch (status) {
    case 'late':
      return 'late';
    case 'overtime':
    case 'leftearly':
      return 'overtime';
    default:
      return 'onTime';
  }
}


/**
 * Attendance record from database
 */
interface AttendanceRecord {
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_status: string | null;
  check_out_status: string | null;
}

/**
 * Transform attendance records to ActivityGroupData format
 */
function transformAttendanceToGroups(
  records: AttendanceRecord[],
  today: string,
  yesterday: string,
  dayBefore: string
): ActivityGroupData[] {
  const groupsMap = new Map<string, ActivityEntry[]>();
  
  records.forEach(record => {
    const date = record.date;
    if (!groupsMap.has(date)) {
      groupsMap.set(date, []);
    }
    
    const activities = groupsMap.get(date)!;
    
    // Add check-in activity
    if (record.check_in_time) {
      activities.push({
        id: `${record.date}-checkin`,
        type: 'checkIn' as ActivityType,
        time: formatTimeShort(record.check_in_time),
        status: mapAttendanceStatus(record.check_in_status),
      });
    }
    
    // Add check-out activity
    if (record.check_out_time) {
      activities.push({
        id: `${record.date}-checkout`,
        type: 'checkOut' as ActivityType,
        time: formatTimeShort(record.check_out_time),
        status: mapAttendanceStatus(record.check_out_status),
      });
    }
  });
  
  // Convert to ActivityGroupData array, sorted by date (newest first)
  const dateOrder = [today, yesterday, dayBefore];
  const groups: ActivityGroupData[] = [];
  
  dateOrder.forEach((date, index) => {
    const activities = groupsMap.get(date);
    if (activities && activities.length > 0) {
      // Sort activities: check-in before check-out
      activities.sort((a, b) => {
        if (a.type === 'checkIn' && b.type === 'checkOut') return -1;
        if (a.type === 'checkOut' && b.type === 'checkIn') return 1;
        return a.time.localeCompare(b.time);
      });
      
      groups.push({
        id: date,
        label: formatDateLabel(date, today, yesterday),
        activities,
        isLast: false, // Will be set later
      });
    }
  });
  
  // Mark the last group
  if (groups.length > 0) {
    groups[groups.length - 1].isLast = true;
  }
  
  return groups;
}


/**
 * Leave request from database
 */
interface LeaveRequest {
  id: string;
  created_at: string;
  start_date: string;
  end_date: string;
  status: string;
  leave_type_id: string;
}

/**
 * Transform leave requests to ActivityGroupData format
 */
function transformLeaveRequestsToGroups(
  leaveRequests: LeaveRequest[],
  today: string,
  yesterday: string,
  dayBefore: string
): ActivityGroupData[] {
  const groupsMap = new Map<string, ActivityEntry[]>();
  const dateRange = [today, yesterday, dayBefore];
  
  leaveRequests.forEach(leave => {
    // Group by created_at date
    const createdDate = formatDateISO(new Date(leave.created_at));
    const date = dateRange.includes(createdDate) ? createdDate : null;
    
    if (!date) return;
    
    if (!groupsMap.has(date)) {
      groupsMap.set(date, []);
    }
    
    const activities = groupsMap.get(date)!;
    
    activities.push({
      id: leave.id,
      type: 'checkIn' as ActivityType, // Leave requests use checkIn type for display
      time: formatTimeShort(leave.created_at),
      status: 'onTime' as ActivityStatus, // Leave requests default to onTime
    });
  });
  
  // Convert to ActivityGroupData array
  const groups: ActivityGroupData[] = [];
  
  dateRange.forEach((date) => {
    const activities = groupsMap.get(date);
    if (activities && activities.length > 0) {
      // Sort by time (newest first)
      activities.sort((a, b) => b.time.localeCompare(a.time));
      
      groups.push({
        id: `leave-${date}`,
        label: formatDateLabel(date, today, yesterday),
        activities,
        isLast: false,
      });
    }
  });
  
  // Mark the last group
  if (groups.length > 0) {
    groups[groups.length - 1].isLast = true;
  }
  
  return groups;
}


/**
 * Fetch employee activities for the last 3 days
 * 
 * @param employeeId - The employee's user ID
 * @returns Promise with activity groups or error
 */
export async function getEmployeeActivities(
  employeeId: string
): Promise<{ data?: EmployeeActivitiesResult; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();
    
    // Calculate date range (today, yesterday, day before) in GMT+7
    const nowParts = getNowPartsInGMT7();
    const today = getTodayDateString();
    
    // Calculate yesterday and day before
    const yesterdayDate = new Date(nowParts.year, nowParts.month - 1, nowParts.day - 1);
    const dayBeforeDate = new Date(nowParts.year, nowParts.month - 1, nowParts.day - 2);
    const yesterday = formatDateISO(yesterdayDate);
    const dayBefore = formatDateISO(dayBeforeDate);
    
    const dateRange = [today, yesterday, dayBefore];
    
    // Fetch attendance records and leave requests in parallel
    const [attendanceResult, leaveRequestsResult] = await Promise.all([
      // Fetch attendance records for last 3 days
      supabase
        .from('attendance_records')
        .select('date, check_in_time, check_out_time, check_in_status, check_out_status')
        .eq('user_id', employeeId)
        .in('date', dateRange)
        .order('date', { ascending: false }),
      
      // Fetch leave requests created in last 3 days
      supabase
        .from('leave_requests')
        .select('id, created_at, start_date, end_date, status, leave_type_id')
        .eq('user_id', employeeId)
        .neq('status', 'cancelled')
        .gte('created_at', `${dayBefore}T00:00:00`)
        .order('created_at', { ascending: false }),
    ]);
    
    if (attendanceResult.error) {
      console.error('[getEmployeeActivities] Attendance error:', attendanceResult.error);
      return { error: 'Failed to fetch attendance records' };
    }
    
    if (leaveRequestsResult.error) {
      console.error('[getEmployeeActivities] Leave requests error:', leaveRequestsResult.error);
      return { error: 'Failed to fetch leave requests' };
    }
    
    // Transform attendance records to ActivityGroupData
    const attendanceGroups = transformAttendanceToGroups(
      (attendanceResult.data || []) as AttendanceRecord[],
      today,
      yesterday,
      dayBefore
    );
    
    // Transform leave requests to ActivityGroupData
    const leaveRequestGroups = transformLeaveRequestsToGroups(
      (leaveRequestsResult.data || []) as LeaveRequest[],
      today,
      yesterday,
      dayBefore
    );
    
    // Count pending leave requests
    const leaveRequestCount = (leaveRequestsResult.data || []).filter(
      (lr: LeaveRequest) => lr.status === 'pending'
    ).length;
    
    return {
      data: {
        attendanceGroups,
        leaveRequestGroups,
        leaveRequestCount,
      },
    };
  } catch (error) {
    console.error('[getEmployeeActivities] Unexpected error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }
    
    return { error: 'An unexpected error occurred while fetching activities' };
  }
}

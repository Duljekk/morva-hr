'use server';

/**
 * HR Employee Detail Server Actions
 * 
 * Server actions for fetching individual employee details.
 * All functions require HR admin role verification.
 */

import { requireHRAdmin } from '@/lib/auth/server';
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


/**
 * Pending leave request data for display
 */
export interface EmployeePendingLeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string | null;
}

/**
 * Fetch pending leave request for a specific employee
 * 
 * Returns the most recent pending leave request for the employee,
 * or null if no pending request exists.
 * 
 * @param employeeId - Employee UUID
 * @returns Object containing pending leave request data or null
 */
export async function getEmployeePendingLeaveRequest(
  employeeId: string
): Promise<{ data?: EmployeePendingLeaveRequest | null; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();

    // Query for pending leave requests with leave type name
    const { data: pendingRequest, error: queryError } = await supabase
      .from('leave_requests')
      .select(`
        id,
        start_date,
        end_date,
        reason,
        created_at,
        leave_type:leave_types(
          name
        )
      `)
      .eq('user_id', employeeId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (queryError) {
      console.error('[getEmployeePendingLeaveRequest] Query error:', queryError);
      return { error: 'Failed to fetch pending leave request' };
    }

    if (!pendingRequest) {
      return { data: null };
    }

    // Transform to UI-friendly format
    const leaveTypeData = pendingRequest.leave_type as any;
    return {
      data: {
        id: pendingRequest.id,
        leaveType: leaveTypeData?.name || 'Unknown',
        startDate: pendingRequest.start_date,
        endDate: pendingRequest.end_date,
        reason: pendingRequest.reason,
        createdAt: pendingRequest.created_at,
      },
    };
  } catch (error) {
    console.error('[getEmployeePendingLeaveRequest] Unexpected error:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }

    return { error: 'An unexpected error occurred while fetching pending leave request' };
  }
}


/**
 * Leave history item for display
 */
export interface EmployeeLeaveHistoryItem {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: 'approved' | 'rejected';
}

/**
 * Fetch leave history for a specific employee
 * 
 * Returns recent approved/rejected leave requests for the employee.
 * 
 * @param employeeId - Employee UUID
 * @param limit - Maximum number of items to return (default: 5)
 * @returns Object containing leave history array
 */
export async function getEmployeeLeaveHistory(
  employeeId: string,
  limit: number = 5
): Promise<{ data?: EmployeeLeaveHistoryItem[]; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();

    // Query for approved/rejected leave requests
    const { data: leaveRequests, error: queryError } = await supabase
      .from('leave_requests')
      .select(`
        id,
        start_date,
        end_date,
        reason,
        status,
        leave_type:leave_types!leave_type_id (
          name
        )
      `)
      .eq('user_id', employeeId)
      .in('status', ['approved', 'rejected'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (queryError) {
      console.error('[getEmployeeLeaveHistory] Query error:', queryError);
      return { error: 'Failed to fetch leave history' };
    }

    if (!leaveRequests || leaveRequests.length === 0) {
      return { data: [] };
    }

    // Transform to UI-friendly format
    const history: EmployeeLeaveHistoryItem[] = leaveRequests.map((request: any) => {
      const leaveTypeData = request.leave_type as any;
      return {
        id: request.id,
        leaveType: leaveTypeData?.name || 'Unknown',
        startDate: request.start_date,
        endDate: request.end_date,
        reason: request.reason,
        status: request.status as 'approved' | 'rejected',
      };
    });

    return { data: history };
  } catch (error) {
    console.error('[getEmployeeLeaveHistory] Unexpected error:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }

    return { error: 'An unexpected error occurred while fetching leave history' };
  }
}


import {
  getNowPartsInGMT7,
  getTodayDateString,
  formatDateISO,
  formatTimeShort,
  APP_TIMEZONE,
  getCurrentMonth,
  getCurrentYear,
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
 * Attendance statistics for an employee
 */
export interface EmployeeAttendanceStats {
  /** Average hours worked per day (null if no data) */
  avgHoursWorked: number | null;
  /** Average check-in time as minutes from midnight in GMT+7 (null if no data) */
  avgCheckInTimeMinutes: number | null;
  /** Period description for display (e.g., "Last 30 days") */
  periodLabel: string;
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
  yesterday: string
): ActivityGroupData[] {
  const groupsMap = new Map<string, ActivityEntry[]>();

  records.forEach(record => {
    const date = record.date;
    if (!groupsMap.has(date)) {
      groupsMap.set(date, []);
    }

    const activities = groupsMap.get(date)!;

    if (record.check_in_time) {
      activities.push({
        id: `${record.date}-checkin`,
        type: 'checkIn' as ActivityType,
        time: formatTimeShort(record.check_in_time),
        status: mapAttendanceStatus(record.check_in_status),
      });
    }

    if (record.check_out_time) {
      activities.push({
        id: `${record.date}-checkout`,
        type: 'checkOut' as ActivityType,
        time: formatTimeShort(record.check_out_time),
        status: mapAttendanceStatus(record.check_out_status),
      });
    }
  });

  const sortedDates = Array.from(groupsMap.keys()).sort((a, b) => b.localeCompare(a));
  const groups: ActivityGroupData[] = [];

  sortedDates.forEach((date) => {
    const activities = groupsMap.get(date);
    if (activities && activities.length > 0) {
      activities.sort((a, b) => {
        if (a.type === 'checkIn' && b.type === 'checkOut') return -1;
        if (a.type === 'checkOut' && b.type === 'checkIn') return 1;
        return a.time.localeCompare(b.time);
      });

      groups.push({
        id: date,
        label: formatDateLabel(date, today, yesterday),
        activities,
        isLast: false,
      });
    }
  });

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
  yesterday: string
): ActivityGroupData[] {
  const groupsMap = new Map<string, ActivityEntry[]>();

  leaveRequests.forEach(leave => {
    const createdDate = formatDateISO(new Date(leave.created_at));

    if (!groupsMap.has(createdDate)) {
      groupsMap.set(createdDate, []);
    }

    const activities = groupsMap.get(createdDate)!;

    activities.push({
      id: leave.id,
      type: 'checkIn' as ActivityType,
      time: formatTimeShort(leave.created_at),
      status: 'onTime' as ActivityStatus,
    });
  });

  const sortedDates = Array.from(groupsMap.keys()).sort((a, b) => b.localeCompare(a));
  const groups: ActivityGroupData[] = [];

  sortedDates.forEach((date) => {
    const activities = groupsMap.get(date);
    if (activities && activities.length > 0) {
      activities.sort((a, b) => b.time.localeCompare(a.time));

      groups.push({
        id: `leave-${date}`,
        label: formatDateLabel(date, today, yesterday),
        activities,
        isLast: false,
      });
    }
  });

  if (groups.length > 0) {
    groups[groups.length - 1].isLast = true;
  }

  return groups;
}


/**
 * Fetch employee activities for the specified month
 * 
 * @param employeeId - The employee's user ID
 * @param month - Month number (1-12)
 * @param year - Year (e.g., 2024)
 * @returns Promise with activity groups or error
 */
export async function getEmployeeActivities(
  employeeId: string,
  month: number,
  year: number
): Promise<{ data?: EmployeeActivitiesResult; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();

    const today = getTodayDateString();
    const nowParts = getNowPartsInGMT7();
    const yesterdayDate = new Date(nowParts.year, nowParts.month - 1, nowParts.day - 1);
    const yesterday = formatDateISO(yesterdayDate);

    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const [attendanceResult, leaveRequestsResult] = await Promise.all([
      supabase
        .from('attendance_records')
        .select('date, check_in_time, check_out_time, check_in_status, check_out_status')
        .eq('user_id', employeeId)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .order('date', { ascending: false }),

      supabase
        .from('leave_requests')
        .select('id, created_at, start_date, end_date, status, leave_type_id')
        .eq('user_id', employeeId)
        .neq('status', 'cancelled')
        .gte('created_at', `${startOfMonth}T00:00:00`)
        .lte('created_at', `${endOfMonth}T23:59:59`)
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

    const attendanceGroups = transformAttendanceToGroups(
      (attendanceResult.data || []) as AttendanceRecord[],
      today,
      yesterday
    );

    const leaveRequestGroups = transformLeaveRequestsToGroups(
      (leaveRequestsResult.data || []) as LeaveRequest[],
      today,
      yesterday
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


/**
 * Fetch employee attendance statistics for a specific month/year
 * 
 * Calculates:
 * - Average hours worked per day (from total_hours field)
 * - Average check-in time as minutes from midnight in GMT+7
 * 
 * @param employeeId - The employee's user ID
 * @param month - Month to filter by (1-12), defaults to current month
 * @param year - Year to filter by (e.g., 2025), defaults to current year
 * @returns Promise with attendance stats or error
 */
export async function getEmployeeAttendanceStats(
  employeeId: string,
  month?: number,
  year?: number
): Promise<{ data?: EmployeeAttendanceStats; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();

    // Use provided month/year or default to current month/year in GMT+7
    const selectedMonth = month ?? getCurrentMonth();
    const selectedYear = year ?? getCurrentYear();

    // Calculate first day of month (startDate) and last day of month (endDate) in GMT+7
    // Month is 1-indexed (1 = January), so we subtract 1 for JavaScript Date
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0); // Day 0 of next month = last day of current month

    const startDate = formatDateISO(firstDayOfMonth);
    const endDate = formatDateISO(lastDayOfMonth);

    // Fetch attendance records for the selected month/year
    const { data: records, error: queryError } = await supabase
      .from('attendance_records')
      .select('total_hours, check_in_time')
      .eq('user_id', employeeId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (queryError) {
      console.error('[getEmployeeAttendanceStats] Query error:', queryError);
      return { error: 'Failed to fetch attendance statistics' };
    }

    // Calculate average hours worked (only where total_hours is not null)
    const hoursRecords = (records || []).filter(r => r.total_hours !== null && r.total_hours !== undefined);
    const avgHoursWorked = hoursRecords.length > 0
      ? hoursRecords.reduce((sum, r) => sum + (r.total_hours as number), 0) / hoursRecords.length
      : null;

    // Calculate average check-in time as minutes from midnight in GMT+7
    const checkInRecords = (records || []).filter(r => r.check_in_time !== null);
    let avgCheckInTimeMinutes: number | null = null;

    if (checkInRecords.length > 0) {
      const totalMinutes = checkInRecords.reduce((sum, r) => {
        // Parse the check_in_time (ISO timestamp) and convert to GMT+7 time
        const checkInDate = new Date(r.check_in_time as string);
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: APP_TIMEZONE,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const parts = formatter.formatToParts(checkInDate);
        const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

        // Convert to minutes from midnight
        const minutesFromMidnight = (hour === 24 ? 0 : hour) * 60 + minute;
        return sum + minutesFromMidnight;
      }, 0);

      avgCheckInTimeMinutes = Math.round(totalMinutes / checkInRecords.length);
    }

    // Generate period label (e.g., "December 2025")
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const periodLabel = `${monthNames[selectedMonth - 1]} ${selectedYear}`;

    return {
      data: {
        avgHoursWorked: avgHoursWorked !== null ? Math.round(avgHoursWorked * 10) / 10 : null, // Round to 1 decimal
        avgCheckInTimeMinutes,
        periodLabel,
      },
    };
  } catch (error) {
    console.error('[getEmployeeAttendanceStats] Unexpected error:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }

    return { error: 'An unexpected error occurred while fetching attendance statistics' };
  }
}

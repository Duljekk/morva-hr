'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * ATTENDANCE ACTIONS
 * 
 * These server actions handle check-in/check-out operations.
 * All time calculations happen server-side for security and accuracy.
 */

// Helper: Get today's date string in YYYY-MM-DD format (server timezone)
function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Helper: Get current date-time in database format
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * GET TODAY'S ATTENDANCE
 * 
 * Logic:
 * 1. Get current user from auth session
 * 2. Query attendance_records for today's date
 * 3. Return record or null if not found
 */
export async function getTodaysAttendance() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const today = getTodayDateString();

    // Query today's attendance record
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching attendance:', error);
      return { error: error.message };
    }

    return { data: data || null };
  } catch (error) {
    console.error('Unexpected error in getTodaysAttendance:', error);
    return { error: 'Failed to fetch attendance' };
  }
}

/**
 * CHECK IN
 * 
 * Logic:
 * 1. Get user and their shift schedule from users table
 * 2. Record current time as check_in_time
 * 3. Compare with shift_start_hour to determine if 'late' or 'ontime'
 * 4. Insert new attendance record for today
 * 5. Revalidate page to show updated UI
 */
export async function checkIn() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    // Get user's shift schedule
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('shift_start_hour, shift_end_hour')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return { error: 'Failed to fetch user data' };
    }

    const now = new Date();
    const today = getTodayDateString();
    const checkInTime = getCurrentTimestamp();

    // Calculate shift start time for today
    const shiftStart = new Date(now);
    shiftStart.setHours(userData.shift_start_hour, 0, 0, 0);
    shiftStart.setSeconds(0, 0); // Ensure seconds and milliseconds are 0

    // Determine check-in status: late if check-in time is >= shift start + 1 minute
    // This allows for exact time (11:00:00) or up to 59 seconds after (11:00:59) to be considered ontime
    // Only 11:01:00 and later will be marked as late
    const shiftStartWithTolerance = new Date(shiftStart.getTime() + 60000); // Add 1 minute tolerance (60 seconds)
    const checkInStatus = now >= shiftStartWithTolerance ? 'late' : 'ontime';

    // Check if already checked in today
    const { data: existing } = await supabase
      .from('attendance_records')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (existing) {
      return { error: 'Already checked in today' };
    }

    // Insert attendance record
    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        user_id: user.id,
        date: today,
        check_in_time: checkInTime,
        check_in_status: checkInStatus,
      })
      .select()
      .single();

    if (error) {
      console.error('Error checking in:', error);
      return { error: error.message };
    }

    // Revalidate the page to show updated data
    revalidatePath('/');
    
    return { data };
  } catch (error) {
    console.error('Unexpected error in checkIn:', error);
    return { error: 'Failed to check in' };
  }
}

/**
 * CHECK OUT
 * 
 * Logic:
 * 1. Find today's attendance record
 * 2. Record current time as check_out_time
 * 3. Compare with shift_end_hour to determine status:
 *    - 'leftearly' if before shift end
 *    - 'ontime' if exactly at shift end
 *    - 'overtime' if after shift end
 * 4. Calculate total_hours and overtime_hours
 * 5. Update the record
 * 6. Revalidate page
 */
export async function checkOut() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const today = getTodayDateString();
    const checkOutTime = getCurrentTimestamp();

    // Get today's attendance record
    const { data: attendance, error: fetchError } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (fetchError || !attendance) {
      return { error: 'No check-in record found for today' };
    }

    if (attendance.check_out_time) {
      return { error: 'Already checked out today' };
    }

    // Get user's shift schedule
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('shift_start_hour, shift_end_hour')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return { error: 'Failed to fetch user data' };
    }

    const now = new Date();
    const checkInDate = new Date(attendance.check_in_time);

    // Calculate shift end time for today
    const shiftEnd = new Date(now);
    shiftEnd.setHours(userData.shift_end_hour, 0, 0, 0);

    // Determine check-out status
    // Allow 1 minute tolerance for "ontime" (check-out at 19:00:00 to 19:00:59 is ontime)
    const shiftEndWithTolerance = new Date(shiftEnd.getTime() + 60000); // Add 1 minute tolerance
    let checkOutStatus: 'leftearly' | 'ontime' | 'overtime';
    if (now < shiftEnd) {
      checkOutStatus = 'leftearly';
    } else if (now.getTime() <= shiftEndWithTolerance.getTime()) {
      checkOutStatus = 'ontime';
    } else {
      checkOutStatus = 'overtime';
    }

    // Calculate total hours worked
    const totalMs = now.getTime() - checkInDate.getTime();
    const totalHours = totalMs / (1000 * 60 * 60); // Convert ms to hours

    // Calculate overtime hours (hours worked beyond shift end)
    const expectedShiftMs = (userData.shift_end_hour - userData.shift_start_hour) * 60 * 60 * 1000;
    const overtimeMs = Math.max(0, totalMs - expectedShiftMs);
    const overtimeHours = overtimeMs / (1000 * 60 * 60);

    // Update attendance record
    const { data, error } = await supabase
      .from('attendance_records')
      .update({
        check_out_time: checkOutTime,
        check_out_status: checkOutStatus,
        total_hours: Number(totalHours.toFixed(2)),
        overtime_hours: Number(overtimeHours.toFixed(2)),
      })
      .eq('id', attendance.id)
      .select()
      .single();

    if (error) {
      console.error('Error checking out:', error);
      return { error: error.message };
    }

    // Revalidate the page
    revalidatePath('/');
    
    return { data };
  } catch (error) {
    console.error('Unexpected error in checkOut:', error);
    return { error: 'Failed to check out' };
  }
}

// Type definitions for recent activities
export interface Activity {
  type: 'checkin' | 'checkout' | 'leave';
  time: string;
  status?: 'late' | 'ontime' | 'overtime' | 'leftearly' | 'pending' | 'approved' | 'rejected';
  // Leave-specific fields
  leaveType?: 'annual' | 'sick' | 'unpaid';
  dateRange?: string; // e.g., "14-15 Nov"
}

export interface DayActivity {
  date: string;
  activities: Activity[];
}

/**
 * GET RECENT ACTIVITIES
 * 
 * Logic:
 * 1. Get current user from auth session
 * 2. Query attendance_records for the last N days (default 14 days)
 * 3. Group records by date
 * 4. Format into DayActivity[] structure with check-in and check-out activities
 * 5. Return formatted activities sorted by date (newest first)
 */
export async function getRecentActivities(days: number = 14): Promise<{ data?: DayActivity[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    // Calculate date range (last N days, including today)
    // Use local timezone for date calculations to match user's local date
    const today = new Date();
    const localYear = today.getFullYear();
    const localMonth = today.getMonth();
    const localDay = today.getDate();
    const todayLocal = new Date(localYear, localMonth, localDay);
    
    const startDate = new Date(todayLocal);
    startDate.setDate(startDate.getDate() - (days - 1)); // Include today, so subtract (days - 1)

    // Format dates as YYYY-MM-DD in local timezone
    const formatLocalDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const todayDateString = formatLocalDate(todayLocal);
    const startDateString = formatLocalDate(startDate);

    console.log('[getRecentActivities] Fetching activities for user:', user.id);
    console.log('[getRecentActivities] Date range:', { startDateString, todayDateString, days });

    // Query attendance records for the date range (including today)
    const { data: records, error: fetchError } = await supabase
      .from('attendance_records')
      .select('date, check_in_time, check_out_time, check_in_status, check_out_status')
      .eq('user_id', user.id)
      .gte('date', startDateString)
      .lte('date', todayDateString) // Include today
      .order('date', { ascending: false });

    if (fetchError) {
      console.error('[getRecentActivities] Error fetching records:', fetchError);
      return { error: 'Failed to fetch recent activities' };
    }

    // Query leave requests that overlap with the date range
    // We want to show leaves where ANY date in [start_date, end_date] falls within [startDateString, todayDateString]
    // OR where the leave starts in the future but within an extended range
    // Calculate extended end date to show future leaves (extend by same number of days)
    const extendedEndDate = new Date(today);
    extendedEndDate.setDate(extendedEndDate.getDate() + days);
    const extendedEndDateString = extendedEndDate.toISOString().split('T')[0];
    
    // Query 1: Leaves that overlap with past/current range (start_date <= today AND end_date >= startDate)
    const { data: pastLeaves, error: pastLeaveError } = await supabase
      .from('leave_requests')
      .select('id, leave_type_id, start_date, end_date, status, created_at')
      .eq('user_id', user.id)
      .lte('start_date', todayDateString)
      .gte('end_date', startDateString)
      .in('status', ['pending', 'approved', 'rejected'])
      .order('created_at', { ascending: false });
    
    // Query 2: Future leaves that start within extended range (start_date > today AND start_date <= extendedEndDate)
    const { data: futureLeaves, error: futureLeaveError } = await supabase
      .from('leave_requests')
      .select('id, leave_type_id, start_date, end_date, status, created_at')
      .eq('user_id', user.id)
      .gt('start_date', todayDateString)
      .lte('start_date', extendedEndDateString)
      .in('status', ['pending', 'approved', 'rejected'])
      .order('created_at', { ascending: false });
    
    // Merge both queries and remove duplicates
    const allLeaves = [
      ...(pastLeaves || []),
      ...(futureLeaves || []),
    ];
    
    const uniqueLeaves = allLeaves.filter((leave, index, self) =>
      index === self.findIndex(l => l.id === leave.id)
    );
    
    const leaveError = pastLeaveError || futureLeaveError;
    
    if (leaveError) {
      console.error('[getRecentActivities] Error fetching leave requests:', leaveError);
      // Continue without leave requests if there's an error
    }
    
    const leaveRequests = uniqueLeaves;

    console.log('[getRecentActivities] Found records:', records?.length || 0);
    console.log('[getRecentActivities] Found leave requests:', leaveRequests?.length || 0);

    if ((!records || records.length === 0) && (!leaveRequests || leaveRequests.length === 0)) {
      console.log('[getRecentActivities] No records found, returning empty array');
      return { data: [] };
    }

    // Helper function to format date (e.g., "October 30")
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString + 'T00:00:00');
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const day = date.getDate();
      return `${month} ${day}`;
    };

    // Helper function to format time (e.g., "11:12")
    const formatTime = (timestamp: string): string => {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // Helper function to format date range (e.g., "14-15 Nov")
    const formatDateRange = (startDate: string, endDate: string): string => {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      
      const startDay = start.getDate();
      const endDay = end.getDate();
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
      
      // If same month, show "14-15 Nov", otherwise "30 Nov - 2 Dec"
      if (startMonth === endMonth) {
        return `${startDay}-${endDay} ${startMonth}`;
      } else {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
      }
    };

    // Helper function to get all dates in a range
    const getDatesInRange = (startDate: string, endDate: string): string[] => {
      const dates: string[] = [];
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      
      const current = new Date(start);
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
      
      return dates;
    };

    // Group records by date and format activities
    const activitiesByDate = new Map<string, Activity[]>();

    // Process attendance records
    if (records) {
      for (const record of records) {
        const dateKey = record.date;
        
        // Debug: Log today's record if found
        if (dateKey === todayDateString) {
          console.log('[getRecentActivities] Found today\'s record:', {
            date: dateKey,
            check_in_time: record.check_in_time,
            check_out_time: record.check_out_time,
            check_in_status: record.check_in_status,
            check_out_status: record.check_out_status,
          });
        }
        
        if (!activitiesByDate.has(dateKey)) {
          activitiesByDate.set(dateKey, []);
        }

        const activities = activitiesByDate.get(dateKey)!;

        // Add check-in activity if exists
        if (record.check_in_time) {
          activities.push({
            type: 'checkin',
            time: formatTime(record.check_in_time),
            status: record.check_in_status || undefined,
          });
        }

        // Add check-out activity if exists
        if (record.check_out_time) {
          activities.push({
            type: 'checkout',
            time: formatTime(record.check_out_time),
            status: record.check_out_status || undefined,
          });
        }
      }
    }

    // Process leave requests
    // Leave requests should appear on the date they were REQUESTED (created_at), not on the leave dates
    if (uniqueLeaves && uniqueLeaves.length > 0) {
      for (const leave of uniqueLeaves) {
        // Get the date when the leave was requested (created_at)
        // Convert to local timezone to get the correct local date
        const requestDate = new Date(leave.created_at);
        // Get local date components (not UTC)
        const localYear = requestDate.getFullYear();
        const localMonth = requestDate.getMonth();
        const localDay = requestDate.getDate();
        // Create a new date at midnight in local timezone
        const localRequestDate = new Date(localYear, localMonth, localDay);
        // Format as YYYY-MM-DD in local timezone
        const year = localRequestDate.getFullYear();
        const month = String(localRequestDate.getMonth() + 1).padStart(2, '0');
        const day = String(localRequestDate.getDate()).padStart(2, '0');
        const requestDateString = `${year}-${month}-${day}`;
        
        // Only include if the request date is within our display range
        const isInPastRange = requestDateString >= startDateString && requestDateString <= todayDateString;
        const isInFutureRange = requestDateString > todayDateString && requestDateString <= extendedEndDateString;
        
        if (!isInPastRange && !isInFutureRange) {
          continue; // Skip if request date is outside our range
        }
        
        const dateRange = formatDateRange(leave.start_date, leave.end_date);
        const leaveTime = formatTime(leave.created_at);
        
        // Map leave_type_id to leave type
        const leaveType = leave.leave_type_id as 'annual' | 'sick' | 'unpaid';
        
        // Map status (exclude 'cancelled')
        const status = leave.status === 'cancelled' ? undefined : leave.status as 'pending' | 'approved' | 'rejected';
        
        if (!status) continue; // Skip cancelled leaves
        
        // Add leave activity on the date it was requested
        if (!activitiesByDate.has(requestDateString)) {
          activitiesByDate.set(requestDateString, []);
        }
        
        const activities = activitiesByDate.get(requestDateString)!;
        
        // Add leave activity
        activities.push({
          type: 'leave',
          time: leaveTime,
          status: status,
          leaveType: leaveType,
          dateRange: dateRange,
        });
      }
    }

    // Convert map to array and format
    // Sort by date first (newest first), then format
    // Filter out dates with no activities (shouldn't happen, but just in case)
    const dayActivities: DayActivity[] = Array.from(activitiesByDate.entries())
      .filter(([date, activities]) => activities.length > 0) // Only include dates with activities
      .sort(([dateA], [dateB]) => {
        // Sort by date string (YYYY-MM-DD format) - newest first
        return dateB.localeCompare(dateA);
      })
      .map(([date, activities]) => ({
        date: formatDate(date),
        activities: activities.sort((a, b) => {
          // Sort activities: leave requests first, then check-in, then check-out
          // Within same type, sort by time
          if (a.type === 'leave' && b.type !== 'leave') return -1;
          if (a.type !== 'leave' && b.type === 'leave') return 1;
          if (a.type === 'checkin' && b.type === 'checkout') return -1;
          if (a.type === 'checkout' && b.type === 'checkin') return 1;
          return a.time.localeCompare(b.time);
        }),
      }));

    console.log('[getRecentActivities] Formatted activities:', dayActivities.length, 'days');
    console.log('[getRecentActivities] Today date string:', todayDateString);
    console.log('[getRecentActivities] Sample records:', records?.slice(0, 3));

    return { data: dayActivities };
  } catch (error) {
    console.error('Unexpected error in getRecentActivities:', error);
    return { error: 'Failed to fetch recent activities' };
  }
}


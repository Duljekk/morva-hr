'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import {
  todayLocal,
  createTimestamp,
  compareToShiftTime,
  nowUTC,
  getNowPartsLocal,
  APP_TIMEZONE
} from '@/lib/time/time-engine';
import { formatDateISO, formatTimeWIB } from '@/lib/time/format';
import {
  validateCoordinates,
  getOfficeLocationFromDB,
  calculateDistance,
} from '@/lib/utils/geolocation';

/**
 * ATTENDANCE ACTIONS
 * 
 * These server actions handle check-in/check-out operations.
 * All time calculations happen server-side for security and accuracy.
 * Uses GMT+7 (Asia/Bangkok) timezone for all date operations.
 */

// DO NOT use server local time - all date logic goes through time-engine.ts
function getTodayDateString(): string {
  return todayLocal();
}

function getCurrentTimestamp(): string {
  return createTimestamp();
}

/**
 * GET TODAY'S ATTENDANCE
 * 
 * Logic:
 * 1. Get current user from auth session
 * 2. Query attendance_records for today's date
 * 3. Return record or null if not found
 * 
 * Cached with 5-minute revalidation and user-specific tags for targeted invalidation
 */
async function _getTodaysAttendanceUncached(userId: string, today: string): Promise<
  | { data: any; error?: never }
  | { error: string; data?: never }
> {
  const supabase = await createClient();

  // Query today's attendance record
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching attendance:', error);
    return { error: error.message };
  }

  return { data: data || null };
}

export async function getTodaysAttendance(): Promise<
  | { data: any; error?: never }
  | { error: string; data?: never }
> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const today = getTodayDateString();

    // NOTE: Server-side caching removed to prevent stale data during hydration
    // Client-side SWR caching in useDashboardData.ts handles caching with keepPreviousData
    // This ensures real-time accuracy for attendance status badges
    return await _getTodaysAttendanceUncached(user.id, today);
  } catch (error) {
    console.error('[getTodaysAttendance] Unexpected error:', error);
    console.error('[getTodaysAttendance] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { error: `Failed to fetch attendance: ${error instanceof Error ? error.message : String(error)}` };
  }
}

/**
 * CHECK IN
 * 
 * Logic:
 * 1. Validate location is provided (required for check-in)
 * 2. Validate coordinates are within valid ranges
 * 3. Calculate distance from office using Haversine formula
 * 4. Reject if distance > 50m radius
 * 5. Get user and their shift schedule from users table
 * 6. Record current time as check_in_time
 * 7. Compare with shift_start_hour to determine if 'late' or 'ontime'
 * 8. Insert new attendance record with location data
 * 9. Revalidate page to show updated UI
 */
export async function checkIn(
  latitude?: number,
  longitude?: number,
  accuracy?: number
): Promise<
  | { data: any; error?: never }
  | { error: string; data?: never }
> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    // LOCATION VALIDATION: Location is required for check-in
    if (latitude === undefined || longitude === undefined) {
      return { error: 'Location is required for check-in. Please enable location services.' };
    }

    // Validate coordinate ranges
    if (!validateCoordinates(latitude, longitude)) {
      return { error: 'Invalid location coordinates. Please try again.' };
    }

    // Calculate distance from office (using database location)
    const officeLocation = await getOfficeLocationFromDB();
    const distance = calculateDistance(
      latitude,
      longitude,
      officeLocation.latitude,
      officeLocation.longitude
    );

    // Check if within allowed radius (50m default)
    if (distance > officeLocation.radius) {
      return {
        error: `You are ${Math.round(distance)}m away from the office. Please move within ${officeLocation.radius}m to check in.`,
      };
    }

    const today = getTodayDateString();
    const checkInTime = getCurrentTimestamp();

    // OPTIMIZED: Batch both queries in parallel using Promise.all
    // Query 1: Get user's shift schedule (needed for check-in status calculation)
    // Query 2: Check if already checked in today
    // These queries are independent and can run concurrently
    const [userDataResult, existingResult] = await Promise.all([
      // Query 1: Get user's shift schedule
      supabase
        .from('users')
        .select('shift_start_hour, shift_end_hour')
        .eq('id', user.id)
        .single(),
      // Query 2: Check if already checked in today
      supabase
        .from('attendance_records')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single(),
    ]);

    const { data: userData, error: userError } = userDataResult;
    const { data: existing } = existingResult;

    if (userError || !userData) {
      return { error: 'Failed to fetch user data' };
    }

    if (existing) {
      return { error: 'Already checked in today' };
    }

    // TIMEZONE-SAFE: Determine check-in status using time-engine
    // Use default shift hours if not set in database (9 AM default)
    const shiftStartHour = (userData as any)?.shift_start_hour || 9;

    // compareToShiftTime returns: -1 before, 0 on time, 1 after (late)
    // tolerance of 1 minute: 09:00:00 to 09:00:59 is ontime, 09:01:00+ is late
    const checkInStatus = compareToShiftTime(shiftStartHour, 1) > 0 ? 'late' : 'ontime';

    // Insert attendance record with location data
    const { data, error } = await (supabase as any)
      .from('attendance_records')
      .insert({
        user_id: user.id,
        date: today,
        check_in_time: checkInTime,
        check_in_status: checkInStatus,
        check_in_latitude: latitude,
        check_in_longitude: longitude,
        check_in_location_accuracy: accuracy || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error checking in:', error);
      return { error: error.message };
    }

    // Invalidate cache tags for attendance and activities
    // Use revalidateTag for targeted cache invalidation
    // 'max' profile enables stale-while-revalidate behavior (recommended by Next.js)
    // This invalidates only relevant cached data instead of the entire app cache
    revalidateTag('attendance', 'max');
    revalidateTag(`user-${user.id}`, 'max');
    revalidateTag('activities', 'max');

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
export async function checkOut(): Promise<
  | { data: any; error?: never }
  | { error: string; data?: never }
> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    const today = getTodayDateString();
    const checkOutTime = getCurrentTimestamp();

    // OPTIMIZED: Batch both queries in parallel using Promise.all
    // This reduces total query time by running queries concurrently instead of sequentially
    const [attendanceResult, userDataResult] = await Promise.all([
      // Query 1: Get today's attendance record
      supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single(),
      // Query 2: Get user's shift schedule
      supabase
        .from('users')
        .select('shift_start_hour, shift_end_hour')
        .eq('id', user.id)
        .single(),
    ]);

    const { data: attendance, error: fetchError } = attendanceResult as any;
    const { data: userData, error: userError } = userDataResult as any;

    if (fetchError || !attendance) {
      return { error: 'No check-in record found for today' };
    }

    if (attendance.check_out_time) {
      return { error: 'Already checked out today' };
    }

    if (userError || !userData) {
      return { error: 'Failed to fetch user data' };
    }

    const checkInDate = new Date(attendance.check_in_time);

    // TIMEZONE-SAFE: Determine check-out status using time-engine
    // Use default shift hours if not set in database (6 PM default)
    const shiftEndHour = (userData as any)?.shift_end_hour || 18;
    const shiftStartHour = (userData as any)?.shift_start_hour || 9;

    // compareToShiftTime returns: -1 before (left early), 0 on time, 1 after (overtime)
    const compareResult = compareToShiftTime(shiftEndHour, 1);
    let checkOutStatus: 'leftearly' | 'ontime' | 'overtime';
    if (compareResult < 0) {
      checkOutStatus = 'leftearly';
    } else if (compareResult === 0) {
      checkOutStatus = 'ontime';
    } else {
      checkOutStatus = 'overtime';
    }

    // Calculate total hours worked using actual UTC timestamps
    const currentUTC = nowUTC();
    const totalMs = currentUTC.getTime() - checkInDate.getTime();
    const totalHours = totalMs / (1000 * 60 * 60); // Convert ms to hours

    // Calculate overtime hours (hours worked beyond expected shift duration)
    const expectedShiftMs = (shiftEndHour - shiftStartHour) * 60 * 60 * 1000;
    const overtimeMs = Math.max(0, totalMs - expectedShiftMs);
    const overtimeHours = overtimeMs / (1000 * 60 * 60);

    // Update attendance record
    const { data, error } = await (supabase as any)
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

    // Invalidate cache tags for attendance and activities
    // Use revalidateTag for targeted cache invalidation
    // 'max' profile enables stale-while-revalidate behavior (recommended by Next.js)
    // This invalidates only relevant cached data instead of the entire app cache
    revalidateTag('attendance', 'max');
    revalidateTag(`user-${user.id}`, 'max');
    revalidateTag('activities', 'max');

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
 * GET RECENT ACTIVITIES (Uncached implementation)
 * 
 * Logic:
 * 1. Get current user from auth session
 * 2. Query attendance_records for the last N days (default 14 days)
 * 3. Group records by date
 * 4. Format into DayActivity[] structure with check-in and check-out activities
 * 5. Return formatted activities sorted by date (newest first)
 */
async function _getRecentActivitiesUncached(
  userId: string,
  days: number
): Promise<{ data?: DayActivity[]; error?: string }> {
  const supabase = await createClient();

  // Calculate date range (last N days, including today)
  // Use time-engine for consistent timezone handling across all operations
  const nowParts = getNowPartsLocal();
  const todayLocalDate = new Date(nowParts.year, nowParts.month - 1, nowParts.day);

  const startDate = new Date(todayLocalDate);
  startDate.setDate(startDate.getDate() - (days - 1)); // Include today, so subtract (days - 1)

  // Use timezone utility for date formatting
  const todayDateString = formatDateISO(todayLocalDate);
  const startDateString = formatDateISO(startDate);

  console.log('[getRecentActivities] Fetching activities for user:', userId);
  console.log('[getRecentActivities] Date range (GMT+7):', { startDateString, todayDateString, days });

  // Query attendance records for the date range (including today)
  const { data: records, error: fetchError } = await supabase
    .from('attendance_records')
    .select('date, check_in_time, check_out_time, check_in_status, check_out_status')
    .eq('user_id', userId)
    .gte('date', startDateString)
    .lte('date', todayDateString) // Include today
    .order('date', { ascending: false });

  if (fetchError) {
    console.error('[getRecentActivities] Error fetching records:', fetchError);
    return { error: 'Failed to fetch recent activities' };
  }

  // Query leave requests that overlap with the date range
  // Optimized: Single query using PostgreSQL function to combine two conditions
  // Condition 1: Leaves that overlap with past/current range (start_date <= today AND end_date >= startDate)
  // Condition 2: Future leaves that start within extended range (start_date > today AND start_date <= extendedEndDate)
  // Calculate extended end date to show future leaves (extend by same number of days)
  const extendedEndDate = new Date(todayLocalDate);
  extendedEndDate.setDate(extendedEndDate.getDate() + days);
  const extendedEndDateString = extendedEndDate.toISOString().split('T')[0];

  // Use optimized PostgreSQL function for single query with complex OR conditions
  // This reduces database round trips from 2 to 1 (50% reduction)
  // The composite indexes optimize this query execution
  // Fallback to original query logic if function doesn't exist (migration not run yet)
  let leaveRequests: any[] | null = null;
  let leaveError: any = null;

  try {
    const { data, error } = await (supabase as any)
      .rpc('get_recent_leave_requests', {
        p_user_id: userId,
        p_start_date: startDateString,
        p_today_date: todayDateString,
        p_extended_end_date: extendedEndDateString,
      });

    leaveRequests = data;
    leaveError = error;

    if (leaveError) {
      // If function doesn't exist, fallback to original query logic
      if (leaveError.message?.includes('function') || leaveError.code === '42883') {
        console.warn('[getRecentActivities] PostgreSQL function not found, using fallback query:', leaveError.message);

        // Fallback: Use original two-query approach
        const extendedEndDate = new Date(todayLocalDate);
        extendedEndDate.setDate(extendedEndDate.getDate() + days);
        const extendedEndDateStringFallback = extendedEndDate.toISOString().split('T')[0];

        // Query 1: Leaves that overlap with past/current range
        const { data: pastLeaves, error: pastLeaveError } = await supabase
          .from('leave_requests')
          .select('id, leave_type_id, start_date, end_date, status, created_at')
          .eq('user_id', userId)
          .lte('start_date', todayDateString)
          .gte('end_date', startDateString)
          .in('status', ['pending', 'approved', 'rejected'])
          .order('created_at', { ascending: false });

        // Query 2: Future leaves that start within extended range
        const { data: futureLeaves, error: futureLeaveError } = await supabase
          .from('leave_requests')
          .select('id, leave_type_id, start_date, end_date, status, created_at')
          .eq('user_id', userId)
          .gt('start_date', todayDateString)
          .lte('start_date', extendedEndDateStringFallback)
          .in('status', ['pending', 'approved', 'rejected'])
          .order('created_at', { ascending: false });

        if (pastLeaveError || futureLeaveError) {
          console.error('[getRecentActivities] Error in fallback queries:', pastLeaveError || futureLeaveError);
          leaveRequests = [];
        } else {
          // Merge and deduplicate
          const allLeaves = [
            ...(pastLeaves || []),
            ...(futureLeaves || []),
          ];
          leaveRequests = allLeaves.filter((leave: any, index: number, self: any[]) =>
            index === self.findIndex((l: any) => l.id === leave.id)
          );
        }
      } else {
        console.error('[getRecentActivities] Error fetching leave requests:', leaveError);
        leaveRequests = [];
      }
    }
  } catch (rpcError) {
    console.error('[getRecentActivities] RPC call failed:', rpcError);
    leaveRequests = [];
  }

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

  // Helper function to format time (e.g., "11:12") in WIB timezone
  const formatTime = (timestamp: string): string => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: APP_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(timestamp));
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
    for (const record of records as any[]) {
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
  if (leaveRequests && leaveRequests.length > 0) {
    for (const leave of leaveRequests) {
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
}

/**
 * GET RECENT ACTIVITIES (Public cached function)
 * 
 * Cached with 10-minute revalidation and user-specific tags for targeted invalidation
 */
export async function getRecentActivities(days: number = 14): Promise<{ data?: DayActivity[]; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    // Cache with 10-minute revalidation and user-specific tags
    // Tags: 'activities' (general) and 'user-{userId}' (user-specific)
    // Include 'days' in cache key to handle different day ranges
    try {
      const getCachedActivities = unstable_cache(
        async () => {
          return await _getRecentActivitiesUncached(user.id, days);
        },
        ['activities', `user-${user.id}`, `days-${days}`],
        {
          revalidate: 600, // 10 minutes
          tags: ['activities', `user-${user.id}`],
        }
      );

      return await getCachedActivities();
    } catch (cacheError) {
      console.error('[getRecentActivities] Cache error, falling back to direct call:', cacheError);
      console.error('[getRecentActivities] Cache error details:', {
        message: cacheError instanceof Error ? cacheError.message : String(cacheError),
        stack: cacheError instanceof Error ? cacheError.stack : undefined,
      });
      // Fallback to direct call if caching fails
      return await _getRecentActivitiesUncached(user.id, days);
    }
  } catch (error) {
    console.error('[getRecentActivities] Unexpected error:', error);
    console.error('[getRecentActivities] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { error: `Failed to fetch recent activities: ${error instanceof Error ? error.message : String(error)}` };
  }
}


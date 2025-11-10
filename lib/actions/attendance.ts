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

    // Determine check-in status: late if after shift start
    const checkInStatus = now > shiftStart ? 'late' : 'ontime';

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
    let checkOutStatus: 'leftearly' | 'ontime' | 'overtime';
    if (now < shiftEnd) {
      checkOutStatus = 'leftearly';
    } else if (now.getTime() === shiftEnd.getTime()) {
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


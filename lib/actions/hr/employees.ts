'use server';

/**
 * HR Employee Server Actions
 * 
 * Server actions for fetching and managing employee data.
 * All functions require HR admin role verification.
 */

import { requireHRAdmin } from '@/lib/auth/server';
import { getTodayDateString, getCurrentYear } from '@/lib/utils/timezone';
import {
  formatBirthDate,
  formatContractPeriod,
  mapEmploymentTypeToRole,
  getAttendanceStatus,
} from '@/lib/utils/employeeTransform';
import type { Employee } from '@/components/hr/employees/EmployeeTableRow';

/**
 * Database user row type for employee queries
 */
interface DbUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  profile_picture_url: string | null;
  birthdate: string | null;
  employment_type: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
}

/**
 * Leave balance aggregation type
 */
interface LeaveBalanceAgg {
  user_id: string;
  total_balance: number;
  total_allocated: number;
}

/**
 * Attendance record type
 */
interface AttendanceRecord {
  user_id: string;
  check_in_time: string | null;
  check_out_time: string | null;
}

/**
 * Fetch all employees with their leave balances and attendance status
 * 
 * @returns Object containing employee data array or error message
 */
/**
 * Delete (soft delete) an employee by setting is_active to false
 * 
 * @param employeeId - The UUID of the employee to delete
 * @returns Object containing success status or error message
 */
export async function deleteEmployee(employeeId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();
    
    // Validate employeeId
    if (!employeeId || typeof employeeId !== 'string') {
      return { error: 'Invalid employee ID' };
    }
    
    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('users')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', employeeId)
      .eq('role', 'employee'); // Ensure we only delete employees, not HR admins
    
    if (error) {
      console.error('[deleteEmployee] Error deleting employee:', error.message);
      return { error: 'Failed to delete employee' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('[deleteEmployee] Unexpected error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }
    
    return { error: 'An unexpected error occurred while deleting employee' };
  }
}

/**
 * Fetch all employees with their leave balances and attendance status
 * 
 * @returns Object containing employee data array or error message
 */
export async function getEmployees(): Promise<{ data?: Employee[]; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();
    
    const today = getTodayDateString();
    const currentYear = getCurrentYear();
    
    // Fetch all data in parallel for better performance
    const [usersResult, leaveBalancesResult, attendanceResult] = await Promise.all([
      // Query users table for employees
      supabase
        .from('users')
        .select('id, email, username, full_name, profile_picture_url, birthdate, employment_type, contract_start_date, contract_end_date')
        .eq('role', 'employee')
        .eq('is_active', true)
        .order('full_name'),
      
      // Query leave balances for current year (aggregate by user)
      supabase
        .from('leave_balances')
        .select('user_id, balance, allocated')
        .eq('year', currentYear),
      
      // Query attendance records for today
      supabase
        .from('attendance_records')
        .select('user_id, check_in_time, check_out_time')
        .eq('date', today),
    ]);

    // Handle errors
    if (usersResult.error) {
      console.error('[getEmployees] Error fetching users:', usersResult.error.message);
      return { error: 'Failed to fetch employees' };
    }
    
    if (leaveBalancesResult.error) {
      console.error('[getEmployees] Error fetching leave balances:', leaveBalancesResult.error.message);
      // Continue without leave balances - not critical
    }
    
    if (attendanceResult.error) {
      console.error('[getEmployees] Error fetching attendance:', attendanceResult.error.message);
      // Continue without attendance - not critical
    }
    
    const users = usersResult.data as DbUser[] || [];
    const leaveBalances = leaveBalancesResult.data || [];
    const attendanceRecords = attendanceResult.data as AttendanceRecord[] || [];
    
    // Aggregate leave balances by user_id
    const leaveBalanceMap = new Map<string, LeaveBalanceAgg>();
    for (const lb of leaveBalances) {
      const existing = leaveBalanceMap.get(lb.user_id);
      if (existing) {
        existing.total_balance += lb.balance || 0;
        existing.total_allocated += lb.allocated || 0;
      } else {
        leaveBalanceMap.set(lb.user_id, {
          user_id: lb.user_id,
          total_balance: lb.balance || 0,
          total_allocated: lb.allocated || 0,
        });
      }
    }
    
    // Create attendance map by user_id
    const attendanceMap = new Map<string, AttendanceRecord>();
    for (const ar of attendanceRecords) {
      attendanceMap.set(ar.user_id, ar);
    }
    
    // Transform database users to Employee interface
    const employees: Employee[] = users.map((user) => {
      const leaveBalance = leaveBalanceMap.get(user.id);
      const attendance = attendanceMap.get(user.id);
      
      return {
        id: user.id,
        name: user.full_name,
        email: user.email,
        imageUrl: user.profile_picture_url,
        role: mapEmploymentTypeToRole(user.employment_type),
        birthDate: formatBirthDate(user.birthdate),
        leaveBalance: {
          current: leaveBalance?.total_balance ?? 0,
          total: leaveBalance?.total_allocated ?? 10, // Default to 10 if not specified
        },
        contractPeriod: formatContractPeriod(user.contract_start_date, user.contract_end_date),
        status: getAttendanceStatus(attendance || null),
      };
    });
    
    return { data: employees };
  } catch (error) {
    console.error('[getEmployees] Unexpected error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }
    
    return { error: 'An unexpected error occurred while fetching employees' };
  }
}

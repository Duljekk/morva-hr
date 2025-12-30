'use server';

/**
 * Server actions for employee profile data
 * 
 * Handles fetching user profile, leave balances, and leave request history.
 * 
 * Location: lib/actions/employee/ - Employee-only actions
 * Requirements: 7.1, 7.2, 7.3
 */

import { createClient } from '@/lib/supabase/server';
import { getCurrentYear } from '@/lib/utils/timezone';

/**
 * User profile data structure
 */
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'Intern' | 'Full-time';
  avatarUrl: string | null;
}

/**
 * Leave balance data structure
 */
export interface ProfileLeaveBalance {
  type: 'annual' | 'wfh' | 'sick';
  label: string;
  remaining: number;
  total: number;
}

/**
 * Leave request data structure
 */
export interface ProfileLeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'wfh' | 'unpaid';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  isHalfDay?: boolean;
}

/**
 * Profile data result structure
 */
export interface ProfileDataResult {
  user: UserProfile | null;
  leaveBalances: ProfileLeaveBalance[];
  leaveRequests: ProfileLeaveRequest[];
  error?: string;
}

/**
 * Map leave type name to slug for leave balances
 */
function mapLeaveTypeSlug(name: string): 'annual' | 'wfh' | 'sick' {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('annual') || lowerName.includes('paid time off')) {
    return 'annual';
  }
  if (lowerName.includes('wfh') || lowerName.includes('work from home')) {
    return 'wfh';
  }
  if (lowerName.includes('sick')) {
    return 'sick';
  }
  return 'annual'; // Default fallback
}

/**
 * Map leave type name to request type
 */
function mapLeaveRequestType(name: string): 'annual' | 'sick' | 'wfh' | 'unpaid' {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('annual') || lowerName.includes('paid time off')) {
    return 'annual';
  }
  if (lowerName.includes('sick')) {
    return 'sick';
  }
  if (lowerName.includes('wfh') || lowerName.includes('work from home')) {
    return 'wfh';
  }
  if (lowerName.includes('unpaid')) {
    return 'unpaid';
  }
  return 'annual'; // Default fallback
}

/**
 * Fetch user profile data from the database
 * Requirements: 7.1
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, employment_type, profile_picture_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[getUserProfile] Error fetching user profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Map employment_type to role for RoleBadge
    const role: 'Intern' | 'Full-time' = 
      data.employment_type === 'intern' ? 'Intern' : 'Full-time';

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      role,
      avatarUrl: data.profile_picture_url,
    };
  } catch (error) {
    console.error('[getUserProfile] Unexpected error:', error);
    return null;
  }
}

/**
 * Fetch leave balances for the user
 * Requirements: 7.2
 */
export async function getProfileLeaveBalances(userId: string): Promise<ProfileLeaveBalance[]> {
  try {
    const supabase = await createClient();
    const currentYear = getCurrentYear();

    const { data, error } = await supabase
      .from('leave_balances')
      .select(`
        leave_type_id,
        allocated,
        used,
        balance,
        leave_types:leave_type_id (
          name,
          id
        )
      `)
      .eq('user_id', userId)
      .eq('year', currentYear);

    if (error) {
      console.error('[getProfileLeaveBalances] Error fetching leave balances:', error);
      return [];
    }

    // Transform to the expected format
    return (data || []).map((item: any) => ({
      type: mapLeaveTypeSlug(item.leave_types?.name || ''),
      label: item.leave_types?.name || 'Unknown',
      remaining: item.balance,
      total: item.allocated,
    }));
  } catch (error) {
    console.error('[getProfileLeaveBalances] Unexpected error:', error);
    return [];
  }
}

/**
 * Fetch leave requests for the user
 * Requirements: 7.3
 */
export async function getProfileLeaveRequests(userId: string): Promise<ProfileLeaveRequest[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('leave_requests')
      .select(`
        id,
        start_date,
        end_date,
        status,
        day_type,
        leave_types:leave_type_id (
          name
        )
      `)
      .eq('user_id', userId)
      .in('status', ['pending', 'approved', 'rejected'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('[getProfileLeaveRequests] Error fetching leave requests:', error);
      return [];
    }

    // Transform to the expected format
    return (data || []).map((item: any) => ({
      id: item.id,
      type: mapLeaveRequestType(item.leave_types?.name || ''),
      startDate: item.start_date,
      endDate: item.end_date,
      status: item.status as 'pending' | 'approved' | 'rejected',
      isHalfDay: item.day_type === 'half',
    }));
  } catch (error) {
    console.error('[getProfileLeaveRequests] Unexpected error:', error);
    return [];
  }
}

/**
 * Fetch all profile data in a single call
 * This is the main entry point for the profile page
 * Requirements: 7.1, 7.2, 7.3
 */
export async function getProfileData(): Promise<ProfileDataResult> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[getProfileData] Auth error:', authError);
      return {
        user: null,
        leaveBalances: [],
        leaveRequests: [],
        error: 'Authentication required',
      };
    }

    // Fetch all data in parallel
    const [userProfile, leaveBalances, leaveRequests] = await Promise.all([
      getUserProfile(user.id),
      getProfileLeaveBalances(user.id),
      getProfileLeaveRequests(user.id),
    ]);

    if (!userProfile) {
      return {
        user: null,
        leaveBalances: [],
        leaveRequests: [],
        error: 'User profile not found',
      };
    }

    return {
      user: userProfile,
      leaveBalances,
      leaveRequests,
    };
  } catch (error) {
    console.error('[getProfileData] Unexpected error:', error);
    return {
      user: null,
      leaveBalances: [],
      leaveRequests: [],
      error: 'Failed to load profile data',
    };
  }
}

'use server';

import { createServiceRoleClient } from '@/lib/supabase/server';
import { requireHRAdmin } from '@/lib/auth/server';

/**
 * User invitation data
 */
export interface InviteUserData {
  email: string;
  full_name: string;
  username: string;
  employee_id?: string;
  role?: 'employee' | 'hr_admin';
  shift_start_hour?: number;
  shift_end_hour?: number;
  employment_type?: 'intern' | 'full_time' | 'part_time' | 'contractor';
  birthdate?: string; // ISO date string
  salary?: number;
  contract_start_date?: string; // ISO date string
  contract_end_date?: string; // ISO date string
}

/**
 * Leave quota configuration for new users
 */
const LEAVE_QUOTAS = [
  { leave_type_id: 'annual', allocated: 12 },
  { leave_type_id: 'sick', allocated: 5 },
  { leave_type_id: 'wfh', allocated: 5 },
] as const;

/**
 * Initialize leave balances for a new user
 * Creates balance rows for annual, sick, and wfh leave types
 * 
 * @param supabase - Supabase client with service role
 * @param userId - The new user's UUID
 * @param year - The year to initialize balances for (defaults to current year)
 * @returns Success status and error message if failed
 */
async function initializeLeaveBalancesForUser(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  userId: string,
  year: number = new Date().getFullYear()
): Promise<{ success: boolean; error?: string }> {
  const balanceRows = LEAVE_QUOTAS.map((q) => ({
    user_id: userId,
    leave_type_id: q.leave_type_id,
    allocated: q.allocated,
    used: 0,
    balance: q.leave_type_id === 'annual' ? 0 : q.allocated,
    year,
  }));

  const { error } = await supabase
    .from('leave_balances')
    .upsert(balanceRows, {
      onConflict: 'user_id,leave_type_id,year',
      ignoreDuplicates: true,
    });

  if (error) {
    console.error('[initializeLeaveBalancesForUser] Error:', error);
    return { success: false, error: error.message };
  }

  console.log('[initializeLeaveBalancesForUser] Successfully initialized balances for user:', userId);
  return { success: true };
}

/**
 * Invite a new user by email
 * 
 * This function:
 * 1. Verifies the caller is an HR admin
 * 2. Checks for duplicate emails
 * 3. Sends an invitation email via Supabase Auth Admin API
 * 4. The invitation email contains a magic link that redirects to /signup
 * 
 * @param userData - User data including email, full_name, username, etc.
 * @returns Success status, error message, and user ID if successful
 * 
 * @example
 * ```typescript
 * const result = await inviteUserByEmail({
 *   email: 'john.doe@company.com',
 *   full_name: 'John Doe',
 *   username: 'johndoe',
 *   role: 'employee',
 *   shift_start_hour: 9,
 *   shift_end_hour: 18,
 * });
 * ```
 */
export async function inviteUserByEmail(
  userData: InviteUserData
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Verify HR admin access
    await requireHRAdmin();

    // Get service role client for admin operations
    const supabase = createServiceRoleClient();
    if (!supabase) {
      return { success: false, error: 'Service role key not configured' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Check if user already exists in auth.users
    const { data: { users: authUsers }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('[inviteUserByEmail] Error listing users:', listError);
      return { success: false, error: 'Failed to check existing users' };
    }

    const existingAuthUser = authUsers?.find(u => u.email === userData.email);
    if (existingAuthUser) {
      return { success: false, error: 'User with this email already exists in auth system' };
    }

    // Get site URL from environment variable
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Invite user via Supabase Auth Admin API
    const { data: authUser, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
      userData.email,
      {
        redirectTo: `${siteUrl}/signup`,
        data: {
          full_name: userData.full_name,
          username: userData.username,
          employee_id: userData.employee_id,
          role: userData.role || 'employee',
          shift_start_hour: 11,  // Fixed shift hours
          shift_end_hour: 19,
        },
      }
    );

    if (inviteError) {
      console.error('[inviteUserByEmail] Invite error:', inviteError);
      return { success: false, error: inviteError.message };
    }

    if (!authUser?.user) {
      return { success: false, error: 'Failed to create user' };
    }

    // Manually create user profile in users table
    // Use upsert to handle case where database trigger already created the profile
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authUser.user.id,
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        employee_id: userData.employee_id || null,
        role: userData.role || 'employee',
        shift_start_hour: 11,
        shift_end_hour: 19,
        is_active: true,
      }, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    if (profileError) {
      console.error('[inviteUserByEmail] Profile creation error:', profileError);
      // Delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return { success: false, error: `Failed to create user profile: ${profileError.message}` };
    }

    // Initialize leave balances for the new user (non-critical)
    const balanceResult = await initializeLeaveBalancesForUser(
      supabase,
      authUser.user.id
    );
    if (!balanceResult.success) {
      console.error('[inviteUserByEmail] Failed to initialize leave balances:', balanceResult.error);
      // Non-critical - don't fail the invitation, user can have balances added later
    }

    console.log('[inviteUserByEmail] Successfully invited user:', {
      userId: authUser.user.id,
      email: userData.email,
      role: userData.role || 'employee',
    });

    return {
      success: true,
      userId: authUser.user.id
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[inviteUserByEmail] Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Resend invitation email to a user
 * 
 * @param email - User's email address
 * @returns Success status and error message if failed
 */
export async function resendInvitation(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify HR admin access
    await requireHRAdmin();

    // Get service role client for admin operations
    const supabase = createServiceRoleClient();
    if (!supabase) {
      return { success: false, error: 'Service role key not configured' };
    }

    // Get user from auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('[resendInvitation] Error listing users:', listError);
      return { success: false, error: 'Failed to find user' };
    }

    const user = users?.find(u => u.email === email);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Get site URL from environment variable
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Resend invitation
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${siteUrl}/signup`,
      }
    );

    if (inviteError) {
      console.error('[resendInvitation] Error resending invitation:', inviteError);
      return { success: false, error: inviteError.message };
    }

    console.log('[resendInvitation] Successfully resent invitation to:', email);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[resendInvitation] Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

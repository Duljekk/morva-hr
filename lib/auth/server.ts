/**
 * Server-Side Auth Helpers
 * 
 * Server-side authentication and authorization helpers for Server Actions.
 * These functions fetch user data from the database and verify permissions.
 * 
 * Best Practices:
 * - Use 'use server' directive at the top
 * - Type-safe return values
 * - Consistent error handling
 * - Early return pattern for unauthorized access
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/types/roles';

interface RequireAuthResult {
  userId: string;
  role: UserRole;
  supabase: SupabaseClient;
}

/**
 * Require authentication for server actions
 * 
 * Verifies user is authenticated and returns user ID, role, and Supabase client.
 * This is the base function for all server-side auth checks.
 * 
 * @returns User ID, role, and Supabase client if authenticated
 * @throws {Error} If user is not authenticated
 * 
 * @example
 * ```ts
 * 'use server';
 * import { requireAuth } from '@/lib/auth/server';
 * 
 * export async function myServerAction() {
 *   const { userId, role, supabase } = await requireAuth();
 *   // Use userId and supabase for authenticated operations
 * }
 * ```
 */
export async function requireAuth(): Promise<RequireAuthResult> {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('You must be logged in to perform this action');
  }

  // Fetch user role from database
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error('[requireAuth] Error fetching user role:', userError);
    throw new Error('Failed to verify user permissions');
  }

  if (!userData) {
    throw new Error('User not found');
  }

  // Check if user is active
  if (!userData.is_active) {
    throw new Error('Your account has been deactivated');
  }

  return {
    userId: user.id,
    role: userData.role as UserRole,
    supabase,
  };
}

/**
 * Require HR Admin role for server actions
 * 
 * Verifies user is authenticated and has HR admin role.
 * Throws error if user is not HR admin.
 * 
 * Following Next.js best practices:
 * - Early return pattern for unauthorized access
 * - Consistent error handling
 * - Type-safe return values
 * 
 * @returns User ID, role, and Supabase client if authorized
 * @throws {Error} If user is not authenticated or not HR admin
 * 
 * @example
 * ```ts
 * 'use server';
 * import { requireHRAdmin } from '@/lib/auth/server';
 * 
 * export async function approveLeaveRequest(requestId: string) {
 *   const { userId, supabase } = await requireHRAdmin();
 *   // Only HR admins can approve leave requests
 * }
 * ```
 */
export async function requireHRAdmin(): Promise<RequireAuthResult> {
  const { userId, role, supabase } = await requireAuth();

  if (role !== 'hr_admin') {
    throw new Error('Access denied. HR admin only.');
  }

  return { userId, role, supabase };
}

/**
 * Require Employee role for server actions
 * 
 * Verifies user is authenticated and has employee role.
 * Throws error if user is not an employee.
 * 
 * Note: HR admins can also access employee routes, so this function
 * allows both 'employee' and 'hr_admin' roles.
 * 
 * @returns User ID, role, and Supabase client if authorized
 * @throws {Error} If user is not authenticated or not an employee
 * 
 * @example
 * ```ts
 * 'use server';
 * import { requireEmployee } from '@/lib/auth/server';
 * 
 * export async function submitLeaveRequest(data: FormData) {
 *   const { userId, supabase } = await requireEmployee();
 *   // Employees can submit leave requests
 * }
 * ```
 */
export async function requireEmployee(): Promise<RequireAuthResult> {
  const { userId, role, supabase } = await requireAuth();

  if (role !== 'employee' && role !== 'hr_admin') {
    throw new Error('Access denied. Employee access required.');
  }

  return { userId, role, supabase };
}


























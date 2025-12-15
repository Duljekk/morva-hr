'use server';

import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/lib/types/roles';

/**
 * Result type for requireHRAdmin function
 */
export interface RequireHRAdminResult {
  userId: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

/**
 * Require HR Admin Authorization
 * 
 * This function verifies that the current user is authenticated and has HR admin role.
 * It should be called at the start of any HR admin-only server action.
 * 
 * @returns {Promise<RequireHRAdminResult>} Object containing userId and supabase client
 * @throws {Error} If user is not authenticated or not an HR admin
 * 
 * @example
 * ```typescript
 * export async function someHRAction() {
 *   const { supabase, userId } = await requireHRAdmin();
 *   // Use supabase client for queries
 * }
 * ```
 */
export async function requireHRAdmin(): Promise<RequireHRAdminResult> {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('[requireHRAdmin] Authentication error:', authError?.message || 'User not authenticated');
    throw new Error('Unauthorized: Authentication required');
  }

  // Fetch user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('[requireHRAdmin] Error fetching user profile:', profileError.message);
    throw new Error('Unauthorized: Failed to verify user role');
  }

  if (!profile) {
    console.error('[requireHRAdmin] User profile not found for user:', user.id);
    throw new Error('Unauthorized: User profile not found');
  }

  // Check if user is active
  if (!profile.is_active) {
    console.warn('[requireHRAdmin] Inactive user attempted HR admin action:', user.id);
    throw new Error('Unauthorized: Account is inactive');
  }

  // Check if user is HR admin
  if (profile.role !== 'hr_admin') {
    console.warn('[requireHRAdmin] Non-HR admin user attempted HR admin action:', {
      userId: user.id,
      role: profile.role,
    });
    throw new Error('Forbidden: HR admin access required');
  }

  return {
    userId: user.id,
    supabase,
  };
}


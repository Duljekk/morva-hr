/**
 * DEPRECATED: This file is kept for backward compatibility.
 * 
 * Please use the server-side helpers from lib/auth/server.ts instead:
 * - requireAuth() - For basic authentication
 * - requireHRAdmin() - For HR admin role verification
 * - requireEmployee() - For employee role verification
 * 
 * These functions are now re-exported from lib/auth/server.ts for convenience.
 */

'use server';

import { requireAuth as _requireAuth, requireHRAdmin as _requireHRAdmin } from './server';
import type { SupabaseClient } from '@supabase/supabase-js';

interface RequireHRAdminResult {
  userId: string;
  supabase: SupabaseClient;
}

/**
 * @deprecated Use requireHRAdmin() from lib/auth/server.ts instead
 * 
 * Require HR Admin role for server actions
 * 
 * This function verifies:
 * 1. User is authenticated
 * 2. User has 'hr_admin' role
 * 
 * @returns User ID and Supabase client if authorized
 * @throws {Error} If user is not authenticated or not HR admin
 */
export async function requireHRAdmin(): Promise<RequireHRAdminResult> {
  const { userId, supabase } = await _requireHRAdmin();
  return { userId, supabase };
}

/**
 * @deprecated Use requireAuth() from lib/auth/server.ts instead
 * 
 * Require authentication only (for employee actions)
 * 
 * This function verifies user is authenticated but doesn't check role.
 * Useful for employee-only actions that don't require HR admin privileges.
 * 
 * @returns User ID and Supabase client if authenticated
 * @throws {Error} If user is not authenticated
 */
export async function requireAuth(): Promise<RequireHRAdminResult> {
  const { userId, supabase } = await _requireAuth();
  return { userId, supabase };
}

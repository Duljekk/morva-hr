/**
 * Auth Utilities
 * 
 * Client-side and server-side utilities for authentication and authorization.
 * Uses the centralized permission system from lib/types/roles.ts
 * 
 * Best Practices:
 * - Client-side helpers for UI components
 * - Server-side helpers for server actions
 * - Type-safe permission checking
 * - Consistent error handling
 */

import type { UserProfile } from './AuthContext';
import type { UserRole, Permission } from '@/lib/types/roles';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/types/roles';

/**
 * CLIENT-SIDE HELPERS
 * 
 * These functions are safe to use in client components and are optimized
 * for checking user roles and permissions based on the user profile.
 */

/**
 * Check if user has HR admin role
 * 
 * @param profile - User profile from AuthContext
 * @returns true if user is HR admin, false otherwise
 * 
 * @example
 * ```tsx
 * const { profile } = useAuth();
 * if (isHRAdmin(profile)) {
 *   return <AdminPanel />;
 * }
 * ```
 */
export function isHRAdmin(profile: UserProfile | null): boolean {
  return profile?.role === 'hr_admin';
}

/**
 * Check if user is an employee
 * 
 * @param profile - User profile from AuthContext
 * @returns true if user is an employee, false otherwise
 * 
 * @example
 * ```tsx
 * const { profile } = useAuth();
 * if (isEmployee(profile)) {
 *   return <EmployeeDashboard />;
 * }
 * ```
 */
export function isEmployee(profile: UserProfile | null): boolean {
  return profile?.role === 'employee';
}

/**
 * Check if user has a specific permission
 * 
 * @param profile - User profile from AuthContext
 * @param permission - Permission to check for
 * @returns true if user has the permission, false otherwise
 * 
 * @example
 * ```tsx
 * import { PERMISSIONS } from '@/lib/types/roles';
 * const { profile } = useAuth();
 * if (hasUserPermission(profile, PERMISSIONS.LEAVE_APPROVE)) {
 *   return <ApproveButton />;
 * }
 * ```
 */
export function hasUserPermission(
  profile: UserProfile | null,
  permission: Permission
): boolean {
  if (!profile) {
    return false;
  }
  
  return hasPermission(profile.role, permission);
}

/**
 * Check if user has any of the specified permissions
 * 
 * @param profile - User profile from AuthContext
 * @param permissions - Array of permissions to check for
 * @returns true if user has at least one permission, false otherwise
 */
export function hasUserAnyPermission(
  profile: UserProfile | null,
  permissions: Permission[]
): boolean {
  if (!profile) {
    return false;
  }
  
  return hasAnyPermission(profile.role, permissions);
}

/**
 * Check if user has all of the specified permissions
 * 
 * @param profile - User profile from AuthContext
 * @param permissions - Array of permissions to check for
 * @returns true if user has all permissions, false otherwise
 */
export function hasUserAllPermissions(
  profile: UserProfile | null,
  permissions: Permission[]
): boolean {
  if (!profile) {
    return false;
  }
  
  return hasAllPermissions(profile.role, permissions);
}

/**
 * Check if user is active
 * 
 * @param profile - User profile from AuthContext
 * @returns true if user profile exists (active), false otherwise
 * 
 * Note: is_active is not in the minimal profile type, but exists in DB.
 * You may need to fetch full user data for this check.
 */
export function isActiveUser(profile: UserProfile | null): boolean {
  return profile !== null;
}

/**
 * Get user's shift hours
 * 
 * @param profile - User profile from AuthContext
 * @returns Shift hours object with start and end, or null if profile is missing
 */
export function getShiftHours(profile: UserProfile | null): {
  start: number;
  end: number;
} | null {
  if (!profile) return null;
  
  return {
    start: profile.shift_start_hour,
    end: profile.shift_end_hour,
  };
}

/**
 * Format user's full name
 * 
 * @param profile - User profile from AuthContext
 * @returns Formatted display name (full_name > username > email > 'Guest')
 */
export function getUserDisplayName(profile: UserProfile | null): string {
  if (!profile) return 'Guest';
  return profile.full_name || profile.username || profile.email;
}

/**
 * Get user initials for avatar
 * 
 * @param profile - User profile from AuthContext
 * @returns User initials (e.g., "John Doe" -> "JD") or "?" if no name
 */
export function getUserInitials(profile: UserProfile | null): string {
  if (!profile?.full_name) return '?';
  
  const names = profile.full_name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * SERVER-SIDE HELPERS
 * 
 * Server-side helpers are now in lib/auth/server.ts
 * 
 * Import them in your Server Actions like this:
 * ```ts
 * 'use server';
 * import { requireAuth, requireHRAdmin, requireEmployee } from '@/lib/auth/server';
 * ```
 */

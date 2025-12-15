import type { UserProfile } from './AuthContext';

/**
 * Check if user has HR admin role
 */
export function isHRAdmin(profile: UserProfile | null): boolean {
  return profile?.role === 'hr_admin';
}

/**
 * Check if user is an employee
 */
export function isEmployee(profile: UserProfile | null): boolean {
  return profile?.role === 'employee';
}

/**
 * Check if user is active
 */
export function isActiveUser(profile: UserProfile | null): boolean {
  // Note: is_active is not in the minimal profile type, but exists in DB
  // You may need to fetch full user data for this check
  return profile !== null;
}

/**
 * Get user's shift hours
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
 */
export function getUserDisplayName(profile: UserProfile | null): string {
  if (!profile) return 'Guest';
  return profile.full_name || profile.username || profile.email;
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(profile: UserProfile | null): string {
  if (!profile?.full_name) return '?';
  
  const names = profile.full_name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}


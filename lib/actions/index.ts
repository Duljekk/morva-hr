/**
 * Main entry point for all server actions
 * 
 * Re-exports all actions organized by access level:
 * - shared: Actions accessible by both employees and HR
 * - employee: Actions accessible only to employees
 * - hr: Actions accessible only to HR admins
 * 
 * Usage:
 * ```ts
 * import { checkIn } from '@/lib/actions';
 * import { submitLeaveRequest } from '@/lib/actions';
 * import { getHRDashboardStats } from '@/lib/actions';
 * ```
 */

export * from './shared';
export * from './employee';
export * from './hr';

// Legacy exports (kept for backward compatibility)
export * from './auth';
export * from './pushNotifications';































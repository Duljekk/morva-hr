/**
 * Role Types & Permissions System
 * 
 * Centralized type definitions and permission system for role-based access control.
 * This module consolidates all role-related types and provides a type-safe
 * permission checking system.
 * 
 * Best Practices:
 * - Single source of truth for UserRole type
 * - Type-safe permission checking
 * - Clear separation between roles and permissions
 * - Extensible permission system
 */

/**
 * User roles in the system
 * 
 * - employee: Standard employee with access to own data
 * - hr_admin: HR administrator with access to all data
 */
export type UserRole = 'employee' | 'hr_admin';

/**
 * Permission identifiers
 * 
 * Following the pattern: resource:action
 * This makes permissions self-documenting and easy to understand
 */
export const PERMISSIONS = {
  // Attendance permissions
  ATTENDANCE_VIEW_OWN: 'attendance:view_own',
  ATTENDANCE_CREATE_OWN: 'attendance:create_own',
  ATTENDANCE_VIEW_ALL: 'attendance:view_all',
  
  // Leave permissions
  LEAVE_VIEW_OWN: 'leave:view_own',
  LEAVE_CREATE_OWN: 'leave:create_own',
  LEAVE_CANCEL_OWN: 'leave:cancel_own',
  LEAVE_VIEW_ALL: 'leave:view_all',
  LEAVE_APPROVE: 'leave:approve',
  LEAVE_REJECT: 'leave:reject',
  
  // Notification permissions
  NOTIFICATION_VIEW_OWN: 'notification:view_own',
  NOTIFICATION_MARK_READ_OWN: 'notification:mark_read_own',
  NOTIFICATION_CREATE: 'notification:create',
  
  // Announcement permissions
  ANNOUNCEMENT_VIEW: 'announcement:view',
  ANNOUNCEMENT_CREATE: 'announcement:create',
  ANNOUNCEMENT_UPDATE: 'announcement:update',
  ANNOUNCEMENT_DELETE: 'announcement:delete',
  
  // Payslip permissions
  PAYSLIP_VIEW_OWN: 'payslip:view_own',
  PAYSLIP_VIEW_ALL: 'payslip:view_all',
  PAYSLIP_CREATE: 'payslip:create',
  PAYSLIP_UPDATE: 'payslip:update',
  
  // User permissions
  USER_VIEW_OWN: 'user:view_own',
  USER_UPDATE_OWN: 'user:update_own',
  USER_VIEW_ALL: 'user:view_all',
  USER_UPDATE_ALL: 'user:update_all',
  
  // Dashboard permissions
  DASHBOARD_VIEW_OWN: 'dashboard:view_own',
  DASHBOARD_VIEW_HR: 'dashboard:view_hr',
} as const;

/**
 * Permission type - all possible permission values
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Role permissions mapping
 * 
 * Defines which permissions each role has.
 * HR admins inherit all employee permissions plus additional admin permissions.
 */
export interface RolePermissions {
  /** List of permissions granted to this role */
  permissions: Permission[];
  /** Whether this role can access HR routes */
  canAccessHRRoutes: boolean;
  /** Whether this role can access employee routes */
  canAccessEmployeeRoutes: boolean;
}

/**
 * Permission mapping for each role
 * 
 * This is the single source of truth for role-based permissions.
 * When adding new permissions, update this mapping.
 */
export const rolePermissions: Record<UserRole, RolePermissions> = {
  employee: {
    permissions: [
      // Attendance
      PERMISSIONS.ATTENDANCE_VIEW_OWN,
      PERMISSIONS.ATTENDANCE_CREATE_OWN,
      
      // Leave
      PERMISSIONS.LEAVE_VIEW_OWN,
      PERMISSIONS.LEAVE_CREATE_OWN,
      PERMISSIONS.LEAVE_CANCEL_OWN,
      
      // Notifications
      PERMISSIONS.NOTIFICATION_VIEW_OWN,
      PERMISSIONS.NOTIFICATION_MARK_READ_OWN,
      
      // Announcements
      PERMISSIONS.ANNOUNCEMENT_VIEW,
      
      // Payslips
      PERMISSIONS.PAYSLIP_VIEW_OWN,
      
      // User
      PERMISSIONS.USER_VIEW_OWN,
      PERMISSIONS.USER_UPDATE_OWN,
      
      // Dashboard
      PERMISSIONS.DASHBOARD_VIEW_OWN,
    ],
    canAccessHRRoutes: false,
    canAccessEmployeeRoutes: true,
  },
  
  hr_admin: {
    permissions: [
      // All employee permissions
      PERMISSIONS.ATTENDANCE_VIEW_OWN,
      PERMISSIONS.ATTENDANCE_CREATE_OWN,
      PERMISSIONS.ATTENDANCE_VIEW_ALL,
      
      PERMISSIONS.LEAVE_VIEW_OWN,
      PERMISSIONS.LEAVE_CREATE_OWN,
      PERMISSIONS.LEAVE_CANCEL_OWN,
      PERMISSIONS.LEAVE_VIEW_ALL,
      PERMISSIONS.LEAVE_APPROVE,
      PERMISSIONS.LEAVE_REJECT,
      
      PERMISSIONS.NOTIFICATION_VIEW_OWN,
      PERMISSIONS.NOTIFICATION_MARK_READ_OWN,
      PERMISSIONS.NOTIFICATION_CREATE,
      
      PERMISSIONS.ANNOUNCEMENT_VIEW,
      PERMISSIONS.ANNOUNCEMENT_CREATE,
      PERMISSIONS.ANNOUNCEMENT_UPDATE,
      PERMISSIONS.ANNOUNCEMENT_DELETE,
      
      PERMISSIONS.PAYSLIP_VIEW_OWN,
      PERMISSIONS.PAYSLIP_VIEW_ALL,
      PERMISSIONS.PAYSLIP_CREATE,
      PERMISSIONS.PAYSLIP_UPDATE,
      
      PERMISSIONS.USER_VIEW_OWN,
      PERMISSIONS.USER_UPDATE_OWN,
      PERMISSIONS.USER_VIEW_ALL,
      PERMISSIONS.USER_UPDATE_ALL,
      
      PERMISSIONS.DASHBOARD_VIEW_OWN,
      PERMISSIONS.DASHBOARD_VIEW_HR,
    ],
    canAccessHRRoutes: true,
    canAccessEmployeeRoutes: true,
  },
};

/**
 * Check if a role has a specific permission
 * 
 * @param role - User role to check
 * @param permission - Permission to check for
 * @returns true if the role has the permission, false otherwise
 * 
 * @example
 * ```ts
 * hasPermission('hr_admin', PERMISSIONS.LEAVE_APPROVE) // true
 * hasPermission('employee', PERMISSIONS.LEAVE_APPROVE) // false
 * ```
 */
export function hasPermission(role: UserRole | null, permission: Permission): boolean {
  if (!role) {
    return false;
  }
  
  const permissions = rolePermissions[role];
  if (!permissions) {
    return false;
  }
  
  return permissions.permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 * 
 * @param role - User role to check
 * @param permissions - Array of permissions to check for
 * @returns true if the role has at least one of the permissions, false otherwise
 * 
 * @example
 * ```ts
 * hasAnyPermission('hr_admin', [PERMISSIONS.LEAVE_APPROVE, PERMISSIONS.LEAVE_REJECT]) // true
 * ```
 */
export function hasAnyPermission(role: UserRole | null, permissions: Permission[]): boolean {
  if (!role) {
    return false;
  }
  
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 * 
 * @param role - User role to check
 * @param permissions - Array of permissions to check for
 * @returns true if the role has all of the permissions, false otherwise
 * 
 * @example
 * ```ts
 * hasAllPermissions('hr_admin', [PERMISSIONS.LEAVE_APPROVE, PERMISSIONS.LEAVE_REJECT]) // true
 * ```
 */
export function hasAllPermissions(role: UserRole | null, permissions: Permission[]): boolean {
  if (!role) {
    return false;
  }
  
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 * 
 * @param role - User role
 * @returns Array of permissions for the role, or empty array if role is invalid
 */
export function getRolePermissions(role: UserRole | null): Permission[] {
  if (!role) {
    return [];
  }
  
  const permissions = rolePermissions[role];
  return permissions?.permissions || [];
}

/**
 * Check if a role can access HR routes
 * 
 * @param role - User role to check
 * @returns true if the role can access HR routes, false otherwise
 */
export function canAccessHRRoutes(role: UserRole | null): boolean {
  if (!role) {
    return false;
  }
  
  const permissions = rolePermissions[role];
  return permissions?.canAccessHRRoutes || false;
}

/**
 * Check if a role can access employee routes
 * 
 * @param role - User role to check
 * @returns true if the role can access employee routes, false otherwise
 */
export function canAccessEmployeeRoutes(role: UserRole | null): boolean {
  if (!role) {
    return false;
  }
  
  const permissions = rolePermissions[role];
  return permissions?.canAccessEmployeeRoutes || false;
}































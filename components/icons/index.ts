/**
 * Central Icon Exports
 * 
 * This file provides centralized exports for all icon components.
 * Icons are organized by category: shared, hr, and employee.
 * 
 * Usage:
 * ```tsx
 * import { SearchIcon, DashboardIcon } from '@/components/icons';
 * ```
 */

// ============================================================================
// Shared Icons - Used across multiple contexts
// ============================================================================

export { default as SearchIcon } from './shared/Search';
export type { SearchIconProps } from './shared/Search';

export { default as CommandIcon } from './shared/Command';
export type { CommandIconProps } from './shared/Command';

export { default as SidebarIcon } from './shared/Sidebar';
export type { SidebarIconProps } from './shared/Sidebar';

export { default as SettingsIcon } from './shared/Settings';
export type { SettingsIconProps } from './shared/Settings';

export { default as LogoutIcon } from './shared/Logout';
export type { LogoutIconProps } from './shared/Logout';

// ============================================================================
// HR Icons - HR-specific icons
// ============================================================================

export { default as DashboardIcon } from './hr/Dashboard';
export type { DashboardIconProps } from './hr/Dashboard';

export { default as AttendanceIcon } from './hr/Attendance';
export type { AttendanceIconProps } from './hr/Attendance';

export { default as EmployeesIcon } from './hr/Employees';
export type { EmployeesIconProps } from './hr/Employees';

export { default as AnnouncementsIcon } from './hr/Announcements';
export type { AnnouncementsIconProps } from './hr/Announcements';

export { default as LeaveRequestsIcon } from './hr/LeaveRequests';
export type { LeaveRequestsIconProps } from './hr/LeaveRequests';

export { default as PayrollIcon } from './hr/Payroll';
export type { PayrollIconProps } from './hr/Payroll';

// ============================================================================
// Employee Icons - Employee-specific icons
// ============================================================================
// (To be added as employee icons are migrated)

// ============================================================================
// Type Exports - All icon prop types
// ============================================================================

/**
 * Union type of all available icon names for use with IconRegistry
 * 
 * @see IconRegistry for lazy loading support
 */
export type IconName =
  // Shared icons
  | 'SearchIcon'
  | 'CommandIcon'
  | 'SidebarIcon'
  | 'SettingsIcon'
  | 'LogoutIcon'
  // HR icons
  | 'DashboardIcon'
  | 'AttendanceIcon'
  | 'EmployeesIcon'
  | 'AnnouncementsIcon'
  | 'LeaveRequestsIcon'
  | 'PayrollIcon';

// ============================================================================
// Icon Registry - Lazy loading support
// ============================================================================

export {
  IconRegistry,
  useIcon,
  getAvailableIconNames,
  isIconName,
  type IconRegistryProps,
} from './IconRegistry';



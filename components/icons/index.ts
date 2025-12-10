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

export { default as BellIcon } from './shared/Bell';
export type { BellIconProps } from './shared/Bell';

export { default as ReceiptIcon } from './shared/Receipt';
export type { ReceiptIconProps } from './shared/Receipt';

export { default as CircleCheckIcon } from './shared/CircleCheck';
export type { CircleCheckIconProps } from './shared/CircleCheck';

export { default as CircleCrossIcon } from './shared/CircleCross';
export type { CircleCrossIconProps } from './shared/CircleCross';

export { default as TriangleWarningIcon } from './shared/TriangleWarning';
export type { TriangleWarningIconProps } from './shared/TriangleWarning';

export { default as ClockIcon } from './shared/Clock';
export type { ClockIconProps } from './shared/Clock';

export { default as Clock18Icon } from './shared/Clock18';
export type { Clock18IconProps } from './shared/Clock18';

export { default as CheckInIcon } from './shared/CheckInIcon';
export type { CheckInIconProps } from './shared/CheckInIcon';

export { default as CheckoutIcon } from './shared/CheckoutIcon';
export type { CheckoutIconProps } from './shared/CheckoutIcon';

export { default as CheckIcon } from './shared/Check';
export type { CheckIconProps } from './shared/Check';

export { default as MinusIcon } from './shared/Minus';
export type { MinusIconProps } from './shared/Minus';

export { default as CrossIcon } from './shared/Cross';
export type { CrossIconProps } from './shared/Cross';

export { default as CalendarIcon } from './shared/Calendar';
export type { CalendarIconProps } from './shared/Calendar';

export { default as CalendarOutlineIcon } from './shared/CalendarOutline';
export type { CalendarOutlineIconProps } from './shared/CalendarOutline';

export { default as InfoCircleIcon } from './shared/InfoCircle';
export type { InfoCircleIconProps } from './shared/InfoCircle';

export { default as CopyIcon } from './shared/Copy';
export type { CopyIconProps } from './shared/Copy';

export { default as ChevronDownIcon } from './shared/ChevronDown';
export type { ChevronDownIconProps } from './shared/ChevronDown';

export { default as ArrowUpDownIcon } from './shared/ArrowUpDown';
export type { ArrowUpDownIconProps } from './shared/ArrowUpDown';

export { default as ArrowUpRightIcon } from './shared/ArrowUpRight';
export type { ArrowUpRightIconProps } from './shared/ArrowUpRight';

export { default as CirclePlusIcon } from './shared/CirclePlus';
export type { CirclePlusIconProps } from './shared/CirclePlus';

export { default as FilterIcon } from './shared/Filter';
export type { FilterIconProps } from './shared/Filter';

export { default as HourglassIcon } from './shared/HourglassIcon';
export type { HourglassIconProps } from './shared/HourglassIcon';

// Icons from shared/Icons.tsx (direct exports)
export { GrabberIcon, DotGrid1x3HorizontalIcon } from '../shared/Icons';

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
  | 'BellIcon'
  | 'ReceiptIcon'
  | 'CircleCheckIcon'
  | 'CircleCrossIcon'
  | 'TriangleWarningIcon'
  | 'ClockIcon'
  | 'Clock18Icon'
  | 'CheckInIcon'
  | 'CheckoutIcon'
  | 'CheckIcon'
  | 'MinusIcon'
  | 'CrossIcon'
  | 'CalendarIcon'
  | 'CalendarOutlineIcon'
  | 'InfoCircleIcon'
  | 'CopyIcon'
  | 'ChevronDownIcon'
  | 'ArrowUpDownIcon'
  | 'ArrowUpRightIcon'
  | 'CirclePlusIcon'
  | 'FilterIcon'
  | 'HourglassIcon'
  | 'GrabberIcon'
  | 'DotGrid1x3HorizontalIcon'
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



'use client';

import { lazy, Suspense, type ComponentType, type SVGProps } from 'react';
import type { IconName } from './index';

/**
 * Icon Registry Component
 * 
 * Provides lazy-loaded icon components for code-splitting and performance optimization.
 * Icons are loaded on-demand, reducing initial bundle size.
 * 
 * Usage:
 * ```tsx
 * import { IconRegistry } from '@/components/icons/IconRegistry';
 * 
 * <IconRegistry name="DashboardIcon" className="w-4 h-4" />
 * ```
 * 
 * For better performance with frequently used icons, import directly:
 * ```tsx
 * import { DashboardIcon } from '@/components/icons';
 * ```
 */

// Lazy load all icon components
const iconComponents: Record<IconName, () => Promise<{ default: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }> }>> = {
  // Shared icons
  SearchIcon: () => import('./shared/Search'),
  CommandIcon: () => import('./shared/Command'),
  SidebarIcon: () => import('./shared/Sidebar'),
  SettingsIcon: () => import('./shared/Settings'),
  LogoutIcon: () => import('./shared/Logout'),
  BellIcon: () => import('./shared/Bell'),
  ReceiptIcon: () => import('./shared/Receipt'),
  CircleCheckIcon: () => import('./shared/CircleCheck'),
  TriangleWarningIcon: () => import('./shared/TriangleWarning'),
  ClockIcon: () => import('./shared/Clock'),
  Clock18Icon: () => import('./shared/Clock18'),
  ClockOutlineIcon: () => import('./shared/ClockOutline'),
  CheckInIcon: () => import('./shared/CheckInIcon'),
  CheckoutIcon: () => import('./shared/CheckoutIcon'),
  CheckIcon: () => import('./shared/Check'),
  MinusIcon: () => import('./shared/Minus'),
  CrossIcon: () => import('./shared/Cross'),
  CalendarIcon: () => import('./shared/Calendar'),
  CalendarOutlineIcon: () => import('./shared/CalendarOutline'),
  CalendarClockIcon: () => import('./shared/CalendarClock'),
  InfoCircleIcon: () => import('./shared/InfoCircle'),
  BubbleInfoIcon: () => import('./shared/BubbleInfo'),
  CopyIcon: () => import('./shared/Copy'),
  CircleCrossIcon: () => import('./shared/CircleCross'),
  ArrowUpRightIcon: () => import('./shared/ArrowUpRight'),
  ChevronDownIcon: () => import('./shared/ChevronDown'),
  ChevronRightIcon: () => import('./shared/ChevronRight'),
  ArrowUpDownIcon: () => import('./shared/ArrowUpDown'),
  CirclePlusIcon: () => import('./shared/CirclePlus'),
  FilterIcon: () => import('./shared/Filter'),
  GrabberIcon: () => import('../shared/Icons').then(m => ({ default: m.GrabberIcon })),
  DotGrid1x3HorizontalIcon: () => import('../shared/Icons').then(m => ({ default: m.DotGrid1x3HorizontalIcon })),
  HourglassIcon: () => import('./shared/HourglassIcon'),
  MailIcon: () => import('./shared/Mail'),
  AtIcon: () => import('./shared/At'),
  LockIcon: () => import('./shared/Lock'),
  EyeOpenIcon: () => import('./shared/EyeOpen'),
  EyeClosedIcon: () => import('./shared/EyeClosed'),
  PeopleIcon: () => import('./shared/People'),
  HomeIcon: () => import('./shared/Home'),
  BuildingIcon: () => import('./shared/Building'),
  CoffeeIcon: () => import('./shared/Coffee'),
  TimerIcon: () => import('./shared/Timer'),
  LinkIcon: () => import('./shared/Link'),
  EditIcon: () => import('./shared/Edit'),
  TrashIcon: () => import('./shared/Trash'),
  
  // HR icons
  DashboardIcon: () => import('./hr/Dashboard'),
  AttendanceIcon: () => import('./hr/Attendance'),
  EmployeesIcon: () => import('./hr/Employees'),
  AnnouncementsIcon: () => import('./hr/Announcements'),
  LeaveRequestsIcon: () => import('./hr/LeaveRequests'),
  PayrollIcon: () => import('./hr/Payroll'),
  
  // Employee Floating Navbar icons
  EmployeeHomeIcon: () => import('./employee/HomeIcon'),
  EmployeeAttendanceIcon: () => import('./employee/AttendanceIcon'),
  EmployeePayslipIcon: () => import('./employee/PayslipIcon'),
  EmployeeProfileIcon: () => import('./employee/ProfileIcon'),
};

// Create lazy-loaded components
const lazyIcons = Object.entries(iconComponents).reduce(
  (acc, [name, importFn]) => {
    acc[name as IconName] = lazy(importFn);
    return acc;
  },
  {} as Record<IconName, ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>>
);

/**
 * Loading placeholder for lazy-loaded icons
 */
function IconLoadingPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`inline-block bg-neutral-200 animate-pulse rounded ${className || 'w-4 h-4'}`}
      aria-hidden="true"
    />
  );
}

/**
 * Icon Registry Props
 */
export interface IconRegistryProps extends SVGProps<SVGSVGElement> {
  /**
   * Name of the icon to render
   */
  name: IconName;
  
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Icon Registry Component
 * 
 * Renders an icon component by name with lazy loading support.
 * Use this for icons that are conditionally rendered or rarely used.
 * 
 * For frequently used icons, import directly from '@/components/icons' for better performance.
 * 
 * @example
 * ```tsx
 * // Lazy loaded (good for conditional rendering)
 * <IconRegistry name="DashboardIcon" className="w-4 h-4 text-neutral-600" />
 * 
 * // Direct import (better for always-visible icons)
 * import { DashboardIcon } from '@/components/icons';
 * <DashboardIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
export function IconRegistry({
  name,
  size = 16,
  className = '',
  ...props
}: IconRegistryProps) {
  const LazyIcon = lazyIcons[name];

  if (!LazyIcon) {
    console.warn(`Icon "${name}" not found in IconRegistry`);
    return (
      <div
        className={`inline-block bg-red-200 ${className || 'w-4 h-4'}`}
        aria-label={`Icon ${name} not found`}
      />
    );
  }

  return (
    <Suspense fallback={<IconLoadingPlaceholder className={className} />}>
      <LazyIcon size={size} className={className} {...props} />
    </Suspense>
  );
}

/**
 * Hook to get a lazy-loaded icon component
 * 
 * @example
 * ```tsx
 * const DashboardIcon = useIcon('DashboardIcon');
 * return <DashboardIcon className="w-4 h-4" />;
 * ```
 */
export function useIcon(name: IconName) {
  const LazyIcon = lazyIcons[name];
  
  if (!LazyIcon) {
    console.warn(`Icon "${name}" not found in IconRegistry`);
    return () => (
      <div
        className="inline-block bg-red-200 w-4 h-4"
        aria-label={`Icon ${name} not found`}
      />
    );
  }

  return (props: SVGProps<SVGSVGElement> & { size?: number | string }) => (
    <Suspense fallback={<IconLoadingPlaceholder className={props.className} />}>
      <LazyIcon {...props} />
    </Suspense>
  );
}

/**
 * Get all available icon names
 * 
 * Useful for type checking or generating icon lists
 */
export function getAvailableIconNames(): IconName[] {
  return Object.keys(iconComponents) as IconName[];
}

/**
 * Check if an icon name exists in the registry
 */
export function isIconName(name: string): name is IconName {
  return name in iconComponents;
}

export default IconRegistry;





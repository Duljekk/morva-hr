import { ReactNode } from 'react';
import { BellIcon, CalendarIcon, CheckInIcon } from '@/components/shared/Icons';

// Document icon for payslips
const DocumentIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Route metadata interface
 * Defines the structure for navigation routes
 */
export interface RouteConfig {
  path: string;
  label: string;
  icon?: ReactNode;
  permissions?: string[];
  exact?: boolean;
}

/**
 * Employee routes configuration
 * Routes accessible to employees
 */
export const employeeRoutes: RouteConfig[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <CheckInIcon className="w-5 h-5" />,
    exact: true,
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: <BellIcon className="w-5 h-5" />,
  },
  {
    path: '/request-leave',
    label: 'Request Leave',
    icon: <CalendarIcon className="w-5 h-5" />,
  },
];

/**
 * HR routes configuration
 * Routes accessible to HR admins
 */
export const hrRoutes: RouteConfig[] = [
  {
    path: '/hr',
    label: 'Dashboard',
    icon: <CheckInIcon className="w-5 h-5" />,
    exact: true,
    permissions: ['hr_admin'],
  },
  {
    path: '/hr/leaves',
    label: 'Leave Requests',
    icon: <CalendarIcon className="w-5 h-5" />,
    permissions: ['hr_admin'],
  },
  {
    path: '/hr/payslips',
    label: 'Payslips',
    icon: <DocumentIcon className="w-5 h-5" />,
    permissions: ['hr_admin'],
  },
];

/**
 * Get routes for a specific role
 * @param role - User role ('employee' | 'hr_admin')
 * @returns Array of route configurations for the role
 */
export function getRoutesForRole(role: 'employee' | 'hr_admin'): RouteConfig[] {
  if (role === 'hr_admin') {
    return hrRoutes;
  }
  return employeeRoutes;
}

/**
 * Check if a route is active
 * @param routePath - Route path to check
 * @param currentPath - Current pathname
 * @param exact - Whether to match exactly
 * @returns True if route is active
 */
export function isRouteActive(
  routePath: string,
  currentPath: string,
  exact?: boolean
): boolean {
  if (exact) {
    return routePath === currentPath;
  }
  return currentPath.startsWith(routePath);
}


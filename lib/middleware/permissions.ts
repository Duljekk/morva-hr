/**
 * Route Permission System for Middleware
 * 
 * Defines route groups and their required permissions
 * Used by middleware to enforce access control
 */

import type { UserRole } from '@/lib/types/roles';

export interface RoutePermission {
  /** Route pattern (supports wildcards) */
  pattern: string | RegExp;
  /** Required role(s) - empty array means any authenticated user */
  requiredRoles: UserRole[];
  /** Whether route is public (no auth required) */
  isPublic?: boolean;
}

/**
 * Route group definitions
 * Route groups in Next.js don't appear in URLs, so we check the actual pathname
 */
export const ROUTE_GROUPS = {
  /** Employee routes - accessible at root level (/, /notifications, /request-leave) */
  EMPLOYEE: {
    patterns: [
      /^\/$/, // Root/home page
      /^\/notifications(\/.*)?$/, // Notifications
      /^\/request-leave(\/.*)?$/, // Request leave
    ],
    requiredRoles: ['employee', 'hr_admin'], // HR admins can also access employee routes
  },
  /** Admin routes - accessible at /admin, /admin/leaves, /admin/payslips */
  ADMIN: {
    patterns: [
      /^\/admin(\/.*)?$/, // All /admin routes
    ],
    requiredRoles: ['hr_admin'], // Only HR admins
  },
  /** Auth routes - accessible at /login and /signup */
  AUTH: {
    patterns: [
      /^\/login(\/.*)?$/, // Login page
      /^\/signup(\/.*)?$/, // Signup page
    ],
    isPublic: true, // Public route
  },
  /** Test routes - accessible for component testing */
  TEST: {
    patterns: [
      /^\/.*-test(\/.*)?$/, // All routes ending with -test (e.g., /table-header-test, /dropdown-test)
    ],
    isPublic: true, // Public route
  },
} as const;

/**
 * Check if a pathname matches a route group pattern
 */
export function getRouteGroup(pathname: string): keyof typeof ROUTE_GROUPS | null {
  for (const [groupName, config] of Object.entries(ROUTE_GROUPS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(pathname)) {
        return groupName as keyof typeof ROUTE_GROUPS;
      }
    }
  }
  // Check for legacy /hr routes and map to ADMIN
  if (/^\/hr(\/.*)?$/.test(pathname)) {
    return 'ADMIN';
  }
  return null;
}

/**
 * Check if a user role has permission to access a route group
 */
export function hasRoutePermission(
  userRole: UserRole | null,
  routeGroup: keyof typeof ROUTE_GROUPS | null
): boolean {
  // Public routes (auth and test routes) are accessible to everyone
  if (routeGroup === 'AUTH' || routeGroup === 'TEST') {
    return true;
  }
  
  // Map old HR route group name to ADMIN for backward compatibility
  if ((routeGroup as any) === 'HR') {
    routeGroup = 'ADMIN';
  }

  // No route group means it's not a protected route
  if (!routeGroup) {
    return true;
  }

  // Unauthenticated users cannot access protected routes
  if (!userRole) {
    return false;
  }

  const routeConfig = ROUTE_GROUPS[routeGroup];
  
  // Check if user role is in required roles
  // Only check if requiredRoles exists (public routes don't have this property)
  if (!routeConfig.requiredRoles) {
    return true;
  }
  
  return routeConfig.requiredRoles.includes(userRole as any);
}

/**
 * Get the default redirect path for a user role
 */
export function getDefaultRedirectPath(userRole: UserRole | null): string {
  if (userRole === 'hr_admin') {
    return '/admin';
  }
  return '/';
}

/**
 * Check if a pathname is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  const routeGroup = getRouteGroup(pathname);
  if (routeGroup === 'AUTH' || routeGroup === 'TEST') {
    return true;
  }
  return false;
}

/**
 * Check if a pathname requires authentication
 */
export function requiresAuthentication(pathname: string): boolean {
  return !isPublicRoute(pathname);
}


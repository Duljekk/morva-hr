import type { UserRole } from '@/lib/types/roles';

export type RouteGroup = 'EMPLOYEE' | 'ADMIN' | 'AUTH';

interface RouteGroupConfig {
  patterns: RegExp[];
  requiredRoles: UserRole[];
  isPublic?: boolean;
}

export const ROUTE_GROUPS: Record<RouteGroup, RouteGroupConfig> = {
  EMPLOYEE: {
    // Employee routes are at root level: /, /notifications, /request-leave
    // Patterns match exact routes or routes starting with these paths
    patterns: [
      /^\/$/,  // Root dashboard
      /^\/notifications(\/|$)/,  // Notifications page
      /^\/request-leave(\/|$)/,  // Request leave page
    ],
    requiredRoles: ['employee', 'hr_admin'],
    isPublic: false,
  },
  ADMIN: {
    patterns: [/^\/admin/],
    requiredRoles: ['hr_admin'],
    isPublic: false,
  },
  AUTH: {
    patterns: [/^\/(login|signup)/],
    requiredRoles: [],
    isPublic: true,
  },
};

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup'];

// Routes that require authentication
// Employee routes: /, /notifications, /request-leave
// Admin routes: /admin/*
const PROTECTED_ROUTE_PATTERNS = [
  /^\/$/,  // Root (employee dashboard)
  /^\/notifications/,  // Employee notifications
  /^\/request-leave/,  // Employee leave requests
  /^\/admin/,  // Admin routes
];

export function getRouteGroup(pathname: string): RouteGroup | null {
  for (const [group, config] of Object.entries(ROUTE_GROUPS)) {
    if (config.patterns.some(pattern => pattern.test(pathname))) {
      return group as RouteGroup;
    }
  }
  return null;
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

export function requiresAuthentication(pathname: string): boolean {
  return PROTECTED_ROUTE_PATTERNS.some(pattern => pattern.test(pathname));
}

export function hasRoutePermission(userRole: UserRole | null, routeGroup: RouteGroup): boolean {
  if (!userRole) {
    return false;
  }
  
  const config = ROUTE_GROUPS[routeGroup];
  if (!config) {
    return false;
  }
  
  // Public routes are accessible to all authenticated users
  if (config.isPublic) {
    return true;
  }
  
  // Check if user role is in required roles
  return config.requiredRoles.includes(userRole);
}

export function getDefaultRedirectPath(userRole: UserRole | null): string {
  if (!userRole) {
    return '/login';
  }
  
  switch (userRole) {
    case 'hr_admin':
      return '/admin';
    case 'employee':
      // Employee dashboard is at root (/), not /employee
      return '/';
    default:
      return '/login';
  }
}



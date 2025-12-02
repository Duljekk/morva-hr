'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getRoutesForRole, isRouteActive, type RouteConfig } from '@/lib/navigation/routes';
import EmployeeNav from '@/components/employee/EmployeeNav';
import HRNav from '@/components/hr/HRNav';

/**
 * Role-aware navigation component
 * Renders the appropriate navigation based on user role
 * 
 * Following Next.js best practices:
 * - Uses usePathname for client-side route detection
 * - Conditionally renders role-specific navigation
 * - Handles loading and unauthenticated states
 */
export default function Navigation() {
  const { profile, loading } = useAuth();
  const pathname = usePathname();

  // Show nothing while loading or if not authenticated
  if (loading || !profile) {
    return null;
  }

  // Render role-specific navigation
  if (profile.role === 'hr_admin') {
    return <HRNav currentPath={pathname} />;
  }

  return <EmployeeNav currentPath={pathname} />;
}













'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import HomeIcon from '@/components/icons/employee/HomeIcon';
import CalendarIcon from '@/components/icons/shared/Calendar';
import PayslipIcon from '@/components/icons/employee/PayslipIcon';
import ProfileIcon from '@/components/icons/employee/ProfileIcon';

/**
 * Navigation item configuration for the floating navbar
 */
interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; active?: boolean }>;
  exact?: boolean;
}

/**
 * Floating navbar navigation routes
 * Defines the four main navigation items: Home, Attendance, Payslip, Profile
 */
const floatingNavRoutes: NavItem[] = [
  { path: '/', label: 'Home', icon: HomeIcon, exact: true },
  { path: '/attendance', label: 'Attendance', icon: CalendarIcon },
  { path: '/payslip', label: 'Payslip', icon: PayslipIcon },
  { path: '/profile', label: 'Profile', icon: ProfileIcon },
];

/**
 * Check if a route is active based on current path
 * @param routePath - Route path to check
 * @param currentPath - Current pathname
 * @param exact - Whether to match exactly
 * @returns True if route is active
 */
function isRouteActive(
  routePath: string,
  currentPath: string,
  exact?: boolean
): boolean {
  if (exact) {
    return routePath === currentPath;
  }
  return currentPath.startsWith(routePath);
}

export interface FloatingNavbarProps {
  /** Optional override for current path (useful for testing) */
  currentPath?: string;
}

/**
 * Floating Navigation Bar Component for Employee App
 *
 * A modern, pill-shaped floating navigation bar that provides navigation
 * to four key sections: Home, Attendance, Payslip, and Profile.
 *
 * Features:
 * - Pill-shaped container with dark background (neutral-900)
 * - Fixed position at bottom center of viewport with gradient fade
 * - 40x40px touch targets with 24x24px icons
 * - Active state indication (white icon for current route)
 * - Accessible navigation with proper ARIA attributes
 * - Safe area padding for devices with home indicators
 *
 * @example
 * ```tsx
 * <FloatingNavbar />
 * ```
 */
const FloatingNavbar = memo(function FloatingNavbar({
  currentPath,
}: FloatingNavbarProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
      aria-label="Main navigation"
    >
      {/* Progressive blur background - multiple layers with increasing blur intensity */}
      <div className="relative w-full h-[94px] flex items-start justify-center px-6">
        {/* Layer 1: Lightest blur at top */}
        <div 
          className="absolute inset-0 backdrop-blur-[1px]"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 25%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 25%)',
          }}
        />
        {/* Layer 2: Light blur */}
        <div 
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0) 50%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0) 50%)',
          }}
        />
        {/* Layer 3: Medium blur */}
        <div 
          className="absolute inset-0 backdrop-blur-[4px]"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 75%)',
          }}
        />
        {/* Layer 4: Strong blur near bottom */}
        <div 
          className="absolute inset-0 backdrop-blur-[8px]"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0) 100%)',
          }}
        />
        {/* Layer 5: Strongest blur at bottom */}
        <div 
          className="absolute inset-0 backdrop-blur-[12px]"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,1) 100%)',
          }}
        />
        {/* Linear gradient overlay matching Figma spec */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.00) 0%, rgba(10, 10, 10, 0.06) 100%)',
          }}
        />
        {/* Pill-shaped navbar: bg-neutral-900, rounded-[60px], p-2 (8px), gap-3 (12px) */}
        <div className="relative flex items-center gap-3 bg-neutral-900 rounded-[60px] p-2 pointer-events-auto">
          {floatingNavRoutes.map((route) => {
            const isActive = isRouteActive(route.path, activePath, route.exact);
            const IconComponent = route.icon;

            return (
              <Link
                key={route.path}
                href={route.path}
                className="flex items-center justify-center w-10 h-10"
                aria-label={route.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent size={24} active={isActive} />
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area spacer for devices with home indicators */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-transparent" />
    </nav>
  );
});

FloatingNavbar.displayName = 'FloatingNavbar';

export default FloatingNavbar;

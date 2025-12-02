'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import SearchBar from '@/components/shared/SearchBar';
import SidebarMenuItem from '@/components/shared/SidebarMenuItem';
import type { HRWeather } from '@/lib/weather/hrWeather';

// Lazy load WeatherWidget for better initial page load performance
const WeatherWidget = dynamic(
  () => import('@/components/hr/WeatherWidget'),
  {
    ssr: false, // Weather widget fetches client-side data
    loading: () => (
      <div className="content-stretch flex h-[32px] w-[115px] items-center">
        <div className="h-[28px] w-[28px] bg-neutral-200 rounded-[10px] animate-pulse shrink-0" />
        <div className="box-border flex shrink-0 items-start gap-[2px] px-[8px] py-0 leading-[18px]">
          <div className="h-[18px] w-[60px] bg-neutral-200 rounded-[4px] animate-pulse" />
        </div>
      </div>
    ),
  }
);
import {
  SidebarIcon,
  DashboardIcon,
  AttendanceIcon,
  EmployeesIcon,
  AnnouncementsIcon,
  LeaveRequestsIcon,
  PayrollIcon,
  SettingsIcon,
  LogoutIcon,
} from '@/components/icons';

/**
 * HR Sidebar Component
 * 
 * Sidebar navigation for HR dashboard with:
 * - Logo and branding
 * - Search bar
 * - Navigation menu items
 * - Settings at bottom
 * 
 * Design specifications from Figma:
 * - Width: 275px
 * - Padding: 14px horizontal, 24px vertical
 * - Background: neutral-50
 * - Gap between sections: 12px
 * - Gap between menu items: 18px
 */
interface HRSidebarProps {
  weather?: HRWeather | null;
}

export default function HRSidebar({ weather }: HRSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Menu items configuration
  const menuItems = [
    {
      text: 'Dashboard',
      href: '/hr',
      icon: <DashboardIcon className="w-4 h-4" />,
    },
    {
      text: 'Attendance',
      href: '/hr/attendance',
      icon: <AttendanceIcon className="w-4 h-4" />,
    },
    {
      text: 'Employees',
      href: '/hr/employees',
      icon: <EmployeesIcon className="w-4 h-4" />,
    },
    {
      text: 'Announcements',
      href: '/hr/announcements',
      icon: <AnnouncementsIcon className="w-4 h-4" />,
    },
    {
      text: 'Leave Requests',
      href: '/hr/leaves',
      icon: <LeaveRequestsIcon className="w-4 h-4" />,
    },
    {
      text: 'Payroll',
      href: '/hr/payslips',
      icon: <PayrollIcon className="w-4 h-4" />,
    },
  ];

  // Check if a route is active
  const isRouteActive = (href: string) => {
    if (href === '/hr') {
      return pathname === '/hr' || pathname === '/hr/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="box-border flex flex-col gap-[12px] items-start justify-center px-[14px] pt-[18px] pb-[16px] relative h-screen w-[275px] bg-neutral-50">
      {/* Top Section: Weather widget, Toggle, and Search */}
      <div className="flex flex-col gap-[8px] items-end relative shrink-0 w-full">
        {/* Weather widget placeholder and Toggle Button */}
        <div className="box-border flex items-center justify-between px-[4px] py-0 relative shrink-0 w-full">
          {/* Weather widget (replaces logotype) */}
          <div className="flex gap-[8px] items-center relative shrink-0">
            <WeatherWidget weather={weather} />
          </div>
          
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="box-border flex gap-[10px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="overflow-clip relative rounded-[5px] shrink-0 size-[20px]">
              <SidebarIcon className="w-5 h-5 text-neutral-600" />
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <SearchBar placeholder="Search" />
        </div>
      </div>

      {/* Menu Items Section - Flex grow to push Settings to bottom */}
      <div className="basis-0 flex flex-col grow items-start justify-between min-h-px min-w-px relative shrink-0 w-full">
        {/* Top Menu Items - No gap, just stacked */}
        <div className="flex flex-col items-start relative shrink-0 w-full">
          {menuItems.map((item) => {
            const isActive = isRouteActive(item.href);
            return (
              <SidebarMenuItem
                key={item.href}
                text={item.text}
                icon={item.icon}
                href={item.href}
                isActive={isActive}
              />
            );
          })}
        </div>

        {/* Settings and Logout at Bottom - Separated from other menu items */}
        <div className="w-full mt-auto flex flex-col gap-[8px]">
          <SidebarMenuItem
            text="Settings"
            icon={<SettingsIcon className="w-4 h-4" />}
            href="/hr/settings"
            isActive={pathname === '/hr/settings'}
          />
          {/* Figma-styled Logout button */}
          <button
            type="button"
            className="bg-[rgba(64,64,64,0.05)] box-border flex h-[36px] w-[247px] items-center justify-center rounded-[8px] px-[20px] py-[6px] text-neutral-600 text-sm font-medium leading-[18px] hover:bg-[rgba(64,64,64,0.08)] transition-colors"
            onClick={async () => {
              try {
                await signOut();
                // Delay to ensure server-side cookies are fully cleared before redirect
                await new Promise(resolve => setTimeout(resolve, 300));
                window.location.replace('/login');
              } catch (error) {
                console.error('Error during logout:', error);
                // Delay even on error to ensure cookies are cleared
                await new Promise(resolve => setTimeout(resolve, 300));
                // Force redirect even on error
                window.location.replace('/login');
              }
            }}
          >
            <span className="flex items-center gap-[6px]">
              <LogoutIcon className="w-4 h-4 text-neutral-600 -mt-[1px]" />
              <span className="whitespace-pre">Log Out</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}


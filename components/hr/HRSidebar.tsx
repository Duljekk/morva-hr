'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import LogotypeIcon from '@/app/assets/icons/logotype.svg';
import SidebarIcon from '@/app/assets/icons/sidebar.svg';
import SearchBar from '@/components/shared/SearchBar';
import SidebarMenuItem from '@/components/shared/SidebarMenuItem';
import DashboardIcon from '@/app/assets/icons/dashboard.svg';
import AttendanceIcon from '@/app/assets/icons/attendance.svg';
import EmployeesIcon from '@/app/assets/icons/employees.svg';
import AnnouncementsIcon from '@/app/assets/icons/announcements.svg';
import LeaveRequestsIcon from '@/app/assets/icons/leave-requests.svg';
import PayrollIcon from '@/app/assets/icons/payroll.svg';
import SettingsIcon from '@/app/assets/icons/gear.svg';

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
export default function HRSidebar() {
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
    <div className="box-border flex flex-col gap-[12px] items-start justify-center px-[14px] py-[24px] relative h-screen w-[275px] bg-neutral-50">
      {/* Top Section: Logo, Toggle, and Search */}
      <div className="flex flex-col gap-[18px] items-end relative shrink-0 w-full">
        {/* Logo and Toggle Button */}
        <div className="box-border flex items-center justify-between px-[4px] py-0 relative shrink-0 w-full">
          {/* Logo */}
          <div className="flex gap-[8px] items-center relative shrink-0">
            <LogotypeIcon className="h-8 w-auto" />
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
        <div className="w-full mt-auto flex flex-col gap-0">
          <SidebarMenuItem
            text="Settings"
            icon={<SettingsIcon className="w-4 h-4" />}
            href="/hr/settings"
            isActive={pathname === '/hr/settings'}
          />
          <SidebarMenuItem
            text="Logout"
            icon={
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
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
          />
        </div>
      </div>
    </div>
  );
}


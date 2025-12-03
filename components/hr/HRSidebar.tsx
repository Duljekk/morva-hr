'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isCollapsed, setIsCollapsed] = useState(false); // Start expanded
  const [isWeatherHovered, setIsWeatherHovered] = useState(false);

  // Reset hover state when sidebar expands
  useEffect(() => {
    if (!isCollapsed) {
      setIsWeatherHovered(false);
    }
  }, [isCollapsed]);

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

  // Sidebar width: 64px when collapsed (14px padding * 2 + 36px item), 275px when expanded
  const sidebarWidth = isCollapsed ? 64 : 275;

  return (
    <motion.div
      className="box-border flex flex-col gap-[12px] items-start justify-center px-[14px] pt-[18px] pb-[16px] relative h-screen bg-neutral-50"
      initial={{
        width: 275, // Start with expanded width
      }}
      animate={{
        width: sidebarWidth,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      {/* Top Section: Weather widget, Toggle, and Search */}
      <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
        {/* Weather widget and Toggle Button */}
        <div 
          className={`box-border flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative shrink-0 w-full ${!isCollapsed ? 'py-[2px]' : ''}`}
          onMouseLeave={() => setIsWeatherHovered(false)}
        >
          {/* Weather widget - Shows sidebar icon on hover when collapsed */}
          <div className={`flex ${isCollapsed ? '' : 'gap-[8px]'} items-center relative shrink-0 pl-[4px]`}>
            <AnimatePresence mode="wait">
              {isCollapsed && isWeatherHovered ? (
                <motion.button
                  key="sidebar-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                  }}
                  onClick={() => {
                    setIsCollapsed(false);
                    setIsWeatherHovered(false);
                  }}
                  className="box-border flex items-center justify-center overflow-clip px-[10px] py-[4px] relative rounded-[8px] size-[36px] hover:bg-neutral-100"
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                >
                  <div className="relative shrink-0 size-[20px] flex items-center justify-center">
                    <SidebarIcon className="w-5 h-5 text-neutral-600" />
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="weather-widget"
                  initial={false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  <WeatherWidget 
                    weather={weather} 
                    collapsed={isCollapsed}
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                        setIsWeatherHovered(false);
                      }
                    }}
                    onHover={setIsWeatherHovered}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Sidebar Toggle Button - Only show when expanded */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="box-border flex gap-[10px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100"
                aria-label="Collapse sidebar"
              >
                <div className="overflow-clip relative rounded-[5px] shrink-0 size-[20px]">
                  <SidebarIcon className="w-5 h-5 text-neutral-600" />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar */}
        <div className="w-full flex justify-center">
          <SearchBar placeholder="Search" collapsed={isCollapsed} />
        </div>
      </div>

      {/* Menu Items Section - Flex grow to push Settings to bottom */}
      <div className="basis-0 flex flex-col grow items-start justify-between min-h-px min-w-px relative shrink-0 w-full">
        {/* Top Menu Items - No gap, just stacked */}
        <motion.div 
          className="flex flex-col items-start relative shrink-0 w-full"
          variants={{
            expanded: {
              transition: {
                staggerChildren: 0.03,
                delayChildren: 0.05,
              },
            },
            collapsed: {
              transition: {
                staggerChildren: 0.02,
                staggerDirection: -1,
              },
            },
          }}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
        >
          {menuItems.map((item, index) => {
            const isActive = isRouteActive(item.href);
            return (
              <motion.div
                key={item.href}
                variants={{
                  expanded: {
                    opacity: 1,
                    x: 0,
                  },
                  collapsed: {
                    opacity: 1,
                    x: 0,
                  },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <SidebarMenuItem
                  text={item.text}
                  icon={item.icon}
                  href={item.href}
                  isActive={isActive}
                  collapsed={isCollapsed}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Settings and Logout at Bottom - Separated from other menu items */}
        <div className={`w-full mt-auto flex flex-col ${isCollapsed ? 'gap-0' : 'gap-[8px]'} items-start`}>
          <SidebarMenuItem
            text="Settings"
            icon={<SettingsIcon className="w-4 h-4" />}
            href="/hr/settings"
            isActive={pathname === '/hr/settings'}
            collapsed={isCollapsed}
          />
          {/* Logout button - Animated transition like sidebar menu items */}
          <motion.button
            layout
            type="button"
            initial={false}
            animate={{
              width: isCollapsed ? 36 : 247,
              justifyContent: isCollapsed ? 'center' : 'center',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className={`
              box-border flex h-[36px] items-center overflow-hidden
              px-[10px] py-[4px] relative rounded-[8px]
              bg-[rgba(64,64,64,0.05)] hover:bg-[rgba(64,64,64,0.08)]
              transition-colors duration-200
              ${isCollapsed ? 'mt-[8px]' : ''}
            `}
            onClick={async () => {
              try {
                await signOut();
                await new Promise(resolve => setTimeout(resolve, 300));
                window.location.replace('/login');
              } catch (error) {
                console.error('Error during logout:', error);
                await new Promise(resolve => setTimeout(resolve, 300));
                window.location.replace('/login');
              }
            }}
            aria-label="Log out"
            title={isCollapsed ? 'Log out' : undefined}
          >
            {/* Icon - Always visible */}
            <motion.div
              layout
              className="relative shrink-0 size-[16px] flex items-center justify-center"
              animate={{
                marginTop: isCollapsed ? 0 : '-1px',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <LogoutIcon className={`w-4 h-4 ${isCollapsed ? 'text-neutral-500' : 'text-neutral-600'}`} />
            </motion.div>

            {/* Text - Disappears when collapsed */}
            <AnimatePresence mode="wait" initial={false}>
              {!isCollapsed && (
                <motion.span
                  key="logout-text"
                  initial={false}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="flex items-center gap-[6px] overflow-hidden"
                >
                  <div className="px-[6px] h-[18px] flex items-center">
                    <span className="whitespace-pre text-neutral-600 text-sm font-medium leading-[18px]">Log Out</span>
                  </div>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}


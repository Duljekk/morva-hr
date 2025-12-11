import type { Metadata } from "next";
import HRSidebar from "@/components/hr/HRSidebar";
import { getHRWeather } from "@/lib/weather/hrWeather";

export const metadata: Metadata = {
  title: "HR Dashboard | MorvaHR",
  description: "HR dashboard for MorvaHR",
};

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

/**
 * HR Layout Component
 * 
 * Shared layout for all HR routes that provides:
 * - Sidebar navigation (persistent across all HR pages)
 * - Main content area wrapper
 * - Weather data fetching for sidebar
 * 
 * This layout ensures consistent structure across all Admin pages:
 * - /admin (dashboard)
 * - /admin/employees
 * - /admin/attendance
 * - /admin/announcements
 * - /admin/leaves
 * - /admin/payslips
 * 
 * Benefits:
 * - Single source of truth for sidebar structure
 * - Better performance (layout doesn't re-render on navigation)
 * - Consistent UI across all HR pages
 * - Eliminates code duplication
 */
export default async function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch weather data server-side for the sidebar
  // This is shared across all HR pages
  let weather = null;
  try {
    weather = await getHRWeather();
  } catch (error) {
    console.error('[HRLayout] Error fetching weather:', error);
    // Continue without weather data - sidebar handles null gracefully
  }

  return (
    <div className="bg-neutral-50 flex items-start relative h-screen w-full">
      {/* Sidebar - Persistent across all HR pages */}
      <HRSidebar weather={weather} />

      {/* Main Content Area - Wraps all HR page content */}
      <div className="box-border flex flex-col gap-[10px] h-screen items-start px-0 py-[16px] relative shrink-0 flex-1">
        <div className="basis-0 bg-white grow min-h-px min-w-px rounded-bl-[16px] rounded-tl-[16px] shadow-[-1px_0px_2px_0px_rgba(229,229,229,0.75),0px_0px_0px_1px_#e5e5e5] shrink-0 w-full overflow-y-auto">
          {/* Page Content - Each page renders its own content here */}
          {children}
        </div>
      </div>
    </div>
  );
}

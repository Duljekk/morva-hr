'use server';

import dynamic from 'next/dynamic';
import HRSidebar from '@/components/hr/HRSidebar';
import { getHRWeather } from '@/lib/weather/hrWeather';
import HRDashboardHeader from '@/components/hr/dashboard/HRDashboardHeader';

// Import skeleton components directly (they're client components but can be imported in server components)
import AttendanceFeedSkeleton from '@/components/hr/dashboard/AttendanceFeedSkeleton';
import LeaveRequestSectionSkeleton from '@/components/hr/dashboard/LeaveRequestSectionSkeleton';
import RecentActivitiesSkeleton from '@/components/hr/dashboard/RecentActivitiesSkeleton';

// Lazy load dashboard widgets for better initial page load performance
// These widgets are client components that fetch data client-side
// Note: We can't use ssr: false in Server Components, but since these are client components,
// they will only render on the client side anyway
const AttendanceFeedClient = dynamic(
  () => import('@/components/hr/dashboard/AttendanceFeedClient'),
  {
    loading: () => <AttendanceFeedSkeleton />,
  }
);

const LeaveRequestSectionClient = dynamic(
  () => import('@/components/hr/dashboard/LeaveRequestSectionClient'),
  {
    loading: () => <LeaveRequestSectionSkeleton />,
  }
);

const RecentActivitiesCard = dynamic(
  () => import('@/components/hr/dashboard/RecentActivitiesCard'),
  {
    loading: () => <RecentActivitiesSkeleton />,
  }
);

/**
 * HR Dashboard Page
 *
 * Main dashboard page for HR admins with sidebar navigation.
 * 
 * Layout:
 * - Sidebar (275px) on the left
 * - Main content area on the right with header and dashboard widgets
 *
 * Route: /hr
 * Note: The 'hr' folder name creates the URL segment, while (hr) route group
 * provides organization and shared layout without affecting the URL.
 */
export default async function HRDashboard() {
  const weather = await getHRWeather();

  console.log('[HRDashboard] Weather for sidebar:', weather);

  return (
    <div className="bg-neutral-50 flex items-start relative h-screen w-full">
      {/* Sidebar */}
      <HRSidebar weather={weather} />

      {/* Main Content Area */}
      <div className="box-border flex flex-col gap-[10px] h-screen items-start px-0 py-[16px] relative shrink-0 flex-1">
        <div className="basis-0 bg-white grow min-h-px min-w-px rounded-bl-[16px] rounded-tl-[16px] shadow-[-1px_0px_2px_0px_rgba(229,229,229,0.75),0px_0px_0px_1px_#e5e5e5] shrink-0 w-full overflow-y-auto">
          {/* Dashboard Container - Matching Figma layout */}
          <div className="bg-white box-border content-stretch flex flex-col gap-[40px] items-center justify-center overflow-clip pb-[210px] pt-[140px] px-[142px] relative rounded-bl-[16px] rounded-tl-[16px] size-full" data-name="Dashboard" data-node-id="428:2646">
            {/* Dashboard Header */}
            <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-full" data-name="Header" data-node-id="428:2647">
              <HRDashboardHeader />
            </div>
            
            {/* Main dashboard content */}
            <div className="content-stretch flex flex-col lg:flex-row gap-[24px] items-start relative shrink-0" data-name="Contents" data-node-id="428:2661">
              {/* Attendance Feed - Left column */}
              <div className="w-full lg:w-[420px] lg:shrink-0" data-name="Attendance Feed" data-node-id="428:2662">
                <AttendanceFeedClient />
              </div>

              {/* Leave Request + Recent Activities - Right column */}
              <div className="content-stretch flex flex-col gap-[20px] items-start relative self-stretch w-full lg:w-[437px] lg:shrink-0" data-name="Leave Request + Recent Activities" data-node-id="428:2761">
                {/* Leave Request Section */}
                <div className="shrink-0 w-full" data-name="Leave Request" data-node-id="428:2762">
                  <LeaveRequestSectionClient />
                </div>

                {/* Recent Activities Card */}
                <div className="shrink-0 w-full" data-name="Recent Activities" data-node-id="428:2808">
                  <RecentActivitiesCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

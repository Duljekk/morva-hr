'use server';

import dynamic from 'next/dynamic';
// Note: Sidebar is now handled by the HR layout (app/(hr)/layout.tsx)
// Weather data is fetched in the layout, not here
import HRDashboardHeader from '@/components/hr/dashboard/HRDashboardHeader';
import { getAttendanceFeedCount, getRecentActivitiesCount } from '@/lib/actions/hr/dashboard';
import { getPendingLeaveRequestsCount } from '@/lib/actions/hr/leaves';

// Import skeleton components directly (they're client components but can be imported in server components)
import AttendanceFeedSkeleton from '@/components/hr/dashboard/AttendanceFeedSkeleton';
import LeaveRequestSectionSkeleton from '@/components/hr/dashboard/LeaveRequestSectionSkeleton';
import RecentActivitiesSkeleton from '@/components/hr/dashboard/RecentActivitiesSkeleton';

// Lazy load dashboard widgets for better initial page load performance
// These widgets are client components that fetch data client-side
// Note: We can't use ssr: false in Server Components, but since these are client components,
// they will only render on the client side anyway
// The loading fallback uses default counts, but the actual skeleton shown by the client
// components will use the server-fetched counts passed as props
const AttendanceFeedClient = dynamic(
  () => import('@/components/hr/dashboard/AttendanceFeedClient'),
  {
    loading: () => <AttendanceFeedSkeleton count={10} />, // Brief fallback during bundle load
  }
);

const LeaveRequestSectionClient = dynamic(
  () => import('@/components/hr/dashboard/LeaveRequestSectionClient'),
  {
    loading: () => <LeaveRequestSectionSkeleton count={5} />, // Brief fallback during bundle load
  }
);

const RecentActivitiesClient = dynamic(
  () => import('@/components/hr/dashboard/RecentActivitiesClient'),
  {
    // Match maxItems default (3) for accurate visual feedback
    loading: () => <RecentActivitiesSkeleton count={3} />,
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
 * Route: /admin
 * Note: The 'admin' folder name creates the URL segment, while (admin) route group
 * provides organization and shared layout without affecting the URL.
 */
export default async function HRDashboard() {
  // Best Practice: Wrap server actions in try-catch to handle authentication errors gracefully
  // Server actions that call requireHRAdmin() will throw if user is not authenticated
  // The middleware should handle redirects, but we catch errors here to prevent page crashes
  // Note: Weather data is now fetched in the layout, not here
  let attendanceCount = 10; // Default fallback
  let leaveRequestsCount = 5; // Default fallback
  let recentActivitiesCount = 3; // Default fallback

  try {

    // Fetch counts server-side to pass to skeleton components
    // This ensures skeletons match the exact number of items that will be loaded
    // Best Practice: Use Promise.allSettled to handle partial failures gracefully
    // This prevents one failing request from blocking the entire page
    const [attendanceCountResult, leaveRequestsCountResult, recentActivitiesCountResult] = await Promise.allSettled([
      getAttendanceFeedCount(),
      getPendingLeaveRequestsCount(),
      getRecentActivitiesCount(),
    ]);

    // Extract data from settled promises, handling both success and failure
    if (attendanceCountResult.status === 'fulfilled') {
      attendanceCount = attendanceCountResult.value.data ?? 10;
      if (attendanceCountResult.value.error) {
        console.error('[HRDashboard] Attendance count error:', attendanceCountResult.value.error);
      }
    } else {
      console.error('[HRDashboard] Error fetching attendance count:', attendanceCountResult.reason);
    }

    if (leaveRequestsCountResult.status === 'fulfilled') {
      leaveRequestsCount = leaveRequestsCountResult.value.data ?? 5;
      if (leaveRequestsCountResult.value.error) {
        console.error('[HRDashboard] Leave requests count error:', leaveRequestsCountResult.value.error);
      }
    } else {
      console.error('[HRDashboard] Error fetching leave requests count:', leaveRequestsCountResult.reason);
    }

    if (recentActivitiesCountResult.status === 'fulfilled') {
      // Cap to max 3 items to match the Recent Activities card limit
      recentActivitiesCount = Math.min(recentActivitiesCountResult.value.data ?? 3, 3);
      if (recentActivitiesCountResult.value.error) {
        console.error('[HRDashboard] Recent activities count error:', recentActivitiesCountResult.value.error);
      }
    } else {
      console.error('[HRDashboard] Error fetching recent activities count:', recentActivitiesCountResult.reason);
    }
  } catch (error) {
    // If there's a critical error (e.g., authentication failure), log it
    // The middleware should handle redirects, but we log for debugging
    console.error('[HRDashboard] Critical error:', error);
    // Re-throw to let Next.js error boundary handle it if needed
    // In most cases, the middleware will redirect to login
    throw error;
  }

  console.log('[HRDashboard] Attendance feed count:', attendanceCount);
  console.log('[HRDashboard] Leave requests count:', leaveRequestsCount);
  console.log('[HRDashboard] Recent activities count:', recentActivitiesCount);

  return (
    <>
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
            <AttendanceFeedClient initialCount={attendanceCount} />
          </div>

          {/* Leave Request + Recent Activities - Right column */}
          <div className="content-stretch flex flex-col gap-[20px] items-start relative self-stretch w-full lg:w-[437px] lg:shrink-0" data-name="Leave Request + Recent Activities" data-node-id="428:2761">
            {/* Leave Request Section */}
            <div className="shrink-0 w-full" data-name="Leave Request" data-node-id="428:2762">
              <LeaveRequestSectionClient initialCount={leaveRequestsCount} />
            </div>

            {/* Recent Activities Card */}
            <div className="shrink-0 w-full" data-name="Recent Activities" data-node-id="428:2808">
              <RecentActivitiesClient initialCount={recentActivitiesCount} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

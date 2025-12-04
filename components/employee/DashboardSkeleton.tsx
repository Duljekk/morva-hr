'use client';

import { memo } from 'react';
import CheckInOutWidgetSkeleton from './CheckInOutWidgetSkeleton';
import AttendanceCardSkeleton from './AttendanceCardSkeleton';
import RecentActivitiesSkeleton from './RecentActivitiesSkeleton';

/**
 * DashboardSkeleton Component
 *
 * Complete skeleton loading state for the Employee Dashboard content.
 * Used as Suspense fallback within DashboardShell for PPR.
 *
 * Note: This skeleton renders INSIDE DashboardShell, so it doesn't
 * include the outer shell/layout. The shell is prerendered separately.
 *
 * Layout matches EmployeeDashboardClient:
 * - Header with notification button
 * - Announcement banner area
 * - Check-in widget
 * - Attendance cards (2x)
 * - Recent activities
 */
const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div
        className="flex w-full items-start justify-between animate-pulse"
        data-name="Header Skeleton"
      >
        <div className="flex flex-col gap-1">
          {/* Welcome text */}
          <div className="h-[28px] w-[160px] bg-neutral-200 rounded-[4px]" />
          {/* Date text */}
          <div className="h-[18px] w-[200px] bg-neutral-100 rounded-[4px]" />
        </div>
        {/* Notification button */}
        <div className="h-[40px] w-[40px] bg-neutral-200 rounded-full" />
      </div>

      {/* Main Content Skeleton */}
      <div
        className="flex w-full flex-col gap-[18px] animate-pulse"
        data-name="Content Skeleton"
      >
        {/* Announcement Banner Skeleton */}
        <div className="h-[56px] w-full bg-white rounded-[12px] shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <div className="h-6 w-6 bg-neutral-200 rounded-full shrink-0" />
            <div className="h-[18px] flex-1 bg-neutral-200 rounded-[4px]" />
            <div className="h-5 w-5 bg-neutral-100 rounded-[4px] shrink-0" />
          </div>
        </div>

        {/* Check In/Out Widget Skeleton */}
        <CheckInOutWidgetSkeleton />

        {/* Attendance Cards Skeleton */}
        <div className="flex gap-3 justify-center">
          <AttendanceCardSkeleton showStatus={true} />
          <AttendanceCardSkeleton showStatus={true} />
        </div>

        {/* Recent Activities Skeleton */}
        <RecentActivitiesSkeleton dayCount={3} activitiesPerDay={2} />
      </div>
    </>
  );
});

DashboardSkeleton.displayName = 'DashboardSkeleton';

export default DashboardSkeleton;

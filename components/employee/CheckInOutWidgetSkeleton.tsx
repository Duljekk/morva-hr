'use client';

import { memo } from 'react';

/**
 * CheckInOutWidgetSkeleton Component
 *
 * Skeleton loading state for CheckInOutWidget component.
 * Matches the structure and layout of CheckInOutWidget with animated placeholders.
 *
 * Layout structure:
 * - Main container with gradient background
 * - Clock display area
 * - Shift info section
 * - Action button area
 * - Leave status card area
 */
const CheckInOutWidgetSkeleton = memo(function CheckInOutWidgetSkeleton() {
  return (
    <div
      className="w-full rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 p-5 animate-pulse"
      data-name="Check In Out Widget Skeleton"
    >
      {/* Clock Display */}
      <div className="flex flex-col items-center mb-4">
        {/* Time */}
        <div className="h-[48px] w-[140px] bg-white/20 rounded-[8px] mb-2" />
        {/* Date */}
        <div className="h-[20px] w-[200px] bg-white/15 rounded-[4px]" />
      </div>

      {/* Shift Info */}
      <div className="flex justify-center gap-6 mb-5">
        {/* Shift Start */}
        <div className="flex flex-col items-center">
          <div className="h-[14px] w-[60px] bg-white/15 rounded-[4px] mb-1" />
          <div className="h-[18px] w-[50px] bg-white/20 rounded-[4px]" />
        </div>
        {/* Divider */}
        <div className="w-[1px] bg-white/20" />
        {/* Shift End */}
        <div className="flex flex-col items-center">
          <div className="h-[14px] w-[60px] bg-white/15 rounded-[4px] mb-1" />
          <div className="h-[18px] w-[50px] bg-white/20 rounded-[4px]" />
        </div>
      </div>

      {/* Action Button */}
      <div className="h-[48px] w-full bg-white/20 rounded-[12px] mb-4" />

      {/* Leave Status Card */}
      <div className="h-[72px] w-full bg-white/10 rounded-[12px]" />
    </div>
  );
});

CheckInOutWidgetSkeleton.displayName = 'CheckInOutWidgetSkeleton';

export default CheckInOutWidgetSkeleton;

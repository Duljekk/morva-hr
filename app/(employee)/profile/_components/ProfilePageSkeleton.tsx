'use client';

/**
 * Profile Page Skeleton Component
 * 
 * Loading skeleton for the profile page.
 * Displays placeholder content while data is being fetched.
 * 
 * Requirements: 7.4
 */

import { memo } from 'react';

const ProfilePageSkeleton = memo(function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-sky-50 px-6 pt-6 pb-12 relative">
        <div className="flex flex-col items-center gap-3 pt-8">
          {/* Avatar skeleton */}
          <div className="w-24 h-24 rounded-full bg-neutral-200 border-4 border-white" />
          {/* Name and role skeleton */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-32 bg-neutral-200 rounded" />
            <div className="h-5 w-20 bg-neutral-200 rounded" />
            <div className="h-4 w-40 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="flex flex-col gap-3 px-6 -mt-4">
        {/* Leave Balances Card Skeleton */}
        <div className="bg-white rounded-[10px] shadow-sm border border-neutral-100 p-4">
          <div className="h-5 w-28 bg-neutral-200 rounded mb-3" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-24 bg-neutral-200 rounded" />
                <div className="h-4 w-16 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests Card Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
          <div className="h-5 w-28 bg-neutral-200 rounded mb-3" />
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-3 ${
                  i < 3 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-24 bg-neutral-200 rounded" />
                  <div className="h-3 w-32 bg-neutral-200 rounded" />
                </div>
                <div className="h-6 w-16 bg-neutral-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ProfilePageSkeleton.displayName = 'ProfilePageSkeleton';

export default ProfilePageSkeleton;

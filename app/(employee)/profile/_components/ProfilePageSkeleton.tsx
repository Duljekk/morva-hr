'use client';

/**
 * Profile Page Skeleton Component
 * 
 * Loading skeleton for the profile page.
 * Displays placeholder content while data is being fetched.
 * 
 * Layout matches ProfilePageClient with max-w-[402px] centered container.
 */

import { memo } from 'react';

const ProfilePageSkeleton = memo(function ProfilePageSkeleton() {
  return (
    <div className="relative min-h-screen w-full bg-white animate-pulse">
      {/* Centered container with max-width matching other employee pages */}
      <div className="mx-auto w-full max-w-[402px] relative">
        {/* Banner Skeleton */}
        <div className="absolute top-0 left-0 right-0 h-[101px] bg-sky-50">
          {/* Settings button skeleton */}
          <div className="absolute top-[12px] right-[12px] w-[30px] h-[30px] rounded-[10px] bg-neutral-200" />
        </div>

        {/* Main content container */}
        <div className="relative flex flex-col gap-[12px] px-6 pt-[54px] pb-[110px]">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col gap-[12px] items-start">
          {/* Avatar skeleton */}
          <div className="w-[96px] h-[96px] rounded-full bg-neutral-200" />
          
          {/* Header content skeleton */}
          <div className="flex flex-col gap-[16px] w-full">
            <div className="flex flex-col gap-[6px] items-start">
              {/* Name + Badge row */}
              <div className="flex items-center gap-[10px]">
                <div className="h-[22px] w-48 bg-neutral-200 rounded" />
                <div className="h-[22px] w-12 bg-neutral-200 rounded-full" />
              </div>
              {/* Email */}
              <div className="flex items-center gap-[4px]">
                <div className="w-[14px] h-[14px] bg-neutral-200 rounded" />
                <div className="h-5 w-40 bg-neutral-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col gap-[20px]">
          {/* Leave Balances Card Skeleton */}
          <div className="bg-white/60 rounded-[10px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)] pt-[18px] pb-[20px] px-[20px]">
            <div className="h-5 w-28 bg-neutral-200 rounded mb-4" />
            <div className="flex flex-col gap-4">
              {/* PTO row skeleton */}
              <div className="flex flex-col gap-[6px]">
                <div className="h-[18px] w-24 bg-neutral-200 rounded" />
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-[6px] h-4 bg-neutral-200 rounded" />
                    ))}
                  </div>
                  <div className="h-5 w-10 bg-neutral-200 rounded-full" />
                </div>
              </div>
              {/* WFH & Sick Leave row skeleton */}
              <div className="flex gap-4">
                {[1, 2].map((j) => (
                  <div key={j} className="flex flex-col gap-[6px]">
                    <div className="h-[18px] w-24 bg-neutral-200 rounded" />
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="w-[6px] h-4 bg-neutral-200 rounded" />
                        ))}
                      </div>
                      <div className="h-5 w-8 bg-neutral-200 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leave Requests Card Skeleton */}
          <div className="bg-white/60 rounded-[12px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)] pt-[18px] pb-[20px] px-[20px]">
            <div className="h-5 w-28 bg-neutral-200 rounded mb-4" />
            <div className="flex flex-col">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-[10px] ${
                    i === 1 ? 'pt-0 pb-[14px]' : i === 3 ? 'pt-[14px] pb-0' : 'py-[14px]'
                  } ${i < 3 ? 'border-b border-neutral-100' : ''}`}
                >
                  {/* Icon skeleton */}
                  <div className="w-[36px] h-[36px] bg-neutral-200 rounded-[9px] shrink-0" />
                  {/* Content skeleton */}
                  <div className="flex flex-1 items-start">
                    <div className="flex flex-1 flex-col gap-[2px]">
                      <div className="h-[18px] w-24 bg-neutral-200 rounded" />
                      <div className="h-4 w-16 bg-neutral-200 rounded" />
                    </div>
                    <div className="h-5 w-16 bg-neutral-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
});

ProfilePageSkeleton.displayName = 'ProfilePageSkeleton';

export default ProfilePageSkeleton;

'use client';

import { memo } from 'react';

/**
 * StatisticWidgetSkeleton - Skeleton for StatisticWidget component
 */
const StatisticWidgetSkeleton = memo(function StatisticWidgetSkeleton() {
    return (
        <div
            className="
        bg-white
        flex flex-col items-start gap-4
        overflow-clip
        pb-[18px] pl-[18px] pr-[28px] pt-[20px]
        relative
        rounded-[14px]
        shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
        flex-1
        animate-pulse
      "
        >
            {/* Header */}
            <div className="flex gap-[6px] items-center">
                <div className="size-[18px] bg-neutral-200 rounded-[4px]" />
                <div className="h-[18px] w-[120px] bg-neutral-200 rounded-[4px]" />
            </div>
            {/* Value */}
            <div className="flex flex-col gap-[6px] px-1">
                <div className="h-[36px] w-[80px] bg-neutral-200 rounded-[4px]" />
                {/* Trend */}
                <div className="flex gap-1 items-center">
                    <div className="size-[12px] bg-neutral-100 rounded-[4px]" />
                    <div className="h-[14px] w-[60px] bg-neutral-100 rounded-[4px]" />
                    <div className="h-[14px] w-[80px] bg-neutral-100 rounded-[4px]" />
                </div>
            </div>
        </div>
    );
});

StatisticWidgetSkeleton.displayName = 'StatisticWidgetSkeleton';

/**
 * ActivityGroupSkeleton - Skeleton for a group of activities
 */
const ActivityGroupSkeleton = memo(function ActivityGroupSkeleton({
    itemCount = 3,
}: {
    itemCount?: number;
}) {
    return (
        <div className="flex flex-col gap-[12px]">
            {/* Group Header */}
            <div className="flex gap-[8px] items-center px-[16px] py-[8px]">
                <div className="h-[14px] w-[80px] bg-neutral-200 rounded-[4px]" />
            </div>
            {/* Activity Items */}
            {Array.from({ length: itemCount }).map((_, index) => (
                <div
                    key={index}
                    className="flex gap-[12px] items-start px-[16px] py-[8px]"
                >
                    {/* Icon skeleton */}
                    <div className="size-[32px] bg-neutral-200 rounded-[8px] shrink-0" />
                    {/* Content */}
                    <div className="flex flex-col gap-[4px] flex-1">
                        <div className="h-[14px] w-[180px] bg-neutral-200 rounded-[4px]" />
                        <div className="h-[12px] w-[120px] bg-neutral-100 rounded-[4px]" />
                    </div>
                    {/* Timestamp */}
                    <div className="h-[12px] w-[40px] bg-neutral-100 rounded-[4px] shrink-0" />
                </div>
            ))}
        </div>
    );
});

ActivityGroupSkeleton.displayName = 'ActivityGroupSkeleton';

export interface EmployeeDetailsRightSkeletonProps {
    /** Additional CSS classes */
    className?: string;
}

/**
 * EmployeeDetailsRightSkeleton Component
 *
 * Skeleton loading state for the right section of the employee details page.
 * Matches the structure of EmployeeDetailsRightSection.
 */
const EmployeeDetailsRightSkeleton = memo(function EmployeeDetailsRightSkeleton({
    className = '',
}: EmployeeDetailsRightSkeletonProps) {
    return (
        <div
            className={`flex flex-col gap-6 ${className}`.trim()}
            aria-busy="true"
            aria-live="polite"
        >
            {/* Statistics Section */}
            <div className="flex gap-4 animate-pulse">
                <StatisticWidgetSkeleton />
                <StatisticWidgetSkeleton />
            </div>

            {/* Activities Panel Skeleton */}
            <div
                className="
          bg-white
          box-border
          flex flex-col
          gap-[16px]
          overflow-clip
          p-[20px]
          relative
          rounded-[16px]
          shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
          animate-pulse
        "
            >
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-[8px] border-b border-neutral-100">
                    <div className="h-[18px] w-[140px] bg-neutral-200 rounded-[4px]" />
                    {/* Tabs skeleton */}
                    <div className="flex gap-[8px]">
                        <div className="h-[28px] w-[80px] bg-neutral-200 rounded-[8px]" />
                        <div className="h-[28px] w-[100px] bg-neutral-100 rounded-[8px]" />
                    </div>
                </div>

                {/* Activity Groups */}
                <ActivityGroupSkeleton itemCount={2} />
                <ActivityGroupSkeleton itemCount={2} />
            </div>
        </div>
    );
});

EmployeeDetailsRightSkeleton.displayName = 'EmployeeDetailsRightSkeleton';

export default EmployeeDetailsRightSkeleton;

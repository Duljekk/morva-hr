'use client';

import { memo } from 'react';

export interface EmployeeTableSkeletonProps {
    /**
     * Number of skeleton rows to display.
     * @default 5
     */
    rows?: number;
}

/**
 * EmployeeTableSkeleton Component
 *
 * Skeleton loading state for the employee table.
 * Matches the structure and column widths of EmployeesTableHeaderRow and EmployeeTableRow.
 *
 * Column widths (synchronized with EmployeesTableHeaderRow):
 * - Checkbox: 48px (fixed)
 * - Name: flex-1 (grow, min 200px)
 * - Employment: 100px (fixed)
 * - Birthdate: 130px (fixed)
 * - Leave Balance: 200px (fixed)
 * - Contract Period: 140px (fixed)
 * - Status: 110px (fixed)
 * - CTA: 60px (fixed)
 */
const EmployeeTableSkeleton = memo(function EmployeeTableSkeleton({
    rows = 5,
}: EmployeeTableSkeletonProps) {
    return (
        <div
            className="content-stretch flex flex-col items-start relative shrink-0 w-full animate-pulse"
            data-name="Employee Table Skeleton"
            aria-busy="true"
            aria-live="polite"
        >
            {/* Skeleton Rows */}
            {Array.from({ length: rows }).map((_, index) => (
                <div
                    key={index}
                    className="border-b border-neutral-200 border-solid flex items-center relative w-full"
                    role="row"
                >
                    {/* Checkbox Column - 48px fixed, centered */}
                    <div className="flex items-center justify-center self-stretch shrink-0 w-[48px]">
                        <div className="size-[16px] bg-neutral-200 rounded-[4px]" />
                    </div>

                    {/* Name Column - flex-1 grow */}
                    <div className="flex grow items-center self-stretch min-w-[200px] py-[16px] px-[8px]">
                        <div className="flex gap-[16px] items-center w-full">
                            {/* Avatar skeleton */}
                            <div className="size-[40px] bg-neutral-200 rounded-full shrink-0" />
                            {/* Name + Email skeleton */}
                            <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                                <div className="h-[14px] w-[140px] bg-neutral-200 rounded-[4px]" />
                                <div className="h-[12px] w-[180px] bg-neutral-100 rounded-[4px]" />
                            </div>
                        </div>
                    </div>

                    {/* Employment Column - 100px fixed */}
                    <div className="flex items-center self-stretch shrink-0 w-[100px] px-[8px]">
                        <div className="h-[20px] w-[60px] bg-neutral-200 rounded-[4px]" />
                    </div>

                    {/* Birthdate Column - 130px fixed */}
                    <div className="flex items-center self-stretch shrink-0 w-[130px] px-[8px]">
                        <div className="h-[14px] w-[100px] bg-neutral-100 rounded-[4px]" />
                    </div>

                    {/* Leave Balance Column - 200px fixed */}
                    <div className="flex items-center self-stretch shrink-0 w-[200px] gap-[8px] px-[8px]">
                        {/* Bars skeleton */}
                        <div className="flex gap-[2px]">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="w-[4px] h-[16px] bg-neutral-200 rounded-[2px]" />
                            ))}
                        </div>
                        {/* Badge skeleton */}
                        <div className="h-[20px] w-[36px] bg-neutral-100 rounded-[32px]" />
                    </div>

                    {/* Contract Period Column - 140px fixed */}
                    <div className="flex items-center self-stretch shrink-0 w-[140px] px-[8px]">
                        <div className="h-[14px] w-[110px] bg-neutral-100 rounded-[4px]" />
                    </div>

                    {/* Status Column - 110px fixed */}
                    <div className="flex items-center self-stretch shrink-0 w-[110px] px-[8px]">
                        <div className="flex gap-[6px] items-center">
                            <div className="size-[6px] bg-neutral-200 rounded-full" />
                            <div className="h-[14px] w-[70px] bg-neutral-100 rounded-[4px]" />
                        </div>
                    </div>

                    {/* CTA Column - 60px fixed */}
                    <div className="flex items-center justify-center self-stretch shrink-0 w-[60px]">
                        <div className="size-[28px] bg-neutral-200 rounded-[8px]" />
                    </div>
                </div>
            ))}
        </div>
    );
});

EmployeeTableSkeleton.displayName = 'EmployeeTableSkeleton';

export default EmployeeTableSkeleton;

import EmployeesTableHeaderRow from '@/components/hr/employees/EmployeesTableHeaderRow';
import EmployeeTableSkeleton from '@/components/hr/employees/EmployeeTableSkeleton';

/**
 * Loading state for the employees page
 * 
 * Displays skeleton loading UI while employee data is being fetched.
 * Uses Next.js automatic Suspense integration via loading.tsx convention.
 */
export default function EmployeesLoading() {
    return (
        <div className="bg-white box-border content-stretch flex flex-col items-start overflow-clip relative size-full">
            {/* Page Header Skeleton */}
            <div className="content-stretch flex border-b border-dashed border-neutral-200 gap-[10px] h-[66px] items-center px-[28px] relative shrink-0 w-full">
                <div className="h-[28px] w-[120px] bg-neutral-200 rounded-[4px] animate-pulse" />
            </div>

            {/* Action Row Skeleton */}
            <div className="content-stretch flex gap-[10px] h-[66px] items-center px-[28px] relative shrink-0 w-full animate-pulse">
                {/* Search skeleton */}
                <div className="h-[36px] w-[240px] bg-neutral-100 rounded-[8px]" />
                {/* Spacer */}
                <div className="flex-1" />
                {/* View toggle skeleton */}
                <div className="h-[36px] w-[80px] bg-neutral-100 rounded-[8px]" />
                {/* Sort skeleton */}
                <div className="h-[36px] w-[120px] bg-neutral-100 rounded-[8px]" />
                {/* Filter skeleton */}
                <div className="h-[36px] w-[100px] bg-neutral-100 rounded-[8px]" />
            </div>

            {/* Table Header Row */}
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <EmployeesTableHeaderRow />
            </div>

            {/* Table Skeleton */}
            <EmployeeTableSkeleton rows={8} />
        </div>
    );
}

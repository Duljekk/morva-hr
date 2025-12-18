/**
 * Loading state for the employee details page
 * 
 * Displays skeleton loading UI while employee data is being fetched.
 * Uses Next.js automatic Suspense integration via loading.tsx convention.
 */
export default function EmployeeDetailsLoading() {
    return (
        <div className="flex flex-col size-full animate-pulse">
            {/* Header with Breadcrumb Skeleton */}
            <div className="h-[66px] w-full border-b border-dashed border-[#e5e5e5] shrink-0">
                <div className="flex items-center h-full px-[28px] gap-[8px]">
                    <div className="h-[16px] w-[16px] bg-neutral-200 rounded-[4px]" />
                    <div className="h-[16px] w-[80px] bg-neutral-200 rounded-[4px]" />
                    <div className="h-[16px] w-[16px] bg-neutral-100 rounded-[4px]" />
                    <div className="h-[16px] w-[150px] bg-neutral-200 rounded-[4px]" />
                </div>
            </div>

            {/* Main Contents Skeleton */}
            <div className="flex-1 min-h-0">
                <div className="flex gap-[28px] px-[100px] pt-[40px] pb-[40px]">
                    {/* Left Section Skeleton */}
                    <div className="flex-1 min-w-0">
                        <div
                            className="
                bg-white
                flex flex-col
                overflow-clip
                relative
                rounded-[20px]
                shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
                w-full
              "
                        >
                            {/* Banner */}
                            <div className="bg-[#f0f9ff] h-[75px] w-full relative" />

                            {/* Section Contents */}
                            <div className="flex flex-col gap-[14px] items-start px-[28px] pb-[28px] pt-0 w-full -mt-[39px]">
                                {/* Profile Image Skeleton */}
                                <div className="border-[2.5px] border-solid border-white rounded-full overflow-hidden shrink-0 size-[80px] bg-neutral-200" />

                                {/* Name + Badge Skeleton */}
                                <div className="flex flex-col gap-[8px] w-full">
                                    <div className="flex gap-[10px] items-center">
                                        <div className="h-[24px] w-[200px] bg-neutral-200 rounded-[4px]" />
                                        <div className="h-[20px] w-[60px] bg-neutral-100 rounded-[4px]" />
                                    </div>
                                    <div className="h-[16px] w-[180px] bg-neutral-100 rounded-[4px]" />
                                </div>

                                {/* Info Rows Skeleton */}
                                <div className="flex flex-col gap-[14px] w-full pt-[10px]">
                                    <div className="flex gap-[14px]">
                                        <div className="flex-1 flex flex-col gap-[4px]">
                                            <div className="h-[14px] w-[60px] bg-neutral-100 rounded-[4px]" />
                                            <div className="h-[18px] w-[120px] bg-neutral-200 rounded-[4px]" />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-[4px]">
                                            <div className="h-[14px] w-[40px] bg-neutral-100 rounded-[4px]" />
                                            <div className="h-[18px] w-[100px] bg-neutral-200 rounded-[4px]" />
                                        </div>
                                    </div>
                                    <div className="flex gap-[14px]">
                                        <div className="flex-1 flex flex-col gap-[4px]">
                                            <div className="h-[14px] w-[80px] bg-neutral-100 rounded-[4px]" />
                                            <div className="h-[18px] w-[90px] bg-neutral-200 rounded-[4px]" />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-[4px]">
                                            <div className="h-[14px] w-[100px] bg-neutral-100 rounded-[4px]" />
                                            <div className="h-[18px] w-[130px] bg-neutral-200 rounded-[4px]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Details Card Skeleton */}
                                <div className="w-full bg-neutral-50 rounded-[12px] p-[16px] mt-[6px]">
                                    <div className="flex flex-col gap-[12px]">
                                        <div className="h-[16px] w-[120px] bg-neutral-200 rounded-[4px]" />
                                        <div className="flex flex-col gap-[8px]">
                                            <div className="h-[14px] w-[160px] bg-neutral-100 rounded-[4px]" />
                                            <div className="h-[14px] w-[140px] bg-neutral-100 rounded-[4px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section Skeleton */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-6">
                            {/* Statistic Widgets Skeleton */}
                            <div className="flex gap-4">
                                {[0, 1].map((i) => (
                                    <div
                                        key={i}
                                        className="
                      bg-white
                      flex flex-col items-start gap-4
                      overflow-clip
                      pb-[18px] pl-[18px] pr-[28px] pt-[20px]
                      relative
                      rounded-[14px]
                      shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
                      flex-1
                    "
                                    >
                                        <div className="flex gap-[6px] items-center">
                                            <div className="size-[18px] bg-neutral-200 rounded-[4px]" />
                                            <div className="h-[18px] w-[120px] bg-neutral-200 rounded-[4px]" />
                                        </div>
                                        <div className="flex flex-col gap-[6px] px-1">
                                            <div className="h-[36px] w-[80px] bg-neutral-200 rounded-[4px]" />
                                            <div className="flex gap-1 items-center">
                                                <div className="size-[12px] bg-neutral-100 rounded-[4px]" />
                                                <div className="h-[14px] w-[60px] bg-neutral-100 rounded-[4px]" />
                                                <div className="h-[14px] w-[80px] bg-neutral-100 rounded-[4px]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                "
                            >
                                {/* Panel Header */}
                                <div className="flex items-center justify-between pb-[8px] border-b border-neutral-100">
                                    <div className="h-[18px] w-[140px] bg-neutral-200 rounded-[4px]" />
                                    <div className="flex gap-[8px]">
                                        <div className="h-[28px] w-[80px] bg-neutral-200 rounded-[8px]" />
                                        <div className="h-[28px] w-[100px] bg-neutral-100 rounded-[8px]" />
                                    </div>
                                </div>

                                {/* Activity Groups */}
                                {[0, 1].map((groupIndex) => (
                                    <div key={groupIndex} className="flex flex-col gap-[12px]">
                                        <div className="flex gap-[8px] items-center px-[16px] py-[8px]">
                                            <div className="h-[14px] w-[80px] bg-neutral-200 rounded-[4px]" />
                                        </div>
                                        {[0, 1].map((itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className="flex gap-[12px] items-start px-[16px] py-[8px]"
                                            >
                                                <div className="size-[32px] bg-neutral-200 rounded-[8px] shrink-0" />
                                                <div className="flex flex-col gap-[4px] flex-1">
                                                    <div className="h-[14px] w-[180px] bg-neutral-200 rounded-[4px]" />
                                                    <div className="h-[12px] w-[120px] bg-neutral-100 rounded-[4px]" />
                                                </div>
                                                <div className="h-[12px] w-[40px] bg-neutral-100 rounded-[4px] shrink-0" />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { memo } from 'react';
import LeaveHistoryItem, { type LeaveHistoryItemData } from './LeaveHistoryItem';

export interface LeaveRequestHistorySectionProps {
    /**
     * Array of leave history items
     */
    items: LeaveHistoryItemData[];

    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Leave Request History Section Component
 *
 * Displays a list of past leave requests with their status.
 * Based on Figma design node 689-1566.
 *
 * @example
 * ```tsx
 * <LeaveRequestHistorySection
 *   items={[
 *     { id: '1', leaveType: 'Annual Leave', startDate: '2025-11-25', endDate: '2025-11-26', reason: 'Family vacation', status: 'approved' },
 *     { id: '2', leaveType: 'Sick Leave', startDate: '2025-11-20', endDate: '2025-11-20', reason: 'Flu', status: 'approved' },
 *   ]}
 * />
 * ```
 */
const LeaveRequestHistorySection = memo(function LeaveRequestHistorySection({
    items,
    className = '',
}: LeaveRequestHistorySectionProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div
            className={`flex flex-col gap-[12px] items-start w-full ${className}`}
            data-name="Leave Request History"
            data-node-id="689:1566"
        >
            {/* Title */}
            <div className="flex items-center" data-name="Title" data-node-id="689:1567">
                <p
                    className="font-sans font-medium leading-[20px] text-[#525252] text-[16px] text-nowrap"
                    data-node-id="689:1568"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                >
                    History
                </p>
            </div>

            {/* Container */}
            <div
                className="bg-white/60 flex flex-col items-start overflow-clip p-[12px] rounded-[12px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)] w-full"
                data-name="Container"
                data-node-id="689:1569"
            >
                {items.map((item, index) => (
                    <LeaveHistoryItem
                        key={item.id}
                        {...item}
                        isFirst={index === 0}
                        isLast={index === items.length - 1}
                        isAlone={items.length === 1}
                    />
                ))}
            </div>
        </div>
    );
});

LeaveRequestHistorySection.displayName = 'LeaveRequestHistorySection';

export default LeaveRequestHistorySection;

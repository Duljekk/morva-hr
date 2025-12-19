'use client';

import { memo, useMemo } from 'react';
import LeaveIllustration, { type LeaveVariant } from '../LeaveIllustration';
import UnifiedBadge, { type UnifiedBadgeColor } from '@/components/shared/UnifiedBadge';

export interface LeaveHistoryItemData {
    /**
     * Leave request ID
     */
    id: string;

    /**
     * Leave type name (e.g., "Annual Leave", "Sick Leave")
     */
    leaveType: string;

    /**
     * Start date in YYYY-MM-DD format
     */
    startDate: string;

    /**
     * End date in YYYY-MM-DD format
     */
    endDate: string;

    /**
     * Leave reason
     */
    reason?: string;

    /**
     * Leave request status
     */
    status: 'approved' | 'rejected';
}

interface LeaveHistoryItemProps extends LeaveHistoryItemData {
    /**
     * Whether this is the first item in the list
     */
    isFirst?: boolean;

    /**
     * Whether this is the last item in the list
     */
    isLast?: boolean;

    /**
     * Whether this is the only item in the list
     */
    isAlone?: boolean;
}

/**
 * Map leave type string to LeaveIllustration variant
 */
function getLeaveVariant(leaveType: string): LeaveVariant {
    const normalizedType = leaveType.toLowerCase();

    if (normalizedType.includes('unpaid')) {
        return 'unpaid';
    }

    if (normalizedType.includes('sick')) {
        return 'sick';
    }

    // Default: Annual Leave or other types
    return 'annual';
}

/**
 * Format date range for display
 */
function formatDateRange(startDate: string, endDate: string): string {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    return start === end ? start : `${start} - ${end}`;
}

/**
 * Leave History Item Component
 *
 * Displays a single leave request history item with status badge.
 * Based on Figma design node 689-1566.
 */
const LeaveHistoryItem = memo(function LeaveHistoryItem({
    leaveType,
    startDate,
    endDate,
    reason,
    status,
    isFirst = false,
    isLast = false,
    isAlone = false,
}: LeaveHistoryItemProps) {
    const leaveVariant = useMemo(() => getLeaveVariant(leaveType), [leaveType]);
    const dateDisplay = useMemo(() => formatDateRange(startDate, endDate), [startDate, endDate]);

    const badgeColor: UnifiedBadgeColor = status === 'approved' ? 'success' : 'danger';
    const badgeText = status === 'approved' ? 'Approved' : 'Rejected';

    // Determine padding and border based on position
    // If alone: no padding and no border
    // If first (with items below): pb-12 with border
    // If middle: pt-12 pb-12 with border
    // If last: pt-12 no border
    const getItemClasses = () => {
        if (isAlone) {
            return ''; // No padding, no border
        }
        if (isFirst && !isLast) {
            return 'pb-[12px] border-b border-[#f5f5f5]'; // First with items below
        }
        if (isLast && !isFirst) {
            return 'pt-[12px]'; // Last item, no border
        }
        if (!isFirst && !isLast) {
            return 'py-[12px] border-b border-[#f5f5f5]'; // Middle item
        }
        return ''; // Fallback (shouldn't happen)
    };

    return (
        <div
            className={`flex gap-[10px] items-center w-full ${getItemClasses()}`}
            data-name="Item"
        >
            {/* Leave Illustration - gray background for history */}
            <div
                className="bg-[#f5f5f5] overflow-clip rounded-[9px] shrink-0 size-[36px] flex items-center justify-center"
                data-name="Illustration"
            >
                <LeaveIllustration variant={leaveVariant} size={36} />
            </div>

            {/* Contents */}
            <div className="flex-1 flex items-start min-w-0">
                <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                    {/* Leave Type */}
                    <p
                        className="font-sans font-medium leading-[18px] text-[#404040] text-[14px] truncate"
                        style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                        {leaveType}
                    </p>

                    {/* Date + Reason */}
                    <div className="flex gap-[6px] items-center min-w-0">
                        <p
                            className="font-sans font-medium leading-[16px] text-[#a3a3a3] text-[12px] text-nowrap shrink-0"
                            style={{ fontVariationSettings: "'wdth' 100" }}
                        >
                            {dateDisplay}
                        </p>
                        {reason && (
                            <>
                                {/* Dot Separator */}
                                <div className="size-[4px] rounded-full bg-[#a3a3a3] shrink-0" />
                                <p
                                    className="font-sans font-medium leading-[16px] text-[#a3a3a3] text-[12px] truncate min-w-0"
                                    style={{ fontVariationSettings: "'wdth' 100" }}
                                    title={reason}
                                >
                                    {reason}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <UnifiedBadge text={badgeText} color={badgeColor} size="sm" padding="compact" />
            </div>
        </div>
    );
});

LeaveHistoryItem.displayName = 'LeaveHistoryItem';

export default LeaveHistoryItem;

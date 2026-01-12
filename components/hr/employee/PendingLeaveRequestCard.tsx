'use client';

import { memo, useMemo, useState } from 'react';
import LeaveIllustration, { type LeaveVariant } from '../LeaveIllustration';
import ButtonIconOnly from '../ButtonIconOnly';
import UnifiedBadge from '@/components/shared/UnifiedBadge';

export interface PendingLeaveRequestCardProps {
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
     * Callback when approve button is clicked
     */
    onApprove?: (id: string) => Promise<void>;

    /**
     * Callback when reject button is clicked
     */
    onReject?: (id: string) => Promise<void>;

    /**
     * Callback when the card is clicked (for opening details dialog)
     */
    onClick?: () => void;

    /**
     * Whether the action buttons are disabled
     */
    disabled?: boolean;

    /**
     * Additional CSS classes
     */
    className?: string;
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
 * Converts YYYY-MM-DD to "Dec 19" format
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
 * Pending Leave Request Card Component
 *
 * Displays a pending leave request with approve/reject actions.
 * Based on Figma design node 689-1546.
 *
 * Features:
 * - Leave illustration matching leave type
 * - Leave type with "Pending" badge
 * - Date range with dot separator and reason
 * - Approve/reject action buttons
 *
 * @example
 * ```tsx
 * <PendingLeaveRequestCard
 *   id="123"
 *   leaveType="Annual Leave"
 *   startDate="2025-12-25"
 *   endDate="2025-12-26"
 *   reason="Family vacation"
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 * />
 * ```
 */
const PendingLeaveRequestCard = memo(function PendingLeaveRequestCard({
    id,
    leaveType,
    startDate,
    endDate,
    reason,
    onApprove,
    onReject,
    onClick,
    disabled = false,
    className = '',
}: PendingLeaveRequestCardProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const leaveVariant = useMemo(() => getLeaveVariant(leaveType), [leaveType]);
    const dateDisplay = useMemo(() => formatDateRange(startDate, endDate), [startDate, endDate]);

    const handleApprove = async () => {
        if (!onApprove || isProcessing) return;
        setIsProcessing(true);
        try {
            await onApprove(id);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!onReject || isProcessing) return;
        setIsProcessing(true);
        try {
            await onReject(id);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className={`bg-white/60 flex flex-col items-start overflow-clip p-[12px] relative rounded-[12px] shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)] w-full ${onClick ? 'cursor-pointer hover:bg-white/80 transition-colors' : ''} ${className}`}
            data-name="Pending Request"
            data-node-id="689:1546"
            onClick={onClick}
        >
            {/* Container */}
            <div
                className="flex gap-[10px] items-center relative w-full"
                data-name="Container"
                data-node-id="689:1547"
            >
                {/* Leave Illustration */}
                <LeaveIllustration variant={leaveVariant} size={36} />

                {/* Contents */}
                <div
                    className="flex-1 flex flex-col gap-[2px] items-start min-w-0"
                    data-name="Contents"
                    data-node-id="689:1549"
                >
                    {/* Type + Badge */}
                    <div
                        className="flex gap-[6px] items-center w-full"
                        data-name="Type + Badge"
                        data-node-id="689:1550"
                    >
                        <p
                            className="font-sans font-medium leading-[18px] text-[#404040] text-[14px] text-nowrap shrink-0"
                            data-node-id="689:1551"
                            style={{ fontVariationSettings: "'wdth' 100" }}
                        >
                            {leaveType}
                        </p>
                        <UnifiedBadge text="Pending" color="warning" size="sm" padding="compact" />
                    </div>

                    {/* Date + Reason */}
                    <div
                        className="flex gap-[6px] items-center w-full min-w-0"
                        data-name="Date + Reason"
                        data-node-id="689:1556"
                    >
                        <p
                            className="font-sans font-medium leading-[16px] text-[#737373] text-[12px] text-nowrap shrink-0"
                            data-node-id="689:1557"
                            style={{ fontVariationSettings: "'wdth' 100" }}
                        >
                            {dateDisplay}
                        </p>
                        {reason && (
                            <>
                                {/* Dot Separator */}
                                <div
                                    className="size-[4px] rounded-full bg-[#a3a3a3] shrink-0"
                                    data-name="Separator"
                                    data-node-id="689:1558"
                                />
                                <p
                                    className="font-sans font-medium leading-[16px] text-[#737373] text-[12px] truncate min-w-0"
                                    data-node-id="689:1559"
                                    style={{ fontVariationSettings: "'wdth' 100" }}
                                    title={reason}
                                >
                                    {reason}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Button Group */}
                <div
                    className="flex gap-[4px] items-center shrink-0"
                    data-name="Button Group"
                    data-node-id="689:1560"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ButtonIconOnly
                        variant="Approve"
                        onClick={handleApprove}
                        disabled={disabled || isProcessing}
                        aria-label={`Approve ${leaveType} request`}
                    />
                    <ButtonIconOnly
                        variant="Reject"
                        onClick={handleReject}
                        disabled={disabled || isProcessing}
                        aria-label={`Reject ${leaveType} request`}
                    />
                </div>
            </div>
        </div>
    );
});

PendingLeaveRequestCard.displayName = 'PendingLeaveRequestCard';

export default PendingLeaveRequestCard;

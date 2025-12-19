'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import PendingLeaveRequestCard from './PendingLeaveRequestCard';
import {
    getEmployeePendingLeaveRequest,
    type EmployeePendingLeaveRequest,
} from '@/lib/actions/hr/employeeDetails';
import { approveLeaveRequest, rejectLeaveRequest } from '@/lib/actions/hr/leaves';

export interface PendingLeaveRequestSectionProps {
    /**
     * Employee ID to fetch pending leave request for
     */
    employeeId: string;

    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Pending Leave Request Section Component
 *
 * Fetches and displays a pending leave request for a specific employee
 * with approve/reject functionality.
 *
 * Based on Figma design node 689-1546.
 *
 * @example
 * ```tsx
 * <PendingLeaveRequestSection employeeId="uuid-123" />
 * ```
 */
const PendingLeaveRequestSection = memo(function PendingLeaveRequestSection({
    employeeId,
    className = '',
}: PendingLeaveRequestSectionProps) {
    const [pendingRequest, setPendingRequest] = useState<EmployeePendingLeaveRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch pending leave request on mount
    useEffect(() => {
        async function fetchPendingRequest() {
            try {
                setLoading(true);
                setError(null);
                const result = await getEmployeePendingLeaveRequest(employeeId);

                if (result.error) {
                    console.error('[PendingLeaveRequestSection] Error:', result.error);
                    // Don't show error in UI - just hide the section
                    setPendingRequest(null);
                } else {
                    setPendingRequest(result.data || null);
                }
            } catch (err) {
                console.error('[PendingLeaveRequestSection] Unexpected error:', err);
                setPendingRequest(null);
            } finally {
                setLoading(false);
            }
        }

        if (employeeId) {
            fetchPendingRequest();
        }
    }, [employeeId]);

    // Handle approve action
    const handleApprove = useCallback(async (requestId: string) => {
        try {
            const result = await approveLeaveRequest(requestId);
            if (result.success) {
                // Remove card from UI on success
                setPendingRequest(null);
            } else {
                console.error('[PendingLeaveRequestSection] Approve error:', result.error);
                // Could show toast here
            }
        } catch (err) {
            console.error('[PendingLeaveRequestSection] Approve error:', err);
        }
    }, []);

    // Handle reject action
    const handleReject = useCallback(async (requestId: string) => {
        try {
            // For now, reject with a generic reason
            // In the future, this could open a dialog to get the rejection reason
            const result = await rejectLeaveRequest(requestId, 'Rejected by HR');
            if (result.success) {
                // Remove card from UI on success
                setPendingRequest(null);
            } else {
                console.error('[PendingLeaveRequestSection] Reject error:', result.error);
                // Could show toast here
            }
        } catch (err) {
            console.error('[PendingLeaveRequestSection] Reject error:', err);
        }
    }, []);

    // Don't render if loading, error, or no pending request
    if (loading || error || !pendingRequest) {
        return null;
    }

    return (
        <div className={className}>
            <PendingLeaveRequestCard
                id={pendingRequest.id}
                leaveType={pendingRequest.leaveType}
                startDate={pendingRequest.startDate}
                endDate={pendingRequest.endDate}
                reason={pendingRequest.reason || undefined}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
});

PendingLeaveRequestSection.displayName = 'PendingLeaveRequestSection';

export default PendingLeaveRequestSection;

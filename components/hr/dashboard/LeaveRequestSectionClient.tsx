'use client';

import { useEffect, useState, useTransition } from 'react';
import LeaveRequestSection, { type LeaveRequest } from './LeaveRequestSection';
import { getPendingLeaveRequestsForDashboard } from '@/lib/actions/hr/dashboard';
import { approveLeaveRequest, rejectLeaveRequest } from '@/lib/actions/hr/leaves';
import { useToast } from '@/app/contexts/ToastContext';

/**
 * LeaveRequestSectionClient
 *
 * Client-side wrapper around LeaveRequestSection that:
 * - Fetches pending leave requests for the dashboard
 * - Handles approve / reject actions via server actions
 * - Manages loading / error / processing states
 * - Shows toast notifications for user feedback
 *
 * When there is no data, the underlying LeaveRequestSection will still
 * render its own placeholder state (via its internal placeholder dataset).
 */
export default function LeaveRequestSectionClient() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  // Initial load
  useEffect(() => {
    void loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRequests() {
    setLoading(true);
    setError(undefined);

    try {
      const result = await getPendingLeaveRequestsForDashboard(5);

      if (result.error) {
        setError(result.error);
        console.error('[LeaveRequestSectionClient] Error loading requests:', result.error);
        setRequests([]);
        return;
      }

      if (result.data) {
        const formatted: LeaveRequest[] = result.data.map((req) => ({
          id: req.id,
          name: req.user.full_name,
          dateRange: req.formattedDateRange,
          leaveType: req.leaveType,
        }));
        setRequests(formatted);
      } else {
        setRequests([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leave requests';
      setError(message);
      console.error('[LeaveRequestSectionClient] Unexpected error:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: string) => {
    if (processingIds.has(id)) return;

    setProcessingIds((prev) => new Set(prev).add(id));

    startTransition(async () => {
      try {
        const result = await approveLeaveRequest(id);

        if (result.success) {
          showToast('success', 'Leave Request Approved', 'The leave request has been approved successfully.');
          await loadRequests();
        } else {
          showToast('danger', 'Approval Failed', result.error || 'Failed to approve leave request.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred while approving.';
        showToast('danger', 'Error', message);
        console.error('[LeaveRequestSectionClient] Error approving:', err);
      } finally {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    });
  };

  const handleReject = async (id: string) => {
    if (processingIds.has(id)) return;

    const reason = prompt('Please provide a reason for rejection:');
    if (!reason || reason.trim().length === 0) {
      showToast('warning', 'Rejection Cancelled', 'Rejection reason is required.');
      return;
    }

    setProcessingIds((prev) => new Set(prev).add(id));

    startTransition(async () => {
      try {
        const result = await rejectLeaveRequest(id, reason.trim());

        if (result.success) {
          showToast('success', 'Leave Request Rejected', 'The leave request has been rejected.');
          await loadRequests();
        } else {
          showToast('danger', 'Rejection Failed', result.error || 'Failed to reject leave request.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred while rejecting.';
        showToast('danger', 'Error', message);
        console.error('[LeaveRequestSectionClient] Error rejecting:', err);
      } finally {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    });
  };

  const isDisabled = isPending || processingIds.size > 0;

  return (
    <LeaveRequestSection
      requests={requests}
      loading={loading}
      error={error}
      onApprove={handleApprove}
      onReject={handleReject}
      disabled={isDisabled}
      maxItems={5}
    />
  );
}



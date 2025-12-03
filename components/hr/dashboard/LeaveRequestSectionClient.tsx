'use client';

import { useEffect, useState, useTransition, useCallback, useRef } from 'react';
import LeaveRequestSection, { type LeaveRequest } from './LeaveRequestSection';
import LeaveRequestSectionSkeleton from './LeaveRequestSectionSkeleton';
import { getPendingLeaveRequestsForDashboard } from '@/lib/actions/hr/dashboard';
import { approveLeaveRequest, rejectLeaveRequest } from '@/lib/actions/hr/leaves';
import { useToast } from '@/app/contexts/ToastContext';

export interface LeaveRequestSectionClientProps {
  /**
   * Initial count of items from server-side fetch.
   * Used to show accurate skeleton loading that matches the actual data count.
   */
  initialCount?: number;
}

/**
 * LeaveRequestSectionClient
 *
 * Client-side wrapper around LeaveRequestSection that:
 * - Fetches pending leave requests for the dashboard
 * - Handles approve / reject actions via server actions
 * - Manages loading / error / processing states
 * - Caches successful results to prevent unnecessary refetches
 * - Shows toast notifications for user feedback
 * - Uses initialCount from server to show accurate skeleton loading
 *
 * When there is no data, the underlying LeaveRequestSection will still
 * render its own placeholder state (via its internal placeholder dataset).
 */
export default function LeaveRequestSectionClient({ initialCount = 5 }: LeaveRequestSectionClientProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  
  // Cache the last successful fetch timestamp to prevent unnecessary refetches
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef(false);

  // Memoize loadRequests to prevent unnecessary refetches
  // Note: We don't include requests.length or loading in deps to avoid infinite loops
  // The cache check inside handles preventing unnecessary refetches
  const loadRequests = useCallback(async (force = false) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    
    // Cache: Don't refetch if we fetched recently (within last 30 seconds)
    // Exception: Force refetch after approve/reject actions
    if (!force) {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchRef.current;
      const CACHE_DURATION = 30000; // 30 seconds
      
      if (timeSinceLastFetch < CACHE_DURATION && lastFetchRef.current > 0) {
        return;
      }
    }

    isFetchingRef.current = true;
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
        lastFetchRef.current = Date.now(); // Update cache timestamp
      } else {
        setRequests([]);
        lastFetchRef.current = Date.now();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leave requests';
      setError(message);
      console.error('[LeaveRequestSectionClient] Unexpected error:', err);
      setRequests([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []); // Empty deps - function is stable

  // Initial load
  useEffect(() => {
    void loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Memoize handlers to prevent unnecessary re-renders
  const handleApprove = useCallback(async (id: string) => {
    if (processingIds.has(id)) return;

    setProcessingIds((prev) => new Set(prev).add(id));

    startTransition(async () => {
      try {
        const result = await approveLeaveRequest(id);

        if (result.success) {
          showToast('success', 'Leave Request Approved', 'The leave request has been approved successfully.');
          // Force refetch after successful action (bypass cache)
          await loadRequests(true);
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
  }, [processingIds, showToast, loadRequests]);

  const handleReject = useCallback(async (id: string) => {
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
          // Force refetch after successful action (bypass cache)
          await loadRequests(true);
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
  }, [processingIds, showToast, loadRequests]);

  const isDisabled = isPending || processingIds.size > 0;

  // Show skeleton during initial loading (when loading === true and no cached requests)
  // Use initialCount from server to match exact number of items that will be loaded
  if (loading && requests.length === 0) {
    return <LeaveRequestSectionSkeleton count={initialCount} />;
  }

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



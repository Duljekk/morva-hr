'use server';

/**
 * Server actions for HR leave request management
 * Handles approving, rejecting, and viewing all leave requests
 * 
 * Location: lib/actions/hr/ - HR-only actions
 * All functions require HR admin role (enforced via requireHRAdmin)
 * Uses GMT+7 (Asia/Bangkok) timezone for all date operations
 */

import { revalidateTag } from 'next/cache';
import { requireHRAdmin } from '@/lib/auth/requireHRAdmin';
import { createNotification } from '../shared/notifications';
import { createTimestamp, formatDateDisplay, getCurrentYear } from '@/lib/utils/timezone';

export interface PendingLeaveRequest {
  id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  createdAt: string;
}

/**
 * GET PENDING LEAVE REQUESTS
 * Returns all pending leave requests for HR review
 */
/**
 * GET PENDING LEAVE REQUESTS COUNT
 * 
 * Returns the total count of pending leave requests.
 * This is a lightweight query to get the count before fetching full data.
 */
export async function getPendingLeaveRequestsCount(): Promise<{ data?: number; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    console.log('[getPendingLeaveRequestsCount] Counting pending leave requests');

    const { count, error } = await supabase
      .from('leave_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      console.error('[getPendingLeaveRequestsCount] Query error:', error);
      return { error: 'Failed to count pending leave requests' };
    }

    const totalCount = count || 0;
    console.log('[getPendingLeaveRequestsCount] Total pending requests:', totalCount);
    return { data: totalCount };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getPendingLeaveRequestsCount] Error:', errorMessage);
    return { error: errorMessage };
  }
}

export async function getPendingLeaveRequests(): Promise<{ data?: PendingLeaveRequest[]; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    console.log('[getPendingLeaveRequests] Fetching pending leave requests for HR admin');

    // Fetch pending leave requests with joins
    const { data: requests, error } = await supabase
      .from('leave_requests')
      .select(`
        *,
        user:users!user_id (
          id,
          full_name
        ),
        leave_type:leave_types!leave_type_id (
          name
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true }); // Oldest first

    if (error) {
      console.error('[getPendingLeaveRequests] Query error:', error);
      return { error: 'Failed to fetch pending leave requests' };
    }

    if (!requests || requests.length === 0) {
      return { data: [] };
    }

    // Format the requests
    const formattedRequests: PendingLeaveRequest[] = requests.map(req => {
      const userData = req.user as any;
      const leaveTypeData = req.leave_type as any;

      return {
        id: req.id,
        user: {
          id: userData?.id || '',
          full_name: userData?.full_name || 'Unknown User',
        },
        leaveType: leaveTypeData?.name || 'Unknown',
        startDate: req.start_date,
        endDate: req.end_date,
        days: req.total_days,
        reason: req.reason || '',
        createdAt: req.created_at,
      };
    });

    return { data: formattedRequests };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getPendingLeaveRequests] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * Approve a leave request (HR Admin only)
 * Sets approved_by and approved_at fields as required by database constraint
 * Also updates the employee's leave balance (decrements balance, increments used)
 */
export async function approveLeaveRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require HR admin role
    const { userId, supabase } = await requireHRAdmin();

    // Get the leave request to find the user_id, total_days, and details for notification
    const { data: leaveRequest, error: fetchError } = await supabase
      .from('leave_requests')
      .select('user_id, start_date, end_date, leave_type_id, total_days')
      .eq('id', requestId)
      .single();

    if (fetchError || !leaveRequest) {
      console.error('[approveLeaveRequest] Could not find leave request:', fetchError);
      return { success: false, error: 'Leave request not found' };
    }

    // Update request with status, approved_by, and approved_at
    const { error } = await supabase
      .from('leave_requests')
      .update({
        status: 'approved',
        approved_by: userId,
        approved_at: createTimestamp(), // Store in UTC (best practice)
      })
      .eq('id', requestId)
      .eq('status', 'pending'); // Can only approve pending requests

    if (error) {
      console.error('[approveLeaveRequest] Error updating request:', error);
      return { success: false, error: 'Failed to approve request. It may have already been processed.' };
    }

    // Update leave balance: increment used, decrement balance
    const currentYear = getCurrentYear();
    const { data: balanceRow, error: balanceFetchError } = await supabase
      .from('leave_balances')
      .select('id, used, balance')
      .eq('user_id', leaveRequest.user_id)
      .eq('leave_type_id', leaveRequest.leave_type_id)
      .eq('year', currentYear)
      .maybeSingle();

    if (balanceFetchError) {
      console.error('[approveLeaveRequest] Error fetching leave balance:', balanceFetchError);
      // Don't fail the approval - balance update is secondary
    } else if (balanceRow) {
      // Update the balance row: increment used, decrement balance
      const newUsed = Number(balanceRow.used) + leaveRequest.total_days;
      const newBalance = Number(balanceRow.balance) - leaveRequest.total_days;

      const { error: balanceUpdateError } = await supabase
        .from('leave_balances')
        .update({
          used: newUsed,
          balance: newBalance,
        })
        .eq('id', balanceRow.id);

      if (balanceUpdateError) {
        console.error('[approveLeaveRequest] Error updating leave balance:', balanceUpdateError);
        // Don't fail the approval - balance update is secondary
      } else {
        console.log('[approveLeaveRequest] Leave balance updated:', {
          userId: leaveRequest.user_id,
          leaveTypeId: leaveRequest.leave_type_id,
          daysUsed: leaveRequest.total_days,
          newUsed,
          newBalance,
        });
      }
    } else {
      console.log('[approveLeaveRequest] No leave balance row found for user, skipping balance update');
    }

    // Create notification for the employee
    try {
      // Format dates in GMT+7 timezone for display
      const startDate = formatDateDisplay(new Date(leaveRequest.start_date + 'T00:00:00Z'), {
        month: 'short',
        day: 'numeric'
      });
      const endDate = formatDateDisplay(new Date(leaveRequest.end_date + 'T00:00:00Z'), {
        month: 'short',
        day: 'numeric'
      });

      // Format date range for notification
      const dateRange = startDate === endDate
        ? startDate
        : `${startDate} to ${endDate}`;

      const notificationResult = await createNotification({
        user_id: leaveRequest.user_id,
        type: 'leave_approved',
        title: 'Leave request approved',
        description: `Your leave on ${dateRange} has been approved.`,
        related_entity_type: 'leave_request',
        related_entity_id: requestId,
      });
      if (!notificationResult.success) {
        console.error('[approveLeaveRequest] Failed to create notification:', notificationResult.error);
      }
    } catch (notificationError) {
      // Log error but don't fail the approval operation
      console.error('[approveLeaveRequest] Error creating notification:', notificationError);
    }

    // Invalidate cache tags
    revalidateTag('leave-requests', 'max');
    revalidateTag(`user-${leaveRequest.user_id}`, 'max');
    revalidateTag('activities', 'max');

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[approveLeaveRequest] Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Reject a leave request (HR Admin only)
 * Sets approved_by, approved_at, and rejection_reason as required by database constraint
 */
export async function rejectLeaveRequest(
  requestId: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require HR admin role
    const { userId, supabase } = await requireHRAdmin();

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return { success: false, error: 'Rejection reason is required' };
    }

    // Get the leave request to find the user_id and details for notification
    const { data: leaveRequest, error: fetchError } = await supabase
      .from('leave_requests')
      .select('user_id, start_date, end_date')
      .eq('id', requestId)
      .single();

    if (fetchError || !leaveRequest) {
      console.error('[rejectLeaveRequest] Could not find leave request:', fetchError);
      return { success: false, error: 'Leave request not found' };
    }

    // Update request with status, approved_by, approved_at, and rejection_reason
    const { error } = await supabase
      .from('leave_requests')
      .update({
        status: 'rejected',
        approved_by: userId,
        approved_at: createTimestamp(), // Store in UTC (best practice)
        rejection_reason: rejectionReason.trim(),
      })
      .eq('id', requestId)
      .eq('status', 'pending'); // Can only reject pending requests

    if (error) {
      console.error('[rejectLeaveRequest] Error updating request:', error);
      return { success: false, error: 'Failed to reject request. It may have already been processed.' };
    }

    // Create notification for the employee
    try {
      // Format dates in GMT+7 timezone for display
      const startDate = formatDateDisplay(new Date(leaveRequest.start_date + 'T00:00:00Z'), {
        month: 'short',
        day: 'numeric'
      });
      const endDate = formatDateDisplay(new Date(leaveRequest.end_date + 'T00:00:00Z'), {
        month: 'short',
        day: 'numeric'
      });
      const reasonText = rejectionReason.trim() ? ` Reason: ${rejectionReason.trim()}` : '';

      const notificationResult = await createNotification({
        user_id: leaveRequest.user_id,
        type: 'leave_rejected',
        title: 'Leave request rejected',
        description: `Your leave from ${startDate} to ${endDate} was rejected.${reasonText}`,
        related_entity_type: 'leave_request',
        related_entity_id: requestId,
      });
      if (!notificationResult.success) {
        console.error('[rejectLeaveRequest] Failed to create notification:', notificationResult.error);
      }
    } catch (notificationError) {
      // Log error but don't fail the rejection operation
      console.error('[rejectLeaveRequest] Error creating notification:', notificationError);
    }

    // Invalidate cache tags
    revalidateTag('leave-requests', 'max');
    revalidateTag(`user-${leaveRequest.user_id}`, 'max');
    revalidateTag('activities', 'max');

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[rejectLeaveRequest] Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
















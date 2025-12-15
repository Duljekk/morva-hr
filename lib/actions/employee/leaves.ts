'use server';

/**
 * Server actions for employee leave request management
 * Handles file uploads, leave requests submission, and balance checks
 * 
 * Location: lib/actions/employee/ - Employee-only actions
 */

import { createClient } from '@/lib/supabase/server';
import { validateFile, generateFilePath, formatFileSize } from '@/lib/utils/fileUpload';
import { Database } from '@/lib/supabase/types';
import { revalidateTag, unstable_cache } from 'next/cache';
import { createNotification } from '../shared/notifications';

type LeaveRequest = Database['public']['Tables']['leave_requests']['Row'];
type LeaveRequestInsert = Database['public']['Tables']['leave_requests']['Insert'];
type LeaveRequestAttachmentInsert = Database['public']['Tables']['leave_request_attachments']['Insert'];

export interface FileUploadResult {
  success: boolean;
  filePath?: string;
  publicUrl?: string;
  fileName?: string;
  fileSize?: string;
  error?: string;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  totalQuota: number;
  used: number;
  remaining: number;
}

export interface FileAttachment {
  url: string;
  size: number;
  name: string;
}

export interface SubmitLeaveRequestData {
  leaveTypeId: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  dayType: 'full' | 'half';
  totalDays: number;
  reason?: string;
  fileAttachments?: FileAttachment[]; // File details including size
}

/**
 * GET LEAVE TYPES (Uncached implementation)
 * Leave types rarely change, so we cache them for a longer duration
 */
async function _getLeaveTypesUncached() {
  const supabase = await createClient();
  const { data: leaveTypes, error } = await supabase
    .from('leave_types')
    .select('id, name, max_days_per_year')
    .eq('is_active', true)
    .order('name');
  
  if (error) {
    console.error('[getLeaveTypes] Error fetching leave types:', error);
    return { error: 'Failed to fetch leave types' };
  }
  
  return { data: leaveTypes || [] };
}

/**
 * GET LEAVE TYPES (Public cached function)
 * 
 * Cached with 1-hour revalidation since leave types rarely change
 */
export async function getLeaveTypes() {
  try {
    // Cache with 1-hour revalidation since leave types rarely change
    const getCachedLeaveTypes = unstable_cache(
      async () => _getLeaveTypesUncached(),
      ['leave-types'],
      {
        revalidate: 3600, // 1 hour
        tags: ['leave-types'],
      }
    );

    return await getCachedLeaveTypes();
  } catch (error) {
    console.error('[getLeaveTypes] Unexpected error:', error);
    return { error: 'Failed to fetch leave types' };
  }
}

/**
 * Upload a single file to Supabase Storage
 */
export async function uploadLeaveAttachment(formData: FormData): Promise<FileUploadResult> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'You must be logged in to upload files' };
    }

    // Get file from FormData
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Generate file path
    const filePath = generateFilePath(user.id, file.name);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('leave-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return { success: false, error: 'Failed to upload file. Please try again.' };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('leave-attachments').getPublicUrl(data.path);

    return {
      success: true,
      filePath: data.path,
      publicUrl,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'An unexpected error occurred during upload' };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteLeaveAttachment(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'You must be logged in to delete files' };
    }

    // Verify file ownership by checking if the path starts with user ID
    if (!filePath.startsWith(user.id)) {
      return { success: false, error: 'You can only delete your own files' };
    }

    // Delete from storage
    const { error } = await supabase.storage.from('leave-attachments').remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return { success: false, error: 'Failed to delete file. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'An unexpected error occurred during deletion' };
  }
}

/**
 * Get leave balance for a specific leave type
 * OPTIMIZED: Uses cached leave types and batches queries in parallel
 */
export async function getLeaveBalance(leaveTypeId: string): Promise<{ data?: LeaveBalance; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[getLeaveBalance] Auth error:', authError);
      return { error: 'You must be logged in' };
    }

    console.log('[getLeaveBalance] Fetching leave balance for type:', leaveTypeId, 'user:', user.id);

    // Calculate date range once
    const currentYear = new Date().getFullYear();
    const yearStart = `${currentYear}-01-01`;
    const yearEnd = `${currentYear}-12-31`;

    // OPTIMIZED: Batch both queries in parallel using Promise.all
    // Query 1: Get leave type info (using cached function for better performance)
    // Query 2: Get approved leave requests for this year
    // These queries are independent and can run concurrently
    const [leaveTypesResult, approvedLeavesResult] = await Promise.all([
      // Use cached leave types function
      getLeaveTypes(),
      // Query approved leaves
      supabase
        .from('leave_requests')
        .select('total_days')
        .eq('user_id', user.id)
        .eq('leave_type_id', leaveTypeId)
        .eq('status', 'approved')
        .gte('start_date', yearStart)
        .lte('end_date', yearEnd),
    ]);

    // Process leave types result
    if (leaveTypesResult.error || !leaveTypesResult.data) {
      console.error('[getLeaveBalance] Failed to fetch leave types:', leaveTypesResult.error);
      return { error: 'Failed to fetch leave types' };
    }

    const leaveType = leaveTypesResult.data.find(lt => lt.id === leaveTypeId);
    if (!leaveType) {
      console.error('[getLeaveBalance] Leave type not found:', leaveTypeId);
      return { error: 'Leave type not found' };
    }

    // Process approved leaves result
    const { data: approvedLeaves, error: leavesError } = approvedLeavesResult;
    if (leavesError) {
      console.error('[getLeaveBalance] Error fetching approved leaves:', leavesError);
      return { error: 'Failed to calculate leave balance' };
    }

    // If no quota (e.g., unpaid leave), return unlimited
    if (!leaveType.max_days_per_year) {
      console.log('[getLeaveBalance] No quota limit for leave type:', leaveType.name);
      return {
        data: {
          leaveTypeId: leaveType.id,
          leaveTypeName: leaveType.name,
          totalQuota: 0,
          used: 0,
          remaining: 999, // Indicate unlimited
        },
      };
    }

    // Calculate used days
    const usedDays = approvedLeaves?.reduce((sum, leave) => sum + leave.total_days, 0) || 0;

    console.log('[getLeaveBalance] Calculated balance:', {
      leaveType: leaveType.name,
      totalQuota: leaveType.max_days_per_year,
      usedDays,
      remaining: leaveType.max_days_per_year - usedDays,
    });

    return {
      data: {
        leaveTypeId: leaveType.id,
        leaveTypeName: leaveType.name,
        totalQuota: leaveType.max_days_per_year,
        used: usedDays,
        remaining: leaveType.max_days_per_year - usedDays,
      },
    };
  } catch (error) {
    console.error('Get balance error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Get all leave balances for the current user
 * OPTIMIZED: Uses cached leave types and batches queries in parallel
 */
export async function getAllLeaveBalances(): Promise<{ data?: LeaveBalance[]; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[getAllLeaveBalances] Auth error:', authError);
      return { error: 'You must be logged in' };
    }

    console.log('[getAllLeaveBalances] Fetching leave balances for user:', user.id);

    // OPTIMIZED: Use cached leave types function (1-hour cache)
    const leaveTypesResult = await getLeaveTypes();
    if (leaveTypesResult.error || !leaveTypesResult.data) {
      console.error('[getAllLeaveBalances] Failed to fetch leave types:', leaveTypesResult.error);
      return { error: 'Failed to fetch leave types' };
    }

    const leaveTypes = leaveTypesResult.data;

    // OPTIMIZED: Calculate date range once
    const currentYear = new Date().getFullYear();
    const yearStart = `${currentYear}-01-01`;
    const yearEnd = `${currentYear}-12-31`;

    // Get all approved leaves for this year
    // This query is independent of leave types, so it could be batched,
    // but since we're using cached leave types, the benefit is minimal
    const { data: approvedLeaves, error: leavesError } = await supabase
      .from('leave_requests')
      .select('leave_type_id, total_days')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .gte('start_date', yearStart)
      .lte('end_date', yearEnd);

    if (leavesError) {
      console.error('[getAllLeaveBalances] Error fetching approved leaves:', leavesError);
      return { error: 'Failed to calculate leave balances' };
    }

    console.log('[getAllLeaveBalances] Approved leaves:', approvedLeaves);

    // Calculate balance for each leave type
    const balances: LeaveBalance[] = leaveTypes.map((leaveType) => {
      const usedDays =
        approvedLeaves
          ?.filter((leave) => leave.leave_type_id === leaveType.id)
          .reduce((sum, leave) => sum + leave.total_days, 0) || 0;

      // If no quota, treat as unlimited
      if (!leaveType.max_days_per_year) {
        return {
          leaveTypeId: leaveType.id,
          leaveTypeName: leaveType.name,
          totalQuota: 0,
          used: usedDays,
          remaining: 999,
        };
      }

      return {
        leaveTypeId: leaveType.id,
        leaveTypeName: leaveType.name,
        totalQuota: leaveType.max_days_per_year,
        used: usedDays,
        remaining: leaveType.max_days_per_year - usedDays,
      };
    });

    console.log('[getAllLeaveBalances] Calculated balances:', balances);

    return { data: balances };
  } catch (error) {
    console.error('Get all balances error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Check if user has an active leave request
 * Active requests are those with status 'pending' or 'approved' where end_date >= current date
 */
/**
 * HAS ACTIVE LEAVE REQUEST (Uncached implementation)
 */
async function _hasActiveLeaveRequestUncached(userId: string, today: string): Promise<{ 
  data?: { hasActive: boolean; request?: LeaveRequest }; 
  error?: string 
}> {
  const supabase = await createClient();

  // Query for active leave requests with leave type name
  const { data: activeRequest, error: fetchError } = await supabase
    .from('leave_requests')
    .select(`
      *,
      leave_types:leave_type_id (
        name
      )
    `)
    .eq('user_id', userId)
    .in('status', ['pending', 'approved'])
    .gte('end_date', today) // end_date >= current date
    .maybeSingle(); // Returns null if no record found, instead of error

  if (fetchError) {
    console.error('[hasActiveLeaveRequest] Error fetching active leave:', fetchError);
    return { error: 'Failed to check for active leave request' };
  }

  // Format the response with leave type name
  const formattedRequest = activeRequest ? {
    ...activeRequest,
    leaveTypeName: (activeRequest.leave_types as any)?.name || undefined,
  } : undefined;

  return {
    data: {
      hasActive: !!activeRequest,
      request: formattedRequest || undefined,
    },
  };
}

/**
 * HAS ACTIVE LEAVE REQUEST (Public cached function)
 * 
 * Cached with 10-minute revalidation and user-specific tags for targeted invalidation
 */
export async function hasActiveLeaveRequest(): Promise<{ 
  data?: { hasActive: boolean; request?: LeaveRequest }; 
  error?: string 
}> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[hasActiveLeaveRequest] Auth error:', authError);
      return { error: 'You must be logged in' };
    }

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Cache with 10-minute revalidation and user-specific tags
    // Tags: 'leave-requests' (general) and 'user-{userId}' (user-specific)
    // Note: unstable_cache key must be stable - using user.id and today as part of key
    try {
      const getCachedActiveLeave = unstable_cache(
        async () => {
          return await _hasActiveLeaveRequestUncached(user.id, today);
        },
        ['active-leave', `user-${user.id}`, `date-${today}`],
        {
          revalidate: 600, // 10 minutes
          tags: ['leave-requests', `user-${user.id}`],
        }
      );

      return await getCachedActiveLeave();
    } catch (cacheError) {
      console.error('[hasActiveLeaveRequest] Cache error, falling back to direct call:', cacheError);
      // Fallback to direct call if caching fails
      return await _hasActiveLeaveRequestUncached(user.id, today);
    }
  } catch (error) {
    console.error('[hasActiveLeaveRequest] Unexpected error:', error);
    console.error('[hasActiveLeaveRequest] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { error: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}` };
  }
}

/**
 * Submit a leave request with attachments
 */
export async function submitLeaveRequest(
  requestData: SubmitLeaveRequestData
): Promise<{ data?: LeaveRequest; error?: string }> {
  try {
    console.log('[submitLeaveRequest] Request data:', requestData);
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[submitLeaveRequest] Auth error:', authError);
      return { error: 'You must be logged in to submit a leave request' };
    }

    console.log('[submitLeaveRequest] User authenticated:', user.id);

    // Check for existing active leave request
    const activeLeaveCheck = await hasActiveLeaveRequest();
    if (activeLeaveCheck.error) {
      console.error('[submitLeaveRequest] Error checking active leave:', activeLeaveCheck.error);
      return { error: 'Failed to verify leave request status. Please try again.' };
    }

    if (activeLeaveCheck.data?.hasActive) {
      const activeRequest = activeLeaveCheck.data.request;
      const status = activeRequest?.status || 'active';
      console.log('[submitLeaveRequest] User already has active leave request:', activeRequest?.id);
      return { 
        error: `You already have an active leave request (${status}). Please wait for it to be processed or cancel it before submitting a new one.` 
      };
    }

    // Validate dates
    // Parse dates in local timezone to avoid timezone shift issues
    // Date strings in YYYY-MM-DD format are parsed as UTC by default,
    // so we parse them explicitly in local timezone
    const parseLocalDate = (dateString: string): Date => {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    
    const startDate = parseLocalDate(requestData.startDate);
    const endDate = parseLocalDate(requestData.endDate);
    if (startDate > endDate) {
      console.error('[submitLeaveRequest] Invalid dates:', { startDate, endDate });
      return { error: 'Start date must be before or equal to end date' };
    }

    // Note: Leave balance checking is disabled (all leave types are unlimited)
    console.log('[submitLeaveRequest] Skipping balance check - all leave types are unlimited');

    // Insert leave request
    const leaveRequestInsert: LeaveRequestInsert = {
      user_id: user.id,
      leave_type_id: requestData.leaveTypeId,
      start_date: requestData.startDate,
      end_date: requestData.endDate,
      day_type: requestData.dayType,
      total_days: requestData.totalDays,
      reason: requestData.reason || null,
      status: 'pending',
    };

    const { data: leaveRequest, error: insertError } = await supabase
      .from('leave_requests')
      .insert(leaveRequestInsert)
      .select()
      .single();

    if (insertError || !leaveRequest) {
      console.error('Leave request insert error:', insertError);
      return { error: 'Failed to submit leave request. Please try again.' };
    }

    // Insert attachments if any
    if (requestData.fileAttachments && requestData.fileAttachments.length > 0) {
      console.log('[submitLeaveRequest] Inserting attachments:', requestData.fileAttachments);
      
      const attachments = requestData.fileAttachments.map((attachment) => {
        return {
          leave_request_id: leaveRequest.id,
          file_name: attachment.name,
          file_size: attachment.size, // Actual file size in bytes
          file_url: attachment.url, // Storage path
          file_type: attachment.name.split('.').pop() || null, // Extract extension
          uploaded_by: user.id,
        };
      });

      const { error: attachmentError } = await supabase
        .from('leave_request_attachments')
        .insert(attachments);

      if (attachmentError) {
        console.error('[submitLeaveRequest] Attachment insert error:', attachmentError);
        // Leave request was created, but attachments failed
        // Could implement cleanup here if needed
        return {
          data: leaveRequest,
          error: 'Leave request submitted, but some attachments failed to link.',
        };
      }
      
      console.log('[submitLeaveRequest] Attachments linked successfully');
    }

    // Create notification for the employee
    console.log('[submitLeaveRequest] Creating notification for leave request:', leaveRequest.id);
    const formattedStartDate = new Date(requestData.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const formattedEndDate = new Date(requestData.endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Format date range for notification
    const dateRange = formattedStartDate === formattedEndDate 
      ? formattedStartDate 
      : `${formattedStartDate} to ${formattedEndDate}`;
    
    const notificationResult = await createNotification({
      user_id: user.id,
      type: 'leave_sent',
      title: 'Leave request sent',
      description: `Your leave request for ${dateRange} is awaiting review.`,
      related_entity_type: 'leave_request',
      related_entity_id: leaveRequest.id,
    });
    
    if (!notificationResult.success) {
      console.error('[submitLeaveRequest] âš ï¸ Failed to create notification:', {
        error: notificationResult.error,
        leaveRequestId: leaveRequest.id,
        userId: user.id,
      });
      // Don't fail the submission - notification is non-critical
    } else {
      console.log('[submitLeaveRequest] âœ… Notification created successfully');
    }

    // Invalidate cache tags for leave requests and activities
    // 'max' profile enables stale-while-revalidate behavior
    revalidateTag('leave-requests', 'max');
    revalidateTag(`user-${user.id}`, 'max');
    revalidateTag('activities', 'max');

    return { data: leaveRequest };
  } catch (error) {
    console.error('Submit leave request error:', error);
    return { error: 'An unexpected error occurred while submitting your request' };
  }
}

/**
 * Cancel a pending leave request
 */
export async function cancelLeaveRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'You must be logged in' };
    }

    // Update request status to cancelled
    // RLS policies will ensure user can only cancel their own requests
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .eq('user_id', user.id)
      .eq('status', 'pending'); // Can only cancel pending requests

    if (error) {
      console.error('Cancel request error:', error);
      return { success: false, error: 'Failed to cancel request. It may have already been processed.' };
    }

    // Invalidate cache tags for leave requests and activities
    // 'max' profile enables stale-while-revalidate behavior
    revalidateTag('leave-requests', 'max');
    revalidateTag(`user-${user.id}`, 'max');
    revalidateTag('activities', 'max');

    return { success: true };
  } catch (error) {
    console.error('Cancel request error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a single leave request by ID with all details
 * Returns data formatted for the LeaveRequestDetailsModal component
 */
export async function getLeaveRequest(
  requestId: string
): Promise<{
  data?: {
    id: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedOn: string; // Date part of created_at
    requestedAt: string; // Full timestamp of created_at
    approvedAt?: string; // Full timestamp of approved_at (if approved/rejected)
    rejectionReason?: string; // Rejection reason (if rejected)
    leaveType: string; // Leave type name
    reason: string; // Leave reason
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[getLeaveRequest] Auth error:', authError);
      return { error: 'You must be logged in' };
    }

    // Check if user is HR admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('[getLeaveRequest] Error fetching user role:', userError);
      return { error: 'Failed to verify user permissions' };
    }

    const isHrAdmin = userData?.role === 'hr_admin';

    // Query leave request with leave type name
    let query = supabase
      .from('leave_requests')
      .select(`
        id,
        user_id,
        start_date,
        end_date,
        status,
        reason,
        created_at,
        approved_at,
        rejection_reason,
        leave_types:leave_type_id (
          name
        )
      `)
      .eq('id', requestId)
      .maybeSingle();

    const { data: leaveRequest, error: fetchError } = await query;

    if (fetchError) {
      console.error('[getLeaveRequest] Error fetching leave request:', fetchError);
      return { error: 'Failed to fetch leave request' };
    }

    if (!leaveRequest) {
      return { error: 'Leave request not found' };
    }

    // Check permissions: users can only see their own requests, HR admins can see all
    if (!isHrAdmin && leaveRequest.user_id !== user.id) {
      return { error: 'You do not have permission to view this leave request' };
    }

    // Extract leave type name
    const leaveTypeName = (leaveRequest.leave_types as any)?.name || 'Unknown';

    // Format dates
    const requestedOn = leaveRequest.created_at.split('T')[0]; // Date part
    const requestedAt = leaveRequest.created_at; // Full timestamp
    const approvedAt = leaveRequest.approved_at || undefined;

    return {
      data: {
        id: leaveRequest.id,
        startDate: leaveRequest.start_date,
        endDate: leaveRequest.end_date,
        status: leaveRequest.status as 'pending' | 'approved' | 'rejected',
        requestedOn,
        requestedAt,
        approvedAt,
        rejectionReason: leaveRequest.rejection_reason || undefined,
        leaveType: leaveTypeName,
        reason: leaveRequest.reason || '',
      },
    };
  } catch (error) {
    console.error('[getLeaveRequest] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

'use server';

/**
 * Server actions for leave request management
 * Handles file uploads, leave requests submission, and balance checks
 */

import { createClient } from '@/lib/supabase/server';
import { validateFile, generateFilePath, formatFileSize } from '@/lib/utils/fileUpload';
import { Database } from '@/lib/supabase/types';

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

    console.log('[getLeaveBalance] Fetching leave type:', leaveTypeId, 'for user:', user.id);

    // Get leave type info
    const { data: leaveType, error: leaveTypeError } = await supabase
      .from('leave_types')
      .select('id, name, max_days_per_year')
      .eq('id', leaveTypeId)
      .single();

    console.log('[getLeaveBalance] Leave type query result:', { leaveType, leaveTypeError });

    if (leaveTypeError || !leaveType) {
      console.error('[getLeaveBalance] Leave type not found:', leaveTypeId, 'Error:', leaveTypeError);
      return { error: 'Leave type not found' };
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

    // Get approved leave requests for this year
    const currentYear = new Date().getFullYear();
    const yearStart = `${currentYear}-01-01`;
    const yearEnd = `${currentYear}-12-31`;

    const { data: approvedLeaves, error: leavesError } = await supabase
      .from('leave_requests')
      .select('total_days')
      .eq('user_id', user.id)
      .eq('leave_type_id', leaveTypeId)
      .eq('status', 'approved')
      .gte('start_date', yearStart)
      .lte('end_date', yearEnd);

    if (leavesError) {
      console.error('[getLeaveBalance] Error fetching approved leaves:', leavesError);
      return { error: 'Failed to calculate leave balance' };
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

    console.log('[getAllLeaveBalances] Fetching leave types for user:', user.id);

    // Get all active leave types
    const { data: leaveTypes, error: leaveTypesError } = await supabase
      .from('leave_types')
      .select('id, name, max_days_per_year')
      .eq('is_active', true)
      .order('name');

    console.log('[getAllLeaveBalances] Leave types query result:', { leaveTypes, leaveTypesError });

    if (leaveTypesError || !leaveTypes) {
      console.error('[getAllLeaveBalances] Failed to fetch leave types:', leaveTypesError);
      return { error: 'Failed to fetch leave types' };
    }

    // Get all approved leaves for this year
    const currentYear = new Date().getFullYear();
    const yearStart = `${currentYear}-01-01`;
    const yearEnd = `${currentYear}-12-31`;

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

    // Validate dates
    const startDate = new Date(requestData.startDate);
    const endDate = new Date(requestData.endDate);
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

    return { success: true };
  } catch (error) {
    console.error('Cancel request error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}


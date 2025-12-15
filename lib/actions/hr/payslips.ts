'use server';

/**
 * Server actions for payslip management
 * Handles payslip generation and retrieval
 */

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/types';
import { revalidateTag } from 'next/cache';
import { createNotification } from '@/lib/actions/shared/notifications';

type Payslip = Database['public']['Tables']['payslips']['Row'];
type PayslipInsert = Database['public']['Tables']['payslips']['Insert'];

/**
 * Create a payslip for a user (HR Admin only)
 */
export async function createPayslip(
  payslipData: {
    user_id: string;
    month: number;
    year: number;
    gross_salary: number;
    net_salary: number;
    deductions?: Record<string, any>;
    allowances?: Record<string, any>;
    pdf_url: string;
    file_name: string;
    file_size?: number;
  }
): Promise<{ data?: Payslip; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'You must be logged in' };
    }

    // Check if user is HR admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'hr_admin') {
      return { error: 'Only HR admins can create payslips' };
    }

    // Insert payslip
    const payslipInsert: PayslipInsert = {
      user_id: payslipData.user_id,
      month: payslipData.month,
      year: payslipData.year,
      gross_salary: payslipData.gross_salary,
      net_salary: payslipData.net_salary,
      deductions: payslipData.deductions || null,
      allowances: payslipData.allowances || null,
      pdf_url: payslipData.pdf_url,
      file_name: payslipData.file_name,
      file_size: payslipData.file_size || null,
      generated_by: user.id,
    };

    const { data: payslip, error: insertError } = await supabase
      .from('payslips')
      .insert(payslipInsert)
      .select()
      .single();

    if (insertError || !payslip) {
      console.error('[createPayslip] Error creating payslip:', insertError);
      return { error: 'Failed to create payslip' };
    }

    // Create notification for the employee
    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[payslipData.month - 1];

      const notificationResult = await createNotification({
        user_id: payslipData.user_id,
        type: 'payslip_ready',
        title: 'Your payslip is ready',
        description: `Your ${monthName} ${payslipData.year} payslip is now available to view.`,
        related_entity_type: 'payslip',
        related_entity_id: payslip.id,
      });
      if (!notificationResult.success) {
        console.error('[createPayslip] Failed to create notification:', notificationResult.error);
      }
    } catch (notificationError) {
      // Log error but don't fail the payslip creation
      console.error('[createPayslip] Error creating notification:', notificationError);
    }

    // Invalidate cache tags
    revalidateTag('payslips', 'max');
    revalidateTag(`user-${payslipData.user_id}`, 'max');
    revalidateTag('activities', 'max');

    return { data: payslip };
  } catch (error) {
    console.error('[createPayslip] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Get payslips for the current user
 */
export async function getPayslips(): Promise<{ data?: Payslip[]; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'You must be logged in' };
    }

    // Get payslips for the user
    const { data: payslips, error } = await supabase
      .from('payslips')
      .select('*')
      .eq('user_id', user.id)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) {
      console.error('[getPayslips] Error fetching payslips:', error);
      return { error: 'Failed to fetch payslips' };
    }

    return { data: payslips || [] };
  } catch (error) {
    console.error('[getPayslips] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Get a single payslip by ID
 */
export async function getPayslip(
  payslipId: string
): Promise<{ data?: Payslip; error?: string }> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'You must be logged in' };
    }

    // Get payslip
    const { data: payslip, error } = await supabase
      .from('payslips')
      .select('*')
      .eq('id', payslipId)
      .eq('user_id', user.id) // Ensure user can only access their own payslips
      .single();

    if (error || !payslip) {
      console.error('[getPayslip] Error fetching payslip:', error);
      return { error: 'Payslip not found' };
    }

    return { data: payslip };
  } catch (error) {
    console.error('[getPayslip] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}


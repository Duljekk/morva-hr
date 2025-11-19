/**
 * Script to approve a leave request by UUID
 * Usage: npx tsx scripts/approve-leave-request.ts <request-id> [hr-admin-id]
 * 
 * This script uses the Supabase service role key to bypass RLS policies
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL environment variable is required');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('   This key can be found in your Supabase project settings under API');
  process.exit(1);
}

// Create admin client with service role key (bypasses RLS)
const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function approveLeaveRequest(requestId: string, hrAdminId?: string) {
  try {
    console.log(`\n🔍 Checking leave request: ${requestId}`);

    // First, get the current status
    const { data: request, error: fetchError } = await supabase
      .from('leave_requests')
      .select('id, status, user_id, approved_by, approved_at')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      console.error('❌ Error fetching leave request:', fetchError?.message || 'Request not found');
      process.exit(1);
    }

    console.log(`📋 Current status: ${request.status}`);
    
    if (request.status === 'approved') {
      console.log('✅ Leave request is already approved');
      console.log(`   Approved by: ${request.approved_by}`);
      console.log(`   Approved at: ${request.approved_at}`);
      return;
    }

    if (request.status !== 'pending') {
      console.error(`❌ Cannot approve request with status: ${request.status}`);
      console.error('   Only pending requests can be approved');
      process.exit(1);
    }

    // Get HR admin ID if not provided
    let adminId = hrAdminId;
    if (!adminId) {
      console.log('🔍 Finding HR admin user...');
      const { data: hrAdmins, error: adminError } = await supabase
        .from('users')
        .select('id, email')
        .eq('role', 'hr_admin')
        .limit(1);

      if (adminError || !hrAdmins || hrAdmins.length === 0) {
        console.error('❌ Error finding HR admin:', adminError?.message || 'No HR admin found');
        process.exit(1);
      }

      adminId = hrAdmins[0].id;
      console.log(`✅ Found HR admin: ${hrAdmins[0].email} (${adminId})`);
    }

    // Approve the request
    console.log(`\n🔄 Approving leave request...`);
    const { data: updated, error: updateError } = await supabase
      .from('leave_requests')
      .update({
        status: 'approved',
        approved_by: adminId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('status', 'pending')
      .select()
      .single();

    if (updateError || !updated) {
      console.error('❌ Error approving request:', updateError?.message || 'Update failed');
      console.error('   The request may have already been processed');
      process.exit(1);
    }

    console.log('✅ Leave request approved successfully!');
    console.log(`   Request ID: ${updated.id}`);
    console.log(`   Status: ${updated.status}`);
    console.log(`   Approved by: ${updated.approved_by}`);
    console.log(`   Approved at: ${updated.approved_at}`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Get request ID from command line arguments
const requestId = process.argv[2];
const hrAdminId = process.argv[3];

if (!requestId) {
  console.error('❌ Usage: npx tsx scripts/approve-leave-request.ts <request-id> [hr-admin-id]');
  process.exit(1);
}

approveLeaveRequest(requestId, hrAdminId);





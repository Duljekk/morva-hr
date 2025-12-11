/**
 * API route for fetching notifications
 * Uses service role key to bypass PostgREST schema cache issues
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or headers
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use service role key to bypass PostgREST schema cache
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      console.error('[API /notifications] Missing NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json(
        { error: 'Server configuration error: NEXT_PUBLIC_SUPABASE_URL not set' },
        { status: 500 }
      );
    }

    if (!serviceRoleKey) {
      console.warn('[API /notifications] SUPABASE_SERVICE_ROLE_KEY not set. API route cannot bypass PostgREST schema cache.');
      console.warn('[API /notifications] Please set SUPABASE_SERVICE_ROLE_KEY in your .env.local file to enable API route fallback.');
      return NextResponse.json(
        { 
          error: 'API route fallback not configured. SUPABASE_SERVICE_ROLE_KEY is required.',
          hint: 'Set SUPABASE_SERVICE_ROLE_KEY in .env.local to enable API route fallback, or wait for PostgREST schema cache to refresh (1-2 minutes)'
        },
        { status: 503 } // Service Unavailable - temporary issue
      );
    }

    // Create Supabase client with service role key (bypasses RLS, but still uses PostgREST)
    const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false, // Prevent accidental client-side exposure
      },
    });

    // Strategy: RPC functions are often in cache even when tables aren't
    // Try RPC function first (best practice from Supabase docs)
    let notifications = null;
    let error = null;
    
    console.log('[API /notifications] Attempting RPC function first (recommended approach)...');
    const { data: rpcData, error: rpcError } = await (supabase.rpc as any)('get_user_notifications', {
      p_user_id: userId,
    });
    
    if (!rpcError && rpcData && Array.isArray(rpcData)) {
      notifications = rpcData;
      console.log('[API /notifications] ✅ Fetched via RPC function:', notifications.length);
    } else if (rpcError) {
      console.warn('[API /notifications] RPC function error:', {
        code: rpcError.code,
        message: rpcError.message,
        hint: rpcError.hint,
      });
      
      // If RPC also has schema cache error, try direct query as fallback
      if (rpcError.code === 'PGRST202' || rpcError.message?.includes('schema cache')) {
        console.warn('[API /notifications] RPC also has schema cache issue, trying direct query...');
        
        const { data: queryData, error: queryError } = await supabase
          .from('notifications')
          .select('id, user_id, type, title, description, related_entity_type, related_entity_id, is_read, read_at, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        notifications = queryData;
        error = queryError;
      } else {
        // Non-cache error from RPC, return it
        error = rpcError;
      }
    } else {
      // RPC returned null/undefined, try direct query
      console.warn('[API /notifications] RPC returned null, trying direct query...');
      const { data: queryData, error: queryError } = await supabase
        .from('notifications')
        .select('id, user_id, type, title, description, related_entity_type, related_entity_id, is_read, read_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      notifications = queryData;
      error = queryError;
    }

    if (error) {
      console.error('[API /notifications] Error fetching notifications:', error);
      // Even with service role key, schema cache errors can occur
      if (error.code === 'PGRST205' || error.code === 'PGRST116' || 
          error.message?.includes('schema cache')) {
        console.error('[API /notifications] ⚠️ Schema cache error persists even with service role key');
        console.error('[API /notifications] PostgREST needs to refresh its schema cache');
      }
      return NextResponse.json(
        { error: error.message || 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: notifications || [] });
  } catch (error) {
    console.error('[API /notifications] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}


'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * AUTH ACTIONS
 * 
 * Server actions for authentication operations.
 * These handle server-side cookie management for proper SSR support.
 */

/**
 * Sign out the current user
 * This properly clears server-side cookies that middleware reads
 * Returns success/error status - client should handle redirect
 */
export async function signOut() {
  try {
    const supabase = await createClient();
    
    // Sign out - this will clear the session and cookies on the server side
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Server signOut error:', error);
      return { error: error.message };
    }
    
    console.log('✅ Server signOut successful - cookies cleared');
    return { success: true };
  } catch (error) {
    console.error('❌ Unexpected error during server sign out:', error);
    return { error: 'Failed to sign out' };
  }
}


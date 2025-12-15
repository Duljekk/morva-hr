import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for use in Server Components and Server Actions
 * This client uses server-side cookies for session management
 * 
 * Note: Database generic removed to avoid type mismatches with actual DB schema
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase client with service role key for system operations
 * This client bypasses Row Level Security (RLS) policies
 * 
 * ⚠️ WARNING: Only use this for trusted server-side operations
 * Never expose the service role key to the client
 * 
 * @returns Supabase client with service role key, or null if key is not configured
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('[createServiceRoleClient] NEXT_PUBLIC_SUPABASE_URL is not set');
    return null;
  }

  if (!serviceRoleKey) {
    console.warn('[createServiceRoleClient] SUPABASE_SERVICE_ROLE_KEY is not set. Service role operations will fail.');
    return null;
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false, // Prevent accidental client-side exposure
    },
  });
}

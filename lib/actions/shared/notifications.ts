'use server';

/**
 * Server actions for notification management
 * Handles fetching, marking as read, and creating notifications
 * 
 * Location: lib/actions/shared/ - Accessible by both employee and HR roles
 */

import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';
import { getUserPushSubscriptions } from '../pushNotifications';
import { sendPushNotificationsToSubscriptions } from '@/lib/utils/sendPushNotification';

// Notification type enum matching database
export type NotificationType = 
  | 'leave_approved' 
  | 'leave_rejected' 
  | 'leave_sent' 
  | 'payslip_ready' 
  | 'announcement' 
  | 'attendance_reminder';

// Notification interface matching database schema
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  description: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// Data for creating a notification
interface CreateNotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  description: string;
  related_entity_type?: string;
  related_entity_id?: string;
}

/**
 * GET NOTIFICATIONS (Uncached implementation)
 * Fetches all notifications for a user, ordered by created_at DESC
 * Note: This function creates its own Supabase client to avoid cookies() in cache
 */
async function _getNotificationsUncached(
  userId: string
): Promise<{ data?: Notification[]; error?: string }> {
  const supabase = await createClient();
  
  // Strategy: Try multiple approaches in order of preference
  // 1. Try RPC function first (often in cache even when table isn't)
  console.log('[getNotifications] Trying RPC function first for user:', userId);
  try {
    const { data: rpcNotifications, error: rpcError } = await supabase.rpc('get_user_notifications', {
      p_user_id: userId,
    });
    
    if (!rpcError && rpcNotifications && Array.isArray(rpcNotifications)) {
      console.log('[getNotifications] ✅ Fetched notifications via RPC function:', rpcNotifications.length);
      return { data: rpcNotifications as Notification[] };
    }
    
    if (rpcError && rpcError.code !== 'PGRST202') {
      // If it's not a schema cache error, log it but continue
      console.warn('[getNotifications] RPC function error (non-cache):', rpcError.message);
    }
  } catch (rpcErr) {
    console.warn('[getNotifications] RPC function exception, trying direct query...');
  }
  
  // 2. Try view (sometimes picked up faster by PostgREST)
  console.log('[getNotifications] Trying view as fallback for user:', userId);
  try {
    const { data: viewNotifications, error: viewError } = await supabase
      .from('notifications_view')
      .select('id, user_id, type, title, description, related_entity_type, related_entity_id, is_read, read_at, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!viewError && viewNotifications) {
      console.log('[getNotifications] ✅ Fetched notifications via view:', viewNotifications.length);
      return { data: viewNotifications as Notification[] };
    }
  } catch (viewErr) {
    console.warn('[getNotifications] View query exception, trying direct table...');
  }
  
  // 3. Try direct table query (fastest if schema cache is ready)
  console.log('[getNotifications] Trying direct table query for user:', userId);
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('id, user_id, type, title, description, related_entity_type, related_entity_id, is_read, read_at, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error && notifications) {
      console.log('[getNotifications] ✅ Fetched notifications via direct query:', notifications.length);
      return { data: notifications as Notification[] };
    }
    
    // If schema cache error, try API route as fallback (uses service role key)
    if (error && (error.code === 'PGRST205' || error.code === 'PGRST116' || 
        error.message?.includes('schema cache') || 
        error.message?.includes('Could not find the table'))) {
      console.warn('[getNotifications] ⚠️ PostgREST schema cache error detected, trying API route fallback...');
      
      try {
        // Use API route that bypasses PostgREST schema cache
        // In server actions, we need to use the full URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const apiUrl = `${baseUrl}/api/notifications?userId=${encodeURIComponent(userId)}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // Ensure fresh data
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.data && Array.isArray(result.data)) {
            console.log('[getNotifications] ✅ Fetched notifications via API route (bypassing schema cache):', result.data.length);
            return { data: result.data as Notification[] };
          }
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          if (response.status === 503) {
            // Service Unavailable - API route not configured (missing service role key)
            console.warn('[getNotifications] API route fallback not available:', errorData.hint || errorData.error);
            console.warn('[getNotifications] Waiting for PostgREST schema cache to refresh...');
          } else {
            console.error('[getNotifications] API route error:', response.status, errorData);
          }
        }
      } catch (apiError) {
        console.error('[getNotifications] API route exception:', apiError);
      }
      
      // If API route also fails, return empty array with helpful message
      console.warn('[getNotifications] ⚠️ PostgREST schema cache error detected.');
      console.warn('[getNotifications] The notifications table exists in the database but PostgREST hasn\'t refreshed its schema cache yet.');
      console.warn('[getNotifications] An event trigger has been created to auto-refresh the cache on future schema changes.');
      console.warn('[getNotifications] PostgREST should refresh within 1-2 minutes, or restart your Supabase project to force a refresh.');
      console.warn('[getNotifications] Returning empty array for now. Notifications will appear once PostgREST refreshes.');
      
      return { data: [] };
    }
    
    if (error) {
      console.error('[getNotifications] Direct query error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        userId,
      });
      
      if (error.code === '42501') {
        return { error: 'Permission denied. Please check RLS policies.' };
      }
      
      return { error: `Failed to fetch notifications: ${error.message || 'Unknown error'}` };
    }
    
    return { data: notifications as Notification[] || [] };
  } catch (queryError) {
    console.error('[getNotifications] Direct query exception:', {
      error: queryError instanceof Error ? queryError.message : String(queryError),
      stack: queryError instanceof Error ? queryError.stack : undefined,
    });
    return { data: [] };
  }
}

/**
 * GET NOTIFICATIONS (Public function)
 * Fetches all notifications for the current user
 * 
 * Note: Caching removed because createClient() uses cookies() which cannot be used
 * inside unstable_cache(). Real-time subscriptions will keep data fresh anyway.
 * 
 * Uses RPC function fallback when PostgREST schema cache hasn't refreshed yet.
 */
export async function getNotifications(): Promise<{ 
  data?: Notification[]; 
  error?: string 
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('[getNotifications] Auth error:', {
        authError: authError?.message,
        hasUser: !!user,
      });
      return { error: 'Not authenticated. Please log in again.' };
    }
    
    console.log('[getNotifications] Fetching notifications for user:', user.id);
    
    // Try direct query first (this will use RPC fallback internally if schema cache error)
    const result = await _getNotificationsUncached(user.id);
    
    // Return the result (RPC fallback is already handled in _getNotificationsUncached)
    return result;
  } catch (error) {
    console.error('[getNotifications] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { error: `Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

/**
 * GET UNREAD NOTIFICATION COUNT (Uncached implementation)
 */
async function _getUnreadNotificationCountUncached(
  userId: string
): Promise<{ data?: number; error?: string }> {
  const supabase = await createClient();
  
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) {
    console.error('[getUnreadNotificationCount] Error fetching count:', error);
    return { error: 'Failed to fetch unread count' };
  }
  
  return { data: count || 0 };
}

/**
 * GET UNREAD NOTIFICATION COUNT (Public function)
 * Returns count of unread notifications for the current user
 * 
 * Note: Caching removed because createClient() uses cookies() which cannot be used
 * inside unstable_cache(). Real-time subscriptions will keep data fresh anyway.
 */
export async function getUnreadNotificationCount(): Promise<{ 
  data?: number; 
  error?: string 
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: 'Not authenticated' };
    }
    
    // Direct call (no caching to avoid cookies() issue)
    // Real-time subscriptions will keep the UI updated anyway
    return await _getUnreadNotificationCountUncached(user.id);
  } catch (error) {
    console.error('[getUnreadNotificationCount] Unexpected error:', error);
    return { error: 'Failed to fetch unread count' };
  }
}

/**
 * MARK NOTIFICATION AS READ
 * Marks a single notification as read
 * 
 * Best Practice: RLS policy ensures users can only update their own notifications,
 * so we can rely on RLS for security instead of double-checking ownership
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Best Practice: RLS policy handles security, so we can directly update
    // The RLS policy will prevent updating notifications that don't belong to the user
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId);
      // Note: RLS policy ensures user can only update their own notifications
    
    if (updateError) {
      // Check if it's a permission error (notification doesn't belong to user)
      if (updateError.code === '42501' || updateError.message?.includes('permission')) {
        return { success: false, error: 'Notification not found or unauthorized' };
      }
      console.error('[markNotificationAsRead] Error updating notification:', updateError);
      return { success: false, error: 'Failed to mark notification as read' };
    }
    
    // Invalidate cache tags
    revalidateTag('notifications', 'max');
    revalidateTag(`user-${user.id}`, 'max');
    
    return { success: true };
  } catch (error) {
    console.error('[markNotificationAsRead] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * MARK ALL NOTIFICATIONS AS READ
 * Marks all unread notifications for the current user as read
 * 
 * Best Practice: RLS policy ensures users can only update their own notifications,
 * so we can rely on RLS for security
 */
export async function markAllNotificationsAsRead(): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Bulk update all unread notifications
    // Best Practice: RLS policy handles security, so we can filter by is_read only
    // The RLS policy will automatically filter to user's own notifications
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('is_read', false);
      // Note: RLS policy ensures user can only update their own notifications
    
    if (updateError) {
      console.error('[markAllNotificationsAsRead] Error updating notifications:', updateError);
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
    
    // Invalidate cache tags
    revalidateTag('notifications', 'max');
    revalidateTag(`user-${user.id}`, 'max');
    
    return { success: true };
  } catch (error) {
    console.error('[markAllNotificationsAsRead] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * DELETE NOTIFICATION
 * Deletes a notification (hard delete)
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Verify notification belongs to user (security check)
    const { data: notification, error: fetchError } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', notificationId)
      .single();
    
    if (fetchError || !notification) {
      return { success: false, error: 'Notification not found' };
    }
    
    if (notification.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Delete notification
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user.id); // Extra security check
    
    if (deleteError) {
      console.error('[deleteNotification] Error deleting notification:', deleteError);
      return { success: false, error: 'Failed to delete notification' };
    }
    
    // Invalidate cache tags
    revalidateTag('notifications', 'max');
    revalidateTag(`user-${user.id}`, 'max');
    
    return { success: true };
  } catch (error) {
    console.error('[deleteNotification] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * CREATE NOTIFICATION (Internal helper function)
 * Creates a notification in the database
 * Used by other server actions (leaves, payslips, etc.)
 * Errors are logged but don't throw (graceful degradation)
 */
export async function createNotification(
  data: CreateNotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[createNotification] Creating notification:', {
      user_id: data.user_id,
      type: data.type,
      title: data.title,
    });
    
    // Use service role client for system operations (bypasses RLS)
    // This allows creating notifications for any user, not just the current authenticated user
    const supabase = createServiceRoleClient();
    
    if (!supabase) {
      console.error('[createNotification] Service role client not available. SUPABASE_SERVICE_ROLE_KEY may not be set.');
      // Fallback to regular client (may fail due to RLS, but better than nothing)
      const fallbackSupabase = await createClient();
      const { data: insertedNotification, error } = await fallbackSupabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          type: data.type,
          title: data.title,
          description: data.description,
          related_entity_type: data.related_entity_type || null,
          related_entity_id: data.related_entity_id || null,
        })
        .select()
        .single();
      
      if (error) {
        const errorMessage = error.message || 'Unknown error';
        console.error('[createNotification] Error creating notification (fallback):', {
          message: errorMessage,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        return { success: false, error: `Failed to create notification: ${errorMessage}. Please ensure SUPABASE_SERVICE_ROLE_KEY is set in .env.local` };
      }
      
      if (!insertedNotification) {
        console.error('[createNotification] No notification returned after insert (fallback)');
        return { success: false, error: 'Notification insert succeeded but no data returned' };
      }
      
      // Continue with success path below
      console.log('[createNotification] ✅ Notification created successfully (fallback):', {
        id: insertedNotification.id,
        user_id: data.user_id,
        type: data.type,
      });
      
      // Invalidate cache tags for the user
      revalidateTag('notifications', 'max');
      revalidateTag(`user-${data.user_id}`, 'max');

      // Send push notification if user has subscriptions
      sendPushNotificationForUser(data.user_id, {
        title: data.title,
        body: data.description,
        notificationId: insertedNotification.id,
        relatedEntityType: data.related_entity_type || undefined,
        relatedEntityId: data.related_entity_id || undefined,
      }).catch((error) => {
        console.error('[createNotification] Error sending push notification:', error);
      });
      
      return { success: true };
    }
    
    const { data: insertedNotification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        description: data.description,
        related_entity_type: data.related_entity_type || null,
        related_entity_id: data.related_entity_id || null,
      })
      .select()
      .single();
    
    if (error) {
      const errorMessage = error.message || 'Unknown error';
      const errorDetails = {
        message: errorMessage,
        details: error.details,
        hint: error.hint,
        code: error.code,
        data: {
          user_id: data.user_id,
          type: data.type,
          title: data.title,
        },
      };
      
      console.error('[createNotification] Error creating notification:', errorDetails);
      
      // If it's a schema cache error, try using the PostgreSQL function as fallback
      if (error.code === 'PGRST116' || error.code === 'PGRST205' ||
          errorMessage.includes('schema cache') || 
          errorMessage.includes('Could not find the table')) {
        console.error('[createNotification] ⚠️ SCHEMA CACHE ERROR - Trying PostgreSQL function fallback...');
        console.error('[createNotification] Error code:', error.code);
        
        // Try using the PostgreSQL function to bypass PostgREST schema cache
        // Use service role client for RPC as well
        const rpcSupabase = createServiceRoleClient() || supabase;
        try {
          const { data: functionResult, error: rpcError } = await rpcSupabase.rpc('insert_notification', {
            p_user_id: data.user_id,
            p_type: data.type,
            p_title: data.title,
            p_description: data.description,
            p_related_entity_type: data.related_entity_type || null,
            p_related_entity_id: data.related_entity_id || null,
          });
          
          if (rpcError) {
            console.error('[createNotification] RPC function also failed:', rpcError);
            return { success: false, error: `Schema cache error and RPC fallback failed: ${rpcError.message}` };
          }
          
          if (functionResult) {
            console.log('[createNotification] ✅ Notification created via RPC function:', {
              id: functionResult,
              user_id: data.user_id,
            });
            
            // Invalidate cache tags
            revalidateTag('notifications', 'max');
            revalidateTag(`user-${data.user_id}`, 'max');
            
            // Send push notification
            sendPushNotificationForUser(data.user_id, {
              title: data.title,
              body: data.description,
              notificationId: functionResult,
              relatedEntityType: data.related_entity_type || undefined,
              relatedEntityId: data.related_entity_id || undefined,
            }).catch((error) => {
              console.error('[createNotification] Error sending push notification:', error);
            });
            
            return { success: true };
          }
        } catch (rpcError) {
          console.error('[createNotification] RPC function error:', rpcError);
          return { success: false, error: `Schema cache error and RPC fallback failed: ${rpcError instanceof Error ? rpcError.message : String(rpcError)}` };
        }
      }
      
      // If it's a foreign key constraint error, log it prominently
      if (error.code === '23503' || errorMessage.includes('foreign key')) {
        console.error('[createNotification] ⚠️ FOREIGN KEY ERROR - User may not exist in auth.users. User ID:', data.user_id);
        console.error('[createNotification] This usually means the user was deleted or the foreign key constraint is misconfigured.');
      }
      
      return { success: false, error: errorMessage };
    }
    
    if (!insertedNotification) {
      console.error('[createNotification] No notification returned after insert');
      return { success: false, error: 'Notification insert succeeded but no data returned' };
    }
    
    console.log('[createNotification] ✅ Notification created successfully:', {
      id: insertedNotification.id,
      user_id: data.user_id,
      type: data.type,
    });
    
    // Invalidate cache tags for the user
    revalidateTag('notifications', 'max');
    revalidateTag(`user-${data.user_id}`, 'max');

    // Send push notification if user has subscriptions
    // This is done asynchronously and errors are logged but don't affect the main operation
    sendPushNotificationForUser(data.user_id, {
      title: data.title,
      body: data.description,
      notificationId: insertedNotification.id,
      relatedEntityType: data.related_entity_type || undefined,
      relatedEntityId: data.related_entity_id || undefined,
    }).catch((error) => {
      console.error('[createNotification] Error sending push notification:', error);
      // Don't throw - push notification failure shouldn't break main operation
    });
    
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[createNotification] Unexpected error:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      data: {
        user_id: data.user_id,
        type: data.type,
        title: data.title,
      },
    });
    return { success: false, error: errorMessage };
  }
}

/**
 * Send push notification to user's subscriptions
 * Internal helper function
 */
async function sendPushNotificationForUser(
  userId: string,
  payload: {
    title: string;
    body: string;
    notificationId?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  }
): Promise<void> {
  try {
    // Get user's push subscriptions
    const subscriptionsResult = await getUserPushSubscriptions(userId);
    if (subscriptionsResult.error || !subscriptionsResult.data || subscriptionsResult.data.length === 0) {
      // No subscriptions, skip push notification
      return;
    }

    // Get VAPID keys from environment variables
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:notifications@morvahr.com';

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('[sendPushNotificationForUser] VAPID keys not configured, skipping push notification');
      return;
    }

    // Convert subscriptions to the format expected by sendPushNotificationsToSubscriptions
    const subscriptions = subscriptionsResult.data.map((sub) => ({
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    }));

    // Send push notifications
    const result = await sendPushNotificationsToSubscriptions(
      subscriptions,
      {
        title: payload.title,
        body: payload.body,
        url: '/notifications',
        notificationId: payload.notificationId,
        relatedEntityType: payload.relatedEntityType,
        relatedEntityId: payload.relatedEntityId,
        tag: 'notification',
      },
      vapidPublicKey,
      vapidPrivateKey,
      vapidSubject
    );

    if (result.failed > 0) {
      console.warn(`[sendPushNotificationForUser] ${result.failed} push notifications failed:`, result.errors);
    }
  } catch (error) {
    console.error('[sendPushNotificationForUser] Error sending push notifications:', error);
    // Don't throw - graceful degradation
  }
}


















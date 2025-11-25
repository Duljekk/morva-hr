'use server';

/**
 * Server actions for push notification subscription management
 * Handles storing and retrieving push subscriptions
 */

import { createClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Save push subscription for current user
 */
export async function savePushSubscription(
  subscription: PushSubscriptionData
): Promise<{ success: boolean; error?: string }> {
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

    // Get user agent for tracking
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;

    // Upsert subscription (update if exists, insert if new)
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          user_agent: userAgent,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,endpoint',
        }
      );

    if (error) {
      console.error('[savePushSubscription] Error saving subscription:', error);
      return { success: false, error: 'Failed to save subscription' };
    }

    // Invalidate cache
    revalidateTag('push-subscriptions', 'max');
    revalidateTag(`user-${user.id}`, 'max');

    return { success: true };
  } catch (error) {
    console.error('[savePushSubscription] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Remove push subscription for current user
 */
export async function removePushSubscription(
  endpoint: string
): Promise<{ success: boolean; error?: string }> {
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

    // Delete subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint);

    if (error) {
      console.error('[removePushSubscription] Error removing subscription:', error);
      return { success: false, error: 'Failed to remove subscription' };
    }

    // Invalidate cache
    revalidateTag('push-subscriptions', 'max');
    revalidateTag(`user-${user.id}`, 'max');

    return { success: true };
  } catch (error) {
    console.error('[removePushSubscription] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get all push subscriptions for a user (for sending notifications)
 * Internal function used by notification sending logic
 */
export async function getUserPushSubscriptions(
  userId: string
): Promise<{ data?: Array<{ endpoint: string; p256dh: string; auth: string }>; error?: string }> {
  try {
    const supabase = await createClient();

    // Get subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', userId);

    if (error) {
      console.error('[getUserPushSubscriptions] Error fetching subscriptions:', error);
      return { error: 'Failed to fetch subscriptions' };
    }

    return { data: subscriptions || [] };
  } catch (error) {
    console.error('[getUserPushSubscriptions] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}













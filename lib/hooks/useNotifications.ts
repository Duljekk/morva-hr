'use client';

/**
 * Custom hook for real-time notification subscriptions
 * Uses Supabase Realtime to listen for notification changes
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  getNotifications, 
  getUnreadNotificationCount,
  type Notification 
} from '@/lib/actions/shared/notifications';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseNotificationsOptions {
  /**
   * Whether to automatically fetch notifications on mount
   * @default true
   */
  autoFetch?: boolean;
  
  /**
   * Whether to enable real-time subscriptions
   * @default true
   */
  enableRealtime?: boolean;
  
  /**
   * Callback when a new notification is received
   */
  onNewNotification?: (notification: Notification) => void;
  
  /**
   * Callback when a notification is updated (e.g., marked as read)
   */
  onNotificationUpdate?: (notification: Notification) => void;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

/**
 * Custom hook for managing notifications with real-time updates
 * 
 * Features:
 * - Fetches notifications and unread count on mount
 * - Subscribes to real-time changes (INSERT, UPDATE)
 * - Automatically updates state when notifications change
 * - Handles cleanup on unmount
 * 
 * @param options Configuration options
 * @returns Notifications state and refresh functions
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const {
    autoFetch = true,
    enableRealtime = true,
    onNewNotification,
    onNotificationUpdate,
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  // Best Practice: Create client once per component instance
  // Using useMemo to avoid recreating client on every render
  const supabase = useMemo(() => createClient(), []);
  const isSubscribedRef = useRef<boolean>(false);

  // Fetch notifications
  const refreshNotifications = useCallback(async () => {
    try {
      setError(null);
      const result = await getNotifications();
      
      if (result.error) {
        setError(result.error);
        setNotifications([]);
      } else {
        setNotifications(result.data || []);
      }
    } catch (err) {
      console.error('[useNotifications] Error fetching notifications:', err);
      setError('Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadNotificationCount();
      
      if (result.error) {
        console.error('[useNotifications] Error fetching unread count:', result.error);
        setUnreadCount(0);
      } else {
        setUnreadCount(result.data || 0);
      }
    } catch (err) {
      console.error('[useNotifications] Error fetching unread count:', err);
      setUnreadCount(0);
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealtime) return;

    let mounted = true;
    let channel: RealtimeChannel | null = null;

    // Get current user ID for filtering
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !mounted) {
        console.log('[useNotifications] No user or component unmounted, skipping real-time subscription');
        return;
      }

      // Prevent multiple subscriptions
      if (isSubscribedRef.current) {
        console.log('[useNotifications] Already subscribed, skipping');
        return;
      }

      const userId = user.id;
      const channelName = `notifications:${userId}`;

      console.log('[useNotifications] Setting up real-time subscription for user:', userId);

      // Create channel with user-specific filter
      // Best Practice: Use proper channel naming and filters as per Supabase docs
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`, // Best Practice: Filter at database level
          },
          (payload) => {
            if (!mounted) return;
            
            console.log('[useNotifications] New notification received:', payload);
            const newNotification = payload.new as Notification;
            
            // Update notifications list
            setNotifications((prev) => {
              // Check if notification already exists (prevent duplicates)
              const exists = prev.some((n) => n.id === newNotification.id);
              if (exists) return prev;
              
              // Add new notification at the beginning (most recent first)
              return [newNotification, ...prev];
            });
            
            // Update unread count
            if (!newNotification.is_read) {
              setUnreadCount((prev) => prev + 1);
            }
            
            // Call callback if provided
            if (onNewNotification) {
              onNewNotification(newNotification);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`, // Best Practice: Filter at database level
          },
          (payload) => {
            if (!mounted) return;
            
            console.log('[useNotifications] Notification updated:', payload);
            const updatedNotification = payload.new as Notification;
            const oldNotification = payload.old as Notification;
            
            // Update notifications list
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === updatedNotification.id ? updatedNotification : n
              )
            );
            
            // Update unread count based on read status change
            if (oldNotification.is_read !== updatedNotification.is_read) {
              if (updatedNotification.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
              } else {
                setUnreadCount((prev) => prev + 1);
              }
            }
            
            // Call callback if provided
            if (onNotificationUpdate) {
              onNotificationUpdate(updatedNotification);
            }
          }
        )
        .subscribe((status) => {
          console.log('[useNotifications] Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
            channelRef.current = channel;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('[useNotifications] Channel error:', status);
            isSubscribedRef.current = false;
          }
        });

      // Store channel reference
      channelRef.current = channel;
    });

    // Cleanup on unmount
    // Best Practice: Properly unsubscribe and remove channel to maintain performance
    // Based on Supabase official examples: https://supabase.com/docs/guides/realtime/getting_started
    return () => {
      mounted = false;
      const channelToCleanup = channelRef.current;
      
      if (channelToCleanup) {
        console.log('[useNotifications] Unmounting, removing channel');
        
        // Clear refs immediately to prevent reuse
        channelRef.current = null;
        isSubscribedRef.current = false;
        
        // Best Practice: Use removeChannel() which handles cleanup internally
        // This is the recommended pattern from Supabase documentation
        try {
          supabase.removeChannel(channelToCleanup);
        } catch (error) {
          console.error('[useNotifications] Error removing channel:', error);
          // Non-fatal: channel cleanup failure won't break the app
        }
      }
    };
  }, [enableRealtime, supabase, onNewNotification, onNotificationUpdate]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      refreshNotifications();
      refreshUnreadCount();
    }
  }, [autoFetch, refreshNotifications, refreshUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    refreshUnreadCount,
  };
}



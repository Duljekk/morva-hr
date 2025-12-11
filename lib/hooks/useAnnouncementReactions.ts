'use client';

/**
 * Custom hook for real-time announcement reaction subscriptions
 * Uses Supabase Realtime to listen for reaction changes (INSERT and DELETE)
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  getAnnouncementReactions,
  addReaction as addReactionAction,
  removeReaction as removeReactionAction,
  toggleReaction as toggleReactionAction,
  type Reaction,
} from '@/lib/actions/shared/announcementReactions';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseAnnouncementReactionsOptions {
  /**
   * Whether to automatically fetch reactions on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Whether to enable real-time subscriptions
   * @default true
   */
  enableRealtime?: boolean;

  /**
   * Callback when a reaction is added
   */
  onReactionAdded?: (emoji: string) => void;

  /**
   * Callback when a reaction is removed
   */
  onReactionRemoved?: (emoji: string) => void;
}

interface UseAnnouncementReactionsReturn {
  reactions: Reaction[];
  loading: boolean;
  error: string | null;
  addReaction: (emoji: string) => Promise<void>;
  removeReaction: (emoji: string) => Promise<void>;
  toggleReaction: (emoji: string) => Promise<void>;
  refreshReactions: () => Promise<void>;
}

/**
 * Custom hook for managing announcement reactions with real-time updates
 *
 * Features:
 * - Fetches reactions on mount
 * - Subscribes to real-time changes (INSERT, DELETE)
 * - Automatically updates state when reactions change
 * - Provides functions to add, remove, and toggle reactions
 * - Handles cleanup on unmount
 *
 * @param announcementId The ID of the announcement to manage reactions for
 * @param options Configuration options
 * @returns Reactions state and management functions
 */
export function useAnnouncementReactions(
  announcementId: string,
  options: UseAnnouncementReactionsOptions = {}
): UseAnnouncementReactionsReturn {
  const {
    autoFetch = true,
    enableRealtime = true,
    onReactionAdded,
    onReactionRemoved,
  } = options;

  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  // Best Practice: Create client once per component instance
  // Using useMemo to avoid recreating client on every render
  const supabase = useMemo(() => createClient(), []);
  const isSubscribedRef = useRef<boolean>(false);
  const announcementIdRef = useRef<string>(announcementId);

  // Update ref when announcementId changes
  useEffect(() => {
    announcementIdRef.current = announcementId;
  }, [announcementId]);

  // Fetch reactions
  const refreshReactions = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await getAnnouncementReactions(announcementIdRef.current);

      if (result.error) {
        setError(result.error);
        setReactions([]);
      } else {
        setReactions(result.data || []);
      }
    } catch (err) {
      console.error('[useAnnouncementReactions] Error fetching reactions:', err);
      setError('Failed to fetch reactions');
      setReactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add reaction
  const addReaction = useCallback(
    async (emoji: string) => {
      try {
        const result = await addReactionAction(announcementIdRef.current, emoji);

        if (!result.success) {
          console.error('[useAnnouncementReactions] Error adding reaction:', result.error);
          setError(result.error || 'Failed to add reaction');
        } else {
          // Optimistic update: refresh reactions to get latest counts
          // Real-time subscription will also update, but this provides immediate feedback
          await refreshReactions();
          if (onReactionAdded) {
            onReactionAdded(emoji);
          }
        }
      } catch (err) {
        console.error('[useAnnouncementReactions] Error adding reaction:', err);
        setError('Failed to add reaction');
      }
    },
    [refreshReactions, onReactionAdded]
  );

  // Remove reaction
  const removeReaction = useCallback(
    async (emoji: string) => {
      try {
        const result = await removeReactionAction(announcementIdRef.current, emoji);

        if (!result.success) {
          console.error('[useAnnouncementReactions] Error removing reaction:', result.error);
          setError(result.error || 'Failed to remove reaction');
        } else {
          // Optimistic update: refresh reactions to get latest counts
          // Real-time subscription will also update, but this provides immediate feedback
          await refreshReactions();
          if (onReactionRemoved) {
            onReactionRemoved(emoji);
          }
        }
      } catch (err) {
        console.error('[useAnnouncementReactions] Error removing reaction:', err);
        setError('Failed to remove reaction');
      }
    },
    [refreshReactions, onReactionRemoved]
  );

  // Toggle reaction
  const toggleReaction = useCallback(
    async (emoji: string) => {
      try {
        const result = await toggleReactionAction(announcementIdRef.current, emoji);

        if (!result.success) {
          console.error('[useAnnouncementReactions] Error toggling reaction:', result.error);
          setError(result.error || 'Failed to toggle reaction');
        } else {
          // Optimistic update: refresh reactions to get latest counts
          // Real-time subscription will also update, but this provides immediate feedback
          await refreshReactions();
        }
      } catch (err) {
        console.error('[useAnnouncementReactions] Error toggling reaction:', err);
        setError('Failed to toggle reaction');
      }
    },
    [refreshReactions]
  );

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealtime || !announcementId) return;

    let mounted = true;
    let channel: RealtimeChannel | null = null;

    // Get current user ID for filtering (optional, but useful for logging)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) {
        console.log('[useAnnouncementReactions] Component unmounted, skipping real-time subscription');
        return;
      }

      // Prevent multiple subscriptions
      // Best Practice: Check channel state instead of ref flag to avoid race conditions
      if ((channelRef.current as any)?.state === 'subscribed') {
        console.log('[useAnnouncementReactions] Already subscribed, skipping');
        return;
      }

      // Best Practice: Use dedicated, granular channel naming for scalability
      // Pattern: `announcement:${announcementId}:reactions`
      const channelName = `announcement:${announcementIdRef.current}:reactions`;

      console.log('[useAnnouncementReactions] Setting up real-time subscription for announcement:', announcementIdRef.current);

      // Create channel with announcement-specific filter
      // Best Practice: Use proper channel naming and filters as per Supabase docs
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'announcement_reactions',
            filter: `announcement_id=eq.${announcementIdRef.current}`, // Best Practice: Filter at database level
          },
          (payload) => {
            if (!mounted) return;

            console.log('[useAnnouncementReactions] New reaction added:', payload);
            const newReaction = payload.new as { emoji: string; user_id: string };

            // Refresh reactions to get updated counts and userReacted status
            // This ensures we have the most up-to-date aggregated data
            refreshReactions().catch((err) => {
              console.error('[useAnnouncementReactions] Error refreshing reactions after INSERT:', err);
              // Surface error to user if refresh fails
              if (mounted) {
                setError('Failed to refresh reactions. Changes may not be visible.');
              }
            });

            // Call callback if provided
            if (onReactionAdded) {
              onReactionAdded(newReaction.emoji);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'announcement_reactions',
            filter: `announcement_id=eq.${announcementIdRef.current}`, // Best Practice: Filter at database level
          },
          (payload) => {
            if (!mounted) return;

            console.log('[useAnnouncementReactions] Reaction removed:', payload);
            const oldReaction = payload.old as { emoji: string; user_id: string };

            // Refresh reactions to get updated counts and userReacted status
            // This ensures we have the most up-to-date aggregated data
            refreshReactions().catch((err) => {
              console.error('[useAnnouncementReactions] Error refreshing reactions after DELETE:', err);
              // Surface error to user if refresh fails
              if (mounted) {
                setError('Failed to refresh reactions. Changes may not be visible.');
              }
            });

            // Call callback if provided
            if (onReactionRemoved) {
              onReactionRemoved(oldReaction.emoji);
            }
          }
        )
        .subscribe((status) => {
          console.log('[useAnnouncementReactions] Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
            channelRef.current = channel;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('[useAnnouncementReactions] Channel error:', status);
            isSubscribedRef.current = false;
          }
        });

      // Store channel reference
      channelRef.current = channel;
    });

    // Cleanup on unmount or when announcementId changes
    // Best Practice: Properly unsubscribe and remove channel to maintain performance
    // Based on Supabase official examples: https://supabase.com/docs/guides/realtime/getting_started
    return () => {
      mounted = false;
      const channelToCleanup = channelRef.current;

      if (channelToCleanup) {
        console.log('[useAnnouncementReactions] Unmounting, removing channel');

        // Clear refs immediately to prevent reuse
        channelRef.current = null;
        isSubscribedRef.current = false;

        // Best Practice: Use removeChannel() which handles cleanup internally
        // This is the recommended pattern from Supabase documentation
        try {
          supabase.removeChannel(channelToCleanup);
        } catch (error) {
          console.error('[useAnnouncementReactions] Error removing channel:', error);
          // Non-fatal: channel cleanup failure won't break the app
        }
      }
    };
  }, [enableRealtime, announcementId, supabase, refreshReactions, onReactionAdded, onReactionRemoved]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch && announcementId) {
      refreshReactions();
    }
  }, [autoFetch, announcementId, refreshReactions]);

  return {
    reactions,
    loading,
    error,
    addReaction,
    removeReaction,
    toggleReaction,
    refreshReactions,
  };
}



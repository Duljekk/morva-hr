'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface UseAnnouncementReactionsOptions {
  enableRealtime?: boolean;
  autoFetch?: boolean;
}

interface UseAnnouncementReactionsReturn {
  reactions: Reaction[];
  loading: boolean;
  error: string | null;
  toggleReaction: (emoji: string) => Promise<void>;
  addReaction: (emoji: string) => Promise<void>;
  removeReaction: (emoji: string) => Promise<void>;
  refreshReactions: () => Promise<void>;
}

/**
 * Hook for managing announcement reactions
 * TODO: Implement full functionality with Supabase realtime subscriptions
 * This is a stub implementation
 */
export function useAnnouncementReactions(
  announcementId: string,
  options: UseAnnouncementReactionsOptions = {}
): UseAnnouncementReactionsReturn {
  const { enableRealtime = false, autoFetch = true } = options;
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addReaction = async (emoji: string) => {
    try {
      // TODO: Implement server action call
      console.log('[useAnnouncementReactions] Add reaction:', emoji);
      
      // Optimistic update
      setReactions((prev) => {
        const existing = prev.find((r) => r.emoji === emoji);
        if (existing) {
          return prev.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count + 1, userReacted: true }
              : r
          );
        } else {
          return [...prev, { emoji, count: 1, userReacted: true }];
        }
      });
    } catch (err) {
      console.error('[useAnnouncementReactions] Error adding reaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to add reaction');
    }
  };

  const removeReaction = async (emoji: string) => {
    try {
      // TODO: Implement server action call
      console.log('[useAnnouncementReactions] Remove reaction:', emoji);
      
      // Optimistic update
      setReactions((prev) =>
        prev
          .map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count - 1, userReacted: false }
              : r
          )
          .filter((r) => r.count > 0)
      );
    } catch (err) {
      console.error('[useAnnouncementReactions] Error removing reaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove reaction');
    }
  };

  const toggleReaction = async (emoji: string) => {
    const existingReaction = reactions.find((r) => r.emoji === emoji);
    if (existingReaction?.userReacted) {
      await removeReaction(emoji);
    } else {
      await addReaction(emoji);
    }
  };

  const refreshReactions = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Implement fetch from server
      console.log('[useAnnouncementReactions] Refresh reactions for:', announcementId);
      setError(null);
    } catch (err) {
      console.error('[useAnnouncementReactions] Error refreshing reactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh reactions');
    } finally {
      setLoading(false);
    }
  }, [announcementId]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      refreshReactions();
    }
  }, [announcementId, autoFetch, refreshReactions]);

  // TODO: Set up realtime subscription if enabled
  useEffect(() => {
    if (enableRealtime) {
      console.log('[useAnnouncementReactions] Realtime enabled for:', announcementId);
      // TODO: Set up Supabase realtime subscription
    }
  }, [announcementId, enableRealtime]);

  return {
    reactions,
    loading,
    error,
    toggleReaction,
    addReaction,
    removeReaction,
    refreshReactions,
  };
}


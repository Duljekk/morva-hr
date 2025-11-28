'use server';

/**
 * Server actions for announcement reaction management
 * Handles fetching, adding, removing, and toggling reactions on announcements
 */

import { createClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

// Reaction interface matching the aggregated query result
export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

// Response type for server actions
export type ReactionResponse = { data?: Reaction[]; error?: string };
export type ToggleReactionResponse = { success: boolean; error?: string };

/**
 * GET ANNOUNCEMENT REACTIONS (Uncached implementation)
 * Fetches all reactions for an announcement, aggregated by emoji
 * Returns count and whether current user has reacted
 */
async function _getAnnouncementReactionsUncached(
  announcementId: string,
  userId: string
): Promise<ReactionResponse> {
  try {
    const supabase = await createClient();

    // Get all reactions for this announcement
    const { data: allReactions, error: reactionsError } = await supabase
      .from('announcement_reactions')
      .select('emoji, user_id')
      .eq('announcement_id', announcementId) as {
        data: Array<{ emoji: string; user_id: string }> | null;
        error: any;
      };

    if (reactionsError) {
      console.error('[getAnnouncementReactions] Error fetching reactions:', reactionsError);
      return { error: 'Failed to fetch reactions' };
    }

    // Aggregate reactions by emoji
    const reactionMap = new Map<string, { count: number; userReacted: boolean }>();

    if (allReactions) {
      for (const reaction of allReactions) {
        const existing = reactionMap.get(reaction.emoji) || { count: 0, userReacted: false };
        existing.count += 1;
        if (reaction.user_id === userId) {
          existing.userReacted = true;
        }
        reactionMap.set(reaction.emoji, existing);
      }
    }

    // Convert map to array of Reaction objects
    const reactions: Reaction[] = Array.from(reactionMap.entries()).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      userReacted: data.userReacted,
    }));

    // Sort by count (descending), then by emoji (ascending) for consistent ordering
    reactions.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.emoji.localeCompare(b.emoji);
    });

    return { data: reactions };
  } catch (error) {
    console.error('[getAnnouncementReactions] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * GET ANNOUNCEMENT REACTIONS (Public function)
 * 
 * Note: Not using unstable_cache() because:
 * 1. It requires user-specific data (userReacted status)
 * 2. Real-time subscriptions will keep data fresh anyway
 * 3. unstable_cache() cannot use cookies() inside cached functions
 * 
 * This follows the same pattern as getNotifications() which also doesn't use caching
 * for similar reasons.
 */
export async function getAnnouncementReactions(
  announcementId: string
): Promise<ReactionResponse> {
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

    // Call uncached function directly
    // Real-time subscriptions will keep the data fresh on the client side
    return await _getAnnouncementReactionsUncached(announcementId, user.id);
  } catch (error) {
    console.error('[getAnnouncementReactions] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * ADD REACTION
 * Adds a reaction to an announcement
 * Uses upsert to handle duplicate reactions gracefully (idempotent)
 */
export async function addReaction(
  announcementId: string,
  emoji: string
): Promise<ToggleReactionResponse> {
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

    // Validate announcement ID is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!announcementId || !uuidRegex.test(announcementId)) {
      return { 
        success: false, 
        error: `Invalid announcement ID format. Expected UUID, got: ${announcementId}` 
      };
    }

    // Validate emoji (basic validation - ensure it's not empty)
    if (!emoji || emoji.trim().length === 0) {
      return { success: false, error: 'Emoji is required' };
    }

    // Use upsert to handle duplicate reactions gracefully
    // The unique constraint will prevent duplicates, but upsert makes it idempotent
    // Type assertion needed until TypeScript picks up the new table type from Database interface
    const { error: insertError } = await supabase
      .from('announcement_reactions' as any)
      .upsert(
        {
          announcement_id: announcementId,
          user_id: user.id,
          emoji: emoji.trim(),
        } as any,
        {
          onConflict: 'announcement_id,user_id,emoji',
        }
      );

    if (insertError) {
      // Check if it's a duplicate key error (user already reacted with this emoji)
      if (insertError.code === '23505') {
        // This is actually fine - user already reacted, return success
        console.log('[addReaction] User already reacted with this emoji, treating as success');
      } else {
        console.error('[addReaction] Error adding reaction:', insertError);
        return { success: false, error: 'Failed to add reaction' };
      }
    }

    // Note: Cache tags are kept for future use if we implement caching
    // Currently not using unstable_cache() due to cookies() restriction
    // but tags are ready if we add caching via other means (e.g., route handlers)
    revalidateTag('announcement-reactions', 'max');
    revalidateTag(`announcement-${announcementId}`, 'max');

    return { success: true };
  } catch (error) {
    console.error('[addReaction] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * REMOVE REACTION
 * Removes a reaction from an announcement
 */
export async function removeReaction(
  announcementId: string,
  emoji: string
): Promise<ToggleReactionResponse> {
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

    // Validate announcement ID is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!announcementId || !uuidRegex.test(announcementId)) {
      return { 
        success: false, 
        error: `Invalid announcement ID format. Expected UUID, got: ${announcementId}` 
      };
    }

    // Validate emoji
    if (!emoji || emoji.trim().length === 0) {
      return { success: false, error: 'Emoji is required' };
    }

    // Delete reaction (RLS will ensure user can only delete their own reactions)
    const { error: deleteError } = await supabase
      .from('announcement_reactions')
      .delete()
      .eq('announcement_id', announcementId)
      .eq('user_id', user.id)
      .eq('emoji', emoji.trim());

    if (deleteError) {
      console.error('[removeReaction] Error removing reaction:', deleteError);
      return { success: false, error: 'Failed to remove reaction' };
    }

    // Note: Cache tags are kept for future use if we implement caching
    // Currently not using unstable_cache() due to cookies() restriction
    // but tags are ready if we add caching via other means (e.g., route handlers)
    revalidateTag('announcement-reactions', 'max');
    revalidateTag(`announcement-${announcementId}`, 'max');

    return { success: true };
  } catch (error) {
    console.error('[removeReaction] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * TOGGLE REACTION
 * Adds a reaction if it doesn't exist, removes it if it does
 * Convenience function for UI interactions
 */
export async function toggleReaction(
  announcementId: string,
  emoji: string
): Promise<ToggleReactionResponse> {
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

    // Validate announcement ID is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!announcementId || !uuidRegex.test(announcementId)) {
      return { 
        success: false, 
        error: `Invalid announcement ID format. Expected UUID, got: ${announcementId}` 
      };
    }

    // Validate emoji
    if (!emoji || emoji.trim().length === 0) {
      return { success: false, error: 'Emoji is required' };
    }

    // Check if user already reacted with this emoji
    const { data: existingReaction, error: checkError } = await supabase
      .from('announcement_reactions')
      .select('id')
      .eq('announcement_id', announcementId)
      .eq('user_id', user.id)
      .eq('emoji', emoji.trim())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine, but other errors are not
      console.error('[toggleReaction] Error checking existing reaction:', checkError);
      return { success: false, error: 'Failed to check reaction status' };
    }

    // If reaction exists, remove it; otherwise, add it
    if (existingReaction) {
      return await removeReaction(announcementId, emoji);
    } else {
      return await addReaction(announcementId, emoji);
    }
  } catch (error) {
    console.error('[toggleReaction] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}


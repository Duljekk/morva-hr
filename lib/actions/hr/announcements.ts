'use server';

/**
 * Server actions for announcement management
 * Handles announcement creation, publishing, and retrieval
 */

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/types';
import { revalidateTag } from 'next/cache';
import { createNotification } from './notifications';

type Announcement = Database['public']['Tables']['announcements']['Row'];
type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert'];

/**
 * Create an announcement (HR Admin only)
 */
export async function createAnnouncement(
  announcementData: {
    title: string;
    content: string;
    scheduled_for?: string | null;
    is_published?: boolean;
  }
): Promise<{ data?: Announcement; error?: string }> {
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

    // Check if user is HR admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'hr_admin') {
      return { error: 'Only HR admins can create announcements' };
    }

    // Insert announcement
    // Note: Using schema column names (scheduled_time, is_active) instead of types (scheduled_for, is_published)
    const announcementInsert = {
      title: announcementData.title,
      content: announcementData.content,
      created_by: user.id,
      scheduled_time: announcementData.scheduled_for || null,
      is_active: announcementData.is_published ?? false,
    };

    const { data: announcement, error: insertError } = await supabase
      .from('announcements')
      .insert(announcementInsert)
      .select()
      .single();

    if (insertError || !announcement) {
      console.error('[createAnnouncement] Error creating announcement:', insertError);
      return { error: 'Failed to create announcement' };
    }

    // If announcement is active immediately, create notifications for all active users
    // Note: Using schema column names (is_active, scheduled_time)
    const isActive = (announcement as any).is_active ?? false;
    const scheduledTime = (announcement as any).scheduled_time;
    if (isActive && (!scheduledTime || new Date(scheduledTime) <= new Date())) {
      try {
        await createAnnouncementNotifications(announcement.id, announcement.title);
      } catch (notificationError) {
        // Log error but don't fail the announcement creation
        console.error('[createAnnouncement] Error creating notifications:', notificationError);
      }
    }

    // Invalidate cache tags
    revalidateTag('announcements', 'max');
    revalidateTag('activities', 'max');

    return { data: announcement };
  } catch (error) {
    console.error('[createAnnouncement] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Publish an announcement (HR Admin only)
 * Creates notifications for all active users
 */
export async function publishAnnouncement(
  announcementId: string
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

    // Check if user is HR admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'hr_admin') {
      return { success: false, error: 'Only HR admins can publish announcements' };
    }

    // Get announcement
    // Note: Using schema column name (is_active) instead of types (is_published)
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('id, title, is_active')
      .eq('id', announcementId)
      .single();

    if (fetchError || !announcement) {
      return { success: false, error: 'Announcement not found' };
    }

    // Update announcement to active (published)
    const { error: updateError } = await supabase
      .from('announcements')
      .update({ is_active: true })
      .eq('id', announcementId);

    if (updateError) {
      console.error('[publishAnnouncement] Error updating announcement:', updateError);
      return { success: false, error: 'Failed to publish announcement' };
    }

    // Create notifications for all active users (if not already active)
    const isActive = (announcement as any).is_active ?? false;
    if (!isActive) {
      try {
        await createAnnouncementNotifications(announcementId, announcement.title);
      } catch (notificationError) {
        // Log error but don't fail the publish operation
        console.error('[publishAnnouncement] Error creating notifications:', notificationError);
      }
    }

    // Invalidate cache tags
    revalidateTag('announcements', 'max');
    revalidateTag('activities', 'max');

    return { success: true };
  } catch (error) {
    console.error('[publishAnnouncement] Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Helper function to create notifications for all active users
 * Uses batch insert for performance
 */
async function createAnnouncementNotifications(
  announcementId: string,
  announcementTitle: string
): Promise<void> {
  try {
    const supabase = await createClient();

    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('is_active', true);

    if (usersError || !users || users.length === 0) {
      console.error('[createAnnouncementNotifications] Error fetching users:', usersError);
      return;
    }

    // Create notifications in batches (Supabase has limits on batch size)
    const batchSize = 100;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const notifications = batch.map((user) => ({
        user_id: user.id,
        type: 'announcement' as const,
        title: 'New announcement',
        description: announcementTitle,
        related_entity_type: 'announcement',
        related_entity_id: announcementId,
      }));

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        console.error(`[createAnnouncementNotifications] Error inserting batch ${i / batchSize + 1}:`, insertError);
        // Continue with next batch even if one fails
      }
    }

    // Invalidate cache tags for all users (broad invalidation)
    // Note: This is a trade-off - we invalidate broadly to ensure all users see updated counts
    revalidateTag('notifications', 'max');
  } catch (error) {
    console.error('[createAnnouncementNotifications] Unexpected error:', error);
    // Don't throw - graceful degradation
  }
}

/**
 * Get active announcements
 */
export async function getActiveAnnouncements(): Promise<{ 
  data?: Announcement[]; 
  error?: string 
}> {
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

    // Get active announcements
    // Note: Using schema column names (is_active, scheduled_time)
    const now = new Date().toISOString();
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .or(`scheduled_time.is.null,scheduled_time.lte.${now}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getActiveAnnouncements] Error fetching announcements:', error);
      return { error: 'Failed to fetch announcements' };
    }

    return { data: announcements || [] };
  } catch (error) {
    console.error('[getActiveAnnouncements] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Get all announcements (HR Admin only)
 */
export async function getAllAnnouncements(): Promise<{ 
  data?: Announcement[]; 
  error?: string 
}> {
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

    // Check if user is HR admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'hr_admin') {
      return { error: 'Only HR admins can view all announcements' };
    }

    // Get all announcements
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getAllAnnouncements] Error fetching announcements:', error);
      return { error: 'Failed to fetch announcements' };
    }

    return { data: announcements || [] };
  } catch (error) {
    console.error('[getAllAnnouncements] Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}


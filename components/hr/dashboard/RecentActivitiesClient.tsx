'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import RecentActivitiesCard from './RecentActivitiesCard';
import RecentActivitiesSkeleton from './RecentActivitiesSkeleton';
import { getRecentActivitiesForDashboard, type RecentActivity } from '@/lib/actions/hr/dashboard';
import { useToast } from '@/app/contexts/ToastContext';

export interface RecentActivitiesClientProps {
  /**
   * Initial count of items from server-side fetch.
   * Used to show accurate skeleton loading that matches the actual data count.
   */
  initialCount?: number;
}

/**
 * RecentActivitiesClient
 *
 * Client-side wrapper that:
 * - Fetches recent activities (announcements, payslips, leave requests) via server action
 * - Manages loading and error states
 * - Caches successful results to prevent unnecessary refetches
 * - Falls back to RecentActivitiesCard's placeholders when no data
 * - Uses initialCount from server to show accurate skeleton loading
 */
export default function RecentActivitiesClient({ initialCount = 3 }: RecentActivitiesClientProps) {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { showToast } = useToast();
  
  // Cache the last successful fetch timestamp to prevent unnecessary refetches
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef(false);

  // Memoize the load function to prevent unnecessary refetches
  // Note: We don't include activities.length in deps to avoid infinite loops
  // The cache check inside handles preventing unnecessary refetches
  const loadData = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    
    // Cache: Don't refetch if we fetched recently (within last 30 seconds)
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;
    const CACHE_DURATION = 30000; // 30 seconds
    
    if (timeSinceLastFetch < CACHE_DURATION && lastFetchRef.current > 0) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(undefined);

    try {
      const result = await getRecentActivitiesForDashboard(initialCount);

      if (result.error) {
        setError(result.error);
        setActivities([]);
        showToast('danger', 'Error', `Failed to load recent activities: ${result.error}`);
        return;
      }

      if (result.data && result.data.length > 0) {
        setActivities(result.data);
        lastFetchRef.current = now; // Update cache timestamp
      } else {
        setActivities([]);
        lastFetchRef.current = now;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load recent activities';
      setError(message);
      setActivities([]);
      showToast('danger', 'Error', `Failed to load recent activities: ${message}`);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [initialCount, showToast]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await loadData();
      if (!isMounted) {
        // Component unmounted, reset fetching flag
        isFetchingRef.current = false;
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [loadData]); // Only re-run if loadData changes (which it shouldn't)

  // Show skeleton during initial loading (when loading === true and no cached activities)
  // Use initialCount from server to match exact number of items that will be loaded
  if (loading && activities.length === 0) {
    return <RecentActivitiesSkeleton count={initialCount} />;
  }

  return (
    <RecentActivitiesCard
      activities={activities}
      loading={loading}
      error={error}
      maxItems={initialCount}
    />
  );
}


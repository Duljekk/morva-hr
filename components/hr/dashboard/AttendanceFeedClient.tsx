'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import AttendanceFeed, { type AttendanceFeedEntry } from './AttendanceFeed';
import AttendanceFeedSkeleton from './AttendanceFeedSkeleton';
import { getAttendanceFeed, type AttendanceFeedEntry as ServerAttendanceFeedEntry } from '@/lib/actions/hr/dashboard';
import { useToast } from '@/app/contexts/ToastContext';

/**
 * AttendanceFeedClient
 *
 * Client-side wrapper that:
 * - Fetches today's attendance feed via server action
 * - Maps server entries to UI entries
 * - Manages loading and error states
 * - Caches successful results to prevent unnecessary refetches
 * - Falls back to AttendanceFeed's placeholders when no data
 */
export default function AttendanceFeedClient() {
  const [entries, setEntries] = useState<AttendanceFeedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { showToast } = useToast();
  
  // Cache the last successful fetch timestamp to prevent unnecessary refetches
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef(false);

  // Map server-side attendance entry to UI entry
  // Memoized with useCallback to prevent recreation on every render
  const mapServerEntryToUI = useCallback((entry: ServerAttendanceFeedEntry): AttendanceFeedEntry => {
    // Map server status values to badge statuses
    const statusMap = {
      late: 'Late',
      ontime: 'On Time',
      overtime: 'Overtime',
      leftearly: 'Left Early',
    } as const;

    return {
      id: entry.id,
      name: entry.user.full_name,
      avatarUrl: undefined,
      type: entry.type === 'checkin' ? 'check-in' : 'check-out',
      time: entry.time,
      status: statusMap[entry.status],
    };
  }, []);

  // Memoize the load function to prevent unnecessary refetches
  // Note: We don't include entries.length in deps to avoid infinite loops
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
      const result = await getAttendanceFeed(undefined, 50);

      if (result.error) {
        setError(result.error);
        setEntries([]);
        showToast('danger', 'Error', `Failed to load attendance feed: ${result.error}`);
        return;
      }

      if (result.data && result.data.length > 0) {
        const mapped = result.data.map(mapServerEntryToUI);
        setEntries(mapped);
        lastFetchRef.current = now; // Update cache timestamp
      } else {
        setEntries([]);
        lastFetchRef.current = now;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load attendance feed';
      setError(message);
      setEntries([]);
      showToast('danger', 'Error', `Failed to load attendance feed: ${message}`);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [mapServerEntryToUI, showToast]); // Stable dependencies

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

  // Show skeleton during initial loading (when loading === true and no cached entries)
  if (loading && entries.length === 0) {
    return <AttendanceFeedSkeleton />;
  }

  return <AttendanceFeed entries={entries} loading={loading} error={error} />;
}



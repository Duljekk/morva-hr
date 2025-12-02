'use client';

import { useEffect, useState } from 'react';
import AttendanceFeed, { type AttendanceFeedEntry } from './AttendanceFeed';
import { getAttendanceFeed, type AttendanceFeedEntry as ServerAttendanceFeedEntry } from '@/lib/actions/hr/dashboard';
import { useToast } from '@/app/contexts/ToastContext';

/**
 * AttendanceFeedClient
 *
 * Client-side wrapper that:
 * - Fetches today's attendance feed via server action
 * - Maps server entries to UI entries
 * - Manages loading and error states
 * - Falls back to AttendanceFeed's placeholders when no data
 */
export default function AttendanceFeedClient() {
  const [entries, setEntries] = useState<AttendanceFeedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { showToast } = useToast();

  // Map server-side attendance entry to UI entry
  const mapServerEntryToUI = (entry: ServerAttendanceFeedEntry): AttendanceFeedEntry => {
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
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const result = await getAttendanceFeed(undefined, 50);

        if (!isMounted) return;

        if (result.error) {
          setError(result.error);
          setEntries([]);
          showToast('danger', 'Error', `Failed to load attendance feed: ${result.error}`);
          return;
        }

        if (result.data && result.data.length > 0) {
          const mapped = result.data.map(mapServerEntryToUI);
          setEntries(mapped);
        } else {
          setEntries([]);
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : 'Failed to load attendance feed';
        setError(message);
        setEntries([]);
        showToast('danger', 'Error', `Failed to load attendance feed: ${message}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  return <AttendanceFeed entries={entries} loading={loading} error={error} />;
}



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { isHRAdmin } from '@/lib/auth/utils';
import { getHRDashboardStats, getAllRecentActivities, type HRStats, type DayEmployeeActivity } from '@/lib/actions/hr';
import StatsCard from './components/StatsCard';
import HRRecentActivities from './components/HRRecentActivities';
import HRTaskMenu from './components/HRTaskMenu';
import { CheckInIcon, ClockIcon, CalendarIcon } from '@/app/components/Icons';

// Simple User Icon since it's not in Icons.tsx
const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HRDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading, signOut } = useAuth();
  const [stats, setStats] = useState<HRStats | null>(null);
  const [activities, setActivities] = useState<DayEmployeeActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Parallel fetching
        const [statsRes, activitiesRes] = await Promise.all([
            getHRDashboardStats(),
            getAllRecentActivities()
        ]);

        if (statsRes.data) setStats(statsRes.data);
        if (activitiesRes.data) setActivities(activitiesRes.data);
        
      } catch (error) {
        console.error('Failed to load HR data', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Date formatting
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Show loading state while checking authentication
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-50">Loading...</div>;
  }

  // Redirect if not authenticated
  if (!profile) {
    router.replace('/login');
    return null;
  }

  // Redirect if not HR admin
  if (!isHRAdmin(profile)) {
    router.replace('/');
    return null;
  }

  return (
    <div className="relative min-h-screen w-full bg-neutral-50">
      {/* Main Content Container - Mobile First (matches main app style) */}
      <div className="mx-auto w-full max-w-[402px] pb-20">
        <div className="flex flex-col items-center gap-6 px-6 pt-6">
          
          {/* Header */}
          <div className="flex w-full flex-col gap-1">
            <p className="text-xl font-bold text-neutral-900 tracking-tight">
              HR Dashboard
            </p>
            <p className="text-sm text-neutral-500">
              {formattedDate}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
             <StatsCard 
                title="Headcount" 
                count={loading ? '-' : stats?.totalEmployees || 0} 
                icon={<UserIcon className="w-5 h-5" />}
             />
             <StatsCard 
                title="Present" 
                count={loading ? '-' : stats?.present || 0} 
                icon={<CheckInIcon className="w-5 h-5" />} 
             />
             <StatsCard 
                title="Late" 
                count={loading ? '-' : stats?.late || 0} 
                icon={<ClockIcon className="w-4 h-4" />}
             />
             <StatsCard 
                title="On Leave" 
                count={loading ? '-' : stats?.onLeave || 0} 
                icon={<CalendarIcon className="w-4 h-4" />}
             />
          </div>

          {/* Quick Actions */}
          <HRTaskMenu />

          {/* Recent Activities Feed */}
          <HRRecentActivities activities={activities} />

          {/* Logout Button */}
          <button
            onClick={async () => {
              try {
                await signOut();
                // Delay to ensure server-side cookies are fully cleared before redirect
                await new Promise(resolve => setTimeout(resolve, 300));
                window.location.replace('/login');
              } catch (error) {
                console.error('Error during logout:', error);
                // Delay even on error to ensure cookies are cleared
                await new Promise(resolve => setTimeout(resolve, 300));
                // Force redirect even on error
                window.location.replace('/login');
              }
            }}
            className="mt-6 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
          >
            Log Out
          </button>

        </div>
      </div>
    </div>
  );
}

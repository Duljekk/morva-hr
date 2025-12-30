/**
 * Employee Profile Page (Server Component)
 * 
 * Server-side data fetching for user profile, leave balances, and leave requests.
 * Passes data to ProfilePageClient for rendering.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getProfileData } from '@/lib/actions/employee/profile';
import ProfilePageClient from './_components/ProfilePageClient';
import ProfilePageSkeleton from './_components/ProfilePageSkeleton';
import ProfilePageError from './_components/ProfilePageError';

// Force dynamic rendering for profile page
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const profileData = await getProfileData();

  // Handle authentication error - redirect to login
  if (profileData.error === 'Authentication required') {
    redirect('/login');
  }

  // Handle user not found - redirect to login
  if (!profileData.user) {
    redirect('/login');
  }

  // Handle other errors - show error state
  if (profileData.error) {
    return <ProfilePageError error={profileData.error} />;
  }

  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageClient
        user={profileData.user}
        leaveBalances={profileData.leaveBalances}
        leaveRequests={profileData.leaveRequests}
      />
    </Suspense>
  );
}

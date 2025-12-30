/**
 * Profile Page Loading State
 * 
 * Next.js loading file for the profile page.
 * Displays the skeleton while the page is loading.
 * 
 * Requirements: 7.4
 */

import ProfilePageSkeleton from './_components/ProfilePageSkeleton';

export default function ProfileLoading() {
  return <ProfilePageSkeleton />;
}

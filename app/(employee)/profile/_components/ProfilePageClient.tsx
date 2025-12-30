'use client';

/**
 * Profile Page Client Component
 * 
 * Main client component orchestrating the profile page layout.
 * Displays user profile information, leave balances, and leave request history.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import ProfileHeader from './ProfileHeader';
import LeaveBalancesCard from './LeaveBalancesCard';
import LeaveRequestsCard from './LeaveRequestsCard';

export interface LeaveBalance {
  type: 'annual' | 'wfh' | 'sick';
  label: string;
  remaining: number;
  total: number;
}

export interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'wfh' | 'unpaid';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  isHalfDay?: boolean;
}

export interface ProfilePageClientProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'Intern' | 'Full-time';
    avatarUrl?: string | null;
  };
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
}

/**
 * ProfilePageClient Component
 * 
 * Layout specifications:
 * - White background (bg-white)
 * - 24px horizontal padding (px-6)
 * - Bottom padding for floating navbar (pb-24)
 * - 12px gap between major sections
 * - Scrollable when content exceeds viewport
 */
const ProfilePageClient = memo(function ProfilePageClient({
  user,
  leaveBalances,
  leaveRequests,
}: ProfilePageClientProps) {
  const router = useRouter();

  const handleSettingsClick = () => {
    // Navigate to profile settings page
    router.push('/profile/settings');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main content container */}
      <div className="flex flex-col gap-3 pb-24">
        {/* Profile Header Section */}
        <ProfileHeader
          fullName={user.fullName}
          email={user.email}
          role={user.role}
          avatarUrl={user.avatarUrl}
          onSettingsClick={handleSettingsClick}
        />

        {/* Content sections with horizontal padding */}
        <div className="flex flex-col gap-3 px-6">
          {/* Leave Balances Card */}
          <LeaveBalancesCard balances={leaveBalances} />

          {/* Leave Requests Card */}
          <LeaveRequestsCard requests={leaveRequests} />
        </div>
      </div>
    </div>
  );
});

ProfilePageClient.displayName = 'ProfilePageClient';

export default ProfilePageClient;

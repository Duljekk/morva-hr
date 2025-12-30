'use client';

/**
 * Profile Page Client Component
 * 
 * Main client component orchestrating the profile page layout.
 * Displays user profile information, leave balances, and leave request history.
 * 
 * Figma design: 788:1880
 */

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsIcon } from '@/components/icons';
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
 * Layout specifications from Figma:
 * - Max width 402px centered (same as other employee pages)
 * - White background
 * - Sky-blue banner (101px height) at top with settings button
 * - Content starts at 54px from top (overlapping banner)
 * - 24px horizontal padding (px-6)
 * - Profile header with avatar, name, badge, email
 * - 20px gap between cards
 * - Bottom padding for floating navbar (pb-24)
 */
const ProfilePageClient = memo(function ProfilePageClient({
  user,
  leaveBalances,
  leaveRequests,
}: ProfilePageClientProps) {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push('/profile/settings');
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Centered container with max-width matching other employee pages */}
      <div className="mx-auto w-full max-w-[402px] relative">
        {/* Banner - Sky blue background with settings button */}
        <div 
          className="absolute top-0 left-0 right-0 h-[101px] bg-sky-50"
          data-name="Banner"
        >
          {/* Settings Ghost Button - top right */}
          <button
            type="button"
            onClick={handleSettingsClick}
            className="absolute top-[12px] right-[12px] w-[30px] h-[30px] rounded-[10px] bg-[rgba(115,115,115,0.05)] flex items-center justify-center hover:bg-[rgba(115,115,115,0.1)] transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300"
            aria-label="Open settings"
          >
            <SettingsIcon size={18} className="text-neutral-500" />
          </button>
        </div>

        {/* Main content container - starts at 54px to overlap banner */}
        <div className="relative flex flex-col gap-[12px] px-6 pt-[54px] pb-[110px]">
          {/* Profile Header Section */}
          <ProfileHeader
            fullName={user.fullName}
            email={user.email}
            role={user.role}
            avatarUrl={user.avatarUrl}
          />

          {/* Cards Section - 20px gap between cards */}
          <div className="flex flex-col gap-[20px]">
            {/* Leave Balances Card */}
            <LeaveBalancesCard balances={leaveBalances} />

            {/* Leave Requests Card */}
            <LeaveRequestsCard requests={leaveRequests} />
          </div>
        </div>
      </div>
    </div>
  );
});

ProfilePageClient.displayName = 'ProfilePageClient';

export default ProfilePageClient;

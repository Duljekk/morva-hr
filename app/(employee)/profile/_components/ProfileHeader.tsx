'use client';

/**
 * Profile Header Component
 * 
 * Displays the user's profile picture, name, role badge, and email
 * with a sky-blue banner background and settings button.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3
 */

import { memo } from 'react';
import Avatar from '@/components/shared/Avatar';
import RoleBadge, { type RoleBadgeVariant } from '@/components/shared/RoleBadge';
import SettingsIcon from '@/components/icons/shared/Settings';
import MailIcon from '@/components/icons/shared/Mail';

export interface ProfileHeaderProps {
  /**
   * User's full name
   */
  fullName: string;
  
  /**
   * User's email address
   */
  email: string;
  
  /**
   * User's role (Intern or Full-time)
   */
  role: RoleBadgeVariant;
  
  /**
   * Optional avatar URL
   */
  avatarUrl?: string | null;
  
  /**
   * Callback when settings button is clicked
   */
  onSettingsClick?: () => void;
}

/**
 * ProfileHeader Component
 * 
 * Layout specifications:
 * - Sky-blue banner (bg-sky-50) at top spanning full width
 * - Settings button (30px ghost button) in top-right corner
 * - 96px circular avatar with white border
 * - Name in 18px semibold text (neutral-800)
 * - RoleBadge next to name
 * - Email with MailIcon in 14px regular text (neutral-500)
 */
const ProfileHeader = memo(function ProfileHeader({
  fullName,
  email,
  role,
  avatarUrl,
  onSettingsClick,
}: ProfileHeaderProps) {
  return (
    <div className="bg-sky-50 px-6 pt-4 pb-12 relative">
      {/* Settings button - top right corner */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={onSettingsClick}
          className="w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-sky-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300"
          aria-label="Open settings"
        >
          <SettingsIcon size={18} className="text-neutral-600" />
        </button>
      </div>

      {/* Profile content - centered */}
      <div className="flex flex-col items-center gap-3 pt-8">
        {/* Avatar - 96px with white border */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-sm overflow-hidden">
            <Avatar
              name={fullName}
              imageUrl={avatarUrl}
              size="xl"
              className="!w-full !h-full"
            />
          </div>
        </div>

        {/* Name and role */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-neutral-800">
              {fullName}
            </h1>
            <RoleBadge role={role} />
          </div>

          {/* Email with mail icon */}
          <div className="flex items-center gap-1.5">
            <MailIcon size={14} className="text-neutral-500" />
            <span className="text-sm text-neutral-500">
              {email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;

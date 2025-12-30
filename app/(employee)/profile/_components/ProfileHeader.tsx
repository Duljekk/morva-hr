'use client';

/**
 * Profile Header Component
 * 
 * Displays the user's profile picture, name, role badge, and email
 * in a left-aligned layout.
 * 
 * Figma design: 788:1884
 */

import { memo } from 'react';
import Image from 'next/image';
import RoleBadge, { type RoleBadgeVariant } from '@/components/shared/RoleBadge';
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
}

/**
 * Get initials from full name for avatar fallback
 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * ProfileHeader Component
 * 
 * Layout specifications from Figma:
 * - 96px circular avatar with 3px white border
 * - 12px gap between avatar and content below
 * - Name (18px semibold, neutral-800) + RoleBadge on same line with 10px gap
 * - 6px gap between name row and email
 * - Email with 14px MailIcon (neutral-400) + 4px gap + text (14px regular, neutral-500)
 */
const ProfileHeader = memo(function ProfileHeader({
  fullName,
  email,
  role,
  avatarUrl,
}: ProfileHeaderProps) {
  const initials = getInitials(fullName);

  return (
    <div className="flex flex-col gap-[12px] items-start">
      {/* Avatar - 96px with 3px white border */}
      <div className="w-[96px] h-[96px] rounded-full bg-white p-[3px] shrink-0">
        <div className="w-[90px] h-[90px] rounded-full overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={90}
              height={90}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-neutral-200 to-neutral-50 flex items-center justify-center">
              <span className="text-2xl font-semibold text-neutral-600">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Container: Header + Cards spacing handled by parent */}
      <div className="flex flex-col gap-[16px] w-full">
        {/* Header: Name + Badge + Email */}
        <div className="flex flex-col gap-[6px] items-start">
          {/* Name + Badge row */}
          <div className="flex items-center gap-[10px]">
            <h1 className="text-[18px] font-semibold leading-[22px] text-neutral-800">
              {fullName}
            </h1>
            <RoleBadge role={role} />
          </div>

          {/* Email with icon */}
          <div className="flex items-center gap-[4px]">
            <MailIcon size={14} className="text-neutral-400" />
            <span className="text-[14px] font-normal leading-[20px] text-neutral-500">
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

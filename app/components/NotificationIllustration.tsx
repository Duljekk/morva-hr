'use client';

// Annual leave icons
import NotificationAnnualSentIcon from '@/app/assets/icons/notification-annual-sent.svg';
import NotificationAnnualRejectedIcon from '@/app/assets/icons/notification-annual-rejected.svg';
import NotificationAnnualApprovedIcon from '@/app/assets/icons/notification-annual-approved.svg';

// Sick leave icons
import NotificationSickSentIcon from '@/app/assets/icons/notification-sick-sent.svg';
import NotificationSickRejectedIcon from '@/app/assets/icons/notification-sick-rejected.svg';
import NotificationSickApprovedIcon from '@/app/assets/icons/notification-sick-approved.svg';

// Unpaid leave icons
import NotificationUnpaidSentIcon from '@/app/assets/icons/notification-unpaid-sent.svg';
import NotificationUnpaidRejectedIcon from '@/app/assets/icons/notification-unpaid-rejected.svg';
import NotificationUnpaidApprovedIcon from '@/app/assets/icons/notification-unpaid-approved.svg';

import EclipseSkyIcon from '@/app/assets/icons/eclipse-sky.svg';

interface NotificationIllustrationProps {
  isUnread?: boolean;
  illustration?: 'default' | 'rejected' | 'approved';
  leaveType?: 'annual' | 'sick' | 'unpaid';
  className?: string;
}

// Helper function to get the correct icon based on leave type and status
function getLeaveIcon(leaveType: 'annual' | 'sick' | 'unpaid', status: 'sent' | 'approved' | 'rejected') {
  if (leaveType === 'annual') {
    if (status === 'approved') return NotificationAnnualApprovedIcon;
    if (status === 'rejected') return NotificationAnnualRejectedIcon;
    return NotificationAnnualSentIcon;
  }
  if (leaveType === 'sick') {
    if (status === 'approved') return NotificationSickApprovedIcon;
    if (status === 'rejected') return NotificationSickRejectedIcon;
    return NotificationSickSentIcon;
  }
  // unpaid
  if (status === 'approved') return NotificationUnpaidApprovedIcon;
  if (status === 'rejected') return NotificationUnpaidRejectedIcon;
  return NotificationUnpaidSentIcon;
}

export default function NotificationIllustration({ 
  isUnread = false,
  illustration = 'default',
  leaveType,
  className = '' 
}: NotificationIllustrationProps) {
  // If leaveType is provided, use it to determine the icon
  // Otherwise, fall back to the old illustration prop
  let IllustrationIcon;
  
  if (leaveType) {
    // Map illustration prop to status
    const status = illustration === 'approved' ? 'approved' 
      : illustration === 'rejected' ? 'rejected' 
      : 'sent';
    IllustrationIcon = getLeaveIcon(leaveType, status);
  } else {
    // Fallback to old behavior (annual leave icons)
    IllustrationIcon = illustration === 'rejected' 
      ? NotificationAnnualRejectedIcon 
      : illustration === 'approved'
      ? NotificationAnnualApprovedIcon
      : NotificationAnnualSentIcon;
  }

  return (
    <div className={`relative size-[41px] overflow-visible ${className}`}>
      {/* SVG - Already includes container with background and rounded corners */}
      <div className="absolute left-0 top-px overflow-visible">
        <IllustrationIcon className="h-10 w-10" />
      </div>

      {/* Unread Indicator - Eclipse Sky SVG wrapped in container */}
      {isUnread && (
        <div className="absolute left-[33px] top-[-2px] size-[10px] overflow-visible">
          <EclipseSkyIcon className="h-full w-full" />
        </div>
      )}
    </div>
  );
}


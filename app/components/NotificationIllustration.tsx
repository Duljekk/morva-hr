'use client';

import React from 'react';
import NotificationAnnualSentIcon from '@/app/assets/icons/notification-annual-sent.svg';
import NotificationAnnualRejectedIcon from '@/app/assets/icons/notification-annual-rejected.svg';
import NotificationAnnualApprovedIcon from '@/app/assets/icons/notification-annual-approved.svg';
import EclipseSkyIcon from '@/app/assets/icons/eclipse-sky.svg';

interface NotificationIllustrationProps {
  isUnread?: boolean;
  illustration?: 'default' | 'rejected' | 'approved';
  className?: string;
}

export default function NotificationIllustration({ 
  isUnread = false,
  illustration = 'default',
  className = '' 
}: NotificationIllustrationProps) {
  const IllustrationIcon = illustration === 'rejected' 
    ? NotificationAnnualRejectedIcon 
    : illustration === 'approved'
    ? NotificationAnnualApprovedIcon
    : NotificationAnnualSentIcon;

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


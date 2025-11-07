'use client';

import React from 'react';
import NotificationIcon from '@/app/assets/icons/notification.svg';

interface NotificationButtonProps {
  hasNotification?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function NotificationButton({
  hasNotification = false,
  onClick,
  className = '',
}: NotificationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex h-7 w-7 items-center justify-center ${className}`}
      aria-label="Notifications"
    >
      {/* Bell Icon - 20px */}
      <div className="relative">
        <NotificationIcon className="h-5 w-5 text-neutral-800" />
        
        {/* Notification Badge - Small teal dot */}
        {hasNotification && (
          <div 
            className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-teal-500"
            style={{ transform: 'translate(25%, -25%)' }}
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
}


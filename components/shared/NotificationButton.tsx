'use client';

import { useRouter } from 'next/navigation';
import NotificationIcon from '@/app/assets/icons/notification.svg';
import { useNotifications } from '@/lib/hooks/useNotifications';

interface NotificationButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function NotificationButton({
  onClick,
  className = '',
}: NotificationButtonProps) {
  const router = useRouter();
  
  // Use real-time notifications hook
  // Only fetch unread count (not full notifications list) for performance
  const { unreadCount, loading } = useNotifications({
    autoFetch: true,
    enableRealtime: true,
    // Don't fetch full notifications list in the button component
    // We'll override the notifications state to empty array
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/notifications');
    }
  };

  const hasUnread = unreadCount > 0;

  return (
    <button
      onClick={handleClick}
      className={`relative flex h-7 w-7 items-center justify-center ${className}`}
      aria-label={`Notifications${hasUnread ? ` (${unreadCount} unread)` : ''}`}
    >
      {/* Bell Icon - 20px */}
      <div className="relative">
        <NotificationIcon className="h-5 w-5 text-neutral-800" />
        
        {/* Notification Badge - Show count if > 0 */}
        {!loading && hasUnread && (
          <div 
            className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-teal-500 text-white text-[10px] font-semibold leading-none"
            style={{ transform: 'translate(25%, -25%)' }}
            aria-hidden="true"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
    </button>
  );
}


'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ArrowLeftIcon from '@/app/assets/icons/arrow-left.svg';
import NotificationIllustration from '@/app/components/NotificationIllustration';
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  type Notification as NotificationData 
} from '@/lib/actions/notifications';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { getLeaveRequest } from '@/lib/actions/leaves';

// Lazy load modal component
const LeaveRequestDetailsModal = dynamic(
  () => import('@/app/components/LeaveRequestDetailsModal'),
  { ssr: false }
);

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  illustration?: 'default' | 'rejected' | 'approved';
  type?: string;
  related_entity_type?: string | null;
  related_entity_id?: string | null;
}

interface NotificationGroup {
  dateLabel: string;
  notifications: Notification[];
}

export default function NotificationsPage() {
  const router = useRouter();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveRequestData, setLeaveRequestData] = useState<{
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedOn: string;
    requestedAt: string;
    approvedAt?: string;
    rejectionReason?: string;
    leaveType: string;
    reason: string;
  } | null>(null);
  const [isLoadingLeaveRequest, setIsLoadingLeaveRequest] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Use real-time notifications hook
  const { 
    notifications: notificationData, 
    loading, 
    error,
    refreshNotifications 
  } = useNotifications({
    autoFetch: true,
    enableRealtime: true,
  });

  // Handle notification click - check if it's a leave notification and open modal
  const handleNotificationClick = useCallback(async (notification: Notification) => {
    // Check if this is a leave-related notification
    const isLeaveNotification = notification.type && 
      ['leave_sent', 'leave_approved', 'leave_rejected'].includes(notification.type);
    
    // Check if it has a related leave request ID
    if (isLeaveNotification && notification.related_entity_type === 'leave_request' && notification.related_entity_id) {
      // Fetch leave request details
      setIsLoadingLeaveRequest(true);
      try {
        const result = await getLeaveRequest(notification.related_entity_id);
        
        if (result.data) {
          // Set modal data and open modal
          setLeaveRequestData({
            startDate: result.data.startDate,
            endDate: result.data.endDate,
            status: result.data.status,
            requestedOn: result.data.requestedOn,
            requestedAt: result.data.requestedAt,
            approvedAt: result.data.approvedAt,
            rejectionReason: result.data.rejectionReason,
            leaveType: result.data.leaveType,
            reason: result.data.reason,
          });
          setIsModalOpen(true);
        } else {
          console.error('Failed to fetch leave request:', result.error);
          // Still mark notification as read even if fetch fails
        }
      } catch (error) {
        console.error('Error fetching leave request:', error);
      } finally {
        setIsLoadingLeaveRequest(false);
      }
    }
    
    // Mark notification as read in backend
    // The real-time subscription will automatically update the UI
    const result = await markNotificationAsRead(notification.id);
    if (!result.success) {
      console.error('Failed to mark notification as read:', result.error);
      // Refresh to sync state
      await refreshNotifications();
    }
  }, [refreshNotifications]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setLeaveRequestData(null);
  }, []);

  // Handle marking all as read
  const handleMarkAllAsRead = useCallback(async () => {
    // Mark all as read in backend
    // The real-time subscription will automatically update the UI
    const result = await markAllNotificationsAsRead();
    if (!result.success) {
      console.error('Failed to mark all notifications as read:', result.error);
      // Refresh to sync state
      await refreshNotifications();
    }
  }, [refreshNotifications]);

  // Map notification type to illustration
  const getIllustration = (type: string): 'default' | 'rejected' | 'approved' => {
    if (type === 'leave_approved') return 'approved';
    if (type === 'leave_rejected') return 'rejected';
    // All other types (leave_sent, payslip_ready, announcement, attendance_reminder) use default
    return 'default';
  };

  // Format time from ISO string
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  // Group notifications by date
  const groupNotificationsByDate = (notifications: NotificationData[]): NotificationGroup[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: NotificationGroup[] = [];
    let currentGroup: NotificationGroup | null = null;

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.created_at);
      notificationDate.setHours(0, 0, 0, 0);
      
      let dateLabel: string;
      if (notificationDate.getTime() === today.getTime()) {
        dateLabel = 'Today';
      } else if (notificationDate.getTime() === yesterday.getTime()) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = notificationDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }

      // Check if we need a new group
      if (!currentGroup || currentGroup.dateLabel !== dateLabel) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          dateLabel,
          notifications: [],
        };
      }

      currentGroup.notifications.push({
        id: notification.id,
        title: notification.title,
        description: notification.description,
        time: formatTime(notification.created_at),
        isUnread: !notification.is_read,
        illustration: getIllustration(notification.type),
        type: notification.type,
        related_entity_type: notification.related_entity_type,
        related_entity_id: notification.related_entity_id,
      });
    });

    // Add the last group
    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const notificationGroups = groupNotificationsByDate(notificationData);
  const hasUnread = notificationData.some(n => !n.is_read);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[402px] pb-8">
        {/* Sticky Header */}
        <div className={`sticky top-0 z-10 h-16 bg-white flex flex-col justify-center px-6 rounded-b-[18px] transition-shadow duration-200 ${isScrolled ? 'shadow-[0px_1px_2px_0px_rgba(28,28,28,0.08)]' : ''}`}>
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="absolute left-6 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-neutral-700" />
          </button>

          {/* Title and Mark All as Read */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-neutral-800 tracking-[-0.24px] leading-[28px]">
              Notification
            </h1>
            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 mt-2">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-neutral-500">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notificationGroups.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-neutral-500">No notifications yet</p>
            </div>
          )}

          {/* Notification Groups */}
          {!loading && !error && notificationGroups.length > 0 && (
            <div className="flex flex-col gap-6 mt-[18px]">
              {notificationGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex flex-col gap-2">
                  {/* Date Header */}
                  <p className="text-base font-medium text-neutral-600 tracking-[-0.16px] leading-5">
                    {group.dateLabel}
                  </p>

                  {/* Notifications */}
                  <div className="flex flex-col gap-0">
                    {group.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex gap-3 items-center cursor-pointer hover:bg-neutral-100 rounded-lg p-2 -mx-2 transition-colors ${
                          isLoadingLeaveRequest ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        {/* Notification Illustration */}
                        <NotificationIllustration
                          isUnread={notification.isUnread}
                          illustration={notification.illustration || 'default'}
                          className="shrink-0"
                        />

                        {/* Notification Content */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          {/* Title and Time Row */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-base font-medium text-neutral-700 tracking-[-0.16px] leading-5 flex-1">
                              {notification.title}
                            </p>
                            <p className="text-xs font-medium text-neutral-300 leading-4 shrink-0 whitespace-nowrap">
                              {notification.time}
                            </p>
                          </div>

                          {/* Description */}
                          <p className="text-sm font-normal text-neutral-500 leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leave Request Details Modal */}
      {leaveRequestData && (
        <LeaveRequestDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          startDate={leaveRequestData.startDate}
          endDate={leaveRequestData.endDate}
          status={leaveRequestData.status}
          requestedOn={leaveRequestData.requestedOn}
          requestedAt={leaveRequestData.requestedAt}
          approvedAt={leaveRequestData.approvedAt}
          rejectionReason={leaveRequestData.rejectionReason}
          leaveType={leaveRequestData.leaveType}
          reason={leaveRequestData.reason}
        />
      )}
    </div>
  );
}


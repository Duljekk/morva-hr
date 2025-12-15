'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ArrowLeftIcon from '@/app/assets/icons/arrow-left.svg';
import NotificationIllustration from '@/components/employee/NotificationIllustration';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/actions/shared/notifications';
import { useNotifications, type Notification as NotificationData } from '@/lib/hooks/useNotifications';
import { getLeaveRequest } from '@/lib/actions/employee/leaves';

// Lazy load modal component
const LeaveRequestDetailsModal = dynamic(
  () => import('@/components/employee/LeaveRequestDetailsModal'),
  { ssr: false }
);

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  illustration?: 'default' | 'rejected' | 'approved';
  leaveType?: 'annual' | 'sick' | 'unpaid';
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
  const [processingNotificationIds, setProcessingNotificationIds] = useState<Set<string>>(new Set());

  // Track unread notifications that were visible when page opened
  // Use ref to persist across renders and avoid re-tracking on re-renders
  // Best Practice: Refs are ideal for values that don't need to trigger re-renders
  const initialUnreadNotificationIdsRef = useRef<Set<string>>(new Set());
  const hasTrackedInitialNotificationsRef = useRef<boolean>(false);

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

  // Track unread notifications when page first loads (after data is fetched)
  // Best Practice: Only track once when notifications are first loaded, not on every update
  useEffect(() => {
    // Only track initial unread notifications once, after loading completes
    if (!loading && notificationData.length > 0 && !hasTrackedInitialNotificationsRef.current) {
      const unreadIds = notificationData
        .filter(notification => !notification.is_read)
        .map(notification => notification.id);

      initialUnreadNotificationIdsRef.current = new Set(unreadIds);
      hasTrackedInitialNotificationsRef.current = true;

      console.log('[NotificationsPage] Tracked initial unread notifications:', unreadIds.length);
    }
  }, [loading, notificationData]);

  // Mark remaining tracked notifications as read when page unmounts
  // Best Practice: useEffect cleanup function runs when component unmounts
  // This handles Case 1 & 3: User opens page and leaves without clicking
  useEffect(() => {
    return () => {
      // Cleanup function runs when component unmounts (user navigates away)
      const remainingUnreadIds = Array.from(initialUnreadNotificationIdsRef.current);

      if (remainingUnreadIds.length > 0) {
        console.log('[NotificationsPage] Marking remaining notifications as read on unmount:', remainingUnreadIds.length);

        // Mark all remaining tracked notifications as read
        // Use Promise.all for parallel execution, but don't await (fire and forget)
        Promise.all(
          remainingUnreadIds.map(id => markNotificationAsRead(id))
        ).catch((error) => {
          console.error('[NotificationsPage] Failed to mark remaining notifications as read on page leave:', error);
        });
      }
    };
  }, []); // Empty deps - cleanup only runs on unmount

  // Handle notification click - check if it's a leave notification and open modal
  const handleNotificationClick = useCallback(async (notification: Notification) => {
    // Prevent duplicate clicks
    if (processingNotificationIds.has(notification.id)) {
      return;
    }

    // Mark as processing
    setProcessingNotificationIds(prev => new Set(prev).add(notification.id));

    // Mark notification as read immediately when clicked (if unread)
    // This handles Case 2: User clicks a notification
    // Best Practice: Immediate feedback provides better UX
    if (notification.isUnread) {
      // Mark as read immediately
      markNotificationAsRead(notification.id).catch((error) => {
        console.error('[NotificationsPage] Failed to mark notification as read:', error);
      });

      // Remove from tracked set so it won't be marked again on unmount
      // This prevents duplicate API calls
      initialUnreadNotificationIdsRef.current.delete(notification.id);
    }

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
        }
      } catch (error) {
        console.error('Error fetching leave request:', error);
      } finally {
        setIsLoadingLeaveRequest(false);
      }
    }

    // Remove from processing set
    setProcessingNotificationIds(prev => {
      const next = new Set(prev);
      next.delete(notification.id);
      return next;
    });
  }, [processingNotificationIds]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setLeaveRequestData(null);
  }, []);


  // Map notification type to illustration
  const getIllustration = (type: string): 'default' | 'rejected' | 'approved' => {
    if (type === 'leave_approved') return 'approved';
    if (type === 'leave_rejected') return 'rejected';
    // All other types (leave_sent, payslip_ready, announcement, attendance_reminder) use default
    return 'default';
  };

  // Fetch leave types for leave notifications
  const fetchLeaveTypes = useCallback(async (notifications: NotificationData[]): Promise<Map<string, 'annual' | 'sick' | 'unpaid'>> => {
    const leaveNotifications = notifications.filter(
      n => n.type && ['leave_sent', 'leave_approved', 'leave_rejected'].includes(n.type)
        && n.related_entity_type === 'leave_request'
        && n.related_entity_id
    );

    if (leaveNotifications.length === 0) {
      return new Map();
    }

    try {
      // Fetch all leave requests in parallel
      const leaveRequestPromises = leaveNotifications.map(notification =>
        getLeaveRequest(notification.related_entity_id!)
      );

      const results = await Promise.all(leaveRequestPromises);
      const leaveTypeMap = new Map<string, 'annual' | 'sick' | 'unpaid'>();

      results.forEach((result, index) => {
        if (result.data) {
          const notification = leaveNotifications[index];
          // Map leave type name to id (normalize to lowercase and handle variations)
          const leaveTypeName = result.data.leaveType.toLowerCase().trim();
          if (leaveTypeName.includes('annual')) {
            leaveTypeMap.set(notification.id, 'annual');
          } else if (leaveTypeName.includes('sick')) {
            leaveTypeMap.set(notification.id, 'sick');
          } else if (leaveTypeName.includes('unpaid')) {
            leaveTypeMap.set(notification.id, 'unpaid');
          }
        }
      });

      return leaveTypeMap;
    } catch (error) {
      console.error('Error fetching leave types:', error);
      return new Map();
    }
  }, []);

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

  // State for leave types map
  const [leaveTypesMap, setLeaveTypesMap] = useState<Map<string, 'annual' | 'sick' | 'unpaid'>>(new Map());

  // Fetch leave types when notifications change
  useEffect(() => {
    if (notificationData.length > 0) {
      fetchLeaveTypes(notificationData).then(setLeaveTypesMap);
    }
  }, [notificationData, fetchLeaveTypes]);

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

      // Get leave type from map if available
      const leaveType = leaveTypesMap.get(notification.id);

      currentGroup.notifications.push({
        id: notification.id,
        title: notification.title,
        description: notification.description,
        time: formatTime(notification.created_at),
        isUnread: !notification.is_read,
        illustration: getIllustration(notification.type),
        leaveType: leaveType,
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

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[402px] pb-8">
        {/* Sticky Header */}
        <div className={`sticky top-0 z-10 bg-white px-6 pt-6 pb-4 rounded-b-[18px] transition-shadow duration-200 ${isScrolled ? 'shadow-[0px_1px_2px_0px_rgba(28,28,28,0.08)]' : ''}`}>
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex h-5 w-5 items-center justify-center mb-[14px]"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-neutral-700" />
          </button>

          {/* Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-neutral-800 leading-bold-2xl">
              Notification
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-6">
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
            <div className="flex flex-col gap-6 mt-2">
              {notificationGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex flex-col gap-2">
                  {/* Date Header */}
                  <p className="text-base font-medium text-neutral-600 leading-bold-base">
                    {group.dateLabel}
                  </p>

                  {/* Notifications */}
                  <div className="flex flex-col gap-0">
                    {group.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex gap-3 items-center cursor-pointer hover:bg-neutral-100 rounded-lg p-2 -mx-2 transition-colors ${isLoadingLeaveRequest || processingNotificationIds.has(notification.id) ? 'opacity-50 pointer-events-none' : ''
                          }`}
                      >
                        {/* Notification Illustration */}
                        <NotificationIllustration
                          isUnread={notification.isUnread}
                          illustration={notification.illustration || 'default'}
                          leaveType={notification.leaveType}
                          className="shrink-0"
                        />

                        {/* Notification Content */}
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          {/* Title and Time Row */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-base font-medium text-neutral-700 leading-bold-base flex-1">
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


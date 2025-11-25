'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ComponentType, SVGProps } from 'react';
import ArrowLeftIcon from '@/app/assets/icons/arrow-left.svg';
import NotificationIllustration from '@/app/components/NotificationIllustration';
import { 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  type Notification as NotificationData 
} from '@/lib/actions/notifications';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { getLeaveRequest } from '@/lib/actions/leaves';

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
  illustration?: ComponentType<SVGProps<SVGSVGElement>> | null;
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
  // Track which notifications have been viewed (opened) but not yet marked as read
  const [viewedNotificationIds, setViewedNotificationIds] = useState<Set<string>>(new Set());
  
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

  // Mark viewed notifications as read when leaving the page
  useEffect(() => {
    // Cleanup function runs when component unmounts (user navigates away)
    return () => {
      // Mark all viewed notifications as read when leaving the page
      if (viewedNotificationIds.size > 0) {
        const notificationIds = Array.from(viewedNotificationIds);
        
        // Mark each viewed notification as read
        Promise.all(
          notificationIds.map(id => markNotificationAsRead(id))
        ).catch((error) => {
          console.error('Failed to mark viewed notifications as read on page leave:', error);
        });
      }
    };
  }, [viewedNotificationIds]);

  // Handle notification click - check if it's a leave notification and open modal
  const handleNotificationClick = useCallback(async (notification: Notification) => {
    // Prevent duplicate clicks
    if (processingNotificationIds.has(notification.id)) {
      return;
    }

    // Mark as processing
    setProcessingNotificationIds(prev => new Set(prev).add(notification.id));

    // Track this notification as viewed (will be marked as read when leaving the page)
    // Only track if it's currently unread
    if (notification.isUnread) {
      setViewedNotificationIds(prev => new Set(prev).add(notification.id));
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


  // Helper function to get the correct icon component based on leave type and status
  const getLeaveIcon = useCallback((
    leaveType: 'annual' | 'sick' | 'unpaid' | undefined,
    status: 'sent' | 'approved' | 'rejected'
  ): ComponentType<SVGProps<SVGSVGElement>> => {
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
  }, []);

  // Get the appropriate illustration component for a notification
  const getNotificationIllustration = useCallback((
    notificationType: string | undefined,
    leaveType: 'annual' | 'sick' | 'unpaid' | undefined
  ): ComponentType<SVGProps<SVGSVGElement>> | null => {
    // Determine status from notification type
    const isApproved = notificationType === 'leave_approved';
    const isRejected = notificationType === 'leave_rejected';
    const isSent = notificationType === 'leave_sent';
    
    // If it's a leave notification and we have a leave type
    if ((isApproved || isRejected || isSent) && leaveType) {
      const status = isApproved ? 'approved' : isRejected ? 'rejected' : 'sent';
      return getLeaveIcon(leaveType, status);
    }
    
    // Fallback: use annual sent icon for leave notifications without leave type
    if (isApproved || isRejected || isSent) {
      const status = isApproved ? 'approved' : isRejected ? 'rejected' : 'sent';
      return getLeaveIcon('annual', status);
    }
    
    // For other notification types (payslip_ready, announcement, attendance_reminder, etc.)
    // Return null - the parent component can handle default illustration
    return null;
  }, [getLeaveIcon]);

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

      // Get the appropriate illustration component
      const illustrationComponent = getNotificationIllustration(notification.type, leaveType);

      currentGroup.notifications.push({
        id: notification.id,
        title: notification.title,
        description: notification.description,
        time: formatTime(notification.created_at),
        isUnread: !notification.is_read,
        illustration: illustrationComponent,
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
            <h1 className="text-2xl font-semibold text-neutral-800 tracking-[-0.24px] leading-[28px]">
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
                          isLoadingLeaveRequest || processingNotificationIds.has(notification.id) ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        {/* Notification Illustration */}
                        <NotificationIllustration
                          isUnread={notification.isUnread}
                          illustration={notification.illustration}
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


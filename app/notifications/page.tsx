'use client';

import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/app/assets/icons/arrow-left.svg';
import NotificationIllustration from '@/app/components/NotificationIllustration';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  illustration?: 'default' | 'rejected' | 'approved';
}

interface NotificationGroup {
  dateLabel: string;
  notifications: Notification[];
}

export default function NotificationsPage() {
  const router = useRouter();

  // Sample notification data - in a real app, this would come from an API
  const notificationGroups: NotificationGroup[] = [
    {
      dateLabel: 'Today',
      notifications: [
        {
          id: '1',
          title: 'Leave request approved',
          description: 'Your leave on 24–25 Nov has been approved.',
          time: '18:30 PM',
          isUnread: true,
          illustration: 'approved' as const,
        },
        {
          id: '2',
          title: 'Leave request sent',
          description: 'Your leave on 24–25 Nov has been approved.',
          time: '18:30 PM',
          isUnread: true,
        },
      ],
    },
    {
      dateLabel: 'Yesterday',
      notifications: [
        {
          id: '3',
          title: 'Your pay slip is ready',
          description: 'Your October 2025 pay slip is now available to view.',
          time: '18:30 PM',
          isUnread: false,
        },
      ],
    },
    {
      dateLabel: 'November 15, 2025',
      notifications: [
        {
          id: '4',
          title: 'Leave request approved',
          description: 'Your leave on 17–18 Nov has been approved.',
          time: '18:30 PM',
          isUnread: false,
          illustration: 'approved' as const,
        },
        {
          id: '5',
          title: 'Leave request rejected',
          description: 'Your leave on 17–18 Nov was rejected.',
          time: '18:30 PM',
          isUnread: true,
          illustration: 'rejected' as const,
        },
        {
          id: '6',
          title: 'Leave request sent',
          description: 'Your leave on 17–18 Nov has been approved.',
          time: '18:30 PM',
          isUnread: false,
        },
      ],
    },
  ];

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[402px] pb-8">
        {/* Header */}
        <div className="flex flex-col gap-[14px] px-6 pt-[78px]">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex h-5 w-5 items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-neutral-700" />
          </button>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-neutral-800 tracking-[-0.24px] leading-[28px]">
            Notification
          </h1>

          {/* Notification Groups */}
          <div className="flex flex-col gap-6 mt-[18px]">
            {notificationGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="flex flex-col gap-[12px]">
                {/* Date Header */}
                <p className="text-base font-medium text-neutral-600 tracking-[-0.16px] leading-5">
                  {group.dateLabel}
                </p>

                {/* Notifications */}
                <div className="flex flex-col gap-[12px]">
                  {group.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 items-center"
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
        </div>
      </div>
    </div>
  );
}


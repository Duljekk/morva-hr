'use client';

import { memo } from 'react';
import { BellIcon, ReceiptIcon, CalendarIcon, ClockIcon, CircleCheckIcon, CircleCrossIcon } from '@/components/icons';
import type { ReactNode } from 'react';

export type ActivityType = 'announcement' | 'payslip' | 'leave' | 'attendance' | 'approval' | 'rejection';

export interface ActivityItemProps {
  /**
   * Activity title (e.g., "Moving Out Days")
   */
  title: string;
  
  /**
   * Activity subtitle/description (e.g., "Announcement was created")
   */
  subtitle: string;
  
  /**
   * Timestamp (e.g., "Now", "1h", "2d")
   */
  timestamp: string;
  
  /**
   * Type of activity - determines icon and background color
   * @default "announcement"
   */
  type?: ActivityType;
  
  /**
   * Custom icon component (overrides type-based icon)
   */
  icon?: ReactNode;
  
  /**
   * Custom background color class (overrides type-based color)
   */
  backgroundColor?: string;
  
  /**
   * Additional container classes
   */
  className?: string;
}

/**
 * Activity Item Component
 * 
 * Displays a single activity item with icon, title, subtitle, and timestamp.
 * Used in the Recent Activities card on the HR dashboard.
 * 
 * Figma specs (node 428:2814 "Activity Items"):
 * - Container: flex, gap-14px, items-center
 * - Illustration: 40x40px, rounded-8px, with icon centered (24x24px)
 * - Contents: flex-1, gap-2px
 *   - Title: text-sm/medium, neutral-700, leading-18px
 *   - Subtitle: text-sm/medium, neutral-400, leading-18px
 *   - Timestamp: text-sm/regular, neutral-500, leading-20px
 * 
 * @example
 * ```tsx
 * <ActivityItem
 *   title="Moving Out Days"
 *   subtitle="Announcement was created"
 *   timestamp="Now"
 *   type="announcement"
 * />
 * ```
 */
const ActivityItem = memo(function ActivityItem({
  title,
  subtitle,
  timestamp,
  type = 'announcement',
  icon,
  backgroundColor,
  className = '',
}: ActivityItemProps) {
  // Determine icon and background color based on type
  // Following Figma design patterns with specific colors
  const getTypeStyles = () => {
    switch (type) {
      case 'announcement':
        return {
          icon: <BellIcon size={24} className="text-[#0069A8]" />, // sky-600 from Figma: #0069A8 (rgba(0, 105, 168, 1))
          bg: 'bg-[#dff2fe]', // sky-100 from Figma: var(--sky/100,#dff2fe)
        };
      case 'payslip':
        return {
          icon: <ReceiptIcon size={24} className="text-[#7008E7]" />, // violet-600 from Figma: rgba(112, 8, 231, 1)
          bg: 'bg-[#ede9fe]', // violet-100 from Figma: var(--violet/100,#ede9fe)
        };
      case 'leave':
        return {
          icon: <CalendarIcon size={24} className="text-[#497D00]" />, // lime-700 from Figma: rgba(73, 125, 0, 1)
          bg: 'bg-[#ecfcca]', // lime-100 from Figma: var(--lime/100,#ecfcca)
        };
      case 'attendance':
        return {
          icon: <ClockIcon size={24} className="text-[#2563eb]" />, // blue-600
          bg: 'bg-[#dbeafe]', // blue-100
        };
      case 'approval':
        return {
          icon: <CircleCheckIcon size={24} className="text-[#008236]" />, // green-700 from Figma: rgba(0, 130, 54, 1)
          bg: 'bg-[#dcfce7]', // green-100 from Figma: var(--green/100,#dcfce7)
        };
      case 'rejection':
        return {
          icon: <CircleCrossIcon size={24} className="text-[#c10007]" />, // red-700 from Figma: rgba(193, 0, 7, 1)
          bg: 'bg-[#ffe2e2]', // red-100 from Figma: var(--red/100,#ffe2e2)
        };
      default:
        return {
          icon: <BellIcon size={24} className="text-[#0069A8]" />, // sky-600 from Figma: #0069A8 (rgba(0, 105, 168, 1))
          bg: 'bg-[#dff2fe]', // sky-100 from Figma
        };
    }
  };

  const typeStyles = getTypeStyles();
  const displayIcon = icon || typeStyles.icon;
  const displayBg = backgroundColor || typeStyles.bg;

  return (
    <div
      className={`content-stretch flex gap-[14px] items-center relative size-full ${className}`}
      data-name="Activity Items"
      data-node-id="428:2814"
    >
      {/* Illustration Container - 40x40px with rounded background */}
      <div
        className={`${displayBg} relative rounded-[8px] shrink-0 size-[40px] flex items-center justify-center`}
        data-name="Illustration"
        data-node-id="428:2815"
      >
        {/* Icon centered - 24x24px */}
        <div
          className="flex items-center justify-center"
          data-name="bell, notification, activity, alert"
          data-node-id="428:2816"
        >
          {displayIcon}
        </div>
      </div>

      {/* Contents Section */}
      <div
        className="basis-0 content-stretch flex gap-[2px] grow items-start min-h-px min-w-px relative shrink-0"
        data-name="Contents"
        data-node-id="428:2817"
      >
        {/* Title + Subtitle */}
        <div
          className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0"
          data-name="Title + Subtitle"
          data-node-id="428:2818"
        >
          {/* Title */}
          <div
            className="content-stretch flex gap-[4px] items-start relative shrink-0"
            data-name="Title"
            data-node-id="428:2819"
          >
            <p
              className="font-medium leading-[18px] relative shrink-0 text-neutral-700 text-sm text-nowrap whitespace-pre"
              data-node-id="428:2820"
            >
              {title}
            </p>
          </div>

          {/* Subtitle */}
          <div
            className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full"
            data-name="Subtitle"
            data-node-id="428:2821"
          >
            <p
              className="font-medium leading-[18px] relative shrink-0 text-neutral-400 text-sm text-nowrap whitespace-pre"
              data-node-id="428:2822"
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <div
          className="content-stretch flex gap-[6px] items-center relative shrink-0"
          data-name="Timestamp"
          data-node-id="428:2823"
        >
          <p
            className="font-normal leading-[20px] relative shrink-0 text-neutral-500 text-sm text-nowrap whitespace-pre"
            data-node-id="428:2824"
          >
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

export default ActivityItem;


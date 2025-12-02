'use client';

import { memo } from 'react';
import AttendanceFeedAvatar from './AttendanceFeedAvatar';
import AttendanceFeedBadge, { type AttendanceFeedStatus } from './AttendanceFeedBadge';

export interface AttendanceFeedItemProps {
  /**
   * Employee full name (e.g., "Achmad Rafi")
   */
  name: string;

  /**
   * Optional employee avatar image URL
   */
  avatarUrl?: string | null;

  /**
   * Attendance type: "check-in" or "check-out"
   */
  type: 'check-in' | 'check-out';

  /**
   * Time of check-in/check-out (e.g., "09:27 AM")
   */
  time: string;

  /**
   * Attendance status badge
   */
  status?: AttendanceFeedStatus;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Attendance Feed Item Component
 *
 * Displays a single attendance feed item with avatar, name, attendance info, and status badge.
 *
 * Figma specs (node 451:1060-451:1069):
 * - Container: flex, gap-[14px], items-center
 * - Avatar: 40x40px
 * - Name: text-sm/medium, neutral-700, leading-[18px]
 * - Attendance info: text-sm/medium, neutral-400, with separator
 * - Badge: positioned on the right
 *
 * @example
 * ```tsx
 * <AttendanceFeedItem
 *   name="Achmad Rafi"
 *   type="check-in"
 *   time="09:27 AM"
 *   status="Late"
 * />
 * ```
 */
const AttendanceFeedItem = memo(function AttendanceFeedItem({
  name,
  avatarUrl,
  type,
  time,
  status,
  className = '',
}: AttendanceFeedItemProps) {
  const attendanceLabel = type === 'check-in' ? 'Checked in' : 'Checked out';

  return (
    <div
      className={`basis-0 content-stretch flex gap-[14px] grow items-center min-h-px min-w-px relative shrink-0 ${className}`}
      data-name="Attendance Feed Item"
      data-node-id="451:1194"
    >
      {/* Avatar */}
      <div data-node-id="451:1195">
        <AttendanceFeedAvatar
          name={name}
          imageUrl={avatarUrl}
          size="md"
        />
      </div>

      {/* Contents */}
      <div
        className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0"
        data-name="Contents"
        data-node-id="451:1197"
      >
        {/* Name + Attendance */}
        <div
          className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0"
          data-name="Name + Attendance"
          data-node-id="451:1198"
        >
          {/* Name */}
          <p
            className="font-medium leading-[18px] min-w-full relative shrink-0 text-neutral-700 text-sm w-[min-content]"
            data-node-id="451:1199"
          >
            {name}
          </p>

          {/* Attendance Info */}
          <div
            className="content-stretch flex gap-[6px] items-center relative shrink-0 text-sm text-nowrap whitespace-pre"
            data-name="Attendance"
            data-node-id="451:1200"
          >
            <p
              className="font-medium leading-[18px] relative shrink-0 text-neutral-400"
              data-node-id="451:1201"
            >
              {attendanceLabel}
            </p>
            <p
              className="font-normal leading-[20px] relative shrink-0 text-neutral-300"
              data-node-id="451:1202"
            >
              /
            </p>
            <p
              className="font-medium leading-[18px] relative shrink-0 text-neutral-400"
              data-node-id="451:1203"
            >
              {time}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {status && (
          <AttendanceFeedBadge status={status} />
        )}
      </div>
    </div>
  );
});

AttendanceFeedItem.displayName = 'AttendanceFeedItem';

export default AttendanceFeedItem;


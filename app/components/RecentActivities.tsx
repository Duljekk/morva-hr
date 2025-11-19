'use client';

import { memo, useMemo } from 'react';
import CheckInNeutralIcon from '@/app/assets/icons/check-in-neutral.svg';
import CheckOutNeutralIcon from '@/app/assets/icons/check-out-neutral.svg';
import { SpriteIcon } from './IconSprite';
import AttendanceBadge, { type AttendanceStatus, type LeaveStatus } from './AttendanceBadge';

// Leave icon imports
import AnnualPendingIcon from '@/app/assets/icons/annual-pending.svg';
import AnnualApprovedIcon from '@/app/assets/icons/annual-approved.svg';
import AnnualRejectedIcon from '@/app/assets/icons/annual-rejected.svg';
import SickPendingIcon from '@/app/assets/icons/sick-pending.svg';
import SickApprovedIcon from '@/app/assets/icons/sick-approved.svg';
import SickRejectedIcon from '@/app/assets/icons/sick-rejected.svg';
import UnpaidPendingIcon from '@/app/assets/icons/unpaid-pending.svg';
import UnpaidApprovedIcon from '@/app/assets/icons/unpaid-approved.svg';
import UnpaidRejectedIcon from '@/app/assets/icons/unpaid-rejected.svg';

export interface Activity {
  type: 'checkin' | 'checkout' | 'leave';
  time: string;
  status?: AttendanceStatus | LeaveStatus;
  // Leave-specific fields
  leaveType?: 'annual' | 'sick' | 'unpaid';
  dateRange?: string; // e.g., "14-15 Nov"
}

export interface DayActivity {
  date: string;
  activities: Activity[];
}

interface RecentActivitiesProps {
  activities: DayActivity[];
}

// Helper functions moved outside component - they don't depend on component state/props
// This prevents them from being recreated on every render

/**
 * Format date like "October 30" (same format as backend)
 */
const formatActivityDate = (date: Date): string => {
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  return `${month} ${day}`;
};

/**
 * Get leave icon based on type and status
 */
const getLeaveIcon = (leaveType: 'annual' | 'sick' | 'unpaid', status: LeaveStatus) => {
  if (leaveType === 'annual') {
    if (status === 'pending') return AnnualPendingIcon;
    if (status === 'approved') return AnnualApprovedIcon;
    return AnnualRejectedIcon;
  }
  if (leaveType === 'sick') {
    if (status === 'pending') return SickPendingIcon;
    if (status === 'approved') return SickApprovedIcon;
    return SickRejectedIcon;
  }
  // unpaid
  if (status === 'pending') return UnpaidPendingIcon;
  if (status === 'approved') return UnpaidApprovedIcon;
  return UnpaidRejectedIcon;
};

/**
 * Separate activities into attendance and leave arrays
 */
const separateActivities = (activities: Activity[]) => {
  const attendance: Activity[] = [];
  const leave: Activity[] = [];
  
  activities.forEach(activity => {
    if (activity.type === 'leave') {
      leave.push(activity);
    } else {
      attendance.push(activity);
    }
  });
  
  return { attendance, leave };
};

/**
 * Memoized RecentActivities component
 * Only re-renders when activities prop changes
 */
function RecentActivities({ activities }: RecentActivitiesProps) {
  // Calculate today's date string - simple operation, no need to memoize
  // Since component is memoized, this will only run when activities prop changes
  const todayDateString = formatActivityDate(new Date());

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-base font-semibold text-neutral-800 tracking-tight">
        Recent Activities
      </p>

      <div className="flex flex-col gap-2.5">
        {activities.map((day, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-2.5">
            {/* Date Badge */}
            <div className="w-fit flex items-center gap-1 rounded-3xl px-2 py-0">
              <SpriteIcon name="calendar" className="h-3.5 w-3.5 shrink-0 text-neutral-600" width={14} height={14} />
              <p className="text-xs font-semibold text-neutral-700">
                {day.date === todayDateString ? 'Today' : day.date}
              </p>
            </div>

            {/* Activity Card Container */}
            <div className="flex items-start justify-end pl-[14px]">
              {/* Middle container with stroke - centered on calendar icon */}
              <div className={`flex flex-col gap-2.5 flex-1 ${dayIndex < activities.length - 1 ? 'border-l border-dashed border-neutral-300' : ''} pl-3.5`}>
                {useMemo(() => {
                  const { attendance, leave } = separateActivities(day.activities);
                  
                  return (
                    <>
                      {/* Leave Request Cards - Separate from attendance */}
                      {leave.map((activity, leaveIndex) => {
                        if (!activity.leaveType || !activity.status) return null;
                        const LeaveIcon = getLeaveIcon(activity.leaveType, activity.status as LeaveStatus);
                        
                        return (
                          <div
                            key={`leave-${leaveIndex}`}
                            className="flex flex-col rounded-xl bg-[rgba(255,255,255,0.6)] px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.05)] w-full"
                          >
                            <div className="flex items-center gap-2">
                              {/* Leave Icon */}
                              <LeaveIcon className="h-8 w-8 shrink-0" />

                              {/* Text and Badge */}
                              <div className="flex flex-1 items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-neutral-700 tracking-[-0.07px] leading-[18px]">
                                    Requested Leave
                                  </p>
                                  {activity.dateRange && (
                                    <div className="flex gap-1 items-center">
                                      <p className="text-xs font-medium text-neutral-500 leading-4">
                                        {activity.dateRange}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Status Badge */}
                                {activity.status && (
                                  <AttendanceBadge status={activity.status as LeaveStatus} />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Attendance Cards (Check-In/Check-Out) */}
                      {attendance.length > 0 && (
                        <div className="flex flex-col rounded-xl bg-[rgba(255,255,255,0.6)] px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.05)] w-full">
                          {attendance.map((activity, actIndex) => (
                    <div key={actIndex}>
                      {/* Activity Item */}
                              <div className={`flex items-center gap-2 ${actIndex > 0 ? 'pt-2.5' : ''} ${actIndex < attendance.length - 1 ? 'pb-3' : ''}`}>
                        {/* Icon */}
                        {activity.type === 'checkin' ? (
                          <CheckInNeutralIcon className="h-8 w-8 shrink-0" />
                        ) : (
                          <CheckOutNeutralIcon className="h-8 w-8 shrink-0" />
                        )}

                        {/* Text and Badge */}
                        <div className="flex flex-1 items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-neutral-700 tracking-[-0.07px] leading-[18px]">
                              {activity.type === 'checkin' ? 'Checked In' : 'Checked Out'}
                            </p>
                            <p className="text-xs font-medium text-neutral-500 leading-4">
                              {activity.time}
                            </p>
                          </div>

                          {/* Status Badge */}
                          {activity.status && (
                                    <AttendanceBadge status={activity.status as AttendanceStatus} />
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                              {actIndex < attendance.length - 1 && (
                        <div className="h-px w-full bg-neutral-100" />
                      )}
                    </div>
                  ))}
                </div>
                      )}
                    </>
                  );
                }, [day.activities])}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
// Component will only re-render when activities prop changes
export default memo(RecentActivities);





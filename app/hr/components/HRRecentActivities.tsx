'use client';

import { memo } from 'react';
import CheckInNeutralIcon from '@/app/assets/icons/check-in-neutral.svg';
import CheckOutNeutralIcon from '@/app/assets/icons/check-out-neutral.svg';
import { SpriteIcon } from '@/app/components/IconSprite';
import AttendanceBadge, { type AttendanceStatus, type LeaveStatus } from '@/app/components/AttendanceBadge';
import type { DayEmployeeActivity } from '@/lib/actions/hr';

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

// Helper function to get leave icon
const getLeaveIcon = (leaveType: 'annual' | 'sick' | 'unpaid', status: 'pending' | 'approved' | 'rejected') => {
  if (leaveType === 'annual') {
    if (status === 'approved') return AnnualApprovedIcon;
    if (status === 'rejected') return AnnualRejectedIcon;
    return AnnualPendingIcon;
  }
  if (leaveType === 'sick') {
    if (status === 'approved') return SickApprovedIcon;
    if (status === 'rejected') return SickRejectedIcon;
    return SickPendingIcon;
  }
  // unpaid
  if (status === 'approved') return UnpaidApprovedIcon;
  if (status === 'rejected') return UnpaidRejectedIcon;
  return UnpaidPendingIcon;
};

interface HRRecentActivitiesProps {
  activities: DayEmployeeActivity[];
}

function HRRecentActivities({ activities }: HRRecentActivitiesProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-base font-semibold text-neutral-800 tracking-tight">
        Employee Activity Feed
      </p>

      <div className="flex flex-col gap-4">
        {activities.map((day, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-2.5">
            {/* Date Header */}
            <div className="w-fit flex items-center gap-1 rounded-3xl px-2 py-0 bg-neutral-100">
              <SpriteIcon name="calendar" className="h-3.5 w-3.5 shrink-0 text-neutral-600" width={14} height={14} />
              <p className="text-xs font-semibold text-neutral-700">
                {day.date}
              </p>
            </div>

            {/* Activities List */}
            <div className="flex flex-col gap-2">
              {day.activities.map((activity, actIndex) => {
                // Handle leave requests
                if (activity.type === 'leave') {
                  const LeaveIcon = getLeaveIcon(activity.leaveType!, activity.status as 'pending' | 'approved' | 'rejected');
                  
                  return (
                    <div
                      key={actIndex}
                      className="flex flex-col rounded-xl bg-[rgba(255,255,255,0.6)] px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.05)] w-full"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                          {activity.user.avatar_url ? (
                            <img src={activity.user.avatar_url} alt={activity.user.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-neutral-500">
                              {activity.user.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>

                        {/* Leave Icon */}
                        <LeaveIcon className="h-8 w-8 shrink-0" />

                        {/* Text and Badge */}
                        <div className="flex flex-1 items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-neutral-700 tracking-[-0.07px] leading-[18px]">
                              {activity.user.full_name} - Requested Leave
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
                            <AttendanceBadge status={activity.status as LeaveStatus} size="sm" />
                          )}
                        </div>

                        {/* Time */}
                        <p className="text-xs text-neutral-500 shrink-0">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                }

                // Handle check-in/check-out
                return (
                <div 
                  key={actIndex}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-neutral-100"
                >
                  {/* Avatar / Icon */}
                  <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                    {activity.user.avatar_url ? (
                      <img src={activity.user.avatar_url} alt={activity.user.full_name} className="h-full w-full object-cover" />
                    ) : (
                       // Initials
                      <span className="text-sm font-bold text-neutral-500">
                        {activity.user.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-neutral-900">
                        {activity.user.full_name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {activity.time}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium ${activity.type === 'checkin' ? 'text-green-700' : 'text-amber-700'}`}>
                          {activity.type === 'checkin' ? 'Checked In' : 'Checked Out'}
                        </span>
                        {activity.status && (
                             <AttendanceBadge status={activity.status as AttendanceStatus} size="sm" />
                        )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
            <div className="p-8 text-center text-neutral-500 bg-white rounded-xl border border-dashed border-neutral-200">
                No recent activities found.
            </div>
        )}
      </div>
    </div>
  );
}

export default memo(HRRecentActivities);

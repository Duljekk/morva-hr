'use client';

import { memo } from 'react';
import CheckInIcon from '@/components/icons/shared/CheckInIcon';
import CheckoutIcon from '@/components/icons/shared/CheckoutIcon';
import Clock from '@/components/icons/shared/Clock';
import Calendar from '@/components/icons/shared/Calendar';
import AttendanceBadge, { type AttendanceStatus, type LeaveStatus } from '@/components/employee/AttendanceBadge';

export interface ActivityItem {
  id: string;
  date?: string; // Date header (e.g., "Monday, 02 December 2024")
  type: 'check-in' | 'check-out' | 'leave' | 'document';
  employeeName: string;
  description: string;
  time: string;
  status?: AttendanceStatus | LeaveStatus;
  isFirstInGroup?: boolean;
}

export interface EmployeeActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

/**
 * Employee Activity Feed Component
 * 
 * A simplified activity feed for the employee details page.
 * Based on Figma design node 587:1533.
 * 
 * Features:
 * - Date headers for grouping activities
 * - Activity icons (check-in, check-out, etc.)
 * - Employee name and activity description
 * - Time stamps
 * - Timeline connector lines between activities
 */
const EmployeeActivityFeed = memo(function EmployeeActivityFeed({
  activities,
  className = '',
}: EmployeeActivityFeedProps) {
  
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'check-in':
        return <CheckInIcon className="w-5 h-5 text-green-600" />;
      case 'check-out':
        return <CheckoutIcon className="w-5 h-5 text-blue-600" />;
      case 'leave':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'document':
        return <Clock className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'check-in':
        return 'bg-green-50 border-green-200';
      case 'check-out':
        return 'bg-blue-50 border-blue-200';
      case 'leave':
        return 'bg-orange-50 border-orange-200';
      case 'document':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <div className={`p-6 ${className}`.trim()}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {/* Date Header */}
          {activity.date && (
            <div className="mb-4">
              <p className="text-sm font-medium text-neutral-500">
                {activity.date}
              </p>
            </div>
          )}

          {/* Activity Item */}
          <div className="flex gap-3 relative">
            {/* Timeline Line */}
            {index < activities.length - 1 && !activities[index + 1].date && (
              <div className="absolute left-5 top-10 w-0.5 h-[calc(100%+12px)] bg-neutral-200" />
            )}

            {/* Icon Circle */}
            <div className={`
              flex items-center justify-center
              w-10 h-10 rounded-full
              border ${getActivityColor(activity.type)}
              flex-shrink-0 z-10 bg-white
            `}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 pb-3">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {activity.employeeName}
                  </p>
                  <p className="text-sm text-neutral-600 mt-0.5">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-neutral-400 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">No activities to display</p>
          <p className="text-sm text-neutral-400 mt-1">
            Activities will appear here as they occur
          </p>
        </div>
      )}
    </div>
  );
});

export default EmployeeActivityFeed;
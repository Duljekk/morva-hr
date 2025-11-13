'use client';

import { useState } from 'react';
import RecentActivities, { type DayActivity } from '../components/RecentActivities';

export default function RecentActivitiesTestPage() {
  // Test data showing all 9 combinations: 3 leave types × 3 statuses
  const [testActivities] = useState<DayActivity[]>([
    {
      date: 'October 30',
      activities: [
        // Annual Leave - All Statuses
        {
          type: 'leave',
          time: '10:00',
          status: 'pending',
          leaveType: 'annual',
          dateRange: '14-15 Nov',
        },
        {
          type: 'leave',
          time: '10:30',
          status: 'approved',
          leaveType: 'annual',
          dateRange: '20-22 Nov',
        },
        {
          type: 'leave',
          time: '11:00',
          status: 'rejected',
          leaveType: 'annual',
          dateRange: '25-27 Nov',
        },
        // Sick Leave - All Statuses
        {
          type: 'leave',
          time: '11:30',
          status: 'pending',
          leaveType: 'sick',
          dateRange: '1-3 Dec',
        },
        {
          type: 'leave',
          time: '12:00',
          status: 'approved',
          leaveType: 'sick',
          dateRange: '5-7 Dec',
        },
        {
          type: 'leave',
          time: '12:30',
          status: 'rejected',
          leaveType: 'sick',
          dateRange: '10-12 Dec',
        },
        // Unpaid Leave - All Statuses
        {
          type: 'leave',
          time: '13:00',
          status: 'pending',
          leaveType: 'unpaid',
          dateRange: '15-17 Dec',
        },
        {
          type: 'leave',
          time: '13:30',
          status: 'approved',
          leaveType: 'unpaid',
          dateRange: '20-22 Dec',
        },
        {
          type: 'leave',
          time: '14:00',
          status: 'rejected',
          leaveType: 'unpaid',
          dateRange: '25-27 Dec',
        },
      ],
    },
  ]);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto max-w-[402px] flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Recent Activities Test Page
        </h1>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4">
            <h2 className="text-lg font-semibold text-neutral-700 mb-2">
              All 9 Leave Type × Status Combinations
            </h2>
            <div className="grid grid-cols-3 gap-2 text-sm text-neutral-600">
              <div>
                <p className="font-semibold mb-1">Annual Leave:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Pending</li>
                  <li>Approved</li>
                  <li>Rejected</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Sick Leave:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Pending</li>
                  <li>Approved</li>
                  <li>Rejected</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Unpaid Leave:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Pending</li>
                  <li>Approved</li>
                  <li>Rejected</li>
                </ul>
              </div>
            </div>
          </div>

          <RecentActivities activities={testActivities} />
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import LeaveRequestStatusTimeline, { StatusItem } from '../components/LeaveRequestStatusTimeline';
import ButtonLarge from '../components/ButtonLarge';

export default function LeaveRequestStatusTimelineTestPage() {
  // Sample data for each variant
  const rejectedHistory: StatusItem[] = [
    {
      label: 'Rejected',
      date: '2025-11-12',
      time: '10.00 PM',
      reason: 'Dates conflict with office agenda.',
    },
    {
      label: 'Awaiting Approval',
      date: '2025-11-12',
      time: '09.00 AM',
    },
    {
      label: 'Requested',
      date: '2025-11-12',
      time: '09.00 AM',
    },
  ];

  const approvedHistory: StatusItem[] = [
    {
      label: 'Accepted',
      date: '2025-11-12',
      time: '09.00 AM',
    },
    {
      label: 'Awaiting Approval',
      date: '2025-11-12',
      time: '09.00 AM',
    },
    {
      label: 'Requested',
      date: '2025-11-12',
      time: '09.00 AM',
    },
  ];

  const pendingHistory: StatusItem[] = [
    {
      label: 'Awaiting Approval',
      date: '2025-11-12',
      time: '09.00 AM',
    },
    {
      label: 'Requested',
      date: '2025-11-12',
      time: '09.00 AM',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto max-w-[402px] flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Leave Request Status Timeline Test
        </h1>

        <div className="flex flex-col gap-6">
          {/* Rejected Variant */}
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-700">Rejected Status</h2>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <LeaveRequestStatusTimeline
                status="rejected"
                statusHistory={rejectedHistory}
              />
            </div>
          </div>

          {/* Approved Variant */}
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-700">Approved Status</h2>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <LeaveRequestStatusTimeline
                status="approved"
                statusHistory={approvedHistory}
              />
            </div>
          </div>

          {/* Pending Variant */}
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-700">Awaiting Approval Status</h2>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <LeaveRequestStatusTimeline
                status="pending"
                statusHistory={pendingHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


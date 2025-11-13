'use client';

import { useState } from 'react';
import LeaveRequestDetailsModal from '../components/LeaveRequestDetailsModal';
import ButtonLarge from '../components/ButtonLarge';

export default function LeaveRequestDetailsTestPage() {
  const [isOpenPending, setIsOpenPending] = useState(false);
  const [isOpenApproved, setIsOpenApproved] = useState(false);
  const [isOpenRejected, setIsOpenRejected] = useState(false);

  // Sample data
  const sampleData = {
    startDate: '2025-10-27',
    endDate: '2025-10-27',
    requestedOn: '2025-11-12',
    leaveType: 'Sick Leave',
    reason: 'Getting sick after drinking sparkling water',
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto max-w-[402px] flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Leave Request Details Modal Test
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-neutral-700">
              Test Different Statuses
            </h2>
            
            <div className="flex flex-col gap-3">
              <ButtonLarge
                onClick={() => setIsOpenPending(true)}
                variant="primary"
              >
                Open Modal (Pending Status)
              </ButtonLarge>

              <ButtonLarge
                onClick={() => setIsOpenApproved(true)}
                variant="primary"
              >
                Open Modal (Approved Status)
              </ButtonLarge>

              <ButtonLarge
                onClick={() => setIsOpenRejected(true)}
                variant="primary"
              >
                Open Modal (Rejected Status)
              </ButtonLarge>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-700">
              Sample Data
            </h2>
            <div className="bg-white rounded-lg p-4 text-sm text-neutral-600 space-y-1">
              <p><strong>Start Date:</strong> {sampleData.startDate}</p>
              <p><strong>End Date:</strong> {sampleData.endDate}</p>
              <p><strong>Requested On:</strong> {sampleData.requestedOn}</p>
              <p><strong>Leave Type:</strong> {sampleData.leaveType}</p>
              <p><strong>Reason:</strong> {sampleData.reason}</p>
            </div>
          </div>
        </div>

        {/* Pending Status Modal */}
        <LeaveRequestDetailsModal
          isOpen={isOpenPending}
          onClose={() => setIsOpenPending(false)}
          startDate={sampleData.startDate}
          endDate={sampleData.endDate}
          status="pending"
          requestedOn={sampleData.requestedOn}
          leaveType={sampleData.leaveType}
          reason={sampleData.reason}
        />

        {/* Approved Status Modal */}
        <LeaveRequestDetailsModal
          isOpen={isOpenApproved}
          onClose={() => setIsOpenApproved(false)}
          startDate={sampleData.startDate}
          endDate={sampleData.endDate}
          status="approved"
          requestedOn={sampleData.requestedOn}
          leaveType={sampleData.leaveType}
          reason={sampleData.reason}
        />

        {/* Rejected Status Modal */}
        <LeaveRequestDetailsModal
          isOpen={isOpenRejected}
          onClose={() => setIsOpenRejected(false)}
          startDate={sampleData.startDate}
          endDate={sampleData.endDate}
          status="rejected"
          requestedOn={sampleData.requestedOn}
          leaveType={sampleData.leaveType}
          reason={sampleData.reason}
        />
      </div>
    </div>
  );
}


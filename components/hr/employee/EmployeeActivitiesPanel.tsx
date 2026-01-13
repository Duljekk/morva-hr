'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Tab from '@/components/shared/Tab';
import TabList from '@/components/shared/TabList';
import Tabs from '@/components/shared/Tabs';
import ActivityGroup, { type ActivityEntry } from './ActivityGroup';
import PendingLeaveRequestCard from './PendingLeaveRequestCard';
import LeaveRequestHistorySection from './LeaveRequestHistorySection';
import RejectLeaveRequestDialog from '@/components/hr/dashboard/RejectLeaveRequestDialog';
import HRLeaveRequestDetailsDialog from '@/components/hr/dashboard/HRLeaveRequestDetailsDialog';
import AttendanceEmptyState from './AttendanceEmptyState';
import LeaveRequestEmptyState from './LeaveRequestEmptyState';
import { useToast } from '@/app/contexts/ToastContext';
import {
  getEmployeePendingLeaveRequest,
  getEmployeeLeaveHistory,
  type EmployeePendingLeaveRequest,
  type EmployeeLeaveHistoryItem,
} from '@/lib/actions/hr/employeeDetails';
import { approveLeaveRequest, rejectLeaveRequest } from '@/lib/actions/hr/leaves';

export interface ActivityGroupData {
  /**
   * Unique identifier for the group
   */
  id: string;

  /**
   * Date label (e.g., "Today", "Yesterday", "December 6")
   */
  label: string;

  /**
   * Whether this is the last group (hides timeline)
   */
  isLast?: boolean;

  /**
   * Activities in this group
   */
  activities: ActivityEntry[];
}

export interface EmployeeActivitiesPanelProps {
  /**
   * Attendance activity groups
   */
  attendanceGroups?: ActivityGroupData[];

  /**
   * Leave request activity groups
   */
  leaveRequestGroups?: ActivityGroupData[];

  /**
   * Leave request notification count
   */
  leaveRequestCount?: number;

  /**
   * Employee ID for fetching pending leave request
   */
  employeeId?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Employee Activities Panel Component
 * 
 * Activities panel for the employee details page with tabs for Attendance and Leave Requests.
 * Based on Figma design node 587:1533.
 * 
 * Features:
 * - Header with "Activities" title and tabbed navigation
 * - Date-grouped activity feed with vertical dashed timeline
 * - Activity cards showing check-in/check-out entries with status badges
 * - Tab badges for notification counts
 * 
 * @example
 * ```tsx
 * <EmployeeActivitiesPanel 
 *   attendanceGroups={[
 *     { 
 *       id: '1', 
 *       label: 'Today',
 *       activities: [
 *         { id: 'a1', type: 'checkIn', time: '11:00', status: 'onTime' },
 *         { id: 'a2', type: 'checkOut', time: '19:20', status: 'overtime' },
 *       ]
 *     }
 *   ]}
 *   leaveRequestCount={1}
 * />
 * ```
 */
const EmployeeActivitiesPanel = memo(function EmployeeActivitiesPanel({
  attendanceGroups = [],
  leaveRequestGroups = [],
  leaveRequestCount = 0,
  employeeId,
  className = '',
}: EmployeeActivitiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');
  const [pendingRequest, setPendingRequest] = useState<EmployeePendingLeaveRequest | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<EmployeeLeaveHistoryItem[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { showToast } = useToast();

  // Reject dialog state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  // Details dialog state
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Fetch pending leave request and history when employeeId is available
  useEffect(() => {
    if (!employeeId) return;

    async function fetchLeaveData() {
      setPendingLoading(true);
      try {
        // Fetch pending request and history in parallel
        const [pendingResult, historyResult] = await Promise.all([
          getEmployeePendingLeaveRequest(employeeId!),
          getEmployeeLeaveHistory(employeeId!, 5),
        ]);

        if (!pendingResult.error && pendingResult.data) {
          setPendingRequest(pendingResult.data);
        }

        if (!historyResult.error && historyResult.data) {
          setLeaveHistory(historyResult.data);
        }
      } catch (err) {
        console.error('[EmployeeActivitiesPanel] Error fetching leave data:', err);
      } finally {
        setPendingLoading(false);
      }
    }

    fetchLeaveData();
  }, [employeeId]);

  // Handle approve action
  const handleApprove = useCallback(async (requestId: string) => {
    setIsProcessing(true);
    const result = await approveLeaveRequest(requestId);
    if (result.success) {
      setPendingRequest(null);
      setIsDetailsDialogOpen(false);
      showToast('success', 'Leave request approved', 'The employee has been notified.');
      // Refetch history to show approved request
      if (employeeId) {
        const historyResult = await getEmployeeLeaveHistory(employeeId, 5);
        if (!historyResult.error && historyResult.data) {
          setLeaveHistory(historyResult.data);
        }
      }
    } else {
      showToast('danger', 'Failed to approve', 'Please try again.');
    }
    setIsProcessing(false);
  }, [employeeId, showToast]);

  // Open reject dialog
  const handleReject = useCallback(async (requestId: string) => {
    setActiveRejectId(requestId);
    setIsRejectDialogOpen(true);
  }, []);

  // Confirm rejection with reason
  const handleConfirmReject = useCallback(async (reason: string) => {
    if (!activeRejectId) return;

    setIsRejectDialogOpen(false);
    setIsProcessing(true);
    const result = await rejectLeaveRequest(activeRejectId, reason);
    if (result.success) {
      setPendingRequest(null);
      setIsDetailsDialogOpen(false);
      showToast('success', 'Leave request rejected', 'The employee has been notified.');
      // Refetch history to show rejected request
      if (employeeId) {
        const historyResult = await getEmployeeLeaveHistory(employeeId, 5);
        if (!historyResult.error && historyResult.data) {
          setLeaveHistory(historyResult.data);
        }
      }
    } else {
      showToast('danger', 'Failed to reject', 'Please try again.');
    }
    setActiveRejectId(null);
    setIsProcessing(false);
  }, [activeRejectId, employeeId, showToast]);

  // Open details dialog
  const handleOpenDetails = useCallback(() => {
    if (pendingRequest) {
      setIsDetailsDialogOpen(true);
    }
  }, [pendingRequest]);

  const activeGroups = activeTab === 'attendance' ? attendanceGroups : leaveRequestGroups;

  return (
    <div
      className={`flex flex-col gap-[10px] items-start w-full ${className}`}
      data-name="Activities"
      data-node-id="587:1533"
    >
      {/* Header */}
      <div
        className="flex items-start justify-between w-full"
        data-name="Header"
        data-node-id="587:1534"
      >
        {/* Title */}
        <p
          className="font-sans font-semibold leading-[30px] text-[#404040] text-[20px] text-nowrap tracking-[-0.2px] whitespace-pre"
          data-node-id="587:1535"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Activities
        </p>

        {/* Tabs */}
        <Tabs aria-label="Activity types" data-node-id="596:1255">
          <TabList>
            <Tab
              label="Attendance"
              state={activeTab === 'attendance' ? 'active' : 'default'}
              onClick={() => setActiveTab('attendance')}
              hasNumber={false}
            />
            <Tab
              label="Leave Request"
              state={activeTab === 'leave' ? 'active' : 'default'}
              onClick={() => setActiveTab('leave')}
              hasNumber={leaveRequestCount > 0}
              number={leaveRequestCount}
            />
          </TabList>
        </Tabs>
      </div>

      {/* Activities Feed */}
      <div
        className="flex flex-col gap-[12px] items-start w-full"
        data-name="Activities Feed"
        data-node-id="587:1543"
      >
        {/* Pending Leave Request Card - shown when on Leave Request tab */}
        {activeTab === 'leave' && pendingRequest && !pendingLoading && (
          <PendingLeaveRequestCard
            id={pendingRequest.id}
            leaveType={pendingRequest.leaveType}
            startDate={pendingRequest.startDate}
            endDate={pendingRequest.endDate}
            reason={pendingRequest.reason || undefined}
            onApprove={handleApprove}
            onReject={handleReject}
            onClick={handleOpenDetails}
            disabled={isProcessing}
          />
        )}

        {/* Leave Request History - shown when on Leave Request tab */}
        {activeTab === 'leave' && leaveHistory.length > 0 && !pendingLoading && (
          <LeaveRequestHistorySection
            items={leaveHistory.map(item => ({
              ...item,
              reason: item.reason || undefined,
            }))}
          />
        )}

        {/* Attendance Activities - shown when on Attendance tab */}
        {activeTab === 'attendance' && (
          activeGroups.length > 0 ? (
            activeGroups.map((group, index) => (
              <ActivityGroup
                key={group.id}
                dateLabel={group.label}
                activities={group.activities}
                showTimeline={!group.isLast && index < activeGroups.length - 1}
              />
            ))
          ) : (
            /* Empty State for Attendance - Figma node 807:2436 */
            <AttendanceEmptyState className="py-12" />
          )
        )}

        {/* Empty State for Leave Requests - only show if no pending request and no history */}
        {activeTab === 'leave' && !pendingRequest && leaveHistory.length === 0 && !pendingLoading && (
          <LeaveRequestEmptyState className="py-12" />
        )}
      </div>

      {/* Reject Leave Request Dialog */}
      <RejectLeaveRequestDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleConfirmReject}
      />

      {/* Leave Request Details Dialog */}
      {pendingRequest && (
        <HRLeaveRequestDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          startDate={pendingRequest.startDate}
          endDate={pendingRequest.endDate}
          status="pending"
          requestedOn={pendingRequest.createdAt?.split('T')[0] ?? ''}
          requestedAt={pendingRequest.createdAt ?? undefined}
          approvedAt={undefined}
          rejectionReason={undefined}
          leaveType={pendingRequest.leaveType}
          reason={pendingRequest.reason ?? ''}
          onApprove={() => handleApprove(pendingRequest.id)}
          onReject={() => handleReject(pendingRequest.id)}
          disabled={isProcessing}
        />
      )}
    </div>
  );
});

EmployeeActivitiesPanel.displayName = 'EmployeeActivitiesPanel';

export default EmployeeActivitiesPanel;

// Re-export types for convenience
export type { ActivityEntry } from './ActivityGroup';
export type { ActivityStatus } from './ActivityStatusBadge';
export type { ActivityType } from './ActivityCard';

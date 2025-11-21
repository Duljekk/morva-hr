'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPendingLeaveRequests, type PendingLeaveRequest } from '@/lib/actions/hr';
import { approveLeaveRequest, rejectLeaveRequest } from '@/lib/actions/leaves';

export default function LeaveRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PendingLeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const result = await getPendingLeaveRequests();
      if (result.error) {
        console.error('Error loading leave requests:', result.error);
        alert(`Error: ${result.error}`);
      }
      if (result.data) {
        setRequests(result.data);
        console.log('Loaded leave requests:', result.data.length);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error in loadRequests:', error);
      alert('Failed to load leave requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const result = await approveLeaveRequest(id);
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        alert(result.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please enter a reason for rejection:');
    if (!reason) return; // Cancelled or empty

    setProcessingId(id);
    try {
      const result = await rejectLeaveRequest(id, reason);
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        alert(result.error || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  // Date formatting helper
  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    // Format: "Nov 14 - Nov 15" or "Nov 14" if same day
    const sStr = s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const eStr = e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (sStr === eStr) return sStr;
    return `${sStr} - ${eStr}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="mx-auto max-w-[402px] px-6 pt-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-neutral-200 text-neutral-600"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-neutral-900">Leave Requests</h1>
        </div>

        {loading ? (
          <div className="text-center text-neutral-500 mt-10">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 gap-3">
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <p className="text-neutral-500">All caught up! No pending requests.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 flex flex-col gap-3">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center text-neutral-500 font-bold">
                    {req.user.avatar_url ? (
                      <img src={req.user.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      req.user.full_name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{req.user.full_name}</p>
                    <p className="text-xs text-neutral-500">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="bg-neutral-50 rounded-lg p-3 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-neutral-700">{req.leaveType}</span>
                        <span className="text-xs font-medium bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                            {req.days} day{req.days > 1 ? 's' : ''}
                        </span>
                    </div>
                    <p className="text-sm text-neutral-600">{formatDateRange(req.startDate, req.endDate)}</p>
                    {req.reason && (
                        <p className="text-sm text-neutral-500 italic mt-1">"{req.reason}"</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={processingId === req.id}
                    className="flex-1 py-2.5 rounded-lg border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={processingId === req.id}
                    className="flex-1 py-2.5 rounded-lg bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {processingId === req.id ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

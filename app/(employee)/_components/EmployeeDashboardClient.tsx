'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';
import { checkIn, checkOut, type DayActivity } from '@/lib/actions/shared/attendance';
import { getLeaveRequest } from '@/lib/actions/employee/leaves';
import type { Announcement as AnnouncementComponentType } from '@/components/shared/AnnouncementBottomSheet';
import { useDashboardData } from './useDashboardData';
import NotificationButton from '@/components/shared/NotificationButton';
import AnnouncementBanner from '@/components/shared/AnnouncementBanner';
import CheckInOutWidget from '@/components/employee/CheckInOutWidget';
import AttendanceCard from '@/components/employee/AttendanceCard';
import RecentActivities from '@/components/employee/RecentActivities';
import DashboardSkeleton from '@/components/employee/DashboardSkeleton';

// PERFORMANCE OPTIMIZATION: Lazy load modal components
// These components are only needed when user triggers specific actions,
// so we defer loading until they're actually needed.
// This reduces initial bundle size by ~15-25%.
const ConfirmationModal = dynamic(
  () => import('@/components/shared/ConfirmationModal'),
  { ssr: false }
);

const LeaveRequestDetailsModal = dynamic(
  () => import('@/components/employee/LeaveRequestDetailsModal'),
  { ssr: false }
);

const AnnouncementBottomSheet = dynamic(
  () => import('@/components/shared/AnnouncementBottomSheet'),
  { ssr: false }
);

const SHIFT_START_HOUR = 11;
const SHIFT_END_HOUR = 19;

const setToHour = (reference: Date, hour: number) => {
  const date = new Date(reference);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const formatClockTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

const formatTimeWithPeriod = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const formatDurationFromMs = (ms: number) => {
  const safeMs = Math.max(0, ms);
  const totalMinutes = Math.floor(safeMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }

  return `${minutes}m`;
};

export default function EmployeeDashboardClient() {
  const router = useRouter();
  const { signOut, profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const nowRef = useRef(new Date());
  const [now, setNow] = useState(new Date());

  // PERFORMANCE OPTIMIZATION: SWR-based data fetching with caching
  // Benefits: automatic caching, deduplication, stale-while-revalidate
  const {
    attendance,
    announcement: currentAnnouncement,
    leaveStatus,
    activities: recentActivities,
    isLoading: isInitialLoading,
    mutateAttendance,
    mutateActivities,
  } = useDashboardData();

  // Derived state from SWR data
  const checkInDateTime = attendance.checkInTime;
  const checkOutDateTime = attendance.checkOutTime;
  // Use database status values - single source of truth for both Employee and HR apps
  const dbCheckInStatus = attendance.checkInStatus;
  const dbCheckOutStatus = attendance.checkOutStatus;
  const hasActiveLeave = leaveStatus.hasActiveLeave;
  const activeLeaveInfo = leaveStatus.activeLeaveInfo;

  // Local UI state (not fetched from server)
  const [showCheckOutConfirm, setShowCheckOutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);
  const [leaveDetailsData, setLeaveDetailsData] = useState<{
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedOn: string;
    requestedAt?: string;
    approvedAt?: string;
    rejectionReason?: string;
    leaveType: string;
    reason: string;
  } | null>(null);
  const [showAnnouncementBottomSheet, setShowAnnouncementBottomSheet] = useState(false);

  const [currentDateKey, setCurrentDateKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  });

  const dateKeyRef = useRef(currentDateKey);

  useEffect(() => {
    dateKeyRef.current = currentDateKey;
  }, [currentDateKey]);

  useEffect(() => {
    const checkDateChange = () => {
      const d = nowRef.current;
      const newDateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (newDateKey !== dateKeyRef.current) {
        dateKeyRef.current = newDateKey;
        setCurrentDateKey(newDateKey);
      }
    };

    checkDateChange();
    const interval = setInterval(checkDateChange, 60000);

    return () => clearInterval(interval);
  }, []);

  const shiftStart = useMemo(() => {
    return setToHour(nowRef.current, SHIFT_START_HOUR);
  }, [currentDateKey]);

  const shiftEnd = useMemo(() => {
    return setToHour(nowRef.current, SHIFT_END_HOUR);
  }, [currentDateKey]);

  // PERFORMANCE OPTIMIZATION: Adaptive timer updates
  const isActivelyTiming = !!checkInDateTime && !checkOutDateTime;

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let lastUpdateTime = Date.now();

    const updateInterval = isActivelyTiming ? 1000 : 10000;

    const updateTime = () => {
      const currentTime = new Date();
      nowRef.current = currentTime;

      const nowMs = Date.now();
      if (nowMs - lastUpdateTime >= updateInterval) {
        setNow(currentTime);
        lastUpdateTime = nowMs;
      }
    };

    intervalId = setInterval(updateTime, isActivelyTiming ? 1000 : 10000);
    updateTime();

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isActivelyTiming]);

  const formatFullDate = (date: Date): string => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `It's ${dayName}, ${month} ${day}, ${year}`;
  };

  const formattedDate = useMemo(() => {
    return formatFullDate(nowRef.current);
  }, [currentDateKey]);

  const isCheckedIn = !!checkInDateTime && !checkOutDateTime;

  const canCheckIn = useMemo(() => {
    return !checkInDateTime && nowRef.current.getTime() >= shiftStart.getTime();
  }, [checkInDateTime, shiftStart, now]);

  const canCheckOut = isCheckedIn;

  const widgetState: 'preCheckIn' | 'onClock' | 'overtime' | 'checkedOut' = useMemo(() => {
    if (checkOutDateTime) return 'checkedOut';
    if (isCheckedIn) {
      return nowRef.current.getTime() >= shiftEnd.getTime() ? 'overtime' : 'onClock';
    }
    return 'preCheckIn';
  }, [checkOutDateTime, isCheckedIn, shiftEnd, now]);

  const handleCheckIn = async () => {
    if (isLoading || checkInDateTime) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkIn();

      if (result.error) {
        alert(result.error);
        setIsLoading(false);
        return;
      }

      if (result.data?.check_in_time) {
        const checkInTime = new Date(result.data.check_in_time);
        const checkInStatus = result.data.check_in_status || 'ontime';

        const shiftStart = setToHour(checkInTime, SHIFT_START_HOUR);
        const timeDiffMs = checkInTime.getTime() - shiftStart.getTime();
        const timeDiffMinutes = Math.floor(timeDiffMs / 60000);

        const params = new URLSearchParams({
          time: checkInTime.toISOString(),
          status: checkInStatus,
          minutesDiff: timeDiffMinutes.toString(),
        });

        const successUrl = `/check-in-success?${params.toString()}`;
        setIsLoading(false);
        window.location.href = successUrl;
        return;
      } else {
        console.error('Check-in succeeded but no data returned');
        alert('Check-in completed but failed to retrieve data. Please refresh the page.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to check in. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCheckOutRequest = () => {
    setShowCheckOutConfirm(true);
  };

  const handleCheckOut = async () => {
    if (isLoading || !checkInDateTime || checkOutDateTime) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkOut();

      if (result.error) {
        alert(result.error);
        setShowCheckOutConfirm(false);
        return;
      }

      if (result.data?.check_out_time) {
        // Revalidate SWR cache to reflect the new check-out
        mutateAttendance();
        mutateActivities();

        showToast(
          'success',
          'Checked out',
          "You've successfully checked out. Have a great day!"
        );
      }

      setShowCheckOutConfirm(false);
    } catch (error) {
      console.error('Check-out error:', error);
      alert('Failed to check out. Please try again.');
      setShowCheckOutConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestLeave = () => {
    router.push('/request-leave');
  };

  const handleOpenLeaveDetails = async () => {
    if (!activeLeaveInfo?.id) return;

    const result = await getLeaveRequest(activeLeaveInfo.id);

    if (result.data) {
      setLeaveDetailsData({
        startDate: result.data.startDate,
        endDate: result.data.endDate,
        status: result.data.status,
        requestedOn: result.data.requestedOn,
        requestedAt: result.data.requestedAt,
        approvedAt: result.data.approvedAt,
        rejectionReason: result.data.rejectionReason,
        leaveType: result.data.leaveType,
        reason: result.data.reason,
      });
      setShowLeaveDetails(true);
    } else if (result.error) {
      console.error('Error fetching leave request details:', result.error);
    }
  };

  const handleAnnouncementClick = () => {
    setShowAnnouncementBottomSheet(true);
  };

  const shiftStartForCheckIn = useMemo(() => {
    return checkInDateTime ? setToHour(checkInDateTime, SHIFT_START_HOUR) : null;
  }, [checkInDateTime]);

  const checkInCardTime = checkInDateTime ? formatClockTime(checkInDateTime) : '--:--';
  // Use database status instead of client-side recalculation
  // This ensures consistency with the HR app (single source of truth)
  const checkInStatus = dbCheckInStatus ?? undefined;
  const checkInDuration = checkInDateTime && shiftStartForCheckIn && checkInDateTime.getTime() > shiftStartForCheckIn.getTime()
    ? formatDurationFromMs(checkInDateTime.getTime() - shiftStartForCheckIn.getTime())
    : undefined;

  const remainingToShiftEndMs = useMemo(() => {
    return Math.max(0, shiftEnd.getTime() - nowRef.current.getTime());
  }, [shiftEnd, now]);

  const overtimeMs = useMemo(() => {
    return isCheckedIn ? Math.max(0, nowRef.current.getTime() - shiftEnd.getTime()) : 0;
  }, [isCheckedIn, shiftEnd, now]);

  const checkoutOvertimeMs = useMemo(() => {
    return checkOutDateTime ? Math.max(0, checkOutDateTime.getTime() - shiftEnd.getTime()) : 0;
  }, [checkOutDateTime, shiftEnd]);

  const checkoutCardTime = checkOutDateTime ? formatClockTime(checkOutDateTime) : '--:--';

  const shiftEndWithTolerance = useMemo(() => {
    return new Date(shiftEnd.getTime() + 60000);
  }, [shiftEnd]);

  const checkoutStatus = useMemo(() => {
    // If checked out, use database status (single source of truth - same as HR app)
    if (checkOutDateTime && dbCheckOutStatus) {
      return dbCheckOutStatus;
    }
    // If checked out but no status in DB (shouldn't happen), calculate fallback
    if (checkOutDateTime) {
      return checkOutDateTime.getTime() > shiftEndWithTolerance.getTime()
        ? 'overtime'
        : checkOutDateTime.getTime() < shiftEnd.getTime()
          ? 'leftearly'
          : 'ontime';
    }
    // Real-time display for employees still on the clock
    if (isCheckedIn && nowRef.current.getTime() >= shiftEnd.getTime()) {
      return 'overtime';
    }
    if (isCheckedIn) {
      return 'remaining';
    }
    return undefined;
  }, [checkOutDateTime, dbCheckOutStatus, shiftEndWithTolerance, shiftEnd, isCheckedIn, now]);

  const checkoutLeftEarlyMs = useMemo(() => {
    return checkOutDateTime && checkOutDateTime.getTime() < shiftEnd.getTime()
      ? shiftEnd.getTime() - checkOutDateTime.getTime()
      : 0;
  }, [checkOutDateTime, shiftEnd]);

  const checkoutDuration = useMemo(() => {
    if (checkOutDateTime) {
      if (checkOutDateTime.getTime() > shiftEnd.getTime()) {
        return formatDurationFromMs(checkoutOvertimeMs);
      }
      if (checkOutDateTime.getTime() < shiftEnd.getTime()) {
        return formatDurationFromMs(checkoutLeftEarlyMs);
      }
      return undefined;
    }
    if (isCheckedIn && nowRef.current.getTime() >= shiftEnd.getTime()) {
      return formatDurationFromMs(overtimeMs);
    }
    if (isCheckedIn) {
      return formatDurationFromMs(remainingToShiftEndMs);
    }
    return undefined;
  }, [checkOutDateTime, shiftEnd, isCheckedIn, checkoutOvertimeMs, checkoutLeftEarlyMs, overtimeMs, remainingToShiftEndMs, now]);


  // Note: Outer shell (bg, max-width, padding) is handled by DashboardShell server component

  // PERFORMANCE OPTIMIZATION: Show skeleton while initial data is loading
  // This provides immediate visual feedback and improves perceived performance
  if (isInitialLoading && authLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col">
          <p className="text-xl font-semibold text-neutral-800 leading-bold-xl">
            {authLoading && !profile ? (
              <span className="inline-block h-[30px] w-32 animate-pulse bg-neutral-200 rounded" aria-label="Loading user name"></span>
            ) : (
              `Welcome, ${profile?.full_name?.split(' ')[0] || profile?.username || 'User'}`
            )}
          </p>
          <p className="text-sm font-normal text-neutral-500 leading-regular-sm">
            {formattedDate}
          </p>
        </div>
        <NotificationButton
          onClick={() => router.push('/notifications')}
        />
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-col gap-[18px]">
        {/* Announcement Banner */}
        <AnnouncementBanner
          title="Moving Out Day"
          time="Today, 11:00 AM"
          onClick={handleAnnouncementClick}
        />

        {/* Check In/Out Widget */}
        <CheckInOutWidget
          shiftStart={shiftStart}
          shiftEnd={shiftEnd}
          currentTime={nowRef.current}
          checkInTime={checkInDateTime}
          checkOutTime={checkOutDateTime}
          state={widgetState}
          canCheckIn={canCheckIn}
          canCheckOut={canCheckOut}
          isLoading={isLoading}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onCheckOutRequest={handleCheckOutRequest}
          onRequestLeave={handleRequestLeave}
          hasActiveLeave={hasActiveLeave}
          activeLeaveInfo={activeLeaveInfo}
          onOpenLeaveDetails={handleOpenLeaveDetails}
        />

        {/* Attendance Log Section */}
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2.5">
            <p className="text-base font-semibold text-neutral-700 leading-bold-base">
              Attendance Log
            </p>

            <div className="flex w-full gap-2">
              <AttendanceCard
                type="checkin"
                time={checkInCardTime}
                status={checkInStatus}
                duration={checkInDuration}
              />
              <AttendanceCard
                type="checkout"
                time={checkoutCardTime}
                status={checkoutStatus}
                duration={checkoutDuration}
              />
            </div>
          </div>

          {/* Recent Activities */}
          <RecentActivities activities={recentActivities} />
        </div>

        {/* Logout Button */}
        <button
          onClick={async () => {
            // Best Practice: Add logout=true flag to prevent middleware redirect loops
            // This tells middleware that we're in a logout flow and should allow access to /login
            const redirectTimeout = setTimeout(() => {
              window.location.replace('/login?logout=true');
            }, 8000);

            try {
              console.log('[EmployeeDashboard] Starting logout...');
              await signOut();
              clearTimeout(redirectTimeout);
              console.log('[EmployeeDashboard] Logout complete, redirecting...');
              // Wait for cookies to be cleared before redirecting
              await new Promise(resolve => setTimeout(resolve, 300));
              // Use logout=true flag to bypass middleware redirect
              window.location.replace('/login?logout=true');
            } catch (error) {
              console.error('[EmployeeDashboard] Error during logout:', error);
              clearTimeout(redirectTimeout);
              await new Promise(resolve => setTimeout(resolve, 300));
              window.location.replace('/login?logout=true');
            }
          }}
          className="mt-6 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
        >
          Log Out
        </button>
      </div>

      {/* Check-Out Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCheckOutConfirm}
        onClose={() => setShowCheckOutConfirm(false)}
        onConfirm={handleCheckOut}
        title="Check-out early?"
        shiftEndTime={formatTimeWithPeriod(setToHour(now, SHIFT_END_HOUR))}
        earlyDuration={(() => {
          const shiftEnd = setToHour(now, SHIFT_END_HOUR);
          const minutesEarly = Math.floor((shiftEnd.getTime() - now.getTime()) / 60000);

          if (minutesEarly <= 0) {
            return '0 minutes';
          }

          if (minutesEarly > 60) {
            const hours = Math.floor(minutesEarly / 60);
            const minutes = minutesEarly % 60;
            if (minutes > 0) {
              return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
              return `${hours} hour${hours !== 1 ? 's' : ''}`;
            }
          }

          return `${minutesEarly} minutes`;
        })()}
        confirmText="Check Out"
        cancelText="Cancel"
      />

      {/* Leave Request Details Modal */}
      {leaveDetailsData && (
        <LeaveRequestDetailsModal
          isOpen={showLeaveDetails}
          onClose={() => setShowLeaveDetails(false)}
          startDate={leaveDetailsData.startDate}
          endDate={leaveDetailsData.endDate}
          status={leaveDetailsData.status}
          requestedOn={leaveDetailsData.requestedOn}
          requestedAt={leaveDetailsData.requestedAt}
          approvedAt={leaveDetailsData.approvedAt}
          rejectionReason={leaveDetailsData.rejectionReason}
          leaveType={leaveDetailsData.leaveType}
          reason={leaveDetailsData.reason}
        />
      )}

      {/* Announcement Bottom Sheet */}
      {currentAnnouncement && (
        <AnnouncementBottomSheet
          isOpen={showAnnouncementBottomSheet}
          onClose={() => setShowAnnouncementBottomSheet(false)}
          announcement={currentAnnouncement}
        />
      )}
    </>
  );
}

'use client';

import ButtonLarge from './ButtonLarge';
import LeaveStatusCard from './LeaveStatusCard';

type WidgetState = 'preCheckIn' | 'onClock' | 'overtime' | 'checkedOut';

interface CheckInOutWidgetProps {
  shiftStart: Date;
  shiftEnd: Date;
  currentTime: Date;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  state: WidgetState;
  canCheckIn: boolean;
  canCheckOut: boolean;
  isLoading?: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onCheckOutRequest: () => void;
  onRequestLeave: () => void;
  hasActiveLeave?: boolean;
  activeLeaveInfo?: { status: string; startDate: string; endDate: string; leaveTypeName?: string };
  onOpenLeaveDetails?: () => void;
}

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

const diffInMs = (start: Date | null, end: Date | null) => {
  if (!start || !end) {
    return 0;
  }

  return end.getTime() - start.getTime();
};

export default function CheckInOutWidget({
  shiftStart,
  shiftEnd,
  currentTime,
  checkInTime,
  checkOutTime,
  state,
  canCheckIn,
  canCheckOut,
  isLoading = false,
  onCheckIn,
  onCheckOut,
  onCheckOutRequest,
  onRequestLeave,
  hasActiveLeave = false,
  activeLeaveInfo,
  onOpenLeaveDetails,
}: CheckInOutWidgetProps) {
  // Check if today is within the leave date range
  const isOnLeaveToday = (() => {
    if (!activeLeaveInfo || activeLeaveInfo.status !== 'approved') {
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(activeLeaveInfo.startDate + 'T00:00:00');
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(activeLeaveInfo.endDate + 'T00:00:00');
    endDate.setHours(0, 0, 0, 0);
    
    return today >= startDate && today <= endDate;
  })();

  const heading = isOnLeaveToday
    ? "Enjoy your day off!"
    : state === 'checkedOut'
      ? "You've checked out"
    : state === 'preCheckIn'
        ? 'Ready to start your day?'
        : "You're on the clock";

  const shiftStartLabel = formatTimeWithPeriod(shiftStart);

  const subtitle = (() => {
    if (isOnLeaveToday) {
      const leaveTypeName = activeLeaveInfo?.leaveTypeName || 'Leave';
      return `You are on ${leaveTypeName} today.`;
    }

    if (state === 'checkedOut') {
      return 'See you tomorrow!';
    }

    if (state === 'preCheckIn') {
      const hasShiftStarted = currentTime.getTime() >= shiftStart.getTime();
      return hasShiftStarted
        ? `Your shift started at ${shiftStartLabel}.`
        : `Your shift starts at ${shiftStartLabel}.`;
    }

    if (checkInTime) {
      return `Checked in at ${formatTimeWithPeriod(checkInTime)}.`;
    }

    return '';
  })();

  const metricValue = (() => {
    if (state === 'preCheckIn') {
      return formatClockTime(currentTime);
    }

    if (state === 'checkedOut') {
      return formatDurationFromMs(diffInMs(checkInTime, checkOutTime));
    }

    const referenceEnd = state === 'onClock' ? currentTime : currentTime;
    return formatDurationFromMs(diffInMs(checkInTime, referenceEnd));
  })();

  const metricColor = state === 'overtime' ? 'text-emerald-600' : 'text-neutral-800';

  const primaryLabel = state === 'preCheckIn' || state === 'checkedOut' 
      ? 'Check-In' 
      : 'Check-Out';

  const primaryDisabled = (() => {
    if (isLoading) return true; // Disable during operations
    if (isOnLeaveToday) return true; // Disable check-in/out when on leave
    
    switch (state) {
      case 'preCheckIn':
        return !canCheckIn;
      case 'onClock':
        return false; // Always enable checkout button
      case 'overtime':
        return false; // Always enable checkout button
      case 'checkedOut':
      default:
        return true;
    }
  })();

  const handlePrimaryClick = () => {
    if (primaryDisabled) {
      return;
    }

    if (state === 'preCheckIn') {
      onCheckIn();
      return;
    }

    if (state === 'onClock' || state === 'overtime') {
      // Only show confirmation modal if checking out early (before shift end)
      const isCheckingOutEarly = currentTime.getTime() < shiftEnd.getTime();
      
      if (isCheckingOutEarly) {
        onCheckOutRequest(); // Show confirmation modal for early check-out
      } else {
        onCheckOut(); // Direct check-out for on-time or overtime
      }
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[26px] bg-gradient-to-b from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.6)] shadow-[0px_4px_8px_0px_rgba(17,17,17,0.05),0px_2px_4px_0px_rgba(17,17,17,0.05),0px_0px_4px_0px_rgba(28,28,28,0.1),inset_0px_-6px_0px_0px_rgba(38,38,38,0.05)]">
      {/* Top Container */}
      <div className="flex flex-col items-center gap-3 border-[3px] border-white bg-[rgba(17,17,17,0.02)] px-0 py-6 rounded-tl-[26px] rounded-tr-[26px]">
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-neutral-800 tracking-tight">
            {heading}
          </p>
          {subtitle && (
            <p className="text-base text-neutral-500 text-center">
              {subtitle}
            </p>
          )}
        </div>
        <p className={`text-6xl font-bold leading-[72px] text-center tracking-[-1.2px] ${metricColor}`}>
          {metricValue}
        </p>
      </div>

      {/* Bottom Container */}
      <div className="flex flex-col gap-2 px-[18px] pb-[30px] pt-5">
        {!isOnLeaveToday && (
        <ButtonLarge
          onClick={handlePrimaryClick}
          disabled={primaryDisabled}
          variant="primary"
            isLoading={isLoading}
        >
          {primaryLabel}
        </ButtonLarge>
        )}
        {hasActiveLeave && activeLeaveInfo ? (
          <LeaveStatusCard
            status={activeLeaveInfo.status as 'pending' | 'approved'}
            startDate={activeLeaveInfo.startDate}
            endDate={activeLeaveInfo.endDate}
            onClick={onOpenLeaveDetails || onRequestLeave}
          />
        ) : (
        <ButtonLarge
          onClick={onRequestLeave}
          variant="secondary"
          disabled={hasActiveLeave}
        >
            Request Leave
        </ButtonLarge>
        )}
      </div>
    </div>
  );
}



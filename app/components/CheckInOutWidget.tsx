'use client';

import ButtonLarge from './ButtonLarge';

type WidgetState = 'preCheckIn' | 'onClock' | 'overtime' | 'checkedOut';

interface CheckInOutWidgetProps {
  shiftStart: Date;
  currentTime: Date;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  state: WidgetState;
  canCheckIn: boolean;
  canCheckOut: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onCheckOutRequest: () => void;
  onRequestLeave: () => void;
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
  currentTime,
  checkInTime,
  checkOutTime,
  state,
  canCheckIn,
  canCheckOut,
  onCheckIn,
  onCheckOut,
  onCheckOutRequest,
  onRequestLeave,
}: CheckInOutWidgetProps) {
  const heading = state === 'checkedOut'
    ? "You've Checked Out"
    : state === 'preCheckIn'
      ? 'Ready To Start Your Day?'
      : "You're On The Clock";

  const shiftStartLabel = formatTimeWithPeriod(shiftStart);

  const subtitle = (() => {
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

  const primaryLabel = state === 'preCheckIn' || state === 'checkedOut' ? 'Check-In' : 'Check-Out';

  const primaryDisabled = (() => {
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
      onCheckOutRequest(); // Show confirmation modal instead of direct checkout
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[26px] bg-gradient-to-b from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.6)] shadow-[0px_4px_8px_0px_rgba(17,17,17,0.05),0px_2px_4px_0px_rgba(17,17,17,0.05),0px_0px_4px_0px_rgba(28,28,28,0.1),inset_0px_-6px_0px_0px_rgba(38,38,38,0.05)]">
      {/* Top Container */}
      <div className="flex flex-col items-center gap-3 border-[3px] border-white bg-[rgba(17,17,17,0.02)] px-0 py-6 rounded-tl-[26px] rounded-tr-[26px]">
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-neutral-700 tracking-tight">
            {heading}
          </p>
          {subtitle && (
            <p className="text-base text-neutral-800 opacity-60 text-center">
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
        <ButtonLarge
          onClick={handlePrimaryClick}
          disabled={primaryDisabled}
          variant="primary"
        >
          {primaryLabel}
        </ButtonLarge>
        <ButtonLarge
          onClick={onRequestLeave}
          variant="secondary"
        >
          Request Leave
        </ButtonLarge>
      </div>
    </div>
  );
}



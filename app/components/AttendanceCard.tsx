'use client';

import CheckInColoredIcon from '@/app/assets/icons/check-in-colored.svg';
import CheckOutColoredIcon from '@/app/assets/icons/check-out-colored.svg';
import TimerIcon from '@/app/assets/icons/timer.svg';
import WarningTriangleIcon from '@/app/assets/icons/warning-triangle.svg';

type AttendanceStatus = 'late' | 'ontime' | 'remaining';

interface AttendanceCardProps {
  type: 'checkin' | 'checkout';
  time: string;
  status?: AttendanceStatus;
  duration?: string;
}

export default function AttendanceCard({ type, time, status, duration }: AttendanceCardProps) {
  const isCheckIn = type === 'checkin';
  const isEmpty = time === '--:--';

  return (
    <div className="w-[173px] flex flex-col rounded-[10px] bg-[rgba(255,255,255,0.25)] shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(229,229,229,1)] overflow-hidden">
      {/* Top Section */}
      <div className="flex items-start gap-2 bg-white px-2.5 py-2.5 pb-3 rounded-[10px] shadow-[0px_0px_0.5px_0.5px_rgba(229,229,229,1)]">
        {/* Icon */}
        {isCheckIn ? (
          <CheckInColoredIcon className="h-9 w-9 shrink-0" />
        ) : (
          <CheckOutColoredIcon className="h-9 w-9 shrink-0" />
        )}

        {/* Text */}
        <div className="flex flex-col">
          <p className="text-base font-semibold text-neutral-600 tracking-tight leading-5">
            {isCheckIn ? 'Checked In' : 'Check Out'}
          </p>
          <p className={`text-sm font-medium leading-[18px] ${
            isEmpty ? 'text-neutral-300' : 'text-neutral-300'
          }`}>
            {time}
          </p>
        </div>
      </div>

      {/* Bottom Status Section */}
      <div className="flex items-center justify-between px-2 py-1.5">
        {/* Status Badge */}
        <div className="flex items-center gap-1">
          {status === 'late' && (
            <>
              <WarningTriangleIcon className="h-3.5 w-3.5 shrink-0" />
              <p className="text-xs font-semibold text-amber-600 tracking-tight">
                Late
              </p>
            </>
          )}
          {status === 'remaining' && (
            <>
              <TimerIcon className="h-3.5 w-3.5 shrink-0" />
              <p className="text-xs font-semibold text-neutral-500 tracking-tight">
                Remaining
              </p>
            </>
          )}
        </div>

        {/* Duration */}
        <p className="text-xs font-medium text-neutral-300">
          {duration}
        </p>
      </div>
    </div>
  );
}





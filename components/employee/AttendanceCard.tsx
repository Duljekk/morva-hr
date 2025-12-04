'use client';

import CheckInColoredIcon from '@/app/assets/icons/check-in-colored.svg';
import CheckOutColoredIcon from '@/app/assets/icons/check-out-colored.svg';

type AttendanceStatus = 'late' | 'ontime' | 'remaining' | 'overtime' | 'leftearly';

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
      <div className="flex items-start gap-2 bg-white px-2.5 py-2.5 pb-[10px] rounded-[10px] shadow-[0px_0px_0.5px_0.5px_rgba(229,229,229,1)]">
        {/* Icon */}
        {isCheckIn ? (
          <CheckInColoredIcon className="h-9 w-9 shrink-0" />
        ) : (
          <CheckOutColoredIcon className="h-9 w-9 shrink-0" />
        )}

        {/* Text */}
        <div className="flex flex-col">
          <p className="text-base font-semibold text-neutral-700 leading-bold-base">
            {isCheckIn ? 'Checked In' : 'Check Out'}
          </p>
          <p className={`text-sm font-medium leading-bold-sm ${
            isEmpty ? 'text-neutral-400' : 'text-neutral-400'
          }`}>
            {time}
          </p>
        </div>
      </div>

      {/* Bottom Status Section - Only show when there's a status */}
      {status && (
        <div className="flex items-center justify-between px-2 py-1.5">
          {/* Status Badge */}
          <div className="flex items-center gap-1">
            {status === 'late' && (
                <p className="text-xs font-semibold text-amber-600 leading-bold-xs">
                  Late
                </p>
            )}
            {status === 'ontime' && (
                <p className="text-xs font-semibold text-emerald-600 leading-bold-xs">
                  On Time
                </p>
            )}
            {status === 'overtime' && (
              <p className="text-xs font-semibold text-neutral-500 leading-bold-xs">
                  Overtime
                </p>
            )}
            {status === 'leftearly' && (
                <p className="text-xs font-semibold text-amber-600 leading-bold-xs">
                  Left Early
                </p>
            )}
            {status === 'remaining' && (
                <p className="text-xs font-semibold text-neutral-500 leading-bold-xs">
                  Remaining
                </p>
            )}
          </div>

          {/* Duration */}
          <p className="text-xs font-medium text-neutral-400">
            {duration}
          </p>
        </div>
      )}
    </div>
  );
}





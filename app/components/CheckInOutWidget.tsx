'use client';

import { useState, useEffect } from 'react';
import ButtonLarge from './ButtonLarge';

interface CheckInOutWidgetProps {
  shiftStart: string;
  onCheckIn: () => void;
  onRequestLeave: () => void;
  isCheckedIn: boolean;
}

export default function CheckInOutWidget({ 
  shiftStart, 
  onCheckIn, 
  onRequestLeave,
  isCheckedIn 
}: CheckInOutWidgetProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-[26px] bg-gradient-to-b from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.6)] shadow-[0px_4px_8px_0px_rgba(17,17,17,0.05),0px_2px_4px_0px_rgba(17,17,17,0.05),0px_0px_4px_0px_rgba(28,28,28,0.1),inset_0px_-6px_0px_0px_rgba(38,38,38,0.05)]">
      {/* Top Container */}
      <div className="flex flex-col items-center gap-3 border-[3px] border-white bg-[rgba(17,17,17,0.02)] px-0 py-6 rounded-tl-[26px] rounded-tr-[26px]">
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-neutral-700 tracking-tight">
            {isCheckedIn ? "You're Checked In" : "Ready To Start Your Day?"}
          </p>
          <p className="text-base text-neutral-800 opacity-60">
            Your shift {isCheckedIn ? 'started' : 'starts'} at {shiftStart}.
          </p>
        </div>
        <p className="text-6xl font-bold leading-[72px] text-neutral-800 text-center tracking-[-1.2px]">
          {currentTime}
        </p>
      </div>

      {/* Bottom Container */}
      <div className="flex flex-col gap-2 px-[18px] pb-[30px] pt-5">
        <ButtonLarge
          onClick={onCheckIn}
          disabled={isCheckedIn}
          variant="primary"
        >
          {isCheckedIn ? 'Check-Out' : 'Check-In'}
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



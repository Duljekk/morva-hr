'use client';

import ChevronRightSmallIcon from '@/app/assets/icons/chevron-right-small.svg';
import IndicatorPulseOrangeIcon from '@/app/assets/icons/indicator-pulse-orange.svg';
import IndicatorPulseGreenIcon from '@/app/assets/icons/indicator-pulse-green.svg';

interface LeaveStatusCardProps {
  status: 'pending' | 'approved';
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  onClick?: () => void;
}

export default function LeaveStatusCard({ status, startDate, endDate, onClick }: LeaveStatusCardProps) {
  // Format date range like "For Nov 14 - Nov 15"
  const formatDateRange = (start: string, end: string): string => {
    const startDateObj = new Date(start + 'T00:00:00');
    const endDateObj = new Date(end + 'T00:00:00');
    
    const startMonth = startDateObj.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDateObj.getDate();
    const endMonth = endDateObj.toLocaleDateString('en-US', { month: 'short' });
    const endDay = endDateObj.getDate();
    
    return `For ${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  const isApproved = status === 'approved';
  const buttonText = isApproved ? 'Request Approved' : 'Request Sent';
  const statusText = isApproved ? formatDateRange(startDate, endDate) : 'Awaiting Approval';
  const IndicatorIcon = isApproved ? IndicatorPulseGreenIcon : IndicatorPulseOrangeIcon;

  return (
    <div 
      className={`bg-neutral-100 border border-neutral-200 rounded-[14px] flex flex-col items-center w-full ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Top section - Button */}
      <div className="flex flex-col gap-2.5 items-start pt-1 px-1 w-full">
        <div className="bg-white border border-neutral-200 flex h-12 items-center justify-center px-5 py-1.5 rounded-xl w-full">
          <p className="text-base font-semibold text-neutral-700 leading-bold-base text-center whitespace-pre">
            {buttonText}
          </p>
        </div>
      </div>

      {/* Bottom section - Status with indicator and chevron */}
      <div className="flex gap-1.5 items-center justify-center pb-2 pt-2 px-2.5 rounded-bl-[14px] rounded-br-[14px] w-full">
        <div className="flex gap-0.5 items-center">
          <div className="flex gap-1 items-center pb-0.5 pt-0">
            <div className="shrink-0 w-2 h-2">
              <IndicatorIcon className="w-2 h-2" />
            </div>
            <div className="flex gap-2.5 items-center justify-center">
              <p className="text-xs font-medium text-neutral-500 text-center whitespace-pre leading-4">
                {statusText}
              </p>
            </div>
          </div>
          <div className="overflow-clip shrink-0 w-4 h-4">
            <ChevronRightSmallIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}


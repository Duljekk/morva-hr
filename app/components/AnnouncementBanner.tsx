'use client';

import { ChevronRightIcon } from './Icons';
import MegaphoneIcon from '@/app/assets/icons/megaphone.svg';

interface AnnouncementBannerProps {
  title: string;
  time: string;
  onClick?: () => void;
}

export default function AnnouncementBanner({ title, time, onClick }: AnnouncementBannerProps) {
  return (
    <div 
      className="flex h-10 items-center justify-between rounded-xl border border-teal-400 bg-[rgba(203,251,241,0.6)] px-3 py-2 cursor-pointer hover:bg-[rgba(203,251,241,0.8)] transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <MegaphoneIcon className="h-4 w-4 shrink-0" />
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-teal-700 tracking-tight">
            {title}
          </p>
          <div className="h-1.5 w-1.5 rounded-full bg-teal-700" />
          <p className="text-sm text-teal-700">
            {time}
          </p>
        </div>
      </div>
      <ChevronRightIcon className="h-4 w-4 text-teal-400" />
    </div>
  );
}





'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon } from './components/Icons';
import AnnouncementBanner from './components/AnnouncementBanner';
import CheckInOutWidget from './components/CheckInOutWidget';
import AttendanceCard from './components/AttendanceCard';
import RecentActivities from './components/RecentActivities';

export default function Home() {
  const router = useRouter();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('--:--');

  // Dynamic date formatting
  const formattedDate = useMemo(() => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const day = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const year = today.getFullYear();
    
    // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    const getOrdinalSuffix = (num: number) => {
      const j = num % 10;
      const k = num % 100;
      if (j === 1 && k !== 11) return num + 'st';
      if (j === 2 && k !== 12) return num + 'nd';
      if (j === 3 && k !== 13) return num + 'rd';
      return num + 'th';
    };
    
    return `It's ${dayName}, ${getOrdinalSuffix(day)} ${month} ${year}`;
  }, []);

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCheckInTime(`${hours}:${minutes}`);
      setIsCheckedIn(true);
    } else {
      // Handle checkout
      setIsCheckedIn(false);
      // In a real app, you would save this data
    }
  };

  const handleRequestLeave = () => {
    router.push('/request-leave');
  };

  const handleAnnouncementClick = () => {
    alert('Announcement details would open here');
  };

  // Sample data for recent activities
  const recentActivities = [
    {
      date: 'October 30',
      activities: [
        { type: 'checkin' as const, time: '11:12', status: 'late' as const },
        { type: 'checkout' as const, time: '19:30', status: 'ontime' as const },
      ],
    },
    {
      date: 'October 29',
      activities: [
        { type: 'checkin' as const, time: '10:58', status: 'ontime' as const },
        { type: 'checkout' as const, time: '19:15', status: 'ontime' as const },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-neutral-50">
      {/* Main Content Container - Mobile First (375px base) */}
      <div className="mx-auto w-full max-w-[402px] pb-20">
        {/* Content */}
        <div className="flex flex-col items-center gap-3 px-6 pt-[74px]">
          {/* Header Section */}
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col">
              <p className="text-xl font-semibold text-neutral-800 tracking-tight leading-[30px]">
                Welcome, Duljek
              </p>
              <p className="text-sm text-neutral-500 tracking-tight leading-5">
                {formattedDate}
              </p>
            </div>
            <button 
              className="flex h-7 w-7 items-center justify-center"
              onClick={() => alert('Notifications would open here')}
            >
              <BellIcon className="h-5 w-5 text-neutral-800" />
            </button>
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
              shiftStart="11:00 AM"
              onCheckIn={handleCheckIn}
              onRequestLeave={handleRequestLeave}
              isCheckedIn={isCheckedIn}
            />

            {/* Attendance Log Section */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full flex-col gap-2.5">
                <p className="text-base font-semibold text-neutral-700 tracking-tight">
                  Attendance Log
                </p>
                <div className="flex w-full gap-2">
                  <AttendanceCard
                    type="checkin"
                    time={checkInTime}
                    status="late"
                    duration="12 min"
                  />
                  <AttendanceCard
                    type="checkout"
                    time="--:--"
                    status="remaining"
                    duration="2h 30m"
                  />
                </div>
              </div>

              {/* Recent Activities */}
              <RecentActivities activities={recentActivities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

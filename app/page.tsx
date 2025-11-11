'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getTodaysAttendance, checkIn, checkOut } from '@/lib/actions/attendance';
import NotificationButton from './components/NotificationButton';
import AnnouncementBanner from './components/AnnouncementBanner';
import CheckInOutWidget from './components/CheckInOutWidget';
import AttendanceCard from './components/AttendanceCard';
import RecentActivities from './components/RecentActivities';
import ConfirmationModal from './components/ConfirmationModal';

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

export default function Home() {
  const router = useRouter();
  const { signOut, profile } = useAuth();
  const [now, setNow] = useState(new Date());
  const [checkInDateTime, setCheckInDateTime] = useState<Date | null>(null);
  const [checkOutDateTime, setCheckOutDateTime] = useState<Date | null>(null);
  const [showCheckOutConfirm, setShowCheckOutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch today's attendance from database on mount
  useEffect(() => {
    async function loadAttendance() {
      const result = await getTodaysAttendance();
      if (result.data) {
        // Convert ISO strings back to Date objects
        if (result.data.check_in_time) {
          setCheckInDateTime(new Date(result.data.check_in_time));
        }
        if (result.data.check_out_time) {
          setCheckOutDateTime(new Date(result.data.check_out_time));
        }
      }
    }
    loadAttendance();
  }, []);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  const shiftStart = useMemo(() => setToHour(now, SHIFT_START_HOUR), [now]);
  const shiftEnd = useMemo(() => setToHour(now, SHIFT_END_HOUR), [now]);

  // Determine widget state
  const isCheckedIn = !!checkInDateTime && !checkOutDateTime;
  const canCheckIn = !checkInDateTime && now.getTime() >= shiftStart.getTime();
  const canCheckOut = isCheckedIn;
  
  const widgetState: 'preCheckIn' | 'onClock' | 'overtime' | 'checkedOut' = checkOutDateTime
    ? 'checkedOut'
    : isCheckedIn
      ? (now.getTime() >= shiftEnd.getTime() ? 'overtime' : 'onClock')
      : 'preCheckIn';

  const handleCheckIn = async () => {
    if (isLoading || checkInDateTime) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkIn();
      
      if (result.error) {
        alert(result.error);
      return;
    }

      // Update UI with returned data
      if (result.data?.check_in_time) {
        setCheckInDateTime(new Date(result.data.check_in_time));
    setCheckOutDateTime(null);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to check in. Please try again.');
    } finally {
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

      // Update UI with returned data
      if (result.data?.check_out_time) {
        setCheckOutDateTime(new Date(result.data.check_out_time));
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

  const handleAnnouncementClick = () => {
    alert('Announcement details would open here');
  };

  // Check-in card data
  const checkInCardTime = checkInDateTime ? formatClockTime(checkInDateTime) : '--:--';
  const checkInStatus = checkInDateTime 
    ? (checkInDateTime.getTime() > shiftStart.getTime() ? 'late' : 'ontime')
    : undefined;
  const checkInDuration = checkInDateTime && checkInDateTime.getTime() > shiftStart.getTime()
    ? formatDurationFromMs(checkInDateTime.getTime() - shiftStart.getTime())
    : undefined;

  // Check-out card data
  const remainingToShiftEndMs = Math.max(0, shiftEnd.getTime() - now.getTime());
  const overtimeMs = isCheckedIn ? Math.max(0, now.getTime() - shiftEnd.getTime()) : 0;
  const checkoutOvertimeMs = checkOutDateTime ? Math.max(0, checkOutDateTime.getTime() - shiftEnd.getTime()) : 0;

  const checkoutCardTime = checkOutDateTime ? formatClockTime(checkOutDateTime) : '--:--';
  const checkoutStatus = checkOutDateTime
    ? (checkOutDateTime.getTime() > shiftEnd.getTime() 
        ? 'overtime' 
        : checkOutDateTime.getTime() < shiftEnd.getTime() 
          ? 'leftearly' 
          : 'ontime')
    : isCheckedIn && now.getTime() >= shiftEnd.getTime()
      ? 'overtime'
      : isCheckedIn
        ? 'remaining'
        : undefined;

  const checkoutLeftEarlyMs = checkOutDateTime && checkOutDateTime.getTime() < shiftEnd.getTime()
    ? shiftEnd.getTime() - checkOutDateTime.getTime()
    : 0;

  const checkoutDuration = checkOutDateTime
    ? (checkOutDateTime.getTime() > shiftEnd.getTime()
        ? formatDurationFromMs(checkoutOvertimeMs)
        : checkOutDateTime.getTime() < shiftEnd.getTime()
          ? formatDurationFromMs(checkoutLeftEarlyMs)
          : undefined)
    : isCheckedIn && now.getTime() >= shiftEnd.getTime()
      ? formatDurationFromMs(overtimeMs)
      : isCheckedIn
        ? formatDurationFromMs(remainingToShiftEndMs)
        : undefined;

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
        { type: 'checkout' as const, time: '18:15', status: 'leftearly' as const },
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
                Welcome, {profile?.full_name?.split(' ')[0] || profile?.username || 'User'}
              </p>
              <p className="text-sm text-neutral-500 tracking-tight leading-5">
                {formattedDate}
              </p>
            </div>
            <NotificationButton
              hasNotification={true}
              onClick={() => alert('Notifications would open here')}
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
              currentTime={now}
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
                console.log('🔴 Logout button clicked!');
                
                // Set a safety timeout to redirect even if signOut hangs (6 seconds)
                const redirectTimeout = setTimeout(() => {
                  console.log('🔴 Safety timeout triggered, forcing redirect...');
                  window.location.replace('/login');
                }, 6000);
                
                try {
                  console.log('🔴 Calling signOut...');
                  await signOut();
                  console.log('🔴 SignOut completed successfully');
                  clearTimeout(redirectTimeout);
                  
                  // Small delay to ensure cookies are fully cleared
                  await new Promise(resolve => setTimeout(resolve, 150));
                  
                  console.log('🔴 Redirecting to login...');
                  window.location.replace('/login');
                } catch (error) {
                  console.error('🔴 Error during logout:', error);
                  clearTimeout(redirectTimeout);
                  // Force redirect even on error
                  window.location.replace('/login');
                }
              }}
              className="mt-6 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Check-Out Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCheckOutConfirm}
        onClose={() => setShowCheckOutConfirm(false)}
        onConfirm={handleCheckOut}
        title="Check-Out Early?"
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
    </div>
  );
}

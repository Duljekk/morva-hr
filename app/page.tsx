'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';
import { getTodaysAttendance, checkIn, checkOut, getRecentActivities, type DayActivity } from '@/lib/actions/attendance';
import { hasActiveLeaveRequest } from '@/lib/actions/leaves';
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
  const [recentActivities, setRecentActivities] = useState<DayActivity[]>([]);
  const [hasActiveLeave, setHasActiveLeave] = useState(false);
  const [activeLeaveInfo, setActiveLeaveInfo] = useState<{ status: string; startDate: string; endDate: string; leaveTypeName?: string } | undefined>(undefined);

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

  // Fetch active leave status on mount
  useEffect(() => {
    async function loadActiveLeaveStatus() {
      const result = await hasActiveLeaveRequest();
      if (result.data) {
        setHasActiveLeave(result.data.hasActive);
        if (result.data.request) {
          // Get leave type name from the request (now included in response from hasActiveLeaveRequest)
          const leaveTypeName = (result.data.request as any).leaveTypeName || 
            (() => {
              // Fallback to mapping if leaveTypeName not available
              const leaveTypeMap: Record<string, string> = {
                'annual': 'Annual Leave',
                'sick': 'Sick Leave',
                'unpaid': 'Unpaid Leave',
              };
              return leaveTypeMap[result.data.request.leave_type_id] || 'Leave';
            })();
          
          setActiveLeaveInfo({
            status: result.data.request.status,
            startDate: result.data.request.start_date,
            endDate: result.data.request.end_date,
            leaveTypeName,
          });
        }
      } else if (result.error) {
        console.error('Error loading active leave status:', result.error);
        // On error, default to false (allow leave requests)
        setHasActiveLeave(false);
      }
    }
    loadActiveLeaveStatus();
  }, []);

  // Calculate shift times (needed for loadRecentActivities)
  const shiftStart = useMemo(() => setToHour(now, SHIFT_START_HOUR), [now]);
  const shiftEnd = useMemo(() => setToHour(now, SHIFT_END_HOUR), [now]);

  // Function to format date like "October 30"
  const formatActivityDate = useCallback((date: Date): string => {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${month} ${day}`;
  }, []);

  // Function to format time like "11:12"
  const formatActivityTime = useCallback((date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }, []);

  // Function to load recent activities
  const loadRecentActivities = useCallback(async () => {
    const result = await getRecentActivities(14);
    if (result.data) {
      let activities = result.data;
      
      // Check if today's activities are included
      const todayDateString = formatActivityDate(new Date());
      const todayInActivities = activities.find(day => day.date === todayDateString);
      
      // Only merge today's activities if they're NOT already in the backend response
      // This ensures we use the correct status from the database
      if (!todayInActivities && (checkInDateTime || checkOutDateTime)) {
        // Calculate shift times when needed (using check-in date for accuracy)
        const referenceDate = checkInDateTime || checkOutDateTime || new Date();
        const currentShiftStart = setToHour(referenceDate, SHIFT_START_HOUR);
        const currentShiftEnd = setToHour(referenceDate, SHIFT_END_HOUR);
        
        const todayActivities: typeof activities[0]['activities'] = [];
        
        // Add check-in activity if exists
        if (checkInDateTime) {
          // Use same logic as backend: 1 minute tolerance (check-in at 11:00:00 to 11:00:59 is ontime)
          const shiftStartWithTolerance = new Date(currentShiftStart.getTime() + 60000); // Add 1 minute tolerance
          const checkInStatus = checkInDateTime.getTime() >= shiftStartWithTolerance.getTime() ? 'late' : 'ontime';
          todayActivities.push({
            type: 'checkin' as const,
            time: formatActivityTime(checkInDateTime),
            status: checkInStatus,
          });
        }
        
        // Add check-out activity if exists
        if (checkOutDateTime) {
          const checkOutStatus = checkOutDateTime.getTime() > currentShiftEnd.getTime() 
            ? 'overtime' 
            : checkOutDateTime.getTime() < currentShiftEnd.getTime() 
              ? 'leftearly' 
              : 'ontime';
          todayActivities.push({
            type: 'checkout' as const,
            time: formatActivityTime(checkOutDateTime),
            status: checkOutStatus,
          });
        }
        
        // Add today's entry at the beginning (newest first) only if we have activities
        if (todayActivities.length > 0) {
          activities = [{ date: todayDateString, activities: todayActivities }, ...activities];
        }
      }
      
      setRecentActivities(activities);
    } else if (result.error) {
      console.error('Error loading recent activities:', result.error);
      
      // Even on error, try to show today's activities if we have them
      if (checkInDateTime || checkOutDateTime) {
        // Calculate shift times when needed
        const referenceDate = checkInDateTime || checkOutDateTime || new Date();
        const currentShiftStart = setToHour(referenceDate, SHIFT_START_HOUR);
        const currentShiftEnd = setToHour(referenceDate, SHIFT_END_HOUR);
        
        const todayDateString = formatActivityDate(new Date());
        const todayActivities: typeof recentActivities[0]['activities'] = [];
        
        if (checkInDateTime) {
          // Use same logic as backend: 1 minute tolerance (check-in at 11:00:00 to 11:00:59 is ontime)
          const shiftStartWithTolerance = new Date(currentShiftStart.getTime() + 60000); // Add 1 minute tolerance
          const checkInStatus = checkInDateTime.getTime() >= shiftStartWithTolerance.getTime() ? 'late' : 'ontime';
          todayActivities.push({
            type: 'checkin' as const,
            time: formatActivityTime(checkInDateTime),
            status: checkInStatus,
          });
        }
        
        if (checkOutDateTime) {
          const checkOutStatus = checkOutDateTime.getTime() > currentShiftEnd.getTime() 
            ? 'overtime' 
            : checkOutDateTime.getTime() < currentShiftEnd.getTime() 
              ? 'leftearly' 
              : 'ontime';
          todayActivities.push({
            type: 'checkout' as const,
            time: formatActivityTime(checkOutDateTime),
            status: checkOutStatus,
          });
        }
        
        if (todayActivities.length > 0) {
          setRecentActivities([{ date: todayDateString, activities: todayActivities }]);
        } else {
          setRecentActivities([]);
        }
      } else {
        setRecentActivities([]);
      }
    }
  }, [checkInDateTime, checkOutDateTime, formatActivityDate, formatActivityTime]);

  // Fetch recent activities from database on mount and when check-in/check-out changes
  useEffect(() => {
    loadRecentActivities();
  }, [loadRecentActivities]);

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

      // Redirect to success page with check-in data
      if (result.data?.check_in_time) {
        const checkInTime = new Date(result.data.check_in_time);
        const checkInStatus = result.data.check_in_status || 'ontime';
        
        // Calculate time difference from shift start
        const shiftStart = setToHour(checkInTime, SHIFT_START_HOUR);
        const timeDiffMs = checkInTime.getTime() - shiftStart.getTime();
        const timeDiffMinutes = Math.floor(timeDiffMs / 60000);
        
        // Redirect to success page with check-in data as URL params
        const params = new URLSearchParams({
          time: checkInTime.toISOString(),
          status: checkInStatus,
          minutesDiff: timeDiffMinutes.toString(),
        });
        router.push(`/check-in-success?${params.toString()}`);
        return; // Don't update state here, let the success page handle it
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
        // Recent activities will refresh automatically via useEffect
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
  // Calculate shift start time based on the check-in date, not current time
  const shiftStartForCheckIn = useMemo(() => {
    return checkInDateTime ? setToHour(checkInDateTime, SHIFT_START_HOUR) : null;
  }, [checkInDateTime]);

  const checkInCardTime = checkInDateTime ? formatClockTime(checkInDateTime) : '--:--';
  const checkInStatus = checkInDateTime && shiftStartForCheckIn
    ? (() => {
        // Add 1 minute tolerance to shift start time
        const shiftStartWithTolerance = new Date(shiftStartForCheckIn.getTime() + 60000); // 60 seconds = 1 minute
        // Only mark as late if check-in time is >= shift start + 1 minute (11:01:00 and later)
        return checkInDateTime.getTime() >= shiftStartWithTolerance.getTime() ? 'late' : 'ontime';
      })()
    : undefined;
  const checkInDuration = checkInDateTime && shiftStartForCheckIn && checkInDateTime.getTime() > shiftStartForCheckIn.getTime()
    ? formatDurationFromMs(checkInDateTime.getTime() - shiftStartForCheckIn.getTime())
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
              hasActiveLeave={hasActiveLeave}
              activeLeaveInfo={activeLeaveInfo}
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

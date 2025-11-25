'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/app/contexts/ToastContext';
import { getTodaysAttendance, checkIn, checkOut, getRecentActivities, type DayActivity } from '@/lib/actions/attendance';
import { hasActiveLeaveRequest, getLeaveRequest } from '@/lib/actions/leaves';
import { getActiveAnnouncements } from '@/lib/actions/announcements';
import type { Announcement as AnnouncementComponentType } from './components/AnnouncementBottomSheet';
import NotificationButton from './components/NotificationButton';
import AnnouncementBanner from './components/AnnouncementBanner';
import CheckInOutWidget from './components/CheckInOutWidget';
import AttendanceCard from './components/AttendanceCard';
import RecentActivities from './components/RecentActivities';
import ConfirmationModal from './components/ConfirmationModal';
import LeaveRequestDetailsModal from './components/LeaveRequestDetailsModal';
import AnnouncementBottomSheet from './components/AnnouncementBottomSheet';

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
  const { signOut, profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  // Use ref to track current time without causing re-renders
  const nowRef = useRef(new Date());
  // State for time-dependent calculations - only updates when needed for UI
  const [now, setNow] = useState(new Date());
  const [checkInDateTime, setCheckInDateTime] = useState<Date | null>(null);
  const [checkOutDateTime, setCheckOutDateTime] = useState<Date | null>(null);
  const [showCheckOutConfirm, setShowCheckOutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState<DayActivity[]>([]);
  const [hasActiveLeave, setHasActiveLeave] = useState(false);
  const [activeLeaveInfo, setActiveLeaveInfo] = useState<{ id?: string; status: string; startDate: string; endDate: string; leaveTypeName?: string } | undefined>(undefined);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);
  const [leaveDetailsData, setLeaveDetailsData] = useState<{
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedOn: string;
    requestedAt?: string;
    approvedAt?: string;
    rejectionReason?: string;
    leaveType: string;
    reason: string;
  } | null>(null);
  const [showAnnouncementBottomSheet, setShowAnnouncementBottomSheet] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementComponentType | null>(null);

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

  // Fetch active announcements on mount
  useEffect(() => {
    async function loadAnnouncements() {
      const result = await getActiveAnnouncements();
      if (result.data && result.data.length > 0) {
        // Use the most recent announcement
        const announcement = result.data[0];
        const announcementDate = new Date(announcement.created_at);
        
        // Map database announcement to component format
        setCurrentAnnouncement({
          id: announcement.id,
          title: announcement.title,
          date: announcementDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          time: formatTimeWithPeriod(announcementDate),
          body: announcement.content || '',
        });
      }
    }
    loadAnnouncements();
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
            id: result.data.request.id,
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

  // Track current date components to detect date changes
  // This only updates when the actual date changes, not every second
  const [currentDateKey, setCurrentDateKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  });

  // Ref to track date key without causing re-renders
  const dateKeyRef = useRef(currentDateKey);

  // Sync ref with state when state changes
  useEffect(() => {
    dateKeyRef.current = currentDateKey;
  }, [currentDateKey]);

  // Update date key only when date actually changes (not every second)
  useEffect(() => {
    const checkDateChange = () => {
      const d = nowRef.current;
      const newDateKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (newDateKey !== dateKeyRef.current) {
        dateKeyRef.current = newDateKey;
        setCurrentDateKey(newDateKey);
      }
    };

    // Check on mount and then periodically (every minute is sufficient for date changes)
    checkDateChange();
    const interval = setInterval(checkDateChange, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []); // Empty deps - uses refs internally

  // Calculate shift times - memoized to prevent recalculation on every render
  // These only need to update when the date changes, not every second
  const shiftStart = useMemo(() => {
    return setToHour(nowRef.current, SHIFT_START_HOUR);
  }, [currentDateKey]); // Only recalculate when date changes
  
  const shiftEnd = useMemo(() => {
    return setToHour(nowRef.current, SHIFT_END_HOUR);
  }, [currentDateKey]); // Only recalculate when date changes

  // Refs to store current check-in/out times for stable callback references
  const checkInDateTimeRef = useRef<Date | null>(null);
  const checkOutDateTimeRef = useRef<Date | null>(null);
  
  // Update refs when state changes
  useEffect(() => {
    checkInDateTimeRef.current = checkInDateTime;
  }, [checkInDateTime]);
  
  useEffect(() => {
    checkOutDateTimeRef.current = checkOutDateTime;
  }, [checkOutDateTime]);

  // Helper functions moved outside component - they're pure functions with no dependencies
  // These don't need to be in useCallback since they're not used as dependencies
  const formatActivityDate = (date: Date): string => {
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const formatActivityTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Function to load recent activities
  // Uses refs to access current values without including them in dependencies
  // This prevents unnecessary callback recreation and API calls
  const loadRecentActivities = useCallback(async () => {
    const result = await getRecentActivities(3);
    if (result.data) {
      let activities = result.data;
      
      // Check if today's activities are included
      const todayDateString = formatActivityDate(new Date());
      const todayInActivities = activities.find(day => day.date === todayDateString);
      
      // Only merge today's activities if they're NOT already in the backend response
      // This ensures we use the correct status from the database
      // Use refs to get current values without dependencies
      const currentCheckIn = checkInDateTimeRef.current;
      const currentCheckOut = checkOutDateTimeRef.current;
      
      if (!todayInActivities && (currentCheckIn || currentCheckOut)) {
        // Calculate shift times when needed (using check-in date for accuracy)
        const referenceDate = currentCheckIn || currentCheckOut || new Date();
        const currentShiftStart = setToHour(referenceDate, SHIFT_START_HOUR);
        const currentShiftEnd = setToHour(referenceDate, SHIFT_END_HOUR);
        
        const todayActivities: typeof activities[0]['activities'] = [];
        
        // Add check-in activity if exists
        if (currentCheckIn) {
          // Use same logic as backend: 1 minute tolerance (check-in at 11:00:00 to 11:00:59 is ontime)
          const shiftStartWithTolerance = new Date(currentShiftStart.getTime() + 60000); // Add 1 minute tolerance
          const checkInStatus = currentCheckIn.getTime() >= shiftStartWithTolerance.getTime() ? 'late' : 'ontime';
          todayActivities.push({
            type: 'checkin' as const,
            time: formatActivityTime(currentCheckIn),
            status: checkInStatus,
          });
        }
        
        // Add check-out activity if exists
        if (currentCheckOut) {
          // Use same logic as backend: 1 minute tolerance (check-out at 19:00:00 to 19:00:59 is ontime)
          const shiftEndWithTolerance = new Date(currentShiftEnd.getTime() + 60000); // Add 1 minute tolerance
          const checkOutStatus = currentCheckOut.getTime() > shiftEndWithTolerance.getTime() 
            ? 'overtime' 
            : currentCheckOut.getTime() < currentShiftEnd.getTime() 
              ? 'leftearly' 
              : 'ontime';
          todayActivities.push({
            type: 'checkout' as const,
            time: formatActivityTime(currentCheckOut),
            status: checkOutStatus,
          });
        }
        
        // Add today's entry at the beginning (newest first) only if we have activities
        if (todayActivities.length > 0) {
          activities = [{ date: todayDateString, activities: todayActivities }, ...activities];
        }
      }
      
      // Limit to 3 days maximum (including today)
      activities = activities.slice(0, 3);
      
      setRecentActivities(activities);
    } else if (result.error) {
      console.error('Error loading recent activities:', result.error);
      
      // Even on error, try to show today's activities if we have them
      // Use refs to get current values
      const currentCheckIn = checkInDateTimeRef.current;
      const currentCheckOut = checkOutDateTimeRef.current;
      
      if (currentCheckIn || currentCheckOut) {
        // Calculate shift times when needed
        const referenceDate = currentCheckIn || currentCheckOut || new Date();
        const currentShiftStart = setToHour(referenceDate, SHIFT_START_HOUR);
        const currentShiftEnd = setToHour(referenceDate, SHIFT_END_HOUR);
        
        const todayDateString = formatActivityDate(new Date());
        const todayActivities: typeof recentActivities[0]['activities'] = [];
        
        if (currentCheckIn) {
          // Use same logic as backend: 1 minute tolerance (check-in at 11:00:00 to 11:00:59 is ontime)
          const shiftStartWithTolerance = new Date(currentShiftStart.getTime() + 60000); // Add 1 minute tolerance
          const checkInStatus = currentCheckIn.getTime() >= shiftStartWithTolerance.getTime() ? 'late' : 'ontime';
          todayActivities.push({
            type: 'checkin' as const,
            time: formatActivityTime(currentCheckIn),
            status: checkInStatus,
          });
        }
        
        if (currentCheckOut) {
          // Use same logic as backend: 1 minute tolerance (check-out at 19:00:00 to 19:00:59 is ontime)
          const shiftEndWithTolerance = new Date(currentShiftEnd.getTime() + 60000); // Add 1 minute tolerance
          const checkOutStatus = currentCheckOut.getTime() > shiftEndWithTolerance.getTime() 
            ? 'overtime' 
            : currentCheckOut.getTime() < currentShiftEnd.getTime() 
              ? 'leftearly' 
              : 'ontime';
          todayActivities.push({
            type: 'checkout' as const,
            time: formatActivityTime(currentCheckOut),
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
  }, []); // Empty deps - function uses refs to access current values

  // Debounce timer ref to prevent rapid successive calls
  const loadActivitiesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMountedRef = useRef(false);

  // Fetch recent activities from database on mount and when check-in/check-out changes
  // Debounced to prevent rapid successive API calls
  useEffect(() => {
    // Clear any pending debounce timer
    if (loadActivitiesTimeoutRef.current) {
      clearTimeout(loadActivitiesTimeoutRef.current);
    }

    // On initial mount, load immediately (no debounce needed)
    // For subsequent changes, debounce to batch rapid state changes
    const shouldDebounce = hasMountedRef.current;
    hasMountedRef.current = true;

    const loadActivities = () => {
    loadRecentActivities();
    };

    if (shouldDebounce) {
      // Debounce the API call by 300ms to batch rapid state changes
      loadActivitiesTimeoutRef.current = setTimeout(loadActivities, 300);
    } else {
      // Load immediately on mount
      loadActivities();
    }

    return () => {
      if (loadActivitiesTimeoutRef.current) {
        clearTimeout(loadActivitiesTimeoutRef.current);
      }
    };
  }, [checkInDateTime, checkOutDateTime, loadRecentActivities]); // Only trigger when check-in/out actually changes

  // Update time reference and state
  // Use requestAnimationFrame for smoother updates, fallback to setInterval
  useEffect(() => {
    let animationFrameId: number | null = null;
    let intervalId: NodeJS.Timeout | null = null;
    let lastUpdateTime = Date.now();

    const updateTime = () => {
      const currentTime = new Date();
      nowRef.current = currentTime;
      
      // Only update state if a full second has passed (reduces re-renders)
      const nowMs = Date.now();
      if (nowMs - lastUpdateTime >= 1000) {
        setNow(currentTime);
        lastUpdateTime = nowMs;
      }
    };

    // Use requestAnimationFrame for smoother updates when tab is active
    const scheduleUpdate = () => {
      animationFrameId = requestAnimationFrame(() => {
        updateTime();
        scheduleUpdate();
      });
    };

    // Start with requestAnimationFrame
    scheduleUpdate();

    // Fallback to setInterval for reliability (updates every second)
    intervalId = setInterval(updateTime, 1000);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Helper function for date formatting - moved outside component logic
  // This is a pure function that doesn't need memoization
  const formatFullDate = (date: Date): string => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `It's ${dayName}, ${month} ${day}, ${year}`;
  };

  // Dynamic date formatting - only updates when date changes, not every second
  // Uses currentDateKey which only changes when the actual date changes
  const formattedDate = useMemo(() => {
    return formatFullDate(nowRef.current);
  }, [currentDateKey]); // Only recalculate when date changes

  // Determine widget state - memoized to prevent recalculation
  const isCheckedIn = !!checkInDateTime && !checkOutDateTime;
  
  const canCheckIn = useMemo(() => {
    return !checkInDateTime && nowRef.current.getTime() >= shiftStart.getTime();
  }, [checkInDateTime, shiftStart, now]);
  
  const canCheckOut = isCheckedIn;
  
  const widgetState: 'preCheckIn' | 'onClock' | 'overtime' | 'checkedOut' = useMemo(() => {
    if (checkOutDateTime) return 'checkedOut';
    if (isCheckedIn) {
      return nowRef.current.getTime() >= shiftEnd.getTime() ? 'overtime' : 'onClock';
    }
    return 'preCheckIn';
  }, [checkOutDateTime, isCheckedIn, shiftEnd, now]);

  const handleCheckIn = async () => {
    if (isLoading || checkInDateTime) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkIn();
      
      if (result.error) {
        alert(result.error);
        setIsLoading(false);
      return;
    }

      // Redirect to success page with check-in data
      if (result.data?.check_in_time) {
        const checkInTime = new Date(result.data.check_in_time);
        const checkInStatus = result.data.check_in_status || 'ontime';
        
        console.log('✅ Check-in successful, preparing redirect...', {
          checkInTime: checkInTime.toISOString(),
          status: checkInStatus
        });
        
        // Calculate time difference from shift start
        const shiftStart = setToHour(checkInTime, SHIFT_START_HOUR);
        const timeDiffMs = checkInTime.getTime() - shiftStart.getTime();
        const timeDiffMinutes = Math.floor(timeDiffMs / 60000);
        
        // Build URL params for success page
        const params = new URLSearchParams({
          time: checkInTime.toISOString(),
          status: checkInStatus,
          minutesDiff: timeDiffMinutes.toString(),
        });
        
        const successUrl = `/check-in-success?${params.toString()}`;
        console.log('🔀 Redirecting to:', successUrl);
        
        // Reset loading state before redirect
        setIsLoading(false);
        
        // Use window.location.href for a hard redirect to ensure it completes
        // This is more reliable than router.replace() for post-action redirects
        // According to Context7: For critical redirects after server actions, 
        // hard redirects ensure the navigation completes even if there are state updates
        window.location.href = successUrl;
        
        // Return early - the hard redirect will navigate away
        // No need for finally block cleanup since we're navigating away
        return;
      } else {
        // No check-in data returned - unexpected error
        console.error('Check-in succeeded but no data returned');
        alert('Check-in completed but failed to retrieve data. Please refresh the page.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Failed to check in. Please try again.');
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
        
        // Show success toast notification
        showToast(
          'success',
          'Checked out',
          "You've successfully checked out. Have a great day!"
        );
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

  const handleOpenLeaveDetails = async () => {
    if (!activeLeaveInfo?.id) return;
    
    const result = await getLeaveRequest(activeLeaveInfo.id);
    
    if (result.data) {
      setLeaveDetailsData({
        startDate: result.data.startDate,
        endDate: result.data.endDate,
        status: result.data.status,
        requestedOn: result.data.requestedOn,
        requestedAt: result.data.requestedAt,
        approvedAt: result.data.approvedAt,
        rejectionReason: result.data.rejectionReason,
        leaveType: result.data.leaveType,
        reason: result.data.reason,
      });
      setShowLeaveDetails(true);
    } else if (result.error) {
      console.error('Error fetching leave request details:', result.error);
    }
  };

  const handleAnnouncementClick = () => {
    setShowAnnouncementBottomSheet(true);
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

  // Check-out card data - memoized expensive calculations
  const remainingToShiftEndMs = useMemo(() => {
    return Math.max(0, shiftEnd.getTime() - nowRef.current.getTime());
  }, [shiftEnd, now]);
  
  const overtimeMs = useMemo(() => {
    return isCheckedIn ? Math.max(0, nowRef.current.getTime() - shiftEnd.getTime()) : 0;
  }, [isCheckedIn, shiftEnd, now]);
  
  const checkoutOvertimeMs = useMemo(() => {
    return checkOutDateTime ? Math.max(0, checkOutDateTime.getTime() - shiftEnd.getTime()) : 0;
  }, [checkOutDateTime, shiftEnd]);

  const checkoutCardTime = checkOutDateTime ? formatClockTime(checkOutDateTime) : '--:--';
  
  // Use same logic as backend: 1 minute tolerance (check-out at 19:00:00 to 19:00:59 is ontime)
  const shiftEndWithTolerance = useMemo(() => {
    return new Date(shiftEnd.getTime() + 60000); // Add 1 minute tolerance
  }, [shiftEnd]);
  
  const checkoutStatus = useMemo(() => {
    if (checkOutDateTime) {
      return checkOutDateTime.getTime() > shiftEndWithTolerance.getTime() 
        ? 'overtime' 
        : checkOutDateTime.getTime() < shiftEnd.getTime() 
          ? 'leftearly' 
          : 'ontime';
    }
    if (isCheckedIn && nowRef.current.getTime() >= shiftEnd.getTime()) {
      return 'overtime';
    }
    if (isCheckedIn) {
      return 'remaining';
    }
    return undefined;
  }, [checkOutDateTime, shiftEndWithTolerance, shiftEnd, isCheckedIn, now]);

  const checkoutLeftEarlyMs = useMemo(() => {
    return checkOutDateTime && checkOutDateTime.getTime() < shiftEnd.getTime()
    ? shiftEnd.getTime() - checkOutDateTime.getTime()
    : 0;
  }, [checkOutDateTime, shiftEnd]);

  const checkoutDuration = useMemo(() => {
    if (checkOutDateTime) {
      if (checkOutDateTime.getTime() > shiftEnd.getTime()) {
        return formatDurationFromMs(checkoutOvertimeMs);
      }
      if (checkOutDateTime.getTime() < shiftEnd.getTime()) {
        return formatDurationFromMs(checkoutLeftEarlyMs);
      }
      return undefined;
    }
    if (isCheckedIn && nowRef.current.getTime() >= shiftEnd.getTime()) {
      return formatDurationFromMs(overtimeMs);
    }
    if (isCheckedIn) {
      return formatDurationFromMs(remainingToShiftEndMs);
    }
    return undefined;
  }, [checkOutDateTime, shiftEnd, isCheckedIn, checkoutOvertimeMs, checkoutLeftEarlyMs, overtimeMs, remainingToShiftEndMs, now]);


  return (
    <div className="relative min-h-screen w-full bg-neutral-50">
      {/* Main Content Container - Mobile First (375px base) */}
      <div className="mx-auto w-full max-w-[402px] pb-20">
        {/* Content */}
        <div className="flex flex-col items-center gap-3 px-6 pt-6">
          {/* Header Section */}
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col">
              <p className="text-xl font-semibold text-neutral-800 tracking-tight leading-[30px]">
                {authLoading && !profile ? (
                  <span className="inline-block h-[30px] w-32 animate-pulse bg-neutral-200 rounded" aria-label="Loading user name"></span>
                ) : (
                  `Welcome, ${profile?.full_name?.split(' ')[0] || profile?.username || 'User'}`
                )}
              </p>
              <p className="text-sm text-neutral-500 tracking-tight leading-5">
                {formattedDate}
              </p>
            </div>
            <NotificationButton
              hasNotification={true}
              onClick={() => router.push('/notifications')}
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
              currentTime={nowRef.current}
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
              onOpenLeaveDetails={handleOpenLeaveDetails}
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
                
                // Set a safety timeout to redirect even if signOut hangs (8 seconds)
                const redirectTimeout = setTimeout(() => {
                  console.log('🔴 Safety timeout triggered, forcing redirect...');
                  window.location.replace('/login');
                }, 8000);
                
                try {
                  console.log('🔴 Calling signOut...');
                  await signOut();
                  console.log('🔴 SignOut completed successfully');
                  clearTimeout(redirectTimeout);
                  
                  // Delay to ensure server-side cookies are fully cleared before redirect
                  // This prevents middleware from seeing the user as still authenticated
                  await new Promise(resolve => setTimeout(resolve, 300));
                  
                  console.log('🔴 Redirecting to login...');
                  window.location.replace('/login');
                } catch (error) {
                  console.error('🔴 Error during logout:', error);
                  clearTimeout(redirectTimeout);
                  // Delay even on error to ensure cookies are cleared
                  await new Promise(resolve => setTimeout(resolve, 300));
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
        title="Check-out early?"
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

      {/* Leave Request Details Modal */}
      {leaveDetailsData && (
        <LeaveRequestDetailsModal
          isOpen={showLeaveDetails}
          onClose={() => setShowLeaveDetails(false)}
          startDate={leaveDetailsData.startDate}
          endDate={leaveDetailsData.endDate}
          status={leaveDetailsData.status}
          requestedOn={leaveDetailsData.requestedOn}
          requestedAt={leaveDetailsData.requestedAt}
          approvedAt={leaveDetailsData.approvedAt}
          rejectionReason={leaveDetailsData.rejectionReason}
          leaveType={leaveDetailsData.leaveType}
          reason={leaveDetailsData.reason}
        />
      )}

      {/* Announcement Bottom Sheet */}
      {currentAnnouncement && (
        <AnnouncementBottomSheet
          isOpen={showAnnouncementBottomSheet}
          onClose={() => setShowAnnouncementBottomSheet(false)}
          announcement={currentAnnouncement}
        />
      )}
    </div>
  );
}

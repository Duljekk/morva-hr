---
name: Fetch Employee Activities for Last 3 Days
overview: Create server action to fetch employee activities (attendance records and leave requests) for the last 3 days (today, yesterday, day before) and integrate with the EmployeeDetailsRightSection component to display real data instead of mock data.
todos:
  - id: "1"
    content: Create getEmployeeActivities server action in lib/actions/hr/employeeDetails.ts
    status: pending
  - id: "2"
    content: Add helper functions for date formatting and data transformation (formatTime, formatDateLabel, mapAttendanceStatus, transformAttendanceToGroups, transformLeaveRequestsToGroups)
    status: pending
    dependencies:
      - "1"
  - id: "3"
    content: Verify/implement date utility functions (getNowPartsInGMT7, getTodayDateString, formatDateISO) in lib/utils/date.ts
    status: pending
  - id: "4"
    content: Update EmployeeDetailsRightSection component to fetch and display real activities data
    status: pending
    dependencies:
      - "1"
      - "2"
  - id: "5"
    content: Add loading and error states to EmployeeDetailsRightSection component
    status: pending
    dependencies:
      - "4"
  - id: "6"
    content: Test the implementation with real data (attendance records and leave requests)
    status: pending
    dependencies:
      - "1"
      - "2"
      - "4"
---

# Fetch Employee Activities for Last 3 Days

## Overview

Create a server action to fetch employee activities (attendance check-in/check-out records and leave requests) for a specific employee, filtered to show only the last 3 days (today, yesterday, and the day before). Transform the data to match the `ActivityGroupData` interface used by `EmployeeActivitiesPanel` component.

## Data Sources

1. **Attendance Records** (`attendance_records` table):

            - `check_in_time` → Check-in activity
            - `check_out_time` → Check-out activity
            - `check_in_status` → Status (onTime, late)
            - `check_out_status` → Status (onTime, overtime, leftearly)
            - `date` → Date filter (last 3 days)

2. **Leave Requests** (`leave_requests` table):

            - `created_at` → When leave was requested
            - `start_date`, `end_date` → Leave period
            - `status` → pending, approved, rejected
            - `leave_type_id` → annual, sick, unpaid
            - Filter by `created_at` within last 3 days OR `start_date`/`end_date` overlaps with last 3 days

## Server Action Implementation

### 1.1 Create getEmployeeActivities Server Action

**File**: `lib/actions/hr/employeeDetails.ts`

Add a new server action function:

```typescript
import type { ActivityGroupData } from '@/components/hr/employee/EmployeeActivitiesPanel';

export interface EmployeeActivitiesResult {
  attendanceGroups: ActivityGroupData[];
  leaveRequestGroups: ActivityGroupData[];
  leaveRequestCount: number; // Count of pending leave requests
}

/**
 * GET EMPLOYEE ACTIVITIES FOR LAST 3 DAYS
 * 
 * Fetches attendance records and leave requests for a specific employee
 * for the last 3 days (today, yesterday, day before).
 * 
 * @param employeeId - The employee's user ID
 * @returns Promise with activity groups or error
 */
export async function getEmployeeActivities(
  employeeId: string
): Promise<{ data?: EmployeeActivitiesResult; error?: string }> {
  try {
    const { supabase } = await requireHRAdmin();
    
    // Calculate date range (today, yesterday, day before) in GMT+7
    const nowParts = getNowPartsInGMT7();
    const today = getTodayDateString();
    const yesterday = formatDateISO(new Date(nowParts.year, nowParts.month - 1, nowParts.day - 1));
    const dayBefore = formatDateISO(new Date(nowParts.year, nowParts.month - 1, nowParts.day - 2));
    
    const dateRange = [today, yesterday, dayBefore];
    
    // Fetch attendance records and leave requests in parallel
    const [attendanceResult, leaveRequestsResult] = await Promise.all([
      // 1. Fetch attendance records for last 3 days
      supabase
        .from('attendance_records')
        .select('date, check_in_time, check_out_time, check_in_status, check_out_status')
        .eq('user_id', employeeId)
        .in('date', dateRange)
        .order('date', { ascending: false })
        .order('check_in_time', { ascending: true }),
      
      // 2. Fetch leave requests created in last 3 days OR overlapping with last 3 days
      supabase
        .from('leave_requests')
        .select('id, created_at, start_date, end_date, status, leave_type_id')
        .eq('user_id', employeeId)
        .neq('status', 'cancelled')
        .or(`created_at.gte.${dayBefore}T00:00:00,start_date.lte.${today},end_date.gte.${dayBefore}`)
        .order('created_at', { ascending: false }),
    ]);
    
    if (attendanceResult.error) {
      console.error('[getEmployeeActivities] Attendance error:', attendanceResult.error);
      return { error: 'Failed to fetch attendance records' };
    }
    
    if (leaveRequestsResult.error) {
      console.error('[getEmployeeActivities] Leave requests error:', leaveRequestsResult.error);
      return { error: 'Failed to fetch leave requests' };
    }
    
    // Transform attendance records to ActivityGroupData
    const attendanceGroups = transformAttendanceToGroups(
      attendanceResult.data || [],
      today,
      yesterday,
      dayBefore
    );
    
    // Transform leave requests to ActivityGroupData
    const leaveRequestGroups = transformLeaveRequestsToGroups(
      leaveRequestsResult.data || [],
      today,
      yesterday,
      dayBefore
    );
    
    // Count pending leave requests
    const leaveRequestCount = (leaveRequestsResult.data || []).filter(
      lr => lr.status === 'pending'
    ).length;
    
    return {
      data: {
        attendanceGroups,
        leaveRequestGroups,
        leaveRequestCount,
      },
    };
  } catch (error) {
    console.error('[getEmployeeActivities] Unexpected error:', error);
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return { error: error.message };
    }
    
    return { error: 'An unexpected error occurred while fetching activities' };
  }
}
```

### 1.2 Add Helper Functions

**File**: `lib/actions/hr/employeeDetails.ts`

Add helper functions for date formatting and data transformation:

```typescript
import { getNowPartsInGMT7, getTodayDateString, formatDateISO } from '@/lib/utils/date';

/**
 * Format time from timestamp to HH:MM format
 */
function formatTime(timestamp: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta', // GMT+7
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp));
}

/**
 * Format date label (Today, Yesterday, or formatted date)
 */
function formatDateLabel(date: string, today: string, yesterday: string): string {
  if (date === today) return 'Today';
  if (date === yesterday) return 'Yesterday';
  
  // Format as "Month Day" (e.g., "December 6")
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

/**
 * Map check_in_status/check_out_status to ActivityStatus
 */
function mapAttendanceStatus(status: string | null): 'onTime' | 'late' | 'overtime' {
  switch (status) {
    case 'late':
      return 'late';
    case 'overtime':
      return 'overtime';
    case 'leftearly':
      return 'overtime'; // Map leftearly to overtime for UI
    default:
      return 'onTime';
  }
}

/**
 * Transform attendance records to ActivityGroupData format
 */
function transformAttendanceToGroups(
  records: any[],
  today: string,
  yesterday: string,
  dayBefore: string
): ActivityGroupData[] {
  const groupsMap = new Map<string, ActivityEntry[]>();
  
  records.forEach(record => {
    const date = record.date;
    if (!groupsMap.has(date)) {
      groupsMap.set(date, []);
    }
    
    const activities = groupsMap.get(date)!;
    
    // Add check-in activity
    if (record.check_in_time) {
      activities.push({
        id: `${record.date}-checkin`,
        type: 'checkIn',
        time: formatTime(record.check_in_time),
        status: mapAttendanceStatus(record.check_in_status),
      });
    }
    
    // Add check-out activity
    if (record.check_out_time) {
      activities.push({
        id: `${record.date}-checkout`,
        type: 'checkOut',
        time: formatTime(record.check_out_time),
        status: mapAttendanceStatus(record.check_out_status),
      });
    }
  });
  
  // Convert to ActivityGroupData array, sorted by date (newest first)
  const dateOrder = [today, yesterday, dayBefore];
  const groups: ActivityGroupData[] = [];
  
  dateOrder.forEach((date, index) => {
    const activities = groupsMap.get(date) || [];
    if (activities.length > 0) {
      // Sort activities: check-in before check-out, then by time
      activities.sort((a, b) => {
        if (a.type === 'checkIn' && b.type === 'checkOut') return -1;
        if (a.type === 'checkOut' && b.type === 'checkIn') return 1;
        return a.time.localeCompare(b.time);
      });
      
      groups.push({
        id: date,
        label: formatDateLabel(date, today, yesterday),
        activities,
        isLast: index === dateOrder.length - 1,
      });
    }
  });
  
  return groups;
}

/**
 * Transform leave requests to ActivityGroupData format
 * Note: Leave requests are shown in the "Leave Request" tab but use checkIn type for display
 */
function transformLeaveRequestsToGroups(
  leaveRequests: any[],
  today: string,
  yesterday: string,
  dayBefore: string
): ActivityGroupData[] {
  const groupsMap = new Map<string, ActivityEntry[]>();
  
  leaveRequests.forEach(leave => {
    // Determine which date to group by (use created_at date)
    const createdDate = formatDateISO(new Date(leave.created_at));
    const date = [today, yesterday, dayBefore].includes(createdDate) 
      ? createdDate 
      : null; // Only include if created in last 3 days
    
    if (!date) return;
    
    if (!groupsMap.has(date)) {
      groupsMap.set(date, []);
    }
    
    const activities = groupsMap.get(date)!;
    
    // Format date range
    const startDate = new Date(leave.start_date + 'T00:00:00');
    const endDate = new Date(leave.end_date + 'T00:00:00');
    const dateRange = startDate.getTime() === endDate.getTime()
      ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    
    activities.push({
      id: leave.id,
      type: 'checkIn', // Leave requests use checkIn type in UI
      time: formatTime(leave.created_at),
      status: mapLeaveStatus(leave.status),
    });
  });
  
  // Convert to ActivityGroupData array
  const dateOrder = [today, yesterday, dayBefore];
  const groups: ActivityGroupData[] = [];
  
  dateOrder.forEach((date, index) => {
    const activities = groupsMap.get(date) || [];
    if (activities.length > 0) {
      // Sort by time (newest first)
      activities.sort((a, b) => b.time.localeCompare(a.time));
      
      groups.push({
        id: `leave-${date}`,
        label: formatDateLabel(date, today, yesterday),
        activities,
        isLast: index === dateOrder.length - 1,
      });
    }
  });
  
  return groups;
}

/**
 * Map leave request status to ActivityStatus
 * Note: Leave requests may need different status handling
 */
function mapLeaveStatus(status: string): 'onTime' | 'late' | 'overtime' {
  // For leave requests, we might want to show different statuses
  // For now, map to onTime as default
  return 'onTime';
}
```

### 1.3 Update EmployeeDetailsResult Interface

**File**: `lib/actions/hr/employeeDetails.ts`

Update the interface to include activities:

```typescript
export interface EmployeeDetailsResult {
  leftSection: EmployeeLeftSectionData;
  activities?: EmployeeActivitiesResult; // Add activities
}
```

### 1.4 Update getEmployeeDetailsById (Optional)

**File**: `lib/actions/hr/employeeDetails.ts`

Optionally update `getEmployeeDetailsById` to also fetch activities, or keep them separate (recommended: keep separate for better performance).

## Component Integration

### 2.1 Update EmployeeDetailsRightSection Component

**File**: `components/hr/employee/EmployeeDetailsRightSection.tsx`

Replace mock data with server action call:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getEmployeeActivities } from '@/lib/actions/hr/employeeDetails';
import type { EmployeeActivitiesResult } from '@/lib/actions/hr/employeeDetails';

export default function EmployeeDetailsRightSection({
  employeeId,
  className = '',
}: EmployeeDetailsRightSectionProps) {
  const [activities, setActivities] = useState<EmployeeActivitiesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }
    
    async function fetchActivities() {
      try {
        setLoading(true);
        const result = await getEmployeeActivities(employeeId);
        
        if (result.error) {
          setError(result.error);
          return;
        }
        
        if (result.data) {
          setActivities(result.data);
        }
      } catch (err) {
        console.error('[EmployeeDetailsRightSection] Error:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    }
    
    fetchActivities();
  }, [employeeId]);
  
  // Mock statistics (to be implemented separately)
  const avgCheckInTime = '11:05';
  const avgCheckInTrend = '1 minute';
  const totalHoursWorked = '168';
  const totalHoursTrend = '8 hours';
  
  return (
    <div className={`flex flex-col gap-[24px] w-full ${className}`.trim()}>
      {/* Statistics Section */}
      {/* ... existing statistics code ... */}
      
      {/* Activities Section */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C5DD3]"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : (
        <EmployeeActivitiesPanel
          attendanceGroups={activities?.attendanceGroups || []}
          leaveRequestGroups={activities?.leaveRequestGroups || []}
          leaveRequestCount={activities?.leaveRequestCount || 0}
        />
      )}
    </div>
  );
}
```

## Date Utility Functions

### 3.1 Check Date Utility Functions

**File**: `lib/utils/date.ts` (verify these exist or create)

Ensure these utility functions exist:

- `getNowPartsInGMT7()` - Returns { year, month, day } in GMT+7
- `getTodayDateString()` - Returns today's date as YYYY-MM-DD in GMT+7
- `formatDateISO(date: Date)` - Formats date as YYYY-MM-DD

If they don't exist, create them based on the pattern used in `lib/actions/hr/dashboard.ts`.

## Testing Checklist

- [ ] Server action fetches attendance records for last 3 days correctly
- [ ] Server action fetches leave requests created in last 3 days
- [ ] Server action fetches leave requests overlapping with last 3 days
- [ ] Date labels show "Today", "Yesterday", or formatted date correctly
- [ ] Activities are grouped by date correctly
- [ ] Check-in activities appear before check-out activities
- [ ] Activities are sorted by time within each date group
- [ ] Empty states display when no activities exist
- [ ] Loading states display while fetching
- [ ] Error states display on failure
- [ ] Leave request count is calculated correctly
- [ ] Component updates when employeeId changes

## Implementation Notes

1. **Date Handling**: All dates should be handled in GMT+7 (Asia/Jakarta) timezone to match the application's timezone.

2. **Leave Request Filtering**: Leave requests are included if:

            - Created in the last 3 days (based on `created_at`), OR
            - Leave period overlaps with the last 3 days (start_date <= today AND end_date >= dayBefore)

3. **Activity Ordering**: 

            - Attendance: Check-in before check-out, then by time
            - Leave requests: By creation time (newest first)

4. **Performance**: Use parallel queries (`Promise.all`) to fetch attendance and leave requests simultaneously.

5. **Empty States**: The `EmployeeActivitiesPanel` component already handles empty states, so no additional empty state logic is needed in the server action.
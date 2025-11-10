# Check-In/Check-Out System Guide

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER OPENS DASHBOARD                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  1. Page Load (useEffect)                                    │
│     - Calls getTodaysAttendance()                            │
│     - Queries: SELECT * FROM attendance_records              │
│       WHERE user_id = current_user AND date = today         │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
              Record Found         No Record Found
                    │                   │
                    ↓                   ↓
      ┌──────────────────────┐   ┌──────────────────┐
      │ Load existing times  │   │ Show empty state │
      │ - check_in_time      │   │ - Ready to       │
      │ - check_out_time     │   │   Check In       │
      └──────────────────────┘   └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    UI DISPLAYS CURRENT STATE                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📥 Check-In Process

### Frontend (User clicks "Check-In")
```typescript
handleCheckIn() {
  1. Validate: Not already checked in
  2. Set isLoading = true (disables button)
  3. Call checkIn() server action
  4. Receive response
  5. Update UI state with check_in_time
  6. Set isLoading = false
}
```

### Backend (Server Action)
```typescript
checkIn() {
  1. Authenticate user
  2. Get user's shift schedule from users table
  3. Record current timestamp
  4. Calculate check_in_status:
     - if now > shift_start → 'late'
     - else → 'ontime'
  5. INSERT into attendance_records:
     {
       user_id,
       date: today,
       check_in_time: now,
       check_in_status: 'late' | 'ontime',
       shift_start_hour,
       shift_end_hour
     }
  6. Return the created record
}
```

### Database Impact
```sql
INSERT INTO attendance_records (
  id,                    -- Auto-generated UUID
  user_id,              -- From auth session
  date,                 -- YYYY-MM-DD (today)
  check_in_time,        -- ISO timestamp
  check_in_status,      -- 'late' or 'ontime'
  created_at,           -- Auto timestamp
  updated_at            -- Auto timestamp
) VALUES (...);

-- Note: shift_start_hour and shift_end_hour are stored in the users table,
-- not in attendance_records. They are read when calculating status.
```

---

## 📤 Check-Out Process

### Frontend (User clicks "Check-Out")
```typescript
handleCheckOutRequest() {
  1. Show confirmation modal
}

handleCheckOut() {
  1. Validate: Already checked in, not checked out
  2. Set isLoading = true
  3. Call checkOut() server action
  4. Receive response
  5. Update UI state with check_out_time
  6. Close modal
  7. Set isLoading = false
}
```

### Backend (Server Action)
```typescript
checkOut() {
  1. Authenticate user
  2. Get today's attendance record (must exist)
  3. Validate: check_out_time is NULL
  4. Record current timestamp
  5. Calculate check_out_status:
     - if now < shift_end → 'leftearly'
     - if now == shift_end → 'ontime'
     - if now > shift_end → 'overtime'
  6. Calculate total_hours:
     - (check_out_time - check_in_time) in hours
  7. Calculate overtime_hours:
     - max(0, total_hours - expected_shift_hours)
  8. UPDATE attendance_records SET:
     {
       check_out_time: now,
       check_out_status: 'leftearly' | 'ontime' | 'overtime',
       total_hours: calculated,
       overtime_hours: calculated
     }
  9. Return the updated record
}
```

### Database Impact
```sql
UPDATE attendance_records
SET
  check_out_time = '2025-01-07T18:45:00.000Z',
  check_out_status = 'leftearly',  -- or 'ontime' or 'overtime'
  total_hours = 7.75,               -- Actual hours worked
  overtime_hours = 0.0,             -- Hours beyond shift
  updated_at = now()
WHERE
  id = <record_id>
  AND user_id = <current_user>
  AND date = today;
```

---

## 🧮 Status Calculation Logic

### Check-In Status
```typescript
const shiftStart = new Date();
shiftStart.setHours(shift_start_hour, 0, 0, 0);

if (checkInTime > shiftStart) {
  status = 'late';
} else {
  status = 'ontime';
}
```

**Example:**
- Shift starts: 11:00 AM
- User checks in at 11:15 AM → **Late** (15 minutes)
- User checks in at 10:58 AM → **On Time**

### Check-Out Status
```typescript
const shiftEnd = new Date();
shiftEnd.setHours(shift_end_hour, 0, 0, 0);

if (checkOutTime < shiftEnd) {
  status = 'leftearly';
} else if (checkOutTime === shiftEnd) {
  status = 'ontime';
} else {
  status = 'overtime';
}
```

**Example:**
- Shift ends: 7:00 PM (19:00)
- User checks out at 6:30 PM → **Left Early** (30 min remaining)
- User checks out at 7:00 PM → **On Time**
- User checks out at 8:15 PM → **Overtime** (1h 15m)

### Total Hours Calculation
```typescript
const totalMs = checkOutTime - checkInTime;
const totalHours = totalMs / (1000 * 60 * 60);
```

**Example:**
- Check in: 11:00 AM
- Check out: 7:30 PM
- Total hours: **8.5 hours**

### Overtime Hours Calculation
```typescript
const expectedShiftMs = (shift_end_hour - shift_start_hour) * 60 * 60 * 1000;
const overtimeMs = max(0, totalMs - expectedShiftMs);
const overtimeHours = overtimeMs / (1000 * 60 * 60);
```

**Example:**
- Expected shift: 8 hours (11:00 AM - 7:00 PM)
- Worked: 8.5 hours (11:00 AM - 7:30 PM)
- Overtime: **0.5 hours** (30 minutes)

---

## 🎨 UI States

### State 1: Not Checked In (preCheckIn)
```
Widget: "Ready To Start Your Day?"
Button: "Check-In" (enabled if shift started)
Check-In Card: --:--
Check-Out Card: --:--
```

### State 2: Checked In, On The Clock (onClock)
```
Widget: "You're On The Clock"
Display: Elapsed time since check-in
Button: "Check-Out" (always enabled)
Check-In Card: 11:00, "On Time"
Check-Out Card: --:--, "Remaining: 3h 15m"
```

### State 3: Checked In, Overtime (overtime)
```
Widget: "You're On The Clock" (green text)
Display: Elapsed time in overtime
Button: "Check-Out" (always enabled)
Check-In Card: 11:00, "On Time"
Check-Out Card: --:--, "Overtime: 1h 30m"
```

### State 4: Checked Out (checkedOut)
```
Widget: "You've Checked Out"
Display: Total hours worked
Button: "Check-In" (disabled)
Check-In Card: 11:00, "On Time"
Check-Out Card: 19:30, "Overtime: 30m"
```

---

## 🔒 Security Considerations

### Server-Side Validation
- **All calculations happen server-side** to prevent manipulation
- User cannot fake timestamps or status
- Authentication required for all operations

### Database Constraints
- `date` + `user_id` = UNIQUE (one record per day per user)
- `check_in_time` required, `check_out_time` optional
- RLS policies enforce: users can only access their own records

### Error Handling
```typescript
// Cannot check in twice
if (existingRecord) {
  return { error: 'Already checked in today' };
}

// Cannot check out without check-in
if (!attendance) {
  return { error: 'No check-in record found for today' };
}

// Cannot check out twice
if (attendance.check_out_time) {
  return { error: 'Already checked out today' };
}
```

---

## 🗂️ Database Schema Reference

```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  check_in_status check_in_status NOT NULL,    -- 'ontime' | 'late'
  check_out_status check_out_status,           -- 'ontime' | 'overtime' | 'leftearly'
  shift_start_hour INTEGER NOT NULL,
  shift_end_hour INTEGER NOT NULL,
  total_hours NUMERIC(5,2),
  overtime_hours NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT unique_user_date UNIQUE(user_id, date)
);
```

---

## 🧪 Testing Scenarios

### Scenario 1: Normal Day
1. User checks in at 11:00 AM → Status: "On Time"
2. User checks out at 7:00 PM → Status: "On Time", Total: 8h

### Scenario 2: Late Arrival
1. User checks in at 11:30 AM → Status: "Late" (30m)
2. User checks out at 7:30 PM → Status: "Overtime", Total: 8h, OT: 0.5h

### Scenario 3: Left Early
1. User checks in at 11:00 AM → Status: "On Time"
2. User checks out at 6:00 PM → Status: "Left Early", Remaining: 1h

### Scenario 4: Page Refresh
1. User checks in at 11:00 AM
2. Refreshes page → Data persists, shows checked-in state
3. User checks out at 7:00 PM
4. Refreshes page → Data persists, shows checked-out state

### Scenario 5: Session Logout
1. User checks in at 11:00 AM
2. Logs out
3. Logs back in → Previous check-in still recorded

---

## 📁 File Structure

```
lib/
  actions/
    attendance.ts          # Server actions (checkIn, checkOut, getTodaysAttendance)
  supabase/
    server.ts             # Server-side Supabase client
    client.ts             # Client-side Supabase client
    types.ts              # TypeScript types from schema

app/
  page.tsx                # Main dashboard with check-in/out UI
  components/
    CheckInOutWidget.tsx  # Main widget component
    AttendanceCard.tsx    # Individual card for check-in/out times
    ConfirmationModal.tsx # Checkout confirmation dialog

database/
  schema.sql              # Complete database schema
  migrations/             # Migration files
```

---

## 🚀 Deployment Checklist

- [x] Database schema deployed to Supabase
- [x] RLS policies configured
- [x] Server actions created
- [x] Frontend integrated with server actions
- [x] Loading states implemented
- [x] Error handling added
- [x] Confirmation modal for checkout
- [x] Status calculations server-side
- [x] Type safety with TypeScript
- [x] Documentation complete

---

## 🔮 Future Enhancements

1. **Break Time Tracking**: Allow users to pause/resume during shift
2. **Late/Early Reason**: Capture reason for late arrival or early departure
3. **Geofencing**: Require check-in/out from office location
4. **Push Notifications**: Remind users to check in/out
5. **Manager Approval**: Require approval for early checkout
6. **Attendance Reports**: Monthly/weekly summaries
7. **Integration**: Sync with payroll systems


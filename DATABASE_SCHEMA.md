# MorvaHR Database Schema Documentation

## Overview

This document describes the complete database schema for the MorvaHR internal HR application. The schema is designed for PostgreSQL on Supabase and includes comprehensive Row Level Security (RLS) policies for data protection.

## Table of Contents

- [Database Architecture](#database-architecture)
- [Tables](#tables)
- [Relationships](#relationships)
- [Row Level Security](#row-level-security)
- [Indexes](#indexes)
- [Usage Examples](#usage-examples)
- [Setup Instructions](#setup-instructions)

## Database Architecture

### Technology Stack
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for files and PDFs)
- **Security**: Row Level Security (RLS) policies

### User Roles
- **Employee**: Regular users who can manage their own attendance, leave requests, and view their payslips
- **HR Admin**: Administrative users who can manage all data and approve/reject leave requests

## Tables

### 1. users

Extends Supabase's built-in `auth.users` table with application-specific user data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | User identifier |
| email | TEXT | UNIQUE, NOT NULL | User email address |
| username | TEXT | UNIQUE, NOT NULL | Unique username |
| full_name | TEXT | NOT NULL | User's full name |
| role | user_role | NOT NULL, DEFAULT 'employee' | User role (employee/hr_admin) |
| employee_id | TEXT | UNIQUE | Optional employee ID |
| shift_start_hour | INTEGER | DEFAULT 11 | Work shift start hour (0-23) |
| shift_end_hour | INTEGER | DEFAULT 19 | Work shift end hour (0-23) |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| is_active | BOOLEAN | DEFAULT true | Whether user is active |

**Constraints:**
- `shift_end_hour` must be greater than `shift_start_hour`
- Both shift hours must be between 0 and 23

### 2. attendance_records

Tracks daily check-in and check-out times for employees.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Record identifier |
| user_id | UUID | FK → users.id, NOT NULL | Employee reference |
| date | DATE | NOT NULL | Attendance date |
| check_in_time | TIMESTAMP | | Actual check-in time |
| check_out_time | TIMESTAMP | | Actual check-out time |
| check_in_status | check_in_status | | Status: 'ontime' or 'late' |
| check_out_status | check_out_status | | Status: 'ontime' or 'overtime' |
| total_hours | DECIMAL(5,2) | | Total work hours |
| overtime_hours | DECIMAL(5,2) | DEFAULT 0 | Overtime hours worked |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, date) - One record per user per day
- `check_out_time` must be after `check_in_time`
- `total_hours` and `overtime_hours` must be >= 0

### 3. leave_types

Predefined types of leave that can be requested.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PK | Leave type identifier ('sick', 'annual', 'unpaid') |
| name | TEXT | NOT NULL | Display name |
| requires_approval | BOOLEAN | DEFAULT true | Whether approval is needed |
| requires_attachment | BOOLEAN | DEFAULT false | Whether documents are required |
| max_days_per_year | INTEGER | | Annual limit (if applicable) |
| is_active | BOOLEAN | DEFAULT true | Whether leave type is active |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Default Leave Types:**
- **sick**: Sick Leave (requires medical documentation)
- **annual**: Annual Leave (20 days per year limit)
- **unpaid**: Unpaid Leave (no limit)

### 4. leave_requests

Employee leave requests with approval workflow.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Request identifier |
| user_id | UUID | FK → users.id, NOT NULL | Employee reference |
| leave_type_id | TEXT | FK → leave_types.id, NOT NULL | Leave type reference |
| start_date | DATE | NOT NULL | Leave start date |
| end_date | DATE | NOT NULL | Leave end date |
| day_type | day_type | DEFAULT 'full' | 'full' or 'half' day |
| total_days | DECIMAL(4,2) | NOT NULL | Total days requested |
| reason | TEXT | NOT NULL | Reason for leave |
| status | leave_request_status | DEFAULT 'pending' | Request status |
| approved_by | UUID | FK → users.id | HR admin who approved/rejected |
| approved_at | TIMESTAMP | | Approval/rejection timestamp |
| rejection_reason | TEXT | | Reason for rejection |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Constraints:**
- `end_date` must be >= `start_date`
- `total_days` must be > 0
- Approved/rejected requests must have `approved_by`, `approved_at`, and (if rejected) `rejection_reason`

**Status Flow:**
```
pending → approved
        → rejected
        → cancelled
```

### 5. leave_balances

Tracks available leave balance per user per leave type per year.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Balance record identifier |
| user_id | UUID | FK → users.id, NOT NULL | Employee reference |
| leave_type_id | TEXT | FK → leave_types.id, NOT NULL | Leave type reference |
| balance | DECIMAL(6,2) | DEFAULT 0 | Remaining days |
| allocated | DECIMAL(6,2) | DEFAULT 0 | Total allocated days |
| used | DECIMAL(6,2) | DEFAULT 0 | Total used days |
| year | INTEGER | NOT NULL | Calendar year |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, leave_type_id, year)
- `balance = allocated - used`
- All amounts must be >= 0
- Year must be between 2000 and 2100

### 6. leave_request_attachments

File attachments for leave requests (e.g., medical certificates).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Attachment identifier |
| leave_request_id | UUID | FK → leave_requests.id, NOT NULL | Leave request reference |
| file_name | TEXT | NOT NULL | Original file name |
| file_size | BIGINT | NOT NULL | File size in bytes |
| file_url | TEXT | NOT NULL | Supabase Storage URL |
| file_type | TEXT | | MIME type |
| uploaded_by | UUID | FK → users.id, NOT NULL | User who uploaded |
| created_at | TIMESTAMP | DEFAULT NOW() | Upload timestamp |

**Constraints:**
- `file_size` must be > 0
- Cascade delete when leave request is deleted

### 7. announcements

Company-wide announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Announcement identifier |
| title | TEXT | NOT NULL | Announcement title |
| content | TEXT | | Full announcement content |
| scheduled_time | TIMESTAMP | | When to display (if scheduled) |
| is_active | BOOLEAN | DEFAULT true | Whether visible |
| created_by | UUID | FK → users.id, NOT NULL | HR admin who created |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 8. announcement_views

Tracks which users have viewed which announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | View record identifier |
| announcement_id | UUID | FK → announcements.id, NOT NULL | Announcement reference |
| user_id | UUID | FK → users.id, NOT NULL | User reference |
| viewed_at | TIMESTAMP | DEFAULT NOW() | View timestamp |

**Constraints:**
- UNIQUE(announcement_id, user_id) - One view record per user per announcement
- Cascade delete when announcement or user is deleted

### 9. payslips

Employee payslip records for download.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Payslip identifier |
| user_id | UUID | FK → users.id, NOT NULL | Employee reference |
| month | INTEGER | NOT NULL | Month (1-12) |
| year | INTEGER | NOT NULL | Year |
| gross_salary | DECIMAL(10,2) | NOT NULL | Gross salary amount |
| net_salary | DECIMAL(10,2) | NOT NULL | Net salary amount |
| deductions | JSONB | | Deduction details (flexible structure) |
| allowances | JSONB | | Allowance details (flexible structure) |
| pdf_url | TEXT | NOT NULL | Supabase Storage URL for PDF |
| file_name | TEXT | NOT NULL | PDF file name |
| file_size | BIGINT | | PDF file size in bytes |
| generated_at | TIMESTAMP | DEFAULT NOW() | Generation timestamp |
| generated_by | UUID | FK → users.id | HR admin who generated |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, month, year) - One payslip per user per month
- Month must be 1-12
- Year must be 2000-2100
- Salaries must be >= 0

**JSONB Structure Examples:**

```json
// deductions
{
  "tax": 500.00,
  "insurance": 200.00,
  "pension": 150.00
}

// allowances
{
  "housing": 300.00,
  "transport": 150.00,
  "meal": 100.00
}
```

## Relationships

```
users (1) ─────> (N) attendance_records
users (1) ─────> (N) leave_requests
users (1) ─────> (N) leave_balances
users (1) ─────> (N) announcements [created_by]
users (1) ─────> (N) announcement_views
users (1) ─────> (N) payslips
users (1) ─────> (N) leave_request_attachments [uploaded_by]

leave_types (1) ─────> (N) leave_requests
leave_types (1) ─────> (N) leave_balances

leave_requests (1) ─────> (N) leave_request_attachments

announcements (1) ─────> (N) announcement_views
```

## Row Level Security

All tables have RLS enabled with policies based on user roles:

### Employee Permissions
- **users**: Read own data, update own non-role data
- **attendance_records**: Read/write own records
- **leave_types**: Read active types
- **leave_requests**: Create/read/update/delete own pending requests
- **leave_balances**: Read own balances
- **leave_request_attachments**: Read/write attachments for own requests
- **announcements**: Read active announcements
- **announcement_views**: Create/read own views
- **payslips**: Read own payslips

### HR Admin Permissions
- Full read/write access to all tables
- Can approve/reject leave requests
- Can manage user accounts
- Can create announcements
- Can generate and upload payslips

### Helper Functions
- `is_hr_admin()`: Returns true if current user is an HR admin
- `get_user_role()`: Returns the role of the current user

## Indexes

Indexes are created for optimal query performance:

```sql
-- users
idx_users_email, idx_users_username, idx_users_role, idx_users_is_active

-- attendance_records
idx_attendance_user_id, idx_attendance_date, idx_attendance_user_date

-- leave_requests
idx_leave_requests_user_id, idx_leave_requests_status,
idx_leave_requests_start_date, idx_leave_requests_end_date,
idx_leave_requests_user_status

-- leave_balances
idx_leave_balances_user_id, idx_leave_balances_user_leave_year

-- announcements
idx_announcements_is_active, idx_announcements_scheduled_time

-- payslips
idx_payslips_user_id, idx_payslips_user_year_month, idx_payslips_year_month
```

## Usage Examples

### Creating a User

```sql
-- Create user via Supabase Auth first, then:
INSERT INTO users (id, email, username, full_name, role)
VALUES (
  auth.uid(),
  'john.doe@company.com',
  'jdoe',
  'John Doe',
  'employee'
);
```

### Recording Check-In

```sql
INSERT INTO attendance_records (user_id, date, check_in_time, check_in_status)
VALUES (
  auth.uid(),
  CURRENT_DATE,
  NOW(),
  CASE 
    WHEN EXTRACT(HOUR FROM NOW()) <= 11 THEN 'ontime'::check_in_status
    ELSE 'late'::check_in_status
  END
);
```

### Submitting Leave Request

```sql
INSERT INTO leave_requests (
  user_id, leave_type_id, start_date, end_date,
  day_type, total_days, reason
)
VALUES (
  auth.uid(),
  'sick',
  '2025-01-10',
  '2025-01-11',
  'full',
  2.0,
  'Medical appointment and recovery'
);
```

### Approving Leave Request (HR Admin)

```sql
UPDATE leave_requests
SET 
  status = 'approved',
  approved_by = auth.uid(),
  approved_at = NOW()
WHERE id = '...request-id...';

-- Also update leave balance
UPDATE leave_balances
SET 
  used = used + 2.0,
  balance = balance - 2.0
WHERE 
  user_id = '...employee-id...' AND
  leave_type_id = 'sick' AND
  year = 2025;
```

### Querying Attendance History

```sql
SELECT 
  date,
  check_in_time,
  check_out_time,
  check_in_status,
  check_out_status,
  total_hours
FROM attendance_records
WHERE 
  user_id = auth.uid() AND
  date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;
```

### Viewing Leave Balance

```sql
SELECT 
  lt.name as leave_type,
  lb.allocated,
  lb.used,
  lb.balance
FROM leave_balances lb
JOIN leave_types lt ON lt.id = lb.leave_type_id
WHERE 
  lb.user_id = auth.uid() AND
  lb.year = EXTRACT(YEAR FROM CURRENT_DATE);
```

## Setup Instructions

### 1. Initial Setup

```bash
# Navigate to your project
cd morvahr

# Apply schema
supabase db execute --file database/schema.sql

# Apply seed data
supabase db execute --file database/seed.sql

# Apply RLS policies
supabase db execute --file database/rls_policies.sql
```

### 2. Using Migrations

```bash
# Apply all migrations in order
supabase db push

# Or apply specific migration
supabase db execute --file database/migrations/20250107_120000_initial_schema.sql
```

### 3. Storage Buckets

Create the following storage buckets in Supabase dashboard:

- **leave-attachments**: For leave request attachments
- **payslips**: For employee payslip PDFs

Apply storage policies to restrict access appropriately.

### 4. Create First HR Admin

```sql
-- After creating user via Supabase Auth
UPDATE users
SET role = 'hr_admin'
WHERE email = 'admin@company.com';
```

## Best Practices

1. **Always use transactions** when updating related tables (e.g., leave balances)
2. **Validate data** on both client and server side
3. **Use indexes** for frequently queried columns
4. **Monitor RLS policies** to ensure proper data isolation
5. **Regular backups** before major changes
6. **Test migrations** on development environment first
7. **Document schema changes** in migration files

## Security Considerations

- All tables have RLS enabled
- Passwords are managed by Supabase Auth (never stored in app tables)
- File uploads are scoped to user folders in Storage
- Sensitive operations (approvals, payslip generation) require HR admin role
- All timestamps use UTC timezone
- JSONB fields allow flexible data but should be validated

## Future Enhancements

Potential schema improvements:

- Add audit trail tables for tracking all changes
- Add notification preferences table
- Add document templates for automated letter generation
- Add employee performance review tables
- Add shift scheduling tables for varied work schedules
- Add overtime request and approval workflow
- Add employee hierarchy/reporting structure

## Support

For questions about the database schema, contact the development team or refer to the inline SQL comments in the schema files.


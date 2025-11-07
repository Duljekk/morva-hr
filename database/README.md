# MorvaHR Database

This directory contains all database-related files for the MorvaHR application, including schema definitions, seed data, Row Level Security policies, and migrations.

## 📁 Directory Structure

```
database/
├── README.md                           # This file
├── schema.sql                          # Complete database schema
├── seed.sql                            # Initial seed data
├── rls_policies.sql                    # Row Level Security policies
└── migrations/                         # Version-controlled migrations
    ├── README.md                       # Migration guide
    ├── 20250107_120000_initial_schema.sql
    ├── 20250107_120100_seed_leave_types.sql
    └── 20250107_120200_rls_policies.sql
```

## 📚 Documentation

- **[DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md)** - Comprehensive schema documentation with usage examples
- **[DATABASE_ERD.md](../DATABASE_ERD.md)** - Entity Relationship Diagram and visual representations

## 🚀 Quick Start

### Prerequisites

- Supabase account and project
- Supabase CLI installed (`npm install -g supabase`)
- PostgreSQL client (optional, for local testing)

### Setup Steps

#### Option 1: Using Supabase CLI (Recommended)

```bash
# 1. Login to Supabase
supabase login

# 2. Link to your project
supabase link --project-ref your-project-ref

# 3. Apply all migrations
supabase db push

# Or apply files individually:
supabase db execute --file database/schema.sql
supabase db execute --file database/seed.sql
supabase db execute --file database/rls_policies.sql
```

#### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and execute files in order:
   - First: `schema.sql`
   - Second: `seed.sql`
   - Third: `rls_policies.sql`

#### Option 3: Using psql (for local development)

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[password]@[host]:5432/postgres"

# Execute files in order
\i database/schema.sql
\i database/seed.sql
\i database/rls_policies.sql
```

## 📊 Database Overview

### Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `users` | User profiles extending Supabase auth | Employee & HR admin data |
| `attendance_records` | Daily check-in/check-out tracking | Time tracking |
| `leave_types` | Predefined leave categories | 3 types (sick, annual, unpaid) |
| `leave_requests` | Leave applications with approval | Request management |
| `leave_balances` | Annual leave balance tracking | Balance per user per type per year |
| `leave_request_attachments` | Supporting documents | Medical certificates, etc. |
| `announcements` | Company-wide notifications | HR communications |
| `announcement_views` | Read receipts for announcements | View tracking |
| `payslips` | Monthly salary slips | Employee payroll documents |

### Key Features

✅ **Row Level Security (RLS)** - Data isolation based on user roles
✅ **Automatic Timestamps** - `created_at` and `updated_at` triggers
✅ **Referential Integrity** - Foreign key constraints with cascade rules
✅ **Optimized Indexes** - For common query patterns
✅ **JSONB Support** - Flexible payslip deductions/allowances
✅ **Enum Types** - Type-safe status values

## 🔐 Security

### Row Level Security Policies

All tables have RLS enabled with role-based policies:

- **Employees**: Can only access their own data
- **HR Admins**: Full access to all data

### Helper Functions

```sql
is_hr_admin()      -- Returns true if current user is HR admin
get_user_role()    -- Returns the role of current authenticated user
```

## 🗄️ Storage Buckets

Create these buckets in Supabase Storage:

### 1. `leave-attachments`
- **Purpose**: Store leave request attachments (medical certificates, etc.)
- **Access**: Employees can upload/view their own, HR admins can view all
- **Structure**: `/user_id/filename.pdf`

### 2. `payslips`
- **Purpose**: Store monthly payslip PDFs
- **Access**: HR admins can upload, employees can view their own
- **Structure**: `/user_id/YYYY-MM.pdf`

## 📝 Initial Data

### Leave Types (Seeded)

```sql
| ID      | Name            | Requires Approval | Requires Attachment | Max Days/Year |
|---------|-----------------|-------------------|---------------------|---------------|
| sick    | Sick Leave      | Yes               | Yes                 | No limit      |
| annual  | Annual Leave    | Yes               | No                  | 20            |
| unpaid  | Unpaid Leave    | Yes               | No                  | No limit      |
```

### Creating First HR Admin

After setting up the database:

```sql
-- 1. Create user via Supabase Auth dashboard or signup flow

-- 2. Promote to HR admin
UPDATE users 
SET role = 'hr_admin' 
WHERE email = 'admin@yourcompany.com';
```

## 🔄 Migrations

See [migrations/README.md](./migrations/README.md) for detailed migration instructions.

### Creating New Migrations

```bash
# Create new migration file with timestamp
touch database/migrations/$(date +%Y%m%d_%H%M%S)_description.sql
```

## 🧪 Testing

### Verify Installation

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verify seed data
SELECT * FROM leave_types;
```

### Sample Test Queries

```sql
-- Test user creation
INSERT INTO users (id, email, username, full_name)
VALUES (auth.uid(), 'test@example.com', 'testuser', 'Test User');

-- Test attendance record
INSERT INTO attendance_records (user_id, date, check_in_time, check_in_status)
VALUES (auth.uid(), CURRENT_DATE, NOW(), 'ontime');

-- Test leave request
INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, day_type, total_days, reason)
VALUES (auth.uid(), 'sick', CURRENT_DATE + 1, CURRENT_DATE + 1, 'full', 1.0, 'Medical appointment');
```

## 🐛 Troubleshooting

### Common Issues

**Error: relation "users" does not exist**
- Solution: Run `schema.sql` first

**Error: insert or update on table violates foreign key constraint**
- Solution: Ensure user exists in `auth.users` before creating user profile

**Error: new row violates row-level security policy**
- Solution: Check that user is authenticated and has proper role

**Error: duplicate key value violates unique constraint**
- Solution: Check for existing records with same unique values

### Useful Queries

```sql
-- List all constraints
SELECT conname, contype, conrelid::regclass 
FROM pg_constraint 
WHERE connamespace = 'public'::regnamespace;

-- List all indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check trigger functions
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Design Best Practices](https://supabase.com/docs/guides/database/design)

## 🆘 Support

For database-related issues:
1. Check [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md) for detailed documentation
2. Review [DATABASE_ERD.md](../DATABASE_ERD.md) for relationship diagrams
3. Contact the development team

## 📜 License

This database schema is part of the MorvaHR project. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-07  
**Database**: PostgreSQL 15+ (Supabase)



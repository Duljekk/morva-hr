# Server Actions Organization

This directory contains all server actions organized by access level and functionality.

## Directory Structure

```
lib/actions/
├── shared/          # Actions accessible by both employees and HR admins
│   ├── attendance.ts
│   ├── notifications.ts
│   ├── announcementReactions.ts
│   └── index.ts
│
├── employee/        # Actions accessible only to employees
│   ├── leaves.ts
│   └── index.ts
│
└── hr/              # Actions accessible only to HR admins
    ├── dashboard.ts
    ├── leaves.ts
    ├── announcements.ts
    ├── payslips.ts
    └── index.ts
```

## Usage

### Importing Actions

Use the index files for cleaner imports:

```typescript
// Shared actions
import { checkIn, checkOut } from '@/lib/actions/shared';
import { getNotifications } from '@/lib/actions/shared';

// Employee actions
import { submitLeaveRequest, getLeaveRequest } from '@/lib/actions/employee';

// HR actions
import { getHRDashboardStats, getAllEmployees } from '@/lib/actions/hr';
import { approveLeaveRequest, rejectLeaveRequest } from '@/lib/actions/hr';
import { createAnnouncement } from '@/lib/actions/hr';
import { createPayslip } from '@/lib/actions/hr';
```

Or import directly from specific files:

```typescript
import { checkIn } from '@/lib/actions/shared/attendance';
import { submitLeaveRequest } from '@/lib/actions/employee/leaves';
import { getHRDashboardStats } from '@/lib/actions/hr/dashboard';
```

## Authorization

### Shared Actions
- No role verification required
- Accessible to all authenticated users
- Examples: `attendance.ts`, `notifications.ts`

### Employee Actions
- Require authentication (via `createClient()`)
- Accessible only to employees
- Examples: `employee/leaves.ts`

### HR Actions
- **All functions require HR admin role verification**
- Authorization enforced via `requireHRAdmin()` helper
- Located in: `lib/auth/requireHRAdmin.ts`
- Examples: All files in `hr/` directory

## Best Practices

1. **Use index files** for cleaner imports
2. **Always verify authorization** in HR actions using `requireHRAdmin()`
3. **Keep actions focused** - one file per domain/feature
4. **Use 'use server' directive** at the top of each action file
5. **Export types and interfaces** alongside functions for better DX
6. **Handle errors consistently** - return `{ data?, error? }` pattern

## Migration Notes

Old files have been removed:
- ❌ `lib/actions/hr.ts` → ✅ `lib/actions/hr/dashboard.ts`
- ❌ `lib/actions/leaves.ts` → ✅ Split into `employee/leaves.ts` and `hr/leaves.ts`
- ❌ `lib/actions/announcements.ts` → ✅ `lib/actions/hr/announcements.ts`
- ❌ `lib/actions/payslips.ts` → ✅ `lib/actions/hr/payslips.ts`

All imports have been updated to use the new structure.















<!-- 4d0db036-86e4-4773-bbe5-c52e83238216 d7592173-58d2-4e82-a2ea-c265f9cf7fac -->
# Two-Side App Architecture Implementation Plan

## Overview
Transform the current flat route structure into a well-organized two-side application with clear separation between HR admin and Employee experiences using Next.js route groups, role-specific layouts, and improved code organization.

## Current State Analysis
- Routes: `/` (employee), `/hr` (HR), `/request-leave`, `/notifications`
- Components: Mixed in `app/components/`
- Actions: All in `lib/actions/` without role separation
- Middleware: Basic role checking exists
- Layout: Single root layout

## Implementation Steps

### Phase 1: Route Reorganization with Route Groups
**Type: Frontend**

#### 1.1 Create Route Group Structure
- Create `app/(employee)/` directory for employee routes
- Create `app/(hr)/` directory for HR routes  
- Create `app/(auth)/` directory for auth routes
- Route groups provide clean URLs while organizing code

#### 1.2 Move Existing Routes
- Move `app/page.tsx` → `app/(employee)/page.tsx` (employee dashboard)
- Move `app/request-leave/` → `app/(employee)/request-leave/`
- Move `app/notifications/` → `app/(employee)/notifications/`
- Keep `app/hr/` → `app/(hr)/page.tsx` (rename hr/page.tsx to be at root of hr group)
- Move `app/login/` → `app/(auth)/login/`

#### 1.3 Create Role-Specific Layouts
- Create `app/(employee)/layout.tsx` - Employee-specific layout with employee navigation
- Create `app/(hr)/layout.tsx` - HR-specific layout with HR navigation/sidebar
- Create `app/(auth)/layout.tsx` - Minimal layout for auth pages
- Keep `app/layout.tsx` as root layout with Providers

### Phase 2: Component Organization
**Type: Frontend**

#### 2.1 Reorganize Components Directory
- Create `components/shared/` - Components used by both roles (Button, Modal, Card, etc.)
- Create `components/employee/` - Employee-specific components
- Create `components/hr/` - HR-specific components
- Move existing components to appropriate folders:
  - Shared: `AnnouncementBanner`, `ConfirmationModal`, `Toast`, `FormInput`, etc.
  - Employee: `CheckInOutWidget`, `AttendanceCard`, `LeaveRequestForm`, etc.
  - HR: `HRRecentActivities`, `HRTaskMenu`, `StatsCard`, etc.

#### 2.2 Update Component Imports
- Update all imports across the codebase to reflect new component locations
- Use path aliases consistently (`@/components/shared/`, `@/components/employee/`, `@/components/hr/`)

### Phase 3: Server Actions Organization
**Type: Backend**

#### 3.1 Reorganize Actions Directory
- Create `lib/actions/shared/` - Actions accessible by both roles
  - Move: `attendance.ts`, `notifications.ts`, `announcementReactions.ts`
- Create `lib/actions/employee/` - Employee-only actions
  - Move: `leaves.ts` (employee functions like `submitLeaveRequest`)
- Create `lib/actions/hr/` - HR-only actions
  - Move: `hr.ts` → `lib/actions/hr/dashboard.ts`
  - Move HR functions from `leaves.ts` → `lib/actions/hr/leaves.ts`
  - Move: `announcements.ts` → `lib/actions/hr/announcements.ts`
  - Move: `payslips.ts` → `lib/actions/hr/payslips.ts`

#### 3.2 Split Leaves Actions
- Split `lib/actions/leaves.ts` into:
  - `lib/actions/employee/leaves.ts` - Employee functions (submit, view own)
  - `lib/actions/hr/leaves.ts` - HR functions (approve, reject, view all)

#### 3.3 Add Authorization to All HR Actions
- Add role verification to all HR server actions
- Create helper function `lib/auth/requireHRAdmin.ts` for consistent authorization
- Update existing HR actions to use the helper

### Phase 4: Type Safety & Permissions
**Type: Both (Frontend & Backend)**

#### 4.1 Create Role Types Module
- Create `lib/types/roles.ts` with:
  - `UserRole` type (already exists, consolidate)
  - `RolePermissions` interface
  - `rolePermissions` constant mapping roles to permissions
  - `hasPermission()` helper function

#### 4.2 Enhance Auth Utils
- Update `lib/auth/utils.ts` to use new permission system
- Add `requireHRAdmin()` server-side helper (Backend)
- Add `requireEmployee()` server-side helper (Backend)
- Keep existing client-side helpers (`isHRAdmin`, `isEmployee`) (Frontend)

### Phase 5: Navigation & Routing
**Type: Frontend**

#### 5.1 Create Navigation Configuration
- Create `lib/navigation/routes.ts` with:
  - `employeeRoutes` array
  - `hrRoutes` array
  - Route metadata (path, label, icon, permissions)

#### 5.2 Create Navigation Components
- Create `components/shared/Navigation.tsx` - Role-aware navigation component
- Create `components/employee/EmployeeNav.tsx` - Employee navigation
- Create `components/hr/HRNav.tsx` - HR navigation
- Update layouts to use appropriate navigation

### Phase 6: Middleware Updates
**Type: Backend**

#### 6.1 Enhance Middleware
- Update `middleware.ts` to work with route groups
- Add route permission checking using new permission system
- Optimize profile fetching (cache in middleware)
- Update redirect logic for route groups

#### 6.2 Route Protection
- Ensure middleware correctly handles `(employee)/`, `(hr)/`, `(auth)/` routes
- Maintain existing security checks
- Add logging for unauthorized access attempts

### Phase 7: Layout Implementation
**Type: Frontend**

#### 7.1 Employee Layout
- Create `app/(employee)/layout.tsx`:
  - Include employee navigation
  - Shared header/footer if needed
  - Mobile-first responsive design

#### 7.2 HR Layout  
- Create `app/(hr)/layout.tsx`:
  - Include HR navigation/sidebar
  - Different layout structure for admin dashboard
  - Consistent with existing HR dashboard design

#### 7.3 Auth Layout
- Create `app/(auth)/layout.tsx`:
  - Minimal layout (no navigation)
  - Centered content for login/auth pages

### Phase 8: Update Existing Pages
**Type: Frontend**

#### 8.1 Update Employee Pages
- Update `app/(employee)/page.tsx` (moved from `app/page.tsx`)
- Update `app/(employee)/request-leave/page.tsx`
- Update `app/(employee)/notifications/page.tsx`
- Ensure all imports use new component paths

#### 8.2 Update HR Pages
- Update `app/(hr)/page.tsx` (existing HR dashboard)
- Update `app/(hr)/leaves/page.tsx`
- Update `app/(hr)/payslips/page.tsx`
- Ensure all imports use new component paths

### Phase 9: Testing & Validation
**Type: Both (Frontend & Backend)**

#### 9.1 Route Access Testing
- Verify employees can only access employee routes
- Verify HR admins can only access HR routes
- Test middleware redirects
- Test unauthorized access attempts

#### 9.2 Component Import Testing
- Verify all components load correctly
- Check for broken imports
- Test shared components work in both contexts

#### 9.3 Action Authorization Testing
- Verify employee actions reject HR users
- Verify HR actions reject employees
- Test permission helpers work correctly

## File Structure After Implementation

```
app/
├── (employee)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── request-leave/
│   └── notifications/
├── (hr)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── leaves/
│   ├── payslips/
│   └── components/
├── (auth)/
│   └── login/
├── components/ (legacy, to be migrated)
├── layout.tsx
└── providers.tsx

components/
├── shared/
├── employee/
└── hr/

lib/
├── actions/
│   ├── shared/
│   ├── employee/
│   └── hr/
├── auth/
│   ├── utils.ts (enhanced)
│   └── requireHRAdmin.ts (new)
├── navigation/
│   └── routes.ts (new)
└── types/
    └── roles.ts (new)
```

## Key Benefits
- Clean URL structure (no `/employee/` prefix needed)
- Clear separation of concerns
- Type-safe role permissions
- Better code organization
- Easier to maintain and scale
- Improved developer experience

## Migration Notes
- Route groups don't affect URLs (e.g., `(employee)/page.tsx` is still `/`)
- All existing URLs remain the same
- Gradual migration possible (can move routes incrementally)
- No breaking changes to external APIs

## Phase Classification Summary

**Frontend Phases:**
- Phase 1: Route Reorganization with Route Groups
- Phase 2: Component Organization
- Phase 5: Navigation & Routing
- Phase 7: Layout Implementation
- Phase 8: Update Existing Pages

**Backend Phases:**
- Phase 3: Server Actions Organization
- Phase 6: Middleware Updates

**Both (Frontend & Backend) Phases:**
- Phase 4: Type Safety & Permissions
- Phase 9: Testing & Validation

### To-dos

- [ ] Create route group directories (employee), (hr), (auth) and move existing routes
- [ ] Create role-specific layouts for employee, HR, and auth route groups
- [ ] Reorganize components into shared/, employee/, and hr/ directories
- [ ] Reorganize server actions into shared/, employee/, and hr/ directories and split leaves.ts
- [ ] Create roles.ts with permission system and enhance auth utils
- [ ] Create navigation configuration and role-aware navigation components
- [ ] Update middleware to work with route groups and add permission checking
- [ ] Update all component and action imports across the codebase
- [ ] Add requireHRAdmin and requireEmployee server-side helpers to all actions
- [ ] Test route access, component imports, and action authorization












































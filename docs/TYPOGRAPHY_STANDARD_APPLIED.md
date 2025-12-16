# Typography Standard Applied

## New Typography Standard

### Rules Applied:
1. **Letter Spacing**: Font sizes 12px-30px have 0 letter spacing (default, not increased or decreased)
2. **Line Height for Regular (400)**: font-size + 8px
3. **Line Height for Medium (500), Semibold (600), Bold (700)**: font-size + 4px

### Implementation Details

#### Tailwind Config Updates
- Added custom line-height utilities in `tailwind.config.ts`:
  - `leading-regular-*` for Regular (400) weight
  - `leading-bold-*` for Medium (500), Semibold (600), Bold (700) weights

#### Global CSS Updates
- Added CSS rules in `app/globals.css` to remove letter-spacing for fonts 12px-30px
- Applied via CSS selectors for all text size classes

#### Line Height Mapping

| Font Size | Regular (400) | Medium/Semibold/Bold (500/600/700) |
|-----------|---------------|-------------------------------------|
| 12px (xs) | 20px          | 16px                                |
| 14px (sm) | 22px          | 18px                                |
| 16px (base) | 24px        | 20px                                |
| 18px (lg) | 26px          | 22px                                |
| 20px (xl) | 28px          | 24px                                |
| 24px (2xl) | 32px         | 28px                                |
| 30px      | 38px          | 34px                                |

### Components Updated

#### Shared Components
- ✅ `Badge.tsx` - Updated line heights and removed tracking
- ✅ `ButtonLarge.tsx` - Updated line height and removed tracking
- ✅ `SearchBar.tsx` - Updated line heights and removed tracking
- ✅ `SidebarMenuItem.tsx` - Updated line height and removed tracking
- ✅ `Toast.tsx` - Updated line heights and removed tracking
- ✅ `TextArea.tsx` - Updated line height (removed inline style)
- ✅ `ConfirmationModal.tsx` - Updated line heights and removed tracking
- ✅ `DiscardChangesModal.tsx` - Updated line heights and removed tracking

#### Employee Components
- ✅ `CheckInOutWidget.tsx` - Updated line heights and removed tracking
- ✅ `AttendanceCard.tsx` - Updated line heights and removed tracking
- ✅ `LeaveRequestDetailsModal.tsx` - Updated line heights and removed tracking
- ✅ `LoginPage.tsx` - Updated line heights and removed tracking

### Remaining Files to Update

The following files still contain `tracking-*` classes and need to be updated:

1. `app/(employee)/notifications/page.tsx`
2. `app/(employee)/page.tsx`
3. `app/(employee)/request-leave/page.tsx`
4. `app/check-in-success/page.tsx`
5. `components/hr/HRRecentActivities.tsx`
6. `components/shared/AnnouncementBanner.tsx`
7. `components/hr/HRTaskMenu.tsx`
8. `components/employee/RecentActivities.tsx`
9. `components/employee/LeaveTypeBottomSheet.tsx`
10. `components/employee/LeaveRequestStatusTimeline.tsx`
11. `app/components/AnnouncementBottomSheet.tsx`
12. `components/shared/AnnouncementBottomSheet.tsx`
13. `components/employee/DaysOffBadge.tsx`
14. `components/employee/LeaveStatusCard.tsx`

### Usage Examples

#### Before:
```tsx
<p className="text-sm font-medium leading-[18px] tracking-[-0.07px]">
  Text content
</p>
```

#### After:
```tsx
<p className="text-sm font-medium leading-bold-sm">
  Text content
</p>
```

#### Before:
```tsx
<p className="text-base font-normal leading-5 tracking-[-0.16px]">
  Text content
</p>
```

#### After:
```tsx
<p className="text-base font-normal leading-regular-base">
  Text content
</p>
```

### Notes

- Font sizes above 30px (like `text-6xl` = 60px) are not affected by the letter-spacing rule
- The CSS rule automatically removes letter-spacing for all text sizes 12px-30px
- All `tracking-*` classes should be removed as they're now redundant
- Use the new line-height utilities: `leading-regular-*` for Regular, `leading-bold-*` for Medium/Semibold/Bold









































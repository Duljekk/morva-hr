# Troubleshooting - Invitation Modal Not Showing

## Issue Fixed ✅

The modal wasn't showing because of an incorrect icon import. 

**Problem**: Used `XMarkIcon` from `@heroicons/react` (not installed)  
**Solution**: Changed to use your custom `CrossIcon` from `@/components/icons`

## Changes Made

1. **InviteUserModal.tsx**
   - Changed: `import { XMarkIcon } from '@heroicons/react/24/outline';`
   - To: `import { CrossIcon } from '@/components/icons';`
   - Updated icon usage in close button

2. **InviteUserForm.tsx**
   - Removed `label` prop from FormInput (not supported)
   - Added proper label elements above each input
   - Added `bgColor="white"` prop for proper styling

## How to Test

1. **Start dev server**: `npm run dev`
2. **Navigate to**: `http://localhost:3000/admin/employees`
3. **Click**: "Add Employee" button (top right)
4. **Expected**: Modal should open with invitation form
5. **Fill form** and test sending invitation

## If Modal Still Doesn't Show

### Check Browser Console (F12)
Look for any JavaScript errors. Common issues:

1. **Import errors**: Missing components or icons
2. **Syntax errors**: Check for any TypeScript errors
3. **Z-index issues**: Modal has `z-50` which should be high enough

### Check Network Tab
When you click "Add Employee", ensure:
- No failed requests for missing assets
- No 404 errors for components

### Check Elements Tab
When modal is open:
1. Inspect the page
2. Look for `<div class="fixed inset-0 z-50">`
3. If it exists but not visible, it's a CSS issue
4. If it doesn't exist, it's a React/state issue

### Verify State is Updating
Add console.log to verify state changes:

```typescript
// In app/(hr)/hr/employees/page.tsx
const handleAddEmployee = () => {
  console.log('Add Employee clicked!'); // Add this
  setShowInviteModal(true);
  console.log('Modal state set to true'); // Add this
};
```

Then check console when clicking the button.

## Common Fixes

### Fix 1: Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Fix 2: Verify All Imports
Check that these files exist:
- ✅ `components/hr/users/InviteUserModal.tsx`
- ✅ `components/hr/users/InviteUserForm.tsx`
- ✅ `components/icons/shared/Cross.tsx`
- ✅ `components/shared/FormInput.tsx`
- ✅ `components/shared/ButtonLarge.tsx`

### Fix 3: Check for TypeScript Errors
```bash
npm run build
```

This will show any TypeScript errors that might be preventing compilation.

### Fix 4: Verify FormInput Props
The FormInput component expects:
- `value` (string)
- `onChange` (function)
- `placeholder` (string)
- `type` (string)
- `bgColor` ('white' | 'neutral-50')
- `required` (boolean)

NOT:
- ~~`label`~~ (not supported - use separate label element)

## Success Checklist

When working correctly:
- ✅ Click "Add Employee" → Modal opens
- ✅ Modal has white background with form
- ✅ Close (X) button works
- ✅ Click backdrop → Modal closes
- ✅ Form fields are visible and editable
- ✅ Submit button is visible

## Still Having Issues?

1. **Check the server console** (terminal running `npm run dev`)
2. **Check browser console** (F12 → Console tab)
3. **Verify files were saved** (sometimes editors don't auto-save)
4. **Restart dev server** (`Ctrl+C` then `npm run dev`)
5. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

## Next Steps After Modal Works

Once the modal opens successfully:

1. ✅ Run database migration in Supabase
2. ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
3. ✅ Test sending an actual invitation
4. ✅ Check email for invitation link
5. ✅ Test complete signup flow

See `INVITATION_TESTING_GUIDE.md` for full testing instructions.

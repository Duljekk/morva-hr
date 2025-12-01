# Icon Component System

This directory contains optimized React icon components for the MorvaHR application. Icons are organized by context and converted from SVG files to `.tsx` React components for better performance, tree-shaking, and customization.

## Directory Structure

```
components/icons/
├── shared/          # Shared icons used across multiple contexts
│   ├── Search.tsx
│   ├── Command.tsx
│   ├── Sidebar.tsx
│   ├── Settings.tsx
│   └── Logout.tsx
├── hr/              # HR-specific icons
│   ├── Dashboard.tsx
│   ├── Attendance.tsx
│   ├── Employees.tsx
│   ├── Announcements.tsx
│   ├── LeaveRequests.tsx
│   └── Payroll.tsx
├── employee/        # Employee-specific icons
│   └── (to be added)
├── complex/         # Complex icons that remain as .svg imports
│   └── (documentation only - actual .svg files stay in app/assets/icons/)
├── IconTemplate.tsx # Template for creating new icon components
├── IconRegistry.tsx # Lazy loading registry for code-splitting
├── index.ts         # Central export file for all icons
└── README.md        # This file
```

## Icon Component Template

All icon components follow a standardized template. See `IconTemplate.tsx` for the complete template.

### Key Features

- **React.memo**: All icons are memoized for performance
- **TypeScript**: Full type safety with `React.SVGProps<SVGSVGElement>`
- **Size Prop**: Default 16px, customizable via `size` prop
- **currentColor**: Icons use `currentColor` for fills/strokes, allowing CSS color customization
- **Accessibility**: Includes `aria-hidden="true"` for decorative icons
- **Tree-shaking**: Only used icons are bundled

### Template Structure

```tsx
import { memo } from 'react';

export interface IconNameProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const IconName = memo(function IconName({
  size = 16,
  className = '',
  ...props
}: IconNameProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* SVG paths with currentColor */}
    </svg>
  );
});

IconName.displayName = 'IconName';
export default IconName;
```

## Usage

### Import Icons (Recommended for Frequently Used Icons)

```tsx
// Import from central index (best for always-visible icons)
import {
  SearchIcon,
  DashboardIcon,
  AttendanceIcon,
} from '@/components/icons';

// Or import directly
import SearchIcon from '@/components/icons/shared/Search';
```

### Use in Components

```tsx
// Basic usage with Tailwind classes
<SearchIcon className="w-4 h-4 text-neutral-500" />

// Custom size
<DashboardIcon size={24} className="text-blue-500" />

// With additional props
<AttendanceIcon 
  size={20}
  className="hover:text-blue-600 transition-colors"
  onClick={handleClick}
/>
```

### Lazy Loading with Icon Registry (For Conditional/Rarely Used Icons)

For icons that are conditionally rendered or rarely used, use the Icon Registry for code-splitting:

```tsx
import { IconRegistry } from '@/components/icons/IconRegistry';

// Lazy-loaded icon (good for conditional rendering)
{showIcon && (
  <IconRegistry name="DashboardIcon" className="w-4 h-4 text-neutral-600" />
)}

// Using the hook
import { useIcon } from '@/components/icons/IconRegistry';

function MyComponent() {
  const DashboardIcon = useIcon('DashboardIcon');
  return <DashboardIcon className="w-4 h-4" />;
}
```

**When to use Icon Registry:**
- ✅ Icons that are conditionally rendered
- ✅ Icons used in modals/dialogs that aren't always visible
- ✅ Icons in rarely accessed pages
- ✅ Icons that change based on user input

**When to use direct imports:**
- ✅ Icons always visible (like sidebar icons)
- ✅ Icons used in critical rendering paths
- ✅ Icons used multiple times on the same page

## Creating New Icons

### Step 1: Export SVG from Figma

1. Select the icon in Figma
2. Right-click → Copy/Paste as → Copy as SVG
3. Or: Export → Format: SVG → Copy

### Step 2: Optimize SVG

Before converting to React component, optimize the SVG:

- ✅ Remove `width` and `height` attributes
- ✅ Keep `viewBox` attribute
- ✅ Replace hardcoded colors with `currentColor`:
  - `fill="#404040"` → `fill="currentColor"`
  - `stroke="#737373"` → `stroke="currentColor"`
- ✅ Remove `xmlns` attribute (React adds it automatically)
- ✅ Convert `fill-rule`/`clip-rule` to `fillRule`/`clipRule` (React props)
- ✅ Convert `stroke-width` to `strokeWidth`, `stroke-linecap` to `strokeLinecap`, etc.

### Step 3: Create Component

1. Copy `IconTemplate.tsx` to the appropriate directory
2. Rename file to match icon name (e.g., `CheckIn.tsx`)
3. Replace:
   - `IconName` → `CheckInIcon`
   - `IconNameProps` → `CheckInIconProps`
   - `viewBox` with your icon's viewBox
   - SVG paths with your optimized paths
4. Add JSDoc comment describing the icon

### Step 4: Export from Index

Add the export to `components/icons/index.ts`:

```tsx
export { default as CheckInIcon } from './employee/CheckIn';
```

## When to Use .tsx vs .svg

### Use .tsx Components (Recommended)

- ✅ Simple icons (single color, no gradients)
- ✅ Icons used frequently across the app
- ✅ Icons that need color customization
- ✅ Icons that benefit from tree-shaking

### Keep as .svg Imports

- ⚠️ Complex icons with gradients (`<linearGradient>`, `<radialGradient>`)
- ⚠️ Icons with filters (`<filter>`, `<feGaussianBlur>`, etc.)
- ⚠️ Icons with complex `<defs>` sections
- ⚠️ Icons with multiple color stops
- ⚠️ Brand logos (like logotype with gradients)

Example: `logotype.svg` stays as `.svg` because it has gradients and filters.

## Performance Benefits

1. **Tree-shaking**: Unused icons are not included in the bundle
2. **No HTTP Requests**: Icons are inlined in the JavaScript bundle
3. **Smaller Bundle Size**: Only necessary icon code is bundled
4. **Better Caching**: Icons are part of the main bundle, cached together
5. **Type Safety**: TypeScript ensures correct icon usage

## Migration Guide

When migrating existing `.svg` imports to `.tsx` components:

1. Create the `.tsx` component following the template
2. Update imports in components:
   ```tsx
   // Before
   import SearchIcon from '@/app/assets/icons/search.svg';
   
   // After
   import { SearchIcon } from '@/components/icons';
   ```
3. Usage remains the same (JSX syntax unchanged)
4. Test visually to ensure icons render correctly
5. Remove old `.svg` imports once migration is complete

## Best Practices

1. **Always use `currentColor`** for monochrome icons
2. **Keep viewBox** for proper scaling
3. **Use React.memo** for all icon components
4. **Include JSDoc** comments for better IDE support
5. **Set displayName** for better debugging
6. **Use `aria-hidden="true"`** for decorative icons
7. **Organize by context** (shared, hr, employee, complex)
8. **Export from index.ts** for cleaner imports

## Examples

### Simple Icon (Fill)

```tsx
<path
  d="M4.77431 2C4.42287..."
  fill="currentColor"
/>
```

### Simple Icon (Stroke)

```tsx
<path
  d="M13.3332 13.3332..."
  stroke="currentColor"
  strokeWidth={1.2}
  strokeLinecap="round"
/>
```

### Icon with Multiple Paths

```tsx
<svg viewBox="0 0 16 16" ...>
  <path d="..." fill="currentColor" />
  <path d="..." fill="currentColor" />
  <path d="..." fill="currentColor" />
</svg>
```

## Questions?

- Check `IconTemplate.tsx` for the complete template
- Review existing icons in `shared/` or `hr/` for examples
- Follow the optimization checklist in Step 2 above


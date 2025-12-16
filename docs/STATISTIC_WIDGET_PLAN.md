# Statistic Widget Implementation Plan

## Design Analysis

### Component Structure
The Statistic Widget is a card component displaying a metric with:
1. **Header Section**: Icon + Title
2. **Statistic Section**: Large value display + Unit
3. **Comparison Section**: Trend indicator (arrow icon) + Comparison text

---

## Extracted Variables & Styles

### Colors
```typescript
const colors = {
  // Background
  bg: '#ffffff', // White background
  
  // Text Colors
  headerText: '#525252',      // neutral-600
  displayText: '#262626',     // neutral-800
  unitText: '#525252',        // neutral-600
  trendText: '#00a63e',       // green-600 (positive trend)
  comparisonText: '#a1a1a1',  // neutral-400
  
  // Icon Colors
  headerIcon: '#737373',      // neutral-500 (from icon stroke)
  trendIconBg: '#00a63e',    // green-600
  trendIconFill: '#ffffff',   // White fill for arrow icon
};
```

### Typography
```typescript
const typography = {
  // Header (Icon + Title)
  header: {
    fontFamily: 'Mona Sans',
    fontWeight: 500, // Medium
    fontSize: '16px', // text-md
    lineHeight: '20px',
    letterSpacing: 0,
  },
  
  // Display Value (Large number)
  display: {
    fontFamily: 'Inter', // or font-family-display
    fontWeight: 600, // Semibold
    fontSize: '36px', // display-md
    lineHeight: '44px', // display-md line-height
    letterSpacing: '-0.72px', // -2% tracking
  },
  
  // Unit (AM/PM)
  unit: {
    fontFamily: 'Mona Sans',
    fontWeight: 500, // Medium
    fontSize: '14px', // text-sm
    lineHeight: '18px',
    letterSpacing: 0,
  },
  
  // Trend Text (e.g., "1 minute")
  trend: {
    fontFamily: 'Mona Sans',
    fontWeight: 500, // Medium
    fontSize: '14px', // text-sm
    lineHeight: '18px',
    letterSpacing: 0,
  },
  
  // Comparison Text (e.g., "vs last month")
  comparison: {
    fontFamily: 'Mona Sans',
    fontWeight: 400, // Regular
    fontSize: '14px', // text-sm
    lineHeight: '20px', // text-sm line-height
    letterSpacing: 0,
  },
};
```

### Spacing & Layout
```typescript
const spacing = {
  // Container Padding
  containerPadding: {
    top: '20px',
    right: '28px',
    bottom: '18px',
    left: '18px',
  },
  
  // Gaps
  headerGap: '6px',        // Between icon and title
  contentGap: '16px',     // Between header and statistic section
  statisticGap: '2px',    // Between value and unit
  comparisonGap: '4px',    // Between trend icon and text
  
  // Statistic Section Padding
  statisticPadding: {
    x: '4px',
    y: 0,
  },
  
  // Unit Container
  unitContainer: {
    height: '28px',
    width: '23px',
  },
};

const layout = {
  // Icon Sizes
  headerIcon: '18px',
  trendIcon: {
    container: '12px',
    icon: '10px',
  },
  
  // Border Radius
  borderRadius: '14px',
};
```

### Shadows
```typescript
const shadows = {
  container: '0px 4px 4px -2px rgba(0,0,0,0.05), 0px 0px 1px 1px rgba(0,0,0,0.1)',
};
```

---

## Component Props Interface

```typescript
interface StatisticWidgetProps {
  /**
   * Title/label for the statistic (e.g., "Avg. Check-In Time")
   */
  title: string;
  
  /**
   * Main value to display (e.g., "11:05")
   */
  value: string;
  
  /**
   * Unit to display next to value (e.g., "AM", "PM", "%", etc.)
   */
  unit?: string;
  
  /**
   * Trend value (e.g., "1 minute", "+5%", "-2 hours")
   */
  trend?: string;
  
  /**
   * Comparison text (e.g., "vs last month", "vs yesterday")
   */
  comparison?: string;
  
  /**
   * Trend direction for styling
   * - 'up': Green (positive)
   * - 'down': Red (negative)
   * - 'neutral': Gray (no change)
   */
  trendDirection?: 'up' | 'down' | 'neutral';
  
  /**
   * Optional icon to display in header
   * If not provided, defaults to ClockIcon
   */
  icon?: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Click handler (optional, makes widget clickable)
   */
  onClick?: () => void;
}
```

---

## Implementation Plan

### Step 1: Create Component File
- **File**: `components/hr/StatisticWidget.tsx`
- **Location**: `components/hr/` (matches existing HR components)

### Step 2: Component Structure
```tsx
<div className="statistic-widget-container">
  {/* Header Section */}
  <div className="header-section">
    <Icon /> {/* ClockIcon or custom */}
    <p className="header-text">{title}</p>
  </div>
  
  {/* Statistic Section */}
  <div className="statistic-section">
    <div className="value-container">
      <p className="display-value">{value}</p>
      {unit && (
        <div className="unit-container">
          <p className="unit-text">{unit}</p>
        </div>
      )}
    </div>
    
    {/* Comparison Section */}
    {(trend || comparison) && (
      <div className="comparison-section">
        {trend && trendDirection && (
          <div className="trend-icon-container">
            <ArrowIcon />
          </div>
        )}
        {trend && <p className="trend-text">{trend}</p>}
        {comparison && <p className="comparison-text">{comparison}</p>}
      </div>
    )}
  </div>
</div>
```

### Step 3: Styling Approach
- Use Tailwind CSS classes matching the extracted values
- Convert hex colors to Tailwind color classes or use arbitrary values
- Use `font-sans` for Mona Sans (already configured)
- Use `font-semibold` for display text (600 weight)
- Apply exact spacing values using Tailwind spacing scale

### Step 4: Icon Implementation
- Use existing `ClockIcon` from `@/components/icons` for header icon
- **Create new `ArrowUpRightIcon`** component for trend indicator (not currently in codebase)
  - Size: 10px icon inside 12px container
  - White fill on green background
  - Located in `components/icons/shared/ArrowUpRight.tsx`
- Size: 18px for header icon, 12px container (10px icon) for trend icon

### Step 5: Responsive Considerations
- Widget should be flexible width (fit container)
- Text should truncate if too long
- Maintain aspect ratio and spacing

### Step 6: Accessibility
- Add `aria-label` for the widget
- Ensure proper semantic HTML
- Add `role` attributes if needed
- Support keyboard navigation if clickable

---

## Tailwind Class Mapping

### Container
```tsx
className="
  bg-white
  flex flex-col items-start
  overflow-clip
  pb-[18px] pl-[18px] pr-[28px] pt-[20px]
  relative
  rounded-[14px]
  shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
  w-full
"
```

### Header Section
```tsx
className="
  flex gap-[6px] items-center
  relative shrink-0 w-full
"
```

### Header Icon
```tsx
className="
  relative shrink-0 size-[18px]
"
```

### Header Text
```tsx
className="
  font-sans font-medium
  leading-[20px]
  relative shrink-0
  text-[#525252]
  text-base
  text-nowrap whitespace-pre
"
```

### Statistic Section Container
```tsx
className="
  flex flex-col items-start
  px-[4px] py-0
  relative shrink-0
"
```

### Value Container
```tsx
className="
  flex gap-[2px] items-end
  relative shrink-0
"
```

### Display Value
```tsx
className="
  font-semibold
  leading-[44px]
  relative shrink-0
  text-[#262626]
  text-[36px]
  text-nowrap
  tracking-[-0.72px]
  whitespace-pre
"
```

### Unit Container
```tsx
className="
  h-[28px]
  relative shrink-0
  w-[23px]
"
```

### Unit Text
```tsx
className="
  absolute
  font-sans font-medium
  leading-[18px]
  left-0
  text-[#525252]
  text-sm
  text-nowrap
  top-[calc(50%-9.26px)]
  whitespace-pre
"
```

### Comparison Section
```tsx
className="
  flex gap-[4px] items-center
  relative shrink-0
"
```

### Trend Icon Container
```tsx
className="
  bg-[#00a63e]
  flex items-center justify-center
  overflow-clip
  relative
  rounded-[4px]
  shrink-0
  size-[12px]
"
```

### Trend Text
```tsx
className="
  font-sans font-medium
  leading-[18px]
  relative shrink-0
  text-[#00a63e]
  text-sm
  text-nowrap whitespace-pre
"
```

### Comparison Text
```tsx
className="
  font-sans font-normal
  leading-[20px]
  relative shrink-0
  text-[#a1a1a1]
  text-sm
  text-nowrap whitespace-pre
"
```

---

## Dependencies

### Required Imports
- `React` (with `memo` for optimization)
- `ClockIcon` from `@/components/icons`
- Arrow icon component (to be created or imported)

### Optional Enhancements
- Add loading state
- Add error state
- Add animation/transitions
- Support for different trend colors (red for negative)

---

## Testing Considerations

1. **Visual Testing**
   - Verify spacing matches Figma exactly
   - Check font sizes and weights
   - Verify colors match design
   - Test with different value lengths

2. **Functional Testing**
   - Test with/without unit
   - Test with/without trend/comparison
   - Test click handler (if implemented)
   - Test responsive behavior

3. **Edge Cases**
   - Very long titles
   - Very long values
   - Missing optional props
   - Different trend directions

---

## Next Steps

1. ✅ Analyze Figma design
2. ✅ Extract variables and styles
3. ⏭️ Create arrow-up-right icon component (if needed)
4. ⏭️ Implement StatisticWidget component
5. ⏭️ Add to component exports
6. ⏭️ Create test/demo page
7. ⏭️ Verify against Figma design


# Tab Component Documentation

## Overview

The Tab component is a fully accessible, Figma-designed tab button for the Employee Details page and other tabbed interfaces in the Morva HR application.

## Components

### 1. `Tab` - Individual Tab Button
### 2. `TabList` - Container for Tab Components

## Figma Design Source

- **File**: Staging Area
- **Node ID**: 588-1258
- **Component Set**: Tab
- **Last Modified**: December 10, 2025

## Design Specifications

### States (Variants)

#### Active State
- Background: White (`#FFFFFF`)
- Text Color: Dark Gray (`rgb(64, 64, 64)` / `#404040`)
- Shadow: 
  - `0px 0px 0px 0.75px rgba(0,0,0,0.06)` (border-like)
  - `0px 1px 2px 0px rgba(0,0,0,0.05)` (drop shadow)
- Border Radius: 8px
- Font Weight: 500 (Medium)

#### Default State
- Background: Transparent
- Text Color: Gray (`rgb(115, 115, 115)` / `#737373`)
- Hover: Light gray background
- Border Radius: 8px
- Font Weight: 500 (Medium)

### Typography
- **Font Family**: Mona Sans
- **Font Size**: 14px
- **Font Weight**: 500 (Medium)
- **Line Height**: 18px

### Dimensions
- **Height**: 32px
- **Padding**: 10px horizontal, 10px vertical
- **Border Radius**: 8px (container), 4px (number badge)
- **Gap**: 6px between label and number badge

### Number Badge
- **Size**: 16x16px
- **Background**: Blue (`#2B7FFF`)
- **Text Color**: White
- **Font Size**: 12px
- **Font Weight**: 500 (Medium)
- **Border Radius**: 4px
- **Text Alignment**: Center

## Props

### Tab Component Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | - | ✅ Yes | The text label displayed on the tab |
| `state` | `'active' \| 'default'` | `'default'` | No | Current state of the tab |
| `hasNumber` | `boolean` | `false` | No | Whether to show the number badge |
| `number` | `number \| string` | `1` | No | The number to display in the badge |
| `onClick` | `() => void` | - | No | Click handler for the tab |
| `disabled` | `boolean` | `false` | No | Whether the tab is disabled |
| `className` | `string` | `''` | No | Additional CSS classes |
| `aria-label` | `string` | - | No | ARIA label for accessibility |
| `aria-selected` | `boolean` | - | No | ARIA selected state |
| `aria-controls` | `string` | - | No | ID of the tab panel this tab controls |
| `id` | `string` | - | No | ID for the tab element |

### TabList Component Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `ReactNode` | - | ✅ Yes | Tab components to render |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | Layout orientation of the tabs |
| `className` | `string` | `''` | No | Additional CSS classes |
| `aria-label` | `string` | - | No | ARIA label for the tab list |

## Usage Examples

### Basic Usage

```tsx
import Tab from '@/components/shared/Tab';

<Tab label="Attendance" state="active" />
<Tab label="Performance" state="default" />
```

### With Number Badge

```tsx
<Tab 
  label="Documents" 
  state="active" 
  hasNumber={true} 
  number={24} 
/>
```

### Interactive Tab Group

```tsx
'use client';

import { useState } from 'react';
import Tab from '@/components/shared/Tab';
import TabList from '@/components/shared/TabList';

export default function EmployeeDetails() {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div>
      <TabList aria-label="Employee sections">
        <Tab
          label="Attendance"
          state={activeTab === 'attendance' ? 'active' : 'default'}
          hasNumber={true}
          number={24}
          onClick={() => setActiveTab('attendance')}
          aria-controls="attendance-panel"
          id="attendance-tab"
        />
        <Tab
          label="Performance"
          state={activeTab === 'performance' ? 'active' : 'default'}
          hasNumber={true}
          number={8}
          onClick={() => setActiveTab('performance')}
          aria-controls="performance-panel"
          id="performance-tab"
        />
        <Tab
          label="Documents"
          state={activeTab === 'documents' ? 'active' : 'default'}
          onClick={() => setActiveTab('documents')}
          aria-controls="documents-panel"
          id="documents-tab"
        />
      </TabList>

      {/* Tab Panels */}
      <div className="mt-4">
        {activeTab === 'attendance' && (
          <div id="attendance-panel" role="tabpanel" aria-labelledby="attendance-tab">
            {/* Attendance content */}
          </div>
        )}
        {activeTab === 'performance' && (
          <div id="performance-panel" role="tabpanel" aria-labelledby="performance-tab">
            {/* Performance content */}
          </div>
        )}
        {activeTab === 'documents' && (
          <div id="documents-panel" role="tabpanel" aria-labelledby="documents-tab">
            {/* Documents content */}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Accessibility

The Tab component follows WAI-ARIA best practices for tabs as outlined in the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

### ARIA Attributes
- `role="tab"` - Identifies the element as a tab
- `role="tablist"` - Identifies the container as a tab list
- `aria-selected` - Indicates whether the tab is currently selected
- `aria-controls` - References the ID of the tab panel
- `aria-label` - Provides an accessible name for the tab
- `aria-orientation` - Specifies horizontal or vertical orientation (on TabList)
- `aria-disabled` - Indicates when a tab is disabled

### Keyboard Navigation
- **Tab**: Moves focus into and out of the tab list
- **Enter/Space**: Activates the focused tab ✅ Implemented
- **Arrow Keys**: Should navigate between tabs (implement at the TabList level)
- **Home/End**: Should jump to first/last tab (implement at the TabList level)

### Focus Management
- Active tab has `tabIndex={0}` (focusable)
- Inactive tabs have `tabIndex={-1}` (not in tab order)
- Disabled tabs are not focusable or activatable

### Screen Reader Support
- Tab role announces the element as a tab
- Selected state is communicated to screen readers
- Number badges include aria-label for context
- Disabled state is properly announced

## Best Practices

1. **Always use TabList as a wrapper** for multiple tabs to ensure proper ARIA structure
2. **Provide unique IDs** for each tab and link them to their panels using `aria-controls`
3. **Set aria-selected** to match the active state for proper accessibility
4. **Use meaningful labels** that clearly describe the tab content
5. **Keep number badges optional** - use only when showing counts is relevant
6. **Implement keyboard navigation** for a complete tab experience

## Testing

Visit the test page to see all variants and interactions:

```
http://localhost:3000/tab-test
```

The test page includes:
- Basic states (active/default)
- Tabs with and without number badges
- Interactive tab switching
- Accessibility demonstrations
- Various label lengths

## Component Location

- **Tab Component**: `components/shared/Tab.tsx`
- **TabList Component**: `components/shared/TabList.tsx`
- **Test Page**: `app/tab-test/page.tsx`

## Related Components

- `Badge` - For status badges
- `ButtonLarge` - For primary actions
- `ToggleButton` - For binary state toggles

## Figma MCP Integration

This component was developed using the Figma REST API with the following specifications extracted directly from the design file:

- Component property definitions (Text, hasNumber, State)
- Exact color values from design tokens
- Typography specifications
- Layout and spacing values
- Shadow and border radius specifications

## Notes

- The component uses Tailwind CSS for styling
- Mona Sans font must be available in the project
- The component is fully responsive and works on all screen sizes
- Hover states are built-in for better UX

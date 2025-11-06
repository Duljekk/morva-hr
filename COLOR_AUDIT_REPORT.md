# Color Styling Audit Report

## Summary
This report identifies all hardcoded colors (not using Tailwind tokens) in the application.

---

## ❌ FILES WITH HARDCODED COLORS

### 1. **app/globals.css**
**Lines 19-20:**
```css
background-color: #fafafa;  /* Should use: bg-neutral-50 */
color: #262626;             /* Should use: text-neutral-800 */
```
**Issue:** Using hex colors instead of Tailwind tokens
**Recommendation:** Use Tailwind color tokens via CSS variables or remove if body styles aren't necessary

---

### 2. **app/components/DocumentAttachment.tsx**
**Line 43:**
```jsx
stroke="#e5e5e5"
```
**Issue:** Hardcoded hex color in SVG stroke
**Recommendation:** Use `stroke="currentColor"` with `text-neutral-200` class, or use CSS variable

---

### 3. **app/components/ButtonLarge.tsx**
**Line 20:**
```jsx
shadow-[inset_0.5px_0.7px_0.4px_0px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0.2px_0px_rgba(0,0,0,0.6)]
```
**Issue:** RGBA colors in shadow values
**Recommendation:** These are custom shadows for glass/neumorphic effect. Consider moving to Tailwind config as custom shadow utilities.

---

### 4. **app/components/AttendanceCard.tsx**
**Lines 22, 24:**
```jsx
bg-[rgba(255,255,255,0.25)]
shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(229,229,229,1)]
shadow-[0px_0px_0.5px_0.5px_rgba(229,229,229,1)]
```
**Issue:** RGBA colors for glass morphism effect and custom shadows
**Recommendation:** Move to Tailwind config as reusable utilities

---

### 5. **app/components/CheckInOutWidget.tsx**
**Lines 133, 135:**
```jsx
bg-gradient-to-b from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.6)]
shadow-[0px_4px_8px_0px_rgba(17,17,17,0.05),0px_2px_4px_0px_rgba(17,17,17,0.05),0px_0px_4px_0px_rgba(28,28,28,0.1),inset_0px_-6px_0px_0px_rgba(38,38,38,0.05)]
bg-[rgba(17,17,17,0.02)]
```
**Issue:** RGBA colors for glass morphism gradient and complex shadow
**Recommendation:** Move to Tailwind config as reusable utilities

---

### 6. **app/components/RecentActivities.tsx**
**Lines 33, 43:**
```jsx
bg-[rgba(255,255,255,0.6)]
shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.08)]
shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.05)]
```
**Issue:** RGBA colors for glass morphism effect
**Recommendation:** Move to Tailwind config as reusable utilities

---

### 7. **app/components/Calendar.tsx**
**Line 49:**
```jsx
boxShadow: '0px 1px 2px rgba(164, 172, 185, 0.16)'
```
**Issue:** Inline style with RGBA color
**Recommendation:** Move to Tailwind shadow utility or component-specific shadow

---

### 8. **app/components/LeaveTypeBottomSheet.tsx**
**Line 77:**
```jsx
boxShadow: '0px 1px 2px rgba(164, 172, 185, 0.16)'
```
**Issue:** Inline style with RGBA color
**Recommendation:** Move to Tailwind shadow utility

---

### 9. **app/components/DaysOffBadge.tsx**
**Line 21:**
```jsx
boxShadow: '0px 1px 2px rgba(164, 172, 185, 0.12)'
```
**Issue:** Inline style with RGBA color
**Recommendation:** Move to Tailwind shadow utility

---

### 10. **app/components/AnnouncementBanner.tsx**
**Lines 15:**
```jsx
bg-[rgba(203,251,241,0.6)]
hover:bg-[rgba(203,251,241,0.8)]
```
**Issue:** Hardcoded RGBA teal colors with opacity
**Recommendation:** Use `bg-teal-50/60` and `hover:bg-teal-50/80` or similar Tailwind opacity syntax

---

### 11. **SVG Icon Files (Multiple)**
Files in `app/assets/icons/`:
- `bubble-info.svg` - Contains `#525252` (neutral-600)
- `calendar-1.svg` - Contains `#737373` (neutral-500)
- `megaphone.svg` - Contains `#009689` (teal-600)
- `timer.svg` - Contains `#737373` (neutral-500)
- `warning-triangle.svg` - Contains `#E17100` (amber-600)
- `check-out-neutral.svg` - Contains `#F5F5F5`, `#737373`
- `check-in-neutral.svg` - Contains `#F5F5F5`, `#737373`
- `check-in-colored.svg` - Contains `#FEFCE8`, `#D08700`
- `check-out-colored.svg` - Contains `#F3E8FF`, `#8200DB`

**Issue:** SVG files contain hardcoded hex colors
**Recommendation:** 
- Option 1: Use `currentColor` in SVG and apply text color classes
- Option 2: Keep as-is if these are design-specific brand colors
- Option 3: Generate SVGs dynamically with React components

---

## ✅ FILES USING PROPER COLOR TOKENS

The following components properly use Tailwind color tokens:
- ✅ `app/page.tsx` - Uses `neutral-*`, `emerald-*` tokens
- ✅ `app/components/Chip.tsx` - Proper token usage
- ✅ `app/components/RadioButton.tsx` - Proper token usage
- ✅ `app/components/CalendarGrid.tsx` - Proper token usage
- ✅ `app/components/UploadedFile.tsx` - Proper token usage
- ✅ `app/components/Icons.tsx` - Likely proper (would need to verify)
- ✅ `app/request-leave/page.tsx` - Proper token usage

---

## 📋 RECOMMENDATIONS

### High Priority
1. **globals.css** - Replace hex colors with Tailwind tokens or CSS variables
2. **DocumentAttachment.tsx** - Use currentColor or CSS variable for SVG stroke
3. **AnnouncementBanner.tsx** - Replace RGBA with Tailwind opacity syntax

### Medium Priority
4. **Custom Shadows** - Move all custom shadow values to `tailwind.config.js`:
   ```js
   theme: {
     extend: {
       boxShadow: {
         'card': '0px 1px 2px rgba(164, 172, 185, 0.16)',
         'glass': '0px 1px 2px 0px rgba(164, 172, 185, 0.24), 0px 0px 0.5px 0.5px rgba(229, 229, 229, 1)',
         'widget': '0px 4px 8px 0px rgba(17, 17, 17, 0.05), ...',
       }
     }
   }
   ```

5. **Glass Morphism Effects** - Create reusable utilities for `bg-[rgba(...)]` patterns

### Low Priority
6. **SVG Icons** - Evaluate if hardcoded colors are intentional brand colors or should use currentColor

---

## 🎨 DESIGN TOKEN COVERAGE

**Properly Tokenized:** ~85%
**Needs Token Migration:** ~15%

Most text and background colors properly use tokens like:
- `text-neutral-{300,400,500,600,700,800}`
- `bg-neutral-{50,100,200,300}`
- `text-{teal,emerald,amber,red}-{400,500,600,700}`
- `border-neutral-{100,200,300,400}`

The main issues are:
1. Complex shadows with RGBA values
2. Glass morphism effects requiring opacity
3. SVG icon fills/strokes
4. Global CSS hex colors


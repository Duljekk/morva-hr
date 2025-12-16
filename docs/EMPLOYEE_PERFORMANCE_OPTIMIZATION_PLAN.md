# Employee-Side Application Performance Optimization Implementation Plan

## Executive Summary

Based on comprehensive analysis of the codebase and performance optimization best practices from Next.js 14+ documentation, this plan outlines a phased approach to optimize the employee-side application performance.

---

## Current State Analysis

### What's Already Implemented
| Pattern | Implementation | Status |
|---------|---------------|--------|
| Server-side caching | `unstable_cache` with 5-10 min TTL | ✅ Good |
| Cache invalidation | `revalidateTag` for targeted invalidation | ✅ Good |
| Component memoization | `memo()`, `useMemo`, `useCallback` | ✅ Partial |
| Refs for stable values | Using `useRef` to prevent re-renders | ✅ Good |
| Parallel server queries | `Promise.all` in server actions | ✅ Good |
| Debouncing | Debounced API calls for activities | ✅ Good |

### Identified Performance Issues

| Issue | Severity | Impact |
|-------|----------|--------|
| Monolithic client component (~600 lines) | High | Bundle size, re-renders |
| 4+ independent `useEffect` data fetches on mount | High | Waterfall requests |
| Timer updates every second | Medium | Unnecessary re-renders |
| No lazy loading for modals/bottom sheets | Medium | Initial bundle size |
| No `next/image` optimization | Low | N/A (using SVGs) |
| Missing bundle analyzer | Medium | Unknown bundle hotspots |

---

## Performance Metrics to Track

| Metric | Current Target | Optimized Target | Tool |
|--------|---------------|------------------|------|
| First Contentful Paint (FCP) | < 2.5s | < 1.8s | Lighthouse |
| Largest Contentful Paint (LCP) | < 3.5s | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 4.0s | < 3.0s | Lighthouse |
| Total Blocking Time (TBT) | < 300ms | < 200ms | Lighthouse |
| Initial JS Bundle | Unknown | Reduce by 30% | Bundle Analyzer |
| Component Re-renders | Untracked | Minimize | React DevTools |

---

## Implementation Plan

### Phase 1: Quick Wins (1-2 days)
**Priority: High | Effort: Low | Impact: High**

#### 1.1 Parallel Client-Side Data Fetching
**Current:** 4 independent `useEffect` hooks making sequential API calls
**Solution:** Consolidate into single `useEffect` with `Promise.all`

```tsx
// Before: 4 separate useEffects
useEffect(() => { loadAttendance(); }, []);
useEffect(() => { loadAnnouncements(); }, []);
useEffect(() => { loadActiveLeaveStatus(); }, []);
useEffect(() => { loadRecentActivities(); }, []);

// After: Single parallel fetch
useEffect(() => {
  async function loadInitialData() {
    const [attendance, announcements, leaveStatus, activities] = await Promise.all([
      getTodaysAttendance(),
      getActiveAnnouncements(),
      hasActiveLeaveRequest(),
      getRecentActivities(3),
    ]);
    // Batch state updates
    setCheckInDateTime(attendance.data?.check_in_time ? new Date(attendance.data.check_in_time) : null);
    // ... other state updates
  }
  loadInitialData();
}, []);
```

**Expected Improvement:** 40-60% reduction in initial data loading time

#### 1.2 Optimize Timer Updates
**Current:** Updates state every second using `requestAnimationFrame` + `setInterval`
**Solution:** Reduce update frequency based on widget state

```tsx
// Only update every 10 seconds when not actively timing
// Update every second only during active check-in session
const updateInterval = isCheckedIn ? 1000 : 10000;
```

**Expected Improvement:** 90% reduction in timer-related re-renders when inactive

#### 1.3 Add Bundle Analyzer
```bash
npm install @next/bundle-analyzer --save-dev
```

```ts
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
```

---

### Phase 2: Component Architecture (3-4 days)
**Priority: High | Effort: Medium | Impact: High**

#### 2.1 Split Monolithic Page Component
**Current:** `app/(employee)/page.tsx` is ~600 lines with 15+ state variables
**Solution:** Extract into focused sub-components

```
app/(employee)/
├── page.tsx (Server Component - layout only)
├── _components/
│   ├── EmployeeDashboardClient.tsx (Client wrapper)
│   ├── CheckInSection.tsx (Check-in widget + state)
│   ├── AttendanceLogSection.tsx (Attendance cards)
│   ├── ActivitiesSection.tsx (Recent activities)
│   └── AnnouncementSection.tsx (Announcement banner)
```

#### 2.2 Lazy Load Modal Components
**Current:** All modals imported statically
**Solution:** Dynamic imports with `next/dynamic`

```tsx
const LeaveRequestDetailsModal = dynamic(
  () => import('@/components/employee/LeaveRequestDetailsModal'),
  { loading: () => null }
);

const AnnouncementBottomSheet = dynamic(
  () => import('@/components/shared/AnnouncementBottomSheet'),
  { loading: () => null }
);
```

**Expected Improvement:** 15-25% reduction in initial bundle size

#### 2.3 Convert Static Sections to Server Components
Identify sections that don't need interactivity and render server-side:
- Header section (user name, date)
- Section headers

---

### Phase 3: Data Fetching Optimization (2-3 days)
**Priority: Medium | Effort: Medium | Impact: Medium**

#### 3.1 Implement SWR/React Query for Client-Side Caching
Consider adding client-side data caching with automatic revalidation:

```tsx
// Using SWR pattern (already in project patterns)
const { data: attendance, isLoading } = useSWR(
  'attendance',
  getTodaysAttendance,
  { revalidateOnFocus: false, revalidateOnReconnect: true }
);
```

#### 3.2 Preload Critical Data
Use route prefetching and data preloading:

```tsx
// In layout or parent component
import { preload } from 'react-dom';
preload('/api/attendance', { as: 'fetch' });
```

#### 3.3 Implement Skeleton Loading States
Add proper skeleton components for initial load:

```tsx
<Suspense fallback={<CheckInWidgetSkeleton />}>
  <CheckInSection />
</Suspense>
```

---

### Phase 4: Advanced Optimizations (3-4 days)
**Priority: Medium | Effort: High | Impact: Medium**

#### 4.1 Implement Partial Prerendering (Next.js 14.1+)
Enable PPR for static shell with dynamic content:

```tsx
// next.config.ts
experimental: {
  ppr: true,
}

// page.tsx - Static shell
export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen">
      <Header /> {/* Static */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DynamicContent /> {/* Dynamic */}
      </Suspense>
    </div>
  );
}
```

#### 4.2 Optimize Icon Imports-
**Current:** All SVG icons imported individually via SVGR
**Solution:** Create icon sprite or lazy load icons

```tsx
// Icon sprite approach
export const IconSprite = () => (
  <svg style={{ display: 'none' }}>
    <symbol id="check-in" viewBox="0 0 24 24">...</symbol>
    <symbol id="check-out" viewBox="0 0 24 24">...</symbol>
  </svg>
);

// Usage
<use href="#check-in" />
```

#### 4.3 Implement Service Worker Caching
Enhance existing service worker with route caching:

```js
// sw.js
const CACHE_NAME = 'morva-v1';
const ROUTES_TO_CACHE = ['/', '/notifications', '/request-leave'];
```

---

### Phase 5: Monitoring & Continuous Improvement (Ongoing)
**Priority: Low | Effort: Low | Impact: High (Long-term)**

#### 5.1 Set Up Performance Monitoring
```bash
# Add to package.json
"analyze": "ANALYZE=true next build"
```

#### 5.2 Add React DevTools Profiler Checks
Document and track component render frequencies.

#### 5.3 Implement Core Web Vitals Tracking
Use Next.js built-in web vitals reporting:

```tsx
// app/layout.tsx
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
}
```

---

## Timeline Summary

| Phase | Duration | Dependencies | Resources |
|-------|----------|--------------|-----------|
| Phase 1: Quick Wins | 1-2 days | None | 1 developer |
| Phase 2: Component Architecture | 3-4 days | Phase 1 | 1 developer |
| Phase 3: Data Fetching | 2-3 days | Phase 2 | 1 developer |
| Phase 4: Advanced | 3-4 days | Phase 3 | 1 developer |
| Phase 5: Monitoring | Ongoing | All phases | Team |

**Total Initial Implementation:** ~10-13 days

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| Breaking existing functionality | Implement changes incrementally with tests |
| Regression in UX | A/B test optimizations before full rollout |
| Over-optimization | Measure before and after each change |
| Bundle size increase from new packages | Audit all new dependencies |

---

## Success Criteria

1. **LCP < 2.5s** on 3G network simulation
2. **TTI < 3.0s** on mid-tier mobile devices
3. **Initial JS bundle reduced by 25%+**
4. **No performance regressions** in Lighthouse scores
5. **Component re-render count reduced by 50%+** (measured via React DevTools)

---

## Recommended Starting Point

**Start with Phase 1.1 (Parallel Data Fetching)** as it provides the highest impact with lowest risk. This single change can reduce initial load time by 40-60% without architectural changes.

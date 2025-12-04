/**
 * Employee Dashboard Page (Server Component)
 * 
 * PERFORMANCE OPTIMIZATION: Partial Prerendering (PPR)
 * 
 * This architecture provides:
 * - Static shell prerendered at build time (instant delivery)
 * - Dynamic content streams in via Suspense boundaries
 * - Faster First Contentful Paint (FCP) - static shell shows immediately
 * - Better Core Web Vitals scores - LCP from prerendered content
 * - Progressive enhancement - content appears as it loads
 * 
 * How PPR works:
 * 1. At build time, Next.js prerenders the static shell (DashboardShell)
 * 2. Dynamic content (EmployeeDashboardClient) is replaced with a "hole"
 * 3. On request, static shell is served instantly from CDN
 * 4. Dynamic content streams in and fills the hole
 */

import { Suspense } from 'react';
import DashboardShell from './_components/DashboardShell';
import EmployeeDashboardClient from './_components/EmployeeDashboardClient';
import DashboardSkeleton from '@/components/employee/DashboardSkeleton';

export default function EmployeeDashboardPage() {
  return (
    <DashboardShell>
      {/* Suspense boundary creates a "dynamic hole" in the prerendered page */}
      {/* The skeleton is embedded in the static HTML and shown instantly */}
      {/* EmployeeDashboardClient streams in when ready */}
      <Suspense fallback={<DashboardSkeleton />}>
        <EmployeeDashboardClient />
      </Suspense>
    </DashboardShell>
  );
}

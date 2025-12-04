'use client';

/**
 * Dashboard Data Preloader Component
 * 
 * PERFORMANCE OPTIMIZATION: Triggers data preloading on mount
 * 
 * This component renders nothing but triggers preloading of dashboard data
 * when mounted. It's designed to be placed in layouts or parent components
 * to warm the SWR cache before the dashboard renders.
 * 
 * Usage:
 * - Add to employee layout to preload on any employee route
 * - Add to login success redirect to preload before navigation
 */

import { useEffect, useRef } from 'react';
import { preloadDashboardData } from './preloadDashboardData';

interface PreloadDashboardProps {
  /**
   * If true, preload is triggered immediately on mount.
   * If false, preloading is deferred until the browser is idle.
   */
  immediate?: boolean;
}

export default function PreloadDashboard({ immediate = false }: PreloadDashboardProps) {
  const hasPreloaded = useRef(false);

  useEffect(() => {
    // Only preload once
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;

    if (immediate) {
      // Preload immediately
      preloadDashboardData().catch(console.error);
    } else {
      // Defer preloading to when browser is idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          preloadDashboardData().catch(console.error);
        }, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          preloadDashboardData().catch(console.error);
        }, 100);
      }
    }
  }, [immediate]);

  // Render nothing - this is a side-effect-only component
  return null;
}

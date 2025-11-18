'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrentTimeContextType {
  now: Date;
  // Throttled time that updates less frequently for non-critical displays
  throttledTime: Date;
}

const CurrentTimeContext = createContext<CurrentTimeContextType | undefined>(undefined);

interface CurrentTimeProviderProps {
  children: ReactNode;
  // Update frequency for critical time (default: 1000ms = 1 second)
  criticalUpdateInterval?: number;
  // Update frequency for throttled time (default: 60000ms = 1 minute)
  throttledUpdateInterval?: number;
}

/**
 * Provides current time to components
 * Separates critical time updates (for clock display) from throttled updates (for calculations)
 * This prevents unnecessary re-renders of components that don't need second-by-second updates
 */
export function CurrentTimeProvider({ 
  children,
  criticalUpdateInterval = 1000,
  throttledUpdateInterval = 60000
}: CurrentTimeProviderProps) {
  const [now, setNow] = useState(new Date());
  const [throttledTime, setThrottledTime] = useState(new Date());

  // Critical time updates (for clock display, shift calculations)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, criticalUpdateInterval);

    return () => clearInterval(interval);
  }, [criticalUpdateInterval]);

  // Throttled time updates (for date formatting, non-critical calculations)
  useEffect(() => {
    const interval = setInterval(() => {
      setThrottledTime(new Date());
    }, throttledUpdateInterval);

    return () => clearInterval(interval);
  }, [throttledUpdateInterval]);

  return (
    <CurrentTimeContext.Provider value={{ now, throttledTime }}>
      {children}
    </CurrentTimeContext.Provider>
  );
}

export function useCurrentTime() {
  const context = useContext(CurrentTimeContext);
  if (context === undefined) {
    throw new Error('useCurrentTime must be used within a CurrentTimeProvider');
  }
  return context;
}


'use client';

import { useState, useEffect, memo } from 'react';

interface ClockDisplayProps {
  className?: string;
  updateFrequency?: number; // milliseconds, default 1000
}

/**
 * Optimized clock display component that only re-renders itself
 * Uses requestAnimationFrame for smoother updates when needed
 */
const ClockDisplay = memo(function ClockDisplay({ 
  className = '',
  updateFrequency = 1000 
}: ClockDisplayProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Use setInterval for standard clock updates
    // For smoother animations, consider requestAnimationFrame with throttling
    const interval = setInterval(() => {
      setTime(new Date());
    }, updateFrequency);

    return () => clearInterval(interval);
  }, [updateFrequency]);

  const formattedTime = time.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  return (
    <span className={className}>
      {formattedTime}
    </span>
  );
});

ClockDisplay.displayName = 'ClockDisplay';

export default ClockDisplay;


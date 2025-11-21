import { useRef, useCallback } from 'react';

interface UseSwipeToDismissOptions {
  onDismiss: () => void;
  threshold?: number; // Minimum distance in pixels to trigger dismiss
  velocityThreshold?: number; // Minimum velocity in px/ms to trigger dismiss
  enabled?: boolean; // Whether swipe is enabled
}

interface TouchState {
  startY: number;
  startTime: number;
  currentY: number;
  isDragging: boolean;
}

/**
 * Hook for implementing swipe-to-dismiss functionality on bottom sheets
 * 
 * @param options Configuration options
 * @returns Object with refs and handlers to attach to the bottom sheet element
 */
export function useSwipeToDismiss({
  onDismiss,
  threshold = 100, // Default: 100px
  velocityThreshold = 0.3, // Default: 0.3 px/ms
  enabled = true,
}: UseSwipeToDismissOptions) {
  const touchState = useRef<TouchState | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!enabled) return;
      
      const touch = e.touches[0];
      const target = e.target as HTMLElement;
      
      // Check if touch started on a scrollable element
      const scrollableElement = target.closest('[data-scrollable]') || 
                                (target.closest('.overflow-y-auto') || 
                                 target.closest('.overflow-auto'));
      
      // If touch started on scrollable content, check if it's at the top
      if (scrollableElement) {
        const scrollTop = (scrollableElement as HTMLElement).scrollTop;
        // Only allow swipe-to-dismiss if scrolled to top (within 5px tolerance)
        if (scrollTop > 5) {
          return;
        }
      }
      
      touchState.current = {
        startY: touch.clientY,
        startTime: Date.now(),
        currentY: touch.clientY,
        isDragging: false,
      };
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!enabled || !touchState.current) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - touchState.current.startY;
      const target = e.target as HTMLElement;
      
      // Check if touch is on a scrollable element
      const scrollableElement = target.closest('[data-scrollable]') || 
                                (target.closest('.overflow-y-auto') || 
                                 target.closest('.overflow-auto'));
      
      // If we're on scrollable content, check scroll position
      if (scrollableElement) {
        const scrollTop = (scrollableElement as HTMLElement).scrollTop;
        // If content is scrolled down, allow normal scrolling
        if (scrollTop > 0 && deltaY < 0) {
          // User is scrolling up, don't interfere
          return;
        }
        // If content is at top and user swipes down, allow dismiss
        if (scrollTop === 0 && deltaY > 0) {
          // Prevent default scrolling to allow sheet dismissal
          e.preventDefault();
        } else if (scrollTop > 0) {
          // Content is scrolled, don't interfere with scrolling
          return;
        }
      }

      // Only allow downward swipes
      if (deltaY > 0) {
        touchState.current.currentY = touch.clientY;
        touchState.current.isDragging = true;

        // Prevent scrolling if we're dragging the sheet down
        if (deltaY > 10) {
          e.preventDefault();
        }

        // Apply transform to the sheet
        if (sheetRef.current) {
          const translateY = Math.max(0, deltaY);
          sheetRef.current.style.transform = `translateY(${translateY}px)`;
          sheetRef.current.style.transition = 'none';
        }
      }
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !touchState.current) return;

    const state = touchState.current;
    const deltaY = state.currentY - state.startY;
    const deltaTime = Date.now() - state.startTime;
    const velocity = deltaTime > 0 ? Math.abs(deltaY) / deltaTime : 0;

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transition = '';
    }

    // Check if we should dismiss
    const shouldDismiss =
      state.isDragging &&
      deltaY > 0 &&
      (deltaY > threshold || velocity > velocityThreshold);

    if (shouldDismiss) {
      // Animate out and dismiss
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(100%)`;
        sheetRef.current.style.transition = 'transform 0.3s ease-out';
        
        // Wait for animation to complete before dismissing
        setTimeout(() => {
          onDismiss();
          // Reset transform after dismissal
          if (sheetRef.current) {
            sheetRef.current.style.transform = '';
            sheetRef.current.style.transition = '';
          }
        }, 300);
      } else {
        onDismiss();
      }
    } else {
      // Snap back to original position
      if (sheetRef.current) {
        sheetRef.current.style.transform = '';
        sheetRef.current.style.transition = 'transform 0.2s ease-out';
      }
    }

    touchState.current = null;
  }, [enabled, threshold, velocityThreshold, onDismiss]);

  const setSheetRef = useCallback((node: HTMLDivElement | null) => {
    sheetRef.current = node;
  }, []);

  return {
    sheetRef: setSheetRef,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}


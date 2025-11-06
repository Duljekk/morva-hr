'use client';

import { useEffect } from 'react';

export default function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const { style } = document.body;
    const originalOverflow = style.overflow;
    const originalPaddingRight = style.paddingRight;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      style.overflow = originalOverflow;
      style.paddingRight = originalPaddingRight;
    };
  }, [locked]);
}


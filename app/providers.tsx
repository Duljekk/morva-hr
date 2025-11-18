'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ToastProvider } from '@/app/contexts/ToastContext';

/**
 * Client component wrapper for all providers
 * Following Context7 best practices:
 * - Separates server and client components properly
 * - Prevents hydration mismatches
 * - Ensures proper provider nesting order
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}


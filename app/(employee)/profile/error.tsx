'use client';

/**
 * Profile Page Error Boundary
 * 
 * Next.js error boundary for handling runtime errors on the profile page.
 * Provides a user-friendly error message with retry functionality.
 * 
 * Requirements: 7.5
 */

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[ProfilePage] Runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-lg font-semibold text-neutral-800">
          Something went wrong
        </h2>

        {/* Error Message */}
        <p className="text-sm text-neutral-500">
          We couldn&apos;t load your profile. Please try again.
        </p>

        {/* Retry Button */}
        <button
          onClick={reset}
          className="mt-2 px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

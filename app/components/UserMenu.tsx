'use client';

import { useAuth } from '@/lib/auth/AuthContext';

/**
 * User menu component that displays user info and sign out button
 * Add this to your homepage or navigation
 */
export default function UserMenu() {
  const { profile, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Use window.location.replace for a hard redirect that clears all state
      // Small delay to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 150));
      window.location.replace('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force redirect even on error
      window.location.replace('/login');
    }
  };

  if (loading || !profile) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-neutral-800">
          {profile.full_name}
        </p>
        <p className="text-xs text-neutral-500 capitalize">
          {profile.role.replace('_', ' ')}
        </p>
      </div>
      <button
        onClick={handleSignOut}
        className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
      >
        Sign Out
      </button>
    </div>
  );
}


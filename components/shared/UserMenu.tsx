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
      console.log('[UserMenu] Starting logout...');
      await signOut();
      console.log('[UserMenu] Logout complete, redirecting...');
      // Delay to ensure server-side cookies are fully cleared before redirect
      // This prevents middleware from seeing the user as still authenticated
      await new Promise(resolve => setTimeout(resolve, 300));
      // Use window.location.replace for a hard redirect that clears all state
      // Best Practice: Add logout=true flag to prevent middleware redirect loops
      window.location.replace('/login?logout=true');
    } catch (error) {
      console.error('[UserMenu] Error during sign out:', error);
      // Delay even on error to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 300));
      // Force redirect even on error
      window.location.replace('/login?logout=true');
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


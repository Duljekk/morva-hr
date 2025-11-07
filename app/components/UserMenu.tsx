'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * User menu component that displays user info and sign out button
 * Add this to your homepage or navigation
 */
export default function UserMenu() {
  const { profile, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
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


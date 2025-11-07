/**
 * Example components demonstrating authentication usage
 * These are not used in the app but serve as reference examples
 */

'use client';

import { useAuth, useRequireAuth } from './AuthContext';
import { isHRAdmin, getUserDisplayName, getUserInitials } from './utils';

// Example 1: Basic authentication check
export function BasicAuthExample() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {getUserDisplayName(profile)}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {profile?.role}</p>
    </div>
  );
}

// Example 2: Protected component (auto-redirects if not authenticated)
export function ProtectedComponentExample() {
  const { profile } = useRequireAuth();

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only authenticated users see this.</p>
      <p>Hello, {profile?.full_name}!</p>
    </div>
  );
}

// Example 3: Role-based rendering
export function RoleBasedExample() {
  const { profile } = useAuth();

  return (
    <div>
      {isHRAdmin(profile) ? (
        <div>
          <h2>HR Admin Dashboard</h2>
          <p>You have admin access</p>
          {/* Admin-only features */}
        </div>
      ) : (
        <div>
          <h2>Employee Dashboard</h2>
          <p>Welcome, employee!</p>
          {/* Employee features */}
        </div>
      )}
    </div>
  );
}

// Example 4: User avatar with initials
export function UserAvatarExample() {
  const { profile } = useAuth();

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold"
      title={getUserDisplayName(profile)}
    >
      {getUserInitials(profile)}
    </div>
  );
}

// Example 5: Sign out button
export function SignOutButtonExample() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}

// Example 6: Conditional navigation
export function NavigationExample() {
  const { profile } = useAuth();

  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/attendance">Attendance</a></li>
        <li><a href="/request-leave">Request Leave</a></li>
        
        {/* Admin-only link */}
        {isHRAdmin(profile) && (
          <li><a href="/admin">Admin Panel</a></li>
        )}
      </ul>
    </nav>
  );
}

// Example 7: Loading state handling
export function LoadingStateExample() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return user ? <div>Authenticated content</div> : <div>Public content</div>;
}

// Example 8: Fetch user-specific data
export function UserDataExample() {
  const { profile } = useAuth();

  // Example: Only show data for the authenticated user
  const shiftHours = profile
    ? `${profile.shift_start_hour}:00 - ${profile.shift_end_hour}:00`
    : 'Not available';

  return (
    <div>
      <h3>Your Shift</h3>
      <p>{shiftHours}</p>
      <p>Employee ID: {profile?.employee_id || 'N/A'}</p>
    </div>
  );
}


# Authentication System

This directory contains the authentication system for MorvaHR, built with Supabase Auth and Next.js App Router.

## Overview

The authentication system provides:
- Email/password authentication via Supabase
- User profile management with role-based access (employee, hr_admin)
- Protected routes via middleware
- React Context for easy auth state access
- TypeScript support with full type safety

## Architecture

### Components

1. **AuthContext.tsx** - React Context Provider for authentication state
2. **utils.ts** - Helper functions for auth-related operations
3. **../supabase/client.ts** - Supabase client for Client Components
4. **../supabase/server.ts** - Supabase client for Server Components
5. **../../middleware.ts** - Route protection middleware

## Usage

### Basic Authentication

#### In Client Components

```tsx
'use client';

import { useAuth } from '@/lib/auth/AuthContext';

export default function MyComponent() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name}!</h1>
      <p>Role: {profile?.role}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

#### Require Authentication

```tsx
'use client';

import { useRequireAuth } from '@/lib/auth/AuthContext';

export default function ProtectedComponent() {
  // Automatically redirects to /login if not authenticated
  const { profile } = useRequireAuth();

  return <div>Welcome, {profile?.full_name}!</div>;
}
```

#### Check User Roles

```tsx
import { useAuth } from '@/lib/auth/AuthContext';
import { isHRAdmin } from '@/lib/auth/utils';

export default function AdminFeature() {
  const { profile } = useAuth();

  if (!isHRAdmin(profile)) {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

### Server-Side Authentication

#### In Server Components

```tsx
import { createClient } from '@/lib/supabase/server';

export default async function ServerComponent() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return <div>Welcome, {profile?.full_name}!</div>;
}
```

#### In Server Actions

```tsx
'use server';

import { createClient } from '@/lib/supabase/server';

export async function myServerAction() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Perform authenticated action
  // ...
}
```

### Sign In

```tsx
'use client';

import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Sign in failed:', error);
    } else {
      // Redirect or update UI
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Sign Out

```tsx
'use client';

import { useAuth } from '@/lib/auth/AuthContext';

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <button onClick={signOut}>
      Sign Out
    </button>
  );
}
```

## AuthContext API

### State

- `user: User | null` - Supabase auth user object
- `profile: UserProfile | null` - Extended user profile from database
- `session: Session | null` - Current auth session
- `loading: boolean` - Loading state

### Methods

- `signIn(email, password)` - Sign in with email and password
- `signOut()` - Sign out current user
- `refreshProfile()` - Refresh user profile from database

### UserProfile Type

```typescript
interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'employee' | 'hr_admin';
  employee_id: string | null;
  shift_start_hour: number;
  shift_end_hour: number;
}
```

## Utility Functions

Located in `utils.ts`:

- `isHRAdmin(profile)` - Check if user is HR admin
- `isEmployee(profile)` - Check if user is employee
- `getShiftHours(profile)` - Get user's shift hours
- `getUserDisplayName(profile)` - Get formatted display name
- `getUserInitials(profile)` - Get user initials for avatars

## Route Protection

Routes are protected via Next.js middleware (`../../middleware.ts`):

- **Default**: All routes are protected (require authentication)
- `/login` - Public route (redirects to `/` if already authenticated)

**How it works:**
- Any route NOT in the `publicRoutes` array requires authentication
- Unauthenticated users are automatically redirected to `/login`
- Authenticated users trying to access `/login` are redirected to `/`

To add more public routes, add them to the `publicRoutes` array in `middleware.ts`.

## Environment Variables

Required environment variables (see `ENVIRONMENT_SETUP.md`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Notes

1. **Row Level Security (RLS)**: All database tables should have RLS policies enabled in Supabase
2. **Cookie-based sessions**: Sessions are stored in HTTP-only cookies
3. **Middleware refresh**: Middleware automatically refreshes expired sessions
4. **Client/Server separation**: Use appropriate clients for each context

## Testing

To test authentication:

1. Set up your Supabase project and add environment variables
2. Create a test user in Supabase Auth dashboard
3. Navigate to `/login`
4. Sign in with test credentials
5. You should be redirected to `/` with authenticated state

## Troubleshooting

### "Invalid API key" error
- Check that environment variables are set correctly
- Ensure you're using the `anon` key, not the `service_role` key

### User profile not loading
- Verify user exists in `users` table with matching ID
- Check Supabase RLS policies allow reading user data

### Redirects not working
- Clear browser cookies
- Check middleware configuration
- Verify Next.js App Router setup

### Session not persisting
- Check cookie settings in browser
- Ensure middleware is properly configured
- Verify Supabase URL is correct

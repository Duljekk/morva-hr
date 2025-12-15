'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { isHRAdmin } from '@/lib/auth/utils';
import { useToast } from '@/app/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import FormInput from '@/components/shared/FormInput';
import ButtonLarge from '@/components/shared/ButtonLarge';
import LogoMorvahrIcon from '@/app/assets/icons/logo-morvahr.svg';
import { PeopleIcon, LockIcon, EyeOpenIcon, EyeClosedIcon } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect HR admins to /admin if already authenticated
  useEffect(() => {
    if (!authLoading && profile && isHRAdmin(profile)) {
      router.replace('/admin');
    }
  }, [authLoading, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const identifier = username.trim();
      let emailToUse = identifier;

      // If username doesn't contain @, it's a username - look up the email
      if (identifier && !identifier.includes('@')) {
        const supabase = createClient();
        const { data, error } = await (supabase as any).rpc('get_email_for_username', {
          p_username: identifier,
        });

        if (error || !data) {
          setError('Username not found');
          showToast('danger', 'Login failed', 'Username not found. Please check your credentials and try again.');
          setIsSubmitting(false);
          return;
        }

        emailToUse = data as string;
      }

      // Sign in with Supabase using email
      const { error } = await signIn(emailToUse, password);

      if (error) {
        const errorMessage = error.message || 'Invalid login credentials';
        setError(errorMessage);
        showToast('danger', 'Login failed', 'The username or password you entered is incorrect. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Best Practice: Wait for AuthContext to load profile before redirecting
      // This ensures server actions on the destination page can access the user's role
      // The signIn function in AuthContext calls fetchProfile, but it's async
      // We need to wait for the profile to be available
      
      // Fetch user profile directly to get role for redirect
      // This is more reliable than waiting for AuthContext state updates
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('[LoginPage] Error getting user after sign in:', userError);
        setError('Failed to verify authentication. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Fetch user profile to get role
      console.log('[LoginPage] Fetching profile for user:', user.id);
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single<{ role: string }>();

      console.log('[LoginPage] Profile query result:', { userProfile, profileError });

      if (profileError || !userProfile) {
        console.error('[LoginPage] Error fetching user profile:', profileError);
        console.error('[LoginPage] Profile error details:', {
          message: profileError?.message,
          code: profileError?.code,
          details: profileError?.details,
          hint: profileError?.hint,
        });
        setError('Failed to load user profile. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Small delay to ensure cookies are fully propagated to the browser
      // This is important for server-side authentication checks
      await new Promise(resolve => setTimeout(resolve, 300));

      // Redirect based on role
      // Best Practice: Use window.location.href for hard redirect after login
      // This ensures cookies are fully set and server-side auth checks work
      // Hard redirect also ensures a fresh page load with proper authentication state
      if (userProfile.role === 'hr_admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
      
      // Don't set isSubmitting to false here - we're redirecting
      return;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      showToast('danger', 'Error', 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center px-6 py-8">
        {/* Card Container */}
        <div
          className="relative flex w-full max-w-[362px] flex-col items-center justify-center gap-[18px] rounded-[24px] border border-neutral-200 bg-gradient-to-b from-[rgba(255,255,255,0.6)] to-white px-5 pb-10 pt-9"
          style={{
            boxShadow: '0px 2px 4px 0px rgba(15,35,65,0.1), 0px 0px 4px 0.25px rgba(101,101,101,0.04)',
          }}
        >
          {/* Radial Gradient Overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[24px] opacity-30"
            style={{
              background: 'radial-gradient(circle at center top, rgba(0,166,244,1) 0%, rgba(15,172,245,0.9375) 8%, rgba(29,178,247,0.875) 12.5%, rgba(58,189,250,0.75) 16.4%, rgba(116,212,255,0.5) 32.9%, rgba(116,212,255,0.2) 43%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Bottom Inset Shadow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[24px]"
            style={{
              boxShadow: 'inset 0px -6px 0px 0px rgba(38,38,38,0.05)',
            }}
          />

          {/* Illustration Container */}
          <div
            className="relative h-16 w-16 shrink-0 overflow-clip rounded-[14.222px] bg-gradient-to-b from-white to-transparent"
            style={{
              boxShadow: '0px 2px 4px 0px rgba(15,35,65,0.1), 0px 0px 4px 0.25px rgba(101,101,101,0.04)',
            }}
          >
            {/* Logo positioned absolutely */}
            <div className="absolute left-3 top-3 h-10 w-10">
              <LogoMorvahrIcon className="h-full w-full" />
            </div>
            {/* Inner shadow */}
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 3px 3px 2px 0px rgba(223,223,223,0.12)' }} />
          </div>

          {/* Content Section */}
          <div className="relative z-10 flex w-full flex-col items-center">
            {/* Welcome Section */}
            <div className="mb-8 flex w-full max-w-[297px] flex-col items-center gap-1 text-center">
              <h1 className="text-xl font-semibold leading-bold-xl text-neutral-800">
                Welcome to MorvaHR!
              </h1>
              <p className="text-sm font-normal leading-regular-sm text-neutral-600">
                Your personal dashboard is just a login away. Let&apos;s get your day started.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex w-full max-w-[322px] flex-col">
              {/* Form Inputs Section */}
              <div className="flex flex-col gap-3">
                {/* Username Input (Email) */}
                <FormInput
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  hasLeadIcon={true}
                  LeadIcon={<PeopleIcon className="text-neutral-500" />}
                  type="text"
                  bgColor="white"
                  required
                  disabled={isSubmitting}
                />

                {/* Password Input */}
                <FormInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  hasLeadIcon={true}
                  hasTrailIcon={true}
                  LeadIcon={<LockIcon className="text-neutral-500" />}
                  TrailIcon={showPassword ? <EyeOpenIcon className="text-neutral-500" /> : <EyeClosedIcon className="text-neutral-500" />}
                  onTrailIconClick={togglePasswordVisibility}
                  type={showPassword ? 'text' : 'password'}
                  bgColor="white"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Log In Button */}
              <ButtonLarge
                type="submit"
                variant="primary"
                className="mt-8"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Log In
              </ButtonLarge>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

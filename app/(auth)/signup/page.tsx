'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { signup, getInvitationEmail, type SignupFormState } from '@/lib/actions/auth/signup';
import { useToast } from '@/app/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import FormInput from '@/components/shared/FormInput';
import ButtonLarge from '@/components/shared/ButtonLarge';
import LogoMorvahrIcon from '@/app/assets/icons/logo-morvahr.svg';
import { AtIcon, MailIcon, LockIcon, EyeOpenIcon, EyeClosedIcon, PeopleIcon } from '@/components/icons';

/**
 * Sign Up Page Component
 * 
 * User registration page based on Figma design node 634:3310.
 * Similar structure to the login page with additional form fields.
 * 
 * Features:
 * - Username input
 * - Full name input
 * - Email input (disabled, pre-filled from invitation)
 * - Password input with visibility toggle
 * - Confirm password input with visibility toggle
 * - Sign Up button
 * 
 * Layout specifications from Figma:
 * - Card width: 362px max
 * - Gap between elements: 18px
 * - Form inputs gap: 12px
 * - Padding: 20px horizontal, 36px top, 40px bottom
 * - Border radius: 24px
 * - Gradient background with radial overlay
 */
export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Get token_hash and type from URL
  const tokenHash = searchParams?.get('token_hash') || '';
  const type = searchParams?.get('type') || '';

  // Use server action with useActionState
  const [state, formAction, isPending] = useActionState<SignupFormState, FormData>(
    signup,
    { errors: {}, message: undefined }
  );

  // Check passwords match in real-time
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  // Fetch user email from token on mount
  useEffect(() => {
    async function fetchUserEmail() {
      if (!tokenHash || type !== 'invite') {
        showToast('danger', 'Invalid Invitation', 'This signup link is invalid. Please use the link from your invitation email.');
        router.replace('/login');
        return;
      }

      try {
        // Use server action to verify token and get email
        const result = await getInvitationEmail(tokenHash);
        
        if (!result.success || !result.email) {
          showToast('danger', 'Invalid Token', result.error || 'Your invitation link is invalid or has expired. Please contact HR for a new invitation.');
          router.replace('/login');
          return;
        }

        // Set email from server action result
        setEmail(result.email);
        setLoading(false);
      } catch (err) {
        console.error('[SignupPage] Unexpected error:', err);
        showToast('danger', 'Error', 'An unexpected error occurred. Please try again.');
        router.replace('/login');
      }
    }

    fetchUserEmail();
  }, [tokenHash, type, router, showToast]);

  // Handle successful signup
  useEffect(() => {
    if (state.message && !state.errors?._form) {
      showToast('success', 'Account Created', state.message);
      
      // Wait a bit before signing out and redirecting
      setTimeout(async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.replace('/login?message=Account created successfully. Please sign in.');
        } catch (error) {
          console.error('[SignupPage] Error during post-signup cleanup:', error);
          // Still redirect even if signout fails
          router.replace('/login?message=Account created successfully. Please sign in.');
        }
      }, 500);
    }
  }, [state.message, state.errors, router, showToast]);

  // Show error toasts
  useEffect(() => {
    if (state.errors?._form) {
      showToast('danger', 'Signup Failed', state.errors._form[0]);
    }
  }, [state.errors, showToast]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full bg-white">
        <div className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5DD3] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center px-6 py-8">
        {/* Card Container */}
        <div
          className="relative flex w-full max-w-[362px] flex-col items-center justify-center gap-[18px] rounded-[24px] border border-neutral-200 bg-gradient-to-b from-[rgba(255,255,255,0.6)] to-white px-5 pb-10 pt-9"
          style={{
            boxShadow: '0px 4px 8px 0px rgba(17,17,17,0.05), 0px 2px 4px 0px rgba(17,17,17,0.05), 0px 0px 4px 0px rgba(28,28,28,0.1)',
          }}
          data-name="Sign Up Card"
          data-node-id="634:3310"
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
            data-name="Illustration"
            data-node-id="634:3311"
          >
            {/* Logo positioned absolutely */}
            <div className="absolute left-3 top-3 h-10 w-10">
              <LogoMorvahrIcon className="h-full w-full" />
            </div>
            {/* Inner shadow */}
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 3px 3px 2px 0px rgba(223,223,223,0.12)' }} />
          </div>

          {/* Content Section */}
          <div className="relative z-10 flex w-full flex-col items-center" data-name="Contents" data-node-id="634:3315">
            {/* Welcome Section */}
            <div className="mb-8 flex w-full max-w-[297px] flex-col items-center gap-1 text-center" data-name="Header" data-node-id="634:3316">
              <h1 className="text-xl font-semibold leading-bold-xl text-neutral-800">
                Welcome to MorvaHR!
              </h1>
              <p className="text-sm font-normal leading-regular-sm text-neutral-600">
                You'll be ready to use your dashboard in just a few minutes.
              </p>
            </div>

            {/* Sign Up Form */}
            <form action={formAction} className="flex w-full max-w-[322px] flex-col">
              {/* Hidden fields for token and type */}
              <input type="hidden" name="token_hash" value={tokenHash} />
              <input type="hidden" name="type" value={type} />

              {/* Form Inputs Section */}
              <div className="flex flex-col gap-3" data-name="Input Forms" data-node-id="634:3319">
                {/* Username Input */}
                <FormInput
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  hasLeadIcon={true}
                  LeadIcon={<AtIcon className="text-neutral-500" />}
                  type="text"
                  bgColor="white"
                  required
                  disabled={isPending}
                  data-name="Username"
                  data-node-id="634:3320"
                />
                {state.errors?.username && (
                  <p className="text-sm text-red-600 -mt-2">{state.errors.username[0]}</p>
                )}

                {/* Full Name Input */}
                <FormInput
                  name="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  hasLeadIcon={true}
                  LeadIcon={<PeopleIcon className="text-neutral-500" />}
                  type="text"
                  bgColor="white"
                  required
                  disabled={isPending}
                  data-name="Full Name"
                  data-node-id="634:3324"
                />
                {state.errors?.full_name && (
                  <p className="text-sm text-red-600 -mt-2">{state.errors.full_name[0]}</p>
                )}

                {/* Email Input (Disabled) */}
                <FormInput
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  hasLeadIcon={true}
                  LeadIcon={<MailIcon className="text-neutral-300" />}
                  type="email"
                  bgColor="white"
                  required
                  disabled={true}
                  data-name="Email (Disabled)"
                  data-node-id="634:3328"
                />
                {state.errors?.email && (
                  <p className="text-sm text-red-600 -mt-2">{state.errors.email[0]}</p>
                )}

                {/* Password Input */}
                <FormInput
                  name="password"
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
                  disabled={isPending}
                  data-name="Password"
                  data-node-id="634:3332"
                />
                {state.errors?.password && (
                  <p className="text-sm text-red-600 -mt-2">{state.errors.password[0]}</p>
                )}

                {/* Confirm Password Input */}
                <FormInput
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  hasLeadIcon={true}
                  hasTrailIcon={true}
                  LeadIcon={<LockIcon className="text-neutral-500" />}
                  TrailIcon={showConfirmPassword ? <EyeOpenIcon className="text-neutral-500" /> : <EyeClosedIcon className="text-neutral-500" />}
                  onTrailIconClick={toggleConfirmPasswordVisibility}
                  type={showConfirmPassword ? 'text' : 'password'}
                  bgColor="white"
                  required
                  disabled={isPending}
                  data-name="Confirm Password"
                  data-node-id="634:3337"
                />
                {state.errors?.confirm_password && (
                  <p className="text-sm text-red-600 -mt-2">{state.errors.confirm_password[0]}</p>
                )}
                {!passwordsMatch && confirmPassword.length > 0 && (
                  <p className="text-sm text-red-600 -mt-2">Passwords don't match</p>
                )}
              </div>

              {/* Sign Up Button */}
              <ButtonLarge
                type="submit"
                variant="primary"
                className="mt-8"
                disabled={isPending || !passwordsMatch}
                isLoading={isPending}
                data-node-id="634:3342"
              >
                Sign Up
              </ButtonLarge>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

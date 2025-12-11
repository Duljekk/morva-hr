'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getDefaultRedirectPath } from '@/lib/middleware/permissions';
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
  const { profile, loading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('abdulzakisr@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect authenticated users away from signup page
  useEffect(() => {
    if (!authLoading && profile) {
      // User is logged in, redirect to their default dashboard
      const redirectPath = getDefaultRedirectPath(profile.role as any);
      router.replace(redirectPath);
    }
  }, [authLoading, profile, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement sign up logic
    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        console.error('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      // Add sign up logic here
      console.log('Sign up:', { username, fullName, email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login or dashboard
      // router.push('/login');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="flex w-full max-w-[322px] flex-col">
              {/* Form Inputs Section */}
              <div className="flex flex-col gap-3" data-name="Input Forms" data-node-id="634:3319">
                {/* Username Input */}
                <FormInput
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  hasLeadIcon={true}
                  LeadIcon={<AtIcon className="text-neutral-500" />}
                  type="text"
                  bgColor="white"
                  required
                  disabled={isSubmitting}
                  data-name="Username"
                  data-node-id="634:3320"
                />

                {/* Full Name Input */}
                <FormInput
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  hasLeadIcon={true}
                  LeadIcon={<PeopleIcon className="text-neutral-500" />}
                  type="text"
                  bgColor="white"
                  required
                  disabled={isSubmitting}
                  data-name="Full Name"
                  data-node-id="634:3324"
                />

                {/* Email Input (Disabled) */}
                <FormInput
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
                  data-name="Password"
                  data-node-id="634:3332"
                />

                {/* Confirm Password Input */}
                <FormInput
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
                  disabled={isSubmitting}
                  data-name="Confirm Password"
                  data-node-id="634:3337"
                />
              </div>

              {/* Sign Up Button */}
              <ButtonLarge
                type="submit"
                variant="primary"
                className="mt-8"
                disabled={isSubmitting}
                isLoading={isSubmitting}
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


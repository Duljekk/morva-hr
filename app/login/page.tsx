'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import FormInput from '../components/FormInput';
import ButtonLarge from '../components/ButtonLarge';
import LogoMorvahrIcon from '@/app/assets/icons/logo-morvahr.svg';
import UserIcon from '@/app/assets/icons/user.svg';
import LockIcon from '@/app/assets/icons/lock.svg';
import EyeOpenIcon from '@/app/assets/icons/eye-open.svg';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setIsSubmitting(false);
          return;
        }

        emailToUse = data as string;
      }

      // Sign in with Supabase using email
      const { error } = await signIn(emailToUse, password);

      if (error) {
        setError(error.message || 'Invalid login credentials');
        setIsSubmitting(false);
        return;
      }

      // Redirect to home on success
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
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
              <h1 className="text-xl font-semibold leading-[30px] tracking-[-0.2px] text-neutral-700">
                Welcome to MorvaHR!
              </h1>
              <p className="text-sm font-normal leading-5 tracking-[-0.07px] text-neutral-600">
                Your personal dashboard is just a login away. Let&apos;s get your day started.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 w-full max-w-[322px] rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-xs text-red-600 text-center">{error}</p>
              </div>
            )}

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
                  LeadIcon={<UserIcon />}
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
                  LeadIcon={<LockIcon />}
                  TrailIcon={<EyeOpenIcon />}
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
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </ButtonLarge>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

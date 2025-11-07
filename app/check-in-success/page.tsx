'use client';

import { useRouter } from 'next/navigation';
import ButtonLarge from '../components/ButtonLarge';
import CheckInClockIcon from '@/app/assets/icons/check-in-clock.svg';
import CheckInBadgeIcon from '@/app/assets/icons/check-in-badge.svg';
import SparkleStarIcon from '@/app/assets/icons/sparkle-star.svg';

export default function CheckInSuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center overflow-visible px-6 py-8">
        {/* Illustration Container - Expanded to prevent clipping */}
        <div className="relative mb-6 h-[200px] w-[200px]">
          {/* Main Circular Background */}
          <div className="absolute inset-0 overflow-hidden rounded-full bg-gradient-to-b from-[rgba(240,249,255,0.6)] to-[#b8e6fe]">
            {/* Main Clock Illustration - Positioned at 52, 52.5 within 200px container */}
            <div className="absolute left-[52px] top-[52.5px] h-24 w-24">
              <CheckInClockIcon className="h-full w-full" />
            </div>
          </div>

          {/* Badge - Positioned at 131, 128.5 within 200px container, outside circular background to prevent clipping */}
          <div className="absolute left-[131px] top-[128.5px] z-10 h-[30px] w-[30px] flex items-center justify-center">
            <CheckInBadgeIcon className="h-full w-full" />
          </div>

          {/* Sparkle Stars - Positioned around the main illustration container */}
          {/* Top Right - 48px */}
          <div className="absolute left-[197.644px] top-[12.5px] h-12 w-12">
            <SparkleStarIcon className="h-full w-full" />
          </div>

          {/* Top Left - 32px */}
          <div className="absolute left-[14.8px] top-[-29.5px] h-8 w-8">
            <SparkleStarIcon className="h-full w-full" />
          </div>

          {/* Bottom Left - 24px */}
          <div className="absolute left-[-2.644px] top-[-0.5px] h-6 w-6">
            <SparkleStarIcon className="h-full w-full" />
          </div>
        </div>

        {/* Text Content */}
        <div className="mb-12 flex w-full max-w-[283px] flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold leading-7 tracking-[-0.24px] text-neutral-700">
            You&apos;re Checked In!
          </h1>
          <div className="flex flex-col items-center text-lg leading-7 tracking-[-0.18px] text-neutral-500">
            <p className="font-normal">You arrived 2 minutes early at</p>
            <p className="font-medium">10:58 AM.</p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-[354px]">
          <ButtonLarge
            onClick={handleContinue}
            variant="primary"
          >
            Continue
          </ButtonLarge>
        </div>
      </div>
    </div>
  );
}


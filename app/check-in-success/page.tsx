'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ButtonLarge from '../components/ButtonLarge';
import CheckInClockIcon from '@/app/assets/icons/check-in-clock.svg';
import CheckInBadgeIcon from '@/app/assets/icons/check-in-badge.svg';
import SparkleStarIcon from '@/app/assets/icons/sparkle-star.svg';
import SparkleStarIcon32px from '@/app/assets/icons/sparkle-star-32px.svg';
import SparkleStarIcon24px from '@/app/assets/icons/sparkle-star-24px.svg';

const SHIFT_START_HOUR = 11;

function CheckInSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [timeMessage, setTimeMessage] = useState<{ text: string; time: string; status?: string } | null>(null);

  useEffect(() => {
    // Get check-in data from URL params
    const timeParam = searchParams.get('time');
    const minutesDiffParam = searchParams.get('minutesDiff');

    if (timeParam) {
      const checkIn = new Date(timeParam);
      setCheckInTime(checkIn);

      // Format time with AM/PM
      const formattedTime = checkIn.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      // Calculate message based on time difference
      if (minutesDiffParam) {
        const minutesDiff = parseInt(minutesDiffParam, 10);
        
        // Helper function to format duration
        const formatDuration = (totalMinutes: number): string => {
          if (totalMinutes === 0) return 'on time';
          if (totalMinutes === 1) return '1 minute';
          if (totalMinutes < 60) return `${totalMinutes} minutes`;
          
          // More than 60 minutes - format as hours and minutes
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          
          if (minutes === 0) {
            return hours === 1 ? '1 hour' : `${hours} hours`;
          } else {
            const hoursText = hours === 1 ? '1 hour' : `${hours} hours`;
            const minutesText = minutes === 1 ? '1 minute' : `${minutes} minutes`;
            return `${hoursText} ${minutesText}`;
          }
        };
        
        if (minutesDiff < 0) {
          // Early
          const minutesEarly = Math.abs(minutesDiff);
          const durationText = formatDuration(minutesEarly);
          setTimeMessage({
            text: `You arrived ${durationText}`,
            status: 'early',
            time: formattedTime,
          });
        } else if (minutesDiff === 0) {
          // On time
          setTimeMessage({
            text: 'You arrived on time at',
            status: 'ontime',
            time: formattedTime,
          });
        } else {
          // Late
          const minutesLate = minutesDiff;
          const durationText = formatDuration(minutesLate);
          setTimeMessage({
            text: `You arrived ${durationText}`,
            status: 'late',
            time: formattedTime,
          });
        }
      } else {
        // Fallback if minutesDiff not provided
        setTimeMessage({
          text: 'You checked in at',
          status: 'ontime',
          time: formattedTime,
        });
      }
    } else {
      // No check-in data, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  const handleContinue = () => {
    router.push('/');
    router.refresh(); // Refresh to update the home page with check-in data
  };

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden">
      {/* Main Content Container */}
      <div className="mx-auto flex h-full w-full max-w-[402px] flex-col items-center overflow-visible px-6 pt-6 pb-32">
        {/* Top Content - Centered */}
        <div className="flex flex-col items-center flex-1 justify-center">
        {/* Illustration Container - Expanded to prevent clipping */}
        <div className="relative mb-6 h-[200px] w-[200px]">
          {/* Main Circular Background */}
          <div className="absolute inset-0 overflow-hidden rounded-full bg-gradient-to-b from-[rgba(240,249,255,0.6)] to-[#b8e6fe]">
            {/* Main Clock Illustration - Positioned at 52, 52.5 within 200px container */}
            <div className="absolute left-[52px] top-[52.5px] h-24 w-24">
              <CheckInClockIcon style={{ width: '96px', height: '96px', display: 'block' }} />
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
            <SparkleStarIcon32px className="h-full w-full" />
          </div>

          {/* Bottom Left - 24px */}
          <div className="absolute left-[-2.644px] top-[-0.5px] h-6 w-6">
            <SparkleStarIcon24px className="h-full w-full" />
          </div>
        </div>

        {/* Text Content */}
          {timeMessage && (
        <div className="mb-12 flex w-full max-w-[283px] flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-semibold leading-7 tracking-[-0.24px] text-neutral-800">
            You&apos;re checked in
          </h1>
          <div className="flex flex-col items-center text-lg leading-7 tracking-[-0.18px] text-neutral-600">
                {timeMessage.status === 'ontime' ? (
                  <>
                    <p className="font-normal break-words">{timeMessage.text}</p>
                    <p className="font-medium break-words">{timeMessage.time}.</p>
                  </>
                ) : (
                  <>
                    <p className="font-normal break-words">{timeMessage.text}</p>
                    <p className="font-normal break-words">
                      {timeMessage.status === 'early' ? 'early' : 'late'} at <span className="font-medium">{timeMessage.time}</span>.
                    </p>
                  </>
                )}
              </div>
          </div>
          )}
        </div>

        {/* Continue Button - Fixed at bottom with 24px spacing */}
        <div className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-[402px] px-6">
          <div className="w-full max-w-[354px] mx-auto">
          <ButtonLarge
            onClick={handleContinue}
            variant="primary"
          >
            Continue
          </ButtonLarge>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function CheckInSuccessPage() {
  return (
    <Suspense fallback={
      <div className="relative h-screen w-full bg-white flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    }>
      <CheckInSuccessContent />
    </Suspense>
  );
}


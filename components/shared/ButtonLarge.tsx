'use client';

import { ButtonHTMLAttributes, ReactNode, useState, useCallback } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '@/app/assets/animations/loader.json';

interface ButtonLargeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  isLoading?: boolean;
}

export default function ButtonLarge({
  children,
  variant = 'primary',
  className = '',
  isLoading = false,
  onClick,
  ...props
}: ButtonLargeProps) {
  // Track pressed state manually to avoid stuck :active state on mobile
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Reset pressed state on click completion
      setIsPressed(false);
      onClick?.(e);
    },
    [onClick]
  );

  const baseClasses =
    'flex h-12 w-full items-center justify-center px-5 py-1.5 text-base font-semibold leading-bold-base transition-all duration-150 select-none touch-manipulation';

  const variantClasses = {
    primary:
      'rounded-[14px] bg-neutral-800 text-white shadow-[inset_0.5px_0.7px_0.4px_0px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0.2px_0px_rgba(0,0,0,0.6)] hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  // Apply pressed styles via state instead of :active pseudo-class
  const pressedClasses =
    isPressed && !isLoading && !props.disabled
      ? variant === 'primary'
        ? 'bg-neutral-900 scale-[0.98]'
        : 'bg-neutral-300 scale-[0.98]'
      : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${pressedClasses} ${className}`}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Lottie animationData={loaderAnimation} loop={true} autoplay={true} style={{ width: 16, height: 16 }} />
        </div>
      ) : (
        children
      )}
    </button>
  );
}


'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode, useState, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import Lottie from 'lottie-react';
import loaderAnimation from '@/app/assets/animations/loader.json';

interface ButtonLargeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'large' | 'medium';
  className?: string;
  isLoading?: boolean;
}

const ButtonLarge = forwardRef<HTMLButtonElement, ButtonLargeProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'large',
      className = '',
      isLoading = false,
      onClick,
      ...props
    },
    ref
  ) => {
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
        setIsPressed(false);
        onClick?.(e);
      },
      [onClick]
    );

    const baseClasses =
      'flex w-full items-center justify-center font-semibold transition-all duration-150 select-none touch-manipulation';

    const sizeClasses = {
      large: 'h-12 px-5 py-1.5 text-base leading-bold-base',
      medium: 'h-10 px-5 text-sm leading-[18px]',
    };

    const variantClasses = {
      primary:
        // 'bg-neutral-800 text-white shadow-[inset_0.5px_0.7px_0.4px_0px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0.2px_0px_rgba(0,0,0,0.6)] hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed',
        'bg-neutral-800 text-white hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary:
        'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const radiusClasses = {
      large: 'rounded-[14px]',
      medium: 'rounded-xl',
    };

    const pressedClasses =
      isPressed && !isLoading && !props.disabled
        ? variant === 'primary'
          ? 'bg-neutral-900 scale-[0.98]'
          : 'bg-neutral-300 scale-[0.98]'
        : '';

    return (
      <button
        ref={ref}
        className={twMerge(baseClasses, sizeClasses[size], radiusClasses[size], variantClasses[variant], pressedClasses, className)}
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
);

ButtonLarge.displayName = 'ButtonLarge';

export default ButtonLarge;


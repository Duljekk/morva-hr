'use client';

import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger';

export interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: {
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#009966]',
  },
  warning: {
    bg: 'bg-[#fefce8]',
    text: 'text-[#d08700]',
  },
  danger: {
    bg: 'bg-[#fef2f2]',
    text: 'text-[#e7000b]',
  },
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} flex items-center gap-1 px-2 py-0.5 rounded-lg ${className}`}
    >
      <p className={`${styles.text} text-sm font-normal leading-5 tracking-[-0.07px] whitespace-nowrap`}>
        {children}
      </p>
    </div>
  );
}


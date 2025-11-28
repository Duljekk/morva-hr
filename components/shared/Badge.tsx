'use client';

import type { ReactNode } from 'react';
import type { ComponentType, SVGProps } from 'react';

// Import default icons for each variant
import CircleCheckIcon from '@/app/assets/icons/circle-check.svg';
import WarningTriangleIcon from '@/app/assets/icons/warning-triangle.svg';
import ToastDangerIcon from '@/app/assets/icons/toast-danger.svg';
import CalendarIcon from '@/app/assets/icons/calendar-1.svg';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  size?: BadgeSize;
  icon?: ComponentType<SVGProps<SVGSVGElement>> | null;
  showIcon?: boolean;
  className?: string;
}

// Default icons for each variant
const defaultIcons: Record<BadgeVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  success: CircleCheckIcon,
  warning: WarningTriangleIcon,
  danger: ToastDangerIcon,
  neutral: CalendarIcon,
};

const variantStyles = {
  success: {
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#009966]',
    iconOpacity: 'opacity-100',
  },
  warning: {
    bg: 'bg-[#fefce8]',
    text: 'text-[#d08700]',
    iconOpacity: 'opacity-100',
  },
  danger: {
    bg: 'bg-[#fef2f2]',
    text: 'text-[#e7000b]',
    iconOpacity: 'opacity-100',
  },
  neutral: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-600',
    iconOpacity: 'opacity-60', // 60% opacity as per Figma design
  },
};

const sizeStyles = {
  sm: {
    container: 'pl-[6px] pr-2 py-[4px] rounded-[24px] h-6', // 6px left, 8px right, 4px vertical, 24px radius, 24px height
    text: 'text-sm font-medium leading-bold-sm h-4', // 14px text, medium weight, 18px line height (14+4), 16px height
    iconSize: 'h-3.5 w-3.5', // 14px
    gap: 'gap-1', // 4px gap between icon and text
  },
  md: {
    container: 'px-2 py-0.5 rounded-lg',
    text: 'text-sm font-normal leading-regular-sm', // 14px text, normal weight, 22px line height (14+8)
    iconSize: 'h-3.5 w-3.5', // 14px
    gap: 'gap-1', // 4px gap
  },
};

export default function Badge({ 
  variant, 
  children, 
  size = 'md',
  icon,
  showIcon = true,
  className = '' 
}: BadgeProps) {
  const styles = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  
  // Use provided icon or default icon for variant
  const IconComponent = icon === null ? null : (icon || defaultIcons[variant]);

  return (
    <div
      className={`${styles.bg} flex items-center ${sizeStyle.gap} ${sizeStyle.container} ${className}`}
    >
      {showIcon && IconComponent && (
        <IconComponent 
          className={`${sizeStyle.iconSize} ${styles.text} ${styles.iconOpacity} shrink-0`}
        />
      )}
      <p className={`${styles.text} ${sizeStyle.text} whitespace-nowrap`}>
        {children}
      </p>
    </div>
  );
}


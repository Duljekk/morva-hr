'use client';

import React from 'react';
import BubbleInfoIcon from '@/app/assets/icons/bubble-info.svg';

interface DaysOffBadgeProps {
  days: number;
  className?: string;
}

export default function DaysOffBadge({ days, className = '' }: DaysOffBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 border border-neutral-400 bg-neutral-50 ${className}`}
      style={{
        borderRadius: '8px',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '10px',
        paddingRight: '10px',
        boxShadow: '0px 1px 2px rgba(164, 172, 185, 0.12)',
      }}
    >
      <BubbleInfoIcon className="h-4 w-4 shrink-0" />
      <p className="text-sm font-medium text-neutral-700 tracking-tight">
        You are requesting <span className="font-semibold">{days} day{days > 1 ? 's' : ''} off</span>
      </p>
    </div>
  );
}


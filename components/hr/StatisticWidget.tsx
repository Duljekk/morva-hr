'use client';

import { memo, ReactNode } from 'react';
import ClockIcon from '@/components/icons/shared/Clock';
import ArrowUpRightIcon from '@/components/icons/shared/ArrowUpRight';

export interface StatisticWidgetProps {
  /** Title/label for the statistic (e.g., "Avg. Check-In Time") */
  title: string;
  /** Main value to display (e.g., "11:05") */
  value: string;
  /** Unit to display next to value (e.g., "AM", "PM", "%", etc.) */
  unit?: string;
  /** Trend value (e.g., "1 minute", "+5%", "-2 hours") */
  trend?: string;
  /** Comparison text (e.g., "vs last month", "vs yesterday") */
  comparison?: string;
  /** Trend direction for styling */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Optional icon to display in header. If not provided, defaults to ClockIcon */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler (optional, makes widget clickable) */
  onClick?: () => void;
}

const trendColors = {
  up: {
    bg: 'bg-[#00a63e]',
    text: 'text-[#00a63e]',
    iconRotate: '',
  },
  down: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    iconRotate: 'rotate-90',
  },
  neutral: {
    bg: 'bg-neutral-400',
    text: 'text-neutral-400',
    iconRotate: 'rotate-45',
  },
};

const StatisticWidget = memo(function StatisticWidget({
  title,
  value,
  unit,
  trend,
  comparison,
  trendDirection = 'up',
  icon,
  className = '',
  onClick,
}: StatisticWidgetProps) {
  const colors = trendColors[trendDirection];
  const isClickable = !!onClick;

  const containerClasses = `
    bg-white
    flex flex-col items-start gap-4
    overflow-clip
    pb-[18px] pl-[18px] pr-[28px] pt-[20px]
    relative
    rounded-[14px]
    shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
    w-full
    ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
    ${className}
  `.trim();

  const content = (
    <>
      {/* Header Section */}
      <div className="flex gap-[6px] items-center relative shrink-0 w-full">
        <div className="relative shrink-0 size-[18px] text-neutral-500">
          {icon || <ClockIcon size={18} />}
        </div>
        <p className="font-sans font-medium leading-[20px] relative shrink-0 text-neutral-600 text-base whitespace-nowrap">
          {title}
        </p>
      </div>

      {/* Statistic Section */}
      <div className="flex flex-col items-start px-1 relative shrink-0">
        {/* Value Container */}
        <div className="flex gap-[4px] items-end relative shrink-0">
          <p className="font-semibold leading-[44px] relative shrink-0 text-neutral-800 text-[36px] whitespace-nowrap tracking-[-0.72px]">
            {value}
          </p>
          {unit && (
            <div className="h-[28px] relative shrink-0 flex items-center">
              <p className="font-sans font-medium leading-[18px] text-neutral-600 text-sm whitespace-nowrap">
                {unit}
              </p>
            </div>
          )}
        </div>

        {/* Comparison Section */}
        {(trend || comparison) && (
          <div className="flex gap-1 items-center relative shrink-0 mt-1">
            {trend && trendDirection && (
              <div
                className={`${colors.bg} flex items-center justify-center overflow-clip relative rounded-[4px] shrink-0 size-[12px]`}
              >
                <ArrowUpRightIcon
                  size={10}
                  className={`text-white ${colors.iconRotate}`}
                />
              </div>
            )}
            {trend && (
              <p
                className={`font-sans font-medium leading-[18px] relative shrink-0 ${colors.text} text-sm whitespace-nowrap`}
              >
                {trend}
              </p>
            )}
            {comparison && (
              <p className="font-sans font-normal leading-[20px] relative shrink-0 text-neutral-400 text-sm whitespace-nowrap">
                {comparison}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (isClickable) {
    return (
      <button
        type="button"
        className={containerClasses}
        onClick={onClick}
        aria-label={`${title}: ${value}${unit ? ` ${unit}` : ''}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={containerClasses}
      role="article"
      aria-label={`${title}: ${value}${unit ? ` ${unit}` : ''}`}
    >
      {content}
    </div>
  );
});

StatisticWidget.displayName = 'StatisticWidget';

export default StatisticWidget;

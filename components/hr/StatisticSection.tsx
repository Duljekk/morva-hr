'use client';

import { memo, useState, useMemo, ReactNode } from 'react';
import Dropdown from '@/components/shared/Dropdown';
import StatisticWidget from './StatisticWidget';

export interface StatisticData {
  /** Title/label for the statistic */
  title: string;
  /** Main value to display */
  value: string;
  /** Unit to display next to value */
  unit?: string;
  /** Trend value */
  trend?: string;
  /** Comparison text */
  comparison?: string;
  /** Trend direction for styling */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Optional icon */
  icon?: ReactNode;
}

export interface StatisticSectionProps {
  /** Array of statistic data to display */
  statistics: StatisticData[];
  /** Currently selected month (1-12) */
  selectedMonth?: number;
  /** Currently selected year */
  selectedYear?: number;
  /** Callback when month changes */
  onMonthChange?: (month: number) => void;
  /** Callback when year changes */
  onYearChange?: (year: number) => void;
  /** Additional CSS classes */
  className?: string;
}

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

/**
 * StatisticSection Component
 * 
 * A section component that displays statistics with a header and month/year dropdowns.
 * Based on Figma design node 745:2264.
 * 
 * Features:
 * - Header with "Statistic" title
 * - Month and Year dropdown filters
 * - Flexible grid of StatisticWidget cards
 */
const StatisticSection = memo(function StatisticSection({
  statistics,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  className = '',
}: StatisticSectionProps) {
  // Default to current month/year if not provided
  const currentDate = new Date();
  const [internalMonth, setInternalMonth] = useState(
    selectedMonth ?? currentDate.getMonth() + 1
  );
  const [internalYear, setInternalYear] = useState(
    selectedYear ?? currentDate.getFullYear()
  );

  const month = selectedMonth ?? internalMonth;
  const year = selectedYear ?? internalYear;

  // Generate year options (current year and 4 years back)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 4; y--) {
      years.push({ value: String(y), label: String(y) });
    }
    return years;
  }, []);

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value, 10);
    setInternalMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value, 10);
    setInternalYear(newYear);
    onYearChange?.(newYear);
  };

  const selectedMonthLabel = MONTHS.find(m => m.value === String(month))?.label ?? 'December';

  return (
    <div
      className={`flex flex-col gap-3 items-start w-full ${className}`.trim()}
      data-name="Statistic"
    >
      {/* Header + Dropdown */}
      <div className="flex items-center justify-between w-full">
        <h2 className="font-semibold text-xl leading-[30px] text-neutral-700 tracking-[-0.2px]">
          Statistic
        </h2>
        <div className="flex gap-2 items-center">
          <Dropdown
            text={selectedMonthLabel}
            options={MONTHS}
            value={String(month)}
            onChange={handleMonthChange}
            hasIcon={false}
          />
          <Dropdown
            text={String(year)}
            options={yearOptions}
            value={String(year)}
            onChange={handleYearChange}
            hasIcon={false}
          />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="flex gap-4 items-center w-full">
        {statistics.map((stat, index) => (
          <StatisticWidget
            key={index}
            title={stat.title}
            value={stat.value}
            unit={stat.unit}
            trend={stat.trend}
            comparison={stat.comparison}
            trendDirection={stat.trendDirection}
            icon={stat.icon}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  );
});

StatisticSection.displayName = 'StatisticSection';

export default StatisticSection;

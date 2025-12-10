'use client';

import StatisticWidget from '@/components/hr/StatisticWidget';
import ClockIcon from '@/components/icons/shared/Clock';
import CalendarIcon from '@/components/icons/shared/Calendar';
import CheckIcon from '@/components/icons/shared/Check';

export default function StatisticWidgetTestPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            StatisticWidget Component Test
          </h1>
          <p className="text-neutral-600">
            Testing all variants and states of the StatisticWidget component
          </p>
        </div>

        {/* Main Example (From Design) */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Design Reference Example
          </h2>
          <div className="max-w-[280px]">
            <StatisticWidget
              title="Avg. Check-In Time"
              value="11:05"
              unit="AM"
              trend="1 minute"
              comparison="vs last month"
              trendDirection="up"
            />
          </div>
        </section>

        {/* Trend Directions */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Trend Direction Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticWidget
              title="Positive Trend"
              value="85"
              unit="%"
              trend="+12%"
              comparison="vs last week"
              trendDirection="up"
            />
            <StatisticWidget
              title="Negative Trend"
              value="62"
              unit="%"
              trend="-8%"
              comparison="vs last week"
              trendDirection="down"
            />
            <StatisticWidget
              title="Neutral Trend"
              value="78"
              unit="%"
              trend="0%"
              comparison="vs last week"
              trendDirection="neutral"
            />
          </div>
        </section>

        {/* Different Icons */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Custom Icons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticWidget
              title="Check-In Time"
              value="09:30"
              unit="AM"
              trend="15 min earlier"
              comparison="vs average"
              trendDirection="up"
              icon={<ClockIcon size={18} />}
            />
            <StatisticWidget
              title="Days Present"
              value="22"
              unit="days"
              trend="+2"
              comparison="vs last month"
              trendDirection="up"
              icon={<CalendarIcon size={18} />}
            />
            <StatisticWidget
              title="Tasks Completed"
              value="47"
              trend="+5"
              comparison="vs yesterday"
              trendDirection="up"
              icon={<CheckIcon size={18} />}
            />
          </div>
        </section>

        {/* Without Optional Props */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Minimal Props
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatisticWidget title="Value Only" value="128" />
            <StatisticWidget title="With Unit" value="98.6" unit="F" />
            <StatisticWidget
              title="With Comparison Only"
              value="250"
              comparison="vs target: 200"
            />
          </div>
        </section>

        {/* Different Value Types */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Different Value Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatisticWidget
              title="Time"
              value="2:45"
              unit="PM"
              trend="On time"
              trendDirection="up"
            />
            <StatisticWidget
              title="Percentage"
              value="94.5"
              unit="%"
              trend="+4.5%"
              comparison="vs target"
              trendDirection="up"
            />
            <StatisticWidget
              title="Currency"
              value="$12,450"
              trend="+$1,200"
              comparison="vs last month"
              trendDirection="up"
            />
            <StatisticWidget
              title="Count"
              value="1,234"
              unit="items"
              trend="-56"
              comparison="vs yesterday"
              trendDirection="down"
            />
          </div>
        </section>

        {/* Clickable Widget */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Clickable Widget
          </h2>
          <div className="max-w-[280px]">
            <StatisticWidget
              title="Click Me"
              value="42"
              unit="clicks"
              trend="+5"
              comparison="today"
              trendDirection="up"
              onClick={() => alert('Widget clicked!')}
            />
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            Hover to see shadow effect, click to trigger action
          </p>
        </section>

        {/* Edge Cases */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Edge Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatisticWidget
              title="Very Long Title That Might Need Truncation"
              value="999,999"
              unit="units"
              trend="+100,000"
              comparison="vs previous quarter results"
              trendDirection="up"
            />
            <StatisticWidget
              title="Short"
              value="1"
              trendDirection="neutral"
            />
          </div>
        </section>

        {/* Design Specifications */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Design Specifications
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Border Radius:</strong> 14px</li>
            <li><strong>Padding:</strong> 20px top, 28px right, 18px bottom, 18px left</li>
            <li><strong>Shadow:</strong> 0px 4px 4px -2px rgba(0,0,0,0.05), 0px 0px 1px 1px rgba(0,0,0,0.1)</li>
            <li><strong>Display Value:</strong> 36px, semibold, -0.72px letter-spacing</li>
            <li><strong>Header Icon:</strong> 18px, neutral-500</li>
            <li><strong>Trend Icon:</strong> 12px container, 8px icon, rounded-[4px]</li>
            <li><strong>Trend Colors:</strong> Green (#00a63e) for up, Red for down, Neutral-400 for neutral</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

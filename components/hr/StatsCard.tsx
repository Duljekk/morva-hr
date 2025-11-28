import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  count: number | string;
  icon?: ReactNode;
  trend?: string; // e.g. "+2% from yesterday" - optional for now
  color?: 'neutral' | 'green' | 'amber' | 'red' | 'blue';
}

export default function StatsCard({ title, count, icon, color = 'neutral' }: StatsCardProps) {
  // Map colors to bg/text classes
  const colorStyles = {
    neutral: 'bg-white text-neutral-900 border-neutral-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  
  // We use a simple white card style mostly, but maybe highlight the count?
  // Based on existing design (AttendanceCard), it's white with shadow.
  
  return (
    <div className="flex flex-col rounded-xl bg-white p-4 shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.05)] border border-neutral-100 min-w-[100px] flex-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        {icon && <div className="text-neutral-400">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-neutral-900">{count}</p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Calendar from '../components/Calendar';

export default function TestCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(9); // October (0-indexed)
    date.setDate(27);
    return date;
  });

  return (
    <div className="relative min-h-screen w-full bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[354px] flex flex-col items-center">
        <h1 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
          Calendar Date Card Test
        </h1>

        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
        />

        <div className="mt-6 rounded-xl bg-white p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500 mb-2">Selected Date:</p>
          <p className="text-base font-semibold text-neutral-800">
            {selectedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

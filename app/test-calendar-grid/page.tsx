'use client';

import { useState } from 'react';
import CalendarGrid from '../components/CalendarGrid';

export default function TestCalendarGridPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="relative min-h-screen w-full bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[354px]">
        <h1 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
          Calendar Grid Component Test
        </h1>
        
        <CalendarGrid
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {selectedDate && (
          <div className="mt-6 rounded-xl bg-white p-4 border border-neutral-200">
            <p className="text-sm text-neutral-500 mb-2">Selected Date:</p>
            <p className="text-base font-semibold text-neutral-800">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}




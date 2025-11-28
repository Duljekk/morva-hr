'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/shared/Icons';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ 
  selectedDate, 
  onDateSelect,
  minDate,
  maxDate 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Check if we're viewing the current month
  const today = new Date();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateDisabled = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    // Check if date is in the past (before today)
    if (date < today) return true;
    
    // Check minDate if provided
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    
    // Check maxDate if provided
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return true;
    }
    
    return false;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (!isDateDisabled(day, currentMonth, currentYear) && onDateSelect) {
      onDateSelect(date);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPreviousMonth - i;
      days.push(
        <button
          type="button"
          key={`prev-${day}`}
          disabled
          className="flex h-10 w-10 items-center justify-center text-sm text-neutral-300"
        >
          {day}
        </button>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day, currentMonth, currentYear);
      const selected = isDateSelected(day);
      
      days.push(
        <button
          type="button"
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            selected
              ? 'bg-neutral-800 text-white'
              : disabled
              ? 'text-neutral-300 cursor-not-allowed opacity-50 pointer-events-none'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month's leading days
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button
          type="button"
          key={`next-${day}`}
          disabled
          className="flex h-10 w-10 items-center justify-center text-sm text-neutral-300"
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={isCurrentMonth}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isCurrentMonth
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-neutral-100'
          }`}
        >
          <ChevronLeftIcon className={`h-5 w-5 ${isCurrentMonth ? 'text-neutral-400' : 'text-neutral-600'}`} />
        </button>
        
        <div className="text-center">
          <p className="text-base font-semibold text-neutral-800">
            {monthNames[currentMonth]} {currentYear}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-neutral-600" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center text-xs font-medium text-neutral-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
}


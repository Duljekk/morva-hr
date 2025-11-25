'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { bottomSheetBackdropVariants, bottomSheetVariants } from '../lib/animations/bottomSheetVariants';

// Lazy load CalendarGrid - only load when calendar is opened
const CalendarGrid = dynamic(() => import('./CalendarGrid'), {
  ssr: false,
});

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function Calendar({ value, onChange, className = '' }: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
    setIsOpen(false);
  };

  useLockBodyScroll(isOpen);

  // Motion values for drag
  const y = useMotionValue(0);

  // Reset y when modal closes
  useEffect(() => {
    if (!isOpen) {
      y.set(0);
    }
  }, [isOpen, y]);

  const day = selectedDate.getDate();
  const month = shortMonthNames[selectedDate.getMonth()];

  return (
    <>
      {/* Date Card */}
      <div
        onClick={() => setIsOpen(true)}
        className={`flex flex-col items-start rounded-2xl border border-neutral-200 bg-white px-4 py-3 cursor-pointer transition-all hover:bg-neutral-50 hover:shadow-md ${className}`}
        style={{
          boxShadow: '0px 1px 2px rgba(164, 172, 185, 0.16)'
        }}
      >
        <p className="text-[40px] font-bold leading-none text-neutral-800 text-left">{day}</p>
        <p className="text-sm font-semibold text-red-500 text-left">{month}</p>
      </div>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
      {isOpen && (
          <motion.div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
            variants={bottomSheetBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
          {/* Bottom Sheet Container */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            {/* Bottom Sheet */}
              <motion.div
                className="w-full max-w-[402px] rounded-t-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
                variants={bottomSheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                dragMomentum={false}
                onDrag={(_, info) => {
                  // Only allow dragging down
                  if (info.offset.y > 0) {
                    y.set(info.offset.y);
                  }
                }}
                onDragEnd={(_, info) => {
                  // Dismiss if dragged down more than 100px or with sufficient velocity
                  if (info.offset.y > 100 || info.velocity.y > 500) {
                    setIsOpen(false);
                  } else {
                    // Snap back
                    y.set(0);
                  }
                }}
              style={{
                  y,
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '24px',
                paddingRight: '24px'
              }}
            >
            {/* Handle Bar */}
            <div className="flex justify-center pb-4 sticky top-0 bg-white z-10">
              <div className="h-1 w-12 rounded-full bg-neutral-300"></div>
            </div>

            {/* Calendar Grid */}
            <div>
              <CalendarGrid
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </motion.div>
          </div>
          </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

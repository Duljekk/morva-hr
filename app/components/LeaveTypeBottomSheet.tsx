'use client';

import { useState } from 'react';
import { ChevronRightIcon } from './Icons';
import LeaveSickIcon from '@/app/assets/icons/leave-sick.svg';
import LeaveAnnualIcon from '@/app/assets/icons/leave-annual.svg';
import LeaveUnpaidIcon from '@/app/assets/icons/leave-unpaid.svg';

interface LeaveType {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface LeaveTypeBottomSheetProps {
  selected: LeaveType;
  onSelect: (leaveType: LeaveType) => void;
}

export const leaveTypes: LeaveType[] = [
  { 
    id: 'sick', 
    name: 'Sick Leave', 
    icon: LeaveSickIcon 
  },
  { 
    id: 'annual', 
    name: 'Annual Leave', 
    icon: LeaveAnnualIcon 
  },
  { 
    id: 'unpaid', 
    name: 'Unpaid Leave', 
    icon: LeaveUnpaidIcon 
  },
];

export type { LeaveType };

export default function LeaveTypeBottomSheet({ selected, onSelect }: LeaveTypeBottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (leaveType: LeaveType) => {
    onSelect(leaveType);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-[8px] bg-white border border-neutral-200 p-[10px] transition-all hover:bg-neutral-50 w-full"
        style={{ 
          overflow: 'visible',
          boxShadow: '0px 1px 2px rgba(164, 172, 185, 0.16)'
        }}
      >
        <div className="shrink-0 overflow-visible" style={{ width: '36px', height: '36px' }}>
          <selected.icon className="w-full h-full" />
        </div>
        <span className="text-sm font-semibold text-neutral-800 flex-1 text-left">{selected.name}</span>
        <ChevronRightIcon className="h-4 w-4 text-neutral-600 rotate-90 shrink-0 ml-auto" />
      </button>

      {/* Bottom Sheet Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Bottom Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 animate-slide-up rounded-t-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="h-1 w-12 rounded-full bg-neutral-300"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <h3 className="text-lg font-semibold text-neutral-800 tracking-tight">
                Leave Type
              </h3>
            </div>

            {/* Options */}
            <div className="flex flex-col pb-8">
              {leaveTypes.map((leaveType) => (
                <button
                  key={leaveType.id}
                  onClick={() => handleSelect(leaveType)}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-neutral-50 ${
                    selected.id === leaveType.id ? 'bg-neutral-50' : ''
                  }`}
                >
                  {/* Icon */}
                  <leaveType.icon className="h-9 w-9 shrink-0" />

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <p className="text-base font-semibold text-neutral-800">
                      {leaveType.name}
                    </p>
                  </div>

                  {/* Check Mark */}
                  {selected.id === leaveType.id && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500">
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5L4.5 8.5L11 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


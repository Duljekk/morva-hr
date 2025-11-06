'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon } from './Icons';
import ButtonLarge from './ButtonLarge';
import RadioButton from './RadioButton';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
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
  const [pendingSelection, setPendingSelection] = useState<LeaveType>(selected);

  // Sync pendingSelection with selected prop when it changes
  useEffect(() => {
    setPendingSelection(selected);
  }, [selected]);

  const handleOpen = () => {
    setPendingSelection(selected);
    setIsOpen(true);
  };

  const handleCardClick = (leaveType: LeaveType) => {
    setPendingSelection(leaveType);
  };

  const handleDone = () => {
    onSelect(pendingSelection);
    setIsOpen(false);
  };

  useLockBodyScroll(isOpen);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-[8px] bg-white border border-neutral-200 p-[10px] transition-all hover:bg-neutral-50 w-full"
        style={{ 
          overflow: 'visible',
          boxShadow: '0px 1px 2px rgba(164, 172, 185, 0.16)'
        }}
      >
        <div className="shrink-0 overflow-visible" style={{ width: '36px', height: '36px' }}>
          <selected.icon className="w-full h-full" />
        </div>
        <span className="text-sm font-semibold text-neutral-600 flex-1 text-left">{selected.name}</span>
        <ChevronRightIcon className="h-4 w-4 text-neutral-600 rotate-90 shrink-0 ml-auto" />
      </button>

      {/* Bottom Sheet Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Bottom Sheet Container */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            {/* Bottom Sheet */}
            <div
              className="w-full max-w-[402px] animate-slide-up rounded-t-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '24px',
                paddingRight: '24px'
              }}
            >
            {/* Handle Bar */}
            <div className="flex justify-center pb-4">
              <div className="h-1 w-12 rounded-full bg-neutral-300"></div>
            </div>

            {/* Header */}
            <div className="pb-[18px]">
              <h3 className="text-lg font-semibold text-neutral-800 tracking-tight">
                Leave Type
              </h3>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-[10px]">
              {leaveTypes.map((leaveType) => {
                const isSelected = pendingSelection.id === leaveType.id;
                return (
                  <button
                    key={leaveType.id}
                    type="button"
                    onClick={() => handleCardClick(leaveType)}
                    className={`flex items-center gap-[10px] rounded-xl transition-colors ${
                      isSelected 
                        ? 'bg-neutral-100 border border-neutral-100' 
                        : 'bg-white border border-neutral-100 hover:bg-neutral-50'
                    }`}
                    style={{
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      paddingLeft: '10px',
                      paddingRight: '14px'
                    }}
                  >
                    {/* Icon */}
                    <leaveType.icon className="h-9 w-9 flex-shrink-0" />

                    {/* Text */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-base font-semibold text-neutral-600 leading-tight">
                        {leaveType.name}
                      </p>
                    </div>

                    {/* Radio Button */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <RadioButton checked={isSelected} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Done Button */}
            <div className="pt-5">
              <ButtonLarge
                onClick={handleDone}
                variant="primary"
              >
                Done
              </ButtonLarge>
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
}


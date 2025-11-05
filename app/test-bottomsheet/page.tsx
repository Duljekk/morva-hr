'use client';

import { useState } from 'react';
import LeaveTypeBottomSheet from '../components/LeaveTypeBottomSheet';
import LeaveSickIcon from '@/app/assets/icons/leave-sick.svg';

interface LeaveType {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function TestBottomSheetPage() {
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType>({
    id: 'sick',
    name: 'Sick Leave',
    icon: LeaveSickIcon,
  });

  return (
    <div className="relative min-h-screen w-full bg-neutral-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-800 mb-8">
          Leave Type Bottom Sheet Test
        </h1>
        
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-neutral-700 tracking-tight">
            Leave Type
          </p>
          <LeaveTypeBottomSheet
            selected={selectedLeaveType}
            onSelect={setSelectedLeaveType}
          />
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-neutral-200">
          <p className="text-sm text-neutral-500 mb-3">Currently Selected:</p>
          <div className="flex items-center gap-3">
            <selectedLeaveType.icon className="h-9 w-9 shrink-0" />
            <span className="text-base font-semibold text-neutral-800">
              {selectedLeaveType.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import Chip from '../components/Chip';
import WarningTriangleIcon from '@/app/assets/icons/warning-triangle.svg';

export default function TestChipPage() {
  const [selectedChip, setSelectedChip] = useState<string | null>('chip1');

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-8">
      <div className="w-full max-w-[600px] flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-neutral-800">Chip Component States</h1>
        
        {/* Interactive Chips */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-700 mb-4">Interactive Chips</h2>
            <div className="flex flex-wrap gap-3">
              <Chip
                icon={<WarningTriangleIcon className="h-3 w-3" />}
                selected={selectedChip === 'chip1'}
                onClick={() => setSelectedChip('chip1')}
              >
                Chip 1
              </Chip>
              <Chip
                icon={<WarningTriangleIcon className="h-3 w-3" />}
                selected={selectedChip === 'chip2'}
                onClick={() => setSelectedChip('chip2')}
              >
                Chip 2
              </Chip>
              <Chip
                icon={<WarningTriangleIcon className="h-3 w-3" />}
                selected={selectedChip === 'chip3'}
                onClick={() => setSelectedChip('chip3')}
              >
                Chip 3
              </Chip>
            </div>
          </div>

          {/* All States Display */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-700 mb-4">All States</h2>
            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Active/Selected</p>
                <Chip
                  icon={<WarningTriangleIcon className="h-3 w-3" />}
                  selected={true}
                >
                  Chip
                </Chip>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2">Default (Hover to see hover state)</p>
                <Chip
                  icon={<WarningTriangleIcon className="h-3 w-3" />}
                  selected={false}
                >
                  Chip
                </Chip>
              </div>

              <div>
                <p className="text-sm text-neutral-500 mb-2">Without Icon</p>
                <Chip selected={false}>
                  Text Only
                </Chip>
              </div>
            </div>
          </div>

          {/* Usage Example */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-700 mb-4">Usage Example - Filters</h2>
            <div className="bg-white p-6 rounded-xl">
              <div className="flex flex-wrap gap-2">
                <Chip
                  icon={<WarningTriangleIcon className="h-3 w-3" />}
                  selected={selectedChip === 'urgent'}
                  onClick={() => setSelectedChip('urgent')}
                >
                  Urgent
                </Chip>
                <Chip
                  selected={selectedChip === 'pending'}
                  onClick={() => setSelectedChip('pending')}
                >
                  Pending
                </Chip>
                <Chip
                  selected={selectedChip === 'approved'}
                  onClick={() => setSelectedChip('approved')}
                >
                  Approved
                </Chip>
                <Chip
                  selected={selectedChip === 'rejected'}
                  onClick={() => setSelectedChip('rejected')}
                >
                  Rejected
                </Chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


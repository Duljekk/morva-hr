'use client';

import { useState } from 'react';
import Dropdown from '@/components/shared/Dropdown';
import { ArrowUpDownIcon } from '@/components/icons';

export default function DropdownTestPage() {
  const [selectedValue1, setSelectedValue1] = useState<string>('');
  const [selectedValue2, setSelectedValue2] = useState<string>('asc');
  const [selectedValue3, setSelectedValue3] = useState<string>('');
  const [selectedValue4, setSelectedValue4] = useState<string>('');

  const sortOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'recent', label: 'Recent' },
    { value: 'favorites', label: 'Favorites' },
    { value: 'archived', label: 'Archived', disabled: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Dropdown Component Test Page
          </h1>
          <p className="text-neutral-600">
            Test the Dropdown component with different states, variants, and configurations.
          </p>
        </div>

        {/* Basic Usage */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Basic Usage</h2>
              <p className="text-sm text-neutral-500">
                A simple dropdown with default text and options.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dropdown
                text="Sort"
                options={sortOptions}
                value={selectedValue1}
                onChange={(value) => setSelectedValue1(value)}
                aria-label="Sort options"
              />
              <div className="text-sm text-neutral-600">
                Selected: {selectedValue1 || 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* With Icon */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">With Icon</h2>
              <p className="text-sm text-neutral-500">
                Dropdown with a custom icon displayed before the text.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dropdown
                text="Sort"
                icon={<ArrowUpDownIcon className="w-4 h-4 text-neutral-700" />}
                hasIcon={true}
                options={sortOptions}
                value={selectedValue2}
                onChange={(value) => setSelectedValue2(value)}
                aria-label="Sort with icon"
              />
              <div className="text-sm text-neutral-600">
                Selected: {selectedValue2}
              </div>
            </div>
          </div>
        </div>

        {/* Without Icon */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Without Icon</h2>
              <p className="text-sm text-neutral-500">
                Dropdown with icon disabled.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dropdown
                text="Filter"
                hasIcon={false}
                options={filterOptions}
                value={selectedValue3}
                onChange={(value) => setSelectedValue3(value)}
                aria-label="Filter options"
              />
              <div className="text-sm text-neutral-600">
                Selected: {selectedValue3 || 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Width */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Custom Width</h2>
              <p className="text-sm text-neutral-500">
                Dropdown with custom width (200px).
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dropdown
                text="Status"
                options={statusOptions}
                value={selectedValue4}
                onChange={(value) => setSelectedValue4(value)}
                width={200}
                aria-label="Status options"
              />
              <div className="text-sm text-neutral-600">
                Selected: {selectedValue4 || 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Disabled State */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Disabled State</h2>
              <p className="text-sm text-neutral-500">
                Dropdown in disabled state (cannot be interacted with).
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dropdown
                text="Disabled"
                options={sortOptions}
                disabled
                aria-label="Disabled dropdown"
              />
            </div>
          </div>
        </div>

        {/* With Disabled Options */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">With Disabled Options</h2>
              <p className="text-sm text-neutral-500">
                Dropdown with some options disabled.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dropdown
                text="Filter"
                options={filterOptions}
                value={selectedValue3}
                onChange={(value) => setSelectedValue3(value)}
                aria-label="Filter with disabled options"
              />
            </div>
          </div>
        </div>

        {/* States Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-neutral-700">States</h2>
            <p className="text-sm text-neutral-500 mb-2">
              Hover over the dropdowns above to see state transitions:
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1 ml-4">
              <li>
                <strong>Default:</strong> White background, neutral-200 border, shadow
              </li>
              <li>
                <strong>Hover:</strong> Neutral-50 background, neutral-200 border, shadow
              </li>
              <li>
                <strong>Open:</strong> Menu appears below with options
              </li>
              <li>
                <strong>Selected:</strong> Selected option highlighted in menu
              </li>
            </ul>
          </div>
        </div>

        {/* Keyboard Navigation */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-neutral-700">Keyboard Navigation</h2>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1 ml-4">
              <li>
                <strong>Space/Enter:</strong> Open/close dropdown
              </li>
              <li>
                <strong>Arrow Down:</strong> Navigate to next option
              </li>
              <li>
                <strong>Arrow Up:</strong> Navigate to previous option
              </li>
              <li>
                <strong>Enter:</strong> Select highlighted option
              </li>
              <li>
                <strong>Escape:</strong> Close dropdown
              </li>
            </ul>
          </div>
        </div>

        {/* Current State Display */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-neutral-700">Current Selections</h2>
            <div className="text-sm text-neutral-600 space-y-1 font-mono bg-neutral-50 p-3 rounded">
              <div>Sort 1: {selectedValue1 || 'None'}</div>
              <div>Sort 2: {selectedValue2}</div>
              <div>Filter: {selectedValue3 || 'None'}</div>
              <div>Status: {selectedValue4 || 'None'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





'use client';

import React, { useState } from 'react';
import TableHeader from '@/components/shared/TableHeader';

/**
 * TableHeader Component Test Page
 * 
 * This page demonstrates all variants and states of the TableHeader component.
 */
export default function TableHeaderTestPage() {
  const [allChecked, setAllChecked] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction or clear
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            TableHeader Component Test
          </h1>
          <p className="text-neutral-600">
            Testing all variants and states of the TableHeader component
          </p>
        </div>

        {/* Default Variant */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Default Variant
          </h2>
          <div className="space-y-6">
            {/* Basic Header */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Basic Header
              </h3>
              <div className="border border-neutral-200 rounded-lg inline-block">
                <TableHeader text="Column Name" />
              </div>
            </div>

            {/* Various Labels */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Different Labels
              </h3>
              <div className="flex gap-2 flex-wrap">
                <div className="border border-neutral-200 rounded-lg">
                  <TableHeader text="Name" />
                </div>
                <div className="border border-neutral-200 rounded-lg">
                  <TableHeader text="Status" />
                </div>
                <div className="border border-neutral-200 rounded-lg">
                  <TableHeader text="Date" />
                </div>
                <div className="border border-neutral-200 rounded-lg">
                  <TableHeader text="Actions" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox Variant */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Checkbox Variant
          </h2>
          <div className="space-y-6">
            {/* Unchecked */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Unchecked State
              </h3>
              <div className="border border-neutral-200 rounded-lg inline-block">
                <TableHeader 
                  type="Checkbox" 
                  checked={false}
                  onCheckedChange={() => {}}
                />
              </div>
            </div>

            {/* Checked */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Checked State
              </h3>
              <div className="border border-neutral-200 rounded-lg inline-block">
                <TableHeader 
                  type="Checkbox" 
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
            </div>

            {/* Interactive */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Interactive Checkbox (Click to toggle)
              </h3>
              <div className="border border-neutral-200 rounded-lg inline-block">
                <TableHeader 
                  type="Checkbox" 
                  checked={allChecked}
                  onCheckedChange={setAllChecked}
                />
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                Current state: {allChecked ? 'Checked' : 'Unchecked'}
              </p>
            </div>
          </div>
        </section>

        {/* Sortable Headers */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Sortable Headers
          </h2>
          <div className="space-y-6">
            <p className="text-sm text-neutral-600">
              Click on headers to sort. Click again to reverse direction, and once more to clear sorting.
            </p>
            
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="flex border-b border-neutral-200 bg-neutral-50">
                <TableHeader 
                  type="Checkbox" 
                  checked={allChecked}
                  onCheckedChange={setAllChecked}
                />
                <TableHeader 
                  text="Name" 
                  sortable={true}
                  sortDirection={sortColumn === 'name' ? sortDirection : null}
                  onClick={() => handleSort('name')}
                />
                <TableHeader 
                  text="Email" 
                  sortable={true}
                  sortDirection={sortColumn === 'email' ? sortDirection : null}
                  onClick={() => handleSort('email')}
                />
                <TableHeader 
                  text="Status" 
                  sortable={true}
                  sortDirection={sortColumn === 'status' ? sortDirection : null}
                  onClick={() => handleSort('status')}
                />
                <TableHeader 
                  text="Actions" 
                />
              </div>
            </div>

            <div className="text-sm text-neutral-600">
              Current sort: {sortColumn ? `${sortColumn} (${sortDirection})` : 'None'}
            </div>
          </div>
        </section>

        {/* Full Table Example */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Full Table Example
          </h2>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="flex border-b border-neutral-200 bg-neutral-50">
              <TableHeader type="Checkbox" />
              <TableHeader text="Name" />
              <TableHeader text="Email" />
              <TableHeader text="Role" />
              <TableHeader text="Department" />
              <TableHeader text="Status" />
              <TableHeader text="Actions" />
            </div>
            
            {/* Sample Row */}
            <div className="flex border-b border-neutral-200 hover:bg-neutral-50">
              <div className="px-[8px] py-[10px] size-[40px] flex items-center justify-center">
                <input type="checkbox" className="size-4" />
              </div>
              <div className="px-[8px] py-[10px] h-[40px] flex items-center text-sm text-neutral-700">
                John Doe
              </div>
              <div className="px-[8px] py-[10px] h-[40px] flex items-center text-sm text-neutral-700">
                john.doe@example.com
              </div>
              <div className="px-[8px] py-[10px] h-[40px] flex items-center text-sm text-neutral-700">
                Manager
              </div>
              <div className="px-[8px] py-[10px] h-[40px] flex items-center text-sm text-neutral-700">
                Engineering
              </div>
              <div className="px-[8px] py-[10px] h-[40px] flex items-center text-sm text-neutral-700">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Active
                </span>
              </div>
              <div className="px-[8px] py-[10px] h-[40px] flex items-center text-sm text-neutral-700">
                <button className="text-blue-600 hover:text-blue-700">Edit</button>
              </div>
            </div>
          </div>
        </section>

        {/* Hover States Note */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Interactive Features
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Hover over headers to see hover state (background change)</li>
            <li>Hover over checkbox to see hover effect</li>
            <li>Click sortable headers to change sort order</li>
            <li>Use keyboard (Enter/Space) to interact with interactive elements</li>
            <li>All components support accessibility features (ARIA labels, roles)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}


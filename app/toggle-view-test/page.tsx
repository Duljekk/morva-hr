'use client';

import { useState } from 'react';
import ToggleView, { type ViewType } from '@/components/shared/ToggleView';

export default function ToggleViewTestPage() {
  // State for controlled example
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [uncontrolledLog, setUncontrolledLog] = useState<string[]>([]);
  const [controlledLog, setControlledLog] = useState<string[]>([]);

  // Handle view change for controlled example
  const handleViewChange = (newViewType: ViewType) => {
    setViewType(newViewType);
    setControlledLog((prev) => [...prev.slice(-4), `Changed to: ${newViewType}`]);
  };

  // Handle view change for uncontrolled example
  const handleUncontrolledChange = (newViewType: ViewType) => {
    setUncontrolledLog((prev) => [...prev.slice(-4), `Changed to: ${newViewType}`]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            ToggleView Component Test Page
          </h1>
          <p className="text-neutral-600">
            Test all states and variations of the ToggleView component
          </p>
        </div>

        {/* Basic Usage - Uncontrolled */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Basic Usage (Uncontrolled)</h2>
              <p className="text-sm text-neutral-500">
                ToggleView with internal state management. Defaults to grid view.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ToggleView onChange={handleUncontrolledChange} />
            </div>
            {uncontrolledLog.length > 0 && (
              <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs font-medium text-neutral-600 mb-1">Change Log:</p>
                <ul className="text-xs text-neutral-500 space-y-1">
                  {uncontrolledLog.map((log, index) => (
                    <li key={index}>{log}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Controlled Mode */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Controlled Mode</h2>
              <p className="text-sm text-neutral-500">
                ToggleView with external state control. Current value: <span className="font-semibold text-neutral-700">{viewType}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ToggleView value={viewType} onChange={handleViewChange} />
            </div>
            {controlledLog.length > 0 && (
              <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs font-medium text-neutral-600 mb-1">Change Log:</p>
                <ul className="text-xs text-neutral-500 space-y-1">
                  {controlledLog.map((log, index) => (
                    <li key={index}>{log}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Default to List View */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Default to List View</h2>
              <p className="text-sm text-neutral-500">
                ToggleView starting with list view selected.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ToggleView value="list" onChange={(type) => console.log('Changed to:', type)} />
            </div>
          </div>
        </div>

        {/* Disabled State */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Disabled State</h2>
              <p className="text-sm text-neutral-500">
                ToggleView in disabled state - interactions are disabled.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ToggleView disabled value="grid" />
            </div>
          </div>
        </div>

        {/* Custom ARIA Label */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Custom ARIA Label</h2>
              <p className="text-sm text-neutral-500">
                ToggleView with custom accessibility label.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ToggleView
                value={viewType}
                onChange={handleViewChange}
                aria-label="Switch between grid and list layout"
              />
            </div>
          </div>
        </div>

        {/* Multiple Instances */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Multiple Instances</h2>
              <p className="text-sm text-neutral-500">
                Multiple ToggleView components working independently.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-neutral-500">View 1:</p>
                <ToggleView value="grid" onChange={(type) => console.log('View 1:', type)} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-neutral-500">View 2:</p>
                <ToggleView value="list" onChange={(type) => console.log('View 2:', type)} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-neutral-500">View 3:</p>
                <ToggleView onChange={(type) => console.log('View 3:', type)} />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Usage Example</h2>
              <p className="text-sm text-neutral-500">
                Example of how to use ToggleView in a real application.
              </p>
            </div>
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <pre className="text-xs text-neutral-700 overflow-x-auto">
{`import { useState } from 'react';
import ToggleView, { type ViewType } from '@/components/shared/ToggleView';

function MyComponent() {
  const [viewType, setViewType] = useState<ViewType>('grid');

  return (
    <div>
      <ToggleView
        value={viewType}
        onChange={(type) => setViewType(type)}
        aria-label="Toggle view type"
      />
      {viewType === 'grid' ? (
        <GridLayout />
      ) : (
        <ListLayout />
      )}
    </div>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





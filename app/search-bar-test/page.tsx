'use client';

import { useState, useCallback } from 'react';
import SearchBar from '@/components/shared/SearchBar';
import SidebarMenuItem from '@/components/shared/SidebarMenuItem';

export default function SearchBarTestPage() {
  // State for controlled examples
  const [controlledValue, setControlledValue] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [submittedValue, setSubmittedValue] = useState<string>('');
  const [searchLog, setSearchLog] = useState<string[]>([]);

  // Handle search with debouncing simulation
  const handleSearch = useCallback((value: string) => {
    setSearchLog((prev) => [...prev.slice(-4), `Searched: "${value}"`]);
    
    // Simulate search results
    if (value.trim()) {
      const mockResults = [
        `Result for "${value}"`,
        `Another result for "${value}"`,
        `Third result for "${value}"`,
      ];
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((value: string) => {
    setSubmittedValue(value);
    setSearchLog((prev) => [...prev.slice(-4), `Submitted: "${value}"`]);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            SearchBar Component Test Page
          </h1>
          <p className="text-neutral-600">
            Test all states and variations of the SearchBar component
          </p>
        </div>

        {/* Basic Usage */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Basic Usage</h2>
              <p className="text-sm text-neutral-500">
                Default SearchBar with placeholder text
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Custom Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Custom Placeholder</h2>
              <p className="text-sm text-neutral-500">
                SearchBar with custom placeholder text
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar placeholder="Search employees, leaves, or documents..." />
            </div>
          </div>
        </div>

        {/* Uncontrolled Mode with onSearch */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">
                Uncontrolled Mode with onSearch Callback
              </h2>
              <p className="text-sm text-neutral-500">
                SearchBar that calls onSearch on every change (can be debounced)
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <SearchBar 
                  placeholder="Type to search..."
                  onSearch={handleSearch}
                />
              </div>
              
              {/* Search Log */}
              {searchLog.length > 0 && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-neutral-700 mb-2">Search Log:</h3>
                  <div className="flex flex-col gap-1">
                    {searchLog.map((log, index) => (
                      <p key={index} className="text-xs text-neutral-600 font-mono">
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-700 mb-2">Mock Results:</h3>
                  <ul className="flex flex-col gap-2">
                    {searchResults.map((result, index) => (
                      <li key={index} className="text-sm text-blue-600">
                        • {result}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controlled Mode */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Controlled Mode</h2>
              <p className="text-sm text-neutral-500">
                SearchBar with controlled value state
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <SearchBar 
                  value={controlledValue}
                  onSearch={setControlledValue}
                  placeholder="Controlled search..."
                />
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold">Current value:</span>{' '}
                  <span className="font-mono">{controlledValue || '(empty)'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* With onSubmit */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">With onSubmit Callback</h2>
              <p className="text-sm text-neutral-500">
                SearchBar that calls onSubmit when Enter is pressed
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <SearchBar 
                  placeholder="Press Enter to submit..."
                  onSubmit={handleSubmit}
                />
              </div>
              {submittedValue && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Last submitted:</span>{' '}
                    <span className="font-mono">{submittedValue}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* With defaultValue */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">With Default Value</h2>
              <p className="text-sm text-neutral-500">
                SearchBar with initial default value
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar 
                defaultValue="Initial search value"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>

        {/* Disabled State */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Disabled State</h2>
              <p className="text-sm text-neutral-500">
                SearchBar in disabled state
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar 
                placeholder="Disabled search..."
                disabled={true}
              />
            </div>
          </div>
        </div>

        {/* Without Keyboard Shortcut */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Without Keyboard Shortcut</h2>
              <p className="text-sm text-neutral-500">
                SearchBar with keyboard shortcut disabled (Cmd/Ctrl+K won't work)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar 
                placeholder="No keyboard shortcut..."
                enableKeyboardShortcut={false}
              />
            </div>
          </div>
        </div>

        {/* Custom Styling */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Custom Styling</h2>
              <p className="text-sm text-neutral-500">
                SearchBar with custom className
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar 
                placeholder="Custom styled..."
                className="border-2 border-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Combined Example */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Combined Example</h2>
              <p className="text-sm text-neutral-500">
                SearchBar with onSearch, onSubmit, and controlled value
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <SearchBar 
                  placeholder="Full featured search..."
                  onSearch={handleSearch}
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-500 mb-2">
                  Try typing and pressing Enter to see both callbacks in action
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcut Info */}
        <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-blue-700">Keyboard Shortcut</h2>
            <p className="text-sm text-blue-600">
              Press <kbd className="px-2 py-1 bg-blue-100 rounded text-xs font-mono">Cmd+K</kbd> (Mac) or{' '}
              <kbd className="px-2 py-1 bg-blue-100 rounded text-xs font-mono">Ctrl+K</kbd> (Windows/Linux) to focus any SearchBar above
            </p>
          </div>
        </div>

        {/* SidebarMenuItem Section */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
              SidebarMenuItem Component Test
            </h1>
            <p className="text-neutral-600">
              Test all states and variations of the SidebarMenuItem component
            </p>
          </div>

          {/* Default State */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">Default State</h2>
                <p className="text-sm text-neutral-500">
                  SidebarMenuItem in default state
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SidebarMenuItem text="Dashboard" state="Default" />
              </div>
            </div>
          </div>

          {/* Hover State */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">Hover State</h2>
                <p className="text-sm text-neutral-500">
                  SidebarMenuItem in hover state
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SidebarMenuItem text="Dashboard" state="Hover" />
              </div>
            </div>
          </div>

          {/* Active State */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">Active State</h2>
                <p className="text-sm text-neutral-500">
                  SidebarMenuItem in active state
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SidebarMenuItem text="Dashboard" state="Active" />
              </div>
            </div>
          </div>

          {/* With Custom Text */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">Custom Text</h2>
                <p className="text-sm text-neutral-500">
                  SidebarMenuItem with custom text
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <SidebarMenuItem text="Leave Requests" state="Default" />
                <SidebarMenuItem text="Notifications" state="Default" />
                <SidebarMenuItem text="Settings" state="Default" />
              </div>
            </div>
          </div>

          {/* With Link */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">With Next.js Link</h2>
                <p className="text-sm text-neutral-500">
                  SidebarMenuItem with href prop (wraps in Next.js Link)
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <SidebarMenuItem 
                  text="Dashboard" 
                  href="/" 
                  isActive={true}
                />
                <SidebarMenuItem 
                  text="Notifications" 
                  href="/notifications"
                />
                <SidebarMenuItem 
                  text="Request Leave" 
                  href="/request-leave"
                />
              </div>
            </div>
          </div>

          {/* With onClick */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">With onClick Handler</h2>
                <p className="text-sm text-neutral-500">
                  SidebarMenuItem with onClick callback
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <SidebarMenuItem 
                  text="Click Me" 
                  onClick={() => alert('Menu item clicked!')}
                />
              </div>
            </div>
          </div>

          {/* Disabled State */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">Disabled State</h2>
                <p className="text-sm text-neutral-500">
                  SidebarMenuItem in disabled state
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SidebarMenuItem text="Dashboard" disabled={true} />
              </div>
            </div>
          </div>

          {/* Interactive States */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-neutral-700">Interactive States</h2>
                <p className="text-sm text-neutral-500">
                  Hover over these items to see the hover state in action
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <SidebarMenuItem text="Dashboard" />
                <SidebarMenuItem text="Leave Requests" />
                <SidebarMenuItem text="Notifications" />
                <SidebarMenuItem text="Settings" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


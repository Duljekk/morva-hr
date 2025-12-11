'use client';

import React, { useState } from 'react';
import Avatar from '@/components/shared/Avatar';

/**
 * Avatar Component Test Page
 * 
 * This page demonstrates all variants and states of the Avatar component.
 */
export default function AvatarTestPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Sample users with and without images
  const users = [
    { name: 'John Doe', imageUrl: null },
    { name: 'Jane Smith', imageUrl: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Bob Johnson', imageUrl: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Alice Williams', imageUrl: null },
    { name: 'Charlie Brown', imageUrl: 'https://i.pravatar.cc/150?img=99999' }, // Will fallback to initials (404)
    { name: 'SingleName', imageUrl: null },
    { name: '', imageUrl: null }, // Empty name - should show "?"
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Avatar Component Test
          </h1>
          <p className="text-neutral-600">
            Testing all variants and states of the Avatar component
          </p>
        </div>

        {/* Size Variants */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Size Variants
          </h2>
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" size="xs" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">xs (24px)</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" size="sm" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">sm (32px)</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" size="md" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">md (40px)</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" size="lg" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">lg (48px)</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" size="xl" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">xl (64px)</code>
            </div>
          </div>
        </section>

        {/* Shape Variants */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Shape Variants
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" shape="circle" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">circle</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" shape="rounded" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">rounded</code>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="John Doe" shape="square" />
              <code className="text-xs bg-neutral-100 px-2 py-1 rounded">square</code>
            </div>
          </div>
        </section>

        {/* With Images */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            With Profile Images
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            {users.map((user, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Avatar name={user.name} imageUrl={user.imageUrl} />
                <span className="text-xs text-neutral-600 text-center max-w-[80px] truncate">
                  {user.name || '(no name)'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-neutral-500 mt-4">
            Note: Some images may fail to load and will fallback to initials
          </p>
        </section>

        {/* Initials Generation */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Initials Generation Examples
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name="John Doe" />
              <div>
                <p className="text-sm font-medium text-neutral-700">"John Doe"</p>
                <p className="text-xs text-neutral-500">→ "JD" (first + last initial)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar name="Mary Jane Watson" />
              <div>
                <p className="text-sm font-medium text-neutral-700">"Mary Jane Watson"</p>
                <p className="text-xs text-neutral-500">→ "MW" (first + last initial)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar name="SingleName" />
              <div>
                <p className="text-sm font-medium text-neutral-700">"SingleName"</p>
                <p className="text-xs text-neutral-500">→ "S" (single initial)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar name="" />
              <div>
                <p className="text-sm font-medium text-neutral-700">"" (empty name)</p>
                <p className="text-xs text-neutral-500">→ "?" (fallback)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Avatar */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Interactive Avatar (Clickable)
          </h2>
          <div className="flex items-center gap-4">
            <Avatar
              name="John Doe"
              imageUrl="https://i.pravatar.cc/150?img=1"
              onClick={() => alert('Avatar clicked!')}
            />
            <div>
              <p className="text-sm text-neutral-700">
                Click the avatar above to see interaction
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Supports keyboard navigation (Enter/Space)
              </p>
            </div>
          </div>
        </section>

        {/* Loading State */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Loading State
          </h2>
          <div className="flex items-center gap-4">
            <Avatar name="John Doe" isLoading={isLoading} />
            <button
              onClick={() => setIsLoading(!isLoading)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isLoading ? 'Stop Loading' : 'Start Loading'}
            </button>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Usage Examples
          </h2>
          <div className="space-y-6">
            {/* In a list */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                In a User List
              </h3>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-neutral-200">
                  {users.slice(0, 3).map((user, index) => (
                    <div key={index} className="px-4 py-3 flex items-center gap-3">
                      <Avatar name={user.name} imageUrl={user.imageUrl} />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {user.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {user.imageUrl ? 'Has profile picture' : 'Using initials'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side by side */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Grouped Avatars
              </h3>
              <div className="flex items-center gap-2">
                {users.slice(0, 5).map((user, index) => (
                  <Avatar
                    key={index}
                    name={user.name}
                    imageUrl={user.imageUrl}
                    size="sm"
                    className={index > 0 ? '-ml-2' : ''}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Design Specifications */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            📐 Design Specifications
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Default Size:</strong> 40px (md)</li>
            <li><strong>Default Shape:</strong> Circle (rounded-[99px])</li>
            <li><strong>Gradient Background:</strong> from-[#e4e4e7] to-[#fafafa]</li>
            <li><strong>Image:</strong> object-cover, full size, lazy loading</li>
            <li><strong>Initials:</strong> Generated from name, neutral-600 color</li>
            <li><strong>Accessibility:</strong> role="img" or role="button", aria-label, keyboard support</li>
            <li><strong>Error Handling:</strong> Automatic fallback to initials on image error</li>
          </ul>
        </section>
      </div>
    </div>
  );
}






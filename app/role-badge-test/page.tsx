'use client';

import React from 'react';
import RoleBadge from '@/components/shared/RoleBadge';

/**
 * RoleBadge Component Test Page
 * 
 * This page demonstrates all variants of the RoleBadge component.
 */
export default function RoleBadgeTestPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            RoleBadge Component Test
          </h1>
          <p className="text-neutral-600">
            Testing all variants of the RoleBadge component
          </p>
        </div>

        {/* Variants Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Variants
          </h2>
          <div className="space-y-6">
            {/* Intern Variant */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Intern Variant (Default)
              </h3>
              <div className="flex items-center gap-4">
                <RoleBadge role="Intern" />
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  &lt;RoleBadge role="Intern" /&gt;
                </code>
              </div>
            </div>

            {/* Full-time Variant */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Full-time Variant
              </h3>
              <div className="flex items-center gap-4">
                <RoleBadge role="Full-time" />
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  &lt;RoleBadge role="Full-time" /&gt;
                </code>
              </div>
            </div>

            {/* Default (Intern) */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Default (No role prop - defaults to Intern)
              </h3>
              <div className="flex items-center gap-4">
                <RoleBadge />
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  &lt;RoleBadge /&gt;
                </code>
              </div>
            </div>
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
                In a List/Table Context
              </h3>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200">
                  <p className="text-sm font-medium text-neutral-700">Employee Roles</p>
                </div>
                <div className="divide-y divide-neutral-200">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-neutral-700">John Doe</span>
                    <RoleBadge role="Full-time" />
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-neutral-700">Jane Smith</span>
                    <RoleBadge role="Intern" />
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-neutral-700">Bob Johnson</span>
                    <RoleBadge role="Full-time" />
                  </div>
                </div>
              </div>
            </div>

            {/* Side by side */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Side by Side Comparison
              </h3>
              <div className="flex items-center gap-4">
                <RoleBadge role="Intern" />
                <RoleBadge role="Full-time" />
              </div>
            </div>

            {/* With custom aria-label */}
            <div>
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                With Custom ARIA Label
              </h3>
              <div className="flex items-center gap-4">
                <RoleBadge 
                  role="Intern" 
                  aria-label="Employee role: Intern position"
                />
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  aria-label="Employee role: Intern position"
                </code>
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
            <li><strong>Height:</strong> 22px (excluding padding)</li>
            <li><strong>Padding:</strong> px-[8px], pb-[2px], pt-0</li>
            <li><strong>Border Radius:</strong> rounded-[32px] (pill shape)</li>
            <li><strong>Typography:</strong> Mona Sans Medium, 12px, leading-16px</li>
            <li><strong>Intern:</strong> Cyan-100 background, Cyan-800 text, auto width</li>
            <li><strong>Full-time:</strong> Sky-100 background, Sky-800 text, fixed 67px width</li>
            <li><strong>Accessibility:</strong> Includes role="status" and aria-label</li>
          </ul>
        </section>
      </div>
    </div>
  );
}















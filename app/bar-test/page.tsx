'use client';

import Bar, { BarVariant } from '@/components/shared/Bar';

export default function BarTestPage() {
  const variants: BarVariant[] = ['High', 'Medium', 'Low', 'Empty'];

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Bar Component Test Page
          </h1>
          <p className="text-neutral-600">
            Test all variants of the Bar component
          </p>
        </div>

        {/* All Variants */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">All Variants</h2>
              <p className="text-sm text-neutral-500">
                Displaying all 4 color variants: High, Medium, Low, and Empty
              </p>
            </div>
            <div className="flex items-end gap-4">
              {variants.map((variant) => (
                <div key={variant} className="flex flex-col items-center gap-2">
                  <Bar color={variant} aria-label={`${variant} bar indicator`} />
                  <span className="text-xs text-neutral-600 font-medium">{variant}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual Variants */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-neutral-700">Individual Variants</h2>
            
            {variants.map((variant) => (
              <div key={variant} className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-neutral-700">{variant} Variant</h3>
                <div className="flex items-center gap-4">
                  <Bar color={variant} aria-label={`${variant} bar indicator`} />
                  <span className="text-sm text-neutral-600">
                    Color: {variant}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Usage Examples</h2>
              <p className="text-sm text-neutral-500">
                Examples of how to use the Bar component in different contexts
              </p>
            </div>
            
            {/* Default (High) */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-neutral-700">Default (High)</h3>
              <div className="flex items-center gap-4">
                <Bar aria-label="High priority indicator" />
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  {'<Bar />'}
                </code>
              </div>
            </div>

            {/* With Custom Class */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-neutral-700">With Custom Class</h3>
              <div className="flex items-center gap-4">
                <Bar color="Medium" className="opacity-75" aria-label="Medium priority indicator" />
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  {'<Bar color="Medium" className="opacity-75" />'}
                </code>
              </div>
            </div>

            {/* Multiple Bars */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-neutral-700">Multiple Bars (Progress Indicator)</h3>
              <div className="flex items-end gap-1">
                <Bar color="High" aria-label="Progress bar 1" />
                <Bar color="High" aria-label="Progress bar 2" />
                <Bar color="Medium" aria-label="Progress bar 3" />
                <Bar color="Low" aria-label="Progress bar 4" />
                <Bar color="Empty" aria-label="Progress bar 5" />
                <Bar color="Empty" aria-label="Progress bar 6" />
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-neutral-700">Component Specifications</h2>
            <div className="space-y-2 text-sm text-neutral-600">
              <div>
                <strong>Dimensions:</strong> 6px width × 16px height
              </div>
              <div>
                <strong>Border Radius:</strong> 4px
              </div>
              <div>
                <strong>Variants:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>High:</strong> Green (#00bc7d) with semi-transparent border</li>
                  <li><strong>Medium:</strong> Orange (#fe9a00) with semi-transparent border</li>
                  <li><strong>Low:</strong> Red (#fb2c36) with semi-transparent border</li>
                  <li><strong>Empty:</strong> No fill, neutral border (#e5e5e5)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




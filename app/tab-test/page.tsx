'use client';

import { useState } from 'react';
import Tab from '@/components/shared/Tab';
import TabList from '@/components/shared/TabList';
import Tabs from '@/components/shared/Tabs';

export default function TabTestPage() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [activeTabsTab, setActiveTabsTab] = useState('attendance');

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Tab Component Test</h1>
          <p className="text-neutral-600">
            Testing the Tab component based on Figma design specifications
          </p>
        </div>

        {/* Section 1: Basic States */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Basic States</h2>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">Active State</p>
              <Tab label="Attendance" state="active" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">Default State</p>
              <Tab label="Attendance" state="default" />
            </div>
          </div>
        </section>

        {/* Section 2: With Number Badge */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">With Number Badge</h2>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">Active with Number</p>
              <Tab label="Attendance" state="active" hasNumber={true} number={5} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">Default with Number</p>
              <Tab label="Attendance" state="default" hasNumber={true} number={12} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">Large Number</p>
              <Tab label="Documents" state="active" hasNumber={true} number={99} />
            </div>
          </div>
        </section>

        {/* Section 3: Without Number Badge */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Without Number Badge</h2>
          <div className="flex flex-wrap gap-4">
            <Tab label="Profile" state="active" hasNumber={false} />
            <Tab label="Settings" state="default" hasNumber={false} />
            <Tab label="Analytics" state="default" hasNumber={false} />
          </div>
        </section>

        {/* Section 4: Interactive Tab List */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Interactive Tab List</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Click tabs to switch between them
          </p>
          
          <TabList aria-label="Employee sections">
            <Tab
              label="Attendance"
              state={activeTab === 'attendance' ? 'active' : 'default'}
              hasNumber={true}
              number={24}
              onClick={() => setActiveTab('attendance')}
              aria-controls="attendance-panel"
              id="attendance-tab"
            />
            <Tab
              label="Performance"
              state={activeTab === 'performance' ? 'active' : 'default'}
              hasNumber={true}
              number={8}
              onClick={() => setActiveTab('performance')}
              aria-controls="performance-panel"
              id="performance-tab"
            />
            <Tab
              label="Documents"
              state={activeTab === 'documents' ? 'active' : 'default'}
              hasNumber={true}
              number={156}
              onClick={() => setActiveTab('documents')}
              aria-controls="documents-panel"
              id="documents-tab"
            />
            <Tab
              label="Schedule"
              state={activeTab === 'schedule' ? 'active' : 'default'}
              onClick={() => setActiveTab('schedule')}
              aria-controls="schedule-panel"
              id="schedule-tab"
            />
          </TabList>

          {/* Tab Panels */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            {activeTab === 'attendance' && (
              <div id="attendance-panel" role="tabpanel" aria-labelledby="attendance-tab">
                <h3 className="font-semibold text-neutral-900">Attendance Panel</h3>
                <p className="text-neutral-600 mt-2">
                  This is the attendance content. Showing 24 attendance records.
                </p>
              </div>
            )}
            {activeTab === 'performance' && (
              <div id="performance-panel" role="tabpanel" aria-labelledby="performance-tab">
                <h3 className="font-semibold text-neutral-900">Performance Panel</h3>
                <p className="text-neutral-600 mt-2">
                  This is the performance content. Showing 8 performance reviews.
                </p>
              </div>
            )}
            {activeTab === 'documents' && (
              <div id="documents-panel" role="tabpanel" aria-labelledby="documents-tab">
                <h3 className="font-semibold text-neutral-900">Documents Panel</h3>
                <p className="text-neutral-600 mt-2">
                  This is the documents content. Showing 156 documents.
                </p>
              </div>
            )}
            {activeTab === 'schedule' && (
              <div id="schedule-panel" role="tabpanel" aria-labelledby="schedule-tab">
                <h3 className="font-semibold text-neutral-900">Schedule Panel</h3>
                <p className="text-neutral-600 mt-2">
                  This is the schedule content.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Component Specifications */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Component Specifications</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-neutral-700 mb-2">Props:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li><code className="bg-neutral-100 px-1 rounded">label</code> (string, required) - The text displayed on the tab</li>
                <li><code className="bg-neutral-100 px-1 rounded">state</code> ('active' | 'default') - Current state of the tab</li>
                <li><code className="bg-neutral-100 px-1 rounded">hasNumber</code> (boolean) - Whether to show the number badge</li>
                <li><code className="bg-neutral-100 px-1 rounded">number</code> (number | string) - The number to display in the badge</li>
                <li><code className="bg-neutral-100 px-1 rounded">onClick</code> (function) - Click handler</li>
                <li><code className="bg-neutral-100 px-1 rounded">className</code> (string) - Additional CSS classes</li>
                <li><code className="bg-neutral-100 px-1 rounded">aria-label</code>, <code className="bg-neutral-100 px-1 rounded">aria-selected</code>, <code className="bg-neutral-100 px-1 rounded">aria-controls</code>, <code className="bg-neutral-100 px-1 rounded">id</code> - Accessibility attributes</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-neutral-700 mb-2">Variants:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li><strong>Active:</strong> White background, shadow, dark text (rgb(64, 64, 64))</li>
                <li><strong>Default:</strong> Transparent background, gray text (rgb(115, 115, 115)), hover effect</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-700 mb-2">Design Details from Figma:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Font: Mona Sans Medium</li>
                <li>Font Size: 14px</li>
                <li>Line Height: 18px</li>
                <li>Height: 32px (h-8)</li>
                <li>Padding: 10px horizontal, 10px vertical</li>
                <li>Border Radius: 8px</li>
                <li>Number Badge: 16x16px, 4px border radius, blue background (#2B7FFF)</li>
                <li>Gap between label and badge: 6px</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-700 mb-2">Accessibility:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>ARIA role="tab" for proper screen reader support</li>
                <li>aria-selected attribute to indicate active state</li>
                <li>aria-controls to link tab with its panel</li>
                <li>aria-label for custom accessibility labels</li>
                <li>Keyboard navigation support (inherited from button)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6: Different Label Lengths */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Different Label Lengths</h2>
          <TabList>
            <Tab label="A" state="active" />
            <Tab label="Short" state="default" />
            <Tab label="Medium Length" state="default" hasNumber={true} number={7} />
            <Tab label="Very Long Tab Label Here" state="default" hasNumber={true} number={999} />
          </TabList>
        </section>

        {/* Section 7: Disabled State */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Disabled State</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Tabs can be disabled to prevent interaction
          </p>
          <TabList aria-label="Disabled example">
            <Tab label="Active Tab" state="active" hasNumber={true} number={5} />
            <Tab label="Disabled Tab" state="default" disabled={true} hasNumber={true} number={10} />
            <Tab label="Normal Tab" state="default" hasNumber={true} number={3} />
            <Tab label="Disabled Active" state="active" disabled={true} />
          </TabList>
        </section>

        {/* Section 8: Vertical Orientation */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Vertical Orientation</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Tabs can be arranged vertically with proper ARIA orientation
          </p>
          <TabList orientation="vertical" aria-label="Vertical tabs">
            <Tab label="Dashboard" state="active" hasNumber={true} number={12} />
            <Tab label="Reports" state="default" hasNumber={true} number={45} />
            <Tab label="Settings" state="default" />
            <Tab label="Help" state="default" hasNumber={true} number={3} />
          </TabList>
        </section>

        {/* Section 9: Keyboard Navigation Info */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Keyboard Navigation</h2>
          <div className="space-y-2 text-sm text-neutral-600">
            <p><strong>Tab:</strong> Move focus into/out of tab list</p>
            <p><strong>Enter/Space:</strong> Activate focused tab</p>
            <p><strong>Arrow Keys:</strong> Navigate between tabs (requires TabList keyboard handler)</p>
            <p><strong>Home/End:</strong> Jump to first/last tab (requires TabList keyboard handler)</p>
            <div className="mt-4 p-4 bg-neutral-50 rounded">
              <p className="font-semibold">Note:</p>
              <p>Arrow key navigation between tabs should be implemented at the TabList level for full WAI-ARIA compliance. The current Tab component handles Enter/Space activation.</p>
            </div>
          </div>
        </section>

        {/* Section 10: Best Practices Implemented */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">✅ Best Practices Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-700">ARIA Attributes:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>✅ <code className="bg-neutral-100 px-1 rounded">role="tab"</code> and <code className="bg-neutral-100 px-1 rounded">role="tablist"</code></li>
                <li>✅ <code className="bg-neutral-100 px-1 rounded">aria-selected</code> properly managed</li>
                <li>✅ <code className="bg-neutral-100 px-1 rounded">aria-controls</code> linking tabs to panels</li>
                <li>✅ <code className="bg-neutral-100 px-1 rounded">aria-orientation</code> for horizontal/vertical</li>
                <li>✅ <code className="bg-neutral-100 px-1 rounded">aria-disabled</code> for disabled tabs</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-700">Keyboard Support:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>✅ Enter/Space key activation</li>
                <li>✅ Proper tabIndex management (0 for active, -1 for inactive)</li>
                <li>✅ Disabled state prevents interaction</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-700">Visual Design:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>✅ Active/default states from Figma</li>
                <li>✅ Disabled state with reduced opacity</li>
                <li>✅ Hover states for better UX</li>
                <li>✅ Number badge hugs content</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-700">Accessibility:</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>✅ Screen reader support</li>
                <li>✅ Semantic HTML (button elements)</li>
                <li>✅ Focus indicators</li>
                <li>✅ Disabled state properly announced</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 11: Tabs Container from Figma (Node 596:1255) */}
        <section className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">🎨 Tabs Container (Figma Node 596:1255)</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Styled tabs container with gray background - directly from Figma design
          </p>
          
          {/* Static Example matching Figma */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-neutral-500 mb-2 font-medium">Example 1: Figma Design (Static)</p>
              <Tabs aria-label="Employee sections">
                <TabList>
                  <Tab label="Attendance" state="active" hasNumber={false} />
                  <Tab label="Leave Request" state="default" hasNumber={true} number={5} />
                </TabList>
              </Tabs>
            </div>

            {/* Interactive Example */}
            <div>
              <p className="text-xs text-neutral-500 mb-2 font-medium">Example 2: Interactive</p>
              <Tabs aria-label="Interactive employee sections">
                <TabList>
                  <Tab
                    label="Attendance"
                    state={activeTabsTab === 'attendance' ? 'active' : 'default'}
                    hasNumber={true}
                    number={24}
                    onClick={() => setActiveTabsTab('attendance')}
                  />
                  <Tab
                    label="Leave Request"
                    state={activeTabsTab === 'leave' ? 'active' : 'default'}
                    hasNumber={true}
                    number={5}
                    onClick={() => setActiveTabsTab('leave')}
                  />
                  <Tab
                    label="Documents"
                    state={activeTabsTab === 'documents' ? 'active' : 'default'}
                    hasNumber={true}
                    number={12}
                    onClick={() => setActiveTabsTab('documents')}
                  />
                </TabList>
              </Tabs>
            </div>

            {/* Three Tabs Example */}
            <div>
              <p className="text-xs text-neutral-500 mb-2 font-medium">Example 3: Multiple Tabs</p>
              <Tabs aria-label="Navigation tabs">
                <TabList>
                  <Tab label="Overview" state="active" />
                  <Tab label="Analytics" state="default" hasNumber={true} number={99} />
                  <Tab label="Reports" state="default" hasNumber={true} number={15} />
                  <Tab label="Settings" state="default" />
                </TabList>
              </Tabs>
            </div>
          </div>

          {/* Design Specifications */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold text-neutral-700 mb-3">Design Specifications:</h3>
            <ul className="text-sm space-y-2 text-neutral-600">
              <li>• <strong>Background:</strong> #F5F5F5 (neutral-100)</li>
              <li>• <strong>Border Radius:</strong> 10px</li>
              <li>• <strong>Layout:</strong> Horizontal with 2px gap</li>
              <li>• <strong>Padding:</strong> 2px horizontal (0.5 in Tailwind)</li>
              <li>• <strong>Figma Node:</strong> 596:1255</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}

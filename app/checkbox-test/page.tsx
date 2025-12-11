'use client';

import { useState } from 'react';
import Checkbox from '@/components/shared/Checkbox';

export default function CheckboxTestPage() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [disabledChecked, setDisabledChecked] = useState(true);
  const [disabledUnchecked, setDisabledUnchecked] = useState(false);
  const [disabledIndeterminate, setDisabledIndeterminate] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-2">
            Checkbox Component Test Page
          </h1>
          <p className="text-neutral-600">
            Test the Checkbox component with different states and variants.
          </p>
        </div>

        {/* Basic States */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Basic States</h2>
              <p className="text-sm text-neutral-500">
                Default checkbox states: checked, unchecked, and indeterminate.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checked1}
                  onChange={setChecked1}
                  aria-label="Unchecked checkbox"
                />
                <label className="text-sm text-neutral-700">Unchecked</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checked2}
                  onChange={setChecked2}
                  aria-label="Checked checkbox"
                />
                <label className="text-sm text-neutral-700">Checked</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  indeterminate={indeterminate}
                  checked={checked3}
                  onChange={(checked) => {
                    setChecked3(checked);
                    setIndeterminate(false);
                  }}
                  aria-label="Indeterminate checkbox"
                />
                <label className="text-sm text-neutral-700">Indeterminate</label>
              </div>
            </div>
          </div>
        </div>

        {/* Controlled Examples */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Controlled Examples</h2>
              <p className="text-sm text-neutral-500">
                Checkboxes controlled by React state.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checked1}
                  onChange={setChecked1}
                  aria-label="Task 1"
                />
                <label className="text-sm text-neutral-700">Complete task 1</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checked2}
                  onChange={setChecked2}
                  aria-label="Task 2"
                />
                <label className="text-sm text-neutral-700">Complete task 2</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={checked3}
                  onChange={setChecked3}
                  aria-label="Task 3"
                />
                <label className="text-sm text-neutral-700">Complete task 3</label>
              </div>
            </div>
          </div>
        </div>

        {/* Disabled States */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Disabled States</h2>
              <p className="text-sm text-neutral-500">
                Checkboxes in disabled state (cannot be interacted with).
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={disabledUnchecked}
                  onChange={setDisabledUnchecked}
                  disabled
                  aria-label="Disabled unchecked checkbox"
                />
                <label className="text-sm text-neutral-500">Disabled Unchecked</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={disabledChecked}
                  onChange={setDisabledChecked}
                  disabled
                  aria-label="Disabled checked checkbox"
                />
                <label className="text-sm text-neutral-500">Disabled Checked</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  indeterminate={disabledIndeterminate}
                  checked={disabledChecked}
                  onChange={setDisabledIndeterminate}
                  disabled
                  aria-label="Disabled indeterminate checkbox"
                />
                <label className="text-sm text-neutral-500">Disabled Indeterminate</label>
              </div>
            </div>
          </div>
        </div>

        {/* Status Variants */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-neutral-700">Status Variants</h2>
              <p className="text-sm text-neutral-500">
                Using the status prop directly.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox status="unchecked" aria-label="Unchecked status" />
                <label className="text-sm text-neutral-700">Status: Unchecked</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox status="checked" aria-label="Checked status" />
                <label className="text-sm text-neutral-700">Status: Checked</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox status="indeterminate" aria-label="Indeterminate status" />
                <label className="text-sm text-neutral-700">Status: Indeterminate</label>
              </div>
            </div>
          </div>
        </div>

        {/* Hover States Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-neutral-700">Hover States</h2>
            <p className="text-sm text-neutral-500">
              Hover over the checkboxes above to see the hover state transitions:
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1 ml-4">
              <li>Checked: Background changes from green-600 to green-500</li>
              <li>Indeterminate: Background changes from green-600 to green-500</li>
              <li>Unchecked: Border changes from neutral-200 to neutral-300, check icon appears</li>
            </ul>
          </div>
        </div>

        {/* Current State Display */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-neutral-700">Current State Values</h2>
            <div className="text-sm text-neutral-600 space-y-1 font-mono bg-neutral-50 p-3 rounded">
              <div>Checked 1: {checked1 ? 'true' : 'false'}</div>
              <div>Checked 2: {checked2 ? 'true' : 'false'}</div>
              <div>Checked 3: {checked3 ? 'true' : 'false'}</div>
              <div>Indeterminate: {indeterminate ? 'true' : 'false'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







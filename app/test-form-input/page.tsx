'use client';

import { useState } from 'react';
import FormInput from '../components/FormInput';

// Simple icon components for testing
const PadlockIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7V5C4 3.34315 5.34315 2 7 2C8.65685 2 10 3.34315 10 5V7M4 7H3C2.44772 7 2 7.44772 2 8V13C2 13.5523 2.44772 14 3 14H11C11.5523 14 12 13.5523 12 13V8C12 7.44772 11.5523 7 11 7H4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 3C4.5 3 1.73 5.11 1 8C1.73 10.89 4.5 13 8 13C11.5 13 14.27 10.89 15 8C14.27 5.11 11.5 3 8 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EmailIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 4L8 8L14 4M2 4H14V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 10L13 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function TestFormInputPage() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('Filled text example');
  const [text3, setText3] = useState('');
  const [text4, setText4] = useState('');
  const [text5, setText5] = useState('');
  const [text6, setText6] = useState('');

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-[402px]">
        <h1 className="mb-8 text-2xl font-semibold text-neutral-800">
          Form Input Component Test
        </h1>

        <div className="flex flex-col gap-8">
          {/* Default State - Text Only */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-neutral-600">Default State (Text Only)</h2>
            <FormInput
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Text"
            />
          </div>

          {/* Filled State - Text Only */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-neutral-600">Filled State (Text Only)</h2>
            <FormInput
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Text"
            />
          </div>

          {/* Default State - With Lead Icon */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-neutral-600">Default State (Lead Icon)</h2>
            <FormInput
              value={text3}
              onChange={(e) => setText3(e.target.value)}
              placeholder="Text"
              hasLeadIcon={true}
              LeadIcon={<PadlockIcon />}
            />
          </div>

          {/* Default State - With Both Icons */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-neutral-600">Default State (Both Icons)</h2>
            <FormInput
              value={text4}
              onChange={(e) => setText4(e.target.value)}
              placeholder="Text"
              hasLeadIcon={true}
              hasTrailIcon={true}
              LeadIcon={<PadlockIcon />}
              TrailIcon={<EyeIcon />}
            />
          </div>

          {/* Filled State - With Both Icons */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-neutral-600">Filled State (Both Icons)</h2>
            <FormInput
              value={text5}
              onChange={(e) => setText5(e.target.value)}
              placeholder="Text"
              hasLeadIcon={true}
              hasTrailIcon={true}
              LeadIcon={<PadlockIcon />}
              TrailIcon={<EyeIcon />}
            />
          </div>

          {/* Different Icon Examples */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-neutral-600">Different Icon Examples</h2>
            
            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500">Email Input (Lead Icon)</p>
              <FormInput
                value={text6}
                onChange={(e) => setText6(e.target.value)}
                placeholder="email@example.com"
                type="email"
                hasLeadIcon={true}
                LeadIcon={<EmailIcon />}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500">Search Input (Trail Icon)</p>
              <FormInput
                value={text6}
                onChange={(e) => setText6(e.target.value)}
                placeholder="Search..."
                hasTrailIcon={true}
                TrailIcon={<SearchIcon />}
              />
            </div>
          </div>

          {/* Disabled State */}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-neutral-600">Disabled State</h2>
            <FormInput
              value="Disabled input"
              placeholder="Text"
              disabled={true}
              hasLeadIcon={true}
              hasTrailIcon={true}
              LeadIcon={<PadlockIcon />}
              TrailIcon={<EyeIcon />}
            />
          </div>

          {/* Instructions */}
          <div className="mt-4 rounded-lg bg-neutral-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-neutral-700">Test Instructions:</h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-neutral-600">
              <li>Hover over inputs to see hover state (bg-neutral-100, border-neutral-200)</li>
              <li>Click/focus on inputs to see focused state (border-neutral-400, ring)</li>
              <li>Type in inputs to see filled state (text-neutral-700)</li>
              <li>Check disabled input for disabled state styling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}




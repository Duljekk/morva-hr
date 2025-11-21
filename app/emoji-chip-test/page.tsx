'use client';

import EmojiChip from '@/app/components/EmojiChip';

export default function EmojiChipTestPage() {
  const emojiExamples = [
    { emoji: '❤️', count: 1 },
    { emoji: '👍', count: 3 },
    { emoji: '😊', count: 5 },
    { emoji: '🎉', count: 12 },
    { emoji: '🔥', count: 99 },
    { emoji: '💯', count: 1000 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Emoji Chip Component Test</h1>
          <p className="text-sm text-neutral-600">Interactive emoji chips with count display</p>
        </div>

        {/* Basic Examples */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Basic Examples</h2>
          
          <div className="flex flex-wrap gap-3">
            {emojiExamples.map((example, index) => (
              <EmojiChip
                key={index}
                emoji={example.emoji}
                count={example.count}
              />
            ))}
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Interactive Examples (Clickable)</h2>
          
          <div className="flex flex-wrap gap-3">
            {emojiExamples.map((example, index) => (
              <EmojiChip
                key={`interactive-${index}`}
                emoji={example.emoji}
                count={example.count}
                onClick={() => {
                  console.log(`Clicked ${example.emoji} with count ${example.count}`);
                  alert(`Clicked ${example.emoji} with count ${example.count}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* Single Digit Counts */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Single Digit Counts</h2>
          
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((count) => (
              <EmojiChip
                key={count}
                emoji="⭐"
                count={count}
              />
            ))}
          </div>
        </section>

        {/* Double Digit Counts */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Double Digit Counts</h2>
          
          <div className="flex flex-wrap gap-3">
            {[10, 25, 50, 75, 99].map((count) => (
              <EmojiChip
                key={count}
                emoji="🎯"
                count={count}
              />
            ))}
          </div>
        </section>

        {/* Large Counts */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Large Counts</h2>
          
          <div className="flex flex-wrap gap-3">
            {[100, 500, 1000, 5000, 10000].map((count) => (
              <EmojiChip
                key={count}
                emoji="🚀"
                count={count}
              />
            ))}
          </div>
        </section>

        {/* Component Specifications */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Component Specifications</h2>
          
          <div className="space-y-3 text-sm text-neutral-600">
            <div>
              <p className="font-medium text-neutral-800 mb-1">Dimensions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Height: 24px (h-6)</li>
                <li>Min Width: 36px</li>
                <li>Border Radius: 32px (rounded-[32px])</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-neutral-800 mb-1">Colors:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Background: #f0f9ff (sky-50)</li>
                <li>Border: #00bcff (sky-400), 0.8px</li>
                <li>Emoji Text: #0084d1 (sky-600)</li>
                <li>Count Text: #00a6f4 (sky-500)</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-neutral-800 mb-1">Typography:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Emoji: 10px, Regular, Mona Sans</li>
                <li>Count: 12px, Medium, Mona Sans</li>
                <li>Letter Spacing: -0.05px (emoji)</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium text-neutral-800 mb-1">Features:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Optional onClick handler for interactivity</li>
                <li>Hover and active states when clickable</li>
                <li>Automatic width based on content</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


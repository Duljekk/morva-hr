'use client';

export interface EmojiChipProps {
  emoji: string;
  count: number;
  onClick?: () => void;
  className?: string;
}

export default function EmojiChip({ 
  emoji, 
  count, 
  onClick,
  className = '' 
}: EmojiChipProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`
        bg-[#f0f9ff] 
        border-[0.8px] 
        border-[#00bcff] 
        border-solid 
        flex 
        items-center 
        justify-center 
        px-[4px] 
        py-0 
        rounded-[32px] 
        h-6
        gap-0
        ${onClick ? 'cursor-pointer transition-colors hover:bg-[#e0f2fe] active:bg-[#d0e7f7]' : ''}
        ${className}
      `}
      style={{
        minWidth: '36px',
        boxSizing: 'border-box',
      }}
    >
      {/* Emoji Container */}
      <div 
        className="
          flex 
          flex-col 
          h-6 
          items-center 
          justify-center 
          px-[2px]
          py-0 
          shrink-0
        "
        style={{
          boxSizing: 'border-box',
          gap: '10px',
        }}
      >
        <p 
          className="
            font-sans 
            font-normal 
            leading-4 
            overflow-ellipsis 
            overflow-hidden 
            shrink-0 
            text-[10px] 
            text-[#0084d1] 
            whitespace-nowrap
          "
          style={{
            fontVariationSettings: "'wdth' 100",
            letterSpacing: '-0.05px',
          }}
        >
          {emoji}
        </p>
      </div>

      {/* Count Container */}
      <div 
        className="
          flex 
          flex-col 
          h-[23px] 
          items-center 
          justify-center 
          pl-0
          pr-[2px] 
          py-0 
          shrink-0
        "
        style={{
          boxSizing: 'border-box',
          gap: '10px',
          minWidth: '9px',
        }}
      >
        <p 
          className="
            font-sans 
            font-medium 
            leading-4 
            overflow-ellipsis 
            overflow-hidden 
            shrink-0 
            text-xs 
            text-[#00a6f4] 
            whitespace-nowrap
          "
          style={{
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {count}
        </p>
      </div>
    </Component>
  );
}


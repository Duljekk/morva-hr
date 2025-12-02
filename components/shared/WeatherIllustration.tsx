'use client';

import type { CSSProperties } from 'react';

// Weather illustrations – complex SVGs kept as assets (with gradients, etc.)
// These are treated similarly to other complex illustrations in the app.
import WeatherSunnyIcon from '@/app/assets/icons/weather-sunny.svg';
import WeatherCloudyIcon from '@/app/assets/icons/weather-cloudy.svg';
import WeatherRainyIcon from '@/app/assets/icons/weather-rainy.svg';
import WeatherStormyIcon from '@/app/assets/icons/weather-stormy.svg';

export type WeatherVariant = 'sunny' | 'cloudy' | 'rainy' | 'stormy';

export interface WeatherIllustrationProps {
  /**
   * Which weather illustration to show.
   * @default "sunny"
   */
  variant?: WeatherVariant;

  /**
   * Width/height of the outer container (the blue rounded square).
   * Accepts a number (pixels) or any CSS size string (e.g. "28px", "1.75rem").
   * @default 28 (matches Figma symbol 28x28)
   */
  size?: number | string;

  /**
   * Additional Tailwind / CSS classes for the outer container.
   */
  className?: string;
}

const WEATHER_ICON_MAP: Record<WeatherVariant, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  sunny: WeatherSunnyIcon,
  cloudy: WeatherCloudyIcon,
  rainy: WeatherRainyIcon,
  stormy: WeatherStormyIcon,
};

/**
 * WeatherIllustration Component
 *
 * Renders one of the complex weather SVG illustrations (sunny, cloudy, rainy, stormy).
 *
 * Figma references:
 * - Original weather chip: 20x20, rounded 6px, inner 16x16 at (2,2).
 * - Weather symbol (node 436:766): 28x28, rounded 10px, inner illustration ~22x22
 *   centered with radial highlight and inset shadow.
 *
 * The weather SVGs in `app/assets/icons` already include the detailed illustration.
 * This wrapper recreates the 20x20 container using CSS so the same SVGs can be reused
 * in other contexts without being locked into a specific background.
 *
 * Best practices:
 * - Keep complex visual effects (multiple gradients, filters) inside the SVG file.
 * - Control layout + sizing with a lightweight React wrapper.
 * - Use this component inside a higher-level card/container for additional background,
 *   padding, or hover states instead of baking those into the SVG.
 */
export default function WeatherIllustration({
  variant = 'sunny',
  size = 28,
  className = '',
}: WeatherIllustrationProps) {
  const IllustrationIcon = WEATHER_ICON_MAP[variant] ?? WeatherSunnyIcon;

  const sizeStyle: CSSProperties =
    typeof size === 'number'
      ? { width: `${size}px`, height: `${size}px` }
      : { width: size, height: size };

  return (
    <div
      className={`relative rounded-[10px] ${className}`}
      style={{
        ...sizeStyle,
        background:
          'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 100%),' +
          'linear-gradient(180deg, var(--sky-600, #0084D1) 0%, var(--sky-400, #00BCFF) 100%)',
        boxShadow: '0.937px 0.937px 1.25px 0 rgba(255, 255, 255, 0.24) inset',
      }}
      aria-hidden="true"
      data-node-id="436:766"
    >
      {/* Inner illustration ~22x22, centered as in Figma symbol */}
      <div className="absolute left-1/2 top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 overflow-visible">
        <IllustrationIcon className="h-full w-full" />
      </div>
    </div>
  );
}



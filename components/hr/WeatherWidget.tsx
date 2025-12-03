'use client';

import WeatherIllustration from '@/components/shared/WeatherIllustration';
import type { HRWeather } from '@/lib/weather/hrWeather';

interface WeatherWidgetProps {
  /**
   * Current weather data for the HR location.
   * When null/undefined, the widget renders a graceful fallback.
   */
  weather?: HRWeather | null;
  
  /**
   * Whether the widget is collapsed (icon-only mode)
   * @default false
   */
  collapsed?: boolean;
  
  /**
   * Callback when widget is clicked (for expanding sidebar)
   */
  onClick?: () => void;
  
  /**
   * Callback when widget is hovered (for showing expand icon)
   */
  onHover?: (isHovered: boolean) => void;
}

/**
 * WeatherWidget
 *
 * Shows simple current weather in the HR sidebar:
 * - Generalized weather label: Sunny | Cloudy | Rainy | Stormy
 * - Temperature in °C
 *
 * Fallback behavior:
 * - If `weather` is missing or incomplete, show a neutral placeholder
 *   instead of breaking the layout.
 */
export default function WeatherWidget({ weather, collapsed = false, onClick, onHover }: WeatherWidgetProps) {
  const hasData =
    weather &&
    typeof weather.temperatureC === 'number' &&
    weather.weatherCode != null;

  const generalizedLabel = (code: number | null | undefined): string => {
    if (code == null) return 'Cloudy';

    // Thunderstorm codes → Stormy
    if (code === 95 || code === 96 || code === 99) {
      return 'Stormy';
    }

    // Rain / drizzle / snow / showers codes → Rainy
    if (
      (code >= 51 && code <= 57) || // drizzle / freezing drizzle
      (code >= 61 && code <= 67) || // rain / freezing rain
      (code >= 71 && code <= 77) || // snow / snow grains
      (code >= 80 && code <= 86) // showers
    ) {
      return 'Rainy';
    }

    // Clear / mainly clear → Sunny
    if (code === 0 || code === 1) {
      return 'Sunny';
    }

    // Everything else (clouds, fog, unknown) → Cloudy
    return 'Cloudy';
  };

  const label = hasData
    ? generalizedLabel(weather!.weatherCode)
    : 'Cloudy';

  const temperature = hasData
    ? `${Math.round(weather!.temperatureC!)}°C`
    : '--°C';

  // Map generalized label to illustration variant one-to-one
  const variant: React.ComponentProps<typeof WeatherIllustration>['variant'] =
    label === 'Sunny'
      ? 'sunny'
      : label === 'Rainy'
      ? 'rainy'
      : label === 'Stormy'
      ? 'stormy'
      : 'cloudy';

  if (typeof window !== 'undefined') {
    console.log('[WeatherWidget] weather prop:', weather);
  }

  // Collapsed variant: icon-only, 36x36px
  if (collapsed) {
    return (
      <div
        className="box-border flex items-center justify-center overflow-clip px-[10px] py-[4px] relative rounded-[8px] size-[36px] cursor-pointer hover:bg-neutral-100 transition-colors"
        aria-label={`Weather: ${label}, ${temperature}`}
        title={`${label} / ${temperature}`}
        onClick={onClick}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
      >
        <div className="relative shrink-0 size-[28px] flex items-center justify-center">
          <WeatherIllustration size={28} variant={variant} />
        </div>
      </div>
    );
  }

  // Expanded variant: icon + text
  return (
    <div
      className="content-stretch flex h-[32px] w-[115px] items-center"
      aria-label="Weather widget"
    >
      {/* Weather illustration chip (28x28) */}
      <div className="shrink-0">
        <WeatherIllustration size={28} variant={variant} />
      </div>

      {/* Text contents */}
      <div className="box-border flex shrink-0 items-start gap-[2px] px-[8px] py-0 leading-[18px]">
        <p className="font-semibold text-sm text-neutral-700">
          {label}
        </p>
        <p className="font-medium text-sm text-neutral-400">/</p>
        <p className="font-medium text-sm text-neutral-400">{temperature}</p>
      </div>
    </div>
  );
}


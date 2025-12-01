'use client';

import WeatherIllustration from '@/components/shared/WeatherIllustration';
import type { HRWeather } from '@/lib/weather/hrWeather';

interface WeatherWidgetProps {
  /**
   * Current weather data for the HR location.
   * When null/undefined, the widget renders a graceful fallback.
   */
  weather?: HRWeather | null;
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
export default function WeatherWidget({ weather }: WeatherWidgetProps) {
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


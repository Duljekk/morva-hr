'use server';

import { HR_WEATHER_LOCATION } from './config';
import {
  getCachedCurrentWeatherByLatLon,
  type CurrentWeather,
} from './openMeteo';

/**
 * HR Weather Helper
 *
 * Provides a simple, app-level API to fetch current weather for the
 * primary HR location configured in `lib/weather/config.ts`.
 *
 * This keeps Open-Meteo details and coordinates out of components.
 */

export interface HRWeather extends CurrentWeather {
  /** Human-readable label for the location (e.g. city name) */
  locationLabel: string;
}

/**
 * Get current weather for the configured HR location.
 *
 * Uses the cached Open-Meteo client under the hood.
 */
export async function getHRWeather(): Promise<HRWeather | null> {
  const { latitude, longitude, label } = HR_WEATHER_LOCATION;

  try {
    const current = await getCachedCurrentWeatherByLatLon(latitude, longitude);

    return {
      ...current,
      locationLabel: label,
    };
  } catch (error) {
    console.error('[HRWeather] Failed to fetch HR weather:', {
      error,
      latitude,
      longitude,
      label,
    });

    // Return null so the UI can render a graceful fallback without breaking
    return null;
  }
}



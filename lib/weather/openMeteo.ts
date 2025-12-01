'use server';

import { unstable_cache } from 'next/cache';
import { getWeatherDescriptionFromCode } from './weatherCodes';

/**
 * Open-Meteo Weather Client
 *
 * Fetches current weather from https://api.open-meteo.com/v1/forecast
 * using latitude and longitude.
 *
 * This module is server-only and is intended to be called from
 * Server Actions or other server-side code.
 *
 * It only exposes the minimum fields we need for the UI:
 * - temperature (°C)
 * - weather code (WMO) + a simple human-readable label
 */

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface OpenMeteoRawCurrent {
  time?: string;
  temperature_2m?: number;
  weather_code?: number;
}

export interface OpenMeteoRawResponse {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  current?: OpenMeteoRawCurrent;
}

export interface CurrentWeather {
  /** Temperature in °C, or null if unavailable */
  temperatureC: number | null;
  /** WMO weather code, or null if unavailable */
  weatherCode: number | null;
  /** Human-readable description derived from weatherCode */
  weatherDescription: string | null;
  /** ISO timestamp of the current conditions, if provided */
  time: string | null;
  /** Timezone string from API (e.g. "Europe/Berlin") */
  timezone: string | null;
}

/**
 * Map WMO weather codes to a short human-readable label.
 * This is a minimal subset, extended as needed.
 */
// export function getWeatherDescriptionFromCode(code: number | null | undefined): string | null {
//   if (code == null) return null;

//   // Based on WMO weather interpretation codes used by Open-Meteo
//   const map: Record<number, string> = {
//     0: 'Clear sky',
//     1: 'Mainly clear',
//     2: 'Partly cloudy',
//     3: 'Overcast',
//     45: 'Foggy',
//     48: 'Depositing rime fog',
//     51: 'Light drizzle',
//     53: 'Moderate drizzle',
//     55: 'Dense drizzle',
//     56: 'Light freezing drizzle',
//     57: 'Dense freezing drizzle',
//     61: 'Slight rain',
//     63: 'Moderate rain',
//     65: 'Heavy rain',
//     66: 'Light freezing rain',
//     67: 'Heavy freezing rain',
//     71: 'Slight snow fall',
//     73: 'Moderate snow fall',
//     75: 'Heavy snow fall',
//     77: 'Snow grains',
//     80: 'Slight rain showers',
//     81: 'Moderate rain showers',
//     82: 'Violent rain showers',
//     85: 'Slight snow showers',
//     86: 'Heavy snow showers',
//     95: 'Thunderstorm',
//     96: 'Thunderstorm with slight hail',
//     99: 'Thunderstorm with heavy hail',
//   };

//   return map[code] ?? 'Unknown';
// }

/**
 * Clamp latitude and longitude into valid ranges to avoid invalid requests.
 */
function normalizeCoordinates(latitude: number, longitude: number): { lat: number; lon: number } {
  const lat = Math.max(-90, Math.min(90, latitude));
  const lon = ((longitude + 180) % 360 + 360) % 360 - 180; // wrap to [-180, 180]
  return { lat, lon };
}

/**
 * Fetch current weather from Open-Meteo by latitude and longitude.
 *
 * Only returns temperature and weather code (plus description & metadata).
 */
export async function fetchCurrentWeatherByLatLon(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  const { lat, lon } = normalizeCoordinates(latitude, longitude);

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,weather_code',
    timezone: 'auto',
  });

  const url = `${OPEN_METEO_BASE_URL}?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      // NOTE: Caching is handled in a higher layer (Phase 3 of the weather plan)
    });
  } catch (error) {
    console.error('[OpenMeteo] Network error fetching weather:', {
      error,
      latitude: lat,
      longitude: lon,
    });
    throw new Error('Failed to connect to weather service');
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[OpenMeteo] Non-OK response from weather API:', {
      status: res.status,
      statusText: res.statusText,
      body,
      latitude: lat,
      longitude: lon,
    });
    throw new Error('Weather service returned an error');
  }

  let json: OpenMeteoRawResponse;
  try {
    json = (await res.json()) as OpenMeteoRawResponse;
  } catch (error) {
    console.error('[OpenMeteo] Failed to parse JSON from weather API:', {
      error,
      latitude: lat,
      longitude: lon,
    });
    throw new Error('Failed to parse weather data');
  }

  const current = json.current ?? {};
  const temperatureC =
    typeof current.temperature_2m === 'number' ? current.temperature_2m : null;
  const weatherCode =
    typeof current.weather_code === 'number' ? current.weather_code : null;

  console.log('[OpenMeteo] Parsed current weather:', {
    latitude: json.latitude,
    longitude: json.longitude,
    timezone: json.timezone,
    temperatureC,
    weatherCode,
  });

  return {
    temperatureC,
    weatherCode,
    weatherDescription: getWeatherDescriptionFromCode(weatherCode),
    time: current.time ?? null,
    timezone: json.timezone ?? null,
  };
}

/**
 * CACHED VARIANT
 *
 * Wrap the raw fetch function in Next.js's `unstable_cache` to:
 * - Throttle calls to Open-Meteo
 * - Cache results per (lat, lon) for a short TTL (e.g. 5 minutes)
 *
 * This function is what consumers (e.g. HR weather helpers) should call.
 */
const _getCachedCurrentWeather = unstable_cache(
  async (latitude: number, longitude: number): Promise<CurrentWeather> => {
    return await fetchCurrentWeatherByLatLon(latitude, longitude);
  },
  ['open-meteo-current-weather'],
  {
    revalidate: 300, // 5 minutes
    tags: ['weather-current'],
  }
);

/**
 * Get cached current weather for a given location.
 *
 * This is the primary entry point you should use from other modules.
 */
export async function getCachedCurrentWeatherByLatLon(
  latitude: number,
  longitude: number
): Promise<CurrentWeather> {
  try {
    return await _getCachedCurrentWeather(latitude, longitude);
  } catch (cacheError) {
    // If caching fails for any reason, fall back to a direct fetch.
    console.error('[OpenMeteo] Cache error, falling back to direct fetch:', cacheError);
    return await fetchCurrentWeatherByLatLon(latitude, longitude);
  }
}




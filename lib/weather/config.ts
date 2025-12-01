// 'use server';

/**
 * Weather Configuration
 *
 * App-level configuration for weather-related features.
 * 
 * Option A: Hard-coded coordinates for a single primary location
 * (e.g. company HQ). If you ever need environment-based configuration,
 * you can switch to Option B (env vars) later.
 */

export interface WeatherLocationConfig {
  latitude: number;
  longitude: number;
  /** Optional human-readable label for UI/logging */
  label: string;
}

/**
 * Primary HR location for weather display.
 *
 * TODO: Update these coordinates to match your real office location.
 * For now, this uses a generic example (Jakarta).
 */
export const HR_WEATHER_LOCATION: WeatherLocationConfig = {
  latitude: -6.3730,
  longitude: 106.9008,
  label: 'Jakarta, Indonesia',
};



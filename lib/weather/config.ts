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
 * Primary HR location for weather display and GPS check-in validation.
 * 
 * Morva HQ coordinates extracted from Google Maps.
 */
export const HR_WEATHER_LOCATION: WeatherLocationConfig = {
  latitude: -6.3730923,
  longitude: 106.9034288,
  label: 'Morva HQ, Jakarta',
};


































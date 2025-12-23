/**
 * Geolocation Utilities
 * 
 * Functions for GPS-based check-in validation including:
 * - Distance calculation using Haversine formula
 * - Coordinate validation
 * - Office location retrieval from database
 */

import { HR_WEATHER_LOCATION } from '@/lib/weather/config';

/**
 * Default check-in radius in meters
 */
export const DEFAULT_CHECK_IN_RADIUS = 50;

/**
 * Office location configuration
 */
export interface OfficeLocation {
  latitude: number;
  longitude: number;
  radius: number;
  label?: string;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * 
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Earth's radius in meters
  const R = 6371000;

  // Handle edge case: same point
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Validate GPS coordinates
 * 
 * @param lat - Latitude to validate (-90 to 90)
 * @param lon - Longitude to validate (-180 to 180)
 * @returns true if coordinates are valid
 */
export function validateCoordinates(lat: number, lon: number): boolean {
  // Check for NaN or undefined
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return false;
  }

  if (isNaN(lat) || isNaN(lon)) {
    return false;
  }

  // Validate latitude range (-90 to 90)
  if (lat < -90 || lat > 90) {
    return false;
  }

  // Validate longitude range (-180 to 180)
  if (lon < -180 || lon > 180) {
    return false;
  }

  return true;
}

/**
 * Get office location for check-in validation
 * 
 * Returns the hardcoded fallback location.
 * For dynamic location from database, use getOfficeLocationFromDB().
 * 
 * @returns Office location with coordinates and radius
 */
export function getOfficeLocation(): OfficeLocation {
  return {
    latitude: HR_WEATHER_LOCATION.latitude,
    longitude: HR_WEATHER_LOCATION.longitude,
    radius: DEFAULT_CHECK_IN_RADIUS,
    label: HR_WEATHER_LOCATION.label,
  };
}

/**
 * Get office location from database for check-in validation
 * 
 * Fetches the selected location from the database.
 * Falls back to hardcoded HR_WEATHER_LOCATION if no location is selected.
 * 
 * This is an async function that should be used in server actions.
 * 
 * @returns Office location with coordinates and radius
 */
export async function getOfficeLocationFromDB(): Promise<OfficeLocation> {
  try {
    // Dynamic import to avoid circular dependencies
    const { getSelectedLocation } = await import('@/lib/actions/hr/locations');
    const result = await getSelectedLocation();

    if (result.data) {
      return {
        latitude: result.data.latitude,
        longitude: result.data.longitude,
        radius: result.data.radiusMeters,
        label: result.data.name,
      };
    }

    // Fallback to hardcoded location if no database location is selected
    console.log('[getOfficeLocationFromDB] No selected location, using fallback');
    return getOfficeLocation();
  } catch (error) {
    console.error('[getOfficeLocationFromDB] Error fetching location:', error);
    // Fallback to hardcoded location on error
    return getOfficeLocation();
  }
}

/**
 * Check if a position is within the allowed check-in radius
 * 
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param office - Office location (optional, uses default if not provided)
 * @returns Object with isWithinRadius boolean and distance in meters
 */
export function isWithinCheckInRadius(
  userLat: number,
  userLon: number,
  office?: OfficeLocation
): { isWithinRadius: boolean; distance: number; radius: number } {
  const officeLocation = office || getOfficeLocation();
  
  const distance = calculateDistance(
    userLat,
    userLon,
    officeLocation.latitude,
    officeLocation.longitude
  );

  return {
    isWithinRadius: distance <= officeLocation.radius,
    distance: Math.round(distance),
    radius: officeLocation.radius,
  };
}

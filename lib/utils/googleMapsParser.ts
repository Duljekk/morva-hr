/**
 * Google Maps URL Parser
 * 
 * Utility functions for parsing Google Maps URLs to extract coordinates.
 * For future use when adding office locations via Google Maps links.
 */

export interface ParsedLocation {
  latitude: number;
  longitude: number;
  label?: string;
}

/**
 * Parse a Google Maps URL to extract latitude and longitude
 * 
 * Supports multiple URL formats:
 * - https://www.google.com/maps?q=lat,lng
 * - https://www.google.com/maps/@lat,lng,zoom
 * - https://www.google.com/maps/place/.../@lat,lng,zoom
 * - https://maps.google.com/?ll=lat,lng
 * - https://goo.gl/maps/... (short URLs - not supported, need redirect)
 * 
 * @param url - Google Maps URL
 * @returns ParsedLocation or null if parsing fails
 */
export function parseGoogleMapsUrl(url: string): ParsedLocation | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    // Pattern 1: ?q=lat,lng or ?q=lat+lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*)[,+](-?\d+\.?\d*)/);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      if (validateCoordinates(lat, lng)) {
        return { latitude: lat, longitude: lng };
      }
    }

    // Pattern 2: @lat,lng,zoom (in URL path)
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (validateCoordinates(lat, lng)) {
        return { latitude: lat, longitude: lng };
      }
    }

    // Pattern 3: ?ll=lat,lng
    const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (llMatch) {
      const lat = parseFloat(llMatch[1]);
      const lng = parseFloat(llMatch[2]);
      if (validateCoordinates(lat, lng)) {
        return { latitude: lat, longitude: lng };
      }
    }

    // Pattern 4: /place/lat,lng
    const placeMatch = url.match(/\/place\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (placeMatch) {
      const lat = parseFloat(placeMatch[1]);
      const lng = parseFloat(placeMatch[2]);
      if (validateCoordinates(lat, lng)) {
        return { latitude: lat, longitude: lng };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate GPS coordinates (reused from geolocation.ts)
 */
function validateCoordinates(lat: number, lon: number): boolean {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return false;
  }

  if (isNaN(lat) || isNaN(lon)) {
    return false;
  }

  if (lat < -90 || lat > 90) {
    return false;
  }

  if (lon < -180 || lon > 180) {
    return false;
  }

  return true;
}

/**
 * Generate a Google Maps URL from coordinates
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @param zoom - Zoom level (default: 17)
 * @returns Google Maps URL
 */
export function generateGoogleMapsUrl(
  lat: number,
  lng: number,
  zoom: number = 17
): string {
  return `https://www.google.com/maps/@${lat},${lng},${zoom}z`;
}

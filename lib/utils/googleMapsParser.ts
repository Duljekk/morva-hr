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
 * Extract place name from a Google Maps URL
 * 
 * Supports URL patterns like:
 * - https://www.google.com/maps/place/Place+Name/@lat,lng,zoom
 * - https://www.google.com/maps/place/Place%20Name/@lat,lng,zoom
 * 
 * @param url - Google Maps URL
 * @returns Decoded place name or undefined if not found
 */
function extractPlaceLabel(url: string): string | undefined {
  // Match /place/Name/ pattern where Name is followed by / or @
  const placeNameMatch = url.match(/\/place\/([^/@]+)/);
  if (placeNameMatch && placeNameMatch[1]) {
    const encodedName = placeNameMatch[1];
    // Check if this looks like coordinates (starts with digit or minus)
    if (/^-?\d/.test(encodedName)) {
      return undefined;
    }
    try {
      // Decode URL encoding (e.g., %20 -> space, + -> space)
      const decoded = decodeURIComponent(encodedName.replace(/\+/g, ' '));
      return decoded;
    } catch {
      // If decoding fails, return the raw string with + replaced by spaces
      return encodedName.replace(/\+/g, ' ');
    }
  }
  return undefined;
}

/**
 * Parse a Google Maps URL to extract latitude and longitude
 * 
 * Supports multiple URL formats:
 * - https://www.google.com/maps?q=lat,lng
 * - https://www.google.com/maps/@lat,lng,zoom
 * - https://www.google.com/maps/place/Name/@lat,lng,zoom
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
    // Extract label from place URLs (do this first before coordinate extraction)
    const label = extractPlaceLabel(url);

    // Pattern 1: ?q=lat,lng or ?q=lat+lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*)[,+](-?\d+\.?\d*)/);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      if (validateCoordinates(lat, lng)) {
        return { latitude: lat, longitude: lng, ...(label && { label }) };
      }
    }

    // Pattern 2: @lat,lng,zoom (in URL path)
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (validateCoordinates(lat, lng)) {
        return { latitude: lat, longitude: lng, ...(label && { label }) };
      }
    }

    // Pattern 3: ?ll=lat,lng
    const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (llMatch) {
      const lat = parseFloat(llMatch[1]);
      const lng = parseFloat(llMatch[2]);
      if (validateCoordinates(lat, lng)) {
        return { latitude: lat, longitude: lng, ...(label && { label }) };
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

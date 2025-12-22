/**
 * Geocoding Utilities
 * 
 * Server-side service for reverse geocoding using Google Geocoding API.
 * Converts coordinates to human-readable addresses.
 */

/**
 * Result from reverse geocoding operation
 */
export interface GeocodingResult {
  formattedAddress: string;
  addressComponents: {
    streetNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

/**
 * Google Geocoding API response types
 */
interface GoogleGeocodingResponse {
  status: string;
  results: GoogleGeocodingResult[];
  error_message?: string;
}

interface GoogleGeocodingResult {
  formatted_address: string;
  address_components: GoogleAddressComponent[];
}

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Reverse geocode coordinates to get a human-readable address
 * 
 * Uses Google Geocoding API to convert latitude/longitude to address.
 * Handles API errors gracefully by returning null.
 * 
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns GeocodingResult with formatted address and components, or null on failure
 * 
 * Requirements: 1.2, 7.1, 7.2
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodingResult | null> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Geocoding API key not configured (GOOGLE_GEOCODING_API_KEY)');
    return null;
  }

  // Validate coordinates
  if (!isValidCoordinate(latitude, longitude)) {
    console.warn('Invalid coordinates provided to reverseGeocode:', { latitude, longitude });
    return null;
  }

  const url = buildGeocodingUrl(latitude, longitude, apiKey);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Geocoding API HTTP error:', response.status, response.statusText);
      return null;
    }

    const data: GoogleGeocodingResponse = await response.json();

    if (data.status !== 'OK') {
      // Handle specific error statuses
      if (data.status === 'ZERO_RESULTS') {
        console.warn('No geocoding results found for coordinates:', { latitude, longitude });
      } else {
        console.error('Geocoding API error:', data.status, data.error_message);
      }
      return null;
    }

    if (!data.results || data.results.length === 0) {
      console.warn('Empty results from Geocoding API');
      return null;
    }

    // Use the first (most specific) result
    const result = data.results[0];
    
    return {
      formattedAddress: result.formatted_address,
      addressComponents: parseAddressComponents(result.address_components),
    };
  } catch (error) {
    console.error('Geocoding API request failed:', error);
    return null;
  }
}

/**
 * Build the Google Geocoding API URL
 */
function buildGeocodingUrl(latitude: number, longitude: number, apiKey: string): string {
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  const params = new URLSearchParams({
    latlng: `${latitude},${longitude}`,
    key: apiKey,
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Validate GPS coordinates
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  
  if (isNaN(lat) || isNaN(lng)) {
    return false;
  }
  
  // Latitude: -90 to 90
  if (lat < -90 || lat > 90) {
    return false;
  }
  
  // Longitude: -180 to 180
  if (lng < -180 || lng > 180) {
    return false;
  }
  
  return true;
}

/**
 * Parse Google address components into a structured format
 */
function parseAddressComponents(
  components: GoogleAddressComponent[]
): GeocodingResult['addressComponents'] {
  const result: GeocodingResult['addressComponents'] = {};

  for (const component of components) {
    const types = component.types;

    if (types.includes('street_number')) {
      result.streetNumber = component.long_name;
    } else if (types.includes('route')) {
      result.street = component.long_name;
    } else if (types.includes('locality')) {
      result.city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      result.state = component.long_name;
    } else if (types.includes('country')) {
      result.country = component.long_name;
    } else if (types.includes('postal_code')) {
      result.postalCode = component.long_name;
    }
  }

  return result;
}

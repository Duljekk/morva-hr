'use server';

/**
 * Server actions for HR office location management
 * Handles adding, fetching, deleting, and toggling check-in locations
 * 
 * Location: lib/actions/hr/ - HR-only actions
 * All functions require HR admin role (enforced via requireHRAdmin)
 */

import { revalidateTag } from 'next/cache';
import { requireHRAdmin } from '@/lib/auth/requireHRAdmin';
import { parseGoogleMapsUrl } from '@/lib/utils/googleMapsParser';
import { reverseGeocode } from '@/lib/utils/geocoding';

/**
 * CheckInLocation interface matching database schema
 */
export interface CheckInLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  googleMapsUrl: string | null;
  formattedAddress: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for adding a new location
 */
export interface AddLocationInput {
  googleMapsUrl: string;
  name?: string;
  radiusMeters?: number;
}

/**
 * Result from add location operation
 */
export interface AddLocationResult {
  success: boolean;
  location?: CheckInLocation;
  error?: string;
  warning?: string;
}

/**
 * ADD CHECK-IN LOCATION
 * 
 * Parses a Google Maps URL to extract coordinates, calls geocoding API
 * for address, and stores the location in the database.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 7.1
 */
export async function addCheckInLocation(
  input: AddLocationInput
): Promise<AddLocationResult> {
  try {
    // Require HR admin role
    const { userId, supabase } = await requireHRAdmin();

    const { googleMapsUrl, name, radiusMeters = 50 } = input;

    // Validate input
    if (!googleMapsUrl || typeof googleMapsUrl !== 'string') {
      return { success: false, error: 'Google Maps URL is required' };
    }

    // Parse the Google Maps URL to extract coordinates
    // Requirements: 1.1, 4.1, 4.2, 4.3, 4.4
    const parsedLocation = parseGoogleMapsUrl(googleMapsUrl.trim());

    if (!parsedLocation) {
      // Requirement 1.5: Display error for invalid URL
      return { 
        success: false, 
        error: 'Invalid Google Maps URL format. Could not extract coordinates.' 
      };
    }

    const { latitude, longitude, label } = parsedLocation;

    // Determine location name: use provided name, extracted label, or generate from coordinates
    const locationName = name?.trim() || label || `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

    // Call geocoding service for address
    // Requirements: 1.2, 7.1
    let formattedAddress: string | null = null;
    let warning: string | undefined;

    const geocodingResult = await reverseGeocode(latitude, longitude);
    
    if (geocodingResult) {
      formattedAddress = geocodingResult.formattedAddress;
    } else {
      // Requirement 7.1, 7.2: Store without address if geocoding fails
      warning = 'Address could not be retrieved. Location saved with coordinates only.';
      console.warn('[addCheckInLocation] Geocoding failed, storing without address');
    }

    // Insert location into database
    // Requirement 1.3
    const { data: insertedLocation, error: insertError } = await supabase
      .from('check_in_locations')
      .insert({
        name: locationName,
        latitude,
        longitude,
        radius_meters: radiusMeters,
        google_maps_url: googleMapsUrl.trim(),
        formatted_address: formattedAddress,
        is_active: true,
        created_by: userId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[addCheckInLocation] Database insert error:', insertError);
      return { success: false, error: 'Failed to save location to database' };
    }

    // Transform database row to CheckInLocation interface
    const location: CheckInLocation = {
      id: insertedLocation.id,
      name: insertedLocation.name,
      latitude: Number(insertedLocation.latitude),
      longitude: Number(insertedLocation.longitude),
      radiusMeters: insertedLocation.radius_meters,
      googleMapsUrl: insertedLocation.google_maps_url,
      formattedAddress: insertedLocation.formatted_address,
      isActive: insertedLocation.is_active,
      createdBy: insertedLocation.created_by,
      createdAt: insertedLocation.created_at,
      updatedAt: insertedLocation.updated_at,
    };

    // Invalidate cache
    revalidateTag('check-in-locations', 'max');

    // Requirement 1.4: Return success with location data
    return { 
      success: true, 
      location,
      ...(warning && { warning }),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[addCheckInLocation] Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}


/**
 * GET CHECK-IN LOCATIONS
 * 
 * Fetches all check-in locations for HR admin view.
 * Includes formatted address and active status.
 * 
 * Requirements: 2.1, 2.2
 */
export async function getCheckInLocations(): Promise<{ 
  data?: CheckInLocation[]; 
  error?: string 
}> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    // Fetch all locations ordered by creation date
    const { data: locations, error } = await supabase
      .from('check_in_locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getCheckInLocations] Query error:', error);
      return { error: 'Failed to fetch check-in locations' };
    }

    if (!locations || locations.length === 0) {
      return { data: [] };
    }

    // Transform database rows to CheckInLocation interface
    const transformedLocations: CheckInLocation[] = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      radiusMeters: loc.radius_meters,
      googleMapsUrl: loc.google_maps_url,
      formattedAddress: loc.formatted_address,
      isActive: loc.is_active,
      createdBy: loc.created_by,
      createdAt: loc.created_at,
      updatedAt: loc.updated_at,
    }));

    return { data: transformedLocations };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[getCheckInLocations] Error:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * DELETE CHECK-IN LOCATION
 * 
 * Deletes a check-in location by ID.
 * Requires HR admin permission.
 * 
 * Requirements: 5.2
 */
export async function deleteCheckInLocation(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Location ID is required' };
    }

    // Delete the location
    const { error } = await supabase
      .from('check_in_locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteCheckInLocation] Delete error:', error);
      return { success: false, error: 'Failed to delete location' };
    }

    // Invalidate cache
    revalidateTag('check-in-locations', 'max');

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[deleteCheckInLocation] Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * TOGGLE LOCATION ACTIVE STATUS
 * 
 * Updates the is_active field for a check-in location.
 * 
 * Requirements: 6.1
 */
export async function toggleLocationActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Require HR admin role
    const { supabase } = await requireHRAdmin();

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Location ID is required' };
    }

    if (typeof isActive !== 'boolean') {
      return { success: false, error: 'isActive must be a boolean' };
    }

    // Update the is_active field
    const { error } = await supabase
      .from('check_in_locations')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('[toggleLocationActive] Update error:', error);
      return { success: false, error: 'Failed to update location status' };
    }

    // Invalidate cache
    revalidateTag('check-in-locations', 'max');

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[toggleLocationActive] Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

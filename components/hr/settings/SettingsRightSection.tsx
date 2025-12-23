'use client';

import { useState, useEffect } from 'react';
import FormInput from '@/components/shared/FormInput';
import CardOffice from './CardOffice';
import BuildingIcon from '@/components/icons/shared/Building';

export interface OfficeLocation {
  id: string;
  locationName: string;
  /**
   * Formatted address from geocoding API
   * Can be null if geocoding failed
   * Requirement 7.3
   */
  formattedAddress: string | null;
  /**
   * Latitude coordinate for fallback display
   * Requirement 7.3
   */
  latitude: number;
  /**
   * Longitude coordinate for fallback display
   * Requirement 7.3
   */
  longitude: number;
  /**
   * Whether this is the primary/headquarters location
   */
  isPrimary: boolean;
}

interface SettingsRightSectionProps {
  /**
   * List of office locations to display
   */
  locations: OfficeLocation[];

  /**
   * Currently selected office location ID
   */
  selectedLocationId: string;

  /**
   * Callback when a location is selected
   */
  onLocationSelect: (locationId: string) => void;

  /**
   * Callback when a new location is added
   */
  onAddLocation: (googleMapsLink: string) => void;

  /**
   * Whether the add location button is loading
   */
  isAddingLocation?: boolean;

  /**
   * Error message to display (Requirement 1.5: invalid URL error)
   */
  errorMessage?: string | null;

  /**
   * Warning message to display (Requirement 7.2: geocoding failure warning)
   */
  warningMessage?: string | null;

  /**
   * Success message to display (Requirement 1.4: location added successfully)
   */
  successMessage?: string | null;

  /**
   * Callback to clear messages
   */
  onClearMessages?: () => void;
}

/**
 * Settings Right Section Component
 *
 * Displays the office locations management section with:
 * - Header with "Office" title
 * - Google Maps link input with "Add Location" button
 * - Success/warning/error messages for location operations
 * - List of office location cards (selectable)
 *
 * Requirements:
 * - 1.4: Display new location in the list
 * - 1.5: Display error message for invalid URL
 * - 7.2: Display warning message when address couldn't be retrieved
 *
 * @example
 * ```tsx
 * <SettingsRightSection
 *   locations={officeLocations}
 *   selectedLocationId="1"
 *   onLocationSelect={(id) => setSelectedId(id)}
 *   onAddLocation={(link) => handleAddLocation(link)}
 *   errorMessage={error}
 *   warningMessage={warning}
 *   successMessage={success}
 *   onClearMessages={() => clearMessages()}
 * />
 * ```
 */
export default function SettingsRightSection({
  locations,
  selectedLocationId,
  onLocationSelect,
  onAddLocation,
  isAddingLocation = false,
  errorMessage,
  warningMessage,
  successMessage,
  onClearMessages,
}: SettingsRightSectionProps) {
  const [googleMapsLink, setGoogleMapsLink] = useState('');

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (successMessage || warningMessage) {
      const timer = setTimeout(() => {
        onClearMessages?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, onClearMessages]);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddLocation = () => {
    // Clear previous validation error
    setValidationError(null);
    
    // Validate input is not empty
    if (!googleMapsLink.trim()) {
      setValidationError('Please enter a Google Maps URL');
      return;
    }
    
    onAddLocation(googleMapsLink.trim());
    setGoogleMapsLink('');
  };

  // Clear validation error when user starts typing
  useEffect(() => {
    if (googleMapsLink && validationError) {
      setValidationError(null);
    }
  }, [googleMapsLink, validationError]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddLocation();
    }
  };

  return (
    <div className="flex flex-[1_0_0] flex-col gap-[18px] h-full items-start min-h-0 min-w-0 w-full">
      {/* Header + Input */}
      <div className="flex items-center justify-between w-full">
        {/* Title */}
        <h2 className="font-['Mona_Sans'] text-xl font-semibold leading-[30px] tracking-[-0.2px] text-[#404040]">
          Office
        </h2>

        {/* Google Maps Input */}
        <div className="flex items-center gap-2">
          {/* Form Input */}
          <FormInput
            value={googleMapsLink}
            onChange={(e) => setGoogleMapsLink(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Google Maps URL"
            bgColor="white"
            className="w-[222px]"
          />

          {/* Add Location Button */}
          <button
            type="button"
            onClick={handleAddLocation}
            disabled={isAddingLocation}
            className="
              flex items-center justify-center
              h-10 px-5 py-1.5
              bg-neutral-800 hover:bg-neutral-700
              rounded-lg
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <span className="font-['Mona_Sans'] text-sm font-semibold leading-[18px] text-white text-center whitespace-nowrap">
              {isAddingLocation ? 'Adding...' : 'Add Location'}
            </span>
          </button>
        </div>
      </div>

      {/* Messages Section - Requirements 1.5, 7.2 */}
      {/* Validation Error - Empty input field */}
      {validationError && (
        <div 
          className="flex items-start gap-2 w-full p-3 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="w-5 h-5 text-red-500 shrink-0 mt-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-red-700 text-sm flex-1">{validationError}</p>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss validation error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Error Message - Requirement 1.5: Display error for invalid URL */}
      {errorMessage && (
        <div 
          className="flex items-start gap-2 w-full p-3 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="w-5 h-5 text-red-500 shrink-0 mt-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-red-700 text-sm flex-1">{errorMessage}</p>
          <button
            type="button"
            onClick={onClearMessages}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Warning Message - Requirement 7.2: Display warning when address couldn't be retrieved */}
      {warningMessage && (
        <div 
          className="flex items-start gap-2 w-full p-3 bg-amber-50 border border-amber-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <p className="text-amber-700 text-sm flex-1">{warningMessage}</p>
          <button
            type="button"
            onClick={onClearMessages}
            className="text-amber-500 hover:text-amber-700 transition-colors"
            aria-label="Dismiss warning"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Success Message - Requirement 1.4: Confirm location added */}
      {successMessage && (
        <div 
          className="flex items-start gap-2 w-full p-3 bg-green-50 border border-green-200 rounded-lg"
          role="status"
          aria-live="polite"
        >
          <svg 
            className="w-5 h-5 text-green-500 shrink-0 mt-0.5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-green-700 text-sm flex-1">{successMessage}</p>
          <button
            type="button"
            onClick={onClearMessages}
            className="text-green-500 hover:text-green-700 transition-colors"
            aria-label="Dismiss success message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Card Groups */}
      <div className="flex flex-col gap-[18px] items-start w-full">
        {locations.map((location) => (
          <CardOffice
            key={location.id}
            locationName={location.locationName}
            formattedAddress={location.formattedAddress}
            latitude={location.latitude}
            longitude={location.longitude}
            isSelected={selectedLocationId === location.id}
            onClick={() => onLocationSelect(location.id)}
            icon={location.isPrimary ? <BuildingIcon size={24} className="text-[#404040]" /> : undefined}
          />
        ))}

        {/* Empty State */}
        {locations.length === 0 && (
          <div className="flex items-center justify-center w-full py-12 bg-neutral-50 rounded-2xl">
            <p className="text-neutral-500 text-sm">
              No office locations added yet. Add a Google Maps link to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import SettingsPageHeader, { SettingsTab } from './SettingsPageHeader';
import SettingsLeftSection, { CompanyData } from './SettingsLeftSection';
import SettingsRightSection, { OfficeLocation } from './SettingsRightSection';
import SetWFCConfirmationModal from './SetWFCConfirmationModal';
import {
  getCheckInLocations,
  addCheckInLocation,
  selectLocation,
  CheckInLocation,
} from '@/lib/actions/hr/locations';

// Sample company data
const COMPANY_DATA: CompanyData = {
  name: 'Morva Labs',
  industry: 'Design & Technology',
  logoUrl: null, // Will show fallback initial
  website: 'morvalabs.com',
  email: 'lets@morvalabs.com',
};

/**
 * Transform CheckInLocation from server to OfficeLocation for UI
 * Passes through formattedAddress and coordinates for CardOffice to handle fallback
 * Requirements 2.2, 7.3
 */
function transformToOfficeLocation(location: CheckInLocation): OfficeLocation {
  return {
    id: location.id,
    locationName: location.name,
    formattedAddress: location.formattedAddress,
    latitude: location.latitude,
    longitude: location.longitude,
    isPrimary: location.isPrimary,
  };
}

/**
 * Client component for the Settings page
 *
 * Handles all client-side interactivity including:
 * - Tab navigation between Company, Office Hours, and Time Off & Holidays
 * - Content rendering based on active tab
 * - Company profile display
 * - Office location selection and management
 * - Fetching locations from database on mount
 * - Adding new locations via server action
 *
 * Requirements: 1.4, 2.1, 2.3
 */
export default function SettingsPageClient() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationWarning, setLocationWarning] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);

  // WFC Confirmation Modal state
  const [isWFCModalOpen, setIsWFCModalOpen] = useState(false);
  const [pendingLocationId, setPendingLocationId] = useState<string | null>(null);
  const [pendingLocationName, setPendingLocationName] = useState<string>('');
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  /**
   * Fetch locations from database on mount
   * Requirement 2.1: Display list of all office locations
   */
  const fetchLocations = useCallback(async () => {
    setIsLoadingLocations(true);
    setLocationError(null);

    try {
      const result = await getCheckInLocations();

      if (result.error) {
        setLocationError(result.error);
        setOfficeLocations([]);
      } else if (result.data) {
        // Transform server data to UI format
        const uiLocations = result.data.map(transformToOfficeLocation);
        setOfficeLocations(uiLocations);

        // Find the selected location from database, or default to first
        const selectedLocation = result.data.find(loc => loc.isSelected);
        if (selectedLocation) {
          setSelectedOfficeId(selectedLocation.id);
        } else if (uiLocations.length > 0 && !selectedOfficeId) {
          setSelectedOfficeId(uiLocations[0].id);
        }
      }
    } catch (error) {
      console.error('[SettingsPageClient] Failed to fetch locations:', error);
      setLocationError('Failed to load office locations');
      setOfficeLocations([]);
    } finally {
      setIsLoadingLocations(false);
    }
  }, [selectedOfficeId]);

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
  };

  /**
   * Handle office location selection
   * Shows confirmation modal for non-primary locations (WFC)
   * Persists the selection to the database for check-in validation
   * Uses optimistic update with rollback on error
   * Requirements: 3.1, 3.2, 3.3
   */
  const handleOfficeSelect = (officeId: string) => {
    // Find the location being selected
    const location = officeLocations.find((loc) => loc.id === officeId);
    if (!location) return;

    // If selecting a non-primary location, show confirmation modal
    if (!location.isPrimary) {
      setPendingLocationId(officeId);
      setPendingLocationName(location.locationName);
      setIsWFCModalOpen(true);
      return;
    }

    // For primary location, select directly without confirmation
    performLocationSelect(officeId);
  };

  /**
   * Perform the actual location selection (called directly or after modal confirmation)
   */
  const performLocationSelect = async (officeId: string) => {
    // Store previous state for rollback
    const previousSelectedId = selectedOfficeId;

    // Optimistically update UI
    setSelectedOfficeId(officeId);
    setIsSelectingLocation(true);

    try {
      // Persist selection to database
      const result = await selectLocation(officeId);

      if (!result.success) {
        console.error(
          '[SettingsPageClient] Failed to select location:',
          result.error
        );
        // Rollback to previous state
        setSelectedOfficeId(previousSelectedId);
        setLocationError(result.error || 'Failed to select location');
      }
    } catch (error) {
      console.error('[SettingsPageClient] Error selecting location:', error);
      // Rollback to previous state
      setSelectedOfficeId(previousSelectedId);
      setLocationError('Failed to select location. Please try again.');
    } finally {
      setIsSelectingLocation(false);
    }
  };

  /**
   * Handle WFC modal confirmation
   */
  const handleWFCConfirm = async () => {
    if (pendingLocationId) {
      await performLocationSelect(pendingLocationId);
      setIsWFCModalOpen(false);
      setPendingLocationId(null);
      setPendingLocationName('');
    }
  };

  /**
   * Handle WFC modal close/cancel
   */
  const handleWFCModalClose = () => {
    setIsWFCModalOpen(false);
    setPendingLocationId(null);
    setPendingLocationName('');
  };

  /**
   * Handle adding a new location via server action
   * Requirements: 1.1, 1.2, 1.3, 1.4, 7.1, 7.2
   */
  const handleAddLocation = async (googleMapsLink: string) => {
    setIsAddingLocation(true);
    setLocationError(null);
    setLocationWarning(null);
    setLocationSuccess(null);

    try {
      const result = await addCheckInLocation({ googleMapsUrl: googleMapsLink });

      if (!result.success) {
        // Requirement 1.5: Display error for invalid URL
        setLocationError(result.error || 'Failed to add location');
        return;
      }

      // Requirement 7.2: Display warning if address couldn't be retrieved
      if (result.warning) {
        setLocationWarning(result.warning);
      }

      // Requirement 1.4: Display new location in the list
      if (result.location) {
        const newUiLocation = transformToOfficeLocation(result.location);
        setOfficeLocations((prev) => [newUiLocation, ...prev]);

        // Select the newly added location
        setSelectedOfficeId(newUiLocation.id);

        // Show success message (only if no warning)
        if (!result.warning) {
          setLocationSuccess(`Location "${result.location.name}" added successfully.`);
        }
      }
    } catch (error) {
      console.error('[SettingsPageClient] Failed to add location:', error);
      setLocationError('Failed to add location. Please try again.');
    } finally {
      setIsAddingLocation(false);
    }
  };

  const handleCompanyMenuClick = () => {
    // TODO: Implement company menu actions (edit, etc.)
    console.log('Company menu clicked');
  };

  /**
   * Clear all location messages
   */
  const handleClearMessages = useCallback(() => {
    setLocationError(null);
    setLocationWarning(null);
    setLocationSuccess(null);
  }, []);

  /**
   * Clear warning message after a delay
   */
  useEffect(() => {
    if (locationWarning || locationSuccess) {
      const timer = setTimeout(() => {
        setLocationWarning(null);
        setLocationSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [locationWarning, locationSuccess]);

  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start overflow-clip relative size-full">
      {/* Page Header with Tabs */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <SettingsPageHeader
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 w-full overflow-auto">
        {/* Company Panel */}
        {activeTab === 'company' && (
          <div
            id="company-panel"
            role="tabpanel"
            aria-labelledby="company-tab"
            className="flex gap-7 items-start justify-center pt-12 px-[64px] pb-0"
          >
            {/* Left Section - Company Profile */}
            <div className="flex-[1_0_0] min-w-0 min-h-0">
              <SettingsLeftSection
                company={COMPANY_DATA}
                onMenuClick={handleCompanyMenuClick}
              />
            </div>

            {/* Right Section - Office Locations */}
            {isLoadingLocations ? (
              <div className="flex-[1_0_0] min-w-0 min-h-0 flex flex-col gap-[18px] items-start">
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-['Mona_Sans'] text-xl font-semibold leading-[30px] tracking-[-0.2px] text-[#404040]">
                    Office
                  </h2>
                </div>
                <div className="flex items-center justify-center w-full py-12 bg-neutral-50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                    <p className="text-neutral-500 text-sm">Loading locations...</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-[1_0_0] min-w-0 min-h-0">
                <SettingsRightSection
                  locations={officeLocations}
                  selectedLocationId={selectedOfficeId}
                  onLocationSelect={handleOfficeSelect}
                  onAddLocation={handleAddLocation}
                  isAddingLocation={isAddingLocation}
                  errorMessage={locationError}
                  warningMessage={locationWarning}
                  successMessage={locationSuccess}
                  onClearMessages={handleClearMessages}
                />
              </div>
            )}
          </div>
        )}

        {/* Office Hours Panel */}
        {activeTab === 'office-hours' && (
          <div
            id="office-hours-panel"
            role="tabpanel"
            aria-labelledby="office-hours-tab"
            className="p-6"
          >
            <p className="text-neutral-500 text-sm">
              Office hours settings content will be displayed here.
            </p>
          </div>
        )}

        {/* Time Off & Holidays Panel */}
        {activeTab === 'time-off' && (
          <div
            id="time-off-panel"
            role="tabpanel"
            aria-labelledby="time-off-tab"
            className="p-6"
          >
            <p className="text-neutral-500 text-sm">
              Time off and holidays settings content will be displayed here.
            </p>
          </div>
        )}
      </div>

      {/* WFC Confirmation Modal */}
      <SetWFCConfirmationModal
        isOpen={isWFCModalOpen}
        onClose={handleWFCModalClose}
        onConfirm={handleWFCConfirm}
        locationName={pendingLocationName}
        isLoading={isSelectingLocation}
      />
    </div>
  );
}

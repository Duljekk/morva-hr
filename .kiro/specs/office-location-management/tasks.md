# Implementation Plan

- [x] 1. Database migration for formatted_address column






  - [x] 1.1 Create migration to add formatted_address column to check_in_locations table

    - Add `formatted_address TEXT` column to existing table
    - Column should be nullable to support graceful degradation
    - _Requirements: 1.3, 7.1_

- [x] 2. Enhance URL Parser utility






  - [x] 2.1 Add label extraction from Google Maps place URLs

    - Extract place name from `/place/Name/` URL pattern
    - Return label in ParsedLocation interface
    - _Requirements: 1.1, 4.1, 4.2, 4.3, 4.4_

- [x] 3. Create Geocoding service






  - [x] 3.1 Create geocoding utility with reverseGeocode function

    - Create `lib/utils/geocoding.ts`
    - Implement reverseGeocode function calling Google Geocoding API
    - Parse response to extract formatted address and components
    - Handle API errors gracefully returning null
    - _Requirements: 1.2, 7.1, 7.2_

- [x] 4. Create server actions for location management





  - [x] 4.1 Create addCheckInLocation server action


    - Create `lib/actions/hr/locations.ts`
    - Parse Google Maps URL using parser utility
    - Call geocoding service for address
    - Insert location into database with all fields
    - Return success/error response with location data
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.1_
  - [x] 4.2 Create getCheckInLocations server action

    - Fetch all locations for HR admin
    - Include formatted address and active status
    - _Requirements: 2.1, 2.2_
  - [x] 4.3 Create deleteCheckInLocation server action

    - Delete location by ID
    - Verify HR admin permission
    - _Requirements: 5.2_
  - [x] 4.4 Create toggleLocationActive server action

    - Update is_active field for location
    - _Requirements: 6.1_
  - [x] 4.5 Export location actions from hr/index.ts


    - Add exports for all location actions
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5. Integrate UI with server actions
  - [x] 5.1 Update SettingsPageClient to fetch and manage locations





    - Call getCheckInLocations on mount
    - Handle addCheckInLocation form submission
    - Display loading and error states
    - _Requirements: 1.4, 2.1, 2.3_
  - [x] 5.2 Update SettingsRightSection to handle location operations





    - Pass location data from parent
    - Handle add location callback with server action
    - Display success/warning messages
    - _Requirements: 1.4, 1.5, 7.2_
  - [x] 5.3 Update CardOffice to display formatted address or coordinate fallback





    - Show formatted address when available
    - Show coordinates as fallback when address is missing
    - _Requirements: 2.2, 7.3_

- [ ] 6. Add delete and toggle functionality to UI
  - [ ] 6.1 Add delete button to CardOffice component
    - Add delete icon button to card
    - Show confirmation dialog on click
    - Call deleteCheckInLocation on confirm
    - _Requirements: 5.1, 5.3_
  - [ ] 6.2 Add active/inactive toggle to CardOffice component
    - Add toggle switch to card
    - Call toggleLocationActive on change
    - Update visual state based on is_active
    - _Requirements: 6.1, 6.3_

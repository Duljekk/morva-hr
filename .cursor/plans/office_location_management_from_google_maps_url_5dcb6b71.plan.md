---
name: Office Location Management from Google Maps URL
overview: Implement HR admin feature to add office locations by pasting Google Maps URLs. System extracts location name and coordinates from URL, uses Google Geocoding API to fetch detailed address, and stores location in database for check-in validation.
todos:
  - id: url-parser-utility
    content: Create utility function to parse Google Maps URLs and extract location name, latitude, and longitude from various URL formats
    status: pending
  - id: geocoding-api-setup
    content: Set up Google Geocoding API client and create server-side function for reverse geocoding (coordinates to address)
    status: pending
  - id: add-location-server-action
    content: Create addCheckInLocation() server action that accepts Google Maps URL, parses it, calls Geocoding API, and stores location in database
    status: pending
    dependencies:
      - url-parser-utility
      - geocoding-api-setup
  - id: location-management-ui
    content: Create HR admin UI page for managing locations with form to paste Google Maps URL, preview parsed data, and list existing locations
    status: pending
    dependencies:
      - add-location-server-action
  - id: edit-delete-locations
    content: Add edit and delete functionality for existing locations, plus toggle active/inactive status
    status: pending
    dependencies:
      - location-management-ui
---

# Office Location Managem

ent from Google Maps URL

## Overview

Enable HR admins to add office locations by pasting a Google Maps URL. The system automatically extracts the location name and coordinates from the URL, uses Google Geocoding API to fetch the detailed address, and stores everything in the database for use in GPS check-in validation.

## High-Level Flow

````mermaid
sequenceDiagram
    participant HR as HR Admin
    participant UI as Location Management UI
    participant Server as Server Action
    participant Parser as URL Parser
    participant Geocoding as Google Geocoding API
    participant DB as Database

    HR->>UI: Paste Google Maps URL
    HR->>UI: Click "Add Location"
    UI->>Server: submitLocationUrl(url)
    Server->>Parser: parseGoogleMapsUrl(url)
    Parser-->>Server: { name, latitude, longitude }
    Server->>Geocoding: reverseGeocode(lat, lon)
    Geocoding-->>Server: { formatted_address, components }
    Server->>DB: Insert location record
    DB-->>Server: Location created
    Server-->>UI: Success response
    UI-->>HR: Show success message
```



## Key Components

### 1. URL Parsing

- **Input**: Google Maps URL (various formats supported)
- **Output**: Location name, latitude, longitude
- **Handles**: Multiple URL formats (place URLs, coordinate URLs, search URLs)
- **Validation**: Ensures coordinates are valid before proceeding

### 2. Google Geocoding API Integration

- **Purpose**: Get detailed address information from coordinates
- **Input**: Latitude and longitude from parsed URL
- **Output**: Formatted address, address components (street, city, country, etc.)
- **API Key**: Stored securely in environment variables
- **Error Handling**: Graceful fallback if API fails (still store location with basic info)

### 3. Database Storage

- **Table**: `check_in_locations` (already planned in GPS check-in feature)
- **Stores**: Name, coordinates, radius, formatted address, Google Maps URL
- **Status**: Active/inactive flag for enabling/disabling locations

### 4. HR Admin UI

- **Page**: Location management page in HR admin section
- **Features**:
- Form to paste Google Maps URL
- Display parsed location name and coordinates
- Show formatted address from Geocoding API
- List all existing locations
- Edit/delete locations
- Toggle active status

## Implementation Phases

### Phase 1: URL Parser Utility

- Create utility function to parse Google Maps URLs
- Support multiple URL formats:
- Place URLs: `https://www.google.com/maps/place/...`
- Coordinate URLs: `https://www.google.com/maps/@lat,lon,zoom`
- Search URLs: `https://www.google.com/maps/search/...`
- Extract location name and coordinates
- Return structured data or error

### Phase 2: Google Geocoding API Integration

- Set up Google Geocoding API client
- Create server-side function to call reverse geocoding
- Handle API responses and errors
- Extract formatted address and components
- Cache results to minimize API calls

### Phase 3: Server Action

- Create `addCheckInLocation()` server action
- Accept Google Maps URL as input
- Parse URL to get coordinates
- Call Geocoding API to get address
- Validate and store in database
- Return success/error response

### Phase 4: HR Admin UI

- Create location management page
- Form with URL input field
- Display parsed information preview
- Show list of existing locations
- Edit/delete functionality
- Active/inactive toggle

## Data Flow

1. **HR Admin Input**: Pastes Google Maps URL
2. **URL Parsing**: Extract name, lat, lon from URL
3. **Geocoding**: Fetch detailed address using coordinates
4. **Validation**: Ensure coordinates are valid, address is retrieved
5. **Storage**: Save to `check_in_locations` table with:

- Name (from URL or address)
- Latitude and longitude
- Formatted address
- Google Maps URL (original)
- Default radius (50m)
- Active status (true)

6. **Confirmation**: Show success message with location details

## Error Handling

- **Invalid URL Format**: Show error message, ask for valid Google Maps URL
- **Missing Coordinates**: Cannot extract coordinates, show error
- **Geocoding API Failure**: Store location with basic info, show warning
- **Duplicate Location**: Check if similar coordinates exist, warn user
- **Database Error**: Show error message, allow retry

## User Experience

1. HR admin navigates to "Office Locations" page
2. Clicks "Add New Location" button
3. Pastes Google Maps URL in input field
4. Clicks "Parse & Add" button
5. System shows preview:

- Location name
- Coordinates
- Formatted address

6. HR admin confirms or edits details
7. Location is saved and appears in list
8. Location can be used for check-in validation

## Future Enhancements

- **Manual Entry**: Allow direct coordinate/address input without URL
- **Map Preview**: Show location on map before saving
- **Radius Customization**: Allow setting custom radius per location
- **Bulk Import**: Import multiple locations from CSV
- **Location History**: Track when locations were added/modified

## Dependencies

- Google Maps Geocoding API key (environment variable)
- `check_in_locations` table (from GPS check-in feature)
- HR admin authentication and authorization
- URL parsing library or custom regex implementation

## Security Considerations

- Validate Google Maps URL format before processing

````
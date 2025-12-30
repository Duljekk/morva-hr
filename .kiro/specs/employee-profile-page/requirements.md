# Requirements Document

## Introduction

This document defines the requirements for the Employee Profile Page feature in the MorvaHR employee mobile app. The profile page displays the logged-in employee's personal information, leave balances with visual indicators, and a history of their leave requests. This page is accessible via the Profile tab in the floating navigation bar.

## Glossary

- **Profile_Page**: The employee-facing page that displays personal information, leave balances, and leave request history
- **Leave_Balance_Card**: A card component displaying the employee's remaining leave days for each leave type with visual bar indicators
- **Leave_Balance_Bar**: A visual indicator showing used vs remaining leave days using colored segments
- **Leave_Request_Item**: A list item displaying a single leave request with type, date range, and status
- **Role_Badge**: A badge component displaying the employee's role (e.g., Intern, Full-time)
- **Settings_Button**: A ghost button in the top-right corner for accessing profile settings
- **Banner**: The sky-blue header area at the top of the profile page

## Requirements

### Requirement 1: Profile Header Display

**User Story:** As an employee, I want to see my profile picture, name, role, and email at the top of my profile page, so that I can verify my account information.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a sky-blue banner (bg-sky-50) at the top spanning the full width
2. THE Profile_Page SHALL display the employee's profile picture as a 96px circular avatar with a white border
3. THE Profile_Page SHALL display the employee's full name in 18px semibold text (neutral-800)
4. THE Profile_Page SHALL display the employee's role using the Role_Badge component next to their name
5. THE Profile_Page SHALL display the employee's email address with a mail icon in 14px regular text (neutral-500)
6. WHEN the profile picture is not available, THE Profile_Page SHALL display a placeholder avatar

### Requirement 2: Settings Access

**User Story:** As an employee, I want to access my profile settings, so that I can update my preferences.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a Settings_Button in the top-right corner of the banner
2. THE Settings_Button SHALL be a 30px ghost button with a settings/gear icon
3. WHEN the Settings_Button is tapped, THE Profile_Page SHALL navigate to the profile settings page

### Requirement 3: Leave Balances Display

**User Story:** As an employee, I want to see my remaining leave balances for each leave type, so that I can plan my time off accordingly.

#### Acceptance Criteria

1. THE Leave_Balance_Card SHALL display a "Leave Balances" title in 16px medium text (neutral-600)
2. THE Leave_Balance_Card SHALL display leave balances for: Paid Time Off, Work from Home, and Sick Leave
3. FOR EACH leave type, THE Leave_Balance_Card SHALL display the leave type name in 14px medium text (neutral-800)
4. FOR EACH leave type, THE Leave_Balance_Card SHALL display a Leave_Balance_Bar showing used vs remaining days
5. FOR EACH leave type, THE Leave_Balance_Card SHALL display a badge showing "used/total" (e.g., "10/12") in emerald color
6. THE Leave_Balance_Bar SHALL use emerald-500 color for remaining days and neutral-200 border for used days
7. THE Leave_Balance_Card SHALL have a white background with subtle shadow and 10px border radius

### Requirement 4: Leave Balance Bar Visualization

**User Story:** As an employee, I want to see a visual representation of my leave balance, so that I can quickly understand how many days I have remaining.

#### Acceptance Criteria

1. THE Leave_Balance_Bar SHALL display one segment (6px wide, 16px tall, 4px border radius) for each day of leave allocation
2. THE Leave_Balance_Bar SHALL fill segments with emerald-500 color for remaining days
3. THE Leave_Balance_Bar SHALL display empty segments with neutral-200 border for used days
4. THE Leave_Balance_Bar SHALL have 4px gap between segments
5. FOR ALL leave types, THE Leave_Balance_Bar SHALL accurately reflect the ratio of remaining to total days

### Requirement 5: Leave Requests History

**User Story:** As an employee, I want to see my recent leave requests and their statuses, so that I can track my time-off history.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a "Leave Requests" card below the leave balances
2. THE Leave_Requests card SHALL display a list of the employee's leave requests
3. FOR EACH Leave_Request_Item, THE Profile_Page SHALL display an icon representing the leave type
4. FOR EACH Leave_Request_Item, THE Profile_Page SHALL display the leave type name in 14px medium text (neutral-800)
5. FOR EACH Leave_Request_Item, THE Profile_Page SHALL display the date range in 12px medium text (neutral-400)
6. FOR EACH Leave_Request_Item, THE Profile_Page SHALL display a status badge (Pending: amber, Approved: green)
7. THE Leave_Requests card SHALL have a white background with subtle shadow and 12px border radius
8. WHEN there are no leave requests, THE Profile_Page SHALL display an appropriate empty state message

### Requirement 6: Page Layout and Styling

**User Story:** As an employee, I want the profile page to have a clean, consistent design, so that I can easily read my information.

#### Acceptance Criteria

1. THE Profile_Page SHALL have a white background
2. THE Profile_Page SHALL have 24px horizontal padding
3. THE Profile_Page SHALL have appropriate bottom padding to account for the floating navigation bar
4. THE Profile_Page SHALL use consistent spacing (12px gap between major sections, 16px gap within cards)
5. THE Profile_Page SHALL be scrollable when content exceeds viewport height

### Requirement 7: Data Loading

**User Story:** As an employee, I want to see my profile data load quickly, so that I can access my information without delay.

#### Acceptance Criteria

1. WHEN the Profile_Page loads, THE system SHALL fetch the current user's profile data
2. WHEN the Profile_Page loads, THE system SHALL fetch the user's leave balances
3. WHEN the Profile_Page loads, THE system SHALL fetch the user's leave request history
4. WHILE data is loading, THE Profile_Page SHALL display appropriate loading states
5. IF data fetching fails, THE Profile_Page SHALL display an error message with retry option

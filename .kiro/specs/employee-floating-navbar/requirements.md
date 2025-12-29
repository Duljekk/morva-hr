# Requirements Document

## Introduction

This document defines the requirements for implementing a floating navigation bar for the employee side of the MorvaHR application. The floating navbar provides a modern, pill-shaped navigation component that floats at the bottom center of the screen, allowing employees to navigate between key sections: Home (Dashboard), Attendance, Payslip, and Profile.

## Glossary

- **Floating_Navbar**: A pill-shaped navigation component that floats at the bottom center of the screen with a dark background (neutral-900)
- **Navigation_Item**: An individual clickable icon within the navbar representing a route
- **Active_State**: Visual state indicating the currently selected navigation item (white icon)
- **Inactive_State**: Visual state for non-selected navigation items (neutral-500 icon)
- **Employee_App**: The employee-facing portion of the MorvaHR application

## Requirements

### Requirement 1: Floating Navbar Display

**User Story:** As an employee, I want to see a floating navigation bar at the bottom of my screen, so that I can easily access different sections of the app.

#### Acceptance Criteria

1. THE Floating_Navbar SHALL display as a pill-shaped container with rounded corners (60px border-radius)
2. THE Floating_Navbar SHALL have a dark background color (neutral-900, #171717)
3. THE Floating_Navbar SHALL be positioned fixed at the bottom center of the viewport
4. THE Floating_Navbar SHALL contain exactly four Navigation_Items: Home, Attendance, Payslip, and Profile
5. THE Floating_Navbar SHALL have internal padding of 8px and gap of 12px between items
6. WHEN the page loads, THE Floating_Navbar SHALL be visible and accessible

### Requirement 2: Navigation Item Display

**User Story:** As an employee, I want each navigation item to display as a recognizable icon, so that I can quickly identify where each link leads.

#### Acceptance Criteria

1. EACH Navigation_Item SHALL display as a 40x40px touch target containing a 24x24px icon
2. THE Home Navigation_Item SHALL display a house/home-door icon
3. THE Attendance Navigation_Item SHALL display a calendar-days icon
4. THE Payslip Navigation_Item SHALL display a receipt/bill icon
5. THE Profile Navigation_Item SHALL display a person/avatar icon
6. EACH Navigation_Item SHALL be centered within its touch target area

### Requirement 3: Active State Indication

**User Story:** As an employee, I want to clearly see which section I'm currently viewing, so that I always know my location within the app.

#### Acceptance Criteria

1. WHEN a Navigation_Item corresponds to the current route, THE Navigation_Item icon SHALL display in white color (#FFFFFF)
2. WHEN a Navigation_Item does not correspond to the current route, THE Navigation_Item icon SHALL display in neutral-500 color (#525252)
3. THE Active_State SHALL update immediately when navigation occurs
4. ONLY one Navigation_Item SHALL display Active_State at any time

### Requirement 4: Navigation Functionality

**User Story:** As an employee, I want to tap on navigation items to move between sections, so that I can access different features of the app.

#### Acceptance Criteria

1. WHEN a user taps on the Home Navigation_Item, THE Employee_App SHALL navigate to the dashboard route (/)
2. WHEN a user taps on the Attendance Navigation_Item, THE Employee_App SHALL navigate to the attendance route (/attendance)
3. WHEN a user taps on the Payslip Navigation_Item, THE Employee_App SHALL navigate to the payslip route (/payslip)
4. WHEN a user taps on the Profile Navigation_Item, THE Employee_App SHALL navigate to the profile route (/profile)
5. WHEN navigation occurs, THE Floating_Navbar SHALL remain visible and update Active_State accordingly

### Requirement 5: Accessibility

**User Story:** As an employee using assistive technology, I want the navigation bar to be accessible, so that I can navigate the app effectively.

#### Acceptance Criteria

1. THE Floating_Navbar SHALL be wrapped in a semantic `<nav>` element
2. EACH Navigation_Item SHALL have an accessible label describing its destination
3. WHEN a Navigation_Item is active, THE Navigation_Item SHALL have aria-current="page" attribute
4. THE Floating_Navbar SHALL maintain a z-index that keeps it above page content

### Requirement 6: Responsive Behavior

**User Story:** As an employee using different devices, I want the navigation bar to remain centered and properly sized, so that I can use it comfortably on any screen.

#### Acceptance Criteria

1. THE Floating_Navbar SHALL remain horizontally centered regardless of viewport width
2. THE Floating_Navbar SHALL maintain consistent sizing across different screen sizes
3. THE Floating_Navbar SHALL have appropriate bottom margin/padding from the viewport edge (safe area consideration)

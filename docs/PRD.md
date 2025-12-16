# Product Requirements Document (PRD)
## MorvaHR - Mobile HR Management Application

**Version:** 1.0  
**Last Updated:** January 2025  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Overview
MorvaHR is a mobile-first Human Resources management application designed to streamline employee attendance tracking, leave management, and HR administrative tasks. The application serves both employees and HR administrators with role-based access control, real-time notifications, and a modern, intuitive user interface.

### 1.2 Problem Statement
Traditional HR management systems are often desktop-centric, complex, and lack real-time capabilities. Employees need a simple, mobile-friendly way to:
- Track daily attendance (check-in/check-out)
- Request and manage leave
- Stay informed about company announcements
- Access payslips and HR information

HR administrators need efficient tools to:
- Monitor employee attendance in real-time
- Process leave requests
- Manage company-wide communications
- Generate reports and insights

### 1.3 Solution
A mobile-first web application that provides:
- Real-time attendance tracking with status indicators
- Streamlined leave request workflow with document attachments
- Company announcement system with engagement tracking
- Real-time notification system with push notifications
- HR dashboard with analytics and activity monitoring
- Secure, role-based access control

### 1.4 Target Users
- **Primary Users**: Employees (all staff members)
- **Secondary Users**: HR Administrators (HR team members)

---

## 2. Product Goals & Success Metrics

### 2.1 Business Goals
1. **Reduce HR Administrative Overhead**: Automate attendance tracking and leave management
2. **Improve Employee Experience**: Provide easy-to-use mobile interface for HR tasks
3. **Increase Transparency**: Real-time visibility into attendance and leave status
4. **Enhance Communication**: Centralized announcement and notification system

### 2.2 Success Metrics
- **Adoption Rate**: 90%+ of employees using the app within 3 months
- **Attendance Accuracy**: 95%+ accurate check-in/check-out records
- **Leave Processing Time**: Average leave request processing time < 24 hours
- **User Engagement**: 80%+ daily active users
- **Notification Open Rate**: 70%+ notification engagement rate

---

## 3. User Personas

### 3.1 Employee Persona
**Name**: Sarah, Software Developer  
**Age**: 28  
**Goals**:
- Quickly check in/out at work
- Request leave with minimal friction
- Stay updated on company announcements
- Access payslips on the go

**Pain Points**:
- Desktop-only systems are inconvenient
- Complex leave request processes
- Lack of real-time updates on request status

### 3.2 HR Admin Persona
**Name**: Michael, HR Manager  
**Age**: 35  
**Goals**:
- Monitor team attendance in real-time
- Efficiently process leave requests
- Communicate important updates to all employees
- Generate attendance and leave reports

**Pain Points**:
- Manual attendance tracking is time-consuming
- Difficult to track leave balances
- Lack of visibility into employee activities

---

## 4. Core Features

### 4.1 Authentication & User Management

#### 4.1.1 User Authentication
- **Email/Password Login**: Secure authentication via Supabase Auth
- **Session Management**: Cookie-based sessions with auto-refresh
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access**: Employee and HR Admin roles

#### 4.1.2 User Profiles
- **Profile Information**: Full name, username, email, employee ID
- **Role Assignment**: Employee or HR Admin
- **Shift Configuration**: Customizable shift start/end hours per user
- **Active Status**: Enable/disable user accounts

**Acceptance Criteria**:
- Users can log in with email and password
- Sessions persist across browser sessions
- Unauthenticated users are redirected to login
- Role-based access control is enforced

---

### 4.2 Attendance Management

#### 4.2.1 Check-In/Check-Out
- **Real-Time Clock**: Live clock display showing current time
- **Check-In**: Record check-in time with automatic status calculation
- **Check-Out**: Record check-out time with early departure detection
- **Status Indicators**:
  - **Check-In**: On-time (within 1 minute of shift start) or Late
  - **Check-Out**: On-time, Overtime, or Left Early
- **Time Tolerance**: 1-minute grace period for on-time status

#### 4.2.2 Attendance Tracking
- **Daily Records**: One attendance record per user per day
- **Time Calculation**: Automatic calculation of total hours and overtime
- **Status Tracking**: Late check-ins, early check-outs, and overtime hours
- **Historical View**: Access to past attendance records

#### 4.2.3 Attendance Display
- **Today's Attendance Card**: Shows check-in/check-out times and status
- **Recent Activities**: Timeline view of past 3 days of attendance
- **Status Badges**: Visual indicators for late, on-time, overtime, left early
- **Duration Display**: Time remaining until shift end or overtime duration

**Acceptance Criteria**:
- Users can check in once per day
- Check-out can only occur after check-in
- Status is calculated automatically based on shift times
- Attendance records are displayed in chronological order
- Real-time clock updates every second

**Business Rules**:
- Default shift: 11:00 AM - 7:00 PM (configurable per user)
- Check-in allowed from shift start time onwards
- One check-in and one check-out per day maximum
- Total hours and overtime calculated automatically

---

### 4.3 Leave Management

#### 4.3.1 Leave Types
- **Annual Leave**: Paid time off with annual allocation
- **Sick Leave**: Medical leave with optional document requirement
- **Unpaid Leave**: Leave without pay
- **Configurable Types**: Leave types can be enabled/disabled and configured

#### 4.3.2 Leave Request Workflow
- **Date Selection**: Calendar-based start and end date selection
- **Day Type**: Full day or half day (for single-day requests)
- **Leave Type Selection**: Choose from available leave types
- **Reason**: Required text field for leave reason
- **Attachments**: Optional file uploads (medical certificates, etc.)
- **Validation**: 
  - Cannot submit if active leave request exists
  - End date must be >= start date
  - Required fields must be filled
  - File size and type validation

#### 4.3.3 Leave Request Status
- **Pending**: Awaiting HR approval
- **Approved**: Leave request approved by HR
- **Rejected**: Leave request rejected with reason
- **Cancelled**: Request cancelled by employee

#### 4.3.4 Leave Balance Tracking
- **Annual Balance**: Track remaining leave days per type per year
- **Allocation**: Annual leave allocation per employee
- **Usage**: Automatic deduction when leave is approved
- **Balance Display**: Show available leave balance when requesting

#### 4.3.5 Leave Request Details
- **Request Information**: Dates, type, reason, status
- **Timeline**: Requested date, approval/rejection date
- **Attachments**: View uploaded documents
- **Status History**: Track status changes over time

**Acceptance Criteria**:
- Employees can submit leave requests with required information
- Only one active leave request per user at a time
- HR admins can approve/reject leave requests
- Leave balances update automatically upon approval
- File attachments are securely stored and accessible

**Business Rules**:
- Leave requests require HR approval (configurable per leave type)
- Some leave types require document attachments
- Leave balances are tracked per year
- Approved leave automatically deducts from balance

---

### 4.4 Announcements

#### 4.4.1 Announcement Creation (HR Only)
- **Title**: Required announcement title
- **Content**: Announcement body text
- **Scheduling**: Optional scheduled publish time
- **Active Status**: Enable/disable announcements

#### 4.4.2 Announcement Display
- **Banner**: Homepage banner showing active announcements
- **Bottom Sheet**: Full announcement details in modal
- **View Tracking**: Track which users have viewed announcements
- **Reactions**: Users can react to announcements (emoji-based)

#### 4.4.3 Announcement Management
- **Active Announcements**: Only active announcements are displayed
- **Scheduled Publishing**: Announcements can be scheduled for future display
- **View History**: Track announcement views per user

**Acceptance Criteria**:
- HR admins can create and manage announcements
- Active announcements appear on employee homepages
- Announcement views are tracked
- Users can react to announcements
- Announcements can be scheduled for future display

---

### 4.5 Notifications

#### 4.5.1 Notification Types
- **Leave Notifications**: 
  - Leave request sent confirmation
  - Leave request approved
  - Leave request rejected
- **Payslip Notifications**: New payslip available
- **Announcement Notifications**: New company announcement
- **Attendance Reminders**: Check-in/check-out reminders

#### 4.5.2 Notification Features
- **Real-Time Updates**: Supabase real-time subscriptions
- **Push Notifications**: Browser push notifications (Web Push API)
- **Read Status**: Track read/unread notifications
- **Grouping**: Notifications grouped by date (Today, Yesterday, etc.)
- **Action Links**: Notifications link to relevant content (leave details, etc.)

#### 4.5.3 Notification Management
- **Mark as Read**: Individual and bulk mark as read
- **Notification Center**: Dedicated notifications page
- **Auto-Mark Read**: Notifications marked as read when viewed
- **Push Subscription**: Users can enable/disable push notifications

**Acceptance Criteria**:
- Notifications are delivered in real-time
- Users receive push notifications when enabled
- Notifications are grouped chronologically
- Clicking notifications opens relevant content
- Read status is tracked and persisted

---

### 4.6 HR Dashboard

#### 4.6.1 Dashboard Statistics
- **Headcount**: Total number of active employees
- **Present**: Number of employees checked in today
- **Late**: Number of employees who checked in late today
- **On Leave**: Number of employees currently on approved leave

#### 4.6.2 Activity Feed
- **Recent Activities**: All employee check-in/check-out activities
- **Grouped by Date**: Activities grouped by day
- **Employee Information**: Shows employee name and activity details
- **Status Indicators**: Visual indicators for late, on-time, overtime, etc.

#### 4.6.3 Quick Actions
- **Leave Management**: Access to leave request approval interface
- **Payslip Management**: Access to payslip generation and management
- **Employee Management**: Access to employee profiles and settings

**Acceptance Criteria**:
- Dashboard displays real-time statistics
- Activity feed shows all employee activities
- Statistics update automatically
- Quick actions navigate to relevant pages
- Dashboard is only accessible to HR admins

---

### 4.7 Payslips

#### 4.7.1 Payslip Management (HR Only)
- **Generation**: HR admins can generate payslips
- **Monthly Records**: One payslip per employee per month
- **PDF Storage**: Payslips stored as PDF files
- **Metadata**: Gross salary, net salary, deductions, allowances

#### 4.7.2 Payslip Access (Employees)
- **View Payslips**: Employees can view their payslips
- **Download**: Download payslip PDFs
- **Monthly History**: Access to historical payslips
- **Notification**: Receive notification when new payslip is available

**Acceptance Criteria**:
- HR admins can generate and upload payslips
- Employees can view and download their payslips
- Payslips are stored securely
- Employees receive notifications for new payslips

---

## 5. Technical Requirements

### 5.1 Technology Stack
- **Frontend Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-Time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Push Notifications**: Web Push API

### 5.2 Architecture
- **Client-Side Rendering**: React components with client-side state
- **Server Actions**: Next.js server actions for data mutations
- **Real-Time Subscriptions**: Supabase real-time for live updates
- **Row Level Security**: Database-level access control
- **Middleware**: Route protection and authentication

### 5.3 Database Schema
- **Users**: User profiles and roles
- **Attendance Records**: Daily check-in/check-out data
- **Leave Types**: Predefined leave categories
- **Leave Requests**: Leave applications and approvals
- **Leave Balances**: Annual leave balance tracking
- **Leave Attachments**: File attachments for leave requests
- **Announcements**: Company announcements
- **Announcement Views**: View tracking
- **Announcement Reactions**: User reactions to announcements
- **Notifications**: User notifications
- **Push Subscriptions**: Browser push notification subscriptions
- **Payslips**: Employee payslip records

### 5.4 Security Requirements
- **Authentication**: Secure email/password authentication
- **Authorization**: Role-based access control (RBAC)
- **Row Level Security**: Database-level data isolation
- **File Upload Security**: File type and size validation
- **HTTPS**: All communications encrypted
- **Session Management**: Secure cookie-based sessions

### 5.5 Performance Requirements
- **Page Load Time**: < 2 seconds initial load
- **Time to Interactive**: < 3 seconds
- **Real-Time Updates**: < 1 second latency
- **Database Queries**: < 100ms average response time
- **File Upload**: Support files up to 10MB

### 5.6 Browser Support
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Desktop Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Progressive Web App**: PWA capabilities for mobile installation

---

## 6. User Interface & Design

### 6.1 Design System
- **Base Width**: 375px (iPhone SE)
- **Max Width**: 402px
- **Color Palette**:
  - Neutral scale (50-800)
  - Amber (late status)
  - Green (on-time status)
  - Teal (announcements)
  - Yellow (check-in)
  - Purple (check-out)
- **Typography**: Mona Sans (400, 500, 600, 700)
- **Spacing**: Consistent 4px grid system

### 6.2 Mobile-First Design
- **Touch Targets**: Minimum 44x44px
- **Responsive Layout**: Adapts to different screen sizes
- **Gesture Support**: Swipe to dismiss, pull to refresh
- **Bottom Sheets**: Mobile-friendly modal patterns
- **Sticky Headers**: Navigation headers stick to top on scroll

### 6.3 Key UI Components
- **Check-In/Out Widget**: Large, prominent clock and action button
- **Attendance Cards**: Compact cards showing check-in/out status
- **Calendar**: Date picker for leave requests
- **Notification Button**: Badge showing unread count
- **Toast Notifications**: Non-intrusive success/error messages
- **Modals**: Confirmation and detail modals
- **Bottom Sheets**: Slide-up panels for selections

---

## 7. User Flows

### 7.1 Employee Daily Flow
1. User opens app and sees homepage
2. Views current time and today's date
3. Sees active announcement (if any)
4. Checks in by tapping "Check In" button
5. Redirected to check-in success page
6. Returns to homepage, sees check-in time recorded
7. Throughout day, can view attendance log
8. At end of day, checks out via "Check Out" button
9. Receives confirmation toast

### 7.2 Leave Request Flow
1. User taps "Request Leave" button
2. Navigates to leave request page
3. Selects start and end dates via calendar
4. Chooses leave type (Annual, Sick, Unpaid)
5. Selects full day or half day (if single day)
6. Enters reason for leave
7. Optionally uploads attachments
8. Reviews and submits request
9. Receives confirmation notification
10. Can view request status on homepage
11. Receives notification when approved/rejected

### 7.3 HR Approval Flow
1. HR admin views dashboard
2. Sees leave request in activity feed or dedicated page
3. Opens leave request details
4. Reviews dates, reason, and attachments
5. Approves or rejects request
6. If rejected, enters rejection reason
7. Employee receives notification of decision
8. Leave balance updates automatically (if approved)

### 7.4 Notification Flow
1. System generates notification (leave approved, etc.)
2. Notification appears in real-time via Supabase Realtime
3. User receives push notification (if enabled)
4. Notification badge updates on homepage
5. User taps notification button
6. Views notifications grouped by date
7. Taps notification to view details
8. Notification marked as read automatically

---

## 8. Non-Functional Requirements

### 8.1 Usability
- **Intuitive Navigation**: Clear, consistent navigation patterns
- **Error Messages**: Helpful, actionable error messages
- **Loading States**: Clear loading indicators
- **Empty States**: Informative empty state messages
- **Accessibility**: WCAG 2.1 AA compliance

### 8.2 Reliability
- **Uptime**: 99.5% availability
- **Error Handling**: Graceful error handling and recovery
- **Data Backup**: Daily automated backups
- **Disaster Recovery**: Recovery time objective (RTO) < 4 hours

### 8.3 Scalability
- **User Capacity**: Support 1000+ concurrent users
- **Database**: Optimized queries with proper indexing
- **Caching**: Strategic caching for frequently accessed data
- **CDN**: Static assets served via CDN

### 8.4 Maintainability
- **Code Quality**: TypeScript for type safety
- **Documentation**: Comprehensive code and API documentation
- **Testing**: Unit and integration tests
- **Version Control**: Git-based version control

---

## 9. Future Enhancements (Roadmap)

### 9.1 Phase 2 Features
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Report Generation**: Automated attendance and leave reports
- **Settings Page**: User preferences and account settings
- **Bottom Navigation**: Persistent navigation bar
- **Offline Support**: Basic offline functionality with sync

### 9.2 Phase 3 Features
- **Team Management**: Department and team organization
- **Shift Management**: Multiple shift types and schedules
- **Overtime Approval**: Overtime request and approval workflow
- **Expense Management**: Expense tracking and reimbursement
- **Performance Reviews**: Performance review and feedback system

### 9.3 Phase 4 Features
- **Mobile Apps**: Native iOS and Android applications
- **Biometric Authentication**: Face ID, Touch ID, fingerprint
- **Geolocation**: Location-based check-in verification
- **Advanced Analytics**: HR analytics dashboard with insights
- **Integration APIs**: Third-party system integrations

---

## 10. Constraints & Assumptions

### 10.1 Constraints
- **Mobile-First**: Primary focus on mobile experience
- **Browser-Based**: Web application, not native apps (initially)
- **Internet Required**: Requires active internet connection
- **Supabase Dependency**: Relies on Supabase infrastructure

### 10.2 Assumptions
- Users have modern smartphones with internet access
- Users are familiar with basic mobile app interactions
- HR admins have desktop/laptop access for administrative tasks
- Company has stable internet infrastructure
- Employees work in single timezone (initially)

---

## 11. Success Criteria

### 11.1 Launch Criteria
- ✅ All core features implemented and tested
- ✅ Security audit completed
- ✅ Performance benchmarks met
- ✅ User acceptance testing completed
- ✅ Documentation complete
- ✅ Training materials prepared

### 11.2 Post-Launch Criteria
- 90%+ user adoption within 3 months
- < 5% error rate
- 4+ star user rating
- < 24 hour average support response time
- 99.5%+ uptime

---

## 12. Appendix

### 12.1 Glossary
- **Check-In**: Recording arrival time at work
- **Check-Out**: Recording departure time from work
- **Leave Request**: Employee request for time off
- **HR Admin**: Human Resources administrator role
- **RLS**: Row Level Security (database security feature)
- **PWA**: Progressive Web App

### 12.2 References
- Figma Design: [Internal HR Dashboard](https://www.figma.com/design/znCRyyCZMXUbcctl8vSUdD/Internal-HR-Dashboard)
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs

### 12.3 Change Log
- **v1.0** (January 2025): Initial PRD creation

---

**Document Owner**: Product Team  
**Stakeholders**: Engineering, Design, HR, Management  
**Review Cycle**: Quarterly


















































# Mobile HR App

A mobile-first HR application built with Next.js, React, and Tailwind CSS, based on Figma design specifications.

## Features

- ✅ **Check In / Check Out** - Track your work attendance with real-time clock
- ✅ **Status Indicators** - See if you're late, on time, or working overtime
- ✅ **Attendance Log** - View your daily check-in/check-out records
- ✅ **Recent Activities** - Timeline view of past attendance records
- ✅ **Request Leave** - Quick access to request time off
- ✅ **Announcements** - Stay updated with company announcements

## Tech Stack

- **Framework**: Next.js 16.0.1
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS v4
- **Font**: Mona Sans (400, 500, 600, 700 weights)
- **TypeScript**: Type-safe development

## Design System

### Colors (from Figma)

- **Neutral Scale**: 50, 100, 200, 300, 400, 500, 600, 700, 800
- **Amber** (Late Status): 100, 600, 700
- **Green** (On Time Status): 100, 700
- **Teal** (Announcements): 50, 100, 400, 700
- **Yellow** (Check In): 50
- **Purple** (Check Out): 100

### Typography

- **Display XL/Bold**: 60px, Bold (700), 72px line height
- **Text XL/Semibold**: 20px, Semibold (600), 30px line height
- **Text MD**: 16px, Regular (400) / Semibold (600), 20-24px line height
- **Text SM**: 14px, Regular (400) / Semibold (600), 18-20px line height
- **Text XS**: 12px, Medium (500) / Semibold (600), 16px line height

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd morvahr
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
morvahr/
├── app/
│   ├── components/
│   │   ├── Icons.tsx              # SVG icon components
│   │   ├── AnnouncementBanner.tsx # Announcement notification
│   │   ├── CheckInOutWidget.tsx   # Main check-in/out widget
│   │   ├── AttendanceCard.tsx     # Attendance log card
│   │   └── RecentActivities.tsx   # Activity timeline
│   ├── globals.css                # Global styles & Tailwind config
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main homepage
├── public/                        # Static assets
└── package.json                   # Dependencies
```

## Components

### CheckInOutWidget
The main widget for checking in/out with:
- Real-time clock display
- Check-In/Check-Out button
- Request Leave button
- Automatic time recording

### AttendanceCard
Displays check-in/check-out status with:
- Status indicators (Late, On Time, Remaining)
- Time stamps
- Duration tracking

### RecentActivities
Timeline view showing:
- Historical check-in/check-out records
- Status badges
- Date grouping

### AnnouncementBanner
Company announcements with:
- Teal color scheme
- Time display
- Click interaction

## Usage

### Check-In Process
1. View current time on the widget
2. Click "Check-In" button when starting work
3. Time is automatically recorded
4. Button changes to "Check-Out"

### View Attendance
- **Attendance Log**: Shows today's check-in/check-out
- **Recent Activities**: Displays past records grouped by date
- Status indicators show if you were late, on time, or overtime

### Request Leave
Click the "Request Leave" button to initiate leave request process (placeholder functionality).

## Mobile-First Design

The app is optimized for mobile devices:
- Base width: 375px (iPhone SE)
- Max width: 402px
- Responsive layout
- Touch-friendly buttons
- Optimized spacing and typography

## Future Enhancements

- [ ] Backend integration for data persistence
- [ ] Real leave request form
- [ ] Notification system
- [ ] User authentication
- [ ] Calendar integration
- [ ] Report generation
- [ ] Bottom navigation bar
- [ ] Settings page

## Design Reference

Based on Figma design: [Internal HR Dashboard](https://www.figma.com/design/znCRyyCZMXUbcctl8vSUdD/Internal-HR-Dashboard?node-id=127-3315)

## License

Private project - All rights reserved

## Support

For issues or questions, please contact the development team.

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

- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS v4
- **Font**: Mona Sans (400, 500, 600, 700 weights)
- **TypeScript**: Type-safe development
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

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

3. Set up environment variables:
   - Create a `.env.local` file in the project root
   - Add your Supabase credentials (see [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md))
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Quick Start with Authentication

For detailed authentication setup, see:
- **Quick Start**: [lib/auth/QUICKSTART.md](lib/auth/QUICKSTART.md)
- **Full Documentation**: [lib/auth/README.md](lib/auth/README.md)
- **Environment Setup**: [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

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
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── globals.css                # Global styles & Tailwind config
│   ├── layout.tsx                 # Root layout (with AuthProvider)
│   └── page.tsx                   # Main homepage
├── lib/
│   ├── auth/
│   │   ├── AuthContext.tsx        # React Context for auth state
│   │   ├── utils.ts               # Auth utility functions
│   │   ├── README.md              # Authentication documentation
│   │   ├── QUICKSTART.md          # Quick start guide
│   │   └── examples.tsx           # Usage examples
│   └── supabase/
│       ├── client.ts              # Client-side Supabase client
│       ├── server.ts              # Server-side Supabase client
│       └── types.ts               # Database TypeScript types
├── database/
│   └── schema.sql                 # Database schema for Supabase
├── middleware.ts                  # Route protection middleware
├── ENVIRONMENT_SETUP.md           # Environment variables guide
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

## Features Status

- [x] User authentication (Supabase Auth)
- [x] User profiles with roles (Employee, HR Admin)
- [x] Protected routes (Middleware)
- [x] Database integration (Supabase)
- [ ] Backend integration for data persistence (attendance, leaves)
- [ ] Real leave request form
- [ ] Notification system
- [ ] Calendar integration
- [ ] Report generation
- [ ] Bottom navigation bar
- [ ] Settings page

## Authentication Features

The app includes a complete authentication system:

- ✅ **Email/Password Authentication** - Secure login via Supabase
- ✅ **User Profiles** - Extended user data with roles and permissions
- ✅ **Role-Based Access** - Employee and HR Admin roles
- ✅ **Protected Routes** - Automatic redirects via middleware
- ✅ **Session Management** - Cookie-based sessions with auto-refresh
- ✅ **Type Safety** - Full TypeScript support for auth and database

See [lib/auth/README.md](lib/auth/README.md) for detailed documentation.

## Design Reference

Based on Figma design: [Internal HR Dashboard](https://www.figma.com/design/znCRyyCZMXUbcctl8vSUdD/Internal-HR-Dashboard?node-id=127-3315)

## License

Private project - All rights reserved

## Support

For issues or questions, please contact the development team.

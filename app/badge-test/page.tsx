'use client';

import Badge from '@/app/components/Badge';
import AttendanceBadge, { type AttendanceStatus, type LeaveStatus } from '@/app/components/AttendanceBadge';

export default function BadgeTestPage() {
  const badgeVariants: Array<{ variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string }> = [
    { variant: 'success', label: 'Success' },
    { variant: 'warning', label: 'Warning' },
    { variant: 'danger', label: 'Danger' },
    { variant: 'neutral', label: 'Neutral' },
  ];

  const badgeSizes: Array<'sm' | 'md'> = ['sm', 'md'];

  const attendanceStatuses: AttendanceStatus[] = ['late', 'ontime', 'overtime', 'leftearly'];
  const leaveStatuses: LeaveStatus[] = ['pending', 'approved', 'rejected'];

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-2">Badge Component Test</h1>
          <p className="text-sm text-neutral-600">All variants and sizes of the Badge component</p>
        </div>

        {/* Badge Variants Section */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Badge Variants (with Icons)</h2>
          
          <div className="space-y-6">
            {badgeSizes.map((size) => (
              <div key={size}>
                <h3 className="text-sm font-medium text-neutral-600 mb-3 capitalize">
                  Size: {size}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {badgeVariants.map(({ variant, label }) => (
                    <Badge key={`${variant}-${size}`} variant={variant} size={size} showIcon={true}>
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Badge Variants without Icons */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Badge Variants (without Icons)</h2>
          
          <div className="space-y-6">
            {badgeSizes.map((size) => (
              <div key={size}>
                <h3 className="text-sm font-medium text-neutral-600 mb-3 capitalize">
                  Size: {size}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {badgeVariants.map(({ variant, label }) => (
                    <Badge key={`${variant}-${size}-no-icon`} variant={variant} size={size} showIcon={false}>
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Badge with Custom Text Section */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Badge with Custom Text (with Icons)</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Size: sm</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success" size="sm" showIcon={true}>Approved</Badge>
                <Badge variant="warning" size="sm" showIcon={true}>Pending Review</Badge>
                <Badge variant="danger" size="sm" showIcon={true}>Rejected</Badge>
                <Badge variant="neutral" size="sm" showIcon={true}>Nov 21, 2025</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Size: md</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="success" size="md" showIcon={true}>Approved</Badge>
                <Badge variant="warning" size="md" showIcon={true}>Pending Review</Badge>
                <Badge variant="danger" size="md" showIcon={true}>Rejected</Badge>
                <Badge variant="neutral" size="md" showIcon={true}>Nov 21, 2025</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* AttendanceBadge Section */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">AttendanceBadge Component</h2>
          
          <div className="space-y-6">
            {/* Attendance Statuses */}
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Attendance Statuses</h3>
              <div className="space-y-4">
                {badgeSizes.map((size) => (
                  <div key={`attendance-${size}`}>
                    <p className="text-xs text-neutral-500 mb-2 capitalize">Size: {size}</p>
                    <div className="flex flex-wrap gap-3">
                      {attendanceStatuses.map((status) => (
                        <AttendanceBadge 
                          key={`${status}-${size}`} 
                          status={status} 
                          size={size}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Statuses */}
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-3">Leave Statuses</h3>
              <div className="space-y-4">
                {badgeSizes.map((size) => (
                  <div key={`leave-${size}`}>
                    <p className="text-xs text-neutral-500 mb-2 capitalize">Size: {size}</p>
                    <div className="flex flex-wrap gap-3">
                      {leaveStatuses.map((status) => (
                        <AttendanceBadge 
                          key={`${status}-${size}`} 
                          status={status} 
                          size={size}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Variant Mapping Reference */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Status to Variant Mapping</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-2">Attendance Statuses</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">Late</Badge>
                  <span className="text-neutral-600">→ warning variant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">On Time</Badge>
                  <span className="text-neutral-600">→ success variant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">Overtime</Badge>
                  <span className="text-neutral-600">→ neutral variant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">Left Early</Badge>
                  <span className="text-neutral-600">→ warning variant</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-600 mb-2">Leave Statuses</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">Pending</Badge>
                  <span className="text-neutral-600">→ warning variant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">Approved</Badge>
                  <span className="text-neutral-600">→ success variant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger" size="sm">Rejected</Badge>
                  <span className="text-neutral-600">→ danger variant</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


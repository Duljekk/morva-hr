'use client';

import { useState } from 'react';
import EmployeeDetailsRightSection from '@/components/hr/employee/EmployeeDetailsRightSection';
import EmployeeActivitiesPanel from '@/components/hr/employee/EmployeeActivitiesPanel';
import BankDetailsCard from '@/components/hr/employee/BankDetailsCard';
import Avatar from '@/components/shared/Avatar';
import Badge from '@/components/shared/Badge';
import RoleBadge from '@/components/shared/RoleBadge';
import Tab from '@/components/shared/Tab';
import TabList from '@/components/shared/TabList';
import Tabs from '@/components/shared/Tabs';

export default function EmployeeDetailsTestPage() {
  const [activeMainTab, setActiveMainTab] = useState('personal');

  // Mock employee data
  const employee = {
    id: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    role: 'Full-time' as const,
    joinDate: 'March 15, 2022',
    location: 'San Francisco, CA',
    avatar: null,
    status: 'Active',
  };

  // Mock activities data matching the screenshot
  const attendanceGroups = [
    {
      id: 'today',
      label: 'Today',
      activities: [
        { id: 't1', type: 'checkIn' as const, time: '11:00', status: 'onTime' as const },
        { id: 't2', type: 'checkOut' as const, time: '19:20', status: 'overtime' as const },
      ],
    },
    {
      id: 'yesterday',
      label: 'Yesterday',
      activities: [
        { id: 'y1', type: 'checkIn' as const, time: '11:12', status: 'late' as const },
        { id: 'y2', type: 'checkOut' as const, time: '19:00', status: 'onTime' as const },
      ],
    },
    {
      id: 'dec6',
      label: 'December 6',
      isLast: true,
      activities: [
        { id: 'd1', type: 'checkIn' as const, time: '11:00', status: 'onTime' as const },
        { id: 'd2', type: 'checkOut' as const, time: '19:00', status: 'onTime' as const },
      ],
    },
  ];

  const leaveRequestGroups: typeof attendanceGroups = [];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span>HR</span>
            <span>/</span>
            <span>Employees</span>
            <span>/</span>
            <span className="text-neutral-900">{employee.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Employee Header Card - Full Width */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Avatar
                src={employee.avatar}
                alt={employee.name}
                size="xl"
                fallback={employee.name.split(' ').map(n => n[0]).join('')}
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-neutral-900">
                    {employee.name}
                  </h1>
                  <RoleBadge role={employee.role} />
                  <Badge variant="success" text={employee.status} />
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-neutral-500">Department</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {employee.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Position</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {employee.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Employee ID</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {employee.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Join Date</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {employee.joinDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,485px] gap-6">
          {/* Left Section - Activities Panel */}
          <div className="space-y-6">
            {/* Bank Details Card */}
            <BankDetailsCard
              bankName="Bank Central Asia (BCA)"
              recipientName="ABDUL ZAKI SYAHRUL R"
              accountNumber="4640286879"
              onCopy={(number) => {
                console.log('Copied account number:', number);
                // Could show a toast notification here
              }}
            />

            {/* Activities Panel */}
            <EmployeeActivitiesPanel
              attendanceGroups={attendanceGroups}
              leaveRequestGroups={leaveRequestGroups}
            />

            {/* Information Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-neutral-200 px-6 py-4">
                <Tabs aria-label="Employee information sections">
                  <TabList>
                    <Tab
                      label="Personal Info"
                      state={activeMainTab === 'personal' ? 'active' : 'default'}
                      onClick={() => setActiveMainTab('personal')}
                    />
                    <Tab
                      label="Employment"
                      state={activeMainTab === 'employment' ? 'active' : 'default'}
                      onClick={() => setActiveMainTab('employment')}
                    />
                    <Tab
                      label="Documents"
                      state={activeMainTab === 'documents' ? 'active' : 'default'}
                      onClick={() => setActiveMainTab('documents')}
                      hasNumber={true}
                      number={5}
                    />
                    <Tab
                      label="Time Off"
                      state={activeMainTab === 'timeoff' ? 'active' : 'default'}
                      onClick={() => setActiveMainTab('timeoff')}
                    />
                  </TabList>
                </Tabs>
              </div>

              <div className="p-6">
                {activeMainTab === 'personal' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-neutral-500">Email</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          {employee.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Phone</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          {employee.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Location</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          {employee.location}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Time Zone</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          PST (UTC-8)
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                        Emergency Contact
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-neutral-500">Name</label>
                          <p className="text-sm font-medium text-neutral-900 mt-1">
                            Jane Smith
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-500">Relationship</label>
                          <p className="text-sm font-medium text-neutral-900 mt-1">
                            Spouse
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-500">Phone</label>
                          <p className="text-sm font-medium text-neutral-900 mt-1">
                            +1 (555) 987-6543
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeMainTab === 'employment' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-neutral-500">Department</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          {employee.department}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Position</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          {employee.position}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Manager</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          Sarah Johnson
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Employment Type</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          Full-time
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Start Date</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          {employee.joinDate}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-neutral-500">Work Schedule</label>
                        <p className="text-sm font-medium text-neutral-900 mt-1">
                          Monday - Friday, 9:00 AM - 5:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeMainTab === 'documents' && (
                  <div className="text-center py-8">
                    <p className="text-neutral-500">5 documents available</p>
                    <p className="text-sm text-neutral-400 mt-2">
                      Contract, ID, Tax forms, etc.
                    </p>
                  </div>
                )}
                
                {activeMainTab === 'timeoff' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-500">Available Days</p>
                        <p className="text-2xl font-semibold text-neutral-900 mt-1">15</p>
                      </div>
                      <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-500">Used Days</p>
                        <p className="text-2xl font-semibold text-neutral-900 mt-1">7</p>
                      </div>
                      <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-500">Pending Requests</p>
                        <p className="text-2xl font-semibold text-neutral-900 mt-1">1</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Statistics and Activities */}
          <EmployeeDetailsRightSection
            employeeId={employee.id}
            className="lg:sticky lg:top-6"
          />
        </div>
      </div>
    </div>
  );
}
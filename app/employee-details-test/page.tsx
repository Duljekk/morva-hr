'use client';

import EmployeeDetailsRightSection from '@/components/hr/employee/EmployeeDetailsRightSection';
import EmployeeDetailsLeftSection, { EmployeeLeftSectionData } from '@/components/hr/employee/EmployeeDetailsLeftSection';
import BreadcrumbList from '@/components/shared/BreadcrumbList';
import BreadcrumbItem from '@/components/shared/Breadcrumb';
import BreadcrumbSeparator from '@/components/shared/BreadcrumbSeparator';
import { EmployeesIcon } from '@/components/icons';

/**
 * @deprecated This is a test page. The production page is at /hr/employees/[id]
 * 
 * Employee Details Test Page
 * 
 * This page is used for testing employee details components in isolation
 * without the HR sidebar navigation. For the production version with sidebar,
 * see: app/(hr)/hr/employees/[id]/page.tsx
 */
export default function EmployeeDetailsTestPage() {
  // Mock employee data for left section
  const employeeLeftData: EmployeeLeftSectionData = {
    name: 'Abdul Zaki Syahrul Rahmat',
    email: 'abdulzakisr@gmail.com',
    imageUrl: '/avatar-placeholder.jpg',
    role: 'Intern',
    birthDate: '10 December, 2001',
    salary: 'IDR 6.500.000',
    leaveBalance: { current: 8, total: 10 },
    contractPeriod: '8 Sep - 8 Dec 2025',
    bankDetails: {
      bankName: 'Bank Central Asia (BCA)',
      recipientName: 'ABDUL ZAKI SYAHRUL R',
      accountNumber: '4640286879',
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbList>
            <BreadcrumbItem label="HR" href="/hr" hasIcon={false} />
            <BreadcrumbSeparator />
            <BreadcrumbItem 
              label="Employees" 
              href="/hr/employees"
              icon={<EmployeesIcon size={16} />}
            />
            <BreadcrumbSeparator />
            <BreadcrumbItem 
              label={employeeLeftData.name} 
              isCurrent
              hasIcon={false}
            />
          </BreadcrumbList>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[28px] items-start">
          {/* Left Section - Employee Profile */}
          <EmployeeDetailsLeftSection
            employee={employeeLeftData}
            onMenuClick={() => {
              console.log('Menu clicked');
              // Could open a dropdown menu here
            }}
            onCopyAccountNumber={(number) => {
              console.log('Copied account number:', number);
              // Could show a toast notification here
            }}
          />

          {/* Right Section - Statistics and Activities */}
          <EmployeeDetailsRightSection
            employeeId="EMP001"
            className="lg:sticky lg:top-6"
          />
        </div>
      </div>
    </div>
  );
}
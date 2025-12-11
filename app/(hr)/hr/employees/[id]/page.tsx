'use client';

import { use } from 'react';
import EmployeeDetailsLeftSection, { EmployeeLeftSectionData } from '@/components/hr/employee/EmployeeDetailsLeftSection';
import EmployeeDetailsRightSection from '@/components/hr/employee/EmployeeDetailsRightSection';
import BreadcrumbList from '@/components/shared/BreadcrumbList';
import BreadcrumbItem from '@/components/shared/Breadcrumb';
import BreadcrumbSeparator from '@/components/shared/BreadcrumbSeparator';
import { EmployeesIcon } from '@/components/icons';

/**
 * Employee Details Page Props
 */
interface EmployeeDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * HR Employee Details Page
 * 
 * Displays detailed information about a specific employee for HR admins.
 * Based on Figma design node 587:1437 (Main Page).
 * 
 * Route: /hr/employees/[id]
 * 
 * This page is automatically wrapped by the HR layout which provides:
 * - Sidebar navigation
 * - Main content area wrapper
 * - Consistent styling
 * 
 * Layout specifications from Figma:
 * - Dashboard container: white background, rounded-bl-[16px], rounded-tl-[16px]
 * - Header: 66px height, 28px left padding, 24px right padding, border-bottom
 * - Main Contents: 100px horizontal padding, 40px top padding
 * - Left Section: 480px width
 * - Right Section: flex-grow with 28px left padding
 * - Gap between sections: 28px (handled by flex gap)
 * 
 * Features:
 * - Breadcrumb navigation
 * - Employee profile (left section)
 * - Statistics and activities (right section)
 * - Responsive layout
 */
export default function EmployeeDetailsPage({ params }: EmployeeDetailsPageProps) {
  const { id } = use(params);

  // TODO: Fetch employee data based on id
  // For now, using mock data
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
    <div
      className="box-border flex flex-col items-start relative size-full"
      data-name="Contents"
      data-node-id="587:1439"
    >
      {/* Header with Breadcrumb Navigation */}
      <div
        className="flex h-[66px] items-center justify-between pl-[28px] pr-[24px] py-[24px] w-full relative"
        data-name="Header"
        data-node-id="587:1440"
        style={{
          backgroundImage: 'linear-gradient(to right, #e5e5e5 50%, transparent 50%)',
          backgroundPosition: 'bottom',
          backgroundSize: '8px 1px',
          backgroundRepeat: 'repeat-x',
        }}
      >
        <BreadcrumbList>
          <BreadcrumbItem 
            label="Employee" 
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

      {/* Main Contents */}
      <div
        className="flex items-start justify-center pb-0 pt-[40px] px-[100px] w-full"
        data-name="Main Contents"
        data-node-id="587:1450"
      >
        <div
          className="flex items-start gap-[28px] w-full"
          data-name="Sections"
          data-node-id="587:1451"
        >
          {/* Left Section - Employee Profile */}
          <div className="flex-1">
            <EmployeeDetailsLeftSection
              employee={employeeLeftData}
              onMenuClick={() => {
                console.log('Menu clicked for employee:', id);
                // TODO: Implement employee options menu
              }}
              onCopyAccountNumber={(number) => {
                console.log('Copied account number:', number);
                // TODO: Show toast notification
              }}
            />
          </div>

          {/* Right Section - Statistics and Activities */}
          <div
            className="flex-1 flex flex-col gap-[24px] pb-[48px]"
            data-name="Right Section"
            data-node-id="587:1499"
          >
            <EmployeeDetailsRightSection
              employeeId={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}




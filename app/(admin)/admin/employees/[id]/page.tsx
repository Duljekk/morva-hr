/**
 * Employee Detail Page
 * 
 * Server component that fetches and displays employee details.
 * Route: /admin/employees/[id]
 * Based on Figma design node 587:1437
 */

import { notFound } from 'next/navigation';
import { getEmployeeDetailsById } from '@/lib/actions/hr/employeeDetails';
import EmployeeDetailsLeftSection from '@/components/hr/employee/EmployeeDetailsLeftSection';
import EmployeeDetailsRightSection from '@/components/hr/employee/EmployeeDetailsRightSection';
import BreadcrumbList from '@/components/shared/BreadcrumbList';
import BreadcrumbItem from '@/components/shared/Breadcrumb';
import { PeopleIcon, ChevronRightIcon } from '@/components/icons';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  const result = await getEmployeeDetailsById(id);

  if (result.error || !result.data) {
    notFound();
  }

  const { leftSection } = result.data;

  return (
    <div className="flex flex-col size-full">
      {/* Header with Breadcrumb Navigation */}
      <div className="sticky top-0 z-40 bg-white h-[66px] w-full border-b border-dashed border-[#e5e5e5] shrink-0">
        <div className="flex items-center h-full px-[28px]">
          <BreadcrumbList className="flex-1">
            <BreadcrumbItem
              label="Employee"
              href="/admin/employees"
              icon={<PeopleIcon className="size-[16px]" />}
            />
            <li role="presentation" aria-hidden="true" className="shrink-0">
              <ChevronRightIcon className="size-[16px] text-[#737373]" />
            </li>
            <BreadcrumbItem
              label={leftSection.name}
              isCurrent
              hasIcon={false}
            />
          </BreadcrumbList>
        </div>
      </div>

      {/* Main Contents */}
      <div className="flex-1 min-h-0">
        <div className="flex gap-[28px] px-[100px] pt-[40px] pb-[40px]">
          <div className="flex-1 min-w-0">
            <EmployeeDetailsLeftSection employee={leftSection} />
          </div>
          <div className="flex-1 min-w-0">
            <EmployeeDetailsRightSection employeeId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

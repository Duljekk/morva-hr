'use client';

import { useState } from 'react';
import EmployeesPageHeader from '@/components/hr/employees/EmployeesPageHeader';
import EmployeesActionRow from '@/components/hr/employees/EmployeesActionRow';
import EmployeesTableHeaderRow from '@/components/hr/employees/EmployeesTableHeaderRow';
import EmployeesGroupingRow from '@/components/hr/employees/EmployeesGroupingRow';
import EmployeeTableRow, { Employee } from '@/components/hr/employees/EmployeeTableRow';
import type { ViewType } from '@/components/shared/ToggleView';

// Sample employee data
const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Abdul Zaki Syahrul Rahmat',
    email: 'abdulzakisr@gmail.com',
    imageUrl: '/avatar-placeholder.jpg',
    role: 'Intern',
    birthDate: '10 December 2001',
    leaveBalance: { current: 8, total: 10 },
    contractPeriod: '8 Sep - 8 Dec 2025',
    status: { label: 'Checked in', isActive: true },
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    imageUrl: '/avatar-placeholder.jpg',
    role: 'Intern',
    birthDate: '15 March 2000',
    leaveBalance: { current: 4, total: 10 },
    contractPeriod: '1 Jan - 31 Dec 2025',
    status: { label: 'Checked out', isActive: false },
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john.doe@example.com',
    imageUrl: '/avatar-placeholder.jpg',
    role: 'Full-time',
    birthDate: '20 May 1995',
    leaveBalance: { current: 10, total: 10 },
    contractPeriod: '1 Jan - 31 Dec 2025',
    status: { label: 'Checked in', isActive: true },
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    imageUrl: '/avatar-placeholder.jpg',
    role: 'Full-time',
    birthDate: '3 August 1992',
    leaveBalance: { current: 2, total: 10 },
    contractPeriod: '1 Jan - 31 Dec 2025',
    status: { label: 'Checked in', isActive: true },
  },
];

// Group employees by role
const internEmployees = sampleEmployees.filter((emp) => emp.role === 'Intern');
const fullTimeEmployees = sampleEmployees.filter((emp) => emp.role === 'Full-time');

/**
 * HR Employees Page
 * 
 * Displays a list/table of employees for HR admins.
 * 
 * Route: /admin/employees
 * 
 * This page is automatically wrapped by the HR layout which provides:
 * - Sidebar navigation
 * - Main content area wrapper
 * - Consistent styling
 */
export default function EmployeesPage() {
  const [searchValue, setSearchValue] = useState('');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [sortValue, setSortValue] = useState('name-asc');
  const [filterValue, setFilterValue] = useState('all');
  const [allSelected, setAllSelected] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  const handleAddEmployee = () => {
    // TODO: Implement add employee functionality
    console.log('Add employee clicked');
  };

  const handleEmployeeSelectionChange = (id: string, selected: boolean) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleEmployeeActionClick = (id: string) => {
    // TODO: Implement action menu
    console.log('Action clicked for employee:', id);
  };

  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start overflow-clip relative size-full">
      {/* Page Header */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <EmployeesPageHeader onAddEmployee={handleAddEmployee} />
      </div>

      {/* Action Row - Directly below header with no gap */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <EmployeesActionRow
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          viewType={viewType}
          onViewTypeChange={setViewType}
          sortValue={sortValue}
          onSortChange={setSortValue}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
        />
      </div>

      {/* Table Header Row - Directly below action row with no gap */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <EmployeesTableHeaderRow
          allSelected={allSelected}
          onSelectAllChange={setAllSelected}
        />
      </div>

      {/* Intern Grouping Row - Directly below header row with no gap */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <EmployeesGroupingRow role="Intern" count={internEmployees.length} />
      </div>

      {/* Intern Employee Table Rows - Directly below grouping row */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" role="rowgroup">
        {internEmployees.map((employee) => (
          <EmployeeTableRow
            key={employee.id}
            employee={employee}
            isSelected={selectedEmployees.has(employee.id)}
            onSelectionChange={handleEmployeeSelectionChange}
            onActionClick={handleEmployeeActionClick}
          />
        ))}
      </div>

      {/* Full-time Grouping Row - Directly below intern rows */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <EmployeesGroupingRow role="Full-time" count={fullTimeEmployees.length} />
      </div>

      {/* Full-time Employee Table Rows - Directly below grouping row */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" role="rowgroup">
        {fullTimeEmployees.map((employee) => (
          <EmployeeTableRow
            key={employee.id}
            employee={employee}
            isSelected={selectedEmployees.has(employee.id)}
            onSelectionChange={handleEmployeeSelectionChange}
            onActionClick={handleEmployeeActionClick}
          />
        ))}
      </div>
    </div>
  );
}


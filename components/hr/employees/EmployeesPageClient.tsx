'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import EmployeesPageHeader from '@/components/hr/employees/EmployeesPageHeader';
import EmployeesActionRow from '@/components/hr/employees/EmployeesActionRow';
import EmployeesTableHeaderRow from '@/components/hr/employees/EmployeesTableHeaderRow';
import EmployeesGroupingRow from '@/components/hr/employees/EmployeesGroupingRow';
import EmployeeTableRow, { Employee } from '@/components/hr/employees/EmployeeTableRow';
import InviteUserModal from '@/components/hr/users/InviteUserModal';
import type { ViewType } from '@/components/shared/ToggleView';

interface EmployeesPageClientProps {
  /**
   * Initial employee data fetched from the server
   */
  employees: Employee[];
}

/**
 * Client component for the HR Employees page
 * 
 * Handles all client-side interactivity including:
 * - Search filtering
 * - View type toggle
 * - Sorting
 * - Employee selection
 * - Modal state
 */
export default function EmployeesPageClient({ employees }: EmployeesPageClientProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [sortValue, setSortValue] = useState('name-asc');
  const [filterValue, setFilterValue] = useState('all');
  const [allSelected, setAllSelected] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Filter and sort employees based on current state
  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    
    // Apply search filter
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search) ||
          emp.email.toLowerCase().includes(search)
      );
    }
    
    // Apply role filter
    if (filterValue !== 'all') {
      result = result.filter((emp) => emp.role === filterValue);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortValue) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    
    return result;
  }, [employees, searchValue, filterValue, sortValue]);

  // Group employees by role
  const internEmployees = useMemo(
    () => filteredEmployees.filter((emp) => emp.role === 'Intern'),
    [filteredEmployees]
  );
  
  const fullTimeEmployees = useMemo(
    () => filteredEmployees.filter((emp) => emp.role === 'Full-time'),
    [filteredEmployees]
  );



  const handleAddEmployee = () => {
    setShowInviteModal(true);
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

  const handleEmployeeNameClick = (id: string) => {
    router.push(`/admin/employees/${id}`);
  };

  // Render employee group if it has employees
  const renderEmployeeGroup = (role: 'Intern' | 'Full-time', employeeList: Employee[]) => {
    if (employeeList.length === 0) return null;
    
    return (
      <>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <EmployeesGroupingRow role={role} count={employeeList.length} />
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" role="rowgroup">
          {employeeList.map((employee) => (
            <EmployeeTableRow
              key={employee.id}
              employee={employee}
              isSelected={selectedEmployees.has(employee.id)}
              onSelectionChange={handleEmployeeSelectionChange}
              onActionClick={handleEmployeeActionClick}
              onNameClick={handleEmployeeNameClick}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start overflow-clip relative size-full">
      {/* Page Header */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <EmployeesPageHeader onAddEmployee={handleAddEmployee} />
      </div>

      {/* Action Row */}
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

      {/* Table Header Row */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <EmployeesTableHeaderRow
          allSelected={allSelected}
          onSelectAllChange={setAllSelected}
        />
      </div>

      {/* Employee Groups */}
      {renderEmployeeGroup('Intern', internEmployees)}
      {renderEmployeeGroup('Full-time', fullTimeEmployees)}

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="flex items-center justify-center w-full py-12">
          <p className="text-neutral-500 text-sm">
            {searchValue || filterValue !== 'all'
              ? 'No employees match your search criteria'
              : 'No employees found'}
          </p>
        </div>
      )}

      {/* Invite User Modal */}
      <InviteUserModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}

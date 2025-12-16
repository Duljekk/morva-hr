import { getEmployees } from '@/lib/actions/hr/employees';
import EmployeesPageClient from '@/components/hr/employees/EmployeesPageClient';

/**
 * HR Employees Page (Server Component)
 * 
 * Fetches employee data from the database and passes it to the client component.
 * 
 * Route: /admin/employees
 * 
 * This page is automatically wrapped by the HR layout which provides:
 * - Sidebar navigation
 * - Main content area wrapper
 * - Consistent styling
 */
export default async function EmployeesPage() {
  const result = await getEmployees();
  
  if (result.error) {
    // Handle error - show error message
    return (
      <div className="bg-white box-border content-stretch flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="text-center p-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            Unable to load employees
          </h2>
          <p className="text-sm text-neutral-500">
            {result.error}
          </p>
        </div>
      </div>
    );
  }
  
  return <EmployeesPageClient employees={result.data || []} />;
}

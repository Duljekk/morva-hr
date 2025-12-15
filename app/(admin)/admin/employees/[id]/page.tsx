/**
 * Employee Detail Page
 * 
 * This page displays detailed information about a specific employee.
 * Route: /admin/employees/[id]
 */

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage(props: PageProps) {
    const params = await props.params;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-neutral-800">
                Employee Details
            </h1>
            <p className="text-neutral-600 mt-2">
                Employee ID: {params.id}
            </p>
            {/* TODO: Implement employee detail view */}
        </div>
    );
}

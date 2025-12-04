'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { employeeRoutes, isRouteActive, type RouteConfig } from '@/lib/navigation/routes';

interface EmployeeNavProps {
  currentPath?: string;
}

/**
 * Employee navigation component
 * Displays navigation links for employee routes
 * 
 * Features:
 * - Active route highlighting
 * - Responsive design
 * - Accessible navigation
 */
export default function EmployeeNav({ currentPath }: EmployeeNavProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200">
      <div className="mx-auto w-full max-w-[402px]">
        <div className="flex items-center justify-around px-4 py-2">
          {employeeRoutes.map((route) => {
            const isActive = isRouteActive(route.path, activePath, route.exact);
            
            return (
              <Link
                key={route.path}
                href={route.path}
                className={`
                  flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg
                  transition-colors duration-200
                  ${isActive 
                    ? 'text-neutral-900 bg-neutral-50' 
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {route.icon && (
                  <span className={isActive ? 'text-neutral-900' : 'text-neutral-500'}>
                    {route.icon}
                  </span>
                )}
                <span className="text-xs font-medium leading-4">
                  {route.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

















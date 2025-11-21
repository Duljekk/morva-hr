'use client';

import { useRouter } from 'next/navigation';
import { CalendarIcon } from '@/app/components/Icons';

// Simple Document Icon since it's not in Icons.tsx
const DocumentIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HRTaskMenu() {
  const router = useRouter();

  const tasks = [
    {
      title: 'Review Leave Requests',
      subtitle: 'Approve or reject pending requests',
      icon: <CalendarIcon className="h-6 w-6" />,
      action: () => router.push('/hr/leaves'),
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Process Payslips',
      subtitle: 'Fill and send monthly payslips',
      icon: <DocumentIcon className="h-6 w-6" />,
      action: () => router.push('/hr/payslips'),
      color: 'bg-green-50 text-green-700',
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-base font-semibold text-neutral-800 tracking-tight">
        Quick Actions
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task, index) => (
          <button
            key={index}
            onClick={task.action}
            className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-neutral-100 hover:bg-neutral-50 transition-colors text-left"
          >
            <div className={`h-12 w-12 shrink-0 rounded-full ${task.color} flex items-center justify-center`}>
               {task.icon}
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm font-bold text-neutral-900">
                {task.title}
              </p>
              <p className="text-xs text-neutral-500">
                {task.subtitle}
              </p>
            </div>
            
            <div className="ml-auto text-neutral-400">
                 {/* Chevron right */}
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

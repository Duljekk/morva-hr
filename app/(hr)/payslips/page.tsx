'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllEmployees } from '@/lib/actions/hr/dashboard';

/**
 * HR Payslips Page
 * 
 * Allows HR admins to generate payslips for employees.
 * 
 * Route: /admin/payslips (via route group (admin))
 */
export default function PayslipsPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    async function load() {
      const res = await getAllEmployees();
      if (res.data) setEmployees(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call a server action to generate/save the payslip
    alert(`Payslip generated for ${employees.find(e => e.id === selectedEmployee)?.full_name} for ${month}`);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="mx-auto max-w-[402px] px-6 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-white border border-neutral-200 text-neutral-600"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-neutral-900">Generate Payslip</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">Employee</label>
            <select 
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 p-3 bg-white text-neutral-900"
              disabled={loading}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">Period</label>
            <input 
              type="month" 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 p-3 bg-white text-neutral-900"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">Basic Salary</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full rounded-xl border border-neutral-200 p-3 bg-white text-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">Deductions</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full rounded-xl border border-neutral-200 p-3 bg-white text-neutral-900"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700">Bonuses</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full rounded-xl border border-neutral-200 p-3 bg-white text-neutral-900"
            />
          </div>

          <button 
            type="submit"
            className="mt-4 w-full rounded-xl bg-neutral-900 text-white font-semibold py-3 hover:bg-neutral-800 transition-colors"
          >
            Generate Payslip
          </button>
        </form>
      </div>
    </div>
  );
}






'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/shared/FormInput';
import ButtonLarge from '@/components/shared/ButtonLarge';
import { inviteUserByEmail } from '@/lib/actions/hr/users';

interface InviteUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InviteUserForm({ onSuccess, onCancel }: InviteUserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    role: 'employee' as 'employee' | 'hr_admin',
    employee_id: '',
    shift_start_hour: 9,
    shift_end_hour: 18,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await inviteUserByEmail(formData);
      
      if (!result.success) {
        setError(result.error || 'Failed to send invitation');
        return;
      }

      // Success - reset form and call success callback
      setFormData({
        email: '',
        username: '',
        full_name: '',
        role: 'employee',
        employee_id: '',
        shift_start_hour: 9,
        shift_end_hour: 18,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Invitation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <FormInput
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="employee@example.com"
          bgColor="white"
        />
      </div>

      {/* Full Name Field */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name
        </label>
        <FormInput
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
          placeholder="John Doe"
          bgColor="white"
        />
      </div>

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
          Username
        </label>
        <FormInput
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          placeholder="johndoe"
          bgColor="white"
        />
      </div>

      {/* Employee ID Field */}
      <div>
        <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1.5">
          Employee ID (Optional)
        </label>
        <FormInput
          id="employee_id"
          type="text"
          value={formData.employee_id}
          onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
          placeholder="EMP-001"
          bgColor="white"
        />
      </div>

      {/* Role Dropdown */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
          Role
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"
          required
        >
          <option value="employee">Employee</option>
          <option value="hr_admin">HR Admin</option>
        </select>
      </div>

      {/* Shift Hours - Fixed Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Default Shift Hours:</span> 11:00 AM - 7:00 PM
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <ButtonLarge
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </ButtonLarge>
      </div>
    </form>
  );
}

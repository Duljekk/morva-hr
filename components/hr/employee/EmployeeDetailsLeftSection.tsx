'use client';

import { memo } from 'react';
import BankDetailsCard from './BankDetailsCard';

export interface BankDetails {
  bankName: string;
  recipientName: string;
  accountNumber: string;
}

export interface EmployeeDetailsLeftSectionProps {
  /**
   * Employee ID
   */
  employeeId?: string;
  
  /**
   * Bank details for the employee
   */
  bankDetails?: BankDetails;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Callback when account number is copied
   */
  onCopy?: (accountNumber: string) => void;
}

/**
 * Employee Details Left Section Component
 * 
 * Left section of the employee details page containing bank details and other information.
 * 
 * Features:
 * - Bank details card with copy functionality
 * - Expandable for additional information cards
 * - Responsive layout
 * 
 * @example
 * ```tsx
 * <EmployeeDetailsLeftSection
 *   employeeId="123"
 *   bankDetails={{
 *     bankName: "Bank Central Asia (BCA)",
 *     recipientName: "ABDUL ZAKI SYAHRUL R",
 *     accountNumber: "4640286879"
 *   }}
 *   onCopy={(number) => console.log('Copied:', number)}
 * />
 * ```
 */
const EmployeeDetailsLeftSection = memo(function EmployeeDetailsLeftSection({
  employeeId,
  bankDetails,
  className = '',
  onCopy,
}: EmployeeDetailsLeftSectionProps) {
  // Default bank details (mock data - in real app, fetch based on employeeId)
  const defaultBankDetails: BankDetails = {
    bankName: 'Bank Central Asia (BCA)',
    recipientName: 'ABDUL ZAKI SYAHRUL R',
    accountNumber: '4640286879',
  };

  const details = bankDetails || defaultBankDetails;

  const handleCopy = (accountNumber: string) => {
    onCopy?.(accountNumber);
    // Could show a toast notification here
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      {/* Bank Details Card */}
      <BankDetailsCard
        bankName={details.bankName}
        recipientName={details.recipientName}
        accountNumber={details.accountNumber}
        onCopy={handleCopy}
      />

      {/* Placeholder for additional cards (e.g., Emergency Contact, Documents, etc.) */}
    </div>
  );
});

EmployeeDetailsLeftSection.displayName = 'EmployeeDetailsLeftSection';

export default EmployeeDetailsLeftSection;


'use client';

import { memo } from 'react';
import Avatar from '@/components/shared/Avatar';
import RoleBadge, { RoleBadgeVariant } from '@/components/shared/RoleBadge';
import BankDetailsCard from './BankDetailsCard';
import { DotGrid1x3HorizontalIcon } from '@/components/icons';

/**
 * Employee data for the left section
 */
export interface EmployeeLeftSectionData {
  /**
   * Employee name
   */
  name: string;

  /**
   * Employee email
   */
  email: string;

  /**
   * Employee avatar image URL
   */
  imageUrl?: string | null;

  /**
   * Employee role (Intern or Full-time)
   */
  role: RoleBadgeVariant;

  /**
   * Birthdate formatted string (e.g., "10 December, 2001")
   */
  birthDate: string;

  /**
   * Salary formatted string (e.g., "IDR 6.500.000")
   */
  salary: string;

  /**
   * Leave balance object
   */
  leaveBalance: {
    current: number;
    total: number;
  };

  /**
   * Contract period formatted string (e.g., "8 Sep - 8 Dec 2025")
   */
  contractPeriod: string;

  /**
   * Bank details
   */
  bankDetails: {
    bankName: string;
    recipientName: string;
    accountNumber: string;
  };
}

export interface EmployeeDetailsLeftSectionProps {
  /**
   * Employee data to display
   */
  employee: EmployeeLeftSectionData;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when menu button is clicked
   */
  onMenuClick?: () => void;

  /**
   * Callback when account number is copied
   */
  onCopyAccountNumber?: (accountNumber: string) => void;
}

/**
 * Info Row Item Component
 * 
 * Displays a label and value in a vertical layout.
 */
interface InfoRowItemProps {
  label: string;
  value: string;
}

const InfoRowItem = memo(function InfoRowItem({ label, value }: InfoRowItemProps) {
  return (
    <div className="flex-1 flex flex-col gap-[4px] min-w-0">
      <p
        className="font-sans font-medium leading-[18px] text-[#737373] text-[14px]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {label}
      </p>
      <p
        className="font-sans font-medium leading-[20px] text-[#404040] text-[16px]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {value}
      </p>
    </div>
  );
});

InfoRowItem.displayName = 'InfoRowItem';

/**
 * Employee Details Left Section Component
 * 
 * Displays comprehensive employee profile information including:
 * - Banner with menu button
 * - Profile photo and basic info (name, role badge, email)
 * - Details grid (birthdate, salary, leave balance, contract period)
 * - Bank details card
 * 
 * Based on Figma design node 587:1452.
 * 
 * Layout specifications:
 * - Width: 480px (full width)
 * - Border radius: 20px
 * - Shadow: 0px 4px 4px -2px rgba(0,0,0,0.05), 0px 0px 1px 1px rgba(0,0,0,0.1)
 * - Padding: 36px top, 28px sides and bottom
 * - Gap between sections: 14px
 * 
 * @example
 * ```tsx
 * <EmployeeDetailsLeftSection
 *   employee={{
 *     name: 'Abdul Zaki Syahrul Rahmat',
 *     email: 'abdulzakisr@gmail.com',
 *     imageUrl: '/avatar.jpg',
 *     role: 'Intern',
 *     birthDate: '10 December, 2001',
 *     salary: 'IDR 6.500.000',
 *     leaveBalance: { current: 8, total: 10 },
 *     contractPeriod: '8 Sep - 8 Dec 2025',
 *     bankDetails: {
 *       bankName: 'Bank Central Asia (BCA)',
 *       recipientName: 'ABDUL ZAKI SYAHRUL R',
 *       accountNumber: '4640286879',
 *     },
 *   }}
 *   onMenuClick={() => console.log('Menu clicked')}
 *   onCopyAccountNumber={(num) => console.log('Copied:', num)}
 * />
 * ```
 */
const EmployeeDetailsLeftSection = memo(function EmployeeDetailsLeftSection({
  employee,
  className = '',
  onMenuClick,
  onCopyAccountNumber,
}: EmployeeDetailsLeftSectionProps) {
  const {
    name,
    email,
    imageUrl,
    role,
    birthDate,
    salary,
    leaveBalance,
    contractPeriod,
    bankDetails,
  } = employee;

  return (
    <div
      className={`
        bg-white
        flex flex-col
        overflow-clip
        relative
        rounded-[20px]
        shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
        w-full
        ${className}
      `.trim()}
      data-name="Left Section"
      data-node-id="587:1452"
    >
      {/* Banner */}
      <div
        className="bg-[#f0f9ff] h-[75px] w-full relative"
        data-name="Banner"
        data-node-id="587:1453"
      >
        {/* Ghost Button (3-dot menu) */}
        <button
          type="button"
          onClick={onMenuClick}
          className="
            absolute right-[8px] top-[8px]
            rounded-[8px] size-[28px]
            flex items-center justify-center
            hover:bg-white/50
            transition-colors
          "
          data-name="Ghost Button"
          data-node-id="587:1454"
          aria-label="Employee options menu"
        >
          <DotGrid1x3HorizontalIcon className="text-[#525252]" />
        </button>
      </div>

      {/* Section Contents */}
      <div
        className="flex flex-col gap-[14px] items-start px-[28px] pb-[28px] pt-0 w-full -mt-[39px]"
        data-name="Section Contents"
        data-node-id="587:1455"
      >
        {/* Header - Profile + Name + Email */}
        <div
          className="flex flex-col gap-[8px] items-start w-full"
          data-name="Header"
          data-node-id="587:1456"
        >
          {/* Profile Image */}
          <div
            className="bg-white content-stretch flex items-center justify-center overflow-clip p-[2px] rounded-full size-[86px] shrink-0 z-10"
            data-name="Profile"
            data-node-id="677:4621"
          >
            <div
              className="content-stretch flex items-center justify-center overflow-clip rounded-full size-[80px]"
              data-name="Frame"
              data-node-id="677:4622"
            >
              <Avatar
                name={name}
                imageUrl={imageUrl}
                size="2xl"
              />
            </div>
          </div>

          {/* Contents - Name + Badge + Email */}
          <div
            className="flex flex-col items-start w-full"
            data-name="Contents"
            data-node-id="587:1459"
          >
            {/* Name + Badge */}
            <div
              className="flex gap-[10px] items-center"
              data-name="Name + Badge"
              data-node-id="587:1460"
            >
              <h1
                className="font-sans font-semibold leading-[30px] text-[#262626] text-[20px] tracking-[-0.2px]"
                data-node-id="587:1461"
              >
                {name}
              </h1>
              <RoleBadge role={role} />
            </div>

            {/* Email */}
            <p
              className="font-sans font-normal leading-[20px] text-[#737373] text-[14px]"
              data-node-id="587:1465"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {email}
            </p>
          </div>
        </div>

        {/* Row + Bank Details */}
        <div
          className="flex flex-col gap-[20px] items-start w-full"
          data-name="Row + Bank Details"
          data-node-id="587:1466"
        >
          {/* Row Group */}
          <div
            className="flex flex-col gap-[14px] items-start w-full"
            data-name="Row Group"
            data-node-id="587:1467"
          >
            {/* Row 1: Birthdate | Salary */}
            <div
              className="flex gap-[14px] items-start w-full"
              data-name="Row"
              data-node-id="587:1468"
            >
              <InfoRowItem label="Birthdate" value={birthDate} />
              <InfoRowItem label="Salary" value={salary} />
            </div>

            {/* Row 2: Leave Balance | Contract Period */}
            <div
              className="flex gap-[14px] items-start w-full"
              data-name="Row"
              data-node-id="587:1475"
            >
              <InfoRowItem
                label="Leave Balance"
                value={`${leaveBalance.current} out of ${leaveBalance.total}`}
              />
              <InfoRowItem label="Contract Period" value={contractPeriod} />
            </div>
          </div>

          {/* Bank Details Card */}
          <BankDetailsCard
            bankName={bankDetails.bankName}
            recipientName={bankDetails.recipientName}
            accountNumber={bankDetails.accountNumber}
            onCopy={onCopyAccountNumber}
          />
        </div>
      </div>
    </div>
  );
});

EmployeeDetailsLeftSection.displayName = 'EmployeeDetailsLeftSection';

export default EmployeeDetailsLeftSection;

'use client';

import { memo, useState } from 'react';
import { BubbleInfoIcon, CopyIcon } from '@/components/icons';

export interface BankDetailsCardProps {
  /**
   * Bank name (e.g., "Bank Central Asia (BCA)")
   */
  bankName?: string;
  
  /**
   * Account holder/recipient name
   */
  recipientName?: string;
  
  /**
   * Bank account number
   */
  accountNumber?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Callback when copy button is clicked
   */
  onCopy?: (accountNumber: string) => void;
}

/**
 * Bank Details Card Component
 * 
 * Displays employee bank account information with copy functionality.
 * Based on Figma design node 608:1981.
 * 
 * Features:
 * - Header with info icon and "Bank Details" label
 * - Bank name display
 * - Recipient name display
 * - Account number with copy button
 * - Responsive layout
 * 
 * @example
 * ```tsx
 * <BankDetailsCard
 *   bankName="Bank Central Asia (BCA)"
 *   recipientName="ABDUL ZAKI SYAHRUL R"
 *   accountNumber="4640286879"
 *   onCopy={(number) => console.log('Copied:', number)}
 * />
 * ```
 */
const BankDetailsCard = memo(function BankDetailsCard({
  bankName = 'Bank Central Asia (BCA)',
  recipientName = 'ABDUL ZAKI SYAHRUL R',
  accountNumber = '4640286879',
  className = '',
  onCopy,
}: BankDetailsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      onCopy?.(accountNumber);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className={`bg-[#fafafa] flex flex-col items-start overflow-clip pb-[4px] pt-0 px-[4px] rounded-[10px] w-full ${className}`}
      data-name="Bank Details"
      data-node-id="608:1981"
    >
      {/* Header */}
      <div
        className="flex gap-[4px] items-center pl-[8px] pr-0 py-[10px] w-full"
        data-name="Header"
        data-node-id="608:1982"
      >
        <div className="relative shrink-0 size-[16px]" data-name="Icon Container" data-node-id="608:2001">
          <BubbleInfoIcon size={16} className="text-[#737373]" />
        </div>
        <p
          className="font-sans font-medium leading-[18px] text-[#525252] text-[14px] text-nowrap whitespace-pre"
          data-node-id="608:1984"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Bank Details
        </p>
      </div>

      {/* Content Container */}
      <div
        className="bg-white flex flex-col gap-[8px] items-start overflow-clip px-[16px] py-[14px] rounded-[8px] shadow-[0px_0px_1px_0.75px_rgba(0,0,0,0.05)] w-full"
        data-name="Content Container"
        data-node-id="608:1985"
      >
        {/* Bank Name */}
        <div
          className="flex flex-col font-sans font-medium gap-[4px] items-start w-full"
          data-name="Bank"
          data-node-id="608:1986"
        >
          <p
            className="leading-[18px] text-[#737373] text-[14px] w-full"
            data-node-id="608:1987"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Bank Name
          </p>
          <p
            className="leading-[20px] text-[#404040] text-[16px] w-full"
            data-node-id="608:1988"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {bankName}
          </p>
        </div>

        {/* Recipient Name */}
        <div
          className="flex flex-col font-sans font-medium gap-[4px] items-start w-full"
          data-name="Recipient"
          data-node-id="608:1989"
        >
          <p
            className="leading-[18px] text-[#737373] text-[14px] w-full"
            data-node-id="608:1990"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Recipient Name
          </p>
          <p
            className="leading-[20px] text-[#404040] text-[16px] w-full"
            data-node-id="608:1991"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {recipientName}
          </p>
        </div>

        {/* Account Number */}
        <div
          className="flex flex-col gap-[4px] items-start w-full"
          data-name="Account"
          data-node-id="608:1992"
        >
          <p
            className="font-sans font-medium leading-[18px] text-[#737373] text-[14px] w-full"
            data-node-id="608:1993"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Account Number
          </p>
          <div
            className="flex gap-[4px] items-center"
            data-name="Account Number + Button"
            data-node-id="608:1994"
          >
            <p
              className="font-sans font-medium leading-[20px] text-[#404040] text-[16px] text-nowrap whitespace-pre"
              data-node-id="608:1995"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {accountNumber}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="bg-[#fafafa] flex items-center p-[3px] rounded-[4px] size-[20px] hover:bg-[#f0f0f0] transition-colors"
              data-name="Copy Button"
              data-node-id="608:1996"
              aria-label={copied ? 'Copied!' : 'Copy account number'}
              title={copied ? 'Copied!' : 'Copy account number'}
            >
              <CopyIcon size={14} className={`${copied ? 'text-[#00a63e]' : 'text-[#a1a1a1]'} transition-colors`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

BankDetailsCard.displayName = 'BankDetailsCard';

export default BankDetailsCard;




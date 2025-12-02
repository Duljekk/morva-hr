import { memo } from 'react';

export interface PayrollIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Payroll Icon Component
 * 
 * A document/money icon representing payroll and payslip management.
 * 
 * @example
 * ```tsx
 * <PayrollIcon className="w-4 h-4 text-neutral-600" />
 * ```
 */
const PayrollIcon = memo(function PayrollIcon({
  size = 16,
  className = '',
  ...props
}: PayrollIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.6665 3.3335C2.6665 2.22893 3.56193 1.3335 4.6665 1.3335H11.3332C12.4377 1.3335 13.3332 2.22893 13.3332 3.3335V14.0002C13.3332 14.2605 13.1816 14.497 12.9451 14.6058C12.7085 14.7146 12.4303 14.6758 12.2326 14.5063L11.1109 13.5449L9.98925 14.5063C9.73959 14.7203 9.37119 14.7203 9.12153 14.5063L7.99984 13.5449L6.87814 14.5063C6.62848 14.7203 6.26008 14.7203 6.01042 14.5063L4.88873 13.5449L3.76703 14.5063C3.56936 14.6758 3.29113 14.7146 3.0546 14.6058C2.81807 14.497 2.6665 14.2605 2.6665 14.0002V3.3335ZM5.33317 5.3335C5.33317 4.96531 5.63165 4.66683 5.99984 4.66683H9.99984C10.368 4.66683 10.6665 4.96531 10.6665 5.3335C10.6665 5.70169 10.368 6.00016 9.99984 6.00016H5.99984C5.63165 6.00016 5.33317 5.70169 5.33317 5.3335ZM5.33317 8.00016C5.33317 7.63197 5.63165 7.3335 5.99984 7.3335H7.33317C7.70136 7.3335 7.99984 7.63197 7.99984 8.00016C7.99984 8.36835 7.70136 8.66683 7.33317 8.66683H5.99984C5.63165 8.66683 5.33317 8.36835 5.33317 8.00016Z"
        fill="currentColor"
      />
    </svg>
  );
});

PayrollIcon.displayName = 'PayrollIcon';

export default PayrollIcon;



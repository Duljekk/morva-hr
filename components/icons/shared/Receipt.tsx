import { memo } from 'react';

export interface ReceiptIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Size of the icon in pixels or CSS units
   * @default 16
   */
  size?: number | string;
}

/**
 * Receipt Icon Component
 * 
 * A receipt/document icon used for invoices, payslips, and financial records.
 * 
 * @example
 * ```tsx
 * <ReceiptIcon className="w-5 h-5 text-purple-600" />
 * ```
 */
const ReceiptIcon = memo(function ReceiptIcon({
  size = 16,
  className = '',
  ...props
}: ReceiptIconProps) {
  return (
    <svg
      viewBox="0 0 25 25"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.01867 5.0039C4.0203 3.34705 5.36476 2.00523 7.02162 2.00685L17.0216 2.01667C18.6785 2.0183 20.0203 3.36277 20.0187 5.01962L20.0029 21.0196C20.0026 21.4101 19.7749 21.7647 19.4199 21.9276C19.065 22.0904 18.6477 22.0317 18.3514 21.7772L16.6703 20.3334L14.9863 21.7739C14.6115 22.0946 14.0589 22.094 13.6847 21.7727L12.0036 20.3288L10.3197 21.7694C9.94486 22.09 9.39226 22.0894 9.01808 21.7681L7.33696 20.3242L5.653 21.7648C5.35624 22.0186 4.93885 22.0765 4.58421 21.913C4.22957 21.7494 4.00257 21.3944 4.00296 21.0039L4.01867 5.0039ZM8.01572 8.00783C8.01627 7.45555 8.46442 7.00827 9.01671 7.00881L15.0167 7.01471C15.569 7.01525 16.0163 7.4634 16.0157 8.01569C16.0152 8.56797 15.567 9.01525 15.0147 9.01471L9.01474 9.00881C8.46246 9.00827 8.01518 8.56012 8.01572 8.00783ZM8.0118 12.0078C8.01234 11.4555 8.46049 11.0083 9.01278 11.0088L11.0128 11.0108C11.5651 11.0113 12.0123 11.4595 12.0118 12.0118C12.0113 12.564 11.5631 13.0113 11.0108 13.0108L9.01081 13.0088C8.45853 13.0083 8.01125 12.5601 8.0118 12.0078Z"
        fill="currentColor"
      />
    </svg>
  );
});

ReceiptIcon.displayName = 'ReceiptIcon';

export default ReceiptIcon;



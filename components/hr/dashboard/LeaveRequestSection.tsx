'use client';

import { memo, useMemo } from 'react';
import LeaveRequestItem from '../LeaveRequestItem';
import { LeaveRequestsIcon } from '@/components/icons';

export interface LeaveRequest {
  /**
   * Unique identifier for the leave request
   */
  id: string;

  /**
   * Employee name
   */
  name: string;

  /**
   * Leave date range (e.g., "25-26 Nov 2025", "27 Nov 2025 (Full Day)", "28 Nov 2025 (Half Day)")
   */
  dateRange: string;

  /**
   * Leave type (e.g., "Annual Leave", "Unpaid Leave", "Sick Leave")
   */
  leaveType: string;
}

// Placeholder data matching Figma design
const PLACEHOLDER_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'placeholder-1',
    name: 'Achmad Rafi',
    dateRange: '25-26 Nov 2025',
    leaveType: 'Annual Leave',
  },
  {
    id: 'placeholder-2',
    name: 'Abdul Zaki',
    dateRange: '27 Nov 2025 (Full Day)',
    leaveType: 'Unpaid Leave',
  },
  {
    id: 'placeholder-3',
    name: 'Naufal Daffa',
    dateRange: '28 Nov 2025 (Half Day)',
    leaveType: 'Sick Leave',
  },
];

export interface LeaveRequestSectionProps {
  /**
   * Array of leave requests to display
   */
  requests?: LeaveRequest[];

  /**
   * Maximum number of requests to show
   * @default 5
   */
  maxItems?: number;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Error state
   */
  error?: string;

  /**
   * Callback when approve button is clicked
   */
  onApprove?: (id: string) => void;

  /**
   * Callback when reject button is clicked
   */
  onReject?: (id: string) => void;

  /**
   * Whether the buttons are disabled
   */
  disabled?: boolean;
}

/**
 * Get background color and icon color based on leave type
 */
function getLeaveTypeStyles(leaveType: string): {
  backgroundColor: string;
  iconColor: string;
} {
  const normalizedType = leaveType.toLowerCase();

  if (normalizedType.includes('unpaid')) {
    return {
      backgroundColor: 'bg-[#fef3c6]', // amber-100 from Figma
      iconColor: 'text-amber-600',
    };
  }

  if (normalizedType.includes('sick')) {
    return {
      backgroundColor: 'bg-[#d0fae5]', // emerald-100 from Figma
      iconColor: 'text-green-600',
    };
  }

  // Default: Annual Leave or other types
  return {
    backgroundColor: 'bg-[#dff2fe]', // sky-100 from Figma
    iconColor: 'text-blue-600',
  };
}

/**
 * Leave Request Section Component
 *
 * Displays a card with leave requests for the HR dashboard.
 * Each request shows employee name, date range, and approve/reject buttons.
 *
 * Figma specs (node 428:2762 "Leave Request"):
 * - Container: white bg, rounded-12px, shadow, padding 24px
 * - Header: flex, gap-8px, h-28px
 *   - Title: text-lg/semibold, neutral-700, leading-22px
 *   - Number: text-md/semibold, neutral-400, leading-20px
 * - Leave Request Item Group: flex-col, gap between items
 * - Each item container has border-bottom divider (except last)
 * - Item padding: 18px top/bottom for middle items, 0 top for first, 0 bottom for last
 *
 * Leave type background colors:
 * - Annual Leave: sky-100 (#dff2fe)
 * - Unpaid Leave: amber-100 (#fef3c6)
 * - Sick Leave: emerald-100 (#d0fae5)
 *
 * @example
 * ```tsx
 * <LeaveRequestSection
 *   requests={[
 *     {
 *       id: '1',
 *       name: 'Achmad Rafi',
 *       dateRange: '25-26 Nov 2025',
 *       leaveType: 'Annual Leave'
 *     }
 *   ]}
 *   onApprove={(id) => handleApprove(id)}
 *   onReject={(id) => handleReject(id)}
 * />
 * ```
 */
const LeaveRequestSection = memo(function LeaveRequestSection({
  requests,
  maxItems = 5,
  loading = false,
  error,
  onApprove,
  onReject,
  disabled = false,
}: LeaveRequestSectionProps) {
  // Use placeholder data if no requests provided
  const requestsToDisplay = requests ?? PLACEHOLDER_LEAVE_REQUESTS;

  // Limit requests to maxItems
  const displayedRequests = useMemo(() => {
    return requestsToDisplay.slice(0, maxItems);
  }, [requestsToDisplay, maxItems]);

  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[20px] px-[24px] relative rounded-[12px] shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] size-full"
      data-name="Leave Request"
      data-node-id="428:2762"
    >
      {/* Header */}
      <div
        className="content-stretch flex font-semibold gap-[8px] h-[28px] items-center relative shrink-0 text-nowrap w-full whitespace-pre"
        data-name="Header"
        data-node-id="428:2763"
      >
        {/* Title */}
        <p
          className="font-semibold leading-[22px] relative shrink-0 text-neutral-700 text-lg"
          data-node-id="428:2765"
        >
          Leave Request
        </p>

        {/* Number */}
        <p
          className="font-semibold leading-[20px] relative shrink-0 text-neutral-400 text-md text-center"
          data-node-id="428:2766"
        >
          {displayedRequests.length}
        </p>
      </div>

      {/* Leave Request Item Group */}
      <div
        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
        data-name="Leave Request Item Group"
        data-node-id="428:2768"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8 text-neutral-500">
            Loading leave requests...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500">
            {error}
          </div>
        ) : displayedRequests.length > 0 ? (
          displayedRequests.map((request, index) => {
            const isFirst = index === 0;
            const isLast = index === displayedRequests.length - 1;
            const leaveStyles = getLeaveTypeStyles(request.leaveType);

            // Determine container padding and border based on position
            // Matching Figma specs exactly:
            // - First: pt-0, pb-[18px], border-bottom, no item offset
            // - Middle: h-[76px] total height, py-[18px] (18px top + 18px bottom = 36px padding), border-bottom, item centered
            // - Last: pt-[18px], pb-0, no border-bottom, no item offset (follows first item structure)
            const getContainerStyles = () => {
              if (isFirst) {
                return {
                  container: 'border-b border-neutral-100 pb-[18px] pt-0 px-0',
                  itemOffset: '', // No offset for first item
                };
              }
              if (isLast) {
                // Follow ALL properties of first item but with top padding instead of bottom padding
                return {
                  container: 'pb-0 pt-[18px] px-0', // Same structure as first, just swapped padding
                  itemOffset: '', // No offset, same as first item
                };
              }
              // Middle item: fixed height 76px including padding, item centered
              return {
                container: 'border-b border-neutral-100 px-0 py-[18px] h-[76px]',
                itemOffset: '', // No offset - flexbox items-center will center the item
              };
            };

            const containerStyles = getContainerStyles();

            return (
              <div
                key={request.id}
                className={`${containerStyles.container} box-border content-stretch flex gap-[8px] items-center relative shrink-0 w-full`}
                data-name="Leave Request Item Container"
                data-node-id={isFirst ? '428:2769' : index === 1 ? '428:2782' : '428:2795'}
              >
                <div className={`basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0 ${containerStyles.itemOffset}`}>
                  <LeaveRequestItem
                    name={request.name}
                    dateRange={request.dateRange}
                    leaveType={request.leaveType}
                    onApprove={() => onApprove?.(request.id)}
                    onReject={() => onReject?.(request.id)}
                    disabled={disabled}
                    backgroundColor={leaveStyles.backgroundColor}
                    icon={
                      <LeaveRequestsIcon
                        size={24}
                        className={leaveStyles.iconColor}
                      />
                    }
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center py-8 text-neutral-500">
            No pending leave requests
          </div>
        )}
      </div>
    </div>
  );
});

LeaveRequestSection.displayName = 'LeaveRequestSection';

export default LeaveRequestSection;

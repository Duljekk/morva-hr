'use client';

import { memo, useMemo } from 'react';
import LeaveRequestItem from '../LeaveRequestItem';
import EmptyStateIllustration from '@/app/assets/icons/empty-state.svg';

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

  /**
   * Raw start date (ISO) for details dialog
   */
  startDate?: string;

  /**
   * Raw end date (ISO) for details dialog
   */
  endDate?: string;

  /**
   * Detailed reason for the leave
   */
  reason?: string;

  /**
   * When the request was created (ISO timestamp)
   */
  createdAt?: string;
}

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

  /**
   * Callback when a leave request item container is clicked
   * (used to open the details dialog in HR dashboard)
   */
  onOpenDetails?: (id: string) => void;
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
  onOpenDetails,
}: LeaveRequestSectionProps) {
  // Limit requests to maxItems
  const displayedRequests = useMemo(() => {
    return (requests ?? []).slice(0, maxItems);
  }, [requests, maxItems]);

  return (
    <div
      className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[20px] px-[24px] relative rounded-[12px] shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] size-full"
      data-name="Leave Request"
      data-node-id="428:2762"
    >
      {/* Header */}
      <div
        className="content-stretch flex font-semibold gap-[8px] h-[32px] items-center relative shrink-0 text-nowrap w-full whitespace-pre"
        data-name="Header"
        data-node-id="798:2016"
      >
        {/* Title */}
        <p
          className="font-semibold leading-[22px] relative shrink-0 text-neutral-700 text-lg"
          data-node-id="798:2017"
        >
          Leave Request
        </p>

        {/* Number - only show when there are requests */}
        {displayedRequests.length > 0 && (
          <p
            className="font-semibold leading-[20px] relative shrink-0 text-neutral-400 text-md text-center"
            data-node-id="428:2766"
          >
            {displayedRequests.length}
          </p>
        )}
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
            const isSingle = displayedRequests.length === 1;

            // Determine container padding and border based on position
            // Matching Figma specs exactly:
            // - First: pt-0, pb-[18px], border-bottom, no item offset
            // - Middle: h-[76px] total height, py-[18px] (18px top + 18px bottom = 36px padding), border-bottom, item centered
            // - Last: pt-[18px], pb-0, no border-bottom, no item offset (follows first item structure)
            const getContainerStyles = () => {
              // Single item: no border and no extra vertical padding
              if (isSingle) {
                return {
                  container: 'pt-0 pb-0 px-0',
                  itemOffset: '',
                };
              }

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
                className={`${containerStyles.container} box-border content-stretch flex gap-[8px] items-center relative shrink-0 w-full cursor-pointer`}
                data-name="Leave Request Item Container"
                data-node-id={isFirst ? '428:2769' : index === 1 ? '428:2782' : '428:2795'}
                onClick={() => onOpenDetails?.(request.id)}
              >
                <div className={`basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0 ${containerStyles.itemOffset}`}>
                  <LeaveRequestItem
                    name={request.name}
                    dateRange={request.dateRange}
                    leaveType={request.leaveType}
                    onApprove={() => onApprove?.(request.id)}
                    onReject={() => onReject?.(request.id)}
                    disabled={disabled}
                    onClick={() => onOpenDetails?.(request.id)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State - Figma node 800:2052 */
          <div
            className="content-stretch flex flex-col gap-[18px] items-center pb-[32px] pt-[28px] relative shrink-0 w-full"
            data-name="Container"
            data-node-id="800:2052"
          >
            {/* Empty State Illustration */}
            <div
              className="h-[78px] relative shrink-0 w-[258px]"
              data-name="empty-state 3"
              data-node-id="800:2053"
            >
              <EmptyStateIllustration className="w-full h-full" />
            </div>

            {/* Contents */}
            <div
              className="content-stretch flex flex-col gap-[6px] items-center text-sm text-center w-[266px]"
              data-name="Contents"
              data-node-id="800:2065"
            >
              <p
                className="font-medium leading-[18px] text-neutral-700"
                data-node-id="800:2066"
              >
                No pending leave requests
              </p>
              <p
                className="font-normal leading-[20px] text-neutral-500 w-[266px]"
                data-node-id="800:2067"
              >
                All leave requests have been reviewed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

LeaveRequestSection.displayName = 'LeaveRequestSection';

export default LeaveRequestSection;


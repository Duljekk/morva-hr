'use client';

import { memo, ReactNode, useMemo } from 'react';
import CoffeeIcon from '@/components/icons/shared/Coffee';
import RadioButton from '@/components/shared/RadioButton';

export type CardOfficeState = 'default' | 'hover' | 'active';

export interface CardOfficeProps {
  /**
   * Name of the office location
   */
  locationName: string;
  
  /**
   * Full address of the office (legacy prop, use formattedAddress instead)
   * @deprecated Use formattedAddress with latitude/longitude for fallback support
   */
  address?: string;
  
  /**
   * Formatted address from geocoding API
   * When null/undefined, coordinates will be displayed as fallback
   * Requirement 2.2, 7.3
   */
  formattedAddress?: string | null;
  
  /**
   * Latitude coordinate for fallback display
   * Required when formattedAddress may be null
   * Requirement 7.3
   */
  latitude?: number;
  
  /**
   * Longitude coordinate for fallback display
   * Required when formattedAddress may be null
   * Requirement 7.3
   */
  longitude?: number;
  
  /**
   * Whether this card is selected/active
   * @default false
   */
  isSelected?: boolean;
  
  /**
   * Optional custom icon to display
   * If not provided, defaults to CoffeeIcon
   */
  icon?: ReactNode;
  
  /**
   * Click handler for the card
   */
  onClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CardOffice Component
 * 
 * A selectable card component for displaying office/location information.
 * Used in Settings > Company page for location selection.
 * 
 * States:
 * - Default: White background with shadow
 * - Hover: Light gray background (rgba(250,250,250,0.5)) with shadow
 * - Active/Selected: Neutral-50 background, no shadow, filled radio button
 * 
 * Address Display (Requirements 2.2, 7.3):
 * - Shows formatted address when available
 * - Falls back to coordinates when address is missing
 * - Supports legacy 'address' prop for backward compatibility
 * 
 * @example
 * ```tsx
 * // With formatted address
 * <CardOffice
 *   locationName="Prompt Space"
 *   formattedAddress="No.08 Blok H1, Jl. Wisata Utama Boulevard..."
 *   latitude={-6.123456}
 *   longitude={106.789012}
 *   isSelected={true}
 *   onClick={() => handleSelect()}
 * />
 * 
 * // Without address (shows coordinate fallback)
 * <CardOffice
 *   locationName="Remote Office"
 *   formattedAddress={null}
 *   latitude={-6.123456}
 *   longitude={106.789012}
 *   isSelected={false}
 *   onClick={() => handleSelect()}
 * />
 * ```
 */
const CardOffice = memo(function CardOffice({
  locationName,
  address,
  formattedAddress,
  latitude,
  longitude,
  isSelected = false,
  icon,
  onClick,
  className = '',
}: CardOfficeProps) {
  /**
   * Compute display address with fallback logic
   * Requirement 7.3: Show coordinates as fallback when address is missing
   * Requirement 2.2: Show formatted address when available
   */
  const displayAddress = useMemo(() => {
    // Priority 1: Use formattedAddress if provided and not null
    if (formattedAddress) {
      return formattedAddress;
    }
    
    // Priority 2: Use legacy address prop for backward compatibility
    if (address) {
      return address;
    }
    
    // Priority 3: Fall back to coordinates if available
    // Requirement 7.3: Display coordinates as fallback
    if (latitude !== undefined && longitude !== undefined) {
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
    
    // Fallback: No address information available
    return 'No address available';
  }, [formattedAddress, address, latitude, longitude]);

  // Determine background and shadow based on state
  const containerStyles = isSelected
    ? 'bg-neutral-50'
    : 'bg-white shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)] hover:bg-[rgba(250,250,250,0.5)]';
  
  // Icon container background
  const iconContainerStyles = isSelected
    ? 'bg-neutral-200'
    : 'bg-neutral-100';

  // Check if displaying coordinate fallback (for potential styling differences)
  const isCoordinateFallback = !formattedAddress && !address && latitude !== undefined && longitude !== undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col gap-3 items-start
        p-5 rounded-2xl
        w-full max-w-[536.5px]
        relative overflow-clip
        transition-all duration-200
        cursor-pointer
        text-left
        ${containerStyles}
        ${className}
      `.trim()}
      aria-pressed={isSelected}
    >
      {/* Illustration/Icon Container */}
      <div className={`
        size-10 rounded-lg shrink-0
        flex items-center justify-center
        ${iconContainerStyles}
      `}>
        {icon || <CoffeeIcon size={24} className="text-[#404040]" />}
      </div>
      
      {/* Contents */}
      <div className="flex flex-col gap-1.5 items-start w-full">
        {/* Location Name */}
        <p className="font-['Mona_Sans'] text-base font-medium leading-5 text-neutral-800">
          {locationName}
        </p>
        
        {/* Address - Requirement 2.2: Show formatted address, Requirement 7.3: Coordinate fallback */}
        <p className={`font-['Mona_Sans'] text-sm font-normal leading-5 whitespace-pre-wrap ${
          isCoordinateFallback ? 'text-neutral-500 font-mono' : 'text-neutral-600'
        }`}>
          {displayAddress}
        </p>
      </div>
      
      {/* Radio Button - positioned top right */}
      <div className="absolute top-4 right-4">
        <RadioButton checked={isSelected} />
      </div>
    </button>
  );
});

CardOffice.displayName = 'CardOffice';

export default CardOffice;

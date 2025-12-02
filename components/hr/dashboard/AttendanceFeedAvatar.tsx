'use client';

import { memo, useState, useEffect } from 'react';

export interface AttendanceFeedAvatarProps {
  /**
   * Full name of the user (e.g., "Achmad Rafi")
   * Used to generate initials if no image is provided
   */
  name: string;

  /**
   * Optional image URL for the avatar
   * If provided and loads successfully, displays the image
   * Otherwise falls back to initials
   */
  imageUrl?: string | null;

  /**
   * Size of the avatar
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Alt text for the image
   * Defaults to the name if not provided
   */
  alt?: string;
}

/**
 * Generate initials from a full name
 * 
 * Examples:
 * - "Achmad Rafi" → "AR"
 * - "John Doe" → "JD"
 * - "Mary Jane Watson" → "MW" (first and last)
 * - "SingleName" → "S"
 * 
 * @param name - Full name string
 * @returns Initials string (1-2 characters)
 */
function getInitialsFromName(name: string): string {
  if (!name || name.trim().length === 0) {
    return '?';
  }

  const trimmedName = name.trim();
  const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);

  if (nameParts.length === 0) {
    return '?';
  }

  if (nameParts.length === 1) {
    // Single name: return first character
    return nameParts[0].charAt(0).toUpperCase();
  }

  // Multiple names: return first character of first name + first character of last name
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
}

/**
 * Size configurations for the avatar
 */
const sizeConfig = {
  sm: {
    container: 'h-[32px] w-[32px]',
    text: 'text-sm', // 14px
    padding: 'px-[6px] py-[8px]',
  },
  md: {
    container: 'h-[40px] w-[40px]',
    text: 'text-base', // 16px
    padding: 'px-[8px] py-[10px]',
  },
  lg: {
    container: 'h-[48px] w-[48px]',
    text: 'text-lg', // 18px
    padding: 'px-[10px] py-[12px]',
  },
};

/**
 * Attendance Feed Avatar Component
 *
 * A rounded square avatar component for displaying user avatars in the Attendance Feed section.
 * Displays user image if available, otherwise shows initials generated from the name.
 *
 * Figma specs (node 451:1037-451:1038):
 * - Container: bg-neutral-100 (#f5f5f5), rounded-[10px], padding px-[8px] py-[10px]
 * - Text: text-neutral-500 (#737373), text-md (16px), font-medium, leading-[20px], centered
 * - Size: Flexible but maintains aspect ratio
 *
 * Features:
 * - Automatic initials generation from name (e.g., "Achmad Rafi" → "AR")
 * - Image fallback to initials
 * - Error handling for failed image loads
 * - Accessible with proper alt text
 *
 * @example
 * ```tsx
 * <AttendanceFeedAvatar name="Achmad Rafi" />
 * <AttendanceFeedAvatar name="John Doe" imageUrl="/avatar.jpg" />
 * ```
 */
const AttendanceFeedAvatar = memo(function AttendanceFeedAvatar({
  name,
  imageUrl,
  size = 'md',
  className = '',
  alt,
}: AttendanceFeedAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const initials = getInitialsFromName(name);
  const displayAlt = alt || name;
  const config = sizeConfig[size];
  const showImage = imageUrl && !imageError && imageLoaded;

  // Reset state when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setImageError(false);
      setImageLoaded(false);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  return (
    <div
      className={`bg-[#f5f5f5] box-border content-stretch flex flex-col gap-[10px] items-center justify-center ${config.padding} relative rounded-[10px] ${config.container} overflow-hidden ${className}`}
      data-name="Avatar"
      data-node-id="451:1037"
      role="img"
      aria-label={displayAlt}
    >
      {/* Image overlay - shown when loaded successfully */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={displayAlt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            showImage ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Initials - always visible, hidden when image is shown */}
      <p
        className={`font-medium leading-[20px] relative shrink-0 text-[#737373] ${config.text} text-center w-full ${
          showImage ? 'opacity-0' : 'opacity-100'
        }`}
        data-node-id="451:1038"
      >
        {initials}
      </p>
    </div>
  );
});

AttendanceFeedAvatar.displayName = 'AttendanceFeedAvatar';

export default AttendanceFeedAvatar;

'use client';

import { memo, useState, useEffect } from 'react';
import Image from 'next/image';

export interface AvatarProps {
  /**
   * Full name of the user (e.g., "John Doe")
   * Used for alt text
   */
  name: string;

  /**
   * Optional image URL for the avatar
   * If provided and loads successfully, displays the image
   * Otherwise falls back to placeholder
   */
  imageUrl?: string | null;

  /**
   * Size of the avatar
   * @default "md"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  /**
   * Shape of the avatar
   * @default "circle"
   */
  shape?: 'circle' | 'square' | 'rounded';

  /**
   * Alt text for the image
   * Defaults to the name if not provided
   */
  alt?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Click handler (makes avatar interactive)
   */
  onClick?: () => void;

  /**
   * Loading state
   */
  isLoading?: boolean;
}

/**
 * Size configurations for the avatar
 */
const sizeConfig = {
  xs: {
    container: 'h-[24px] w-[24px]',
    pixels: 24,
  },
  sm: {
    container: 'h-[32px] w-[32px]',
    pixels: 32,
  },
  md: {
    container: 'h-[40px] w-[40px]',
    pixels: 40,
  },
  lg: {
    container: 'h-[48px] w-[48px]',
    pixels: 48,
  },
  xl: {
    container: 'h-[64px] w-[64px]',
    pixels: 64,
  },
  '2xl': {
    container: 'h-[80px] w-[80px]',
    pixels: 80,
  },
};

/**
 * Shape configurations
 */
const shapeConfig = {
  circle: 'rounded-[99px]', // Full circle
  square: 'rounded-[10px]', // Square with slight rounding
  rounded: 'rounded-lg', // Moderate rounding
};

/**
 * Avatar Component
 *
 * A flexible avatar component for displaying user profile pictures.
 * Displays user image if available, otherwise shows placeholder image.
 *
 * Figma specs (node 557:3287):
 * - Container: rounded-[99px] (circular), size-[40px] (40x40px)
 * - Image: object-cover, full size
 * - Gradient background: from-[#e4e4e7] to-[#fafafa] (for placeholder)
 *
 * Features:
 * - Image fallback to placeholder with error handling
 * - Multiple size variants (xs, sm, md, lg, xl)
 * - Shape options (circle, square, rounded)
 * - Accessible with proper ARIA attributes
 * - Loading states support
 * - Interactive (clickable) support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Avatar name="John Doe" />
 * 
 * // With image
 * <Avatar name="John Doe" imageUrl="/avatar.jpg" />
 * 
 * // Different sizes
 * <Avatar name="John Doe" size="lg" />
 * 
 * // Different shapes
 * <Avatar name="John Doe" shape="square" />
 * 
 * // Interactive
 * <Avatar name="John Doe" onClick={() => navigate('/profile')} />
 * ```
 */
const Avatar = memo(function Avatar({
  name,
  imageUrl,
  size = 'md',
  shape = 'circle',
  alt,
  className = '',
  onClick,
  isLoading = false,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayAlt = alt || `Profile picture of ${name}`;
  const config = sizeConfig[size];
  const shapeClass = shapeConfig[shape];
  
  // Show image only when: imageUrl exists, image loaded successfully, no error, not loading
  const showImage = !!(imageUrl && imageLoaded && !imageError && !isLoading);
  // Show placeholder when: no imageUrl OR image is loading OR image failed
  const showPlaceholder = !imageUrl || !imageLoaded || imageError;

  // Reset state when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setImageError(false);
      setImageLoaded(false);
    } else {
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
      className={`
        overflow-clip relative
        ${config.container}
        ${shapeClass}
        ${onClick ? 'cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2' : ''}
        ${className}
      `.trim()}
      data-name="Avatar"
      data-node-id="557:3287"
      role={onClick ? 'button' : 'img'}
      aria-label={displayAlt}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Placeholder image - shown when no image or image is loading */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-200 ${showPlaceholder ? 'opacity-100' : 'opacity-0'}`} 
        aria-hidden="true"
      >
        <div className="absolute bg-gradient-to-b from-[#e4e4e7] inset-0 to-[#fafafa]" />
        <Image
          src="/avatar-placeholder.jpg"
          alt=""
          fill
          sizes={`${config.pixels}px`}
          quality={90}
          className="object-cover object-[50%_50%]"
          priority={false}
          unoptimized={false}
        />
      </div>

      {/* User image - shown when loaded successfully */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={displayAlt}
          fill
          sizes={`${config.pixels}px`}
          quality={90}
          className={`
            object-cover
            transition-opacity duration-200
            ${showImage ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
          `.trim()}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
          unoptimized={false}
        />
      )}

      {/* Loading indicator (optional) */}
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
        </div>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;


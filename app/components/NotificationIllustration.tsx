'use client';

import { ComponentType, SVGProps } from 'react';
import EclipseSkyIcon from '@/app/assets/icons/eclipse-sky.svg';

interface NotificationIllustrationProps {
  /**
   * Whether the notification is unread
   * When true, displays a blue circle indicator in the top-right corner
   */
  isUnread?: boolean;
  
  /**
   * The illustration component to display
   * This is a swappable React component (typically an SVG icon)
   * Should be 40px x 40px
   */
  illustration?: ComponentType<SVGProps<SVGSVGElement>> | React.ReactNode | null;
  
  /**
   * Optional className for the container
   */
  className?: string;
}

/**
 * NotificationIllustration Component
 * 
 * Displays a notification illustration with an optional unread indicator.
 * Based on Figma design:
 * - Container: 41px x 41px
 * - Illustration: 40px x 40px (swappable component)
 * - Unread indicator: 6px circle at left-[35px] top-0
 */
export default function NotificationIllustration({ 
  isUnread = false,
  illustration = null,
  className = '' 
}: NotificationIllustrationProps) {
  // Render the illustration component
  const renderIllustration = () => {
    if (!illustration) {
      return null;
    }

    // Check if it's a React component (function component)
    // SVG components imported from .svg files are React function components
    if (typeof illustration === 'function') {
      const IllustrationComponent = illustration as ComponentType<SVGProps<SVGSVGElement>>;
      return (
        <div className="absolute bottom-0 left-0 overflow-clip rounded-[8px] size-[40px]">
          <IllustrationComponent className="h-full w-full" />
        </div>
      );
    }

    // If it's already a React node (JSX element), render it directly
    return (
      <div className="absolute bottom-0 left-0 overflow-clip rounded-[8px] size-[40px]">
        {illustration}
      </div>
    );
  };

  return (
    <div className={`relative size-[41px] overflow-visible ${className}`}>
      {/* Illustration Container - 40px x 40px */}
      {renderIllustration()}

      {/* Unread Indicator - 6px circle at top-right */}
      {isUnread && (
        <div className="absolute left-[35px] top-0 size-[6px] overflow-visible">
          <div className="absolute inset-0 rounded-full bg-[rgba(0,132,209,1)]" />
        </div>
      )}
    </div>
  );
}

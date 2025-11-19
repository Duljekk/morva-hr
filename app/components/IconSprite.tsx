'use client';

/**
 * SVG Sprite Sheet Component
 * 
 * Contains frequently used icons as symbols for efficient loading and caching.
 * Icons are referenced using <use> elements to reduce HTTP requests.
 * 
 * Usage:
 * <svg className="w-6 h-6">
 *   <use href="#icon-calendar" />
 * </svg>
 */

export default function IconSprite() {
  return (
    <svg style={{ display: 'none' }} aria-hidden="true">
      <defs>
        {/* Calendar Icon */}
        <symbol id="icon-calendar" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.1875 5.68749H11.8125M4.52083 2.77082V1.60416M9.47917 2.77082V1.60416M3.35417 11.8125H10.6458C11.2902 11.8125 11.8125 11.2902 11.8125 10.6458V3.93749C11.8125 3.29316 11.2902 2.77082 10.6458 2.77082H3.35417C2.70983 2.77082 2.1875 3.29316 2.1875 3.93749V10.6458C2.1875 11.2902 2.70983 11.8125 3.35417 11.8125Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </symbol>

        {/* Pulse Icons - Simple circle icons with specific colors */}
        <symbol id="icon-pulse-success" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="3" fill="#00D492"/>
          <circle opacity="0.2" cx="6" cy="6" r="6" fill="#00D492"/>
        </symbol>

        <symbol id="icon-pulse-danger" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="3" fill="#FB2C36"/>
          <circle opacity="0.2" cx="6" cy="6" r="6" fill="#FB2C36"/>
        </symbol>

        <symbol id="icon-pulse-progress" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="3" fill="#FF8904"/>
          <circle opacity="0.2" cx="6" cy="6" r="6" fill="#FF8904"/>
        </symbol>

        <symbol id="icon-pulse-neutral" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="3" fill="#D4D4D4"/>
          <circle opacity="0.1" cx="6" cy="6" r="6" fill="#A1A1A1"/>
        </symbol>
      </defs>
    </svg>
  );
}

/**
 * Helper component to render icons from sprite sheet
 */
interface SpriteIconProps {
  name: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function SpriteIcon({ name, className = '', width, height }: SpriteIconProps) {
  return (
    <svg 
      className={className}
      width={width}
      height={height}
      fill="currentColor"
      aria-hidden="true"
    >
      <use href={`#icon-${name}`} />
    </svg>
  );
}


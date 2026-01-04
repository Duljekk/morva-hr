'use client';

import { memo } from 'react';
import Image from 'next/image';
import { DotGrid1x3HorizontalIcon } from '@/components/icons';
import LinkIcon from '@/components/icons/shared/Link';
import MailIcon from '@/components/icons/shared/Mail';
import Logo from '@/app/assets/icons/logo-large.svg';

export interface CompanyData {
  /**
   * Company name
   */
  name: string;

  /**
   * Company industry/tagline
   */
  industry: string;

  /**
   * Company logo URL
   */
  logoUrl?: string | null;

  /**
   * Company website URL
   */
  website?: string;

  /**
   * Company email address
   */
  email?: string;
}

export interface SettingsLeftSectionProps {
  /**
   * Company data to display
   */
  company: CompanyData;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Callback when menu button is clicked
   */
  onMenuClick?: () => void;
}

/**
 * Settings Left Section Component
 *
 * Displays company profile information including:
 * - Banner with menu button (sky-50 background)
 * - Company logo (96x96)
 * - Company name and industry
 * - Website link and email
 *
 * Based on Figma design node 729:3187.
 *
 * Layout specifications:
 * - Border radius: 20px
 * - Shadow: 0px 4px 4px -2px rgba(0,0,0,0.05), 0px 0px 1px 1px rgba(0,0,0,0.1)
 * - Banner height: 84px
 * - Padding: 36px top, 28px sides and bottom
 * - Gap between sections: 14px
 *
 * @example
 * ```tsx
 * <SettingsLeftSection
 *   company={{
 *     name: 'Morva Labs',
 *     industry: 'Design & Technology',
 *     logoUrl: '/logo.png',
 *     website: 'morvalabs.com',
 *     email: 'lets@morvalabs.com',
 *   }}
 *   onMenuClick={() => console.log('Menu clicked')}
 * />
 * ```
 */
const SettingsLeftSection = memo(function SettingsLeftSection({
  company,
  className = '',
  onMenuClick,
}: SettingsLeftSectionProps) {
  const { name, industry, logoUrl, website, email } = company;

  return (
    <div
      className={`
        bg-white
        flex flex-col
        gap-7
        items-center justify-center
        overflow-clip
        pb-7 pt-9 px-7
        relative
        rounded-[20px]
        shadow-[0px_4px_4px_-2px_rgba(0,0,0,0.05),0px_0px_1px_1px_rgba(0,0,0,0.1)]
        w-full
        ${className}
      `.trim()}
    >
      {/* Banner */}
      <div className="absolute bg-[#f0f9ff] h-[84px] left-0 top-0 w-full">
        {/* Ghost Button (3-dot menu) */}
        <button
          type="button"
          onClick={onMenuClick}
          className="
            absolute right-[6px] top-[6px]
            rounded-lg size-7
            flex items-center justify-center
            hover:bg-white/50
            transition-colors
          "
          aria-label="Company options menu"
        >
          <DotGrid1x3HorizontalIcon className="text-[#525252]" />
        </button>
      </div>

      {/* Section Contents */}
      <div className="flex flex-col gap-3.5 items-start w-full z-10">
        {/* Header */}
        <div className="flex flex-col gap-2 items-start w-full">
          {/* Company Logo */}
          <div className="overflow-clip rounded-full size-24 shrink-0 bg-neutral-100 flex items-center justify-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={96}
                height={96}
                className="object-cover size-24 rounded-full"
              />
            ) : (
              <Logo className="size-24" />
            )}
          </div>

          {/* Contents - Name + Industry */}
          <div className="flex flex-col items-start w-full">
            {/* Company Name */}
            <h2 className="font-['Mona_Sans'] font-semibold leading-[30px] text-neutral-800 text-xl tracking-[-0.2px]">
              {name}
            </h2>

            {/* Industry */}
            <p className="font-['Mona_Sans'] font-normal leading-5 text-neutral-600 text-sm whitespace-pre-wrap">
              {industry}
            </p>
          </div>
        </div>

        {/* Link & Email */}
        <div className="flex gap-2 items-center w-full flex-wrap">
          {/* Website Link */}
          {website && (
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 items-center text-neutral-500 hover:text-neutral-600 transition-colors"
            >
              <LinkIcon size={14} />
              <span className="font-['Mona_Sans'] font-normal leading-5 text-sm">
                {website}
              </span>
            </a>
          )}

          {/* Email */}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex gap-1 items-center text-neutral-500 hover:text-neutral-600 transition-colors"
            >
              <MailIcon size={14} />
              <span className="font-['Mona_Sans'] font-normal leading-5 text-sm">
                {email}
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

SettingsLeftSection.displayName = 'SettingsLeftSection';

export default SettingsLeftSection;

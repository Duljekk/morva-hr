'use client';

import { SettingsIcon } from '@/components/icons';
import Tab from '@/components/shared/Tab';
import TabList from '@/components/shared/TabList';
import BuildingIcon from '@/components/icons/shared/Building';
import ClockIcon from '@/components/icons/shared/Clock';
import CalendarClockIcon from '@/components/icons/shared/CalendarClock';

export type SettingsTab = 'company' | 'office-hours' | 'time-off';

interface SettingsPageHeaderProps {
  /**
   * Currently active tab
   */
  activeTab: SettingsTab;
  
  /**
   * Callback when tab changes
   */
  onTabChange: (tab: SettingsTab) => void;
}

/**
 * Settings Page Header Component
 * 
 * Displays the Settings page title with icon and tab navigation.
 * 
 * Tabs:
 * - Company (Building icon)
 * - Office Hours (Clock icon)
 * - Time Off & Holidays (CalendarClock icon)
 */
export default function SettingsPageHeader({
  activeTab,
  onTabChange,
}: SettingsPageHeaderProps) {
  return (
    <div className="flex items-center justify-between pl-7 pr-6 py-6 w-full border-b border-dashed border-neutral-200">
      {/* Header + Icon */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Settings Icon */}
        <div className="size-6 shrink-0">
          <SettingsIcon size={24} className="text-[#525252]" />
        </div>
        
        {/* Title */}
        <h1 className="font-['Mona_Sans'] text-2xl font-semibold leading-7 text-[#525252]">
          Settings
        </h1>
      </div>
      
      {/* Tabs Container */}
      <div className="bg-neutral-100 flex items-center gap-0.5 h-9 px-0.5 rounded-[10px] shrink-0">
        <TabList aria-label="Settings sections">
          <Tab
            label="Company"
            state={activeTab === 'company' ? 'active' : 'default'}
            hasIcon
            icon={<BuildingIcon size={16} className={activeTab === 'company' ? 'text-[#525252]' : 'text-[#a1a1a1]'} />}
            onClick={() => onTabChange('company')}
            aria-controls="company-panel"
          />
          <Tab
            label="Office Hours"
            state={activeTab === 'office-hours' ? 'active' : 'default'}
            hasIcon
            icon={<ClockIcon size={16} className={activeTab === 'office-hours' ? 'text-[#525252]' : 'text-[#a1a1a1]'} />}
            onClick={() => onTabChange('office-hours')}
            aria-controls="office-hours-panel"
          />
          <Tab
            label="Time Off & Holidays"
            state={activeTab === 'time-off' ? 'active' : 'default'}
            hasIcon
            icon={<CalendarClockIcon size={16} className={activeTab === 'time-off' ? 'text-[#525252]' : 'text-[#a1a1a1]'} />}
            onClick={() => onTabChange('time-off')}
            aria-controls="time-off-panel"
          />
        </TabList>
      </div>
    </div>
  );
}

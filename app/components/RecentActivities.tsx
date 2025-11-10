'use client';

import CheckInNeutralIcon from '@/app/assets/icons/check-in-neutral.svg';
import CheckOutNeutralIcon from '@/app/assets/icons/check-out-neutral.svg';
import CalendarIcon from '@/app/assets/icons/calendar-1.svg';

interface Activity {
  type: 'checkin' | 'checkout' | 'leave';
  time: string;
  status?: 'late' | 'ontime' | 'overtime' | 'leftearly';
}

interface DayActivity {
  date: string;
  activities: Activity[];
}

interface RecentActivitiesProps {
  activities: DayActivity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-base font-semibold text-neutral-700 tracking-tight">
        Recent Activities
      </p>

      <div className="flex flex-col gap-3">
        {activities.map((day, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-3">
            {/* Date Badge */}
            <div className="w-fit flex items-center gap-0.5 rounded-3xl bg-[rgba(255,255,255,0.6)] px-2 py-1 shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.08)]">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              <p className="text-xs font-semibold text-neutral-700">
                {day.date}
              </p>
            </div>

            {/* Activity Card */}
            <div className="flex justify-end">
              <div className={`w-[339px] ${dayIndex < activities.length - 1 ? 'border-l-2 border-dashed border-neutral-300' : ''} pl-3.5`}>
                <div className="flex flex-col rounded-xl bg-[rgba(255,255,255,0.6)] px-3 py-2.5 shadow-[0px_1px_2px_0px_rgba(164,172,185,0.24),0px_0px_0.5px_0.5px_rgba(28,28,28,0.05)]">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex}>
                      {/* Activity Item */}
                      <div className={`flex items-center gap-2 ${actIndex > 0 ? 'pt-2.5' : ''} ${actIndex < day.activities.length - 1 ? 'pb-3' : ''}`}>
                        {/* Icon */}
                        {activity.type === 'checkin' ? (
                          <CheckInNeutralIcon className="h-8 w-8 shrink-0" />
                        ) : (
                          <CheckOutNeutralIcon className="h-8 w-8 shrink-0" />
                        )}

                        {/* Text and Badge */}
                        <div className="flex flex-1 items-start">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-neutral-600 tracking-tight leading-[18px]">
                              {activity.type === 'checkin' ? 'Checked-In' : 'Checked-Out'}
                            </p>
                            <p className="text-xs font-medium text-neutral-400 leading-4">
                              {activity.time}
                            </p>
                          </div>

                          {/* Status Badge */}
                          {activity.status && (
                            <div className={`rounded-xl px-2 py-0.5 ${
                              activity.status === 'late' 
                                ? 'bg-amber-100' 
                                : activity.status === 'ontime'
                                ? 'bg-green-100'
                                : activity.status === 'overtime'
                                ? 'bg-neutral-100'
                                : 'bg-amber-50'
                            }`}>
                              <p className={`text-xs font-semibold tracking-tight ${
                                activity.status === 'late'
                                  ? 'text-amber-700'
                                  : activity.status === 'ontime'
                                  ? 'text-green-700'
                                  : activity.status === 'overtime'
                                  ? 'text-neutral-600'
                                  : 'text-amber-600'
                              }`}>
                                {activity.status === 'late'
                                  ? 'Late'
                                  : activity.status === 'ontime'
                                  ? 'On Time'
                                  : activity.status === 'overtime'
                                  ? 'Overtime'
                                  : 'Left Early'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      {actIndex < day.activities.length - 1 && (
                        <div className="h-px w-full bg-neutral-100" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





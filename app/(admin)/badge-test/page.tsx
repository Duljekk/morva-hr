'use client';

import UnifiedBadge from '@/components/shared/UnifiedBadge';
import ActivityStatusBadge from '@/components/hr/employee/ActivityStatusBadge';
import AttendanceFeedBadge from '@/components/hr/dashboard/AttendanceFeedBadge';
import RoleBadge from '@/components/shared/RoleBadge';
import {
    CircleCheckIcon,
    TriangleWarningIcon,
    ClockIcon,
} from '@/components/icons';

export default function BadgeTestPage() {
    return (
        <div className="min-h-screen bg-neutral-50 p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                        UnifiedBadge Component Test
                    </h1>
                    <p className="text-neutral-600">
                        Showcasing all props and variants from Figma design (node 710-1423)
                    </p>
                </div>

                {/* Color Variants */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Color Variants
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <UnifiedBadge text="Neutral" color="neutral" />
                        <UnifiedBadge text="Success" color="success" />
                        <UnifiedBadge text="Warning" color="warning" />
                        <UnifiedBadge text="Danger" color="danger" />
                        <UnifiedBadge text="Sky" color="sky" />
                        <UnifiedBadge text="Cyan" color="cyan" />
                    </div>
                </section>

                {/* Size Variants */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Size Variants
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <UnifiedBadge text="Small (20px)" color="success" size="sm" />
                            <span className="text-xs text-neutral-500">size=&quot;sm&quot;</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <UnifiedBadge text="Medium (22px)" color="success" size="md" />
                            <span className="text-xs text-neutral-500">size=&quot;md&quot;</span>
                        </div>
                    </div>
                </section>

                {/* Font Weight Variants */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Font Weight Variants
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <UnifiedBadge text="Semibold" color="neutral" font="semibold" />
                            <span className="text-xs text-neutral-500">font=&quot;semibold&quot;</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <UnifiedBadge text="Medium" color="neutral" font="medium" />
                            <span className="text-xs text-neutral-500">font=&quot;medium&quot;</span>
                        </div>
                    </div>
                </section>

                {/* Icon Support */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Icon Support
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <UnifiedBadge
                            text="On Time"
                            color="success"
                            hasIcon
                            icon={<CircleCheckIcon size={12} className="text-[#00a63e]" />}
                        />
                        <UnifiedBadge
                            text="Late"
                            color="warning"
                            hasIcon
                            icon={<TriangleWarningIcon size={12} className="text-[#e17100]" />}
                        />
                        <UnifiedBadge
                            text="Overtime"
                            color="neutral"
                            hasIcon
                            icon={<ClockIcon size={12} className="text-[#737373]" />}
                        />
                    </div>
                    <p className="text-xs text-neutral-500 mt-3">
                        With icons: pl-[6px] pr-[4px] padding
                    </p>
                </section>

                {/* Migrated Components */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Migrated Components (using UnifiedBadge internally)
                    </h2>

                    {/* ActivityStatusBadge */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-700 mb-3">
                            ActivityStatusBadge
                        </h3>
                        <div className="flex gap-3">
                            <ActivityStatusBadge status="onTime" />
                            <ActivityStatusBadge status="late" />
                            <ActivityStatusBadge status="overtime" />
                        </div>
                    </div>

                    {/* AttendanceFeedBadge */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-700 mb-3">
                            AttendanceFeedBadge
                        </h3>
                        <div className="flex gap-3">
                            <AttendanceFeedBadge status="On Time" />
                            <AttendanceFeedBadge status="Late" />
                            <AttendanceFeedBadge status="Left Early" />
                            <AttendanceFeedBadge status="Overtime" />
                        </div>
                    </div>

                    {/* RoleBadge */}
                    <div>
                        <h3 className="text-sm font-medium text-neutral-700 mb-3">
                            RoleBadge
                        </h3>
                        <div className="flex gap-3">
                            <RoleBadge role="Intern" />
                            <RoleBadge role="Full-time" />
                        </div>
                    </div>
                </section>

                {/* All Combinations Preview */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        All Combinations
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200">
                                    <th className="text-left py-2 px-3 font-medium text-neutral-600">Color</th>
                                    <th className="text-left py-2 px-3 font-medium text-neutral-600">sm + semibold</th>
                                    <th className="text-left py-2 px-3 font-medium text-neutral-600">sm + medium</th>
                                    <th className="text-left py-2 px-3 font-medium text-neutral-600">md + semibold</th>
                                    <th className="text-left py-2 px-3 font-medium text-neutral-600">md + medium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(['neutral', 'success', 'warning', 'danger', 'sky', 'cyan'] as const).map((color) => (
                                    <tr key={color} className="border-b border-neutral-100">
                                        <td className="py-3 px-3 capitalize text-neutral-700">{color}</td>
                                        <td className="py-3 px-3">
                                            <UnifiedBadge text="Label" color={color} size="sm" font="semibold" />
                                        </td>
                                        <td className="py-3 px-3">
                                            <UnifiedBadge text="Label" color={color} size="sm" font="medium" />
                                        </td>
                                        <td className="py-3 px-3">
                                            <UnifiedBadge text="Label" color={color} size="md" font="semibold" />
                                        </td>
                                        <td className="py-3 px-3">
                                            <UnifiedBadge text="Label" color={color} size="md" font="medium" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

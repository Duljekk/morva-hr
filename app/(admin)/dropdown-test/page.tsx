'use client';

import { useState } from 'react';
import DropdownActionMenu from '@/components/shared/DropdownActionMenu';
import DropdownMenuItem from '@/components/shared/DropdownMenuItem';
import EditIcon from '@/components/icons/shared/Edit';
import TrashIcon from '@/components/icons/shared/Trash';
import { CircleCheckIcon, CopyIcon } from '@/components/icons';

export default function DropdownTestPage() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (id: string) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                        Dropdown Action Menu Test
                    </h1>
                    <p className="text-neutral-600">
                        Showcasing DropdownActionMenu and DropdownMenuItem components from Figma design (node 748:3447)
                    </p>
                </div>

                {/* Default Dropdown (Edit & Delete) */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Default Dropdown (Edit & Delete)
                    </h2>
                    <div className="flex gap-8">
                        {/* Bottom Right */}
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-sm text-neutral-600">Bottom Right (default)</span>
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('default-br')}
                                    className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                                >
                                    Open Menu
                                </button>
                                <DropdownActionMenu
                                    isOpen={openDropdown === 'default-br'}
                                    onClose={closeDropdown}
                                    onEdit={() => alert('Edit clicked!')}
                                    onDelete={() => alert('Delete clicked!')}
                                    position="bottom-right"
                                />
                            </div>
                        </div>

                        {/* Bottom Left */}
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-sm text-neutral-600">Bottom Left</span>
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('default-bl')}
                                    className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                                >
                                    Open Menu
                                </button>
                                <DropdownActionMenu
                                    isOpen={openDropdown === 'default-bl'}
                                    onClose={closeDropdown}
                                    onEdit={() => alert('Edit clicked!')}
                                    onDelete={() => alert('Delete clicked!')}
                                    position="bottom-left"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Position Variants */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Position Variants
                    </h2>
                    <div className="grid grid-cols-2 gap-8 p-12">
                        {/* Top Left */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('pos-tl')}
                                    className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                                >
                                    Top Left
                                </button>
                                <DropdownActionMenu
                                    isOpen={openDropdown === 'pos-tl'}
                                    onClose={closeDropdown}
                                    onEdit={() => alert('Edit clicked!')}
                                    onDelete={() => alert('Delete clicked!')}
                                    position="top-left"
                                />
                            </div>
                        </div>

                        {/* Top Right */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('pos-tr')}
                                    className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                                >
                                    Top Right
                                </button>
                                <DropdownActionMenu
                                    isOpen={openDropdown === 'pos-tr'}
                                    onClose={closeDropdown}
                                    onEdit={() => alert('Edit clicked!')}
                                    onDelete={() => alert('Delete clicked!')}
                                    position="top-right"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Custom Menu Items */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Custom Menu Items
                    </h2>
                    <div className="flex gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-sm text-neutral-600">Custom Actions</span>
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('custom')}
                                    className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                                >
                                    Open Custom
                                </button>
                                <DropdownActionMenu
                                    isOpen={openDropdown === 'custom'}
                                    onClose={closeDropdown}
                                >
                                    <DropdownMenuItem
                                        text="Copy"
                                        icon={<CopyIcon size={16} className="text-neutral-500" />}
                                        type="Neutral"
                                        onClick={() => {
                                            alert('Copy clicked!');
                                            closeDropdown();
                                        }}
                                    />
                                    <DropdownMenuItem
                                        text="Approve"
                                        icon={<CircleCheckIcon size={16} className="text-neutral-500" />}
                                        type="Neutral"
                                        onClick={() => {
                                            alert('Approve clicked!');
                                            closeDropdown();
                                        }}
                                    />
                                    <DropdownMenuItem
                                        text="Delete"
                                        icon={<TrashIcon size={16} className="text-red-500" />}
                                        type="Danger"
                                        onClick={() => {
                                            alert('Delete clicked!');
                                            closeDropdown();
                                        }}
                                    />
                                </DropdownActionMenu>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Individual Menu Items */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Individual Menu Items
                    </h2>
                    
                    {/* Neutral Type */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-700 mb-3">
                            Neutral Type
                        </h3>
                        <div className="inline-flex flex-col gap-[2px] bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(0,0,0,0.1)] p-[2px] w-[88px]">
                            <DropdownMenuItem
                                text="Edit"
                                type="Neutral"
                                onClick={() => alert('Edit clicked!')}
                            />
                            <DropdownMenuItem
                                text="Delete"
                                type="Danger"
                                onClick={() => alert('Delete clicked!')}
                            />
                        </div>
                    </div>

                    {/* Danger Type */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-neutral-700 mb-3">
                            Danger Type
                        </h3>
                        <div className="inline-flex flex-col gap-[2px] bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(0,0,0,0.1)] p-[2px] w-[88px]">
                            <DropdownMenuItem
                                text="Delete"
                                type="Danger"
                                onClick={() => alert('Delete clicked!')}
                            />
                        </div>
                    </div>

                    {/* Disabled State */}
                    <div>
                        <h3 className="text-sm font-medium text-neutral-700 mb-3">
                            Disabled State
                        </h3>
                        <div className="inline-flex flex-col gap-[2px] bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(0,0,0,0.1)] p-[2px] w-[88px]">
                            <DropdownMenuItem
                                text="Edit"
                                type="Neutral"
                                disabled
                                onClick={() => alert('This should not fire')}
                            />
                            <DropdownMenuItem
                                text="Delete"
                                type="Danger"
                                disabled
                                onClick={() => alert('This should not fire')}
                            />
                        </div>
                    </div>
                </section>

                {/* In Table Context */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        In Table Context (Typical Usage)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-200">
                                    <th className="text-left py-3 px-4 font-medium text-neutral-600">Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-neutral-600">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-neutral-600">Role</th>
                                    <th className="text-right py-3 px-4 font-medium text-neutral-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { id: 'row-1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
                                    { id: 'row-2', name: 'Jane Smith', email: 'jane@example.com', role: 'Employee' },
                                    { id: 'row-3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
                                ].map((row) => (
                                    <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                        <td className="py-3 px-4 text-neutral-700">{row.name}</td>
                                        <td className="py-3 px-4 text-neutral-600">{row.email}</td>
                                        <td className="py-3 px-4 text-neutral-600">{row.role}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => toggleDropdown(row.id)}
                                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                    aria-label="Actions"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                                                        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                                                        <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                                                    </svg>
                                                </button>
                                                <DropdownActionMenu
                                                    isOpen={openDropdown === row.id}
                                                    onClose={closeDropdown}
                                                    onEdit={() => alert(`Edit ${row.name}`)}
                                                    onDelete={() => alert(`Delete ${row.name}`)}
                                                    position="bottom-right"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Features & Interactions */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Features & Interactions
                    </h2>
                    <ul className="space-y-2 text-sm text-neutral-600">
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>Click outside:</strong> Click anywhere outside the dropdown to close it</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>Escape key:</strong> Press ESC to close the dropdown</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>Keyboard navigation:</strong> Use Tab to navigate, Enter/Space to select</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>Hover states:</strong> Menu items show hover background on mouse over</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>Auto-close:</strong> Menu closes automatically after selecting an item</span>
                        </li>
                    </ul>
                </section>

                {/* Specifications */}
                <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                        Design Specifications
                    </h2>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <h3 className="font-medium text-neutral-700 mb-2">DropdownActionMenu</h3>
                            <ul className="space-y-1 text-neutral-600">
                                <li>• Width: 88px</li>
                                <li>• Border radius: 8px</li>
                                <li>• Padding: 2px vertical</li>
                                <li>• Gap: 2px between items</li>
                                <li>• Shadow: 0px 1px 2px rgba(0,0,0,0.05)</li>
                                <li>• Border: 1px rgba(0,0,0,0.1)</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-neutral-700 mb-2">DropdownMenuItem</h3>
                            <ul className="space-y-1 text-neutral-600">
                                <li>• Height: 32px</li>
                                <li>• Padding: 6px horizontal</li>
                                <li>• Border radius: 6px</li>
                                <li>• Icon size: 16px in 20px container</li>
                                <li>• Text: 14px, regular, 20px line-height</li>
                                <li>• Hover: bg-neutral-50 (#fafafa)</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

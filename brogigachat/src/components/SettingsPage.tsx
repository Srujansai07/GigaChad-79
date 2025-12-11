'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Volume2, Moon, Smartphone, ChevronRight, LogOut } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';

export default function SettingsPage() {
    const { user, updateUser, resetProgress } = useUserStore();
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const settings = [
        {
            category: 'Notifications',
            icon: Bell,
            items: [
                {
                    id: 'notificationsEnabled',
                    label: 'Push Notifications',
                    type: 'toggle' as const,
                    value: user.notificationsEnabled ?? true,
                },
                {
                    id: 'notificationSound',
                    label: 'Notification Sound',
                    type: 'select' as const,
                    value: 'default',
                    options: ['default', 'aggressive', 'subtle', 'silent'],
                },
            ],
        },
        {
            category: 'Strict Mode',
            icon: Shield,
            items: [
                {
                    id: 'strictModeEnabled',
                    label: 'Enable Strict Mode',
                    type: 'toggle' as const,
                    value: user.strictModeEnabled ?? true,
                },
                {
                    id: 'autoStrictMode',
                    label: 'Auto-trigger after 3 skips',
                    type: 'toggle' as const,
                    value: true,
                },
                {
                    id: 'strictnesslevel',
                    label: 'Strictness Level',
                    type: 'select' as const,
                    value: 'medium',
                    options: ['gentle', 'medium', 'beast'],
                },
            ],
        },
        {
            category: 'AI Voice',
            icon: Volume2,
            items: [
                {
                    id: 'voicePack',
                    label: 'Voice Pack',
                    type: 'select' as const,
                    value: user.voicePack || 'topg',
                    options: ['topg', 'monk', 'friend', 'drill'],
                },
            ],
        },
        {
            category: 'Appearance',
            icon: Moon,
            items: [
                {
                    id: 'darkMode',
                    label: 'Dark Mode',
                    type: 'toggle' as const,
                    value: true,
                },
                {
                    id: 'reduceMotion',
                    label: 'Reduce Motion',
                    type: 'toggle' as const,
                    value: false,
                },
            ],
        },
    ];

    const handleToggle = (id: string, value: boolean) => {
        updateUser({ [id]: value });
    };

    const handleSelect = (id: string, value: string) => {
        updateUser({ [id]: value });
    };

    const handleReset = () => {
        resetProgress();
        setShowResetConfirm(false);
    };

    return (
        <div className="min-h-screen bg-background p-4 pb-24">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings size={24} />
                Settings
            </h1>

            {settings.map((section) => (
                <div key={section.category} className="mb-6">
                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                        <section.icon size={16} />
                        <span className="text-sm font-medium">{section.category}</span>
                    </div>

                    <div className="bg-surface rounded-xl border border-gray-800 divide-y divide-gray-800">
                        {section.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4">
                                <span className="text-white">{item.label}</span>

                                {item.type === 'toggle' && (
                                    <button
                                        onClick={() => handleToggle(item.id, !item.value)}
                                        className={`w-12 h-6 rounded-full transition-colors ${item.value ? 'bg-primary' : 'bg-gray-700'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${item.value ? 'translate-x-6' : 'translate-x-0.5'
                                            }`} />
                                    </button>
                                )}

                                {item.type === 'select' && (
                                    <select
                                        value={item.value}
                                        onChange={(e) => handleSelect(item.id, e.target.value)}
                                        className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-700 text-sm"
                                    >
                                        {item.options?.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Account Actions */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                    <Smartphone size={16} />
                    <span className="text-sm font-medium">Account</span>
                </div>

                <div className="bg-surface rounded-xl border border-gray-800 divide-y divide-gray-800">
                    <button className="w-full flex items-center justify-between p-4 text-white">
                        <span>Export Data</span>
                        <ChevronRight size={20} className="text-gray-500" />
                    </button>

                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full flex items-center justify-between p-4 text-danger"
                    >
                        <span>Reset Progress</span>
                        <ChevronRight size={20} />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 text-gray-400">
                        <span className="flex items-center gap-2">
                            <LogOut size={16} />
                            Sign Out
                        </span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-sm w-full border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-2">Reset Progress?</h2>
                        <p className="text-gray-400 mb-6">
                            This will reset your aura, streak, badges, and all stats to zero. This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-3 bg-gray-700 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 py-3 bg-danger text-white rounded-lg font-bold"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Version */}
            <p className="text-center text-gray-600 text-xs mt-8">
                BroGigaChad v1.0.0 â€¢ Made with ðŸ”¥
            </p>
        </div>
    );
}

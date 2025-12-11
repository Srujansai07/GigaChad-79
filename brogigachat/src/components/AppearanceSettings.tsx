'use client';

import { useState } from 'react';
import { Moon, Sun, Volume2, VolumeX, Vibrate, Smartphone, Globe } from 'lucide-react';

interface ToggleProps {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description?: string;
    icon: React.ReactNode;
}

function SettingToggle({ enabled, onToggle, label, description, icon }: ToggleProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                    {icon}
                </div>
                <div>
                    <p className="font-medium text-white">{label}</p>
                    {description && (
                        <p className="text-sm text-gray-400">{description}</p>
                    )}
                </div>
            </div>
            <button
                onClick={onToggle}
                className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-700'
                    }`}
            >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
            </button>
        </div>
    );
}

export default function AppearanceSettings() {
    const [settings, setSettings] = useState({
        darkMode: true,
        soundEnabled: true,
        vibrateEnabled: true,
        reducedMotion: false,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-surface rounded-xl border border-gray-800 divide-y divide-gray-800">
            <div className="p-4">
                <h3 className="font-bold text-white mb-2">Appearance</h3>
                <SettingToggle
                    enabled={settings.darkMode}
                    onToggle={() => toggleSetting('darkMode')}
                    label="Dark Mode"
                    description="TopG aesthetic (recommended)"
                    icon={settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                />
            </div>

            <div className="p-4">
                <h3 className="font-bold text-white mb-2">Feedback</h3>
                <SettingToggle
                    enabled={settings.soundEnabled}
                    onToggle={() => toggleSetting('soundEnabled')}
                    label="Sound Effects"
                    description="Completion sounds and alerts"
                    icon={settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                />
                <SettingToggle
                    enabled={settings.vibrateEnabled}
                    onToggle={() => toggleSetting('vibrateEnabled')}
                    label="Haptic Feedback"
                    description="Vibration on actions"
                    icon={<Vibrate size={18} />}
                />
            </div>

            <div className="p-4">
                <h3 className="font-bold text-white mb-2">Accessibility</h3>
                <SettingToggle
                    enabled={settings.reducedMotion}
                    onToggle={() => toggleSetting('reducedMotion')}
                    label="Reduced Motion"
                    description="Minimize animations"
                    icon={<Smartphone size={18} />}
                />
            </div>
        </div>
    );
}

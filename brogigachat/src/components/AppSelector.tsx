'use client';

import { APP_DEEP_LINKS, buildDeepLink, executeTeleport } from '@/lib/deeplinks';

interface AppSelectorProps {
    selectedApp: string;
    onSelect: (app: string) => void;
    context?: Record<string, string>;
}

export default function AppSelector({ selectedApp, onSelect, context }: AppSelectorProps) {
    const apps = Object.entries(APP_DEEP_LINKS).filter(([key]) => key !== 'custom');

    return (
        <div className="space-y-3">
            <label className="block text-sm text-gray-400">Target App</label>
            <div className="grid grid-cols-4 gap-2">
                {apps.map(([key, app]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onSelect(key)}
                        className={`p-3 rounded-lg text-center transition-all ${selectedApp === key
                                ? 'bg-primary border-2 border-primary text-white scale-105'
                                : 'bg-surface border border-gray-700 hover:border-primary/50'
                            }`}
                    >
                        <span className="text-2xl block mb-1">{app.icon}</span>
                        <span className="text-[10px] text-gray-400">{app.name}</span>
                    </button>
                ))}
            </div>

            {/* Context hint */}
            {selectedApp && APP_DEEP_LINKS[selectedApp]?.contextSupport && (
                <p className="text-xs text-gray-500">
                    💡 {APP_DEEP_LINKS[selectedApp].description}
                </p>
            )}
        </div>
    );
}

// Quick Teleport Button
interface TeleportButtonProps {
    app: string;
    context?: Record<string, any>;
    children: React.ReactNode;
    className?: string;
}

export function TeleportButton({ app, context, children, className = '' }: TeleportButtonProps) {
    const handleTeleport = () => {
        const deepLink = buildDeepLink({
            app: app as keyof typeof APP_DEEP_LINKS,
            context
        });

        if (deepLink) {
            executeTeleport({
                app,
                deepLink,
                context,
                fallbackUrl: `https://${app}.com`,
            });
        }
    };

    return (
        <button
            onClick={handleTeleport}
            className={`flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg transition-colors ${className}`}
        >
            <span className="text-lg">{APP_DEEP_LINKS[app]?.icon || '📱'}</span>
            {children}
        </button>
    );
}

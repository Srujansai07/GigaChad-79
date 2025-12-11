'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationSettings() {
    const {
        permission,
        requestPermission,
        subscribe,
        sendTestNotification,
        isSupported
    } = useNotifications();

    const [loading, setLoading] = useState(false);

    const handleEnable = async () => {
        setLoading(true);
        const granted = await requestPermission();
        if (granted) {
            await subscribe();
        }
        setLoading(false);
    };

    if (!isSupported) {
        return (
            <div className="bg-surface rounded-xl p-4 border border-gray-800">
                <div className="flex items-center gap-3 text-gray-400">
                    <BellOff size={20} />
                    <span className="text-sm">Notifications not supported on this browser</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {permission.granted ? (
                        <Bell size={20} className="text-success" />
                    ) : (
                        <BellOff size={20} className="text-gray-400" />
                    )}
                    <div>
                        <p className="font-medium text-white">Push Notifications</p>
                        <p className="text-sm text-gray-400">
                            {permission.granted
                                ? 'Notifications enabled'
                                : permission.denied
                                    ? 'Notifications blocked'
                                    : 'Get reminders for your tasks'}
                        </p>
                    </div>
                </div>

                {permission.granted ? (
                    <div className="flex items-center gap-2">
                        <Check size={20} className="text-success" />
                        <button
                            onClick={sendTestNotification}
                            className="text-xs text-primary underline"
                        >
                            Test
                        </button>
                    </div>
                ) : permission.denied ? (
                    <span className="text-xs text-gray-500">
                        Enable in browser settings
                    </span>
                ) : (
                    <button
                        onClick={handleEnable}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                        {loading ? 'Enabling...' : 'Enable'}
                    </button>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { isOnline, onOnlineStatusChange, getOfflineQueue, syncOfflineActions } from '@/lib/pwa';
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react';

export default function OfflineIndicator() {
    const [online, setOnline] = useState(true);
    const [pendingActions, setPendingActions] = useState(0);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        setOnline(isOnline());
        setPendingActions(getOfflineQueue().length);

        const cleanup = onOnlineStatusChange(async (isOnline) => {
            setOnline(isOnline);

            // Auto-sync when coming back online
            if (isOnline && pendingActions > 0) {
                setSyncing(true);
                await syncOfflineActions();
                setPendingActions(getOfflineQueue().length);
                setSyncing(false);
            }
        });

        return cleanup;
    }, [pendingActions]);

    // Only show when offline or has pending actions
    if (online && pendingActions === 0) return null;

    return (
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${online
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-danger/20 text-danger border border-danger/30'
                }`}
        >
            {online ? (
                <>
                    {syncing ? (
                        <>
                            <Cloud className="animate-pulse" size={16} />
                            <span>Syncing...</span>
                        </>
                    ) : (
                        <>
                            <Wifi size={16} />
                            <span>Online</span>
                            {pendingActions > 0 && (
                                <span className="bg-warning/20 text-warning px-2 py-0.5 rounded-full text-xs">
                                    {pendingActions} pending
                                </span>
                            )}
                        </>
                    )}
                </>
            ) : (
                <>
                    <WifiOff size={16} />
                    <span>Offline</span>
                    {pendingActions > 0 && (
                        <span className="bg-surface text-gray-400 px-2 py-0.5 rounded-full text-xs">
                            {pendingActions} queued
                        </span>
                    )}
                </>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function ConnectionStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [showReconnecting, setShowReconnecting] = useState(false);

    useEffect(() => {
        const updateOnlineStatus = () => {
            const online = navigator.onLine;
            setIsOnline(online);

            if (!online) {
                setShowReconnecting(false);
            }
        };

        const handleOnline = () => {
            setShowReconnecting(true);
            setTimeout(() => {
                setIsOnline(true);
                setShowReconnecting(false);
            }, 1000);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', updateOnlineStatus);

        updateOnlineStatus();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    if (isOnline && !showReconnecting) return null;

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm font-medium transition-all ${showReconnecting
                ? 'bg-success text-white'
                : 'bg-danger text-white'
            }`}>
            {showReconnecting ? (
                <div className="flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Reconnecting...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                    <WifiOff size={14} />
                    <span>You're offline. Changes will sync when you reconnect.</span>
                </div>
            )}
        </div>
    );
}

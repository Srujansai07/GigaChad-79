'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    isPushSupported,
    requestNotificationPermission,
    subscribeToPush,
    unsubscribeFromPush,
    getCurrentSubscription,
} from '@/lib/notifications';

interface UseNotificationsReturn {
    isSupported: boolean;
    permission: NotificationPermission;
    isSubscribed: boolean;
    subscription: PushSubscription | null;
    loading: boolean;
    error: string | null;
    requestPermission: () => Promise<boolean>;
    subscribe: () => Promise<boolean>;
    unsubscribe: () => Promise<boolean>;
}

export function useNotifications(): UseNotificationsReturn {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize on mount
    useEffect(() => {
        const init = async () => {
            const supported = isPushSupported();
            setIsSupported(supported);

            if (supported) {
                setPermission(Notification.permission);

                const currentSub = await getCurrentSubscription();
                if (currentSub) {
                    setSubscription(currentSub);
                    setIsSubscribed(true);
                }
            }

            setLoading(false);
        };

        init();
    }, []);

    // Request permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const perm = await requestNotificationPermission();
            setPermission(perm);

            return perm === 'granted';
        } catch (err) {
            setError('Failed to request permission');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Subscribe to push
    const subscribe = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            // Ensure permission is granted
            if (Notification.permission !== 'granted') {
                const granted = await requestPermission();
                if (!granted) {
                    setError('Permission denied');
                    return false;
                }
            }

            const sub = await subscribeToPush();
            if (sub) {
                setSubscription(sub);
                setIsSubscribed(true);
                return true;
            } else {
                setError('Failed to subscribe');
                return false;
            }
        } catch (err) {
            setError('Subscription failed');
            return false;
        } finally {
            setLoading(false);
        }
    }, [requestPermission]);

    // Unsubscribe from push
    const unsubscribe = useCallback(async (): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const success = await unsubscribeFromPush();
            if (success) {
                setSubscription(null);
                setIsSubscribed(false);
            }
            return success;
        } catch (err) {
            setError('Failed to unsubscribe');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isSupported,
        permission,
        isSubscribed,
        subscription,
        loading,
        error,
        requestPermission,
        subscribe,
        unsubscribe,
    };
}

'use client';

// Web Push Notification utilities

// Check for notification support
export function isPushSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!isPushSupported()) {
        console.warn('Push notifications not supported');
        return 'denied';
    }

    return await Notification.requestPermission();
}

// Register service worker and get push subscription
export async function subscribeToPush(): Promise<PushSubscription | null> {
    try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');

        // Wait for active workers
        await navigator.serviceWorker.ready;

        // Get VAPID public key
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
            console.error('VAPID public key not configured');
            return null;
        }

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        console.log('Push subscription created');
        return subscription;
    } catch (error) {
        console.error('Failed to subscribe to push:', error);
        return null;
    }
}

// Unsubscribe from push
export async function unsubscribeFromPush(): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
            console.log('Unsubscribed from push');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Failed to unsubscribe:', error);
        return false;
    }
}

// Get current push subscription
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
    try {
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    } catch (error) {
        console.error('Failed to get subscription:', error);
        return null;
    }
}

// Show local notification (for testing/fallback)
export function showLocalNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/icon-192.png',
            badge: '/badge-72.png',
            vibrate: [200, 100, 200],
            ...options,
        });
    }
}

// Helper: Convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Send push subscription to server
export async function saveSubscription(subscription: PushSubscription, userId: string): Promise<boolean> {
    try {
        const response = await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subscription: subscription.toJSON(),
                userId,
            }),
        });
        return response.ok;
    } catch (error) {
        console.error('Failed to save subscription:', error);
        return false;
    }
}

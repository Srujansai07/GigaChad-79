/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// BroGigaChad Service Worker for Push Notifications

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[SW] Service worker activated');
    event.waitUntil(self.clients.claim());
});

// Push notification received
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');

    let data: {
        title: string;
        body: string;
        taskId?: string;
        type?: 'reminder' | 'strict_mode' | 'aura' | 'badge';
        image?: string;
    } = {
        title: 'BroGigaChad',
        body: 'Time to grind!',
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options: NotificationOptions = {
        body: data.body,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        tag: data.taskId || 'default',
        renotify: true,
        requireInteraction: data.type === 'strict_mode',
        data: {
            taskId: data.taskId,
            type: data.type,
            url: data.taskId ? `/?task=${data.taskId}` : '/',
        },
        actions: [
            { action: 'do_it', title: 'DO IT NOW 🔥' },
            { action: 'extend', title: '+10 min' },
        ],
    };

    // Different styling based on type
    if (data.type === 'strict_mode') {
        options.body = '⚠️ STRICT MODE ACTIVATED! You skipped 3 times. No escape!';
        options.vibrate = [500, 200, 500, 200, 500];
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);

    event.notification.close();

    const data = event.notification.data;
    let url = '/';

    if (event.action === 'do_it' && data.taskId) {
        url = `/?action=complete&task=${data.taskId}`;
    } else if (event.action === 'extend' && data.taskId) {
        url = `/?action=extend&task=${data.taskId}`;
    } else if (data.url) {
        url = data.url;
    }

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clientList) => {
            // If app already open, focus it
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});

// Notification close handler
self.addEventListener('notificationclose', (event) => {
    console.log('[SW] Notification closed without action');

    // Log as ignored notification if it was a task reminder
    const data = event.notification.data;
    if (data?.taskId) {
        // Send to server to log ignored notification
        fetch('/api/notifications/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId: data.taskId,
                action: 'IGNORED',
            }),
        }).catch(console.error);
    }
});

export { };

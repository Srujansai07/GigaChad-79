// ==================================================
// BroGigaChad - PWA Utilities
// Phase 1, Sub 1.7: PWA & Offline Support
// ==================================================

// Check if app is installed as PWA
export function isPWAInstalled(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for display-mode: standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Check for iOS standalone mode
    const isIOSStandalone = (window.navigator as any).standalone === true;

    return isStandalone || isIOSStandalone;
}

// Check if app can be installed
export function canInstallPWA(): boolean {
    if (typeof window === 'undefined') return false;
    return 'BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window;
}

// PWA Install prompt handler
let deferredPrompt: any = null;

export function initPWAInstallPrompt(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('[PWA] Install prompt captured');
    });
}

export async function promptPWAInstall(): Promise<boolean> {
    if (!deferredPrompt) {
        console.log('[PWA] No install prompt available');
        return false;
    }

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;

    return result.outcome === 'accepted';
}

// Check if running on iOS
export function isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Check if running on Android
export function isAndroid(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });
        console.log('[PWA] Service worker registered:', registration.scope);
        return registration;
    } catch (error) {
        console.error('[PWA] Service worker registration failed:', error);
        return null;
    }
}

// Unregister service worker
export async function unregisterServiceWorker(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return false;
    }

    const registration = await navigator.serviceWorker.ready;
    return registration.unregister();
}

// Check for updates
export async function checkForUpdates(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return false;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return registration.waiting !== null;
}

// Force update (skip waiting)
export async function forceUpdate(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }

    const registration = await navigator.serviceWorker.ready;

    if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    }
}

// Offline status
export function isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
}

// Offline event listeners
export function onOnlineStatusChange(callback: (online: boolean) => void): () => void {
    if (typeof window === 'undefined') return () => { };

    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}

// Cache sync for offline data
export interface OfflineAction {
    id: string;
    type: 'CREATE_TASK' | 'COMPLETE_TASK' | 'SKIP_TASK' | 'UPDATE_USER';
    data: any;
    timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'bro-offline-queue';

export function queueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): void {
    const queue = getOfflineQueue();
    queue.push({
        ...action,
        id: Math.random().toString(36).slice(2),
        timestamp: Date.now(),
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function getOfflineQueue(): OfflineAction[] {
    const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
}

export function clearOfflineQueue(): void {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

export async function syncOfflineActions(): Promise<number> {
    const queue = getOfflineQueue();
    if (queue.length === 0) return 0;

    let synced = 0;

    for (const action of queue) {
        try {
            // Send to appropriate API endpoint
            const endpoint = getEndpointForAction(action.type);
            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(action.data),
            });
            synced++;
        } catch (error) {
            console.error('[Offline] Failed to sync action:', action.id, error);
            // Keep failed actions in queue
            break;
        }
    }

    // Remove synced actions
    const remaining = queue.slice(synced);
    if (remaining.length > 0) {
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    } else {
        clearOfflineQueue();
    }

    return synced;
}

function getEndpointForAction(type: OfflineAction['type']): string {
    switch (type) {
        case 'CREATE_TASK': return '/api/tasks';
        case 'COMPLETE_TASK': return '/api/tasks/complete';
        case 'SKIP_TASK': return '/api/tasks/skip';
        case 'UPDATE_USER': return '/api/user';
        default: return '/api/sync';
    }
}

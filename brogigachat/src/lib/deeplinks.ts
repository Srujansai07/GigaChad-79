// ==================================================
// BroGigaChad - Deep Linking System
// Phase 1, Sub 1.4: Smart Task Router
// ==================================================

// Supported app deep links (from docs)
export const APP_DEEP_LINKS: Record<string, {
    name: string;
    icon: string;
    schemes: string[];
    description: string;
    contextSupport: boolean;
}> = {
    twitter: {
        name: 'Twitter/X',
        icon: '𝕏',
        schemes: ['twitter://post?message=', 'twitter://compose', 'twitter://'],
        description: 'Opens Twitter to compose tweet',
        contextSupport: true,
    },
    instagram: {
        name: 'Instagram',
        icon: '📸',
        schemes: ['instagram://library', 'instagram://camera', 'instagram://'],
        description: 'Opens Instagram camera/library',
        contextSupport: true,
    },
    youtube: {
        name: 'YouTube',
        icon: '▶️',
        schemes: ['vnd.youtube://', 'youtube://', 'https://youtube.com/'],
        description: 'Opens YouTube video',
        contextSupport: true,
    },
    spotify: {
        name: 'Spotify',
        icon: '🎵',
        schemes: ['spotify://track/', 'spotify://playlist/', 'spotify://'],
        description: 'Opens Spotify playlist/track',
        contextSupport: true,
    },
    notion: {
        name: 'Notion',
        icon: '📝',
        schemes: ['notion://', 'https://notion.so/'],
        description: 'Opens Notion page',
        contextSupport: true,
    },
    strava: {
        name: 'Strava',
        icon: '🏃',
        schemes: ['strava://record/new/start', 'strava://'],
        description: 'Opens Strava to record workout',
        contextSupport: true,
    },
    gmail: {
        name: 'Gmail',
        icon: '📧',
        schemes: ['googlegmail://co?to=', 'mailto:'],
        description: 'Opens Gmail to compose',
        contextSupport: true,
    },
    calendar: {
        name: 'Calendar',
        icon: '📅',
        schemes: ['calshow://', 'content://com.android.calendar'],
        description: 'Opens calendar app',
        contextSupport: false,
    },
    notes: {
        name: 'Notes',
        icon: '📓',
        schemes: ['mobilenotes://', 'note://'],
        description: 'Opens notes app',
        contextSupport: false,
    },
    fitness: {
        name: 'Fitness/Gym',
        icon: '💪',
        schemes: ['fitness://', 'strong://'],
        description: 'Opens fitness app',
        contextSupport: false,
    },
    browser: {
        name: 'Browser',
        icon: '🌐',
        schemes: ['https://', 'http://'],
        description: 'Opens web URL',
        contextSupport: true,
    },
    custom: {
        name: 'Custom App',
        icon: '📱',
        schemes: [],
        description: 'Custom URL scheme',
        contextSupport: true,
    },
};

// ==================================================
// DEEP LINK BUILDER
// ==================================================

export interface DeepLinkConfig {
    app: keyof typeof APP_DEEP_LINKS;
    action?: string;
    params?: Record<string, string>;
    fallbackUrl?: string;
    context?: {
        message?: string;
        hashtags?: string[];
        url?: string;
        position?: string;
        playlistId?: string;
        pageId?: string;
    };
}

export function buildDeepLink(config: DeepLinkConfig): string {
    const appConfig = APP_DEEP_LINKS[config.app];
    if (!appConfig) return '';

    const baseScheme = appConfig.schemes[0] || '';
    let deepLink = baseScheme;

    // Build context-aware links
    switch (config.app) {
        case 'twitter':
            if (config.context?.message) {
                const message = encodeURIComponent(config.context.message);
                const hashtags = config.context.hashtags?.join(',') || '';
                deepLink = `twitter://post?message=${message}${hashtags ? `&hashtags=${hashtags}` : ''}`;
            }
            break;

        case 'spotify':
            if (config.context?.playlistId) {
                deepLink = `spotify://playlist/${config.context.playlistId}`;
            }
            break;

        case 'youtube':
            if (config.context?.url) {
                const videoId = extractYouTubeId(config.context.url);
                deepLink = videoId ? `vnd.youtube://${videoId}` : config.context.url;
            }
            break;

        case 'notion':
            if (config.context?.pageId) {
                deepLink = `notion://${config.context.pageId}`;
            }
            break;

        case 'strava':
            deepLink = 'strava://record/new/start';
            break;

        case 'browser':
            deepLink = config.context?.url || 'https://google.com';
            break;

        default:
            // Use base scheme or fallback
            deepLink = baseScheme || config.fallbackUrl || '';
    }

    return deepLink;
}

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// ==================================================
// TELEPORTATION SYSTEM
// ==================================================

export interface TeleportConfig {
    app: string;
    deepLink: string;
    context?: Record<string, any>;
    fallbackUrl?: string;
    preActions?: string[]; // e.g., ['clearApps', 'hideDistractions']
    postActions?: string[]; // e.g., ['startTimer', 'trackSession']
}

export function executeTeleport(config: TeleportConfig): void {
    // Pre-actions (for mobile native)
    if (config.preActions?.includes('clearApps')) {
        // Native bridge call would go here
        console.log('[Teleport] Clearing recent apps...');
    }

    // Attempt deep link
    try {
        // On web, we use window.open or location.href
        if (typeof window !== 'undefined') {
            // Try deep link first
            window.location.href = config.deepLink;

            // Fallback after delay
            if (config.fallbackUrl) {
                setTimeout(() => {
                    // If we're still here, deep link didn't work
                    window.location.href = config.fallbackUrl!;
                }, 2000);
            }
        }
    } catch (error) {
        console.error('[Teleport] Failed:', error);
        if (config.fallbackUrl) {
            window.location.href = config.fallbackUrl;
        }
    }
}

// ==================================================
// CONTEXT PRESERVATION
// ==================================================

export interface TaskContext {
    taskId: string;
    app: string;
    lastPosition?: {
        page?: string;
        scroll?: number;
        cursor?: number;
        timestamp?: number;
    };
    prefill?: {
        text?: string;
        hashtags?: string[];
        mentions?: string[];
        attachments?: string[];
    };
    savedData?: Record<string, any>;
}

// Save task context to localStorage
export function saveTaskContext(context: TaskContext): void {
    const key = `bro-context-${context.taskId}`;
    localStorage.setItem(key, JSON.stringify({
        ...context,
        savedAt: Date.now(),
    }));
}

// Load task context
export function loadTaskContext(taskId: string): TaskContext | null {
    const key = `bro-context-${taskId}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

// Clear task context
export function clearTaskContext(taskId: string): void {
    localStorage.removeItem(`bro-context-${taskId}`);
}

// ==================================================
// QUICK ACTIONS
// ==================================================

export const QUICK_ACTIONS = [
    {
        id: 'tweet',
        label: 'Post Tweet',
        icon: '𝕏',
        app: 'twitter',
        action: () => buildDeepLink({ app: 'twitter', context: { message: '' } }),
    },
    {
        id: 'workout',
        label: 'Start Workout',
        icon: '🏃',
        app: 'strava',
        action: () => buildDeepLink({ app: 'strava' }),
    },
    {
        id: 'write',
        label: 'Write Notes',
        icon: '📝',
        app: 'notion',
        action: () => buildDeepLink({ app: 'notion' }),
    },
    {
        id: 'music',
        label: 'Play Music',
        icon: '🎵',
        app: 'spotify',
        action: () => buildDeepLink({ app: 'spotify' }),
    },
    {
        id: 'email',
        label: 'Check Email',
        icon: '📧',
        app: 'gmail',
        action: () => buildDeepLink({ app: 'gmail' }),
    },
];

// ==================================================
// APP DETECTION (for native)
// ==================================================

export function detectInstalledApps(): Promise<string[]> {
    // This would be implemented via native bridge
    // For web, we can only check via intent fallback behavior
    return Promise.resolve(Object.keys(APP_DEEP_LINKS));
}

// Generate app store fallback link
export function getAppStoreLink(app: string, platform: 'ios' | 'android'): string {
    const appStoreLinks: Record<string, { ios: string; android: string }> = {
        twitter: {
            ios: 'https://apps.apple.com/app/twitter/id333903271',
            android: 'https://play.google.com/store/apps/details?id=com.twitter.android',
        },
        instagram: {
            ios: 'https://apps.apple.com/app/instagram/id389801252',
            android: 'https://play.google.com/store/apps/details?id=com.instagram.android',
        },
        spotify: {
            ios: 'https://apps.apple.com/app/spotify/id324684580',
            android: 'https://play.google.com/store/apps/details?id=com.spotify.music',
        },
        notion: {
            ios: 'https://apps.apple.com/app/notion/id1232780281',
            android: 'https://play.google.com/store/apps/details?id=notion.id',
        },
        strava: {
            ios: 'https://apps.apple.com/app/strava/id426826309',
            android: 'https://play.google.com/store/apps/details?id=com.strava',
        },
    };

    return appStoreLinks[app]?.[platform] || '';
}

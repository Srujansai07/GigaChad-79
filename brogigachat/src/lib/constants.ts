// Constants for BroGigaChad
// Centralized configuration values

export const APP_NAME = 'BroGigaChad';
export const APP_TAGLINE = 'Your TopG Digital Brother';
export const APP_DESCRIPTION = 'The digital accountability partner that forces action, not just reminds.';

// Aura system
export const AURA_CONFIG = {
    BASE_TASK_COMPLETE: 100,
    FIRST_NOTIFICATION_MULTIPLIER: 2,
    STRICT_MODE_MULTIPLIER: 1.5,
    STREAK_MULTIPLIER: 1.5,
    SPEED_BONUS_MULTIPLIER: 1.2,
    SKIP_PENALTY: -50,
    CANCEL_PENALTY: -100,
    TRIPLE_SKIP_SHAME: -500,
    CONSISTENCY_BONUS: 500,
} as const;

// Streak thresholds
export const STREAK_THRESHOLDS = {
    WEEK: 7,
    MONTH: 30,
    QUARTER: 90,
    YEAR: 365,
} as const;

// Notification timing
export const NOTIFICATION_CONFIG = {
    FIRST_REMINDER_DELAY: 0,
    SECOND_REMINDER_DELAY: 10 * 60 * 1000, // 10 minutes
    FINAL_WARNING_DELAY: 20 * 60 * 1000, // 20 minutes
    STRICT_MODE_TRIGGER_DELAY: 30 * 60 * 1000, // 30 minutes
    SKIP_COOLDOWN: 10 * 60 * 1000, // 10 minutes between skips
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = {
    ROOKIE: 0,
    GRINDER: 1000,
    HUSTLER: 5000,
    ALPHA: 15000,
    SIGMA: 50000,
    TOPG: 150000,
    LEGEND: 500000,
} as const;

// Voice packs
export const VOICE_PACKS = ['topg', 'monk', 'friend', 'drill'] as const;
export type VoicePack = typeof VOICE_PACKS[number];

// Supported apps for deep linking
export const SUPPORTED_APPS = [
    { id: 'twitter', name: 'Twitter/X', scheme: 'twitter://', icon: '🐦' },
    { id: 'instagram', name: 'Instagram', scheme: 'instagram://', icon: '📸' },
    { id: 'youtube', name: 'YouTube', scheme: 'youtube://', icon: '📺' },
    { id: 'spotify', name: 'Spotify', scheme: 'spotify://', icon: '🎵' },
    { id: 'notion', name: 'Notion', scheme: 'notion://', icon: '📝' },
    { id: 'notes', name: 'Notes', scheme: 'mobilenotes://', icon: '📋' },
    { id: 'gym', name: 'Gym', scheme: 'https://google.com/search?q=workout', icon: '🏋️' },
    { id: 'code', name: 'VS Code', scheme: 'vscode://', icon: '💻' },
    { id: 'figma', name: 'Figma', scheme: 'figma://', icon: '🎨' },
    { id: 'slack', name: 'Slack', scheme: 'slack://', icon: '💬' },
    { id: 'discord', name: 'Discord', scheme: 'discord://', icon: '🎮' },
    { id: 'other', name: 'Other', scheme: '', icon: '📱' },
] as const;

// Animation durations
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    USER: 'bro-user-storage',
    TASKS: 'bro-tasks-storage',
    SETTINGS: 'bro-settings-storage',
    SOUND_ENABLED: 'bro-sound-enabled',
    INSTALL_DISMISSED: 'install-prompt-dismissed',
} as const;

// API endpoints
export const API_ENDPOINTS = {
    TASKS: '/api/tasks',
    USER: '/api/user',
    LEADERBOARD: '/api/leaderboard',
    AI: '/api/ai',
    NOTIFICATIONS: '/api/notifications',
    STATS: '/api/stats',
    CHALLENGES: '/api/challenges',
    HABITS: '/api/habits',
} as const;

// Error messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Please log in to continue',
    NETWORK: 'Network error. Please check your connection',
    GENERIC: 'Something went wrong. Please try again',
    NOT_FOUND: 'Resource not found',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
    TASK_COMPLETE: 'Task crushed! Keep grinding! 🔥',
    BADGE_UNLOCKED: 'New badge unlocked! 🏆',
    LEVEL_UP: 'Level up! You\'re ascending! ⬆️',
    STREAK_MILESTONE: 'Streak milestone reached! 🔥',
} as const;

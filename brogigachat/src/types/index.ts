// User types
export interface User {
    username: string;
    aura: number;
    level: number;
    streak: number;
    lastActive: string;
    tasksCompleted: number;
    strictModeCount: number;
}

// Level info
export interface LevelInfo {
    level: number;
    name: string;
    color: string;
    minAura: number;
}

// Task types
export interface Task {
    id: string;
    title: string;
    description: string;
    app: string;
    baseAura: number;
    scheduledFor: string;
    created: string;
    completed: boolean;
    completedAt?: string;
    skips: number;
    auraGained?: number;
}

// Skip tracking
export interface SkipCount {
    [taskId: string]: number;
}

// App options for deep linking
export const APP_OPTIONS = [
    'Twitter',
    'Instagram',
    'YouTube',
    'Gym App',
    'Notes',
    'Spotify',
    'Notion',
    'Other',
] as const;

export type AppOption = typeof APP_OPTIONS[number];

// Level definitions
export const LEVELS: LevelInfo[] = [
    { level: 1, name: 'Rookie', color: 'text-gray-400', minAura: 0 },
    { level: 2, name: 'Grinder', color: 'text-blue-400', minAura: 1000 },
    { level: 3, name: 'Hustler', color: 'text-purple-400', minAura: 5000 },
    { level: 4, name: 'Alpha', color: 'text-yellow-400', minAura: 15000 },
    { level: 5, name: 'Sigma', color: 'text-red-400', minAura: 50000 },
    { level: 6, name: 'TopG', color: 'text-orange-400', minAura: 150000 },
    { level: 7, name: 'Legend', color: 'text-pink-400', minAura: 500000 },
];

// Get level info from aura
export function getLevelInfo(aura: number): LevelInfo {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        const level = LEVELS[i];
        if (level && aura >= level.minAura) {
            return level;
        }
    }
    return LEVELS[0] as LevelInfo;
}


// Calculate aura gain with multipliers
export function calculateAuraGain(
    baseAura: number,
    options: {
        firstNotification?: boolean;
        fromStrictMode?: boolean;
        streakDays?: number;
        completedFast?: boolean;
    }
): number {
    let aura = baseAura;

    if (options.firstNotification) aura *= 2;
    if (options.fromStrictMode) aura *= 1.5;
    if (options.streakDays && options.streakDays > 7) aura *= 1.5;
    if (options.completedFast) aura *= 1.2;

    return Math.floor(aura);
}

// Deep link URL schemes
export const DEEP_LINKS: Record<string, string> = {
    'Twitter': 'twitter://compose',
    'Instagram': 'instagram://library',
    'YouTube': 'vnd.youtube://',
    'Spotify': 'spotify://',
    'Notion': 'notion://',
    'Gym App': 'https://www.google.com/search?q=workout',
    'Notes': 'mobilenotes://',
    'Other': '',
};

// Badge types
export interface Badge {
    id: string;
    name: string;
    description: string;
    emoji: string;
    criteria: string;
    auraReward: number;
    unlocked: boolean;
    unlockedAt?: string;
}

// Challenge types
export interface Challenge {
    id: string;
    name: string;
    description: string;
    type: 'solo' | 'pvp' | 'squad';
    goal: number;
    progress: number;
    reward: number;
    endsAt: string;
    participants?: number;
}

// Habit types
export interface Habit {
    id: string;
    name: string;
    frequency: 'daily' | 'weekly';
    streak: number;
    completedToday: boolean;
    bestStreak: number;
    auraPerComplete: number;
}

// Notification types
export interface AppNotification {
    id: string;
    type: 'task' | 'badge' | 'streak' | 'challenge' | 'system';
    title: string;
    body: string;
    taskId?: string;
    read: boolean;
    createdAt: string;
}

// Squad types
export interface Squad {
    id: string;
    name: string;
    code: string;
    members: SquadMember[];
    totalAura: number;
    weeklyGoal: number;
    weeklyProgress: number;
}

export interface SquadMember {
    id: string;
    username: string;
    aura: number;
    level: number;
    isLeader: boolean;
}

// PowerUp types
export interface PowerUp {
    id: string;
    name: string;
    description: string;
    emoji: string;
    effect: string;
    duration: number;
    active: boolean;
    expiresAt?: string;
}

// Goal types
export interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: string | null;
    auraReward: number;
    completed: boolean;
}

// Stats types
export interface UserStats {
    totalTasks: number;
    completedTasks: number;
    skippedTasks: number;
    totalAura: number;
    currentStreak: number;
    bestStreak: number;
    strictModeSessions: number;
    averageDaily: number;
    completionRate: number;
}

// Aura event types
export type AuraEventReason =
    | 'TASK_COMPLETE'
    | 'STRICT_MODE_BONUS'
    | 'STREAK_BONUS'
    | 'BADGE_UNLOCK'
    | 'CHALLENGE_WIN'
    | 'SKIP_PENALTY'
    | 'CANCEL_PENALTY';

export interface AuraEvent {
    id: string;
    userId: string;
    amount: number;
    reason: AuraEventReason;
    taskId?: string;
    createdAt: string;
}


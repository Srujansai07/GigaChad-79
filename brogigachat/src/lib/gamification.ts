// ==================================================
// BroGigaChad - Gamification System
// Phase 1, Sub 1.3: Full gamification implementation
// ==================================================

// LEVELS - The Brotherhood Hierarchy
export const LEVELS = [
    { level: 1, name: 'Rookie', minAura: 0, maxAura: 999, color: 'text-gray-500', emoji: '🌱' },
    { level: 2, name: 'Grinder', minAura: 1000, maxAura: 4999, color: 'text-blue-400', emoji: '⚡' },
    { level: 3, name: 'Hustler', minAura: 5000, maxAura: 14999, color: 'text-purple-400', emoji: '💪' },
    { level: 4, name: 'Alpha', minAura: 15000, maxAura: 49999, color: 'text-orange-400', emoji: '🔥' },
    { level: 5, name: 'Sigma', minAura: 50000, maxAura: 149999, color: 'text-red-400', emoji: '💀' },
    { level: 6, name: 'TopG', minAura: 150000, maxAura: 499999, color: 'text-yellow-400', emoji: '👑' },
    { level: 7, name: 'Legend', minAura: 500000, maxAura: Infinity, color: 'text-gradient', emoji: '🏆' },
] as const;

export type LevelName = (typeof LEVELS)[number]['name'];

// Get level info for a given aura amount
export function getLevelInfo(aura: number) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (aura >= LEVELS[i].minAura) {
            const current = LEVELS[i];
            const next = LEVELS[i + 1] || null;
            const progress = next
                ? ((aura - current.minAura) / (current.maxAura - current.minAura + 1)) * 100
                : 100;

            return {
                ...current,
                progress: Math.min(progress, 100),
                nextLevel: next,
                auraToNext: next ? next.minAura - aura : 0,
            };
        }
    }
    return { ...LEVELS[0], progress: 0, nextLevel: LEVELS[1], auraToNext: LEVELS[1].minAura };
}

// ==================================================
// AURA CALCULATION (From docs)
// ==================================================

export interface AuraAction {
    type: 'TASK_COMPLETE' | 'SKIP' | 'STRICT_MODE_COMPLETE' | 'HELP_FRIEND' | 'CANCEL';
    basePoints?: number;
    completedOnFirstNotification?: boolean;
    partOfStreak?: boolean;
    streakDays?: number;
    completedInStrictMode?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
    completedWithin2Minutes?: boolean;
    sameTaskCompletedForWeek?: boolean;
}

const ACTION_BASE_POINTS = {
    TASK_COMPLETE: 100,
    SKIP: -50,
    STRICT_MODE_COMPLETE: 250,
    HELP_FRIEND: 150,
    CANCEL: -100,
    SKIP_3_TIMES_SHAME: -500,
};

export function calculateAura(action: AuraAction): number {
    let basePoints = action.basePoints || ACTION_BASE_POINTS[action.type] || 0;

    // Skip always loses fixed amount
    if (action.type === 'SKIP') return basePoints;
    if (action.type === 'CANCEL') return basePoints;

    // Multipliers (following the docs algorithm)
    if (action.completedOnFirstNotification) {
        basePoints *= 2; // 2x bonus for first notification
    }

    if (action.partOfStreak && action.streakDays && action.streakDays > 7) {
        basePoints *= 1.5; // 1.5x streak bonus
    }

    if (action.completedInStrictMode) {
        basePoints *= 1.5; // 1.5x strict mode bonus
    }

    if (action.difficulty === 'hard') {
        basePoints *= 1.3; // 1.3x difficulty bonus
    }

    // Time bonuses
    if (action.completedWithin2Minutes) {
        basePoints *= 1.2; // 1.2x speed bonus
    }

    // Consistency bonus
    if (action.sameTaskCompletedForWeek) {
        basePoints += 500; // +500 consistency bonus
    }

    return Math.floor(basePoints);
}

// ==================================================
// POWER-UPS (Earned, not bought)
// ==================================================

export interface PowerUp {
    id: string;
    name: string;
    description: string;
    emoji: string;
    unlockCondition: string;
    duration?: number; // in minutes, if applicable
    isActive?: boolean;
    expiresAt?: Date;
}

export const POWER_UPS: PowerUp[] = [
    {
        id: 'double_aura_weekend',
        name: 'Double Aura Weekend',
        description: 'All aura gains are doubled this weekend',
        emoji: '🔮',
        unlockCondition: '7-day perfect streak',
        duration: 2880, // 48 hours
    },
    {
        id: 'immunity_shield',
        name: 'Immunity Shield',
        description: 'Skip once without penalty',
        emoji: '🛡️',
        unlockCondition: 'Monthly reward for consistent users',
    },
    {
        id: 'focus_nuke',
        name: 'Focus Nuke',
        description: 'Blocks ALL apps except work apps for 2 hours',
        emoji: '☢️',
        unlockCondition: 'Complete 10 strict mode sessions',
        duration: 120,
    },
    {
        id: 'grind_mode',
        name: 'Grind Mode',
        description: 'AI generates hyper-specific action plan',
        emoji: '🤖',
        unlockCondition: 'Reach Alpha level (15K aura)',
    },
    {
        id: 'aura_magnet',
        name: 'Aura Magnet',
        description: '+25% aura from all tasks for 24 hours',
        emoji: '🧲',
        unlockCondition: 'Complete 50 tasks total',
        duration: 1440,
    },
    {
        id: 'streak_insurance',
        name: 'Streak Insurance',
        description: 'Protects your streak from one missed day',
        emoji: '🔒',
        unlockCondition: 'Maintain 30-day streak',
    },
];

// ==================================================
// BADGES
// ==================================================

export interface Badge {
    id: string;
    name: string;
    description: string;
    emoji: string;
    auraReward: number;
    criteria: {
        type: 'tasksCompleted' | 'streak' | 'aura' | 'strictModeCount' | 'level' | 'special';
        value: number;
    };
}

export const BADGES: Badge[] = [
    // Early achievements
    { id: 'first_blood', name: 'First Blood', description: 'Complete your first task', emoji: '🩸', auraReward: 50, criteria: { type: 'tasksCompleted', value: 1 } },
    { id: 'getting_started', name: 'Getting Started', description: 'Complete 10 tasks', emoji: '🚀', auraReward: 100, criteria: { type: 'tasksCompleted', value: 10 } },
    { id: 'hustler100', name: 'Century Hustler', description: 'Complete 100 tasks', emoji: '💯', auraReward: 500, criteria: { type: 'tasksCompleted', value: 100 } },

    // Streak badges
    { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', emoji: '⚔️', auraReward: 200, criteria: { type: 'streak', value: 7 } },
    { id: 'month_machine', name: 'Month Machine', description: '30-day streak', emoji: '🤖', auraReward: 1000, criteria: { type: 'streak', value: 30 } },
    { id: 'quarter_crusher', name: 'Quarter Crusher', description: '90-day streak', emoji: '💎', auraReward: 5000, criteria: { type: 'streak', value: 90 } },
    { id: 'year_legend', name: 'Year Legend', description: '365-day streak', emoji: '👑', auraReward: 50000, criteria: { type: 'streak', value: 365 } },

    // Strict mode badges
    { id: 'strict_survivor', name: 'Strict Survivor', description: 'Complete 1 strict mode session', emoji: '💪', auraReward: 100, criteria: { type: 'strictModeCount', value: 1 } },
    { id: 'discipline_master', name: 'Discipline Master', description: 'Complete 10 strict mode sessions', emoji: '🏋️', auraReward: 500, criteria: { type: 'strictModeCount', value: 10 } },
    { id: 'unbreakable', name: 'Unbreakable', description: 'Complete 50 strict mode sessions', emoji: '🪨', auraReward: 2500, criteria: { type: 'strictModeCount', value: 50 } },

    // Level badges
    { id: 'level_grinder', name: 'Grinder Status', description: 'Reach Grinder level', emoji: '⚡', auraReward: 100, criteria: { type: 'level', value: 2 } },
    { id: 'level_alpha', name: 'Alpha Status', description: 'Reach Alpha level', emoji: '🔥', auraReward: 500, criteria: { type: 'level', value: 4 } },
    { id: 'level_sigma', name: 'Sigma Status', description: 'Reach Sigma level', emoji: '💀', auraReward: 2000, criteria: { type: 'level', value: 5 } },
    { id: 'level_topg', name: 'TopG Status', description: 'Reach TopG level', emoji: '👑', auraReward: 10000, criteria: { type: 'level', value: 6 } },
    { id: 'level_legend', name: 'Legend Status', description: 'Reach Legend level', emoji: '🏆', auraReward: 50000, criteria: { type: 'level', value: 7 } },

    // Special badges
    { id: 'founder', name: 'OG Founder', description: 'Early adopter badge', emoji: '🔥', auraReward: 1000, criteria: { type: 'special', value: 1 } },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Complete 7 days with 0 skips', emoji: '✨', auraReward: 750, criteria: { type: 'special', value: 2 } },
    { id: 'night_owl', name: 'Night Owl', description: 'Complete 10 tasks after midnight', emoji: '🦉', auraReward: 300, criteria: { type: 'special', value: 3 } },
    { id: 'early_bird', name: 'Early Bird', description: 'Complete 10 tasks before 6 AM', emoji: '🐦', auraReward: 300, criteria: { type: 'special', value: 4 } },
];

// Check which badges a user has unlocked
export function checkBadgeUnlock(
    userStats: {
        tasksCompleted: number;
        streak: number;
        aura: number;
        strictModeCount: number;
        level: number;
        specialAchievements?: number[];
    },
    unlockedBadgeIds: string[]
): Badge[] {
    const newBadges: Badge[] = [];

    for (const badge of BADGES) {
        // Skip if already unlocked
        if (unlockedBadgeIds.includes(badge.id)) continue;

        let unlocked = false;

        switch (badge.criteria.type) {
            case 'tasksCompleted':
                unlocked = userStats.tasksCompleted >= badge.criteria.value;
                break;
            case 'streak':
                unlocked = userStats.streak >= badge.criteria.value;
                break;
            case 'aura':
                unlocked = userStats.aura >= badge.criteria.value;
                break;
            case 'strictModeCount':
                unlocked = userStats.strictModeCount >= badge.criteria.value;
                break;
            case 'level':
                unlocked = userStats.level >= badge.criteria.value;
                break;
            case 'special':
                unlocked = userStats.specialAchievements?.includes(badge.criteria.value) || false;
                break;
        }

        if (unlocked) {
            newBadges.push(badge);
        }
    }

    return newBadges;
}

// ==================================================
// STREAKS
// ==================================================

export interface StreakInfo {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    isStreakAlive: boolean;
    streakMultiplier: number;
}

export function calculateStreakInfo(
    lastActiveDate: Date | null,
    currentStreak: number,
    longestStreak: number
): StreakInfo {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isStreakAlive = false;
    let newStreak = currentStreak;

    if (lastActiveDate) {
        const lastActive = new Date(lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Same day - streak continues
            isStreakAlive = true;
        } else if (diffDays === 1) {
            // Yesterday - streak continues
            isStreakAlive = true;
        } else {
            // Streak broken
            newStreak = 0;
            isStreakAlive = false;
        }
    }

    // Calculate streak multiplier
    let multiplier = 1;
    if (newStreak >= 7) multiplier = 1.5;
    if (newStreak >= 30) multiplier = 1.75;
    if (newStreak >= 90) multiplier = 2;
    if (newStreak >= 365) multiplier = 2.5;

    return {
        currentStreak: newStreak,
        longestStreak: Math.max(longestStreak, newStreak),
        lastActiveDate: today.toISOString().split('T')[0],
        isStreakAlive,
        streakMultiplier: multiplier,
    };
}

// ==================================================
// LEADERBOARD TYPES
// ==================================================

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    aura: number;
    level: number;
    levelName: LevelName;
    streak: number;
    change?: 'up' | 'down' | 'same';
    changeAmount?: number;
}

export type LeaderboardType = 'global' | 'city' | 'university' | 'friends' | 'squad';

// ==================================================
// CHALLENGES
// ==================================================

export interface Challenge {
    id: string;
    name: string;
    description: string;
    type: 'solo' | 'pvp' | 'squad';
    duration: number; // in days
    goal: {
        metric: 'tasks' | 'aura' | 'streak' | 'strict';
        value: number;
    };
    reward: {
        aura: number;
        badge?: string;
        powerUp?: string;
    };
    participants?: string[];
    createdAt?: Date;
    endsAt?: Date;
}

export const DAILY_CHALLENGES: Partial<Challenge>[] = [
    { name: 'Morning Grind', description: 'Complete 3 tasks before 9 AM', goal: { metric: 'tasks', value: 3 }, reward: { aura: 200 } },
    { name: 'No Skip Day', description: 'Complete all tasks without skipping', goal: { metric: 'tasks', value: 5 }, reward: { aura: 300 } },
    { name: 'Strict Master', description: 'Complete 2 strict mode sessions', goal: { metric: 'strict', value: 2 }, reward: { aura: 400 } },
    { name: 'Aura Hunter', description: 'Earn 500+ aura today', goal: { metric: 'aura', value: 500 }, reward: { aura: 250 } },
];

export const WEEKLY_CHALLENGES: Partial<Challenge>[] = [
    { name: 'Week Warrior', description: '7-day streak', goal: { metric: 'streak', value: 7 }, reward: { aura: 1000, powerUp: 'double_aura_weekend' } },
    { name: 'Task Machine', description: 'Complete 50 tasks this week', goal: { metric: 'tasks', value: 50 }, reward: { aura: 2000 } },
    { name: 'Discipline King', description: '10 strict mode sessions', goal: { metric: 'strict', value: 10 }, reward: { aura: 1500, badge: 'discipline_master' } },
];

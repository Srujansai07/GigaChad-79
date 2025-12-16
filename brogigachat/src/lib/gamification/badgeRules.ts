import { User } from '@prisma/client';

export interface BadgeRule {
    id: string;
    name: string;
    description: string;
    emoji: string;
    auraReward: number;
    check: (user: User) => boolean;
}

export const BADGE_RULES: BadgeRule[] = [
    {
        id: 'first-blood',
        name: 'First Blood',
        description: 'Complete your first task',
        emoji: '🩸',
        auraReward: 100,
        check: (user) => user.tasksCompleted >= 1,
    },
    {
        id: 'grinder',
        name: 'Grinder',
        description: 'Complete 10 tasks',
        emoji: '💪',
        auraReward: 500,
        check: (user) => user.tasksCompleted >= 10,
    },
    {
        id: 'hustler',
        name: 'Hustler',
        description: 'Complete 50 tasks',
        emoji: '🚀',
        auraReward: 2500,
        check: (user) => user.tasksCompleted >= 50,
    },
    {
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Reach a 7-day streak',
        emoji: '🔥',
        auraReward: 1000,
        check: (user) => user.streak >= 7,
    },
    {
        id: 'strict-soldier',
        name: 'Strict Soldier',
        description: 'Complete 5 tasks in Strict Mode',
        emoji: '💂',
        auraReward: 1500,
        check: (user) => user.strictModeCount >= 5,
    },
    {
        id: 'aura-lord',
        name: 'Aura Lord',
        description: 'Reach 10,000 Aura',
        emoji: '👑',
        auraReward: 5000,
        check: (user) => user.aura >= 10000,
    },
];

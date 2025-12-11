'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ==========================================
// USER ACTIONS
// ==========================================

export async function createUser(email: string, username: string) {
    const user = await prisma.user.create({
        data: {
            email,
            username,
        },
    });
    return user;
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
        include: {
            badges: { include: { badge: true } },
        },
    });
}

export async function getUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: { username },
    });
}

export async function updateUserStats(
    userId: string,
    updates: {
        aura?: number;
        streak?: number;
        tasksCompleted?: number;
        strictModeCount?: number;
    }
) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            ...updates,
            lastActiveAt: new Date(),
        },
    });
    revalidatePath('/');
    return user;
}

export async function addAura(userId: string, amount: number, reason: string, taskId?: string) {
    // Update user aura
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            aura: { increment: amount },
        },
    });

    // Log the event
    await prisma.auraEvent.create({
        data: {
            userId,
            amount,
            reason: reason as any, // Cast to enum
            taskId,
        },
    });

    revalidatePath('/');
    return user;
}

// ==========================================
// TASK ACTIONS
// ==========================================

export async function createTask(
    userId: string,
    data: {
        title: string;
        description?: string;
        app: string;
        baseAura?: number;
        scheduledFor: Date;
    }
) {
    const task = await prisma.task.create({
        data: {
            userId,
            title: data.title,
            description: data.description,
            app: data.app,
            baseAura: data.baseAura || 100,
            scheduledFor: data.scheduledFor,
        },
    });
    revalidatePath('/');
    return task;
}

export async function getUserTasks(userId: string) {
    return prisma.task.findMany({
        where: { userId },
        orderBy: { scheduledFor: 'asc' },
    });
}

export async function getActiveTasks(userId: string) {
    return prisma.task.findMany({
        where: {
            userId,
            completed: false,
            status: { not: 'CANCELLED' },
        },
        orderBy: { scheduledFor: 'asc' },
    });
}

export async function completeTask(
    taskId: string,
    auraGained: number,
    fromStrictMode: boolean = false
) {
    const task = await prisma.task.update({
        where: { id: taskId },
        data: {
            completed: true,
            completedAt: new Date(),
            auraGained,
            status: 'COMPLETED',
            strictModeTriggered: fromStrictMode,
        },
    });

    // Update user stats
    await prisma.user.update({
        where: { id: task.userId },
        data: {
            aura: { increment: auraGained },
            tasksCompleted: { increment: 1 },
            streak: { increment: 1 },
            lastActiveAt: new Date(),
            strictModeCount: fromStrictMode ? { increment: 1 } : undefined,
        },
    });

    // Log aura event
    await prisma.auraEvent.create({
        data: {
            userId: task.userId,
            amount: auraGained,
            reason: fromStrictMode ? 'STRICT_MODE_BONUS' : 'TASK_COMPLETE',
            taskId,
        },
    });

    revalidatePath('/');
    return task;
}

export async function skipTask(taskId: string, newScheduledFor: Date) {
    const task = await prisma.task.update({
        where: { id: taskId },
        data: {
            skipCount: { increment: 1 },
            lastSkippedAt: new Date(),
            scheduledFor: newScheduledFor,
            status: 'SKIPPED',
        },
    });

    // Deduct aura for skipping
    await prisma.user.update({
        where: { id: task.userId },
        data: {
            aura: { decrement: 50 },
        },
    });

    // Log aura event
    await prisma.auraEvent.create({
        data: {
            userId: task.userId,
            amount: -50,
            reason: 'SKIP_PENALTY',
            taskId,
        },
    });

    revalidatePath('/');
    return task;
}

export async function triggerStrictMode(taskId: string) {
    const task = await prisma.task.update({
        where: { id: taskId },
        data: {
            status: 'STRICT_MODE',
            strictModeTriggered: true,
        },
    });
    revalidatePath('/');
    return task;
}

export async function deleteTask(taskId: string) {
    await prisma.task.delete({
        where: { id: taskId },
    });
    revalidatePath('/');
}

// ==========================================
// LEADERBOARD ACTIONS
// ==========================================

export async function getGlobalLeaderboard(limit: number = 10) {
    return prisma.user.findMany({
        orderBy: { aura: 'desc' },
        take: limit,
        select: {
            id: true,
            username: true,
            aura: true,
            level: true,
            streak: true,
        },
    });
}

export async function getUserRank(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { aura: true },
    });

    if (!user) return null;

    const rank = await prisma.user.count({
        where: {
            aura: { gt: user.aura },
        },
    });

    return rank + 1;
}

// ==========================================
// BADGE ACTIONS
// ==========================================

export async function checkAndAwardBadges(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { badges: true },
    });

    if (!user) return [];

    const allBadges = await prisma.badge.findMany();
    const unlockedBadgeIds = user.badges.map((ub) => ub.badgeId);
    const newBadges: string[] = [];

    for (const badge of allBadges) {
        if (unlockedBadgeIds.includes(badge.id)) continue;

        const criteria = badge.criteria as Record<string, number>;
        let unlocked = true;

        // Check each criterion
        for (const [key, value] of Object.entries(criteria)) {
            if (key === 'tasksCompleted' && user.tasksCompleted < value) unlocked = false;
            if (key === 'streak' && user.streak < value) unlocked = false;
            if (key === 'aura' && user.aura < value) unlocked = false;
            if (key === 'strictModeCount' && user.strictModeCount < value) unlocked = false;
        }

        if (unlocked) {
            await prisma.userBadge.create({
                data: { userId, badgeId: badge.id },
            });

            if (badge.auraReward > 0) {
                await addAura(userId, badge.auraReward, 'BADGE_REWARD');
            }

            newBadges.push(badge.name);
        }
    }

    return newBadges;
}

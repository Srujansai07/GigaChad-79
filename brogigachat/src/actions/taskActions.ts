// Server action for completing a task
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { calculateAura } from '@/lib/gamification';

export async function completeTaskAction(
    taskId: string,
    userId: string,
    options: {
        fromStrictMode?: boolean;
        skipCount?: number;
        streakDays?: number;
    } = {}
) {
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return { success: false, error: 'Task not found' };
        }

        const auraGained = calculateAura({
            type: options.fromStrictMode ? 'STRICT_MODE_COMPLETE' : 'TASK_COMPLETE',
            completedOnFirstNotification: options.skipCount === 0,
            completedInStrictMode: options.fromStrictMode,
            streakDays: options.streakDays,
            partOfStreak: (options.streakDays || 0) > 0,
        });

        // Update task
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: 'COMPLETED',
                completed: true,
                completedAt: new Date(),
                auraGained,
            },
        });

        // Update user stats
        await prisma.user.update({
            where: { id: userId },
            data: {
                aura: { increment: auraGained },
                tasksCompleted: { increment: 1 },
                lastActiveAt: new Date(),
                strictModeCount: options.fromStrictMode ? { increment: 1 } : undefined,
            },
        });

        // Create aura event
        await prisma.auraEvent.create({
            data: {
                userId,
                amount: auraGained,
                reason: options.fromStrictMode ? 'STRICT_MODE_BONUS' : 'TASK_COMPLETE',
                taskId,
            },
        });

        revalidatePath('/');
        revalidatePath('/profile');

        return { success: true, task: updatedTask, auraGained };
    } catch (error) {
        console.error('Complete task error:', error);
        return { success: false, error: 'Failed to complete task' };
    }
}

export async function skipTaskAction(
    taskId: string,
    userId: string,
    extendMinutes: number = 10
) {
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return { success: false, error: 'Task not found' };
        }

        const newSkipCount = task.skipCount + 1;
        const newScheduledTime = new Date(Date.now() + extendMinutes * 60000);

        // Deduct aura for skipping
        await prisma.user.update({
            where: { id: userId },
            data: {
                aura: { decrement: 50 },
            },
        });

        // Create aura event for penalty
        await prisma.auraEvent.create({
            data: {
                userId,
                amount: -50,
                reason: 'SKIP_PENALTY',
                taskId,
            },
        });

        // Update task
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                skipCount: newSkipCount,
                lastSkippedAt: new Date(),
                scheduledFor: newScheduledTime,
                status: newSkipCount >= 3 ? 'STRICT_MODE' : 'SKIPPED',
                strictModeTriggered: newSkipCount >= 3,
            },
        });

        revalidatePath('/');

        return {
            success: true,
            task: updatedTask,
            strictModeTriggered: newSkipCount >= 3,
            auraPenalty: 50,
        };
    } catch (error) {
        console.error('Skip task error:', error);
        return { success: false, error: 'Failed to skip task' };
    }
}

export async function createTaskAction(
    userId: string,
    data: {
        title: string;
        description?: string;
        app: string;
        scheduledFor: Date;
        baseAura?: number;
    }
) {
    try {
        const task = await prisma.task.create({
            data: {
                userId,
                title: data.title,
                description: data.description,
                app: data.app,
                scheduledFor: data.scheduledFor,
                baseAura: data.baseAura || 100,
            },
        });

        revalidatePath('/');

        return { success: true, task };
    } catch (error) {
        console.error('Create task error:', error);
        return { success: false, error: 'Failed to create task' };
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This endpoint is called by Vercel Cron or external scheduler
// Schedule: Every 5 minutes to check for due tasks
export async function GET(request: Request) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = new Date();

        // Find tasks that need notifications
        const dueTasks = await prisma.task.findMany({
            where: {
                scheduledFor: { lte: now },
                completed: false,
                status: { in: ['PENDING', 'SKIPPED'] },
            },
            include: {
                user: {
                    select: { id: true, notificationsEnabled: true },
                },
            },
        });

        console.log(`[Cron] Found ${dueTasks.length} due tasks`);

        const notifications: string[] = [];

        for (const task of dueTasks) {
            if (!task.user.notificationsEnabled) continue;

            // Update task status to NOTIFIED
            await prisma.task.update({
                where: { id: task.id },
                data: { status: 'NOTIFIED' },
            });

            // Log notification
            await prisma.notificationLog.create({
                data: {
                    userId: task.user.id,
                    taskId: task.id,
                    type: task.skipCount === 0 ? 'FIRST_REMINDER' :
                        task.skipCount === 1 ? 'SECOND_REMINDER' :
                            task.skipCount === 2 ? 'FINAL_WARNING' : 'STRICT_MODE_ACTIVATION',
                },
            });

            // Check for strict mode trigger
            if (task.skipCount >= 3 && !task.strictModeTriggered) {
                await prisma.task.update({
                    where: { id: task.id },
                    data: {
                        status: 'STRICT_MODE',
                        strictModeTriggered: true,
                    },
                });
            }

            notifications.push(task.id);

            // TODO: Send actual push notification via web-push
            // This would integrate with the subscription stored for each user
        }

        // Also update streaks at midnight (check if this is a midnight run)
        const hour = now.getHours();
        if (hour === 0) {
            await updateDailyStreaks();
        }

        return NextResponse.json({
            success: true,
            processed: dueTasks.length,
            notified: notifications.length,
        });
    } catch (error) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
    }
}

async function updateDailyStreaks() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find users who were active yesterday but not today
    const users = await prisma.user.findMany({
        where: {
            lastActiveAt: {
                gte: yesterday,
                lt: today,
            },
        },
    });

    // These users keep their streak
    // Users not in this list who haven't been active today lose their streak
    const usersToResetStreak = await prisma.user.findMany({
        where: {
            streak: { gt: 0 },
            lastActiveAt: { lt: yesterday },
        },
    });

    if (usersToResetStreak.length > 0) {
        await prisma.user.updateMany({
            where: {
                id: { in: usersToResetStreak.map(u => u.id) },
            },
            data: { streak: 0 },
        });

        console.log(`[Cron] Reset streaks for ${usersToResetStreak.length} users`);
    }
}

// Vercel Cron config
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

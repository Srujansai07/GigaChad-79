import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { calculateAura } from '@/lib/gamification';

// GET: Get single task
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const task = await prisma.task.findFirst({
            where: { id: params.id, userId: user.id },
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ task });
    } catch (error) {
        console.error('Task GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
    }
}

// PATCH: Update task
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action, ...updateData } = body;

        // Handle special actions
        if (action === 'complete') {
            const task = await prisma.task.findFirst({
                where: { id: params.id, userId: user.id },
            });

            if (!task) {
                return NextResponse.json({ error: 'Task not found' }, { status: 404 });
            }

            // Calculate aura based on context
            const auraGained = calculateAura({
                type: task.strictModeTriggered ? 'STRICT_MODE_COMPLETE' : 'TASK_COMPLETE',
                basePoints: task.baseAura,
                completedInStrictMode: task.strictModeTriggered,
                completedOnFirstNotification: task.skipCount === 0,
            });

            // Update task
            const updatedTask = await prisma.task.update({
                where: { id: params.id },
                data: {
                    completed: true,
                    completedAt: new Date(),
                    auraGained,
                    status: 'COMPLETED',
                },
            });

            // Update user stats
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    aura: { increment: auraGained },
                    tasksCompleted: { increment: 1 },
                    streak: { increment: 1 },
                    lastActiveAt: new Date(),
                    strictModeCount: task.strictModeTriggered ? { increment: 1 } : undefined,
                },
            });

            // Log aura event
            await prisma.auraEvent.create({
                data: {
                    userId: user.id,
                    amount: auraGained,
                    reason: task.strictModeTriggered ? 'STRICT_MODE_BONUS' : 'TASK_COMPLETE',
                    taskId: params.id,
                },
            });

            return NextResponse.json({ task: updatedTask, auraGained });
        }

        if (action === 'skip') {
            const extendMinutes = body.extendMinutes || 10;
            const newScheduledFor = new Date(Date.now() + extendMinutes * 60 * 1000);

            const updatedTask = await prisma.task.update({
                where: { id: params.id },
                data: {
                    skipCount: { increment: 1 },
                    lastSkippedAt: new Date(),
                    scheduledFor: newScheduledFor,
                    status: 'SKIPPED',
                },
            });

            // Deduct aura
            await prisma.user.update({
                where: { id: user.id },
                data: { aura: { decrement: 50 } },
            });

            // Log skip
            await prisma.auraEvent.create({
                data: {
                    userId: user.id,
                    amount: -50,
                    reason: 'SKIP_PENALTY',
                    taskId: params.id,
                },
            });

            // Check for strict mode trigger
            if (updatedTask.skipCount >= 3 && !updatedTask.strictModeTriggered) {
                await prisma.task.update({
                    where: { id: params.id },
                    data: {
                        status: 'STRICT_MODE',
                        strictModeTriggered: true,
                    },
                });
            }

            return NextResponse.json({ task: updatedTask, auraLost: 50 });
        }

        // Regular update
        const task = await prisma.task.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json({ task });
    } catch (error) {
        console.error('Task PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}

// DELETE: Delete task
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.task.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Task DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}

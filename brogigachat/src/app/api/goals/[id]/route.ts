import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

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

        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { current } = body;

        // Verify ownership
        const goal = await prisma.goal.findUnique({
            where: { id: params.id },
        });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        if (goal.userId !== prismaUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Check completion
        let completed = false;
        let auraGained = 0;

        if (current >= goal.target && !goal.completed) {
            completed = true;
            auraGained = goal.auraReward;

            // Award Aura
            await prisma.user.update({
                where: { id: prismaUser.id },
                data: {
                    aura: { increment: auraGained },
                },
            });

            // Log Aura Event
            await prisma.auraEvent.create({
                data: {
                    userId: prismaUser.id,
                    amount: auraGained,
                    reason: 'TASK_COMPLETE', // Using TASK_COMPLETE as generic completion for now
                },
            });
        }

        const updatedGoal = await prisma.goal.update({
            where: { id: params.id },
            data: {
                current,
                completed: completed || goal.completed, // Keep completed true if already true
                completedAt: completed ? new Date() : goal.completedAt,
            },
        });

        return NextResponse.json({ goal: updatedGoal, auraGained });

    } catch (error) {
        console.error('Goal update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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

        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify ownership
        const goal = await prisma.goal.findUnique({
            where: { id: params.id },
        });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        if (goal.userId !== prismaUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.goal.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Goal deleted' });

    } catch (error) {
        console.error('Goal delete error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(
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

        // Fetch habit
        const habit = await prisma.habit.findUnique({
            where: { id: params.id },
        });

        if (!habit) {
            return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
        }

        if (habit.userId !== prismaUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Check if already completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastCompleted = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null;
        if (lastCompleted) {
            lastCompleted.setHours(0, 0, 0, 0);
        }

        if (lastCompleted && lastCompleted.getTime() === today.getTime()) {
            return NextResponse.json({ error: 'Already completed today' }, { status: 400 });
        }

        // Calculate streak
        let newStreak = 1;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastCompleted && lastCompleted.getTime() === yesterday.getTime()) {
            newStreak = habit.streak + 1;
        } else if (lastCompleted && lastCompleted.getTime() === today.getTime()) {
            // Should be caught by check above, but safe fallback
            newStreak = habit.streak;
        } else {
            // Missed a day (or more), reset to 1
            newStreak = 1;
        }

        // Update habit
        const updatedHabit = await prisma.habit.update({
            where: { id: params.id },
            data: {
                streak: newStreak,
                bestStreak: Math.max(habit.bestStreak, newStreak),
                completedToday: true,
                lastCompletedAt: new Date(),
            },
        });

        // Award Aura
        const auraAmount = habit.auraPerComplete;

        await prisma.user.update({
            where: { id: prismaUser.id },
            data: {
                aura: { increment: auraAmount },
            },
        });

        // Log Aura Event
        await prisma.auraEvent.create({
            data: {
                userId: prismaUser.id,
                amount: auraAmount,
                reason: 'TASK_COMPLETE', // Using TASK_COMPLETE for now as we don't have HABIT_COMPLETE enum yet
                // We should probably add HABIT_COMPLETE to enum, but for now this is fine.
            },
        });

        return NextResponse.json({
            habit: updatedHabit,
            auraGained: auraAmount
        });

    } catch (error) {
        console.error('Habit completion error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

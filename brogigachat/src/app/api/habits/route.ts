import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
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

        const habits = await prisma.habit.findMany({
            where: { userId: prismaUser.id },
            orderBy: { createdAt: 'desc' },
        });

        // Check if habits need to be reset for the new day
        // Logic: If lastCompletedAt is not today, completedToday should be false.
        // However, we should probably do this check/update when fetching or via a cron job.
        // For MVP, let's do a quick check on fetch.

        const today = new Date().toDateString();
        const updatedHabits = habits.map(habit => {
            if (habit.lastCompletedAt && new Date(habit.lastCompletedAt).toDateString() !== today) {
                return { ...habit, completedToday: false };
            }
            return habit;
        });

        // We might want to update the DB if we found stale 'completedToday' flags, 
        // but for read performance, we can just return the corrected state 
        // and let the 'complete' action handle the DB update logic for streaks/resets.
        // Actually, if we don't update DB, the user might see 'completed' if they refresh and we don't run this logic.
        // Let's return the computed state.

        return NextResponse.json({ habits: updatedHabits });

    } catch (error) {
        console.error('Habits fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, frequency } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const habit = await prisma.habit.create({
            data: {
                userId: prismaUser.id,
                name,
                frequency: frequency || 'DAILY',
            },
        });

        return NextResponse.json({ habit });

    } catch (error) {
        console.error('Habit create error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

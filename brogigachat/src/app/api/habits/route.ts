import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { HabitFrequency } from '@prisma/client';

// GET /api/habits - List user habits
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const habits = await prisma.habit.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({
            habits,
            total: habits.length,
        });
    } catch (error) {
        console.error('Habits GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
    }
}

// POST /api/habits - Create new habit
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, frequency, auraPerComplete } = body;

        if (!name || !frequency) {
            return NextResponse.json({ error: 'Name and frequency required' }, { status: 400 });
        }

        const habit = await prisma.habit.create({
            data: {
                userId: user.id,
                name,
                frequency: frequency.toUpperCase() as HabitFrequency,
                auraPerComplete: auraPerComplete || 50,
            },
        });

        return NextResponse.json({
            success: true,
            habit,
        });
    } catch (error) {
        console.error('Habits POST error:', error);
        return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 });
    }
}

// PATCH /api/habits - Complete habit
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { habitId, action } = body;

        if (!habitId) {
            return NextResponse.json({ error: 'Habit ID required' }, { status: 400 });
        }

        if (action === 'complete') {
            const habit = await prisma.habit.findUnique({ where: { id: habitId } });
            if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });

            // Update habit stats
            const updatedHabit = await prisma.habit.update({
                where: { id: habitId },
                data: {
                    completedToday: true,
                    streak: { increment: 1 },
                    lastCompletedAt: new Date(),
                    // Update best streak if current streak > best streak (logic simplified for now)
                },
            });

            // Award aura
            await prisma.user.update({
                where: { id: user.id },
                data: { aura: { increment: habit.auraPerComplete } },
            });

            return NextResponse.json({
                success: true,
                message: 'Habit completed',
                auraGained: habit.auraPerComplete,
                habit: updatedHabit,
            });
        } else if (action === 'uncomplete') {
            // Revert completion (simplified)
            const updatedHabit = await prisma.habit.update({
                where: { id: habitId },
                data: {
                    completedToday: false,
                    streak: { decrement: 1 },
                },
            });

            return NextResponse.json({
                success: true,
                message: 'Habit uncompleted',
                habit: updatedHabit,
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Habits PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
    }
}


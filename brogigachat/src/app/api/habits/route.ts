import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// GET /api/habits - List user habits
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Mock habits - would be from database
        const habits = [
            {
                id: '1',
                name: 'Morning Workout',
                frequency: 'daily',
                streak: 7,
                completedToday: false,
                bestStreak: 14,
                auraPerComplete: 100,
            },
            {
                id: '2',
                name: 'Read 30 min',
                frequency: 'daily',
                streak: 5,
                completedToday: false,
                bestStreak: 21,
                auraPerComplete: 75,
            },
        ];

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

        const habit = {
            id: Date.now().toString(),
            name,
            frequency,
            streak: 0,
            completedToday: false,
            bestStreak: 0,
            auraPerComplete: auraPerComplete || 50,
            createdAt: new Date(),
        };

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
            return NextResponse.json({
                success: true,
                message: 'Habit completed',
                auraGained: 50,
            });
        } else if (action === 'uncomplete') {
            return NextResponse.json({
                success: true,
                message: 'Habit uncompleted',
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Habits PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
    }
}

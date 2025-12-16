import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { startOfDay, subDays, format } from 'date-fns';

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

        // Get last 7 days
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = subDays(today, 6 - i);
            return startOfDay(d);
        });

        // 1. Aura History (Daily Gains)
        // We'll approximate this by querying AuraEvents
        const auraHistory = await Promise.all(last7Days.map(async (date) => {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            const events = await prisma.auraEvent.findMany({
                where: {
                    userId: prismaUser.id,
                    createdAt: {
                        gte: date,
                        lt: nextDay,
                    },
                    amount: { gt: 0 } // Only gains
                },
                select: { amount: true }
            });

            const total = events.reduce((sum, e) => sum + e.amount, 0);
            return { date: format(date, 'EEE'), amount: total };
        }));

        // 2. Task Completion (Daily Count)
        const taskHistory = await Promise.all(last7Days.map(async (date) => {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            const count = await prisma.task.count({
                where: {
                    userId: prismaUser.id,
                    completedAt: {
                        gte: date,
                        lt: nextDay,
                    },
                    completed: true
                }
            });

            return { date: format(date, 'EEE'), count };
        }));

        // 3. Habit Completion Rate (Today)
        const habits = await prisma.habit.findMany({
            where: { userId: prismaUser.id },
        });
        const completedHabits = habits.filter(h => h.completedToday).length;
        const totalHabits = habits.length;

        return NextResponse.json({
            auraHistory,
            taskHistory,
            habitStats: { completed: completedHabits, total: totalHabits }
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

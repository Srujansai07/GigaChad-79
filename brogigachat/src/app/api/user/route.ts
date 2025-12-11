import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// GET: Get current user profile
export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            include: {
                badges: {
                    include: { badge: true },
                    orderBy: { unlockedAt: 'desc' },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate additional stats
        const tasksCompleted = await prisma.task.count({
            where: { userId: user.id, completed: true },
        });

        const tasksToday = await prisma.task.count({
            where: {
                userId: user.id,
                completed: true,
                completedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });

        const strictModeSessions = await prisma.task.count({
            where: { userId: user.id, strictModeTriggered: true, completed: true },
        });

        // Get global rank
        const rank = await prisma.user.count({
            where: { aura: { gt: user.aura } },
        });

        return NextResponse.json({
            user: {
                ...user,
                tasksCompleted,
                tasksToday,
                strictModeSessions,
                rank: rank + 1,
            },
        });
    } catch (error) {
        console.error('User GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PATCH: Update user profile/settings
export async function PATCH(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Only allow certain fields to be updated
        const allowedFields = ['username', 'notificationsEnabled', 'strictModeEnabled'];
        const updateData: Record<string, any> = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Check username uniqueness if changing
        if (updateData.username) {
            const existing = await prisma.user.findFirst({
                where: {
                    username: updateData.username,
                    NOT: { id: authUser.id },
                },
            });

            if (existing) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
            }
        }

        const user = await prisma.user.update({
            where: { id: authUser.id },
            data: updateData,
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('User PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

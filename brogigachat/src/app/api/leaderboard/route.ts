import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LeaderboardQuerySchema } from '@/lib/validation';

// GET: Get leaderboard
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const params = {
            type: searchParams.get('type') || 'global',
            limit: parseInt(searchParams.get('limit') || '10'),
            offset: parseInt(searchParams.get('offset') || '0'),
        };

        const validation = LeaderboardQuerySchema.safeParse(params);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Invalid parameters',
                details: validation.error.errors
            }, { status: 400 });
        }

        const { limit, offset } = validation.data;

        // Get top users by aura
        const users = await prisma.user.findMany({
            orderBy: { aura: 'desc' },
            take: limit,
            skip: offset,
            select: {
                id: true,
                username: true,
                aura: true,
                level: true,
                streak: true,
                tasksCompleted: true,
            },
        });

        // Add rank to each user
        const leaderboard = users.map((user, index) => ({
            ...user,
            rank: offset + index + 1,
        }));

        // Get total count
        const totalUsers = await prisma.user.count();

        return NextResponse.json({
            leaderboard,
            total: totalUsers,
            limit,
            offset,
        });
    } catch (error) {
        console.error('Leaderboard GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}

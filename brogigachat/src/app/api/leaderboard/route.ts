import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // Ensure real-time data

export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const leaderboard = await prisma.user.findMany({
            take: 50,
            orderBy: {
                aura: 'desc',
            },
            select: {
                id: true,
                username: true,
                aura: true,
                level: true,
                streak: true,
                badges: {
                    select: {
                        badge: {
                            select: {
                                emoji: true,
                            },
                        },
                    },
                },
            },
        });

        // Add rank and check if current user is in list
        const rankedLeaderboard = leaderboard.map((u, index) => ({
            ...u,
            rank: index + 1,
            isCurrentUser: u.email === user.email, // Note: Prisma select didn't include email, need to fix or use ID
        }));

        // Wait, I didn't select email or ID to match with auth user correctly. 
        // Auth user has ID from Supabase, but Prisma user ID is CUID.
        // I need to match by email since that's the link.

        // Let's re-fetch with email or just use the ID if we stored supabase ID.
        // In `src/app/api/user/route.ts` we use email to find user.

        // Let's include email in select to match
        const leaderboardWithEmail = await prisma.user.findMany({
            take: 50,
            orderBy: {
                aura: 'desc',
            },
            select: {
                id: true,
                username: true,
                email: true,
                aura: true,
                level: true,
                streak: true,
                badges: {
                    select: {
                        badge: {
                            select: {
                                emoji: true,
                            },
                        },
                    },
                },
            },
        });

        const finalLeaderboard = leaderboardWithEmail.map((u, index) => ({
            id: u.id,
            username: u.username,
            aura: u.aura,
            level: u.level,
            streak: u.streak,
            badges: u.badges.map(b => b.badge.emoji),
            rank: index + 1,
            isCurrentUser: u.email === user.email,
        }));

        return NextResponse.json({ leaderboard: finalLeaderboard });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

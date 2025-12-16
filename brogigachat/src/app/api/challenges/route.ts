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

        // Fetch active challenges
        const challenges = await prisma.challenge.findMany({
            where: {
                active: true,
                endsAt: { gt: new Date() }
            },
            include: {
                participants: {
                    where: { userId: prismaUser.id }
                }
            },
            orderBy: { startsAt: 'asc' },
        });

        // Transform to include user-specific status
        const formattedChallenges = challenges.map(challenge => {
            const participant = challenge.participants[0];
            return {
                ...challenge,
                joined: !!participant,
                progress: participant?.progress || 0,
                completed: participant?.completed || false,
                participants: undefined, // Remove raw relation
                participantCount: 0, // We could fetch this if needed, but keeping it simple
            };
        });

        return NextResponse.json({ challenges: formattedChallenges });

    } catch (error) {
        console.error('Challenges fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Admin only (or system) - simplified for now
export async function POST(request: Request) {
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

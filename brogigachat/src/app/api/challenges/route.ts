import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { ChallengeType } from '@prisma/client';

// GET /api/challenges - List challenges
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        const where: any = { active: true };
        if (type && type !== 'all') {
            where.type = type.toUpperCase() as ChallengeType;
        }

        const challenges = await prisma.challenge.findMany({
            where,
            orderBy: { endsAt: 'asc' },
        });

        return NextResponse.json({
            challenges,
            total: challenges.length,
        });
    } catch (error) {
        console.error('Challenges GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
    }
}

// POST /api/challenges - Create or join challenge
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action, challengeId, challengeData } = body;

        if (action === 'join') {
            // Logic to join challenge (future implementation with participants table)
            // For now, just return success
            return NextResponse.json({
                success: true,
                message: 'Joined challenge successfully',
                challengeId,
            });
        } else if (action === 'create') {
            // Create new challenge
            const challenge = await prisma.challenge.create({
                data: {
                    name: challengeData.name,
                    description: challengeData.description,
                    type: challengeData.type.toUpperCase() as ChallengeType,
                    goal: challengeData.goal,
                    reward: challengeData.reward || 500,
                    startsAt: new Date(challengeData.startsAt),
                    endsAt: new Date(challengeData.endsAt),
                    active: true,
                },
            });

            return NextResponse.json({
                success: true,
                challenge,
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Challenges POST error:', error);
        return NextResponse.json({ error: 'Failed to process challenge' }, { status: 500 });
    }
}


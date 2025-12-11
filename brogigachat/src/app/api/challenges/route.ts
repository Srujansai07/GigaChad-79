import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// GET /api/challenges - List challenges
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all';

        // Mock challenges for now - would be from database
        const challenges = [
            {
                id: '1',
                name: 'Morning Warrior',
                description: 'Complete 5 tasks before 9 AM',
                type: 'solo',
                goal: 5,
                progress: 0,
                reward: 500,
                endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            {
                id: '2',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                type: 'solo',
                goal: 7,
                progress: 0,
                reward: 1000,
                endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        ];

        const filteredChallenges = type === 'all'
            ? challenges
            : challenges.filter(c => c.type === type);

        return NextResponse.json({
            challenges: filteredChallenges,
            total: filteredChallenges.length,
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
            // Join existing challenge
            return NextResponse.json({
                success: true,
                message: 'Joined challenge successfully',
                challengeId,
            });
        } else if (action === 'create') {
            // Create new challenge
            return NextResponse.json({
                success: true,
                challenge: {
                    id: Date.now().toString(),
                    ...challengeData,
                    createdBy: user.id,
                    createdAt: new Date(),
                },
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Challenges POST error:', error);
        return NextResponse.json({ error: 'Failed to process challenge' }, { status: 500 });
    }
}

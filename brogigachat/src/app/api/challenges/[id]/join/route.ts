import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const challenge = await prisma.challenge.findUnique({
            where: { id: params.id },
        });

        if (!challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
        }

        if (!challenge.active) {
            return NextResponse.json({ error: 'Challenge is not active' }, { status: 400 });
        }

        // Check if already joined
        const existingParticipant = await prisma.challengeParticipant.findUnique({
            where: {
                userId_challengeId: {
                    userId: prismaUser.id,
                    challengeId: params.id,
                }
            }
        });

        if (existingParticipant) {
            return NextResponse.json({ error: 'Already joined' }, { status: 400 });
        }

        // Join
        const participant = await prisma.challengeParticipant.create({
            data: {
                userId: prismaUser.id,
                challengeId: params.id,
            },
        });

        return NextResponse.json({
            challenge: {
                ...challenge,
                joined: true,
                progress: 0,
                completed: false,
            }
        });

    } catch (error) {
        console.error('Challenge join error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

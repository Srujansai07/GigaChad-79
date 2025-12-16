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

        const body = await request.json();
        const { progress } = body;

        // Verify participation
        const participant = await prisma.challengeParticipant.findUnique({
            where: {
                userId_challengeId: {
                    userId: prismaUser.id,
                    challengeId: params.id,
                }
            },
            include: {
                challenge: true
            }
        });

        if (!participant) {
            return NextResponse.json({ error: 'Not joined' }, { status: 400 });
        }

        const challenge = participant.challenge;

        if (!challenge.active || new Date() > challenge.endsAt) {
            return NextResponse.json({ error: 'Challenge ended' }, { status: 400 });
        }

        // Check completion
        let completed = false;
        let auraGained = 0;

        // Only award if not already completed
        if (progress >= challenge.goal && !participant.completed) {
            completed = true;
            auraGained = challenge.reward;

            // Award Aura
            await prisma.user.update({
                where: { id: prismaUser.id },
                data: {
                    aura: { increment: auraGained },
                },
            });

            // Log Aura Event
            await prisma.auraEvent.create({
                data: {
                    userId: prismaUser.id,
                    amount: auraGained,
                    reason: 'CHALLENGE_WIN',
                },
            });
        }

        // Update participant
        const updatedParticipant = await prisma.challengeParticipant.update({
            where: { id: participant.id },
            data: {
                progress,
                completed: completed || participant.completed,
                completedAt: completed ? new Date() : participant.completedAt,
            },
        });

        return NextResponse.json({
            challenge: {
                ...challenge,
                joined: true,
                progress: updatedParticipant.progress,
                completed: updatedParticipant.completed,
            },
            auraGained
        });

    } catch (error) {
        console.error('Challenge progress error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

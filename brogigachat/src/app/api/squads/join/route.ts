import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user is already in a squad
        const existingMembership = await prisma.squadMember.findFirst({
            where: { userId: prismaUser.id },
        });

        if (existingMembership) {
            return NextResponse.json({ error: 'You are already in a squad' }, { status: 400 });
        }

        // Find squad by code
        const squad = await prisma.squad.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!squad) {
            return NextResponse.json({ error: 'Invalid squad code' }, { status: 404 });
        }

        // Add user to squad
        await prisma.squadMember.create({
            data: {
                userId: prismaUser.id,
                squadId: squad.id,
                role: 'MEMBER',
            },
        });

        // Fetch updated squad details to return
        const squadMembers = await prisma.squadMember.findMany({
            where: { squadId: squad.id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        aura: true,
                        level: true,
                    }
                }
            }
        });

        const formattedSquad = {
            id: squad.id,
            name: squad.name,
            code: squad.code,
            totalAura: squad.totalAura,
            weeklyGoal: squad.weeklyGoal,
            weeklyProgress: squadMembers.reduce((acc, m) => acc + m.weeklyAura, 0),
            members: squadMembers.map(m => ({
                id: m.user.id,
                username: m.user.username,
                aura: m.user.aura,
                level: m.user.level,
                isLeader: m.role === 'LEADER',
            }))
        };

        return NextResponse.json({ squad: formattedSquad });

    } catch (error) {
        console.error('Squad join error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

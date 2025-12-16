import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find user's squad
        const membership = await prisma.squadMember.findFirst({
            where: { userId: user.id }, // Note: userId in Prisma is CUID, but we need to map from Supabase user. 
            // Wait, in previous steps we established that we look up Prisma User by email.
            // Let's do that first.
        });

        // Actually, we need to find the Prisma User first
        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const memberRecord = await prisma.squadMember.findFirst({
            where: { userId: prismaUser.id },
            include: {
                squad: {
                    include: {
                        members: {
                            include: {
                                // We can't include 'user' relation directly if it's not defined in schema properly or if we want specific fields
                                // Schema has: user User @relation(...)
                                // So we can include user.
                            }
                        }
                    }
                }
            }
        });

        if (!memberRecord) {
            return NextResponse.json({ message: 'No squad found' }, { status: 404 });
        }

        // Fetch full member details
        const squadMembers = await prisma.squadMember.findMany({
            where: { squadId: memberRecord.squadId },
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
            id: memberRecord.squad.id,
            name: memberRecord.squad.name,
            code: memberRecord.squad.code,
            totalAura: memberRecord.squad.totalAura,
            weeklyGoal: memberRecord.squad.weeklyGoal,
            weeklyProgress: 0, // Calculate this based on members' weeklyAura
            members: squadMembers.map(m => ({
                id: m.user.id,
                username: m.user.username,
                aura: m.user.aura,
                level: m.user.level,
                isLeader: m.role === 'LEADER',
            }))
        };

        // Calculate total weekly progress
        formattedSquad.weeklyProgress = squadMembers.reduce((acc, m) => acc + m.weeklyAura, 0);

        return NextResponse.json({ squad: formattedSquad });

    } catch (error) {
        console.error('Squad fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
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

        // Generate unique code
        const code = nanoid(6).toUpperCase();

        // Create squad and add user as leader
        const squad = await prisma.squad.create({
            data: {
                name,
                description,
                code,
                members: {
                    create: {
                        userId: prismaUser.id,
                        role: 'LEADER',
                    }
                }
            },
            include: {
                members: true // Just to get the ID back if needed, but we'll format manually
            }
        });

        const formattedSquad = {
            id: squad.id,
            name: squad.name,
            code: squad.code,
            totalAura: 0,
            weeklyGoal: squad.weeklyGoal,
            weeklyProgress: 0,
            members: [{
                id: prismaUser.id,
                username: prismaUser.username,
                aura: prismaUser.aura,
                level: prismaUser.level,
                isLeader: true,
            }]
        };

        return NextResponse.json({ squad: formattedSquad });

    } catch (error) {
        console.error('Squad create error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

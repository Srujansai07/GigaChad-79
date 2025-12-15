import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { SquadRole } from '@prisma/client';

// GET /api/squad - Get user's squad or search by code
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (code) {
            // Search for squad by code
            const squad = await prisma.squad.findUnique({
                where: { code },
                include: {
                    _count: {
                        select: { members: true }
                    }
                }
            });

            if (!squad) {
                return NextResponse.json({ error: 'Squad not found' }, { status: 404 });
            }

            return NextResponse.json({ squad });
        }

        // Get user's squad
        const membership = await prisma.squadMember.findFirst({
            where: { userId: user.id },
            include: {
                squad: {
                    include: {
                        members: {
                            orderBy: { weeklyAura: 'desc' },
                            take: 10 // Top 10 members for preview
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            squad: membership?.squad || null,
            role: membership?.role || null,
        });

    } catch (error) {
        console.error('Squad GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch squad' }, { status: 500 });
    }
}

// POST /api/squad - Create or Join squad
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action, name, code, description } = body;

        // Check if user is already in a squad
        const existingMembership = await prisma.squadMember.findFirst({
            where: { userId: user.id }
        });

        if (existingMembership) {
            return NextResponse.json({ error: 'Already in a squad' }, { status: 400 });
        }

        if (action === 'create') {
            if (!name || !code) {
                return NextResponse.json({ error: 'Name and code required' }, { status: 400 });
            }

            // Check if code exists
            const existingSquad = await prisma.squad.findUnique({ where: { code } });
            if (existingSquad) {
                return NextResponse.json({ error: 'Squad code already taken' }, { status: 400 });
            }

            // Create squad and add user as leader
            const result = await prisma.$transaction(async (tx) => {
                const squad = await tx.squad.create({
                    data: {
                        name,
                        code,
                        description,
                        members: {
                            create: {
                                userId: user.id,
                                role: 'LEADER' as SquadRole
                            }
                        }
                    }
                });
                return squad;
            });

            return NextResponse.json({ success: true, squad: result });

        } else if (action === 'join') {
            if (!code) {
                return NextResponse.json({ error: 'Squad code required' }, { status: 400 });
            }

            const squad = await prisma.squad.findUnique({ where: { code } });
            if (!squad) {
                return NextResponse.json({ error: 'Squad not found' }, { status: 404 });
            }

            await prisma.squadMember.create({
                data: {
                    squadId: squad.id,
                    userId: user.id,
                    role: 'MEMBER' as SquadRole
                }
            });

            return NextResponse.json({ success: true, message: 'Joined squad successfully' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Squad POST error:', error);
        return NextResponse.json({ error: 'Failed to process squad action' }, { status: 500 });
    }
}

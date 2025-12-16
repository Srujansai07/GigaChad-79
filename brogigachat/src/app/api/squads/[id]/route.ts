import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
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

        // Check membership
        const membership = await prisma.squadMember.findUnique({
            where: {
                squadId_userId: {
                    squadId: params.id,
                    userId: prismaUser.id,
                }
            },
        });

        if (!membership) {
            return NextResponse.json({ error: 'Not a member of this squad' }, { status: 403 });
        }

        if (membership.role === 'LEADER') {
            // If leader leaves, delete the squad (for now, or transfer leadership later)
            await prisma.squad.delete({
                where: { id: params.id },
            });
            return NextResponse.json({ message: 'Squad deleted' });
        } else {
            // Just leave
            await prisma.squadMember.delete({
                where: {
                    squadId_userId: {
                        squadId: params.id,
                        userId: prismaUser.id,
                    }
                },
            });
            return NextResponse.json({ message: 'Left squad' });
        }

    } catch (error) {
        console.error('Squad leave error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

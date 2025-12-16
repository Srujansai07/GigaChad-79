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

        // Verify ownership
        const habit = await prisma.habit.findUnique({
            where: { id: params.id },
        });

        if (!habit) {
            return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
        }

        if (habit.userId !== prismaUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.habit.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Habit deleted' });

    } catch (error) {
        console.error('Habit delete error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

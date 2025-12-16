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

        const goals = await prisma.goal.findMany({
            where: { userId: prismaUser.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ goals });

    } catch (error) {
        console.error('Goals fetch error:', error);
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
        const { title, target, unit, deadline } = body;

        if (!title || !target || !unit) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const goal = await prisma.goal.create({
            data: {
                userId: prismaUser.id,
                title,
                target: Number(target),
                unit,
                deadline: deadline ? new Date(deadline) : null,
                current: 0,
            },
        });

        return NextResponse.json({ goal });

    } catch (error) {
        console.error('Goal create error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

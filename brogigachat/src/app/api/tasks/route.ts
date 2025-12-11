import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { CreateTaskSchema } from '@/lib/validation';

// GET: Fetch user's tasks
export async function GET(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = { userId: user.id };

        if (status === 'active') {
            where.completed = false;
            where.status = { not: 'CANCELLED' };
        } else if (status === 'completed') {
            where.completed = true;
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { scheduledFor: 'asc' },
            take: limit,
            skip: offset,
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Tasks GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}

// POST: Create new task
export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = CreateTaskSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: 'Invalid input',
                details: validation.error.errors
            }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                userId: user.id,
                ...validation.data,
            },
        });

        return NextResponse.json({ task }, { status: 201 });
    } catch (error) {
        console.error('Tasks POST error:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// GET /api/goals - List user goals
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const goals = await prisma.goal.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ goals });

    } catch (error) {
        console.error('Goals GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }
}

// POST /api/goals - Create new goal
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, target, unit, deadline, auraReward } = body;

        if (!title || !target || !unit) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const goal = await prisma.goal.create({
            data: {
                userId: user.id,
                title,
                target: Number(target),
                unit,
                deadline: deadline ? new Date(deadline) : null,
                auraReward: auraReward || 500,
                current: 0,
                completed: false
            }
        });

        return NextResponse.json({ success: true, goal });

    } catch (error) {
        console.error('Goals POST error:', error);
        return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
    }
}

// PATCH /api/goals - Update progress
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { goalId, progress } = body;

        if (!goalId || progress === undefined) {
            return NextResponse.json({ error: 'Goal ID and progress required' }, { status: 400 });
        }

        const goal = await prisma.goal.findUnique({ where: { id: goalId } });
        if (!goal || goal.userId !== user.id) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        const newCurrent = goal.current + Number(progress);
        const completed = newCurrent >= goal.target;

        const updatedGoal = await prisma.goal.update({
            where: { id: goalId },
            data: {
                current: newCurrent,
                completed,
                completedAt: completed ? new Date() : null
            }
        });

        if (completed && !goal.completed) {
            // Award aura for completion
            await prisma.user.update({
                where: { id: user.id },
                data: { aura: { increment: goal.auraReward } }
            });
        }

        return NextResponse.json({ success: true, goal: updatedGoal, completed });

    } catch (error) {
        console.error('Goals PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
    }
}

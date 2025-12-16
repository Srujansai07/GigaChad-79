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

        // Fetch items
        const items = await prisma.shopItem.findMany({
            orderBy: { cost: 'asc' },
        });

        // Fetch user inventory
        const inventory = await prisma.userItem.findMany({
            where: { userId: prismaUser.id },
            include: { item: true },
        });

        return NextResponse.json({ items, inventory }, {
            headers: {
                // Cache for 5 minutes, stale for 1 hour
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600'
            }
        });

    } catch (error) {
        console.error('Shop fetch error:', error);
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

        const prismaUser = await prisma.user.findUnique({
            where: { email: user.email! },
        });

        if (!prismaUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { itemId } = body;

        const item = await prisma.shopItem.findUnique({
            where: { id: itemId },
        });

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        if (prismaUser.aura < item.cost) {
            return NextResponse.json({ error: 'Insufficient Aura' }, { status: 400 });
        }

        // Transaction: Deduct Aura, Add Item
        const [updatedUser, userItem] = await prisma.$transaction([
            prisma.user.update({
                where: { id: prismaUser.id },
                data: { aura: { decrement: item.cost } },
            }),
            prisma.userItem.upsert({
                where: {
                    userId_itemId: {
                        userId: prismaUser.id,
                        itemId: item.id,
                    },
                },
                update: {
                    quantity: { increment: 1 },
                },
                create: {
                    userId: prismaUser.id,
                    itemId: item.id,
                    quantity: 1,
                },
                include: { item: true },
            }),
        ]);

        return NextResponse.json({
            userItem,
            userAura: updatedUser.aura,
            message: `Purchased ${item.name}!`
        });

    } catch (error) {
        console.error('Purchase error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

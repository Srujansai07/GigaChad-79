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

        const postId = params.id;

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: prismaUser.id,
                    postId,
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: prismaUser.id,
                    postId,
                }
            });
            return NextResponse.json({ liked: true });
        }

    } catch (error) {
        console.error('Like toggle error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

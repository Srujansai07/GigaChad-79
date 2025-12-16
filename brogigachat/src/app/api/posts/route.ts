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

        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        username: true,
                        level: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                },
                likes: {
                    where: {
                        user: { email: user.email! }
                    },
                    select: { id: true }
                }
            },
            take: 20
        });

        // Transform to add 'isLiked' boolean
        const formattedPosts = posts.map(post => ({
            ...post,
            isLiked: post.likes.length > 0,
            likes: undefined // Remove raw likes array
        }));

        return NextResponse.json(formattedPosts);

    } catch (error) {
        console.error('Posts fetch error:', error);
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
        const { content, type = 'FLEX' } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                userId: prismaUser.id,
                content,
                type,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        level: true,
                    }
                }
            }
        });

        return NextResponse.json(post);

    } catch (error) {
        console.error('Post creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

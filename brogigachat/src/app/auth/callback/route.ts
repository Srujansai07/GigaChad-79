import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            try {
                // Check if user exists in database
                const existingUser = await prisma.user.findUnique({
                    where: { id: data.user.id },
                });

                if (!existingUser) {
                    // Generate unique username
                    const emailPrefix = data.user.email?.split('@')[0] || 'user';
                    let username = emailPrefix;
                    let isUnique = false;
                    let attempts = 0;

                    while (!isUnique && attempts < 5) {
                        const check = await prisma.user.findUnique({ where: { username } });
                        if (!check) {
                            isUnique = true;
                        } else {
                            username = `${emailPrefix}${Math.floor(Math.random() * 10000)}`;
                            attempts++;
                        }
                    }

                    // Create user in Prisma
                    await prisma.user.create({
                        data: {
                            id: data.user.id,
                            email: data.user.email!,
                            username,
                            aura: 0,
                            level: 1,
                        },
                    });
                }

                return NextResponse.redirect(`${origin}${next}`);
            } catch (dbError) {
                console.error('Database sync error:', dbError);
                // Even if DB sync fails, session is set, so redirect to home but maybe show error
                return NextResponse.redirect(`${origin}${next}?warning=sync_failed`);
            }
        }
    }

    // Return to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}


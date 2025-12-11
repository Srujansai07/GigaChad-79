import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Check if user exists in database, create if not
            const existingUser = await prisma.user.findUnique({
                where: { id: data.user.id },
            });

            if (!existingUser) {
                // Generate username from email
                const emailPrefix = data.user.email?.split('@')[0] || 'user';
                const username = `${emailPrefix}${Math.floor(Math.random() * 1000)}`;

                await prisma.user.create({
                    data: {
                        id: data.user.id,
                        email: data.user.email!,
                        username,
                    },
                });
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

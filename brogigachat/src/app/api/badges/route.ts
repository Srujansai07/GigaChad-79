import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { BADGE_RULES } from '@/lib/gamification/badgeRules';

export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: authUser.email! },
            include: { badges: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Combine static rules with DB status
        const badges = BADGE_RULES.map((rule) => {
            const unlocked = user.badges.some((ub) => ub.badgeId === rule.id);
            return {
                ...rule,
                unlocked,
                // We don't send the check function to the client
                check: undefined,
            };
        });

        return NextResponse.json({ badges });
    } catch (error) {
        console.error('Error fetching badges:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, type Context } from '@/server/trpc';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

const handler = async (req: Request) => {
    // Get user from Supabase session
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: (): Context => ({
            userId: user?.id || null,
            prisma,
        }),
    });
};

export { handler as GET, handler as POST };

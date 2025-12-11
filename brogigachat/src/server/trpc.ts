// ==================================================
// BroGigaChad - tRPC Server Setup
// Phase 1, Sub 1.9: Type-Safe API Layer
// ==================================================

import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import {
    CreateTaskSchema,
    CompleteTaskSchema,
    SkipTaskSchema,
    TaskEnhancementRequestSchema,
    LeaderboardQuerySchema,
} from '@/lib/validation';

// Context type
export interface Context {
    userId: string | null;
    prisma: typeof prisma;
}

// Create tRPC instance
const t = initTRPC.context<Context>().create();

// Middleware for authenticated routes
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    return next({ ctx: { ...ctx, userId: ctx.userId } });
});

// Procedures
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

// ==================================================
// ROUTERS
// ==================================================

// Task Router
export const taskRouter = t.router({
    // Get all tasks for user
    list: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.task.findMany({
            where: { userId: ctx.userId },
            orderBy: { scheduledFor: 'asc' },
        });
    }),

    // Get active tasks
    active: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.task.findMany({
            where: {
                userId: ctx.userId,
                completed: false,
                status: { not: 'CANCELLED' },
            },
            orderBy: { scheduledFor: 'asc' },
        });
    }),

    // Get single task
    byId: protectedProcedure
        .input(z.object({ id: z.string().cuid() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.task.findFirst({
                where: { id: input.id, userId: ctx.userId },
            });
        }),

    // Create task
    create: protectedProcedure
        .input(CreateTaskSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.task.create({
                data: {
                    userId: ctx.userId,
                    ...input,
                },
            });
        }),

    // Complete task
    complete: protectedProcedure
        .input(CompleteTaskSchema)
        .mutation(async ({ ctx, input }) => {
            const task = await ctx.prisma.task.update({
                where: { id: input.taskId },
                data: {
                    completed: true,
                    completedAt: new Date(),
                    auraGained: input.auraGained,
                    status: 'COMPLETED',
                },
            });

            // Update user stats
            await ctx.prisma.user.update({
                where: { id: ctx.userId },
                data: {
                    aura: { increment: input.auraGained },
                    tasksCompleted: { increment: 1 },
                    streak: { increment: 1 },
                    lastActiveAt: new Date(),
                    strictModeCount: input.completedInStrictMode ? { increment: 1 } : undefined,
                },
            });

            return task;
        }),

    // Skip task
    skip: protectedProcedure
        .input(SkipTaskSchema)
        .mutation(async ({ ctx, input }) => {
            const newScheduledFor = new Date(Date.now() + input.extendMinutes * 60 * 1000);

            const task = await ctx.prisma.task.update({
                where: { id: input.taskId },
                data: {
                    skipCount: { increment: 1 },
                    lastSkippedAt: new Date(),
                    scheduledFor: newScheduledFor,
                    status: 'SKIPPED',
                },
            });

            // Deduct aura
            await ctx.prisma.user.update({
                where: { id: ctx.userId },
                data: { aura: { decrement: 50 } },
            });

            return task;
        }),

    // Delete task
    delete: protectedProcedure
        .input(z.object({ id: z.string().cuid() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.task.delete({
                where: { id: input.id },
            });
        }),
});

// User Router
export const userRouter = t.router({
    // Get current user
    me: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.user.findUnique({
            where: { id: ctx.userId },
            include: { badges: { include: { badge: true } } },
        });
    }),

    // Get user stats
    stats: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { id: ctx.userId },
            select: {
                aura: true,
                level: true,
                streak: true,
                tasksCompleted: true,
                strictModeCount: true,
            },
        });

        const tasksCompleted = await ctx.prisma.task.count({
            where: { userId: ctx.userId, completed: true },
        });

        const tasksSkipped = await ctx.prisma.task.count({
            where: { userId: ctx.userId, skipCount: { gt: 0 } },
        });

        return {
            ...user,
            tasksCompleted,
            tasksSkipped,
            successRate: tasksCompleted / (tasksCompleted + tasksSkipped) || 0,
        };
    }),

    // Update preferences
    updatePreferences: protectedProcedure
        .input(z.object({
            notificationsEnabled: z.boolean().optional(),
            strictModeEnabled: z.boolean().optional(),
            voicePack: z.enum(['topg', 'monk', 'friend', 'drill']).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.user.update({
                where: { id: ctx.userId },
                data: input,
            });
        }),
});

// Leaderboard Router
export const leaderboardRouter = t.router({
    // Get global leaderboard
    global: publicProcedure
        .input(LeaderboardQuerySchema)
        .query(async ({ ctx, input }) => {
            return ctx.prisma.user.findMany({
                orderBy: { aura: 'desc' },
                take: input.limit,
                skip: input.offset,
                select: {
                    id: true,
                    username: true,
                    aura: true,
                    level: true,
                    streak: true,
                },
            });
        }),

    // Get user rank
    rank: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { id: ctx.userId },
            select: { aura: true },
        });

        if (!user) return null;

        const rank = await ctx.prisma.user.count({
            where: { aura: { gt: user.aura } },
        });

        return { rank: rank + 1, aura: user.aura };
    }),
});

// ==================================================
// COMBINED ROUTER
// ==================================================

export const appRouter = t.router({
    task: taskRouter,
    user: userRouter,
    leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import Profile from '@/components/Profile';
import LevelProgressBar from '@/components/LevelProgressBar';
import BadgeGrid from '@/components/BadgeGrid';
import StreakDisplay from '@/components/StreakDisplay';
import ProductivityHeatmap from '@/components/ProductivityHeatmap';
import DailyStatsCard from '@/components/DailyStatsCard';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
    title: 'Profile | BroGigaChad',
    description: 'Your stats, badges, and achievements',
};

async function getUserData() {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        include: {
            badges: { include: { badge: true } },
        }
    });

    if (!user) return null;

    // Fetch completed tasks for heatmap
    const completedTasks = await prisma.task.findMany({
        where: { userId: user.id, completed: true },
        select: { completedAt: true, id: true }
    });

    // Calculate stats
    const tasksCompletedCount = completedTasks.length;

    const tasksTotal = await prisma.task.count({
        where: { userId: user.id }
    });

    const tasksToday = await prisma.task.count({
        where: {
            userId: user.id,
            completed: true,
            completedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
    });

    // Map to AnalyticsPayload format for heatmap
    const heatmapEvents = completedTasks.map(t => ({
        timestamp: t.completedAt!.getTime(),
        event: { type: 'task_completed' as const, taskId: t.id, aura: 0, duration: 0, strictMode: false },
        sessionId: 'server-generated',
    }));

    return {
        user,
        stats: {
            tasksCompleted: tasksCompletedCount,
            tasksTotal,
            tasksToday,
        },
        heatmapEvents,
    };
}

export default async function ProfilePage() {
    const data = await getUserData();

    if (!data) {
        redirect('/login');
    }

    const { user, stats, heatmapEvents } = data;

    const dailyStats = {
        tasksCompleted: stats.tasksCompleted,
        tasksTotal: stats.tasksTotal,
        auraGained: user.aura, // Simplified
        auraLost: 0,
        streak: user.streak,
        focusMinutes: 0,
        strictModeCount: user.strictModeCount,
    };

    return (
        <div className="min-h-screen bg-background p-4 pb-24 space-y-4">
            {/* Profile Header */}
            <Profile user={{ ...user, tasksCompleted: stats.tasksCompleted, tasksTotal: stats.tasksTotal }} />

            {/* Level Progress */}
            <LevelProgressBar currentAura={user.aura} />

            {/* Streak Display */}
            <StreakDisplay user={user} />

            {/* Daily Stats */}
            <DailyStatsCard stats={dailyStats} />

            {/* Badges */}
            <div className="bg-surface rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Badges</h3>
                    <a href="/badges" className="text-xs text-primary">View All</a>
                </div>
                <BadgeGrid badges={user.badges} />
            </div>

            {/* Productivity Heatmap */}
            <ProductivityHeatmap events={heatmapEvents as any[]} />

            <BottomNav currentScreen="profile" />
        </div>
    );
}

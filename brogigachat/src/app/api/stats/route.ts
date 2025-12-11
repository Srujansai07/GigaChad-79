import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/stats - Get user statistics
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'week';

        // Calculate date range
        const now = new Date();
        let startDate: Date;

        switch (range) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0); // All time
        }

        // Mock stats - would come from database aggregations
        const stats = {
            totalTasks: 247,
            completedTasks: 221,
            skippedTasks: 26,
            totalAura: 15420,
            currentStreak: 12,
            bestStreak: 21,
            strictModeSessions: 8,
            averageDaily: 4.2,
            completionRate: 89,

            // Weekly breakdown
            weeklyData: [
                { day: 'Mon', tasks: 5, aura: 450 },
                { day: 'Tue', tasks: 4, aura: 380 },
                { day: 'Wed', tasks: 6, aura: 520 },
                { day: 'Thu', tasks: 3, aura: 280 },
                { day: 'Fri', tasks: 5, aura: 440 },
                { day: 'Sat', tasks: 2, aura: 180 },
                { day: 'Sun', tasks: 4, aura: 350 },
            ],

            // Trends
            trends: {
                tasksChange: 15,
                auraChange: 22,
                streakChange: 0,
            },

            range,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Stats GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

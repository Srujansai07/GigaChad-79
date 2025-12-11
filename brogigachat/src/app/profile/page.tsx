import { Metadata } from 'next';
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

export default function ProfilePage() {
    // Mock stats for now
    const mockStats = {
        tasksCompleted: 8,
        tasksTotal: 10,
        auraGained: 450,
        auraLost: 50,
        streak: 14,
        focusMinutes: 120,
        strictModeCount: 2,
    };

    return (
        <div className="min-h-screen bg-background p-4 pb-24 space-y-4">
            {/* Profile Header */}
            <Profile />

            {/* Level Progress */}
            <LevelProgressBar />

            {/* Streak Display */}
            <StreakDisplay />

            {/* Daily Stats */}
            <DailyStatsCard stats={mockStats} />

            {/* Badges */}
            <div className="bg-surface rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Badges</h3>
                    <a href="/badges" className="text-xs text-primary">View All</a>
                </div>
                <BadgeGrid max={8} />
            </div>

            {/* Productivity Heatmap */}
            <ProductivityHeatmap />

            <BottomNav />
        </div>
    );
}

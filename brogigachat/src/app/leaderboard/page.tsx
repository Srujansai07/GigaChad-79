import { Metadata } from 'next';
import Leaderboard from '@/components/Leaderboard';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
    title: 'Leaderboard | BroGigaChad',
    description: 'Global rankings and competition',
};

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-background p-4 pb-24">
            <h1 className="text-2xl font-bold text-white mb-6">Leaderboard</h1>

            {/* Leaderboard Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['Global', 'Friends', 'Squad', 'City'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${tab === 'Global'
                                ? 'bg-primary text-white'
                                : 'bg-surface text-gray-400 border border-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <Leaderboard />

            <BottomNav />
        </div>
    );
}

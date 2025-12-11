'use client';

import { Trophy, TrendingUp } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';

// Mock leaderboard data
const mockLeaderboard = [
    { rank: 1, username: 'SigmaGrinder', aura: 187000, level: 'TopG' },
    { rank: 2, username: 'HustleKing', aura: 156000, level: 'TopG' },
    { rank: 3, username: 'DisciplinedAF', aura: 134000, level: 'Sigma' },
    { rank: 4, username: 'AlphaMentality', aura: 89000, level: 'Alpha' },
    { rank: 5, username: 'GrindNeverStops', aura: 67000, level: 'Alpha' },
];

const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-500';
};

const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
};

export default function Leaderboard() {
    const { user, levelInfo } = useUserStore();

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Trophy className="text-aura" />
                    Global Rankings
                </h1>
                <p className="text-gray-400 text-sm mt-1">Compete with the best</p>
            </div>

            {/* Your Rank Card */}
            <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-xl font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-white">{user.username}</p>
                            <p className={`text-sm ${levelInfo.color}`}>{levelInfo.name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-aura font-bold">{user.aura.toLocaleString()} Aura</p>
                        <div className="flex items-center gap-1 text-success text-sm">
                            <TrendingUp size={14} />
                            <span>Climbing!</span>
                        </div>
                    </div>
                </div>
                {user.aura < 1000 && (
                    <p className="text-xs text-gray-400 mt-3">
                        🚀 Complete more tasks to climb the ranks!
                    </p>
                )}
            </div>

            {/* Top 5 */}
            <div>
                <h2 className="font-bold text-lg mb-3">Top Grinders</h2>
                <div className="space-y-2">
                    {mockLeaderboard.map((entry) => (
                        <div
                            key={entry.rank}
                            className={`flex items-center justify-between p-4 rounded-lg ${entry.rank <= 3 ? 'bg-surface border border-gray-700' : 'bg-surface/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-xl font-bold ${getRankColor(entry.rank)}`}>
                                    {getRankEmoji(entry.rank)}
                                </span>
                                <div>
                                    <p className="font-semibold text-white">@{entry.username}</p>
                                    <p className="text-xs text-gray-400">{entry.level}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-aura font-bold">{entry.aura.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Aura</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coming Soon */}
            <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                    🌍 City & Country rankings coming soon...
                </p>
            </div>
        </div>
    );
}

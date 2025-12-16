'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Flame, Loader2 } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';

interface LeaderboardUser {
    id: string;
    username: string;
    aura: number;
    level: number;
    streak: number;
    badges: string[];
    rank: number;
    isCurrentUser: boolean;
}

export default function Leaderboard() {
    const { user } = useUserStore();
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                if (res.ok) {
                    const data = await res.json();
                    setLeaderboard(data.leaderboard);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="text-yellow-500" size={24} fill="currentColor" />;
        if (rank === 2) return <Medal className="text-gray-300" size={24} fill="currentColor" />;
        if (rank === 3) return <Medal className="text-amber-700" size={24} fill="currentColor" />;
        return <span className="font-bold text-gray-500 w-6 text-center">{rank}</span>;
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Trophy className="text-aura" />
                    Global Rankings
                </h1>
                <p className="text-gray-400 text-sm mt-1">Compete with the best</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : (
                <div className="space-y-2">
                    {leaderboard.map((u) => (
                        <div
                            key={u.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${u.isCurrentUser
                                    ? 'bg-primary/10 border-primary/50'
                                    : 'bg-surface border-white/5'
                                }`}
                        >
                            <div className="flex-shrink-0 w-8 flex justify-center">
                                {getRankIcon(u.rank)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`font-bold truncate ${u.isCurrentUser ? 'text-primary' : 'text-white'}`}>
                                        {u.username}
                                    </p>
                                    {u.badges.slice(0, 3).map((emoji, i) => (
                                        <span key={i} className="text-xs">{emoji}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span>Lvl {u.level}</span>
                                    <span className="flex items-center gap-1">
                                        <Flame size={10} className="text-streak" />
                                        {u.streak}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-aura">{u.aura.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Aura</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

'use client';

import { Flame, Shield, TrendingUp } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { calculateStreakInfo } from '@/lib/gamification';

interface StreakDisplayProps {
    user?: any; // Replace with proper type
}

export default function StreakDisplay({ user: serverUser }: StreakDisplayProps) {
    const { user: clientUser } = useUserStore();
    const user = serverUser || clientUser;

    const streakInfo = calculateStreakInfo(
        user.lastActiveAt ? new Date(user.lastActiveAt) : null,
        user.streak || 0,
        user.longestStreak || user.streak || 0
    );

    const getStreakColor = (streak: number) => {
        if (streak >= 365) return 'text-yellow-400';
        if (streak >= 90) return 'text-purple-400';
        if (streak >= 30) return 'text-orange-400';
        if (streak >= 7) return 'text-blue-400';
        return 'text-gray-400';
    };

    const getFireEmoji = (streak: number) => {
        if (streak >= 365) return '🔥🔥🔥';
        if (streak >= 90) return '🔥🔥';
        if (streak >= 7) return '🔥';
        return '🌱';
    };

    return (
        <div className="bg-gradient-to-r from-streak/20 to-transparent border border-streak/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
                {/* Streak Counter */}
                <div className="flex items-center gap-3">
                    <div className="text-3xl">{getFireEmoji(streakInfo.currentStreak)}</div>
                    <div>
                        <p className={`text-3xl font-black ${getStreakColor(streakInfo.currentStreak)}`}>
                            {streakInfo.currentStreak}
                        </p>
                        <p className="text-xs text-gray-500">Day Streak</p>
                    </div>
                </div>

                {/* Multiplier */}
                {streakInfo.streakMultiplier > 1 && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-aura/20 rounded-full">
                        <TrendingUp size={14} className="text-aura" />
                        <span className="text-aura font-bold text-sm">{streakInfo.streakMultiplier}x</span>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield size={14} />
                    <span>Best: {streakInfo.longestStreak} days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Flame size={14} />
                    <span className={streakInfo.isStreakAlive ? 'text-success' : 'text-danger'}>
                        {streakInfo.isStreakAlive ? 'Active' : 'Broken'}
                    </span>
                </div>
            </div>

            {/* Motivation */}
            {streakInfo.currentStreak < 7 && (
                <p className="text-xs text-gray-500 mt-2">
                    🎯 {7 - streakInfo.currentStreak} more days to unlock 1.5x multiplier!
                </p>
            )}
            {streakInfo.currentStreak >= 7 && streakInfo.currentStreak < 30 && (
                <p className="text-xs text-gray-500 mt-2">
                    🎯 {30 - streakInfo.currentStreak} more days to unlock 1.75x multiplier!
                </p>
            )}
        </div>
    );
}


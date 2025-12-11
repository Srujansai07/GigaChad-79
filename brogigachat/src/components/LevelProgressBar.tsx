'use client';

import { useUserStore } from '@/stores/userStore';
import { getLevelInfo } from '@/lib/gamification';
import { Zap, TrendingUp } from 'lucide-react';

export default function LevelProgressBar() {
    const { user } = useUserStore();
    const levelInfo = getLevelInfo(user.aura);

    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            {/* Current Level */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{levelInfo.emoji}</span>
                    <div>
                        <p className={`font-bold ${levelInfo.color}`}>{levelInfo.name}</p>
                        <p className="text-xs text-gray-500">Level {levelInfo.level}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-aura">
                    <Zap size={16} />
                    <span className="font-bold">{user.aura.toLocaleString()}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                        width: `${levelInfo.progress}%`,
                        background: `linear-gradient(90deg, 
              ${levelInfo.level <= 2 ? '#3b82f6' : ''} 
              ${levelInfo.level === 3 ? '#a855f7' : ''} 
              ${levelInfo.level === 4 ? '#f97316' : ''} 
              ${levelInfo.level >= 5 ? '#ef4444' : ''} 
              0%, 
              ${levelInfo.level === 6 ? '#eab308' : '#fff'} 100%)`,
                    }}
                />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>

            {/* Next Level */}
            {levelInfo.nextLevel && (
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>{levelInfo.auraToNext.toLocaleString()} to next level</span>
                    </div>
                    <span className={levelInfo.nextLevel.color}>
                        {levelInfo.nextLevel.emoji} {levelInfo.nextLevel.name}
                    </span>
                </div>
            )}

            {/* Max Level */}
            {!levelInfo.nextLevel && (
                <p className="mt-2 text-xs text-yellow-500 text-center">
                    👑 Maximum level reached! You're a Legend!
                </p>
            )}
        </div>
    );
}

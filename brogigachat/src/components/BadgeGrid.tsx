'use client';

import { useUserStore } from '@/stores/userStore';
import { BADGES, checkBadgeUnlock } from '@/lib/gamification';

interface BadgeGridProps {
    showAll?: boolean;
    max?: number;
}

export default function BadgeGrid({ showAll = false, max = 8 }: BadgeGridProps) {
    const { user } = useUserStore();

    // Get user's unlocked badges (for now, check based on stats)
    const userStats = {
        tasksCompleted: user.tasksCompleted,
        streak: user.streak,
        aura: user.aura,
        strictModeCount: user.strictModeCount,
        level: user.level,
        specialAchievements: [1], // Founder badge
    };

    // Check which badges are unlocked
    const unlockedBadgeIds = BADGES.filter((badge) => {
        if (badge.criteria.type === 'tasksCompleted') return userStats.tasksCompleted >= badge.criteria.value;
        if (badge.criteria.type === 'streak') return userStats.streak >= badge.criteria.value;
        if (badge.criteria.type === 'aura') return userStats.aura >= badge.criteria.value;
        if (badge.criteria.type === 'strictModeCount') return userStats.strictModeCount >= badge.criteria.value;
        if (badge.criteria.type === 'level') return userStats.level >= badge.criteria.value;
        if (badge.criteria.type === 'special') return userStats.specialAchievements?.includes(badge.criteria.value);
        return false;
    }).map((b) => b.id);

    const displayBadges = showAll ? BADGES : BADGES.slice(0, max);

    return (
        <div className="grid grid-cols-4 gap-2">
            {displayBadges.map((badge) => {
                const isUnlocked = unlockedBadgeIds.includes(badge.id);

                return (
                    <div
                        key={badge.id}
                        className={`relative p-3 rounded-lg text-center transition-all ${isUnlocked
                                ? 'bg-surface border border-aura/30 hover:scale-105'
                                : 'bg-surface/30 opacity-40 grayscale'
                            }`}
                        title={`${badge.name}: ${badge.description}`}
                    >
                        <span className="text-2xl">{badge.emoji}</span>
                        <p className="text-[10px] text-gray-400 mt-1 truncate">{badge.name}</p>

                        {/* Glow effect for unlocked */}
                        {isUnlocked && (
                            <div className="absolute inset-0 rounded-lg bg-aura/5 animate-pulse" />
                        )}

                        {/* Lock overlay */}
                        {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg opacity-50">🔒</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

'use client';

import { BADGES } from '@/lib/gamification';

interface BadgeGridProps {
    showAll?: boolean;
    max?: number;
    badges?: any[]; // Replace with proper type from Prisma/types
}

export default function BadgeGrid({ showAll = false, max = 8, badges: userBadges = [] }: BadgeGridProps) {
    // Get IDs of unlocked badges
    const unlockedBadgeIds = userBadges?.map((ub) => ub.badgeId || ub.badge?.id) || [];

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


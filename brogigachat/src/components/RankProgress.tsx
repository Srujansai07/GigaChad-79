'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star, ChevronRight } from 'lucide-react';

interface Rank {
    position: number;
    name: string;
    icon: React.ReactNode;
    minAura: number;
    maxAura: number;
    color: string;
}

const RANKS: Rank[] = [
    { position: 1, name: 'Bronze', icon: <Medal size={20} />, minAura: 0, maxAura: 999, color: 'text-amber-600' },
    { position: 2, name: 'Silver', icon: <Medal size={20} />, minAura: 1000, maxAura: 4999, color: 'text-gray-400' },
    { position: 3, name: 'Gold', icon: <Medal size={20} />, minAura: 5000, maxAura: 14999, color: 'text-yellow-400' },
    { position: 4, name: 'Platinum', icon: <Crown size={20} />, minAura: 15000, maxAura: 49999, color: 'text-cyan-400' },
    { position: 5, name: 'Diamond', icon: <Crown size={20} />, minAura: 50000, maxAura: 149999, color: 'text-blue-400' },
    { position: 6, name: 'Master', icon: <Star size={20} />, minAura: 150000, maxAura: 499999, color: 'text-purple-400' },
    { position: 7, name: 'Legend', icon: <Trophy size={20} />, minAura: 500000, maxAura: Infinity, color: 'text-red-400' },
];

interface RankProgressProps {
    currentAura: number;
}

export default function RankProgress({ currentAura }: RankProgressProps) {
    const [currentRank, setCurrentRank] = useState<Rank>(RANKS[0]);
    const [nextRank, setNextRank] = useState<Rank | null>(RANKS[1]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        for (let i = RANKS.length - 1; i >= 0; i--) {
            if (currentAura >= RANKS[i].minAura) {
                setCurrentRank(RANKS[i]);
                setNextRank(RANKS[i + 1] || null);

                if (RANKS[i + 1]) {
                    const rangeSize = RANKS[i + 1].minAura - RANKS[i].minAura;
                    const progressInRange = currentAura - RANKS[i].minAura;
                    setProgress((progressInRange / rangeSize) * 100);
                } else {
                    setProgress(100);
                }
                break;
            }
        }
    }, [currentAura]);

    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-800 ${currentRank.color}`}>
                        {currentRank.icon}
                    </div>
                    <div>
                        <p className="font-bold text-white">{currentRank.name}</p>
                        <p className="text-sm text-gray-400">Rank {currentRank.position}/7</p>
                    </div>
                </div>
                {nextRank && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <ChevronRight size={16} />
                        <div className={`p-2 rounded-lg bg-gray-800/50 ${nextRank.color}`}>
                            {nextRank.icon}
                        </div>
                    </div>
                )}
            </div>

            {nextRank && (
                <>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-aura rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{currentAura.toLocaleString()} aura</span>
                        <span>{nextRank.minAura.toLocaleString()} to {nextRank.name}</span>
                    </div>
                </>
            )}
        </div>
    );
}

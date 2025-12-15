'use client';

import { useState } from 'react';
import { Sparkles, Lock, Check, Zap, Shield, Clock } from 'lucide-react';
import PowerUpsDisplay from '@/components/PowerUpsDisplay';

interface Reward {
    id: string;
    name: string;
    description: string;
    emoji: string;
    requirement: string;
    unlocked: boolean;
    claimed: boolean;
    auraValue?: number;
}

const AVAILABLE_REWARDS: Reward[] = [
    { id: '1', name: 'Weekly Champion', description: 'Complete all daily challenges this week', emoji: '🏆', requirement: '7/7 days', unlocked: true, claimed: false, auraValue: 1000 },
    { id: '2', name: 'Focus Master', description: 'Complete 10 focus sessions', emoji: '🧘', requirement: '10 sessions', unlocked: false, claimed: false, auraValue: 750 },
    { id: '3', name: 'Early Bird', description: 'Complete 5 tasks before 7 AM', emoji: '🌅', requirement: '3/5 tasks', unlocked: false, claimed: false, auraValue: 500 },
    { id: '4', name: 'Perfect Week', description: 'No skips for 7 days', emoji: '✨', requirement: '5/7 days', unlocked: false, claimed: false, auraValue: 2000 },
];

export default function RewardsPage() {
    const [rewards, setRewards] = useState<Reward[]>(AVAILABLE_REWARDS);

    const claimReward = (rewardId: string) => {
        setRewards(prev => prev.map(r =>
            r.id === rewardId ? { ...r, claimed: true } : r
        ));
    };

    return (
        <main className="min-h-screen bg-background p-4 pb-24">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Rewards</h1>
                        <p className="text-sm text-gray-400">Earn power-ups and bonuses</p>
                    </div>
                    <div className="text-4xl">🎁</div>
                </div>

                {/* Unclaimed Rewards Alert */}
                {rewards.some(r => r.unlocked && !r.claimed) && (
                    <div className="bg-aura/10 border border-aura/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <Sparkles className="text-aura" size={24} />
                        <div>
                            <p className="font-medium text-white">Rewards Available!</p>
                            <p className="text-sm text-gray-400">
                                {rewards.filter(r => r.unlocked && !r.claimed).length} reward(s) ready to claim
                            </p>
                        </div>
                    </div>
                )}

                {/* Available Rewards */}
                <div className="mb-8">
                    <h2 className="font-bold text-white mb-4">Earn Rewards</h2>
                    <div className="space-y-3">
                        {rewards.map((reward) => (
                            <div
                                key={reward.id}
                                className={`bg-surface rounded-xl p-4 border ${reward.unlocked
                                        ? 'border-aura/30'
                                        : 'border-gray-800 opacity-60'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{reward.emoji}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-white">{reward.name}</h3>
                                            {reward.claimed && (
                                                <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full">
                                                    Claimed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{reward.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">{reward.requirement}</span>
                                            {reward.auraValue && (
                                                <div className="flex items-center gap-1 text-aura text-sm">
                                                    <Zap size={12} />
                                                    +{reward.auraValue}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {reward.unlocked && !reward.claimed ? (
                                        <button
                                            onClick={() => claimReward(reward.id)}
                                            className="px-4 py-2 bg-aura text-black rounded-lg font-medium text-sm"
                                        >
                                            Claim
                                        </button>
                                    ) : !reward.unlocked ? (
                                        <Lock size={20} className="text-gray-500" />
                                    ) : (
                                        <Check size={20} className="text-success" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Power-Ups */}
                <PowerUpsDisplay />
            </div>
        </main>
    );
}

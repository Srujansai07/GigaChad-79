'use client';

import { useState, useEffect } from 'react';
import { Target, Clock, Zap, CheckCircle } from 'lucide-react';
import { DAILY_CHALLENGES, WEEKLY_CHALLENGES } from '@/lib/gamification';

interface Challenge {
    id: string;
    name: string;
    description: string;
    goal: { metric: string; value: number };
    reward: { aura: number };
    progress: number;
    completed: boolean;
}

export default function DailyChallenges() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

    useEffect(() => {
        // Mock challenges with progress
        const daily = DAILY_CHALLENGES.map((c, i) => ({
            id: `daily-${i}`,
            name: c.name || '',
            description: c.description || '',
            goal: c.goal || { metric: 'tasks', value: 1 },
            reward: c.reward || { aura: 100 },
            progress: Math.floor(Math.random() * (c.goal?.value || 3)),
            completed: false,
        }));

        const weekly = WEEKLY_CHALLENGES.map((c, i) => ({
            id: `weekly-${i}`,
            name: c.name || '',
            description: c.description || '',
            goal: c.goal || { metric: 'tasks', value: 10 },
            reward: c.reward || { aura: 500 },
            progress: Math.floor(Math.random() * ((c.goal?.value || 10) / 2)),
            completed: false,
        }));

        setChallenges(activeTab === 'daily' ? daily : weekly);
    }, [activeTab]);

    const getTimeRemaining = () => {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        const diff = endOfDay.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm ${activeTab === 'daily'
                            ? 'bg-primary text-white'
                            : 'bg-surface text-gray-400 border border-gray-700'
                        }`}
                >
                    Daily
                </button>
                <button
                    onClick={() => setActiveTab('weekly')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm ${activeTab === 'weekly'
                            ? 'bg-primary text-white'
                            : 'bg-surface text-gray-400 border border-gray-700'
                        }`}
                >
                    Weekly
                </button>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={14} />
                <span>Resets in {getTimeRemaining()}</span>
            </div>

            {/* Challenges */}
            <div className="space-y-3">
                {challenges.map((challenge) => {
                    const progressPercent = Math.min((challenge.progress / challenge.goal.value) * 100, 100);
                    const isComplete = challenge.progress >= challenge.goal.value;

                    return (
                        <div
                            key={challenge.id}
                            className={`p-4 rounded-xl border ${isComplete
                                    ? 'bg-success/10 border-success/30'
                                    : 'bg-surface border-gray-700'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${isComplete ? 'bg-success/20' : 'bg-gray-800'}`}>
                                    {isComplete ? (
                                        <CheckCircle size={20} className="text-success" />
                                    ) : (
                                        <Target size={20} className="text-primary" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-white">{challenge.name}</h4>
                                        <div className="flex items-center gap-1 text-aura text-sm">
                                            <Zap size={12} />
                                            +{challenge.reward.aura}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{challenge.description}</p>

                                    {/* Progress */}
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>{challenge.progress}/{challenge.goal.value}</span>
                                            <span>{Math.round(progressPercent)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${isComplete ? 'bg-success' : 'bg-primary'
                                                    }`}
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    {isComplete && (
                                        <button className="mt-3 w-full py-2 bg-success text-white rounded-lg text-sm font-medium">
                                            Claim Reward
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

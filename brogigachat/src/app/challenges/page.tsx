'use client';

import { useState, useEffect } from 'react';
import { Swords, Trophy, Clock, Users, Plus, Zap } from 'lucide-react';

interface Challenge {
    id: string;
    name: string;
    description: string;
    type: 'solo' | 'pvp' | 'squad';
    goal: number;
    progress: number;
    reward: number;
    endsAt: Date;
    participants?: number;
    opponent?: { name: string; progress: number };
}

const SAMPLE_CHALLENGES: Challenge[] = [
    {
        id: '1',
        name: 'Morning Warrior',
        description: 'Complete 5 tasks before 9 AM',
        type: 'solo',
        goal: 5,
        progress: 3,
        reward: 500,
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
        id: '2',
        name: 'Task Showdown',
        description: 'Beat your opponent in tasks completed',
        type: 'pvp',
        goal: 10,
        progress: 6,
        reward: 1000,
        endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        opponent: { name: 'AlphaGrinder', progress: 4 },
    },
    {
        id: '3',
        name: 'Squad Goals',
        description: 'Complete 50 tasks as a squad',
        type: 'squad',
        goal: 50,
        progress: 32,
        reward: 2500,
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: 5,
    },
];

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>(SAMPLE_CHALLENGES);
    const [filter, setFilter] = useState<'all' | 'solo' | 'pvp' | 'squad'>('all');

    const filteredChallenges = filter === 'all'
        ? challenges
        : challenges.filter(c => c.type === filter);

    const getTimeRemaining = (endsAt: Date) => {
        const diff = endsAt.getTime() - Date.now();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d remaining`;
        return `${hours}h remaining`;
    };

    return (
        <main className="min-h-screen bg-background p-4 pb-24">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Challenges</h1>
                        <p className="text-sm text-gray-400">Compete and earn extra aura</p>
                    </div>
                    <button className="p-3 bg-primary rounded-xl text-white">
                        <Plus size={20} />
                    </button>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {(['all', 'solo', 'pvp', 'squad'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === type
                                    ? 'bg-primary text-white'
                                    : 'bg-surface border border-gray-700 text-gray-400'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Challenges List */}
                <div className="space-y-4">
                    {filteredChallenges.map((challenge) => (
                        <div
                            key={challenge.id}
                            className="bg-surface rounded-xl p-4 border border-gray-800"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${challenge.type === 'solo' ? 'bg-blue-500/20 text-blue-400' :
                                            challenge.type === 'pvp' ? 'bg-red-500/20 text-red-400' :
                                                'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {challenge.type === 'solo' ? <Trophy size={20} /> :
                                            challenge.type === 'pvp' ? <Swords size={20} /> :
                                                <Users size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{challenge.name}</h3>
                                        <p className="text-sm text-gray-400">{challenge.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-aura">
                                    <Zap size={14} />
                                    <span className="font-bold">+{challenge.reward}</span>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="text-white">{challenge.progress}/{challenge.goal}</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Opponent for PvP */}
                            {challenge.type === 'pvp' && challenge.opponent && (
                                <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg mb-3">
                                    <div className="text-sm">
                                        <span className="text-gray-400">vs </span>
                                        <span className="text-white">{challenge.opponent.name}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {challenge.opponent.progress}/{challenge.goal}
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Clock size={14} />
                                    {getTimeRemaining(challenge.endsAt)}
                                </div>
                                {challenge.participants && (
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Users size={14} />
                                        {challenge.participants} members
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Swords, Trophy, Clock, Users, ChevronRight, Plus } from 'lucide-react';

interface Battle {
    id: string;
    type: 'pvp' | 'squad';
    opponent: {
        name: string;
        aura: number;
        avatar?: string;
    };
    goal: {
        metric: 'tasks' | 'aura' | 'streak';
        value: number;
    };
    myProgress: number;
    opponentProgress: number;
    startsAt: Date;
    endsAt: Date;
    stake: string;
}

const MOCK_BATTLES: Battle[] = [
    {
        id: '1',
        type: 'pvp',
        opponent: { name: 'SigmaFlow', aura: 12500 },
        goal: { metric: 'tasks', value: 10 },
        myProgress: 7,
        opponentProgress: 5,
        startsAt: new Date(Date.now() - 86400000),
        endsAt: new Date(Date.now() + 86400000 * 6),
        stake: 'Loser posts "I lost to [winner] in a discipline battle" on story',
    },
];

export default function ChallengeBattles() {
    const [battles, setBattles] = useState<Battle[]>(MOCK_BATTLES);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const getTimeRemaining = (endDate: Date): string => {
        const diff = endDate.getTime() - Date.now();
        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    const getProgressColor = (my: number, opponent: number): string => {
        if (my > opponent) return 'text-success';
        if (my < opponent) return 'text-danger';
        return 'text-aura';
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Swords size={20} className="text-danger" />
                    Battles
                </h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium"
                >
                    <Plus size={14} />
                    Challenge
                </button>
            </div>

            {/* Active Battles */}
            {battles.length === 0 ? (
                <div className="bg-surface rounded-xl p-6 border border-gray-800 text-center">
                    <Swords size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-white font-medium mb-2">No Active Battles</h3>
                    <p className="text-gray-500 text-sm">Challenge a friend to prove your discipline!</p>
                </div>
            ) : (
                battles.map((battle) => (
                    <div key={battle.id} className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
                        {/* Battle Header */}
                        <div className="p-4 border-b border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    {getTimeRemaining(battle.endsAt)}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-danger/20 text-danger rounded-full uppercase">
                                    {battle.type}
                                </span>
                            </div>

                            {/* VS Display */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                        ME
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">You</p>
                                        <p className={`text-2xl font-black ${getProgressColor(battle.myProgress, battle.opponentProgress)}`}>
                                            {battle.myProgress}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-gray-500 font-bold">VS</div>

                                <div className="flex items-center gap-2 text-right">
                                    <div>
                                        <p className="text-white font-medium">{battle.opponent.name}</p>
                                        <p className={`text-2xl font-black ${getProgressColor(battle.opponentProgress, battle.myProgress)}`}>
                                            {battle.opponentProgress}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
                                        {battle.opponent.name[0]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Goal & Progress */}
                        <div className="p-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-400">Goal: {battle.goal.value} {battle.goal.metric}</span>
                                <span className={getProgressColor(battle.myProgress, battle.opponentProgress)}>
                                    {battle.myProgress > battle.opponentProgress ? 'Winning! 🔥' :
                                        battle.myProgress < battle.opponentProgress ? 'Losing! 😤' : 'Tied! ⚔️'}
                                </span>
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-2">
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${(battle.myProgress / battle.goal.value) * 100}%` }}
                                    />
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gray-500 rounded-full transition-all"
                                        style={{ width: `${(battle.opponentProgress / battle.goal.value) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stake */}
                            <p className="text-xs text-gray-500 mt-3 italic">
                                🏆 Stake: {battle.stake}
                            </p>
                        </div>
                    </div>
                ))
            )}

            {/* Create Battle Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-sm w-full border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Swords size={20} className="text-danger" />
                            New Battle
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Challenge Username</label>
                                <input
                                    type="text"
                                    placeholder="@username"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Goal</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="10"
                                        className="w-20 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center"
                                    />
                                    <select className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white">
                                        <option value="tasks">Tasks completed</option>
                                        <option value="aura">Aura earned</option>
                                        <option value="streak">Days streak</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Duration</label>
                                <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white">
                                    <option value="3">3 days</option>
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                    <option value="30">30 days</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Stake (optional)</label>
                                <input
                                    type="text"
                                    placeholder="Loser posts on story..."
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 py-3 bg-gray-700 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 py-3 bg-danger text-white rounded-lg font-bold">
                                Send Challenge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Users, Crown, Plus, Copy, Check, Trophy, Flame } from 'lucide-react';

interface SquadMember {
    id: string;
    username: string;
    aura: number;
    streak: number;
    isLeader: boolean;
    isOnline: boolean;
}

interface Squad {
    id: string;
    name: string;
    code: string;
    totalAura: number;
    members: SquadMember[];
    rank: number;
}

// Mock data for now
const MOCK_SQUAD: Squad = {
    id: '1',
    name: 'Grind Squad',
    code: 'GRND420',
    totalAura: 45000,
    rank: 127,
    members: [
        { id: '1', username: 'GigaChad', aura: 15000, streak: 42, isLeader: true, isOnline: true },
        { id: '2', username: 'AlphaGrinder', aura: 12000, streak: 28, isLeader: false, isOnline: true },
        { id: '3', username: 'SigmaFlow', aura: 10000, streak: 21, isLeader: false, isOnline: false },
        { id: '4', username: 'HustleBro', aura: 8000, streak: 14, isLeader: false, isOnline: true },
    ],
};

export default function SquadView() {
    const [squad] = useState<Squad | null>(MOCK_SQUAD);
    const [copiedCode, setCopiedCode] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    const copyCode = async () => {
        if (squad?.code) {
            await navigator.clipboard.writeText(squad.code);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    if (!squad) {
        return (
            <div className="bg-surface rounded-xl p-6 border border-gray-800 text-center">
                <Users size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Squad Yet</h3>
                <p className="text-gray-400 text-sm mb-4">
                    Join or create a squad to compete together!
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600"
                    >
                        Join Squad
                    </button>
                    <button className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover">
                        Create Squad
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Squad Header */}
            <div className="bg-surface rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                            <Users size={24} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{squad.name}</h2>
                            <p className="text-gray-500 text-sm">{squad.members.length} members</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-aura font-bold">
                            <Trophy size={16} />
                            #{squad.rank}
                        </div>
                        <p className="text-gray-500 text-xs">Global Rank</p>
                    </div>
                </div>

                {/* Squad Code */}
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Invite Code:</span>
                    <code className="flex-1 text-white font-mono">{squad.code}</code>
                    <button onClick={copyCode} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        {copiedCode ? <Check size={16} className="text-success" /> : <Copy size={16} className="text-gray-400" />}
                    </button>
                </div>

                {/* Total Aura */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Squad Aura</span>
                        <span className="text-2xl font-bold text-aura">{squad.totalAura.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="bg-surface rounded-xl border border-gray-800">
                <div className="p-4 border-b border-gray-800">
                    <h3 className="font-medium text-white">Members</h3>
                </div>
                <div className="divide-y divide-gray-800">
                    {squad.members.sort((a, b) => b.aura - a.aura).map((member, index) => (
                        <div key={member.id} className="flex items-center gap-3 p-4">
                            {/* Rank */}
                            <span className={`w-6 text-center font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'
                                }`}>
                                {index + 1}
                            </span>

                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                                    {member.username[0].toUpperCase()}
                                </div>
                                {member.isOnline && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-surface" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-white">{member.username}</span>
                                    {member.isLeader && <Crown size={14} className="text-yellow-400" />}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Flame size={12} className="text-streak" />
                                    {member.streak} day streak
                                </div>
                            </div>

                            {/* Aura */}
                            <span className="text-aura font-bold">{member.aura.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <button className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                <Plus size={18} />
                Invite Members
            </button>

            {/* Join Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-surface rounded-xl p-6 max-w-sm w-full border border-gray-800">
                        <h2 className="text-xl font-bold text-white mb-4">Join Squad</h2>
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            placeholder="Enter invite code"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 font-mono text-center text-lg tracking-widest mb-4"
                            maxLength={8}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowJoinModal(false)}
                                className="flex-1 py-3 bg-gray-700 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={joinCode.length < 6}
                                className="flex-1 py-3 bg-primary text-white rounded-lg font-bold disabled:opacity-50"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

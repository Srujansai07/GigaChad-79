'use client';

import { useState } from 'react';
import { Users, Trophy, Copy, LogOut, Flame, Crown, Check } from 'lucide-react';
import { useSquadStore } from '@/stores/squadStore';
import { useUserStore } from '@/stores/userStore';
import BottomNav from '@/components/BottomNav';

export default function SquadDashboard() {
    const { squad, leaveSquad } = useSquadStore();
    const { user } = useUserStore();
    const [copied, setCopied] = useState(false);

    if (!squad) return null;

    const copyCode = () => {
        navigator.clipboard.writeText(squad.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLeave = async () => {
        if (confirm('Are you sure you want to leave this squad?')) {
            await leaveSquad();
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-white/5 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users className="text-primary" />
                            {squad.name}
                        </h1>
                        <p className="text-gray-400 text-sm">Squad Goal: {squad.weeklyGoal.toLocaleString()} Aura / week</p>
                    </div>
                    <button
                        onClick={handleLeave}
                        className="p-2 hover:bg-white/5 rounded-lg text-red-400"
                        title="Leave Squad"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Invite Code */}
                <div className="bg-background/50 rounded-lg p-3 flex items-center justify-between border border-white/5">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Invite Code</p>
                        <p className="font-mono text-xl font-bold text-white tracking-widest">{squad.code}</p>
                    </div>
                    <button
                        onClick={copyCode}
                        className="p-2 hover:bg-white/10 rounded-lg text-primary transition-colors"
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-aura mb-1">
                            <Trophy size={18} />
                            <span className="font-bold">Total Aura</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{squad.totalAura.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-success mb-1">
                            <Flame size={18} />
                            <span className="font-bold">Weekly</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{squad.weeklyProgress.toLocaleString()}</p>
                    </div>
                </div>

                {/* Members List */}
                <div>
                    <h2 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
                        <Users size={20} className="text-gray-400" />
                        Members ({squad.members.length})
                    </h2>
                    <div className="space-y-2">
                        {squad.members.map((member) => (
                            <div
                                key={member.id}
                                className={`flex items-center justify-between p-3 rounded-xl border ${member.id === user.id
                                        ? 'bg-primary/10 border-primary/30'
                                        : 'bg-surface border-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-surface-alt rounded-full flex items-center justify-center font-bold text-gray-300 relative">
                                        {member.username.charAt(0).toUpperCase()}
                                        {member.isLeader && (
                                            <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
                                                <Crown size={12} className="text-yellow-500 fill-yellow-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${member.id === user.id ? 'text-primary' : 'text-white'}`}>
                                            {member.username}
                                        </p>
                                        <p className="text-xs text-gray-400">Lvl {member.level}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-aura">{member.aura.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500">Aura</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomNav currentScreen="squads" />
        </div>
    );
}

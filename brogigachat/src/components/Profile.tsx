'use client';

import { Zap, Flame, Target, Shield, Award, RotateCcw } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useTaskStore } from '@/stores/taskStore';
import { getLevelInfo, BADGES } from '@/types';
import BottomNav from '@/components/BottomNav';

export default function Profile() {
    const { user, resetProgress } = useUserStore();
    const { tasks } = useTaskStore();

    const levelInfo = getLevelInfo(user?.aura || 0);
    const completedTasks = tasks.filter(t => t.completed).length;

    const handleReset = () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            resetProgress();
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/20 to-transparent p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-surface mx-auto flex items-center justify-center text-3xl font-bold text-white border-2 border-primary">
                    {user?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <h1 className="text-xl font-bold text-white mt-3">{user?.username || 'Guest'}</h1>
                <p className="text-primary text-sm">{levelInfo.title}</p>
            </div>

            {/* Stats */}
            <div className="p-4 grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-xl p-4 text-center">
                    <Zap className="mx-auto text-yellow-400" size={24} />
                    <p className="text-2xl font-bold text-white mt-2">{user?.aura || 0}</p>
                    <p className="text-xs text-gray-400">Aura</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                    <Flame className="mx-auto text-orange-400" size={24} />
                    <p className="text-2xl font-bold text-white mt-2">{user?.streak || 0}</p>
                    <p className="text-xs text-gray-400">Day Streak</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                    <Target className="mx-auto text-green-400" size={24} />
                    <p className="text-2xl font-bold text-white mt-2">{completedTasks}</p>
                    <p className="text-xs text-gray-400">Tasks Done</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                    <Shield className="mx-auto text-purple-400" size={24} />
                    <p className="text-2xl font-bold text-white mt-2">{user?.level || 1}</p>
                    <p className="text-xs text-gray-400">Level</p>
                </div>
            </div>

            {/* Badges */}
            <div className="p-4">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Award size={20} className="text-yellow-400" />
                    Badges
                </h2>
                <div className="grid grid-cols-4 gap-3">
                    {BADGES.map((badge) => {
                        const earned = user?.badges?.includes(badge.id);
                        return (
                            <div
                                key={badge.id}
                                className={`bg-surface rounded-xl p-3 text-center transition-all ${earned ? 'ring-2 ring-primary' : 'opacity-40'
                                    }`}
                            >
                                <span className="text-2xl">{badge.emoji}</span>
                                <p className="text-xs text-gray-400 mt-1">{badge.name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reset Button */}
            <div className="p-4">
                <button
                    onClick={handleReset}
                    className="w-full py-3 bg-surface border border-danger/30 rounded-lg text-danger flex items-center justify-center gap-2 hover:bg-danger/10 transition-colors"
                >
                    <RotateCcw size={18} />
                    Reset Progress
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                    This will delete all your data permanently.
                </p>
            </div>

            <BottomNav currentScreen="profile" />
        </div>
    );
}
